<?php
/**
 * GitHub Webhook Deployment Script for AlwaysData
 *
 * Place this file in your web root (e.g., ~/www/webhook-deploy.php)
 * Configure it in GitHub: Settings → Webhooks → Add webhook
 *
 * Security: Add a secret in GitHub and verify it here
 */

// Configuration
$SECRET = 'YOUR_WEBHOOK_SECRET_HERE'; // Set this in GitHub webhook settings
$PROJECT_PATH = '/home/[username]/www/ioea_kit'; // Update with your path
$LOG_FILE = '/home/[username]/www/webhook-deploy.log';

// Get the payload
$payload = file_get_contents('php://input');
$headers = getallheaders();

// Verify secret (if configured)
if (!empty($SECRET) && $SECRET !== 'YOUR_WEBHOOK_SECRET_HERE') {
    $signature = $headers['X-Hub-Signature-256'] ?? '';
    $expected = 'sha256=' . hash_hmac('sha256', $payload, $SECRET);

    if (!hash_equals($expected, $signature)) {
        http_response_code(403);
        die('Invalid signature');
    }
}

// Parse the payload
$data = json_decode($payload, true);

// Only process push events to main branch
if ($data['ref'] !== 'refs/heads/main') {
    http_response_code(200);
    die('Not main branch, ignoring');
}

// Log the deployment
$log = date('Y-m-d H:i:s') . " - Deployment triggered\n";
file_put_contents($LOG_FILE, $log, FILE_APPEND);

// Execute deployment script
$output = [];
$return_var = 0;
exec("cd $PROJECT_PATH && git pull origin main && ./deploy.sh 2>&1", $output, $return_var);

// Log results
$log = "Output: " . implode("\n", $output) . "\n";
$log .= "Return code: $return_var\n\n";
file_put_contents($LOG_FILE, $log, FILE_APPEND);

// Return response
http_response_code($return_var === 0 ? 200 : 500);
header('Content-Type: application/json');
echo json_encode([
    'status' => $return_var === 0 ? 'success' : 'error',
    'output' => $output
]);

