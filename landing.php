<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CineRequest SaaS - Sistema de Solicitação de Filmes e Séries</title>
    <meta name="description" content="Transforme seu negócio de entretenimento com nossa plataforma SaaS completa para gerenciamento de solicitações de filmes e séries.">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <i data-lucide="film" class="h-8 w-8 text-blue-400"></i>
                    <span class="text-xl font-bold text-white">CineRequest SaaS</span>
                </div>

                <!-- Desktop menu -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#features" class="text-slate-300 hover:text-white transition-colors">Recursos</a>
                    <a href="#pricing" class="text-slate-300 hover:text-white transition-colors">Preços</a>
                    <a href="#demo" class="text-slate-300 hover:text-white transition-colors">Demo</a>
                    <a href="#contact" class="text-slate-300 hover:text-white transition-colors">Contato</a>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                        Começar Grátis
                    </button>
                </div>

                <!-- Mobile menu button -->
                <div class="md:hidden">
                    <button id="mobile-menu-btn" class="text-slate-300 hover:text-white p-2">
                        <i data-lucide="menu" class="h-6 w-6"></i>
                    </button>
                </div>
            </div>

            <!-- Mobile menu -->
            <div id="mobile-menu" class="md:hidden hidden border-t border-slate-700 py-4">
                <div class="space-y-2">
                    <a href="#features" class="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg">Recursos</a>
                    <a href="#pricing" class="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg">Preços</a>
                    <a href="#demo" class="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg">Demo</a>
                    <a href="#contact" class="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg">Contato</a>
                    <button class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                        Começar Grátis
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-red-600/20"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <div class="text-center">
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Transforme seu Negócio de
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Entretenimento
                    </span>
                </h1>
                <p class="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                    Plataforma SaaS completa para gerenciamento de solicitações de filmes e séries. 
                    Personalize sua marca, gerencie clientes e aumente suas vendas.
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                        Começar Teste Grátis
                    </button>
                    <button class="border border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                        Ver Demonstração
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-slate-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
                    Recursos Poderosos para seu Negócio
                </h2>
                <p class="text-xl text-slate-400 max-w-2xl mx-auto">
                    Tudo que você precisa para gerenciar solicitações de conteúdo audiovisual de forma profissional
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Feature 1 -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all group">
                    <div class="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="palette" class="h-8 w-8 text-white"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-4">Personalização Completa</h3>
                    <p class="text-slate-400">
                        Cada cliente tem sua própria URL personalizada, logo, favicon e textos customizados. 
                        Sua marca, suas regras.
                    </p>
                </div>

                <!-- Feature 2 -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-purple-500/50 transition-all group">
                    <div class="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="database" class="h-8 w-8 text-white"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-4">Integração TMDB</h3>
                    <p class="text-slate-400">
                        Base de dados completa com milhares de filmes e séries, informações detalhadas, 
                        trailers e imagens de alta qualidade.
                    </p>
                </div>

                <!-- Feature 3 -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-green-500/50 transition-all group">
                    <div class="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="shield-check" class="h-8 w-8 text-white"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-4">Segurança Avançada</h3>
                    <p class="text-slate-400">
                        Isolamento completo de dados entre clientes, autenticação JWT, 
                        proteção contra ataques e backups automáticos.
                    </p>
                </div>

                <!-- Feature 4 -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-red-500/50 transition-all group">
                    <div class="bg-red-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="smartphone" class="h-8 w-8 text-white"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-4">100% Responsivo</h3>
                    <p class="text-slate-400">
                        Interface otimizada para desktop, tablet e mobile. 
                        Seus clientes podem fazer solicitações de qualquer dispositivo.
                    </p>
                </div>

                <!-- Feature 5 -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-yellow-500/50 transition-all group">
                    <div class="bg-yellow-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="bar-chart-3" class="h-8 w-8 text-white"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-4">Dashboard Completo</h3>
                    <p class="text-slate-400">
                        Painel administrativo com estatísticas em tempo real, 
                        gerenciamento de solicitações e comunicação direta via WhatsApp.
                    </p>
                </div>

                <!-- Feature 6 -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-indigo-500/50 transition-all group">
                    <div class="bg-indigo-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="zap" class="h-8 w-8 text-white"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-4">Deploy Instantâneo</h3>
                    <p class="text-slate-400">
                        Configure sua instância em minutos. Sem complicações técnicas, 
                        sem configurações complexas. Foque no seu negócio.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
                    Planos que Crescem com seu Negócio
                </h2>
                <p class="text-xl text-slate-400 max-w-2xl mx-auto">
                    Escolha o plano ideal para o tamanho do seu negócio. Sem taxas ocultas, sem surpresas.
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <!-- Starter Plan -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 relative">
                    <h3 class="text-2xl font-bold text-white mb-2">Starter</h3>
                    <p class="text-slate-400 mb-6">Perfeito para começar</p>
                    <div class="mb-6">
                        <span class="text-4xl font-bold text-white">R$ 49</span>
                        <span class="text-slate-400">/mês</span>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Até 100 solicitações/mês</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Personalização básica</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Suporte por email</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">SSL incluído</span>
                        </li>
                    </ul>
                    <button class="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors">
                        Começar Grátis
                    </button>
                </div>

                <!-- Professional Plan -->
                <div class="bg-slate-800/50 border-2 border-blue-500 rounded-xl p-8 relative">
                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                            Mais Popular
                        </span>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-2">Professional</h3>
                    <p class="text-slate-400 mb-6">Para negócios em crescimento</p>
                    <div class="mb-6">
                        <span class="text-4xl font-bold text-white">R$ 99</span>
                        <span class="text-slate-400">/mês</span>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Até 500 solicitações/mês</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Personalização completa</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Suporte prioritário</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Analytics avançado</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Backup automático</span>
                        </li>
                    </ul>
                    <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                        Começar Teste
                    </button>
                </div>

                <!-- Enterprise Plan -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 relative">
                    <h3 class="text-2xl font-bold text-white mb-2">Enterprise</h3>
                    <p class="text-slate-400 mb-6">Para grandes operações</p>
                    <div class="mb-6">
                        <span class="text-4xl font-bold text-white">R$ 199</span>
                        <span class="text-slate-400">/mês</span>
                    </div>
                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Solicitações ilimitadas</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">White-label completo</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Suporte 24/7</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">API personalizada</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-400"></i>
                            <span class="text-slate-300">Gerente dedicado</span>
                        </li>
                    </ul>
                    <button class="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors">
                        Falar com Vendas
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Demo Section -->
    <section id="demo" class="py-20 bg-slate-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
                    Veja o CineRequest em Ação
                </h2>
                <p class="text-xl text-slate-400 max-w-2xl mx-auto">
                    Experimente nossa demo interativa e veja como é fácil gerenciar solicitações de conteúdo
                </p>
            </div>

            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <div class="space-y-6">
                    <div class="flex items-start space-x-4">
                        <div class="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span class="text-white font-semibold text-sm">1</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-white mb-2">Interface Intuitiva</h3>
                            <p class="text-slate-400">
                                Seus clientes podem pesquisar e solicitar filmes e séries de forma simples e rápida.
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4">
                        <div class="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span class="text-white font-semibold text-sm">2</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-white mb-2">Gestão Centralizada</h3>
                            <p class="text-slate-400">
                                Aprove, negue e gerencie todas as solicitações em um painel administrativo completo.
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4">
                        <div class="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span class="text-white font-semibold text-sm">3</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-white mb-2">Comunicação Direta</h3>
                            <p class="text-slate-400">
                                Contate seus clientes diretamente via WhatsApp para atualizações e suporte.
                            </p>
                        </div>
                    </div>

                    <div class="pt-4">
                        <a href="demo" class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                            <i data-lucide="play" class="h-5 w-5"></i>
                            <span>Testar Demo Agora</span>
                        </a>
                    </div>
                </div>

                <div class="bg-slate-800 border border-slate-700 rounded-xl p-8">
                    <div class="bg-slate-900 rounded-lg p-6 mb-6">
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div class="space-y-3">
                            <div class="h-4 bg-slate-700 rounded w-3/4"></div>
                            <div class="h-4 bg-slate-700 rounded w-1/2"></div>
                            <div class="h-4 bg-slate-700 rounded w-5/6"></div>
                        </div>
                    </div>
                    <p class="text-slate-400 text-center">
                        Interface real do sistema em funcionamento
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
                    Pronto para Começar?
                </h2>
                <p class="text-xl text-slate-400">
                    Entre em contato conosco e transforme seu negócio hoje mesmo
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-12">
                <div class="space-y-8">
                    <div class="flex items-start space-x-4">
                        <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i data-lucide="mail" class="h-6 w-6 text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-2">Email</h3>
                            <p class="text-slate-400">contato@cinerequest.com</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4">
                        <div class="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i data-lucide="phone" class="h-6 w-6 text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-2">WhatsApp</h3>
                            <p class="text-slate-400">+55 11 99999-9999</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4">
                        <div class="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i data-lucide="clock" class="h-6 w-6 text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-2">Horário de Atendimento</h3>
                            <p class="text-slate-400">Segunda a Sexta, 9h às 18h</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
                    <form class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Nome</label>
                            <input
                                type="text"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Seu nome completo"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input
                                type="email"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="seu@email.com"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Mensagem</label>
                            <textarea
                                rows="4"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Como podemos ajudar você?"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            Enviar Mensagem
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-800 border-t border-slate-700 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
                <div class="md:col-span-2">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="film" class="h-8 w-8 text-blue-400"></i>
                        <span class="text-xl font-bold text-white">CineRequest SaaS</span>
                    </div>
                    <p class="text-slate-400 mb-4">
                        A plataforma SaaS mais completa para gerenciamento de solicitações de filmes e séries. 
                        Transforme seu negócio de entretenimento hoje mesmo.
                    </p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-slate-400 hover:text-white transition-colors">
                            <i data-lucide="facebook" class="h-5 w-5"></i>
                        </a>
                        <a href="#" class="text-slate-400 hover:text-white transition-colors">
                            <i data-lucide="twitter" class="h-5 w-5"></i>
                        </a>
                        <a href="#" class="text-slate-400 hover:text-white transition-colors">
                            <i data-lucide="instagram" class="h-5 w-5"></i>
                        </a>
                        <a href="#" class="text-slate-400 hover:text-white transition-colors">
                            <i data-lucide="linkedin" class="h-5 w-5"></i>
                        </a>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold text-white mb-4">Produto</h3>
                    <ul class="space-y-2">
                        <li><a href="#features" class="text-slate-400 hover:text-white transition-colors">Recursos</a></li>
                        <li><a href="#pricing" class="text-slate-400 hover:text-white transition-colors">Preços</a></li>
                        <li><a href="#demo" class="text-slate-400 hover:text-white transition-colors">Demo</a></li>
                        <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Documentação</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold text-white mb-4">Suporte</h3>
                    <ul class="space-y-2">
                        <li><a href="#contact" class="text-slate-400 hover:text-white transition-colors">Contato</a></li>
                        <li><a href="#" class="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
                        <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Tutoriais</a></li>
                        <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Status</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-slate-700 mt-8 pt-8 text-center">
                <p class="text-slate-400">
                    © 2024 CineRequest SaaS. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </footer>

    <script>
        // Mobile menu toggle
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            const icon = this.querySelector('i');
            
            menu.classList.toggle('hidden');
            
            if (menu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            
            lucide.createIcons();
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        lucide.createIcons();
    </script>
</body>
</html>