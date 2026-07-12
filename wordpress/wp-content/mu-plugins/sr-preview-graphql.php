<?php
/**
 * Allow Next.js draft preview to read unpublished articles via GraphQL.
 */

if (!defined('ABSPATH')) {
    exit;
}

if (defined('SR_PREVIEW_GRAPHQL_LOADED')) {
    return;
}

define('SR_PREVIEW_GRAPHQL_LOADED', true);

add_filter('graphql_post_object_query_args', 'sr_allow_preview_graphql_post_query_args', 10, 5);
add_filter('graphql_post_object_connection_query_args', 'sr_allow_preview_graphql_post_connection_args', 10, 5);
add_filter('graphql_object_is_private', 'sr_allow_preview_graphql_private_models', 10, 5);
add_filter('graphql_PostObject_is_public', 'sr_allow_preview_graphql_public_posts', 10, 2);
add_action('graphql_register_types', 'sr_register_preview_article_graphql_field', 20);

function sr_get_preview_secret_from_request() {
    $secret = defined('SR_PREVIEW_SECRET') ? SR_PREVIEW_SECRET : '';

    if (!$secret) {
        return '';
    }

    $header = isset($_SERVER['HTTP_X_PREVIEW_SECRET']) ? (string) $_SERVER['HTTP_X_PREVIEW_SECRET'] : '';

    if ($header && hash_equals($secret, $header)) {
        return $secret;
    }

    return '';
}

function sr_is_preview_graphql_request() {
    return sr_get_preview_secret_from_request() !== '';
}

function sr_allow_preview_graphql_post_query_args($query_args, $source, $args, $context, $info) {
    if (!sr_is_preview_graphql_request()) {
        return $query_args;
    }

    $query_args['post_status'] = ['publish', 'draft', 'pending', 'future', 'private'];
    unset($query_args['perm']);

    return $query_args;
}

function sr_allow_preview_graphql_post_connection_args($query_args, $source, $args, $context, $info) {
    if (!sr_is_preview_graphql_request()) {
        return $query_args;
    }

    $query_args['post_status'] = ['publish', 'draft', 'pending', 'future', 'private'];
    unset($query_args['perm']);

    return $query_args;
}

function sr_allow_preview_graphql_private_models($is_private, $model_name, $data, $visibility, $owner) {
    if (!sr_is_preview_graphql_request() || 'PostObject' !== $model_name || !defined('SR_EDITORIAL_POST_TYPES')) {
        return $is_private;
    }

    if ($data instanceof WP_Post && in_array($data->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return false;
    }

    return $is_private;
}

function sr_allow_preview_graphql_public_posts($is_public, $post_id) {
    if (!sr_is_preview_graphql_request()) {
        return $is_public;
    }

    $post = get_post((int) $post_id);

    if ($post instanceof WP_Post && defined('SR_EDITORIAL_POST_TYPES') && in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return true;
    }

    return $is_public;
}

function sr_find_preview_article_post($slug) {
    global $wpdb;

    $slug = sanitize_title($slug);

    if (!$slug) {
        return null;
    }

    $statuses = ['publish', 'draft', 'pending', 'future', 'private', 'auto-draft'];
    $status_sql = "'" . implode("','", array_map('esc_sql', $statuses)) . "'";
    $post_id = $wpdb->get_var(
        $wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'article' AND post_status IN ({$status_sql}) AND post_name = %s ORDER BY ID DESC LIMIT 1",
            $slug
        )
    );

    if ($post_id) {
        return get_post((int) $post_id);
    }

    $rows = $wpdb->get_results(
        "SELECT ID, post_title FROM {$wpdb->posts} WHERE post_type = 'article' AND post_status IN ({$status_sql}) ORDER BY ID DESC LIMIT 100",
        ARRAY_A
    );

    foreach ($rows as $row) {
        if (sanitize_title((string) $row['post_title']) === $slug) {
            return get_post((int) $row['ID']);
        }
    }

    return null;
}

function sr_register_preview_article_graphql_field() {
    if (!function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_field('RootQuery', 'previewArticle', [
        'type' => 'Article',
        'description' => 'Read draft or pending articles when X-Preview-Secret matches.',
        'args' => [
            'slug' => [
                'type' => 'String',
                'description' => 'Article slug (post_name).',
            ],
            'databaseId' => [
                'type' => 'Int',
                'description' => 'WordPress post ID fallback.',
            ],
        ],
        'resolve' => function($source, $args, $context) {
            if (!sr_is_preview_graphql_request()) {
                return null;
            }

            $post = null;

            if (!empty($args['databaseId'])) {
                $candidate = get_post((int) $args['databaseId']);

                if ($candidate instanceof WP_Post && 'article' === $candidate->post_type) {
                    $post = $candidate;
                }
            }

            if (!$post && !empty($args['slug'])) {
                $post = sr_find_preview_article_post($args['slug']);
            }

            if (!$post) {
                return null;
            }

            if (class_exists('\WPGraphQL\Data\DataSource')) {
                return \WPGraphQL\Data\DataSource::resolve_post_object($post->ID, $context);
            }

            return $post;
        },
    ]);
}
