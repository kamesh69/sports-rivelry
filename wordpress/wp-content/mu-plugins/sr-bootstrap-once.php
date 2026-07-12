<?php
/**
 * One-time remote bootstrap: seeds + self-removes after success.
 * Trigger: /?sr_bootstrap=tsr-bootstrap-7f3a9c2e1b
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', function () {
    if (!defined('SR_BOOTSTRAP_SECRET')) {
        return;
    }

    $token = isset($_GET['sr_bootstrap']) ? (string) $_GET['sr_bootstrap'] : '';
    if ($token === '' || !hash_equals(SR_BOOTSTRAP_SECRET, $token)) {
        return;
    }

    $results = [];

    if (!function_exists('activate_plugin')) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }

    $plugin = 'wp-graphql/wp-graphql.php';
    if (file_exists(WP_PLUGIN_DIR . '/' . $plugin) && !is_plugin_active($plugin)) {
        $activated = activate_plugin($plugin);
        $results[] = [
            'success' => !is_wp_error($activated),
            'message' => is_wp_error($activated) ? $activated->get_error_message() : 'Activated WPGraphQL',
        ];
    }

    if (function_exists('sr_seed_mlb_content')) {
        $results[] = sr_seed_mlb_content();
    }

    if (function_exists('sr_seed_all_sports_content')) {
        $results[] = sr_seed_all_sports_content();
    }

    $file = __FILE__;
    if (is_writable($file)) {
        @unlink($file);
    }

    if (defined('WP_CLI')) {
        return;
    }

    header('Content-Type: application/json; charset=utf-8');
    echo wp_json_encode(['ok' => true, 'results' => $results], JSON_PRETTY_PRINT);
    exit;
}, 1);
