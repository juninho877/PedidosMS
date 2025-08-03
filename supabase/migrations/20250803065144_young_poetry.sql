-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS movie_requests CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE movie_requests;

-- Tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Tabela de solicitações
CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    content_type ENUM('movie', 'tv') NOT NULL,
    content_title VARCHAR(500) NOT NULL,
    requester_name VARCHAR(255) NOT NULL,
    requester_whatsapp VARCHAR(20) NOT NULL,
    season INT NULL,
    episode INT NULL,
    status ENUM('pending', 'approved', 'denied') DEFAULT 'pending',
    poster_path VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_content_type (content_type),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_content_id (content_id)
) ENGINE=InnoDB;

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (email, password, name) VALUES 
('admin@cine.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador')
ON DUPLICATE KEY UPDATE email = email;