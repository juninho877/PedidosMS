class TenantSearchApp {
    constructor() {
        this.tenantSlug = window.TENANT_SLUG || '';
        this.tmdbImageBaseUrl = window.TMDB_IMAGE_BASE_URL || '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateYearOptions();
        this.showEmptyState();
    }

    setupEventListeners() {
        document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
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

            this.renderResults(data.results || []);

        } catch (error) {
            this.showError(error.message);
        }
    }

    showLoading() {
        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('searchResults').classList.add('hidden');
        document.getElementById('loadingState').classList.remove('hidden');
    }

    showEmptyState() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('searchResults').classList.add('hidden');
        document.getElementById('emptyState').classList.remove('hidden');
    }

    renderResults(results) {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('emptyState').classList.add('hidden');
        
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.classList.remove('hidden');

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="search" class="h-12 w-12 text-slate-500 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhum resultado encontrado</h3>
                    <p class="text-slate-500">Tente pesquisar com termos diferentes</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        resultsContainer.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                ${results.map(item => this.getItemHTML(item)).join('')}
            </div>
        `;

        lucide.createIcons();
    }

    getItemHTML(item) {
        const title = item.title || item.name;
        const date = item.release_date || item.first_air_date;
        const year = date ? new Date(date).getFullYear() : 'N/A';
        const type = item.title ? 'movie' : 'tv';
        const typeLabel = item.title ? 'Filme' : 'Série';
        const posterUrl = item.poster_path ? 
            `${this.tmdbImageBaseUrl}/w300${item.poster_path}` : 
            'https://via.placeholder.com/300x450/374151/ffffff?text=Sem+Poster';

        return `
            <a href="/${encodeURIComponent(this.tenantSlug)}/details?type=${encodeURIComponent(type)}&id=${encodeURIComponent(item.id)}" class="group">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-primary/50 hover:bg-slate-800/70 transition-all transform hover:scale-105">
                    <div class="aspect-[2/3] relative overflow-hidden">
                        <img
                            src="${posterUrl}"
                            alt="${title}"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onerror="this.src='https://via.placeholder.com/300x450/374151/ffffff?text=Sem+Poster'"
                        />
                        <div class="absolute top-2 left-2">
                            <div class="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/80 text-white">
                                <i data-lucide="${type === 'movie' ? 'film' : 'tv'}" class="h-3 w-3"></i>
                                <span>${typeLabel}</span>
                            </div>
                        </div>
                        <div class="absolute top-2 right-2">
                            <div class="flex items-center space-x-1 bg-black/70 px-2 py-1 rounded-full text-xs text-white">
                                <i data-lucide="star" class="h-3 w-3 text-yellow-400"></i>
                                <span>${item.vote_average.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                            ${title}
                        </h3>
                        <div class="flex items-center space-x-1 text-sm text-slate-400">
                            <i data-lucide="calendar" class="h-4 w-4"></i>
                            <span>${year}</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    showError(message) {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('searchResults').innerHTML = `
            <div class="text-center py-12">
                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                    <p class="text-red-400 font-medium">${message}</p>
                </div>
            </div>
        `;
        document.getElementById('searchResults').classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TenantSearchApp();
});