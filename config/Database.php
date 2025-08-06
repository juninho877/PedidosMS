<?php
error_log("Database.php: Arquivo sendo carregado");

class Database {
    private $host = 'localhost';
    private $db_name = 'movie_requests';
    private $username = 'root';
    private $password = '';
    private $conn = null;

    public function getConnection() {
        if ($this->conn !== null) {
            error_log("Database: Retornando conexão existente");
            return $this->conn;
        }

        try {
            error_log("Database: Criando nova conexão");
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
            error_log("Database: Conexão estabelecida com sucesso");
            return $this->conn;
        } catch (PDOException $e) {
            error_log("Database: ERRO na conexão - " . $e->getMessage());
            throw new Exception("Erro de conexão com o banco de dados: " . $e->getMessage());
        }
    }
}

error_log("Database.php: Classe Database definida com sucesso");
?>