<?php
/**
 * Plugin Name: TSR Ping
 * Description: Confirms mu-plugins are loading on the server.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_notices', function () {
    if (!current_user_can('manage_options')) {
        return;
    }

    $headless = function_exists('sr_register_content_types') ? 'yes' : 'no';
    $articles = post_type_exists('article') ? 'yes' : 'no';

    echo '<div class="notice notice-info"><p><strong>TSR mu-plugins loaded.</strong> ';
    echo 'Headless core: ' . esc_html($headless) . '. Articles CPT: ' . esc_html($articles) . '.</p></div>';
});
