class TenantCustomizeApp {
    constructor() {
        this.tenantSlug = window.TENANT_SLUG;
        this.tenantData = window.TENANT_DATA;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCurrentData();
        this.setupFileUploads();
        this.setupColorPickers();
        this.setupPreview();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('customizeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSave();
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            window.open(`/${this.tenantSlug}`, '_blank');
        });

        // Success modal
        document.getElementById('closeSuccessModal').addEventListener('click', () => {
            document.getElementById('successModal').classList.add('hidden');
        });

        // Real-time preview updates
        ['hero_title', 'hero_subtitle', 'hero_description'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.updatePreview();
            });
        });
    }

    loadCurrentData() {
        // Load current tenant data into form
        if (this.tenantData.hero_title) {
            document.getElementById('hero_title').value = this.tenantData.hero_title;
        }
        if (this.tenantData.hero_subtitle) {
            document.getElementById('hero_subtitle').value = this.tenantData.hero_subtitle;
        }
        if (this.tenantData.hero_description) {
            document.getElementById('hero_description').value = this.tenantData.hero_description;
        }
        if (this.tenantData.primary_color) {
            document.getElementById('primary_color').value = this.tenantData.primary_color;
            document.getElementById('primary_color_text').value = this.tenantData.primary_color;
        }
        if (this.tenantData.secondary_color) {
            document.getElementById('secondary_color').value = this.tenantData.secondary_color;
            document.getElementById('secondary_color_text').value = this.tenantData.secondary_color;
        }

        // Load existing images
        if (this.tenantData.logo_url) {
            this.showImagePreview('logo', this.tenantData.logo_url);
        }
        if (this.tenantData.favicon_url) {
            this.showImagePreview('favicon', this.tenantData.favicon_url);
        }

        this.updatePreview();
    }

    setupFileUploads() {
        // Logo upload
        this.setupFileUpload('logo');
        // Favicon upload
        this.setupFileUpload('favicon');
    }

    setupFileUpload(type) {
        const dropZone = document.getElementById(`${type}-drop-zone`);
        const fileInput = document.getElementById(`${type}_file`);
        const removeBtn = document.getElementById(`remove-${type}`);

        // Click to upload
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-primary');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-primary');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-primary');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(type, files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(type, e.target.files[0]);
            }
        });

        // Remove button
        removeBtn.addEventListener('click', () => {
            this.removeImage(type);
        });
    }

    handleFileSelect(type, file) {
        // Validate file
        if (!this.validateFile(type, file)) {
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showImagePreview(type, e.target.result);
        };
        reader.readAsDataURL(file);
    }

    validateFile(type, file) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        
        if (type === 'favicon') {
            allowedTypes.push('image/x-icon', 'image/vnd.microsoft.icon');
        }

        if (file.size > maxSize) {
            this.showToast('Arquivo muito grande. Máximo 2MB.', 'error');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            this.showToast('Tipo de arquivo não suportado.', 'error');
            return false;
        }

        return true;
    }

    showImagePreview(type, src) {
        const placeholder = document.getElementById(`${type}-placeholder`);
        const preview = document.getElementById(`${type}-preview`);
        const removeBtn = document.getElementById(`remove-${type}`);

        placeholder.classList.add('hidden');
        preview.src = src;
        preview.classList.remove('hidden');
        removeBtn.classList.remove('hidden');
    }

    removeImage(type) {
        const placeholder = document.getElementById(`${type}-placeholder`);
        const preview = document.getElementById(`${type}-preview`);
        const removeBtn = document.getElementById(`remove-${type}`);
        const fileInput = document.getElementById(`${type}_file`);

        placeholder.classList.remove('hidden');
        preview.classList.add('hidden');
        removeBtn.classList.add('hidden');
        fileInput.value = '';
    }

    setupColorPickers() {
        // Primary color
        const primaryColor = document.getElementById('primary_color');
        const primaryColorText = document.getElementById('primary_color_text');

        primaryColor.addEventListener('change', (e) => {
            primaryColorText.value = e.target.value;
            this.updatePreview();
        });

        primaryColorText.addEventListener('input', (e) => {
            if (this.isValidHexColor(e.target.value)) {
                primaryColor.value = e.target.value;
                this.updatePreview();
            }
        });

        // Secondary color
        const secondaryColor = document.getElementById('secondary_color');
        const secondaryColorText = document.getElementById('secondary_color_text');

        secondaryColor.addEventListener('change', (e) => {
            secondaryColorText.value = e.target.value;
            this.updatePreview();
        });

        secondaryColorText.addEventListener('input', (e) => {
            if (this.isValidHexColor(e.target.value)) {
                secondaryColor.value = e.target.value;
                this.updatePreview();
            }
        });
    }

    isValidHexColor(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    setupPreview() {
        this.updatePreview();
    }

    updatePreview() {
        const title = document.getElementById('hero_title').value || 'Solicite seus Filmes e Séries favoritos';
        const description = document.getElementById('hero_description').value || 'Sistema profissional de gerenciamento de solicitações de conteúdo audiovisual.';
        const primaryColor = document.getElementById('primary_color').value || '#3B82F6';

        document.getElementById('preview-title').textContent = title;
        document.getElementById('preview-description').textContent = description;
        document.getElementById('preview-button').style.backgroundColor = primaryColor;

        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', primaryColor);
    }

    async handleSave() {
        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.innerHTML;

        // Disable button and show loading
        saveBtn.disabled = true;
        saveBtn.innerHTML = `
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Salvando...</span>
        `;

        try {
            const formData = new FormData();
            
            // Add text fields
            formData.append('hero_title', document.getElementById('hero_title').value);
            formData.append('hero_subtitle', document.getElementById('hero_subtitle').value);
            formData.append('hero_description', document.getElementById('hero_description').value);
            formData.append('primary_color', document.getElementById('primary_color').value);
            formData.append('secondary_color', document.getElementById('secondary_color').value);

            // Add files if selected
            const logoFile = document.getElementById('logo_file').files[0];
            const faviconFile = document.getElementById('favicon_file').files[0];

            if (logoFile) {
                formData.append('logo_file', logoFile);
            }
            if (faviconFile) {
                formData.append('favicon_file', faviconFile);
            }

            const response = await fetch('/api/tenant.php/update', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao salvar alterações');
            }

            // Show success modal
            document.getElementById('successModal').classList.remove('hidden');

            // Update tenant data
            this.tenantData = { ...this.tenantData, ...result.tenant };

        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            // Reset button
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
            lucide.createIcons();
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TenantCustomizeApp();
});