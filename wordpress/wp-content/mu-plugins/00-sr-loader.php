<?php
/**
 * Plugin Name: The Sports Rivalry Loader
 * Description: Loads The Sports Rivalry mu-plugin bundle in the correct order.
 */

if (!defined('ABSPATH')) {
    exit;
}

$core = __DIR__ . '/sr-headless-core.php';

if (!function_exists('sr_register_content_types') && file_exists($core)) {
    require_once $core;
}
