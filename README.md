# CineRequest SaaS - Modern Architecture

Sistema SaaS moderno para gerenciamento de solicitações de filmes e séries com integração TMDB.

## 🏗️ **Arquitetura Moderna**

### **📁 Estrutura de Pastas**
```
├── app/                          # Código da aplicação
│   ├── Core/                     # Classes fundamentais
│   │   ├── Application.php       # Bootstrap da aplicação
│   │   ├── Router.php           # Sistema de roteamento
│   │   ├── Database.php         # Gerenciador de banco
│   │   ├── Config.php           # Configurações
│   │   ├── Request.php          # Manipulação de requisições
│   │   └── Response.php         # Manipulação de respostas
│   ├── Models/                   # Modelos de dados
│   │   ├── BaseModel.php        # Modelo base com ORM simples
│   │   ├── User.php             # Usuários administrativos
│   │   ├── Tenant.php           # Clientes SaaS
│   │   └── ContentRequest.php   # Solicitações de conteúdo
│   ├── Controllers/              # Controladores
│   │   ├── BaseController.php   # Controlador base
│   │   ├── Api/                 # APIs REST
│   │   └── Web/                 # Páginas web
│   ├── Services/                 # Serviços de negócio
│   │   ├── TMDBService.php      # Integração TMDB
│   │   └── AuthService.php      # Autenticação JWT
│   └── Middleware/               # Middlewares
│       ├── AuthMiddleware.php   # Autenticação admin
│       ├── ClientAuthMiddleware.php # Autenticação cliente
│       └── CorsMiddleware.php   # CORS
├── config/                       # Configurações
│   └── app.php                  # Configuração principal
├── routes/                       # Definição de rotas
│   ├── web.php                  # Rotas web
│   ├── api.php                  # Rotas API
│   ├── admin.php                # Rotas admin
│   ├── client.php               # Rotas cliente
│   └── tenant.php               # Rotas tenant
├── resources/                    # Recursos
│   └── views/                   # Templates PHP
├── bootstrap/                    # Bootstrap da aplicação
│   └── app.php                  # Inicialização
├── public/                       # Arquivos públicos
│   └── index.php                # Ponto de entrada
└── assets/                       # Assets estáticos
    ├── css/
    └── js/
```

## 🚀 **Funcionalidades**

### **🎯 Core Features**
- **Multi-Tenant** → Cada cliente tem site personalizado
- **Integração TMDB** → Base completa de filmes e séries
- **Dashboard Admin** → Gerenciamento completo do SaaS
- **Dashboard Cliente** → Painel personalizado por tenant
- **API REST** → Endpoints organizados e documentados
- **Autenticação JWT** → Segurança moderna com tokens

### **🔧 Arquitetura Técnica**
- **MVC Pattern** → Separação clara de responsabilidades
- **Repository Pattern** → Abstração de dados
- **Service Layer** → Lógica de negócio isolada
- **Middleware Stack** → Processamento de requisições
- **Router Avançado** → Roteamento flexível com parâmetros
- **ORM Simples** → BaseModel com operações CRUD

## 📊 **Banco de Dados**

### **🗄️ Schema Otimizado**
```sql
-- Usuários administrativos
users (id, email, password, name, role, created_at, updated_at)

-- Clientes SaaS (tenants)
tenants (id, slug, name, password, logo_url, favicon_url, 
         hero_title, hero_subtitle, hero_description,
         site_name, site_tagline, site_description,
         contact_email, contact_whatsapp,
         primary_color, secondary_color, active,
         created_at, updated_at)

-- Solicitações de conteúdo
requests (id, tenant_id, content_id, content_type, content_title,
          requester_name, requester_whatsapp, season, episode,
          status, poster_path, created_at, updated_at)
```

### **🔗 Relacionamentos**
- `requests.tenant_id` → `tenants.id` (FK)
- Isolamento completo de dados por tenant
- Suporte a solicitações globais (tenant_id = NULL)

## ⚙️ **Instalação**

### **1. Requisitos**
- PHP 8.0+
- MySQL 5.7+
- Composer
- Chave da API TMDB

### **2. Configuração**
```bash
# Clone o repositório
git clone <repository-url>
cd cinerequest-saas

# Instale dependências
composer install

# Configure o banco
mysql -u root -p
CREATE DATABASE movie_requests CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Execute as migrations
mysql -u root -p movie_requests < supabase/migrations/20250807002137_navy_mud.sql
```

### **3. Configuração da API TMDB**
1. Acesse [TMDB](https://www.themoviedb.org/)
2. Crie uma conta e vá em **Settings > API**
3. Copie o **"API Read Access Token"** (Bearer Token)
4. Configure em `config/app.php`:

```php
'tmdb' => [
    'api_key' => 'SEU_BEARER_TOKEN_AQUI'
]
```

### **4. Configuração do Banco**
Edite `config/app.php`:
```php
'database' => [
    'host' => 'localhost',
    'database' => 'movie_requests',
    'username' => 'seu_usuario',
    'password' => 'sua_senha'
]
```

## 🎮 **Como Usar**

### **🔐 Credenciais Padrão**
- **Admin**: `admin@cine.com` / `admin123`
- **Cliente**: `exemplo-cliente` / `cliente123`

### **📍 URLs Principais**
- **`/`** → Página inicial do SaaS
- **`/admin/login`** → Login administrativo
- **`/admin/dashboard`** → Dashboard admin
- **`/admin/tenants`** → Gerenciar clientes
- **`/client/login`** → Login do cliente
- **`/client/dashboard`** → Dashboard do cliente
- **`/exemplo-cliente`** → Site do tenant

### **🔌 APIs Disponíveis**
```
GET    /api/auth/me                    # Usuário atual (admin)
POST   /api/auth/login                 # Login admin
POST   /api/auth/logout                # Logout admin

GET    /api/client-auth/me             # Tenant atual
POST   /api/client-auth/login          # Login cliente
POST   /api/client-auth/logout         # Logout cliente

GET    /api/tenants                    # Listar tenants
POST   /api/tenants                    # Criar tenant
GET    /api/tenants/{id}               # Ver tenant
PUT    /api/tenants/{id}               # Atualizar tenant
DELETE /api/tenants/{id}               # Deletar tenant

GET    /api/requests                   # Listar solicitações
POST   /api/tenant-requests            # Criar solicitação (público)
PUT    /api/requests/status            # Atualizar status
GET    /api/requests/stats             # Estatísticas

GET    /api/tmdb/search                # Buscar conteúdo
GET    /api/tmdb/movie/{id}            # Detalhes do filme
GET    /api/tmdb/tv/{id}               # Detalhes da série
```

## 🛡️ **Segurança**

### **🔒 Implementações**
- **JWT Tokens** → Autenticação stateless
- **Middleware de Auth** → Proteção de rotas
- **Validação de Input** → Sanitização de dados
- **Prepared Statements** → Prevenção SQL injection
- **CORS Headers** → Controle de origem
- **Rate Limiting** → Proteção contra spam

### **🎯 Isolamento Multi-Tenant**
- Dados completamente isolados por tenant
- Verificação de propriedade em todas as operações
- Middleware de autenticação específico por contexto

## 🚀 **Deploy em Produção**

### **📋 Checklist**
1. **Configure ambiente**:
   ```php
   'debug' => false,
   'jwt_secret' => 'chave_forte_aleatoria'
   ```

2. **Otimize autoloader**:
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

3. **Configure servidor web**:
   - Document root: `/public`
   - Rewrite rules: `.htaccess` incluído

4. **Segurança**:
   - HTTPS obrigatório
   - Backup automático do banco
   - Monitoramento de logs

## 🔧 **Desenvolvimento**

### **🛠️ Comandos Úteis**
```bash
# Servidor de desenvolvimento
composer serve

# Executar testes
composer test

# Atualizar dependências
composer update
```

### **📝 Padrões de Código**
- **PSR-4** → Autoloading
- **PSR-12** → Estilo de código
- **SOLID** → Princípios de design
- **Clean Architecture** → Separação de camadas

## 🎪 **Recursos Avançados**

### **🎨 Personalização por Tenant**
- Cores primária e secundária
- Logo e favicon personalizados
- Conteúdo completamente customizável
- URLs únicas por cliente

### **📊 Analytics e Relatórios**
- Estatísticas em tempo real
- Gráficos de solicitações
- Taxa de aprovação
- Métricas por período

### **🔄 Integração TMDB**
- Busca avançada com filtros
- Detalhes completos de filmes/séries
- Imagens em alta qualidade
- Trailers e informações de elenco

Agora você tem um sistema SaaS moderno, escalável e profissional! 🚀✨