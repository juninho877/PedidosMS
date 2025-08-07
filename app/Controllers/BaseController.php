<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;

abstract class BaseController
{
    protected function json(array $data, int $statusCode = 200): Response
    {
        return Response::json($data, $statusCode);
    }

    protected function view(string $view, array $data = [], int $statusCode = 200): Response
    {
        return Response::view($view, $data, $statusCode);
    }

    protected function redirect(string $url, int $statusCode = 302): Response
    {
        return Response::redirect($url, $statusCode);
    }

    protected function validateRequest(Request $request, array $rules): array
    {
        $errors = $request->validate($rules);
        
        if (!empty($errors)) {
            if ($request->isJson() || $request->isAjax()) {
                return $this->json(['errors' => $errors], 422);
            } else {
                // Handle form validation errors
                $_SESSION['validation_errors'] = $errors;
                $_SESSION['old_input'] = $request->all();
            }
        }
        
        return $errors;
    }

    protected function success(string $message, array $data = []): Response
    {
        return $this->json(array_merge(['success' => true, 'message' => $message], $data));
    }

    protected function error(string $message, int $statusCode = 400): Response
    {
        return $this->json(['success' => false, 'error' => $message], $statusCode);
    }
}