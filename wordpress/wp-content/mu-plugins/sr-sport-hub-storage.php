<?php
/**
 * Generic sport hub settings storage (Plan C).
 */

if (!defined('ABSPATH')) {
    exit;
}

const SR_SUPPORTED_SPORT_HUBS = ['mlb', 'basketball', 'golf', 'nascar', 'football', 'badminton', 'kabaddi', 'wrestling', 'olympics'];

add_action('plugins_loaded', 'sr_migrate_legacy_mlb_hub_storage', 5);

function sr_sport_hub_option_key($sport) {
    return 'sr_sport_hub_' . sanitize_key($sport);
}

function sr_migrate_legacy_mlb_hub_storage() {
    $legacy = get_option(SR_MLB_HUB_OPTION, []);

    if (!is_array($legacy) || empty($legacy)) {
        return;
    }

    $current = get_option(sr_sport_hub_option_key('mlb'), []);

    if (!empty($current)) {
        return;
    }

    update_option(sr_sport_hub_option_key('mlb'), $legacy, false);
}

function sr_get_sport_hub_storage($sport) {
    $sport = sanitize_key($sport);
    $settings = get_option(sr_sport_hub_option_key($sport), []);

    if ('mlb' === $sport && empty($settings)) {
        $legacy = get_option(SR_MLB_HUB_OPTION, []);

        if (is_array($legacy) && !empty($legacy)) {
            return $legacy;
        }
    }

    return is_array($settings) ? $settings : [];
}

function sr_save_sport_hub_storage($sport, array $settings) {
    $sport = sanitize_key($sport);
    update_option(sr_sport_hub_option_key($sport), $settings, false);

    if ('mlb' === $sport) {
        update_option(SR_MLB_HUB_OPTION, $settings, false);
    }
}

function sr_get_sport_hub_field($sport, $field_name, $default = null) {
    $settings = sr_get_sport_hub_storage($sport);

    return array_key_exists($field_name, $settings) ? $settings[$field_name] : $default;
}

function sr_set_sport_hub_field($sport, $field_name, $value) {
    $settings = sr_get_sport_hub_storage($sport);
    $settings[$field_name] = $value;
    sr_save_sport_hub_storage($sport, $settings);
}

function sr_sport_hub_field_prefix($sport) {
    return sanitize_key($sport) . '_hub_';
}

function sr_configure_sport_hub_from_post_ids($sport, array $post_ids) {
    if (empty($post_ids)) {
        return;
    }

    $sport = sanitize_key($sport);
    $prefix = sr_sport_hub_field_prefix($sport);
    $settings = sr_get_sport_hub_storage($sport);

    $settings[$prefix . 'hero_article'] = (int) $post_ids[0];
    $settings[$prefix . 'featured_stories'] = array_slice(array_map('intval', $post_ids), 0, 4);
    $settings[$prefix . 'headlines'] = array_slice(array_map('intval', $post_ids), 0, 5);
    $settings[$prefix . 'trending'] = array_slice(array_map('intval', $post_ids), 0, 3);

    sr_save_sport_hub_storage($sport, $settings);
}

function sr_revalidate_sport_hub_after_save($sport) {
    $sport = sanitize_key($sport);
    $paths = ['/' . $sport];

    if ('mlb' === $sport) {
        $paths[] = '/mlb/news';
    }

    if (function_exists('sr_send_revalidation_request')) {
        sr_send_revalidation_request($paths, ['wordpress', $sport, 'sport-' . $sport]);
    }
}
