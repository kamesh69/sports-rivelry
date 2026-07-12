<?php
/**
 * Homepage editorial settings (Plan C).
 */

if (!defined('ABSPATH')) {
    exit;
}

const SR_HOMEPAGE_OPTION = 'sr_homepage_settings';

function sr_get_homepage_storage() {
    $settings = get_option(SR_HOMEPAGE_OPTION, []);

    return is_array($settings) ? $settings : [];
}

function sr_save_homepage_storage(array $settings) {
    update_option(SR_HOMEPAGE_OPTION, $settings, false);
}

function sr_get_homepage_field($field_name, $default = null) {
    $settings = sr_get_homepage_storage();

    return array_key_exists($field_name, $settings) ? $settings[$field_name] : $default;
}

function sr_revalidate_homepage_after_save() {
    if (function_exists('sr_send_revalidation_request')) {
        sr_send_revalidation_request(['/'], ['wordpress', 'home']);
    }
}
