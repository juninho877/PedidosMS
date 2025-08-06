/*
  # Criar tabela de tenants (clientes SaaS)

  1. Nova Tabela
    - `tenants`
      - `id` (int, primary key, auto increment)
      - `slug` (varchar, unique, url identifier)
      - `name` (varchar, company name)
      - `password` (varchar, hashed password)
      - `logo_url` (varchar, logo image url)
      - `favicon_url` (varchar, favicon url)
      - `hero_title` (varchar, main hero title)
      - `hero_subtitle` (varchar, hero subtitle)
      - `hero_description` (text, hero description)
      - `site_name` (varchar, public site name)
      - `site_tagline` (varchar, site tagline)
      - `site_description` (text, general site description)
      - `contact_email` (varchar, contact email)
      - `contact_whatsapp` (varchar, whatsapp number)
      - `primary_color` (varchar, hex color)
      - `secondary_color` (varchar, hex color)
      - `active` (boolean, tenant status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Índices
    - Índice único no slug para performance
    - Índice no status ativo

  3. Dados de Exemplo
    - Cliente exemplo para demonstração
*/

-- Criar tabela de tenants (clientes SaaS)
CREATE TABLE IF NOT EXISTS tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500) NULL,
    favicon_url VARCHAR(500) NULL,
    hero_title VARCHAR(500) NULL,
    hero_subtitle VARCHAR(500) NULL,
    hero_description TEXT NULL,
    site_name VARCHAR(255) NULL,
    site_tagline VARCHAR(500) NULL,
    site_description TEXT NULL,
    contact_email VARCHAR(255) NULL,
    contact_whatsapp VARCHAR(20) NULL,
    primary_color VARCHAR(7) NULL,
    secondary_color VARCHAR(7) NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_active (active)
) ENGINE=InnoDB;

-- Adicionar coluna tenant_id na tabela requests se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'requests' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE requests ADD COLUMN tenant_id INT NULL AFTER id;
    ALTER TABLE requests ADD INDEX idx_tenant_id (tenant_id);
  END IF;
END $$;

-- Inserir cliente de exemplo (senha: cliente123)
INSERT INTO tenants (
    slug, 
    name, 
    password, 
    site_name, 
    site_tagline, 
    site_description,
    hero_title, 
    hero_subtitle, 
    hero_description, 
    contact_email, 
    contact_whatsapp, 
    primary_color, 
    secondary_color
) VALUES (
    'exemplo-cliente', 
    'Cliente Exemplo Ltda', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'CineExemplo', 
    'Seu cinema na palma da mão',
    'Sistema profissional de gerenciamento de solicitações de conteúdo audiovisual. Pesquise, solicite e acompanhe suas preferências de entretenimento com nossa plataforma completa.',
    'Solicite seus Filmes e Séries favoritos', 
    'Sistema profissional de gerenciamento de solicitações', 
    'Pesquise, solicite e acompanhe suas preferências de entretenimento.', 
    'contato@cineexemplo.com', 
    '5511987654321', 
    '#007bff', 
    '#dc3545'
) ON DUPLICATE KEY UPDATE slug = slug;

-- Inserir mais um cliente de exemplo
INSERT INTO tenants (
    slug, 
    name, 
    password, 
    site_name, 
    site_tagline, 
    site_description,
    hero_title, 
    hero_subtitle, 
    hero_description, 
    contact_email, 
    contact_whatsapp, 
    primary_color, 
    secondary_color
) VALUES (
    'cine-premium', 
    'Cine Premium Entretenimento', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Cine Premium', 
    'Entretenimento de qualidade premium',
    'Sua plataforma premium para solicitação de filmes e séries exclusivos. Experiência cinematográfica de alto nível.',
    'Entretenimento Premium ao seu Alcance', 
    'Filmes e séries exclusivos para você', 
    'Descubra e solicite conteúdo premium com qualidade cinematográfica excepcional.', 
    'premium@cineentretenimento.com', 
    '5511876543210', 
    '#8b5cf6', 
    '#f59e0b'
) ON DUPLICATE KEY UPDATE slug = slug;