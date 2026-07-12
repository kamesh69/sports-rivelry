<?php
/**
 * Show www.thesportsrivalry.com URLs in wp-admin (permalink, preview, list actions).
 */

if (!defined('ABSPATH')) {
    exit;
}

add_filter('preview_post_link', 'sr_filter_frontend_preview_post_link', 10, 2);
add_filter('post_type_link', 'sr_filter_post_type_link_to_frontend', 10, 2);
add_filter('get_sample_permalink', 'sr_filter_sample_permalink_to_frontend', 99, 5);
add_filter('get_sample_permalink_html', 'sr_filter_sample_permalink_html', 99, 5);
add_filter('post_row_actions', 'sr_filter_post_row_actions_frontend', 10, 2);
add_action('admin_enqueue_scripts', 'sr_enqueue_frontend_permalink_admin_assets');
add_action('wp_ajax_sr_frontend_preview_url', 'sr_ajax_frontend_preview_url');
add_action('add_meta_boxes', 'sr_register_frontend_url_meta_boxes', 25);
add_action('post_submitbox_misc_actions', 'sr_render_submitbox_frontend_link');
add_action('template_redirect', 'sr_redirect_editorial_singles_to_frontend', 1);
add_action('admin_notices', 'sr_admin_notice_article_missing_sport');
add_action('add_meta_boxes', 'sr_ensure_article_sport_meta_box', 5);
add_action('add_meta_boxes', 'sr_register_article_sport_selector_meta_box', 6);

function sr_ensure_article_sport_meta_box() {
    if (!taxonomy_exists('sport')) {
        return;
    }

    register_taxonomy_for_object_type('sport', 'article');
}

function sr_register_article_sport_selector_meta_box() {
    add_meta_box(
        'sr-article-sport',
        'Sport (required for website URL)',
        'sr_render_article_sport_selector_meta_box',
        'article',
        'side',
        'high'
    );
}

function sr_render_article_sport_selector_meta_box($post) {
    $terms = get_terms([
        'taxonomy' => 'sport',
        'hide_empty' => false,
    ]);
    $selected = wp_get_post_terms($post->ID, 'sport', ['fields' => 'ids']);
    $selected_id = !empty($selected[0]) ? (int) $selected[0] : 0;

    wp_nonce_field('sr_save_article_sport', 'sr_article_sport_nonce');

    echo '<p class="description" style="margin-top:0;">Choose the sport section where this article will appear on <code>www.thesportsrivalry.com</code>.</p>';
    echo '<select name="sr_article_sport_term" id="sr-article-sport-term" style="width:100%;">';
    echo '<option value="">Select sport…</option>';

    if (!is_wp_error($terms)) {
        foreach ($terms as $term) {
            printf(
                '<option value="%1$d" data-slug="%3$s" %2$s>%4$s</option>',
                (int) $term->term_id,
                selected($selected_id, (int) $term->term_id, false),
                esc_attr($term->slug),
                esc_html($term->name)
            );
        }
    }

    echo '</select>';
}

add_action('save_post_article', 'sr_save_article_sport_selector_meta_box', 12, 2);

function sr_save_article_sport_selector_meta_box($post_id, $post) {
    if (!isset($_POST['sr_article_sport_nonce']) || !wp_verify_nonce($_POST['sr_article_sport_nonce'], 'sr_save_article_sport')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $term_id = (int) ($_POST['sr_article_sport_term'] ?? 0);

    if ($term_id > 0) {
        wp_set_post_terms($post_id, [$term_id], 'sport', false);
        return;
    }

    wp_set_post_terms($post_id, [], 'sport', false);
}

function sr_get_frontend_base_url() {
    $url = defined('SR_FRONTEND_URL') ? SR_FRONTEND_URL : '';

    return $url ? untrailingslashit($url) : '';
}

function sr_resolve_editorial_post($post) {
    if ($post instanceof WP_Post) {
        return $post;
    }

    if (is_numeric($post)) {
        return get_post((int) $post);
    }

    return null;
}

function sr_build_frontend_url_for_post($post) {
    $post = sr_resolve_editorial_post($post);

    if (!$post || !in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return '';
    }

    $base = sr_get_frontend_base_url();

    if (!$base) {
        return '';
    }

    $path = sr_frontend_path_for_post($post->ID);

    if (!$path) {
        return '';
    }

    return $base . $path;
}

function sr_build_frontend_path_for_post($post, $sport_slug_override = '') {
    $post = sr_resolve_editorial_post($post);

    if (!$post || 'article' !== $post->post_type) {
        return sr_frontend_path_for_post($post ? $post->ID : 0);
    }

    $sport_slug = sanitize_title($sport_slug_override);

    if (!$sport_slug) {
        return sr_frontend_path_for_post($post->ID);
    }

    $slug = $post->post_name ?: sanitize_title($post->post_title);

    if (!$slug) {
        return '';
    }

    return '/' . $sport_slug . '/' . $slug;
}

function sr_normalize_frontend_article_path($path) {
    $segments = array_values(array_filter(explode('/', trim((string) $path, '/'))));

    if (count($segments) < 2 || in_array($segments[0], ['choose-sport'], true)) {
        return '';
    }

    return '/' . implode('/', $segments);
}

function sr_build_frontend_preview_url($path) {
    $frontend_url = sr_get_frontend_base_url();
    $preview_secret = defined('SR_PREVIEW_SECRET') ? SR_PREVIEW_SECRET : '';
    $normalized_path = sr_normalize_frontend_article_path($path);

    if (!$frontend_url || !$preview_secret || !$normalized_path) {
        return '';
    }

    return $frontend_url . '/api/preview?' . http_build_query([
        'secret' => $preview_secret,
        'slug' => $normalized_path,
    ], '', '&', PHP_QUERY_RFC3986);
}

function sr_build_preview_url_for_post($post, $sport_slug_override = '') {
    $post = sr_resolve_editorial_post($post);

    if (!$post || !in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return '';
    }

    $path = sr_build_frontend_path_for_post($post, $sport_slug_override);

    return sr_build_frontend_preview_url($path);
}

function sr_filter_frontend_preview_post_link($preview_link, $post) {
    $preview_url = sr_build_preview_url_for_post($post);

    return $preview_url ?: $preview_link;
}

function sr_filter_post_type_link_to_frontend($post_link, $post) {
    $post = sr_resolve_editorial_post($post);

    if (!$post || !in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return $post_link;
    }

    $frontend = sr_build_frontend_url_for_post($post);

    return $frontend ?: $post_link;
}

function sr_get_article_sport_slug_for_permalink($post_id) {
    $sports = wp_get_post_terms($post_id, 'sport', ['fields' => 'slugs']);

    return !empty($sports[0]) ? $sports[0] : 'choose-sport';
}

function sr_build_frontend_permalink_template($post) {
    $base = sr_get_frontend_base_url();

    if (!$base) {
        return '';
    }

    if ('article' === $post->post_type) {
        return $base . '/' . sr_get_article_sport_slug_for_permalink($post->ID) . '/%postname%/';
    }

    if ('newsletter_issue' === $post->post_type) {
        return $base . '/newsletters/%postname%/';
    }

    if ('landing_page' === $post->post_type) {
        return $base . '/%postname%/';
    }

    return $base . '/%postname%/';
}

function sr_resolve_permalink_slug($post, $title, $name) {
    $slug = $name;

    if ('' === $slug || null === $slug) {
        $slug = $post->post_name;
    }

    if ('' === $slug || null === $slug) {
        $slug = sanitize_title($title);
    }

    if ('' === $slug) {
        $slug = '%postname%';
    }

    return $slug;
}

function sr_filter_sample_permalink_to_frontend($permalink, $post_id, $title, $name, $post) {
    $post = sr_resolve_editorial_post($post ?: $post_id);

    if (!$post || !in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return $permalink;
    }

    $template = sr_build_frontend_permalink_template($post);

    if (!$template) {
        return $permalink;
    }

    return [$template, sr_resolve_permalink_slug($post, $title, $name)];
}

function sr_filter_sample_permalink_html($html, $post_id, $new_title, $new_slug, $post) {
    $post = sr_resolve_editorial_post($post ?: $post_id);

    if (!$post || !in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return $html;
    }

    if (!sr_get_frontend_base_url()) {
        return $html;
    }

    $html = str_replace(__('Permalink:'), __('Website URL:'), $html);

    $cms_hosts = array_unique(array_filter([
        wp_parse_url(home_url(), PHP_URL_HOST),
        wp_parse_url(site_url(), PHP_URL_HOST),
    ]));
    $frontend_host = wp_parse_url(sr_get_frontend_base_url(), PHP_URL_HOST);

    if ($frontend_host) {
        foreach ($cms_hosts as $cms_host) {
            $html = str_replace($cms_host, $frontend_host, $html);
        }
    }

    $html = preg_replace('/[?&]preview=true/', '', $html);
    $html = preg_replace('/\?post_type=[^&"\']+&p=\d+/', '', $html);
    $html = str_replace('?&', '?', $html);

    return $html;
}

function sr_enqueue_frontend_permalink_admin_assets($hook) {
    if (!in_array($hook, ['post.php', 'post-new.php'], true)) {
        return;
    }

    $screen = function_exists('get_current_screen') ? get_current_screen() : null;

    if (!$screen || !in_array($screen->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return;
    }

    $script_path = __DIR__ . '/sr-frontend-permalink.js';
    $script_version = file_exists($script_path) ? (string) filemtime($script_path) : '1.0.0';

    wp_register_script('sr-frontend-permalink', '', ['jquery'], $script_version, true);

    if (file_exists($script_path)) {
        wp_add_inline_script('sr-frontend-permalink', file_get_contents($script_path));
    }

    wp_enqueue_script('sr-frontend-permalink');

    $sport_terms = [];

    if ('article' === $screen->post_type) {
        $terms = get_terms([
            'taxonomy' => 'sport',
            'hide_empty' => false,
        ]);

        if (!is_wp_error($terms)) {
            foreach ($terms as $term) {
                $sport_terms[(string) $term->term_id] = $term->slug;
            }
        }
    }

    wp_localize_script('sr-frontend-permalink', 'srFrontendPermalink', [
        'baseUrl' => sr_get_frontend_base_url(),
        'postType' => $screen->post_type,
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'previewNonce' => wp_create_nonce('sr_frontend_preview_url'),
        'sportTerms' => $sport_terms,
    ]);

    wp_add_inline_style('wp-admin', '
        #edit-slug-box strong { font-weight: 600; }
        #sr-frontend-url .inside p.description code { word-break: break-word; }
    ');
}

function sr_ajax_frontend_preview_url() {
    check_ajax_referer('sr_frontend_preview_url', 'nonce');

    if (!current_user_can('edit_posts')) {
        wp_send_json_error(['message' => 'Forbidden'], 403);
    }

    $post_id = (int) ($_POST['post_id'] ?? 0);
    $sport_slug = sanitize_title((string) ($_POST['sport_slug'] ?? ''));
    $post_slug = sanitize_title((string) ($_POST['post_slug'] ?? ''));
    $post_title = sanitize_text_field((string) ($_POST['post_title'] ?? ''));
    $post = get_post($post_id);

    if (!$post || !in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        wp_send_json_error(['message' => 'Invalid post'], 400);
    }

    if ($post_slug && $post_slug !== $post->post_name) {
        $post = clone $post;
        $post->post_name = $post_slug;
    } elseif (!$post->post_name && $post_title) {
        $post = clone $post;
        $post->post_name = sanitize_title($post_title);
    } elseif (!$post->post_name && $post->post_title) {
        $post = clone $post;
        $post->post_name = sanitize_title($post->post_title);
    }

    $preview_url = sr_build_preview_url_for_post($post, $sport_slug);

    if (!$preview_url) {
        wp_send_json_error(['message' => 'Add a title, choose a sport, then click Save Draft before previewing.'], 400);
    }

    wp_send_json_success(['url' => $preview_url]);
}

function sr_filter_post_row_actions_frontend($actions, $post) {
    if (!in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return $actions;
    }

    $live_url = sr_build_frontend_url_for_post($post);

    if ($live_url && 'publish' === $post->post_status) {
        $actions['view'] = sprintf(
            '<a href="%s" target="_blank" rel="noopener noreferrer">View on website</a>',
            esc_url($live_url)
        );
    }

    $preview_url = sr_build_preview_url_for_post($post);

    if ($preview_url && 'publish' !== $post->post_status) {
        $actions['preview'] = sprintf(
            '<a href="%s" target="_blank" rel="noopener noreferrer">Preview on website</a>',
            esc_url($preview_url)
        );
    }

    return $actions;
}

function sr_register_frontend_url_meta_boxes() {
    foreach (SR_EDITORIAL_POST_TYPES as $post_type) {
        add_meta_box(
            'sr-frontend-url',
            'Website preview',
            'sr_render_frontend_url_meta_box',
            $post_type,
            'side',
            'default'
        );
    }
}

function sr_render_frontend_url_meta_box($post) {
    $preview_url = sr_build_preview_url_for_post($post);
    $base = sr_get_frontend_base_url();

    if (!$base) {
        echo '<p class="description">Set <code>SR_FRONTEND_URL</code> in wp-config to link this editor to the public site.</p>';
        return;
    }

    if ($preview_url) {
        echo '<p><a class="button button-secondary" href="' . esc_url($preview_url) . '" target="_blank" rel="noopener noreferrer">Preview on website</a></p>';
        return;
    }

    if ('article' === $post->post_type) {
        echo '<p class="description">Select a <strong>Sport</strong>, click <strong>Save Draft</strong>, then use preview. The website URL above updates immediately when you change sport.</p>';
        return;
    }

    echo '<p class="description">Save the post to generate a website preview link.</p>';
}

function sr_render_submitbox_frontend_link() {
    global $post;

    if (!$post || !in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return;
    }

    $live_url = sr_build_frontend_url_for_post($post);
    $preview_url = sr_build_preview_url_for_post($post);

    if ($live_url) {
        echo '<div class="misc-pub-section misc-pub-frontend-url">';
        echo '<span class="dashicons dashicons-admin-links" style="color:#646970;margin-right:4px;"></span>';
        echo '<a href="' . esc_url($live_url) . '" target="_blank" rel="noopener noreferrer">View on website</a>';
        echo '</div>';
        return;
    }

    if ($preview_url) {
        echo '<div class="misc-pub-section misc-pub-frontend-url">';
        echo '<span class="dashicons dashicons-visibility" style="color:#646970;margin-right:4px;"></span>';
        echo '<a href="' . esc_url($preview_url) . '" target="_blank" rel="noopener noreferrer">Preview on website</a>';
        echo '</div>';
    }
}

function sr_redirect_editorial_singles_to_frontend() {
    if (is_admin() || !is_singular(SR_EDITORIAL_POST_TYPES)) {
        return;
    }

    $post = get_queried_object();

    if (!$post instanceof WP_Post) {
        return;
    }

    $url = sr_build_frontend_url_for_post($post);

    if ($url) {
        wp_safe_redirect($url, 301);
        exit;
    }
}

function sr_admin_notice_article_missing_sport() {
    if (!is_admin() || !function_exists('get_current_screen')) {
        return;
    }

    $screen = get_current_screen();

    if (!$screen || 'article' !== $screen->post_type || !in_array($screen->base, ['post', 'post-new'], true)) {
        return;
    }

    $post_id = isset($_GET['post']) ? (int) $_GET['post'] : 0;

    if (!$post_id) {
        return;
    }

    $sports = wp_get_post_terms($post_id, 'sport', ['fields' => 'slugs']);

    if (!empty($sports)) {
        return;
    }

    echo '<div class="notice notice-warning"><p><strong>Assign a Sport</strong> before publishing so this article appears at <code>www.thesportsrivalry.com/{sport}/{slug}</code> instead of only inside the CMS.</p></div>';
}
