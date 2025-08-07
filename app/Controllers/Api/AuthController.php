<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Core\Request;
use App\Core\Response;
use App\Models\User;
use App\Services\AuthService;

class AuthController extends BaseController
{
    private User $userModel;
    private AuthService $authService;

    public function __construct()
    {
        $this->userModel = new User();
        $this->authService = new AuthService();
    }

    public function login(Request $request): Response
    {
        $errors = $this->validateRequest($request, [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!empty($errors)) {
            return $this->json(['errors' => $errors], 422);
        }

        $email = $request->get('email');
        $password = $request->get('password');

        $user = $this->userModel->authenticate($email, $password);

        if (!$user) {
            return $this->error('Invalid credentials', 401);
        }

        $token = $this->authService->generateToken($user);
        $this->authService->setAuthCookie($token, 'admin_token');

        return $this->success('Login successful', [
            'token' => $token,
            'user' => $user
        ]);
    }

    public function logout(Request $request): Response
    {
        $this->authService->clearAuthCookie('admin_token');
        return $this->success('Logout successful');
    }

    public function me(Request $request): Response
    {
        $user = $this->authService->getCurrentUser('admin_token');
        
        if (!$user) {
            return $this->error('Unauthorized', 401);
        }

        return $this->json(['user' => $user]);
    }
}