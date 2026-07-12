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
add_action('rest_api_init', 'sr_register_preview_article_rest_routes');

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

function sr_is_preview_request() {
    return sr_is_preview_graphql_request();
}

function sr_get_preview_editorial_post($post_id = 0, $slug = '') {
    if ($post_id > 0) {
        $candidate = get_post((int) $post_id);

        if ($candidate instanceof WP_Post && 'revision' === $candidate->post_type && $candidate->post_parent) {
            $candidate = get_post((int) $candidate->post_parent);
        }

        if ($candidate instanceof WP_Post && defined('SR_EDITORIAL_POST_TYPES') && in_array($candidate->post_type, SR_EDITORIAL_POST_TYPES, true)) {
            return $candidate;
        }
    }

    if ($slug) {
        return sr_find_preview_article_post($slug);
    }

    return null;
}

function sr_get_preview_author_slug($user) {
    if (!$user instanceof WP_User) {
        return 'staff';
    }

    $slug = sanitize_title($user->user_nicename ?: $user->display_name ?: 'staff');

    return $slug ?: 'staff';
}

function sr_build_preview_article_node(WP_Post $post) {
    $author = get_userdata((int) $post->post_author);
    $author_slug = sr_get_preview_author_slug($author);
    $author_name = $author instanceof WP_User
        ? ($author->display_name ?: $author->user_login)
        : 'Staff Writer';
    $sport_terms = wp_get_post_terms($post->ID, 'sport');
    $league_terms = wp_get_post_terms($post->ID, 'league');
    $topic_terms = wp_get_post_terms($post->ID, 'topic');
    $tag_terms = wp_get_post_terms($post->ID, 'post_tag');
    $thumbnail_id = get_post_thumbnail_id($post->ID);
    $image = $thumbnail_id ? wp_get_attachment_image_src($thumbnail_id, 'full') : false;
    $image_post = $thumbnail_id ? get_post($thumbnail_id) : null;
    $slug = $post->post_name ?: sanitize_title($post->post_title);
    $article_fields = function_exists('sr_resolve_article_fields_graphql')
        ? sr_resolve_article_fields_graphql($post->ID)
        : [];

    return [
        'databaseId' => (int) $post->ID,
        'slug' => $slug,
        'title' => $post->post_title,
        'excerpt' => $post->post_excerpt,
        'content' => apply_filters('the_content', $post->post_content),
        'date' => get_post_time('c', true, $post),
        'dateGmt' => get_post_time('c', true, $post),
        'modified' => get_post_modified_time('c', true, $post),
        'modifiedGmt' => get_post_modified_time('c', true, $post),
        'articleFields' => $article_fields,
        'featuredImage' => $image
            ? [
                'node' => [
                    'sourceUrl' => $image[0],
                    'altText' => $image_post instanceof WP_Post ? (string) get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true) : $post->post_title,
                    'caption' => $image_post instanceof WP_Post ? $image_post->post_excerpt : '',
                    'mediaDetails' => [
                        'width' => (int) ($image[1] ?? 0),
                        'height' => (int) ($image[2] ?? 0),
                    ],
                ],
            ]
            : null,
        'sports' => [
            'nodes' => array_map(static function($term) {
                return ['slug' => $term->slug];
            }, is_array($sport_terms) ? $sport_terms : []),
        ],
        'leagues' => [
            'nodes' => array_map(static function($term) {
                return ['slug' => $term->slug];
            }, is_array($league_terms) ? $league_terms : []),
        ],
        'topics' => [
            'nodes' => array_map(static function($term) {
                return ['slug' => $term->slug];
            }, is_array($topic_terms) ? $topic_terms : []),
        ],
        'tags' => [
            'nodes' => array_map(static function($term) {
                return ['name' => $term->name];
            }, is_array($tag_terms) ? $tag_terms : []),
        ],
        'author' => [
            'node' => [
                'slug' => $author_slug,
                'name' => $author_name,
                'firstName' => $author instanceof WP_User ? (string) $author->first_name : '',
                'lastName' => $author instanceof WP_User ? (string) $author->last_name : '',
            ],
        ],
    ];
}

function sr_register_preview_article_rest_routes() {
    register_rest_route('sr/v1', '/preview-article/(?P<id>\d+)', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function(WP_REST_Request $request) {
            if (!sr_is_preview_request()) {
                return new WP_Error('sr_preview_forbidden', 'Invalid preview secret.', ['status' => 403]);
            }

            $post = sr_get_preview_editorial_post((int) $request['id']);

            if (!$post instanceof WP_Post) {
                return new WP_Error('sr_preview_not_found', 'Preview article not found.', ['status' => 404]);
            }

            return sr_build_preview_article_node($post);
        },
    ]);

    register_rest_route('sr/v1', '/preview-article/by-slug/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function(WP_REST_Request $request) {
            if (!sr_is_preview_request()) {
                return new WP_Error('sr_preview_forbidden', 'Invalid preview secret.', ['status' => 403]);
            }

            $post = sr_get_preview_editorial_post(0, (string) $request['slug']);

            if (!$post instanceof WP_Post) {
                return new WP_Error('sr_preview_not_found', 'Preview article not found.', ['status' => 404]);
            }

            return sr_build_preview_article_node($post);
        },
    ]);
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
        "SELECT ID, post_title FROM {$wpdb->posts} WHERE post_type = 'article' AND post_status IN ({$status_sql}) ORDER BY ID DESC LIMIT 500",
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

            $post = sr_get_preview_editorial_post(
                !empty($args['databaseId']) ? (int) $args['databaseId'] : 0,
                !empty($args['slug']) ? (string) $args['slug'] : ''
            );

            if (!$post instanceof WP_Post) {
                return null;
            }

            if (class_exists('\WPGraphQL\Data\DataSource')) {
                return \WPGraphQL\Data\DataSource::resolve_post_object($post->ID, $context);
            }

            return null;
        },
    ]);
}
