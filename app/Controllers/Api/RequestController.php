<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Core\Request;
use App\Core\Response;
use App\Models\ContentRequest;
use App\Models\Tenant;

class RequestController extends BaseController
{
    private ContentRequest $requestModel;
    private Tenant $tenantModel;

    public function __construct()
    {
        $this->requestModel = new ContentRequest();
        $this->tenantModel = new Tenant();
    }

    public function index(Request $request): Response
    {
        $tenantId = $this->getTenantId($request);
        
        $filters = [
            'status' => $request->get('status'),
            'content_type' => $request->get('content_type'),
            'search' => $request->get('search'),
            'limit' => $request->get('limit'),
            'offset' => $request->get('offset')
        ];

        $requests = $this->requestModel->getByTenant($tenantId, $filters);
        return $this->json($requests);
    }

    public function show(Request $request, string $id): Response
    {
        $tenantId = $this->getTenantId($request);
        $contentRequest = $this->requestModel->find((int) $id);
        
        if (!$contentRequest) {
            return $this->error('Request not found', 404);
        }

        // Check if request belongs to tenant
        if ($tenantId !== $contentRequest['tenant_id']) {
            return $this->error('Access denied', 403);
        }

        return $this->json($contentRequest);
    }

    public function store(Request $request): Response
    {
        $errors = $this->validateRequest($request, [
            'content_id' => 'required',
            'content_type' => 'required',
            'content_title' => 'required',
            'requester_name' => 'required|min:2',
            'requester_whatsapp' => 'required'
        ]);

        if (!empty($errors)) {
            return $this->json(['errors' => $errors], 422);
        }

        // Validate WhatsApp format
        $whatsapp = preg_replace('/\D/', '', $request->get('requester_whatsapp'));
        if (!preg_match('/^55\d{10,11}$/', $whatsapp)) {
            return $this->error('WhatsApp must be in format: 5511999999999', 422);
        }

        $data = $request->all();
        $data['requester_whatsapp'] = $whatsapp;
        $data['tenant_id'] = $this->getTenantId($request);

        $contentRequest = $this->requestModel->create($data);

        if (!$contentRequest) {
            return $this->error('Failed to create request', 500);
        }

        return $this->success('Request created successfully', ['request' => $contentRequest]);
    }

    public function updateStatus(Request $request): Response
    {
        $errors = $this->validateRequest($request, [
            'id' => 'required',
            'status' => 'required'
        ]);

        if (!empty($errors)) {
            return $this->json(['errors' => $errors], 422);
        }

        $id = (int) $request->get('id');
        $status = $request->get('status');
        $tenantId = $this->getTenantId($request);

        if (!in_array($status, ['pending', 'approved', 'denied'])) {
            return $this->error('Invalid status', 422);
        }

        $success = $this->requestModel->updateStatus($id, $status, $tenantId);

        if (!$success) {
            return $this->error('Request not found or access denied', 404);
        }

        return $this->success('Status updated successfully');
    }

    public function stats(Request $request): Response
    {
        $tenantId = $this->getTenantId($request);
        $stats = $this->requestModel->getStats($tenantId);
        return $this->json($stats);
    }

    public function destroy(Request $request, string $id): Response
    {
        $tenantId = $this->getTenantId($request);
        $success = $this->requestModel->deleteByTenant((int) $id, $tenantId);

        if (!$success) {
            return $this->error('Request not found or access denied', 404);
        }

        return $this->success('Request deleted successfully');
    }

    private function getTenantId(Request $request): ?int
    {
        $tenantSlug = $request->get('tenant_slug');
        
        if ($tenantSlug) {
            $tenant = $this->tenantModel->findBySlug($tenantSlug);
            return $tenant ? $tenant['id'] : null;
        }

        return null;
    }
}