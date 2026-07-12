<?php
/**
 * Topic hub term meta + GraphQL.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('topic_add_form_fields', 'sr_topic_hub_add_fields');
add_action('topic_edit_form_fields', 'sr_topic_hub_edit_fields');
add_action('created_topic', 'sr_save_topic_hub_fields');
add_action('edited_topic', 'sr_save_topic_hub_fields');

function sr_topic_hub_add_fields() {
    ?>
    <div class="form-field">
        <label for="topic_description">Hub description</label>
        <textarea name="topic_description" id="topic_description" rows="3"></textarea>
    </div>
    <div class="form-field">
        <label for="topic_seo_title">SEO title</label>
        <input name="topic_seo_title" id="topic_seo_title" type="text">
    </div>
    <div class="form-field">
        <label for="topic_featured_article_ids">Featured article IDs (comma-separated)</label>
        <input name="topic_featured_article_ids" id="topic_featured_article_ids" type="text">
    </div>
    <?php
}

function sr_topic_hub_edit_fields($term) {
    $description = get_term_meta($term->term_id, 'topic_description', true);
    $seo_title = get_term_meta($term->term_id, 'topic_seo_title', true);
    $article_ids = get_term_meta($term->term_id, 'topic_featured_article_ids', true);
    ?>
    <tr class="form-field">
        <th><label for="topic_description">Hub description</label></th>
        <td><textarea name="topic_description" id="topic_description" rows="3" class="large-text"><?php echo esc_textarea($description); ?></textarea></td>
    </tr>
    <tr class="form-field">
        <th><label for="topic_seo_title">SEO title</label></th>
        <td><input name="topic_seo_title" id="topic_seo_title" type="text" class="regular-text" value="<?php echo esc_attr($seo_title); ?>"></td>
    </tr>
    <tr class="form-field">
        <th><label for="topic_featured_article_ids">Featured article IDs</label></th>
        <td><input name="topic_featured_article_ids" id="topic_featured_article_ids" type="text" class="regular-text" value="<?php echo esc_attr(is_array($article_ids) ? implode(',', $article_ids) : (string) $article_ids); ?>"></td>
    </tr>
    <?php
}

function sr_save_topic_hub_fields($term_id) {
    if (isset($_POST['topic_description'])) {
        update_term_meta($term_id, 'topic_description', sanitize_textarea_field(wp_unslash($_POST['topic_description'])));
    }

    if (isset($_POST['topic_seo_title'])) {
        update_term_meta($term_id, 'topic_seo_title', sanitize_text_field(wp_unslash($_POST['topic_seo_title'])));
    }

    if (isset($_POST['topic_featured_article_ids'])) {
        update_term_meta($term_id, 'topic_featured_article_ids', sr_parse_post_id_list($_POST['topic_featured_article_ids']));
    }
}

function sr_build_topic_hub_payload($term) {
    if (!$term instanceof WP_Term) {
        return null;
    }

    $article_ids = get_term_meta($term->term_id, 'topic_featured_article_ids', true);

    return [
        'slug' => $term->slug,
        'title' => $term->name,
        'description' => (string) get_term_meta($term->term_id, 'topic_description', true),
        'seoTitle' => (string) get_term_meta($term->term_id, 'topic_seo_title', true),
        'articleSlugs' => sr_normalize_post_slug_list($article_ids),
    ];
}

add_action('graphql_register_types', 'sr_register_topic_hub_graphql', 25);

function sr_register_topic_hub_graphql() {
    if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_object_type('SrTopicHub', [
        'fields' => [
            'slug' => ['type' => 'String'],
            'title' => ['type' => 'String'],
            'description' => ['type' => 'String'],
            'seoTitle' => ['type' => 'String'],
            'articleSlugs' => ['type' => ['list_of' => 'String']],
        ],
    ]);

    register_graphql_field('RootQuery', 'topicHub', [
        'type' => 'SrTopicHub',
        'args' => ['slug' => ['type' => ['non_null' => 'String']]],
        'resolve' => function($source, $args) {
            $term = get_term_by('slug', sanitize_title($args['slug'] ?? ''), 'topic');

            return ($term && !is_wp_error($term)) ? sr_build_topic_hub_payload($term) : null;
        },
    ]);

    register_graphql_field('RootQuery', 'topicHubs', [
        'type' => ['list_of' => 'SrTopicHub'],
        'resolve' => function() {
            $terms = get_terms(['taxonomy' => 'topic', 'hide_empty' => false]);

            if (is_wp_error($terms)) {
                return [];
            }

            return array_values(array_filter(array_map('sr_build_topic_hub_payload', $terms)));
        },
    ]);
}
