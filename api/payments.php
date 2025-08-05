<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

// Mercado Pago configuration (you'll need to set these)
define('MP_ACCESS_TOKEN', 'YOUR_MERCADO_PAGO_ACCESS_TOKEN');
define('MP_PUBLIC_KEY', 'YOUR_MERCADO_PAGO_PUBLIC_KEY');

switch ($path) {
    case '/create-payment':
        if ($method === 'POST') {
            createPayment();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    case '/webhook':
        if ($method === 'POST') {
            handleWebhook();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint não encontrado']);
        break;
}

function createPayment() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (empty($input['plan']) || empty($input['tenant_data'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados incompletos']);
        return;
    }
    
    $plan = $input['plan'];
    $tenantData = $input['tenant_data'];
    
    // Define plan prices
    $plans = [
        'starter' => ['price' => 49.00, 'name' => 'Starter'],
        'professional' => ['price' => 99.00, 'name' => 'Professional'],
        'enterprise' => ['price' => 199.00, 'name' => 'Enterprise']
    ];
    
    if (!isset($plans[$plan])) {
        http_response_code(400);
        echo json_encode(['error' => 'Plano inválido']);
        return;
    }
    
    $planData = $plans[$plan];
    
    try {
        // Create payment with Mercado Pago
        $paymentData = [
            'transaction_amount' => $planData['price'],
            'description' => 'CineRequest SaaS - Plano ' . $planData['name'],
            'payment_method_id' => 'pix',
            'payer' => [
                'email' => $tenantData['email'] ?? 'cliente@exemplo.com',
                'first_name' => $tenantData['name'] ?? 'Cliente',
                'identification' => [
                    'type' => 'CPF',
                    'number' => $tenantData['cpf'] ?? '00000000000'
                ]
            ],
            'notification_url' => 'https://yourdomain.com/api/payments.php/webhook',
            'external_reference' => 'tenant_' . time() . '_' . $plan
        ];
        
        $payment = callMercadoPagoAPI('POST', '/v1/payments', $paymentData);
        
        if (isset($payment['id'])) {
            // Store payment info in database (you'll need to create a payments table)
            // storePaymentInfo($payment['id'], $plan, $tenantData);
            
            echo json_encode([
                'success' => true,
                'payment_id' => $payment['id'],
                'qr_code' => $payment['point_of_interaction']['transaction_data']['qr_code'] ?? null,
                'qr_code_base64' => $payment['point_of_interaction']['transaction_data']['qr_code_base64'] ?? null,
                'ticket_url' => $payment['point_of_interaction']['transaction_data']['ticket_url'] ?? null
            ]);
        } else {
            throw new Exception('Erro ao criar pagamento no Mercado Pago');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao processar pagamento: ' . $e->getMessage()]);
    }
}

function handleWebhook() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['type']) && $input['type'] === 'payment') {
        $paymentId = $input['data']['id'];
        
        try {
            // Get payment details from Mercado Pago
            $payment = callMercadoPagoAPI('GET', "/v1/payments/{$paymentId}");
            
            if ($payment['status'] === 'approved') {
                // Payment approved - create tenant
                $externalRef = $payment['external_reference'];
                
                // Extract plan and tenant info from external reference
                // Format: tenant_timestamp_plan
                $parts = explode('_', $externalRef);
                $plan = end($parts);
                
                // Here you would:
                // 1. Create the tenant in the database
                // 2. Send confirmation email
                // 3. Update payment status
                
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['status' => $payment['status']]);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao processar webhook: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['message' => 'Webhook recebido']);
    }
}

function callMercadoPagoAPI($method, $endpoint, $data = null) {
    $url = 'https://api.mercadopago.com' . $endpoint;
    
    $headers = [
        'Authorization: Bearer ' . MP_ACCESS_TOKEN,
        'Content-Type: application/json'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 400) {
        throw new Exception('Erro na API do Mercado Pago: ' . $response);
    }
    
    return json_decode($response, true);
}
?>