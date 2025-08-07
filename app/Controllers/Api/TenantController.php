<?php

namespace App\Controllers\Api;

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

    public function index(Request $request): Response
    {
        $tenants = $this->tenantModel->all();
        return $this->json($tenants);
    }

    public function show(Request $request, string $id): Response
    {
        $tenant = $this->tenantModel->find((int) $id);
        
        if (!$tenant) {
            return $this->error('Tenant not found', 404);
        }

        return $this->json($tenant);
    }

    public function store(Request $request): Response
    {
        $errors = $this->validateRequest($request, [
            'slug' => 'required|min:3|max:50',
            'name' => 'required|min:2|max:255',
            'password' => 'required|min:6',
            'site_name' => 'required|min:2|max:255'
        ]);

        if (!empty($errors)) {
            return $this->json(['errors' => $errors], 422);
        }

        // Check if slug already exists
        $existingTenant = $this->tenantModel->findBySlug($request->get('slug'));
        if ($existingTenant) {
            return $this->error('Slug already exists', 422);
        }

        $tenant = $this->tenantModel->create($request->all());

        if (!$tenant) {
            return $this->error('Failed to create tenant', 500);
        }

        return $this->success('Tenant created successfully', ['tenant' => $tenant]);
    }

    public function update(Request $request, string $id): Response
    {
        $tenant = $this->tenantModel->find((int) $id);
        
        if (!$tenant) {
            return $this->error('Tenant not found', 404);
        }

        $errors = $this->validateRequest($request, [
            'name' => 'required|min:2|max:255',
            'site_name' => 'required|min:2|max:255'
        ]);

        if (!empty($errors)) {
            return $this->json(['errors' => $errors], 422);
        }

        $data = $request->all();
        unset($data['slug']); // Don't allow slug updates

        $success = $this->tenantModel->update((int) $id, $data);

        if (!$success) {
            return $this->error('Failed to update tenant', 500);
        }

        return $this->success('Tenant updated successfully');
    }

    public function destroy(Request $request, string $id): Response
    {
        $tenant = $this->tenantModel->find((int) $id);
        
        if (!$tenant) {
            return $this->error('Tenant not found', 404);
        }

        $success = $this->tenantModel->delete((int) $id);

        if (!$success) {
            return $this->error('Failed to delete tenant', 500);
        }

        return $this->success('Tenant deleted successfully');
    }
}