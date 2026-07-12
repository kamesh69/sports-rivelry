<?php
/**
 * Seed homepage editorial settings from published articles.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'sr_register_seed_homepage_admin_page', 22);

function sr_register_seed_homepage_admin_page() {
    add_submenu_page(
        'sports-rivalry-layout',
        'Seed Homepage',
        'Seed Homepage',
        'manage_options',
        'sr-seed-homepage',
        'sr_render_seed_homepage_admin_page'
    );
}

function sr_render_seed_homepage_admin_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['sr_seed_homepage']) && check_admin_referer('sr_seed_homepage_action')) {
        $result = sr_seed_homepage_settings();
        $class = !empty($result['success']) ? 'notice-success' : 'notice-error';
        echo '<div class="notice ' . esc_attr($class) . '"><p>' . esc_html($result['message']) . '</p></div>';
    }

    echo '<div class="wrap"><h1>Seed Homepage</h1>';
    echo '<p>Populates hero, editor\'s picks, category strip, quick hits, and featured authors from published articles.</p>';
    echo '<form method="post">';
    wp_nonce_field('sr_seed_homepage_action');
    submit_button('Run Homepage Seed', 'primary', 'sr_seed_homepage');
    echo '</form></div>';
}

function sr_find_article_id_by_slug($slug) {
    $post = get_page_by_path(sanitize_title($slug), OBJECT, 'article');

    return $post instanceof WP_Post ? (int) $post->ID : 0;
}

function sr_find_author_id_by_slug($slug) {
    $user = get_user_by('slug', sanitize_title($slug));

    return $user ? (int) $user->ID : 0;
}

function sr_seed_homepage_settings() {
    $hero_slug = 'yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it';
    $editor_slugs = [
        'yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it',
        'dodgers-padres-have-found-the-perfect-october-hate-cycle',
        'mets-braves-keep-punishing-any-team-that-blinks-first',
        'orioles-blue-jays-keep-building-the-division-race-that-refuses-to-relax',
    ];

    $hero_id = sr_find_article_id_by_slug($hero_slug);

    if (!$hero_id) {
        $latest = get_posts([
            'post_type' => 'article',
            'post_status' => 'publish',
            'numberposts' => 1,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        $hero_id = !empty($latest[0]) ? (int) $latest[0]->ID : 0;
    }

    $editor_ids = array_values(array_filter(array_map('sr_find_article_id_by_slug', $editor_slugs)));

    if (empty($editor_ids)) {
        $fallback = get_posts([
            'post_type' => 'article',
            'post_status' => 'publish',
            'numberposts' => 4,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        $editor_ids = array_map(function($post) {
            return (int) $post->ID;
        }, $fallback);
    }

    $author_id = sr_find_author_id_by_slug('miles-donovan');

    if (!$author_id) {
        $author_id = (int) get_current_user_id();
    }

    $category_strip = [
        ['label' => 'MLB', 'href' => '/mlb', 'sportSlug' => 'mlb'],
        ['label' => 'Golf', 'href' => '/golf', 'sportSlug' => 'golf'],
        ['label' => 'NBA', 'href' => '/basketball', 'sportSlug' => 'basketball'],
        ['label' => 'NASCAR', 'href' => '/nascar', 'sportSlug' => 'nascar'],
    ];

    $quick_hits = [
        'enabled' => true,
        'title' => 'MLB pennant-race week: Miles Donovan\'s quick hits',
        'selectionMode' => 'manual',
        'featuredArticleSlug' => 'yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it',
        'secondaryArticleSlugs' => [
            'dodgers-padres-have-found-the-perfect-october-hate-cycle',
            'mets-braves-keep-punishing-any-team-that-blinks-first',
        ],
        'authorSlug' => 'miles-donovan',
        'sportSlug' => 'mlb',
        'secondaryCount' => 2,
    ];

    $settings = [
        'homepage_hero_article' => $hero_id,
        'homepage_breaking_slugs' => [$hero_slug],
        'homepage_sport_rail_order' => ['mlb', 'basketball', 'golf', 'nascar', 'football'],
        'homepage_editors_pick_ids' => $editor_ids,
        'homepage_featured_author_ids' => $author_id ? [$author_id] : [],
        'homepage_newsletter_issue' => 0,
        'homepage_category_strip_json' => wp_json_encode($category_strip),
        'homepage_quick_hits_json' => wp_json_encode($quick_hits),
    ];

    sr_save_homepage_storage($settings);

    if (function_exists('sr_revalidate_homepage_after_save')) {
        sr_revalidate_homepage_after_save();
    }

    return [
        'success' => (bool) $hero_id,
        'message' => $hero_id
            ? sprintf('Homepage seeded (hero ID %d, %d editor picks).', $hero_id, count($editor_ids))
            : 'No published articles found to seed homepage.',
    ];
}

add_action('init', function () {
    if (!defined('SR_BOOTSTRAP_SECRET')) {
        return;
    }

    $token = isset($_GET['sr_seed_homepage']) ? (string) $_GET['sr_seed_homepage'] : '';

    if ($token === '' || !hash_equals(SR_BOOTSTRAP_SECRET, $token)) {
        return;
    }

    $result = sr_seed_homepage_settings();

    if (defined('WP_CLI')) {
        return;
    }

    header('Content-Type: application/json; charset=utf-8');
    echo wp_json_encode(['ok' => !empty($result['success']), 'result' => $result], JSON_PRETTY_PRINT);
    exit;
}, 1);

if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('sr seed-homepage', function() {
        $result = sr_seed_homepage_settings();
        WP_CLI::success($result['message']);
    });
}
