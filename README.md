# CineRequest SaaS

Sistema SaaS completo para gerenciamento de solicitações de filmes e séries com multi-tenancy.

## 🚀 Funcionalidades

- **Multi-tenant**: Cada cliente tem seu próprio site personalizado
- **Integração TMDB**: Base de dados completa de filmes e séries
- **Dashboard Admin**: Gerenciamento completo de clientes
- **Dashboard Cliente**: Gerenciamento de solicitações e configurações
- **Sites Personalizados**: URLs únicas com branding customizado
- **Sistema de Autenticação**: JWT com cookies seguros

## 📋 Pré-requisitos

- PHP 7.4+
- MySQL 5.7+
- Composer
- Chave da API do TMDB

## ⚙️ Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd cine-request-saas
```

### 2. Instale as dependências
```bash
composer install
```

### 3. Configure o banco de dados
```sql
CREATE DATABASE movie_requests CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Execute o script SQL em `database/schema.sql`

### 4. Configure a API do TMDB

1. Acesse [TMDB](https://www.themoviedb.org/)
2. Crie uma conta gratuita
3. Vá em **Configurações > API**
4. Solicite uma chave da API
5. Copie o **Bearer Token** (não a API Key v3)

### 5. Configure o arquivo config.php

Edite `config/config.php` e substitua:

```php
define('TMDB_API_KEY', 'SEU_BEARER_TOKEN_AQUI');
```

**IMPORTANTE**: Use o Bearer Token, não a API Key v3!

### 6. Configure o banco de dados

Edite `config/Database.php` com suas credenciais:

```php
private $host = 'localhost';
private $db_name = 'movie_requests';
private $username = 'seu_usuario';
private $password = 'sua_senha';
```

## 🔑 Credenciais Padrão

### Admin
- **URL**: `/admin/login.php`
- **Email**: `admin@cine.com`
- **Senha**: `admin123`

### Clientes de Exemplo
- **URL**: `/client/login.php`
- **Slug**: `exemplo-cliente`
- **Senha**: `cliente123`

## 🌐 URLs do Sistema

### Administrativo
- `/` - Página inicial
- `/admin/login.php` - Login admin
- `/admin/dashboard.php` - Dashboard admin
- `/admin/tenants.php` - Gerenciar clientes

### Cliente
- `/client/login.php` - Login cliente
- `/client/dashboard.php` - Dashboard cliente

### Sites dos Clientes
- `/exemplo-cliente` - Site do cliente exemplo
- `/cine-premium` - Site do Cine Premium
- `/cine-familia` - Site do Cine Família

## 🔧 Configuração da API do TMDB

### Como obter a chave correta:

1. **Faça login no TMDB**
2. **Vá em Settings > API**
3. **Copie o "API Read Access Token"** (Bearer Token)
4. **NÃO use a "API Key (v3 auth)"**

### Formato correto:
```
Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZGQyZGQzYjQwMzk0ZGVkYjU5ZGY4ZGY4ZGY4ZGY4ZCIsInN1YiI6IjY1ZjI5ZjI5ZjI5ZjI5ZjI5ZjI5ZjI5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.example
```

## 🗄️ Estrutura do Banco

### Tabelas Principais:
- `users` - Usuários administrativos
- `tenants` - Clientes do SaaS
- `requests` - Solicitações de conteúdo

### Relacionamentos:
- Cada solicitação pertence a um tenant (ou é global se tenant_id = NULL)
- Isolamento completo de dados entre tenants

## 🎨 Personalização

### Cores do Cliente:
- Cada tenant pode ter cores primária e secundária
- CSS dinâmico com variáveis CSS

### Conteúdo:
- Títulos, descrições e slogans personalizáveis
- Logo e favicon únicos por cliente

## 🔒 Segurança

- **JWT Tokens** com cookies HTTPOnly
- **Isolamento de dados** entre tenants
- **Validação de entrada** em todas as APIs
- **Prepared statements** para prevenir SQL injection

## 🐛 Troubleshooting

### Erro 401 da API do TMDB:
- Verifique se está usando o Bearer Token correto
- Confirme que a chave não expirou
- Teste a chave diretamente no Postman

### Erro de conexão com banco:
- Verifique as credenciais em `config/Database.php`
- Confirme que o banco existe
- Teste a conexão MySQL

### Páginas em branco:
- Ative `display_errors` no PHP
- Verifique os logs do Apache/Nginx
- Confirme que o autoloader está funcionando

## 📞 Suporte

Para suporte técnico, verifique:
1. Logs do servidor web
2. Console do navegador (F12)
3. Configurações do PHP
4. Permissões de arquivo

## 🚀 Deploy em Produção

1. **Desative debug**: `display_errors = Off`
2. **Mude JWT_SECRET**: Use uma chave forte
3. **Configure HTTPS**: Para cookies seguros
4. **Backup automático**: Configure backups do banco
5. **Monitoramento**: Configure logs e alertas