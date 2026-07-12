<?php
/**
 * Ensure WPGraphQL stays active on shared hosting bootstrap.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('plugins_loaded', function () {
    $plugin = 'wp-graphql/wp-graphql.php';
    if (!file_exists(WP_PLUGIN_DIR . '/' . $plugin)) {
        return;
    }
    if (is_plugin_active($plugin)) {
        return;
    }
    if (!function_exists('activate_plugin')) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    activate_plugin($plugin);
}, 1);
