<?php
/**
 * Newsletter, landing page, video, and live blog GraphQL extensions.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('add_meta_boxes', 'sr_register_newsletter_meta_boxes');
add_action('save_post_newsletter_issue', 'sr_save_newsletter_meta_box', 10, 2);

function sr_register_newsletter_meta_boxes() {
    add_meta_box('sr-newsletter-fields', 'Newsletter Fields', 'sr_render_newsletter_meta_box', 'newsletter_issue', 'side');
}

function sr_render_newsletter_meta_box($post) {
    wp_nonce_field('sr_newsletter_meta', 'sr_newsletter_meta_nonce');
    $schedule = get_post_meta($post->ID, 'newsletter_schedule', true);
    $cta = get_post_meta($post->ID, 'newsletter_cta_label', true);
    $hero = get_post_meta($post->ID, 'newsletter_hero_copy', true);
    $highlighted = get_post_meta($post->ID, 'newsletter_highlighted_article_ids', true);
    ?>
    <p><label>Schedule</label><input class="widefat" name="newsletter_schedule" value="<?php echo esc_attr($schedule); ?>"></p>
    <p><label>CTA label</label><input class="widefat" name="newsletter_cta_label" value="<?php echo esc_attr($cta); ?>"></p>
    <p><label>Hero copy</label><textarea class="widefat" name="newsletter_hero_copy" rows="3"><?php echo esc_textarea($hero); ?></textarea></p>
    <p><label>Highlighted article IDs</label><input class="widefat" name="newsletter_highlighted_article_ids" value="<?php echo esc_attr(is_array($highlighted) ? implode(',', $highlighted) : (string) $highlighted); ?>"></p>
    <?php
}

function sr_save_newsletter_meta_box($post_id, $post) {
    if (!isset($_POST['sr_newsletter_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['sr_newsletter_meta_nonce'])), 'sr_newsletter_meta')) {
        return;
    }

    update_post_meta($post_id, 'newsletter_schedule', sanitize_text_field(wp_unslash($_POST['newsletter_schedule'] ?? '')));
    update_post_meta($post_id, 'newsletter_cta_label', sanitize_text_field(wp_unslash($_POST['newsletter_cta_label'] ?? '')));
    update_post_meta($post_id, 'newsletter_hero_copy', sanitize_textarea_field(wp_unslash($_POST['newsletter_hero_copy'] ?? '')));
    update_post_meta($post_id, 'newsletter_highlighted_article_ids', sr_parse_post_id_list($_POST['newsletter_highlighted_article_ids'] ?? []));
}

function sr_build_newsletter_payload($post) {
    if (!$post instanceof WP_Post) {
        return null;
    }

    return [
        'slug' => $post->post_name,
        'title' => $post->post_title,
        'description' => $post->post_excerpt,
        'heroCopy' => (string) get_post_meta($post->ID, 'newsletter_hero_copy', true),
        'schedule' => (string) get_post_meta($post->ID, 'newsletter_schedule', true),
        'ctaLabel' => (string) get_post_meta($post->ID, 'newsletter_cta_label', true) ?: 'Subscribe',
        'highlightedArticleSlugs' => sr_normalize_post_slug_list(get_post_meta($post->ID, 'newsletter_highlighted_article_ids', true)),
    ];
}

function sr_build_landing_page_payload($post) {
    if (!$post instanceof WP_Post) {
        return null;
    }

    return [
        'slug' => $post->post_name,
        'title' => $post->post_title,
        'kicker' => (string) get_post_meta($post->ID, 'landing_kicker', true),
        'description' => $post->post_excerpt,
        'heroArticleSlug' => sr_normalize_post_slug(get_post_meta($post->ID, 'landing_hero_article', true)),
        'articleSlugs' => sr_normalize_post_slug_list(get_post_meta($post->ID, 'landing_article_ids', true)),
    ];
}

add_action('graphql_register_types', 'sr_register_content_graphql', 26);

function sr_register_content_graphql() {
    if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_object_type('SrNewsletterIssue', [
        'fields' => [
            'slug' => ['type' => 'String'],
            'title' => ['type' => 'String'],
            'description' => ['type' => 'String'],
            'heroCopy' => ['type' => 'String'],
            'schedule' => ['type' => 'String'],
            'ctaLabel' => ['type' => 'String'],
            'highlightedArticleSlugs' => ['type' => ['list_of' => 'String']],
        ],
    ]);

    register_graphql_object_type('SrLandingPage', [
        'fields' => [
            'slug' => ['type' => 'String'],
            'title' => ['type' => 'String'],
            'kicker' => ['type' => 'String'],
            'description' => ['type' => 'String'],
            'heroArticleSlug' => ['type' => 'String'],
            'articleSlugs' => ['type' => ['list_of' => 'String']],
        ],
    ]);

    register_graphql_field('RootQuery', 'newsletterIssue', [
        'type' => 'SrNewsletterIssue',
        'args' => ['slug' => ['type' => ['non_null' => 'String']]],
        'resolve' => function($source, $args) {
            $post = get_page_by_path(sanitize_title($args['slug'] ?? ''), OBJECT, 'newsletter_issue');

            return $post ? sr_build_newsletter_payload($post) : null;
        },
    ]);

    register_graphql_field('RootQuery', 'newsletterIssues', [
        'type' => ['list_of' => 'SrNewsletterIssue'],
        'resolve' => function() {
            $posts = get_posts(['post_type' => 'newsletter_issue', 'post_status' => 'publish', 'numberposts' => 100]);

            return array_values(array_filter(array_map('sr_build_newsletter_payload', $posts)));
        },
    ]);

    register_graphql_field('RootQuery', 'landingPage', [
        'type' => 'SrLandingPage',
        'args' => ['slug' => ['type' => ['non_null' => 'String']]],
        'resolve' => function($source, $args) {
            $post = get_page_by_path(sanitize_title($args['slug'] ?? ''), OBJECT, 'landing_page');

            return $post ? sr_build_landing_page_payload($post) : null;
        },
    ]);

    register_graphql_field('RootQuery', 'landingPages', [
        'type' => ['list_of' => 'SrLandingPage'],
        'resolve' => function() {
            $posts = get_posts(['post_type' => 'landing_page', 'post_status' => 'publish', 'numberposts' => 100]);

            return array_values(array_filter(array_map('sr_build_landing_page_payload', $posts)));
        },
    ]);

    register_graphql_field('RootQuery', 'srArticleSearch', [
        'type' => ['list_of' => 'String'],
        'description' => 'Article slugs matching search query.',
        'args' => [
            'query' => ['type' => ['non_null' => 'String']],
            'first' => ['type' => 'Int'],
        ],
        'resolve' => function($source, $args) {
            $query = sanitize_text_field($args['query'] ?? '');
            $first = min(50, max(1, (int) ($args['first'] ?? 20)));

            if (!$query) {
                return [];
            }

            $posts = get_posts([
                'post_type' => 'article',
                'post_status' => 'publish',
                's' => $query,
                'numberposts' => $first,
            ]);

            return array_values(array_filter(array_map(function($post) {
                return $post instanceof WP_Post ? $post->post_name : null;
            }, $posts)));
        },
    ]);

    if (function_exists('register_graphql_field')) {
        register_graphql_field('Video', 'videoFields', [
            'type' => 'String',
            'resolve' => function($video) {
                $post_id = isset($video->databaseId) ? (int) $video->databaseId : 0;

                if (!$post_id) {
                    return null;
                }

                return wp_json_encode([
                    'duration' => get_post_meta($post_id, 'video_duration', true),
                    'href' => get_post_meta($post_id, 'video_href', true),
                    'featured' => (bool) get_post_meta($post_id, 'video_featured', true),
                ]);
            },
        ]);

        register_graphql_field('LiveBlog', 'liveBlogFields', [
            'type' => 'String',
            'resolve' => function($live_blog) {
                $post_id = isset($live_blog->databaseId) ? (int) $live_blog->databaseId : 0;

                if (!$post_id) {
                    return null;
                }

                return wp_json_encode([
                    'isLive' => (bool) get_post_meta($post_id, 'live_blog_is_live', true),
                    'clock' => get_post_meta($post_id, 'live_blog_clock', true),
                ]);
            },
        ]);
    }
}

add_action('add_meta_boxes', 'sr_register_landing_meta_boxes');
add_action('save_post_landing_page', 'sr_save_landing_meta_box', 10, 2);

function sr_register_landing_meta_boxes() {
    add_meta_box('sr-landing-fields', 'Landing Page Fields', 'sr_render_landing_meta_box', 'landing_page', 'side');
}

function sr_render_landing_meta_box($post) {
    wp_nonce_field('sr_landing_meta', 'sr_landing_meta_nonce');
    ?>
    <p><label>Kicker</label><input class="widefat" name="landing_kicker" value="<?php echo esc_attr(get_post_meta($post->ID, 'landing_kicker', true)); ?>"></p>
    <p><label>Hero article ID</label><input class="widefat" name="landing_hero_article" value="<?php echo esc_attr(get_post_meta($post->ID, 'landing_hero_article', true)); ?>"></p>
    <p><label>Article IDs</label><input class="widefat" name="landing_article_ids" value="<?php echo esc_attr(implode(',', (array) get_post_meta($post->ID, 'landing_article_ids', true))); ?>"></p>
    <?php
}

function sr_save_landing_meta_box($post_id, $post) {
    if (!isset($_POST['sr_landing_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['sr_landing_meta_nonce'])), 'sr_landing_meta')) {
        return;
    }

    update_post_meta($post_id, 'landing_kicker', sanitize_text_field(wp_unslash($_POST['landing_kicker'] ?? '')));
    update_post_meta($post_id, 'landing_hero_article', (int) ($_POST['landing_hero_article'] ?? 0));
    update_post_meta($post_id, 'landing_article_ids', sr_parse_post_id_list($_POST['landing_article_ids'] ?? []));
}
