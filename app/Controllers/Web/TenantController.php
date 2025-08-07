<?php

namespace App\Controllers\Web;

use App\Controllers\BaseController;
use App\Core\Request;
use App\Core\Response;
use App\Models\Tenant;

class TenantController extends BaseController
{
    private Tenant $tenantModel;

    public function __construct()
    {
        $this->tenantModel = new Tenant();
    }

    public function home(Request $request, string $slug): Response
    {
        $tenant = $this->tenantModel->findBySlug($slug);
        
        if (!$tenant || !$tenant['active']) {
            return $this->view('errors.404', [], 404);
        }

        return $this->view('tenant.home', [
            'tenant' => $tenant,
            'title' => $tenant['site_name']
        ]);
    }

    public function search(Request $request, string $slug): Response
    {
        $tenant = $this->tenantModel->findBySlug($slug);
        
        if (!$tenant || !$tenant['active']) {
            return $this->view('errors.404', [], 404);
        }

        return $this->view('tenant.search', [
            'tenant' => $tenant,
            'title' => 'Pesquisar - ' . $tenant['site_name']
        ]);
    }

    public function details(Request $request, string $slug): Response
    {
        $tenant = $this->tenantModel->findBySlug($slug);
        
        if (!$tenant || !$tenant['active']) {
            return $this->view('errors.404', [], 404);
        }

        $type = $request->get('type');
        $id = $request->get('id');

        if (empty($type) || empty($id) || !in_array($type, ['movie', 'tv'])) {
            return $this->redirect("/{$slug}/search");
        }

        return $this->view('tenant.details', [
            'tenant' => $tenant,
            'type' => $type,
            'id' => $id,
            'title' => 'Detalhes - ' . $tenant['site_name']
        ]);
    }
}