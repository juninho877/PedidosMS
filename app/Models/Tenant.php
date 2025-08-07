<?php

namespace App\Models;

class Tenant extends BaseModel
{
    protected string $table = 'tenants';
    
    protected array $fillable = [
        'slug',
        'name',
        'password',
        'logo_url',
        'favicon_url',
        'hero_title',
        'hero_subtitle',
        'hero_description',
        'site_name',
        'site_tagline',
        'site_description',
        'contact_email',
        'contact_whatsapp',
        'primary_color',
        'secondary_color',
        'active'
    ];
    
    protected array $hidden = [
        'password'
    ];
    
    protected array $casts = [
        'active' => 'boolean'
    ];

    public function findBySlug(string $slug): ?array
    {
        return $this->findBy('slug', $slug);
    }

    public function authenticate(string $slug, string $password): ?array
    {
        $sql = "SELECT * FROM {$this->table} WHERE slug = ? AND active = 1";
        $tenant = $this->db->queryOne($sql, [$slug]);
        
        if ($tenant && password_verify($password, $tenant['password'])) {
            return $this->castAttributes($tenant);
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

    public function getActiveTenantsCount(): int
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE active = 1";
        return $this->db->queryOne($sql)['count'];
    }

    public function getNewTenantsThisMonth(): int
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} 
                WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
                AND YEAR(created_at) = YEAR(CURRENT_DATE())";
        return $this->db->queryOne($sql)['count'];
    }
}