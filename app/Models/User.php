<?php

namespace App\Models;

class User extends BaseModel
{
    protected string $table = 'users';
    
    protected array $fillable = [
        'email',
        'password',
        'name',
        'role'
    ];
    
    protected array $hidden = [
        'password'
    ];

    public function authenticate(string $email, string $password): ?array
    {
        $user = $this->findBy('email', $email);
        
        if ($user && password_verify($password, $user['password'])) {
            return $this->castAttributes($user);
        }
        
        return null;
    }

    public function create(array $data): ?array
    {
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        return parent::create($data);
    }

    public function update(int $id, array $data): bool
    {
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        return parent::update($id, $data);
    }
}