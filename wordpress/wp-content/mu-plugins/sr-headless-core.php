<?php
/**
 * Plugin Name: Sports Rivalry Headless Core
 * Description: Registers Sports Rivalry content models, exposes them to WPGraphQL, and notifies the Next.js frontend to revalidate pages after editorial changes.
 * Author: Sports Rivalry
 * Version: 0.1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

const SR_EDITORIAL_POST_TYPES = ['article', 'live_blog', 'video', 'newsletter_issue', 'landing_page'];
const SR_EDITORIAL_TAXONOMIES = ['sport', 'league', 'team', 'tournament', 'topic'];

add_action('init', 'sr_register_content_types');
add_action('init', 'sr_register_taxonomies');
add_action('acf/init', 'sr_register_acf_option_pages');
add_action('save_post', 'sr_trigger_frontend_revalidation', 20, 3);
add_filter('preview_post_link', 'sr_filter_preview_post_link', 10, 2);

function sr_register_content_types() {
    $post_types = [
        'article' => [
            'label' => 'Articles',
            'menu_icon' => 'dashicons-media-document',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions'],
            'graphql_single_name' => 'Article',
            'graphql_plural_name' => 'Articles',
        ],
        'live_blog' => [
            'label' => 'Live Blogs',
            'menu_icon' => 'dashicons-rss',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions'],
            'graphql_single_name' => 'LiveBlog',
            'graphql_plural_name' => 'LiveBlogs',
        ],
        'video' => [
            'label' => 'Videos',
            'menu_icon' => 'dashicons-video-alt3',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions'],
            'graphql_single_name' => 'Video',
            'graphql_plural_name' => 'Videos',
        ],
        'newsletter_issue' => [
            'label' => 'Newsletter Issues',
            'menu_icon' => 'dashicons-email',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
            'graphql_single_name' => 'NewsletterIssue',
            'graphql_plural_name' => 'NewsletterIssues',
        ],
        'landing_page' => [
            'label' => 'Landing Pages',
            'menu_icon' => 'dashicons-layout',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
            'graphql_single_name' => 'LandingPage',
            'graphql_plural_name' => 'LandingPages',
        ],
    ];

    foreach ($post_types as $slug => $config) {
        register_post_type($slug, [
            'labels' => [
                'name' => $config['label'],
                'singular_name' => rtrim($config['label'], 's'),
            ],
            'public' => true,
            'show_ui' => true,
            'show_in_rest' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => $config['graphql_single_name'],
            'graphql_plural_name' => $config['graphql_plural_name'],
            'menu_icon' => $config['menu_icon'],
            'has_archive' => false,
            'rewrite' => ['slug' => $slug],
            'supports' => $config['supports'],
        ]);
    }

    $meta_fields = [
        'deck' => 'string',
        'read_time' => 'integer',
        'canonical_override' => 'string',
        'trending_score' => 'integer',
        'source_references' => 'string',
        'is_breaking' => 'boolean',
        'is_editors_pick' => 'boolean',
    ];

    foreach (SR_EDITORIAL_POST_TYPES as $post_type) {
        foreach ($meta_fields as $key => $type) {
            register_post_meta($post_type, $key, [
                'show_in_rest' => true,
                'single' => true,
                'type' => $type,
                'auth_callback' => function() {
                    return current_user_can('edit_posts');
                },
            ]);
        }
    }
}

function sr_register_taxonomies() {
    $taxonomies = [
        'sport' => ['label' => 'Sports', 'graphql_single_name' => 'Sport', 'graphql_plural_name' => 'Sports'],
        'league' => ['label' => 'Leagues', 'graphql_single_name' => 'League', 'graphql_plural_name' => 'Leagues'],
        'team' => ['label' => 'Teams', 'graphql_single_name' => 'Team', 'graphql_plural_name' => 'Teams'],
        'tournament' => ['label' => 'Tournaments', 'graphql_single_name' => 'Tournament', 'graphql_plural_name' => 'Tournaments'],
        'topic' => ['label' => 'Topics', 'graphql_single_name' => 'Topic', 'graphql_plural_name' => 'Topics'],
    ];

    foreach ($taxonomies as $slug => $config) {
        register_taxonomy($slug, SR_EDITORIAL_POST_TYPES, [
            'label' => $config['label'],
            'public' => true,
            'hierarchical' => true,
            'show_ui' => true,
            'show_in_rest' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => $config['graphql_single_name'],
            'graphql_plural_name' => $config['graphql_plural_name'],
            'rewrite' => ['slug' => $slug],
        ]);
    }
}

function sr_register_acf_option_pages() {
    if (!function_exists('acf_add_options_page')) {
        return;
    }

    acf_add_options_page([
        'page_title' => 'Sports Rivalry Layout Settings',
        'menu_title' => 'SR Layout',
        'menu_slug' => 'sports-rivalry-layout',
        'capability' => 'edit_posts',
        'redirect' => false,
    ]);

    $sub_pages = [
        ['page_title' => 'Homepage Layout', 'menu_title' => 'Homepage', 'menu_slug' => 'sr-home-layout'],
        ['page_title' => 'Hero Slots', 'menu_title' => 'Hero Slots', 'menu_slug' => 'sr-hero-slots'],
        ['page_title' => 'Quick Hits', 'menu_title' => 'Quick Hits', 'menu_slug' => 'sr-quick-hits'],
        ['page_title' => 'Newsletter Slots', 'menu_title' => 'Newsletters', 'menu_slug' => 'sr-newsletter-slots'],
        ['page_title' => 'Trending Config', 'menu_title' => 'Trending', 'menu_slug' => 'sr-trending-config'],
        ['page_title' => 'Sponsor and Ad Placements', 'menu_title' => 'Ad Placements', 'menu_slug' => 'sr-ad-placements'],
    ];

    foreach ($sub_pages as $sub_page) {
        acf_add_options_sub_page(array_merge($sub_page, [
            'parent_slug' => 'sports-rivalry-layout',
        ]));
    }
}

function sr_filter_preview_post_link($preview_link, $post) {
    if (!in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return $preview_link;
    }

    $frontend_url = defined('SR_FRONTEND_URL') ? untrailingslashit(SR_FRONTEND_URL) : '';
    $preview_secret = defined('SR_PREVIEW_SECRET') ? SR_PREVIEW_SECRET : '';

    if (!$frontend_url || !$preview_secret) {
        return $preview_link;
    }

    $path = sr_frontend_path_for_post($post->ID);

    if (!$path) {
        return $preview_link;
    }

    return add_query_arg([
        'secret' => $preview_secret,
        'slug' => $path,
    ], $frontend_url . '/api/preview');
}

function sr_trigger_frontend_revalidation($post_id, $post, $update) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    if (!$update || !in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return;
    }

    $endpoint = defined('SR_REVALIDATE_ENDPOINT') ? SR_REVALIDATE_ENDPOINT : '';
    $secret = defined('SR_REVALIDATE_SECRET') ? SR_REVALIDATE_SECRET : '';

    if (!$endpoint || !$secret) {
        return;
    }

    $paths = sr_revalidation_paths_for_post($post_id, $post->post_type);
    $tags = ['wordpress', $post->post_type];

    wp_remote_post($endpoint, [
        'headers' => [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $secret,
        ],
        'body' => wp_json_encode([
            'paths' => array_values(array_unique($paths)),
            'tags' => $tags,
        ]),
        'timeout' => 10,
    ]);
}

function sr_revalidation_paths_for_post($post_id, $post_type) {
    $paths = ['/', '/search', '/authors'];
    $primary_path = sr_frontend_path_for_post($post_id);

    if ($primary_path) {
        $paths[] = $primary_path;
    }

    if ($post_type === 'article') {
        $sports = wp_get_post_terms($post_id, 'sport', ['fields' => 'slugs']);
        $leagues = wp_get_post_terms($post_id, 'league', ['fields' => 'slugs']);
        $topics = wp_get_post_terms($post_id, 'topic', ['fields' => 'slugs']);

        foreach ($sports as $sport_slug) {
            $paths[] = '/' . $sport_slug;
        }

        foreach ($sports as $sport_slug) {
            foreach ($leagues as $league_slug) {
                $paths[] = '/' . $sport_slug . '/' . $league_slug;
            }
        }

        foreach ($topics as $topic_slug) {
            $paths[] = '/topics/' . $topic_slug;
        }

        $author_path = sr_author_path_for_post($post_id);
        if ($author_path) {
            $paths[] = $author_path;
        }
    }

    if ($post_type === 'newsletter_issue') {
        $paths[] = '/newsletters';
    }

    if ($post_type === 'landing_page') {
        $paths[] = '/topics';
    }

    return $paths;
}

function sr_frontend_path_for_post($post_id) {
    $post = get_post($post_id);

    if (!$post) {
        return '';
    }

    if ($post->post_type === 'article') {
        $sports = wp_get_post_terms($post_id, 'sport', ['fields' => 'slugs']);

        if (empty($sports)) {
            return '';
        }

        return '/' . $sports[0] . '/' . $post->post_name;
    }

    if ($post->post_type === 'newsletter_issue') {
        return '/newsletters/' . $post->post_name;
    }

    if ($post->post_type === 'landing_page') {
        return '/' . $post->post_name;
    }

    return '';
}

function sr_author_path_for_post($post_id) {
    $author_id = (int) get_post_field('post_author', $post_id);

    if (!$author_id) {
        return '';
    }

    $author = get_userdata($author_id);

    if (!$author) {
        return '';
    }

    return '/authors/' . $author->user_nicename;
}
