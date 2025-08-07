<?php

namespace App\Middleware;

use App\Core\Request;
use App\Core\Response;
use App\Services\AuthService;

class ClientAuthMiddleware
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function handle(Request $request): void
    {
        $tenant = $this->authService->getCurrentUser('client_token');
        
        if (!$tenant) {
            if ($request->isJson() || $request->isAjax()) {
                http_response_code(401);
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Unauthorized']);
                exit;
            } else {
                header('Location: /client/login');
                exit;
            }
        }
    }
}