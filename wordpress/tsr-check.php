<?php
/**
 * Temporary diagnostics — delete after use.
 * Visit: http://cms.thesportsrivalry.com/tsr-check.php
 */
require __DIR__ . '/wp-load.php';

header('Content-Type: text/plain; charset=utf-8');

echo "ABSPATH: " . ABSPATH . "\n";
echo "WP_CONTENT_DIR: " . WP_CONTENT_DIR . "\n";
echo "WP_PLUGIN_DIR: " . WP_PLUGIN_DIR . "\n";
echo "Headless core: " . (function_exists('sr_register_content_types') ? 'yes' : 'no') . "\n";
echo "Articles CPT: " . (post_type_exists('article') ? 'yes' : 'no') . "\n";
echo "\nPlugins on disk:\n";

if (is_dir(WP_PLUGIN_DIR)) {
    foreach (scandir(WP_PLUGIN_DIR) as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        echo " - {$entry}\n";
    }
}

echo "\nMu-plugins on disk:\n";
$mu = defined('WPMU_PLUGIN_DIR') ? WPMU_PLUGIN_DIR : WP_CONTENT_DIR . '/mu-plugins';
if (is_dir($mu)) {
    foreach (scandir($mu) as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        echo " - {$entry}\n";
    }
}
