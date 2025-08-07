class ClientLoginApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('clientLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('clientPassword');
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
        const slug = document.getElementById('clientSlug').value.trim();
        const password = document.getElementById('clientPassword').value;
        const loginBtn = document.getElementById('loginBtn');

        this.clearErrors();

        if (!slug || !password) {
            this.showError('general', 'Slug e senha são obrigatórios');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.innerHTML = `
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Entrando...</span>
        `;

        try {
            const response = await fetch('/api/client-auth.php/login', {
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

            window.location.href = '/client/dashboard.php';

        } catch (error) {
            this.showError('general', error.message);
        } finally {
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
        const errorElements = ['slugError', 'passwordError', 'generalError'];
        errorElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ClientLoginApp();
});