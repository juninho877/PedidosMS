class SearchApp {
    constructor() {
        this.currentView = 'grid';
        this.hasSearched = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateYearOptions();
        this.showEmptyState();
    }

    setupEventListeners() {
        // Search form
        document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });

        // Toggle filters
        document.getElementById('toggleFilters').addEventListener('click', () => {
            this.toggleFilters();
        });

        // View mode buttons
        document.getElementById('gridView').addEventListener('click', () => {
            this.setViewMode('grid');
        });

        document.getElementById('listView').addEventListener('click', () => {
            this.setViewMode('list');
        });
    }

    populateYearOptions() {
        const yearSelect = document.getElementById('releaseYear');
        const currentYear = new Date().getFullYear();
        
        for (let year = currentYear; year >= currentYear - 50; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    toggleFilters() {
        const filtersSection = document.getElementById('filtersSection');
        filtersSection.classList.toggle('hidden');
    }

    setViewMode(mode) {
        this.currentView = mode;
        
        // Update button states
        const gridBtn = document.getElementById('gridView');
        const listBtn = document.getElementById('listView');
        
        if (mode === 'grid') {
            gridBtn.className = 'p-2 sm:p-3 rounded-lg transition-colors bg-blue-600 text-white';
            listBtn.className = 'p-2 sm:p-3 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-slate-700';
        } else {
            listBtn.className = 'p-2 sm:p-3 rounded-lg transition-colors bg-blue-600 text-white';
            gridBtn.className = 'p-2 sm:p-3 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-slate-700';
        }

        // Re-render results if we have them
        if (this.hasSearched && this.lastResults) {
            this.renderResults(this.lastResults);
        }
    }

    async performSearch() {
        const query = document.getElementById('searchQuery').value.trim();
        const type = document.getElementById('contentType').value;
        const year = document.getElementById('releaseYear').value;

        if (!query) return;

        this.showLoading();
        
        try {
            const params = new URLSearchParams({
                query: query,
                type: type,
                ...(year && { year: year })
            });

            const response = await fetch(`/api/tmdb.php/search?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na busca');
            }

            this.lastResults = data.results || [];
            this.hasSearched = true;
            this.renderResults(this.lastResults);
            this.showViewControls();

        } catch (error) {
            this.showError(error.message);
        }
    }

    showLoading() {
        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('searchResults').classList.add('hidden');
        document.getElementById('viewControls').classList.add('hidden');
        document.getElementById('loadingState').classList.remove('hidden');
    }

    showEmptyState() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('searchResults').classList.add('hidden');
        document.getElementById('viewControls').classList.add('hidden');
        document.getElementById('emptyState').classList.remove('hidden');
    }

    showViewControls() {
        document.getElementById('viewControls').classList.remove('hidden');
        const count = this.lastResults ? this.lastResults.length : 0;
        document.getElementById('resultsCount').textContent = 
            count > 0 ? `${count} resultado(s) encontrado(s)` : 'Nenhum resultado encontrado';
    }

    renderResults(results) {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('emptyState').classList.add('hidden');
        
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.classList.remove('hidden');

        if (results.length === 0) {
            resultsContainer.innerHTML = this.getNoResultsHTML();
            return;
        }

        if (this.currentView === 'grid') {
            resultsContainer.innerHTML = this.getGridHTML(results);
        } else {
            resultsContainer.innerHTML = this.getListHTML(results);
        }

        // Re-initialize Lucide icons
        lucide.createIcons();
    }

    getGridHTML(results) {
        return `
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                ${results.map(item => this.getGridItemHTML(item)).join('')}
            </div>
        `;
    }

    getListHTML(results) {
        return `
            <div class="space-y-4">
                ${results.map(item => this.getListItemHTML(item)).join('')}
            </div>
        `;
    }

    getGridItemHTML(item) {
        const title = item.title || item.name;
        const date = item.release_date || item.first_air_date;
        const year = date ? new Date(date).getFullYear() : 'N/A';
        const type = item.title ? 'movie' : 'tv';
        const typeLabel = item.title ? 'Filme' : 'Série';
        const posterUrl = item.poster_path ? 
            `https://image.tmdb.org/t/p/w300${item.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        // Check if we're in a tenant context
        const tenantSlug = window.TENANT_SLUG;
        const detailsUrl = tenantSlug ? 
            `/${tenantSlug}/details?type=${type}&id=${item.id}` : 
            `details.php?type=${type}&id=${item.id}`;

        return `
            <a href="${detailsUrl}" class="group">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500/50 hover:bg-slate-800/70 transition-all transform hover:scale-105">
                    <div class="aspect-[2/3] relative overflow-hidden">
                        <img
                            src="${posterUrl}"
                            alt="${title}"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onerror="this.src='/assets/images/placeholder-poster.jpg'"
                        />
                        <div class="absolute top-2 left-2">
                            <div class="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                type === 'movie' ? 'bg-blue-600/80 text-white' : 'bg-purple-600/80 text-white'
                            }">
                                <i data-lucide="${type === 'movie' ? 'film' : 'tv'}" class="h-3 w-3"></i>
                                <span class="hidden sm:inline">${typeLabel}</span>
                            </div>
                        </div>
                        <div class="absolute top-2 right-2">
                            <div class="flex items-center space-x-1 bg-black/70 px-2 py-1 rounded-full text-xs text-white">
                                <i data-lucide="star" class="h-3 w-3 text-yellow-400"></i>
                                <span>${item.vote_average.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 sm:p-4">
                        <h3 class="text-sm sm:text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                            ${title}
                        </h3>
                        <div class="flex items-center space-x-1 text-xs sm:text-sm text-slate-400">
                            <i data-lucide="calendar" class="h-4 w-4"></i>
                            <span>${year}</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    getListItemHTML(item) {
        const title = item.title || item.name;
        const date = item.release_date || item.first_air_date;
        const year = date ? new Date(date).getFullYear() : 'N/A';
        const type = item.title ? 'movie' : 'tv';
        const typeLabel = item.title ? 'Filme' : 'Série';
        const posterUrl = item.poster_path ? 
            `https://image.tmdb.org/t/p/w200${item.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        // Check if we're in a tenant context
        const tenantSlug = window.TENANT_SLUG;
        const detailsUrl = tenantSlug ? 
            `/${tenantSlug}/details?type=${type}&id=${item.id}` : 
            `details.php?type=${type}&id=${item.id}`;

        return `
            <a href="${detailsUrl}" class="block bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all group">
                <div class="flex gap-3 sm:gap-4">
                    <div class="flex-shrink-0">
                        <img
                            src="${posterUrl}"
                            alt="${title}"
                            class="w-12 h-18 sm:w-16 sm:h-24 object-cover rounded-lg"
                            onerror="this.src='/assets/images/placeholder-poster.jpg'"
                        />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 class="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                    ${title}
                                </h3>
                                <div class="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-slate-400">
                                    <div class="flex items-center space-x-1">
                                        <i data-lucide="${type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                        <span>${typeLabel}</span>
                                    </div>
                                    <div class="flex items-center space-x-1">
                                        <i data-lucide="calendar" class="h-4 w-4"></i>
                                        <span>${year}</span>
                                    </div>
                                    <div class="flex items-center space-x-1">
                                        <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                        <span>${item.vote_average.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ${item.overview ? `
                            <p class="text-slate-400 mt-2 sm:mt-3 line-clamp-2 text-sm sm:text-base hidden sm:block">
                                ${item.overview}
                            </p>
                        ` : ''}
                    </div>
                </div>
            </a>
        `;
    }

    getNoResultsHTML() {
        return `
            <div class="text-center py-8 sm:py-12">
                <div class="bg-slate-800/50 rounded-lg p-8 max-w-md mx-auto">
                    <i data-lucide="search" class="h-10 w-10 sm:h-12 sm:w-12 text-slate-500 mx-auto mb-4"></i>
                    <h3 class="text-base sm:text-lg font-medium text-slate-300 mb-2">
                        Nenhum resultado encontrado
                    </h3>
                    <p class="text-sm sm:text-base text-slate-500 px-4">
                        Tente pesquisar com termos diferentes ou verifique a ortografia
                    </p>
                </div>
            </div>
        `;
    }

    showError(message) {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('searchResults').innerHTML = `
            <div class="text-center py-8 sm:py-12">
                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                    <p class="text-sm sm:text-base text-red-400 font-medium px-4">${message}</p>
                </div>
            </div>
        `;
        document.getElementById('searchResults').classList.remove('hidden');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new SearchApp();
});