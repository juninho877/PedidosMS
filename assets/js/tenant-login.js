class TenantLoginApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Toggle password visibility
        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        const icon = toggleBtn.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.setAttribute('data-lucide', 'eye-off');
        } else {
            passwordInput.type = 'password';
            icon.setAttribute('data-lucide', 'eye');
        }

        lucide.createIcons();
    }

    async handleLogin() {
        const slug = document.getElementById('tenantSlug').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');

        // Clear previous errors
        this.clearErrors();

        // Basic validation
        if (!password) {
            this.showError('password', 'Senha é obrigatória');
            return;
        }

        // Disable button and show loading
        loginBtn.disabled = true;
        loginBtn.innerHTML = `
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Entrando...</span>
        `;

        try {
            const response = await fetch('/api/tenant/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slug, password })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro no login');
            }

            // Success - redirect to tenant dashboard
            window.location.href = `/${slug}/dashboard`;

        } catch (error) {
            this.showError('general', error.message);
        } finally {
            // Reset button
            loginBtn.disabled = false;
            loginBtn.innerHTML = `
                <i data-lucide="log-in" class="h-5 w-5"></i>
                <span>Entrar no Painel</span>
            `;
            lucide.createIcons();
        }
    }

    showError(field, message) {
        const errorElement = document.getElementById(field + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    clearErrors() {
        const errorElements = ['passwordError', 'generalError'];
        errorElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            }
        });
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TenantLoginApp();
});