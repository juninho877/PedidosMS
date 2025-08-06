/*
  # Corrigir carregamento de dados do tenant

  1. Verificações
    - Verificar se a tabela tenants existe
    - Verificar se todos os campos necessários existem
    - Adicionar campos faltantes se necessário

  2. Dados de Exemplo
    - Inserir clientes de exemplo com todos os campos preenchidos
    - Garantir que os dados estejam completos para teste
*/

-- Verificar e criar tabela tenants se não existir
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

-- Verificar e adicionar coluna tenant_id na tabela requests se não existir
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

-- Inserir ou atualizar clientes de exemplo com dados completos
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
) VALUES 
(
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
),
(
    'cine-premium', 
    'Cine Premium Entretenimento', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Cine Premium', 
    'Entretenimento de qualidade premium',
    'Sua plataforma premium para solicitação de filmes e séries exclusivos. Experiência cinematográfica de alto nível com curadoria especializada.',
    'Entretenimento Premium ao seu Alcance', 
    'Filmes e séries exclusivos para você', 
    'Descubra e solicite conteúdo premium com qualidade cinematográfica excepcional.', 
    'premium@cineentretenimento.com', 
    '5511876543210', 
    '#8b5cf6', 
    '#f59e0b'
),
(
    'cine-familia', 
    'Cine Família Entretenimento', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Cine Família', 
    'Diversão para toda a família',
    'Plataforma especializada em conteúdo familiar. Filmes e séries adequados para todas as idades, com curadoria especial para momentos em família.',
    'Diversão Familiar Garantida', 
    'Conteúdo seguro para toda a família', 
    'Encontre filmes e séries perfeitos para assistir com seus entes queridos.', 
    'familia@cinefamilia.com', 
    '5511765432109', 
    '#10b981', 
    '#f97316'
)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    site_name = VALUES(site_name),
    site_tagline = VALUES(site_tagline),
    site_description = VALUES(site_description),
    hero_title = VALUES(hero_title),
    hero_subtitle = VALUES(hero_subtitle),
    hero_description = VALUES(hero_description),
    contact_email = VALUES(contact_email),
    contact_whatsapp = VALUES(contact_whatsapp),
    primary_color = VALUES(primary_color),
    secondary_color = VALUES(secondary_color);