<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar Conta - CineRequest SaaS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <a href="/" class="flex items-center space-x-3">
                    <i data-lucide="film" class="h-8 w-8 text-blue-400"></i>
                    <span class="text-xl font-bold text-white">CineRequest SaaS</span>
                </a>
                <a href="/" class="text-slate-300 hover:text-white transition-colors">
                    ← Voltar
                </a>
            </div>
        </div>
    </nav>

    <div class="min-h-screen bg-slate-900 py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Progress Steps -->
            <div class="mb-8">
                <div class="flex items-center justify-center space-x-4">
                    <div class="flex items-center">
                        <div id="step1-indicator" class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                            1
                        </div>
                        <span class="ml-2 text-sm text-white">Plano</span>
                    </div>
                    <div class="w-12 h-0.5 bg-slate-700"></div>
                    <div class="flex items-center">
                        <div id="step2-indicator" class="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-semibold">
                            2
                        </div>
                        <span class="ml-2 text-sm text-slate-400">Dados</span>
                    </div>
                    <div class="w-12 h-0.5 bg-slate-700"></div>
                    <div class="flex items-center">
                        <div id="step3-indicator" class="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-semibold">
                            3
                        </div>
                        <span class="ml-2 text-sm text-slate-400">Pagamento</span>
                    </div>
                </div>
            </div>

            <!-- Step 1: Plan Selection -->
            <div id="step1" class="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">Escolha seu Plano</h2>
                
                <div class="grid md:grid-cols-3 gap-6">
                    <!-- Starter Plan -->
                    <div class="plan-card border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors" data-plan="starter">
                        <h3 class="text-xl font-bold text-white mb-2">Starter</h3>
                        <p class="text-slate-400 mb-4">Perfeito para começar</p>
                        <div class="mb-6">
                            <span class="text-3xl font-bold text-white">R$ 49</span>
                            <span class="text-slate-400">/mês</span>
                        </div>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-center space-x-2">
                                <i data-lucide="check" class="h-4 w-4 text-green-400"></i>
                                <span class="text-slate-300 text-sm">Até 100 solicitações/mês</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <i data-lucide="check" class="h-4 w-4 text-green-400"></i>
                                <span class="text-slate-300 text-sm">Personalização básica</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <i data-lucide="check" class="h-4 w-4 text-green-400"></i>
                                <span class="text-slate-300 text-sm">Suporte por email</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Professional Plan -->
                    <div class="plan-card border-2 border-blue-500 rounded-xl p-6 cursor-pointer relative" data-plan="professional">
                        <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                Mais Popular
                            </span>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">Professional</h3>
                        <p class="text-slate-400 mb-4">Para negócios em crescimento</p>
                        <div class="mb-6">
                            <span class="text-3xl font-bold text-white">R$ 99</span>
                            <span class="text-slate-400">/mês</span>
                        </div>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-center space-x-2">
                                <i data-lucide="check" class="h-4 w-4 text-green-400"></i>
                                <span class="text-slate-300 text-sm">Até 500 solicitações/mês</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <i data-lucide="check" class="h-4 w-4 text-green-400"></i>
                                <span class="text-slate-300 text-sm">Personalização completa</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <i data-lucide="check" class="h-4 w-4 text-green-400"></i>
                                <span class="text-slate-300 text-sm">Suporte prioritário</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Enterprise Plan -->
                    <div class="plan-card border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors" data-plan="enterprise">
                        <h3 class="text-xl font-bold text-white mb-2">Enterprise</h3>
                        <p class="text-slate-400 mb-4">Para grandes operações</p>
                        <div class="mb-6">
                            <span class="text-3xl font-bold text-white">R$ 199</span>
                            <span class="text-slate-400">/mês</span>
                        </div>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-center space-x-2">
                                <i data-lucide="check" class="h-4 w-4 text-green-400"></i>
                                <span class="text-slate-300 text-sm">Solicitações ilimitadas</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <i data-lucide="check" class="h-4 w-4 text-green-400"></i>
                                <span class="text-slate-300 text-sm">White-label completo</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <i data-lucide="check" class="h-4 w-4 text-green-400"></i>
                                <span class="text-slate-300 text-sm">Suporte 24/7</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="text-center mt-8">
                    <button
                        id="continueStep1"
                        class="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        disabled
                    >
                        Continuar
                    </button>
                </div>
            </div>

            <!-- Step 2: Company Data -->
            <div id="step2" class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hidden">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">Dados da Empresa</h2>
                
                <form id="companyForm" class="space-y-6 max-w-2xl mx-auto">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                Nome da Empresa *
                                <span class="text-xs text-slate-500 block">Nome interno para identificação</span>
                            </label>
                            <input
                                type="text"
                                id="companyName"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Minha Empresa Ltda"
                                required
                            />
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                Slug da URL *
                                <span class="text-xs text-slate-500 block">Endereço único do site</span>
                            </label>
                            <div class="flex items-center">
                                <span class="text-slate-400 text-sm mr-2">site.com/</span>
                                <input
                                    type="text"
                                    id="companySlug"
                                    class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="minha-empresa"
                                    pattern="[a-zA-Z0-9\\-]+"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            Nome do Site *
                            <span class="text-xs text-slate-500 block">Nome que aparece no site público</span>
                        </label>
                        <input
                            type="text"
                            id="siteName"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="CineMania"
                            required
                        />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            Slogan/Tagline
                            <span class="text-xs text-slate-500 block">Frase de efeito do site</span>
                        </label>
                        <input
                            type="text"
                            id="siteTagline"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Seu entretenimento, nossa paixão"
                        />
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                Email *
                                <span class="text-xs text-slate-500 block">Email de contato da empresa</span>
                            </label>
                            <input
                                type="email"
                                id="companyEmail"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="contato@minhaempresa.com"
                                required
                            />
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                WhatsApp
                                <span class="text-xs text-slate-500 block">Formato: 5511999999999</span>
                            </label>
                            <input
                                type="text"
                                id="companyPhone"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="5511999999999"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            Descrição do Site
                            <span class="text-xs text-slate-500 block">Descrição principal na página inicial</span>
                        </label>
                        <textarea
                            id="siteDescription"
                            rows="3"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Encontre e solicite seus filmes e séries favoritos de forma rápida e fácil"
                        ></textarea>
                    </div>
                </form>

                <div class="flex justify-between mt-8">
                    <button
                        id="backStep2"
                        class="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Voltar
                    </button>
                    <button
                        id="continueStep2"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Continuar
                    </button>
                </div>
            </div>

            <!-- Step 3: Payment -->
            <div id="step3" class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hidden">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">Pagamento</h2>
                
                <div class="max-w-2xl mx-auto">
                    <div id="selectedPlanSummary" class="bg-slate-700/50 rounded-lg p-6 mb-8">
                        <!-- Plan summary will be populated by JavaScript -->
                    </div>
                    
                    <div id="pixPayment" class="text-center">
                        <div class="bg-slate-700/50 rounded-lg p-8">
                            <i data-lucide="qr-code" class="h-16 w-16 text-blue-400 mx-auto mb-4"></i>
                            <h3 class="text-xl font-semibold text-white mb-4">Pagamento via PIX</h3>
                            <p class="text-slate-400 mb-6">
                                Após clicar em "Gerar PIX", você receberá o QR Code e o código para pagamento.
                            </p>
                            
                            <button
                                id="generatePixBtn"
                                class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Gerar PIX
                            </button>
                        </div>
                        
                        <div id="pixDetails" class="hidden mt-8">
                            <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                                <h4 class="text-lg font-semibold text-white mb-4">PIX Gerado com Sucesso!</h4>
                                
                                <div id="qrCodeContainer" class="mb-6">
                                    <!-- QR Code will be displayed here -->
                                </div>
                                
                                <div class="bg-slate-700 rounded-lg p-4 mb-4">
                                    <p class="text-sm text-slate-300 mb-2">Código PIX (Copia e Cola):</p>
                                    <div class="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            id="pixCode"
                                            class="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                                            readonly
                                        />
                                        <button
                                            onclick="copyPixCode()"
                                            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                </div>
                                
                                <p class="text-sm text-slate-400">
                                    Após o pagamento, sua conta será ativada automaticamente em até 5 minutos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between mt-8">
                    <button
                        id="backStep3"
                        class="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/js/onboarding.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>