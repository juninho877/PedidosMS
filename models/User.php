<?php
error_log("User.php: Arquivo sendo carregado");

class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $email;
    public $password;
    public $name;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
        error_log("User: Inicializado com sucesso");
    }

    public function login($email, $password) {
        error_log("User: login() chamado para email: $email");
        
        $query = "SELECT id, email, password, name, role FROM " . $this->table . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            if (password_verify($password, $row['password'])) {
                $this->id = $row['id'];
                $this->email = $row['email'];
                $this->name = $row['name'];
                $this->role = $row['role'];
                error_log("User: Login bem-sucedido para: $email");
                return true;
            }
        }
        
        error_log("User: Login falhou para: $email");
        return false;
    }

    public function create($email, $password, $name) {
        error_log("User: create() chamado para email: $email");
        
        $query = "INSERT INTO " . $this->table . " (email, password, name) VALUES (:email, :password, :name)";
        $stmt = $this->conn->prepare($query);
        
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':name', $name);

        return $stmt->execute();
    }

    public function findById($id) {
        error_log("User: findById() chamado para ID: $id");
        
        $query = "SELECT id, email, name, role FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            $this->id = $row['id'];
            $this->email = $row['email'];
            $this->name = $row['name'];
            $this->role = $row['role'];
            return true;
        }
        return false;
    }
}

error_log("User.php: Classe User definida com sucesso");
?>