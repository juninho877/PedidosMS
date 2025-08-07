<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Core\Request;
use App\Core\Response;
use App\Models\Tenant;
use App\Services\AuthService;

class ClientAuthController extends BaseController
{
    private Tenant $tenantModel;
    private AuthService $authService;

    public function __construct()
    {
        $this->tenantModel = new Tenant();
        $this->authService = new AuthService();
    }

    public function login(Request $request): Response
    {
        $errors = $this->validateRequest($request, [
            'slug' => 'required',
            'password' => 'required'
        ]);

        if (!empty($errors)) {
            return $this->json(['errors' => $errors], 422);
        }

        $slug = $request->get('slug');
        $password = $request->get('password');

        $tenant = $this->tenantModel->authenticate($slug, $password);

        if (!$tenant) {
            return $this->error('Invalid credentials', 401);
        }

        $token = $this->authService->generateToken($tenant, 168); // 7 days
        $this->authService->setAuthCookie($token, 'client_token');

        return $this->success('Login successful', [
            'token' => $token,
            'tenant' => $tenant
        ]);
    }

    public function logout(Request $request): Response
    {
        $this->authService->clearAuthCookie('client_token');
        return $this->success('Logout successful');
    }

    public function me(Request $request): Response
    {
        $tenant = $this->authService->getCurrentUser('client_token');
        
        if (!$tenant) {
            return $this->error('Unauthorized', 401);
        }

        return $this->json(['tenant' => $tenant]);
    }
}