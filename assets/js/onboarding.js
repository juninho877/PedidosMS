class OnboardingApp {
    constructor() {
        this.currentStep = 1;
        this.selectedPlan = null;
        this.companyData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Plan selection
        document.querySelectorAll('.plan-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectPlan(card.dataset.plan);
            });
        });

        // Step navigation
        document.getElementById('continueStep1').addEventListener('click', () => {
            this.goToStep(2);
        });

        document.getElementById('backStep2').addEventListener('click', () => {
            this.goToStep(1);
        });

        document.getElementById('continueStep2').addEventListener('click', () => {
            if (this.validateCompanyForm()) {
                this.goToStep(3);
            }
        });

        document.getElementById('backStep3').addEventListener('click', () => {
            this.goToStep(2);
        });

        // Company name to slug auto-generation
        document.getElementById('companyName').addEventListener('input', (e) => {
            const slug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            document.getElementById('companySlug').value = slug;
        });

        // PIX generation
        document.getElementById('generatePixBtn').addEventListener('click', () => {
            this.generatePix();
        });
    }

    selectPlan(plan) {
        this.selectedPlan = plan;
        
        // Update UI
        document.querySelectorAll('.plan-card').forEach(card => {
            card.classList.remove('ring-2', 'ring-blue-500');
        });
        
        document.querySelector(`[data-plan="${plan}"]`).classList.add('ring-2', 'ring-blue-500');
        
        // Enable continue button
        document.getElementById('continueStep1').disabled = false;
    }

    goToStep(step) {
        // Hide all steps
        for (let i = 1; i <= 3; i++) {
            document.getElementById(`step${i}`).classList.add('hidden');
            document.getElementById(`step${i}-indicator`).classList.remove('bg-blue-600', 'text-white');
            document.getElementById(`step${i}-indicator`).classList.add('bg-slate-700', 'text-slate-400');
        }

        // Show current step
        document.getElementById(`step${step}`).classList.remove('hidden');
        document.getElementById(`step${step}-indicator`).classList.remove('bg-slate-700', 'text-slate-400');
        document.getElementById(`step${step}-indicator`).classList.add('bg-blue-600', 'text-white');

        this.currentStep = step;

        // Special handling for step 3
        if (step === 3) {
            this.showPlanSummary();
        }
    }

    validateCompanyForm() {
        const name = document.getElementById('companyName').value.trim();
        const slug = document.getElementById('companySlug').value.trim();
        const email = document.getElementById('companyEmail').value.trim();

        if (!name || !slug || !email) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return false;
        }

        if (!/^[a-zA-Z0-9\-]+$/.test(slug)) {
            alert('O slug deve conter apenas letras, números e hífen.');
            return false;
        }

        // Store company data
        this.companyData = {
            name: name,
            slug: slug,
            site_name: document.getElementById('siteName').value.trim(),
            site_tagline: document.getElementById('siteTagline').value.trim(),
            site_description: document.getElementById('siteDescription').value.trim(),
            email: email,
            contact_whatsapp: document.getElementById('companyPhone').value.replace(/\D/g, ''),
            hero_title: 'Solicite seus Filmes e Séries favoritos',
            hero_subtitle: 'Sistema profissional de gerenciamento de solicitações',
            hero_description: document.getElementById('siteDescription').value.trim() || 'Pesquise, solicite e acompanhe suas preferências de entretenimento.'
        };

        return true;
    }

    showPlanSummary() {
        const plans = {
            starter: { name: 'Starter', price: 49.00, features: ['Até 100 solicitações/mês', 'Personalização básica', 'Suporte por email'] },
            professional: { name: 'Professional', price: 99.00, features: ['Até 500 solicitações/mês', 'Personalização completa', 'Suporte prioritário'] },
            enterprise: { name: 'Enterprise', price: 199.00, features: ['Solicitações ilimitadas', 'White-label completo', 'Suporte 24/7'] }
        };

        const plan = plans[this.selectedPlan];
        
        document.getElementById('selectedPlanSummary').innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-lg font-semibold text-white mb-2">Plano ${plan.name}</h3>
                    <p class="text-slate-400 mb-4">Para: ${this.companyData.name}</p>
                    <ul class="space-y-1">
                        ${plan.features.map(feature => `
                            <li class="flex items-center space-x-2 text-sm text-slate-300">
                                <i data-lucide="check" class="h-4 w-4 text-green-400"></i>
                                <span>${feature}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-white">R$ ${plan.price.toFixed(2)}</div>
                    <div class="text-slate-400">por mês</div>
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    async generatePix() {
        const generateBtn = document.getElementById('generatePixBtn');
        
        generateBtn.disabled = true;
        generateBtn.innerHTML = `
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
            Gerando PIX...
        `;

        try {
            const response = await fetch('/api/payments.php/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    plan: this.selectedPlan,
                    tenant_data: this.companyData
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao gerar PIX');
            }

            // Show PIX details
            this.showPixDetails(result);

        } catch (error) {
            alert('Erro ao gerar PIX: ' + error.message);
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Gerar PIX';
        }
    }

    showPixDetails(pixData) {
        const pixDetails = document.getElementById('pixDetails');
        const qrCodeContainer = document.getElementById('qrCodeContainer');
        const pixCodeInput = document.getElementById('pixCode');

        // Show QR Code if available
        if (pixData.qr_code_base64) {
            qrCodeContainer.innerHTML = `
                <img src="data:image/png;base64,${pixData.qr_code_base64}" alt="QR Code PIX" class="mx-auto max-w-xs" />
            `;
        }

        // Set PIX code
        if (pixData.qr_code) {
            pixCodeInput.value = pixData.qr_code;
        }

        pixDetails.classList.remove('hidden');

        // Start checking payment status
        this.checkPaymentStatus(pixData.payment_id);
    }

    async checkPaymentStatus(paymentId) {
        // This would check the payment status periodically
        // For now, we'll just show a message
        console.log('Checking payment status for:', paymentId);
        
        // In a real implementation, you would:
        // 1. Poll the payment status every few seconds
        // 2. When payment is confirmed, redirect to success page
        // 3. Create the tenant account automatically
    }
}

function copyPixCode() {
    const pixCode = document.getElementById('pixCode');
    pixCode.select();
    document.execCommand('copy');
    
    // Show feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Copiado!';
    button.classList.add('bg-green-600');
    button.classList.remove('bg-blue-600');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-600');
        button.classList.add('bg-blue-600');
    }, 2000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new OnboardingApp();
});