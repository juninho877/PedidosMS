# CineRequest - Sistema de Gerenciamento de Solicitações de Filmes e Séries (PHP)

Um sistema web full-stack profissional desenvolvido em PHP puro para gerenciamento de solicitações de conteúdo audiovisual, com interface pública para usuários e painel administrativo para gestão.

## 🎬 Funcionalidades

### Interface Pública
- **Pesquisa Avançada**: Integração com API do TMDB para busca de filmes e séries
- **Filtros Inteligentes**: Por tipo de conteúdo (filme/série) e ano de lançamento
- **Detalhes Completos**: Informações detalhadas, elenco, trailer e sinopse
- **Sistema de Solicitações**: Formulário otimizado com validação em tempo real
- **Design Responsivo**: Interface adaptada para desktop, tablet e mobile

### Painel Administrativo
- **Autenticação Segura**: Sistema de login com JWT e cookies seguros
- **Dashboard Completo**: Estatísticas e métricas em tempo real
- **Gestão de Solicitações**: Aprovar, negar e visualizar detalhes
- **Filtros Avançados**: Por status, tipo de conteúdo e data
- **Comunicação Direta**: Links para WhatsApp dos solicitantes

## 🚀 Tecnologias Utilizadas

- **Backend**: PHP 7.4+ (Orientado a Objetos)
- **Banco de Dados**: MySQL 5.7+
- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript ES6+
- **Autenticação**: JWT (JSON Web Tokens)
- **API Externa**: The Movie Database (TMDB)
- **Arquitetura**: MVC (Model-View-Controller)
- **Segurança**: Prepared Statements, CSRF Protection, XSS Prevention

## ⚙️ Instalação e Configuração

### 1. Requisitos do Sistema

- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Apache/Nginx com mod_rewrite habilitado
- Composer (para gerenciamento de dependências)
- Extensões PHP: PDO, PDO_MySQL, cURL, JSON

### 2. Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cine-request-php.git
cd cine-request-php

# Instale as dependências
composer install

# Configure as permissões (Linux/Mac)
chmod -R 755 .
chmod -R 777 assets/images/
```

### 3. Configuração do Banco de Dados

```bash
# Crie o banco de dados MySQL
mysql -u root -p

# Execute o script de criação
mysql -u root -p < database/schema.sql
```

### 4. Configuração do Ambiente

Edite o arquivo `config/config.php` e ajuste as configurações:

```php
// Configurações do banco de dados
private $host = 'localhost';
private $db_name = 'movie_requests';
private $username = 'seu_usuario';
private $password = 'sua_senha';

// Configurações da API TMDB
define('TMDB_API_KEY', 'sua_chave_tmdb_aqui');

// Configurações JWT (MUDE EM PRODUÇÃO!)
define('JWT_SECRET', 'sua_chave_secreta_jwt_super_segura');
```

### 5. Configuração do Servidor Web

#### Apache (.htaccess já incluído)
```apache
# Certifique-se de que mod_rewrite está habilitado
a2enmod rewrite
systemctl restart apache2
```

#### Nginx
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /caminho/para/cine-request-php;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # API Routes
    location ~ ^/api/(auth|requests|tmdb)/(.*)$ {
        try_files $uri /api/$1.php/$2?$query_string;
    }
}
```

## 🔧 Estrutura do Projeto

```
cine-request-php/
├── config/
│   ├── config.php          # Configurações gerais
│   └── database.php        # Configuração do banco
├── database/
│   └── schema.sql          # Script de criação do banco
├── models/
│   ├── User.php           # Model de usuários
│   └── Request.php        # Model de solicitações
├── controllers/
│   ├── AuthController.php      # Controlador de autenticação
│   ├── RequestController.php   # Controlador de solicitações
│   └── TMDBController.php      # Controlador da API TMDB
├── services/
│   ├── TMDBService.php    # Serviço da API TMDB
│   └── AuthService.php    # Serviço de autenticação JWT
├── middleware/
│   └── AuthMiddleware.php # Middleware de autenticação
├── api/
│   ├── auth.php          # Endpoints de autenticação
│   ├── requests.php      # Endpoints de solicitações
│   └── tmdb.php          # Endpoints da API TMDB
├── admin/
│   ├── login.php         # Página de login admin
│   └── dashboard.php     # Dashboard administrativo
├── assets/
│   ├── css/
│   │   └── style.css     # Estilos customizados
│   ├── js/
│   │   ├── search.js     # JavaScript da pesquisa
│   │   ├── details.js    # JavaScript dos detalhes
│   │   ├── login.js      # JavaScript do login
│   │   └── dashboard.js  # JavaScript do dashboard
│   └── images/           # Imagens e placeholders
├── index.php             # Página inicial
├── search.php            # Página de pesquisa
├── details.php           # Página de detalhes
├── .htaccess            # Configuração Apache
├── composer.json        # Dependências PHP
└── README.md           # Este arquivo
```

## 🔐 Segurança Implementada

### Autenticação e Autorização
- **JWT Tokens**: Autenticação stateless com tokens seguros
- **Password Hashing**: Senhas criptografadas com bcrypt
- **Session Security**: Cookies HTTPOnly e Secure
- **Route Protection**: Middleware de autenticação para rotas admin

### Proteção contra Ataques
- **SQL Injection**: Prepared Statements em todas as queries
- **XSS Prevention**: Sanitização de inputs e outputs
- **CSRF Protection**: Validação de origem das requisições
- **Input Validation**: Validação rigorosa de todos os dados

### Headers de Segurança
```php
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## 📊 API Endpoints

### Autenticação
```
POST /api/auth/login     # Login de usuário
POST /api/auth/logout    # Logout de usuário
GET  /api/auth/me        # Dados do usuário atual
```

### Solicitações
```
GET    /api/requests           # Listar solicitações (admin)
POST   /api/requests           # Criar solicitação (público)
GET    /api/requests/stats     # Estatísticas (admin)
PUT    /api/requests/update-status # Atualizar status (admin)
GET    /api/requests/{id}      # Detalhes da solicitação (admin)
```

### TMDB
```
GET /api/tmdb/search           # Pesquisar filmes/séries
GET /api/tmdb/movie/{id}       # Detalhes do filme
GET /api/tmdb/tv/{id}          # Detalhes da série
```

## 🎨 Design System

### Paleta de Cores
- **Primary Blue**: #1E40AF (botões principais, destaques)
- **Accent Red**: #DC2626 (ações importantes, CTA)
- **Success Green**: #16A34A (aprovações, sucesso)
- **Warning Yellow**: #EAB308 (pendências, alertas)
- **Background**: #0F172A (fundo principal)
- **Surface**: #1E293B (cards, modais)

### Componentes
- **Cards**: Sombras sutis, bordas arredondadas, hover effects
- **Buttons**: Estados de loading, disabled, hover animations
- **Forms**: Validação em tempo real, feedback visual
- **Modals**: Backdrop blur, animações suaves
- **Toasts**: Notificações não-intrusivas

## 🚀 Deploy em Produção

### 1. Configurações de Segurança
```php
// config/config.php - PRODUÇÃO
define('JWT_SECRET', 'chave_super_segura_de_256_bits_ou_mais');

// Habilitar HTTPS
ini_set('session.cookie_secure', 1);

// Headers de segurança adicionais
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
```

### 2. Otimizações
```apache
# .htaccess - Cache e Compressão
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
</IfModule>
```

### 3. Monitoramento
- Logs de erro PHP habilitados
- Logs de acesso do servidor web
- Monitoramento de performance
- Backup automático do banco de dados

## 👥 Credenciais Padrão

**Administrador:**
- Email: `admin@cine.com`
- Senha: `admin123`

> ⚠️ **IMPORTANTE**: Altere essas credenciais imediatamente em produção!

## 🔧 Comandos Úteis

```bash
# Verificar logs de erro PHP
tail -f /var/log/php_errors.log

# Backup do banco de dados
mysqldump -u root -p movie_requests > backup_$(date +%Y%m%d).sql

# Restaurar backup
mysql -u root -p movie_requests < backup_20240101.sql

# Verificar status do servidor
systemctl status apache2
systemctl status mysql
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro 500 - Internal Server Error**
   - Verifique os logs de erro do PHP
   - Confirme se mod_rewrite está habilitado
   - Verifique permissões de arquivos

2. **Erro de Conexão com Banco**
   - Confirme credenciais em `config/database.php`
   - Verifique se o MySQL está rodando
   - Teste conexão manual

3. **API TMDB não funciona**
   - Verifique se a chave da API está correta
   - Confirme se cURL está habilitado no PHP
   - Teste a API manualmente

4. **JWT não funciona**
   - Verifique se a biblioteca firebase/php-jwt está instalada
   - Confirme se a chave secreta está configurada
   - Verifique headers de autorização

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte técnico ou dúvidas:

1. Abra uma issue no GitHub
2. Consulte a documentação da API do TMDB
3. Verifique os logs de erro do sistema

---

**CineRequest PHP** - Sistema profissional de gerenciamento de solicitações de filmes e séries! 🎬✨