<?php
/**
 * League hub term meta + GraphQL.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('league_add_form_fields', 'sr_render_league_term_fields');
add_action('league_edit_form_fields', 'sr_render_league_term_edit_fields', 10, 2);
add_action('created_league', 'sr_save_league_term_fields');
add_action('edited_league', 'sr_save_league_term_fields');

function sr_render_league_term_fields() {
    ?>
    <div class="form-field">
        <label for="league_sport_slug">Sport slug</label>
        <input name="league_sport_slug" id="league_sport_slug" type="text" value="">
        <p class="description">e.g. mlb, football, basketball</p>
    </div>
    <div class="form-field">
        <label for="league_season_label">Season label</label>
        <input name="league_season_label" id="league_season_label" type="text" value="">
    </div>
    <div class="form-field">
        <label for="league_seo_title">SEO title</label>
        <input name="league_seo_title" id="league_seo_title" type="text" value="">
    </div>
    <div class="form-field">
        <label for="league_seo_description">SEO description</label>
        <textarea name="league_seo_description" id="league_seo_description" rows="3"></textarea>
    </div>
    <?php
}

function sr_render_league_term_edit_fields($term) {
    $sport_slug = get_term_meta($term->term_id, 'league_sport_slug', true);
    $season_label = get_term_meta($term->term_id, 'league_season_label', true);
    $seo_title = get_term_meta($term->term_id, 'league_seo_title', true);
    $seo_description = get_term_meta($term->term_id, 'league_seo_description', true);
    ?>
    <tr class="form-field">
        <th scope="row"><label for="league_sport_slug">Sport slug</label></th>
        <td><input name="league_sport_slug" id="league_sport_slug" type="text" class="regular-text" value="<?php echo esc_attr($sport_slug); ?>"></td>
    </tr>
    <tr class="form-field">
        <th scope="row"><label for="league_season_label">Season label</label></th>
        <td><input name="league_season_label" id="league_season_label" type="text" class="regular-text" value="<?php echo esc_attr($season_label); ?>"></td>
    </tr>
    <tr class="form-field">
        <th scope="row"><label for="league_seo_title">SEO title</label></th>
        <td><input name="league_seo_title" id="league_seo_title" type="text" class="regular-text" value="<?php echo esc_attr($seo_title); ?>"></td>
    </tr>
    <tr class="form-field">
        <th scope="row"><label for="league_seo_description">SEO description</label></th>
        <td><textarea name="league_seo_description" id="league_seo_description" class="large-text" rows="3"><?php echo esc_textarea($seo_description); ?></textarea></td>
    </tr>
    <?php
}

function sr_save_league_term_fields($term_id) {
    if (isset($_POST['league_sport_slug'])) {
        update_term_meta($term_id, 'league_sport_slug', sanitize_title(wp_unslash($_POST['league_sport_slug'])));
    }
    if (isset($_POST['league_season_label'])) {
        update_term_meta($term_id, 'league_season_label', sanitize_text_field(wp_unslash($_POST['league_season_label'])));
    }
    if (isset($_POST['league_seo_title'])) {
        update_term_meta($term_id, 'league_seo_title', sanitize_text_field(wp_unslash($_POST['league_seo_title'])));
    }
    if (isset($_POST['league_seo_description'])) {
        update_term_meta($term_id, 'league_seo_description', sanitize_textarea_field(wp_unslash($_POST['league_seo_description'])));
    }
}

function sr_infer_league_sport_slug($term) {
    $sport_slug = (string) get_term_meta($term->term_id, 'league_sport_slug', true);

    if ($sport_slug) {
        return $sport_slug;
    }

    $posts = get_posts([
        'post_type' => 'article',
        'post_status' => 'publish',
        'numberposts' => 1,
        'tax_query' => [
            [
                'taxonomy' => 'league',
                'field' => 'term_id',
                'terms' => [$term->term_id],
            ],
        ],
    ]);

    if (!$posts) {
        return '';
    }

    $sports = wp_get_post_terms($posts[0]->ID, 'sport', ['fields' => 'slugs']);

    return is_wp_error($sports) ? '' : (string) ($sports[0] ?? '');
}

function sr_league_article_slugs($term_id) {
    $posts = get_posts([
        'post_type' => 'article',
        'post_status' => 'publish',
        'numberposts' => 100,
        'orderby' => 'date',
        'order' => 'DESC',
        'tax_query' => [
            [
                'taxonomy' => 'league',
                'field' => 'term_id',
                'terms' => [$term_id],
            ],
        ],
    ]);

    return array_values(array_filter(array_map(static function ($post) {
        return $post instanceof WP_Post ? $post->post_name : '';
    }, $posts)));
}

function sr_build_league_hub_payload($term, $sport_slug = '') {
    if (!$term instanceof WP_Term) {
        return null;
    }

    $resolved_sport = $sport_slug ?: sr_infer_league_sport_slug($term);

    if (!$resolved_sport) {
        return null;
    }

    $season_label = (string) get_term_meta($term->term_id, 'league_season_label', true);
    $seo_title = (string) get_term_meta($term->term_id, 'league_seo_title', true);
    $seo_description = (string) get_term_meta($term->term_id, 'league_seo_description', true);

    return [
        'slug' => $term->slug,
        'name' => $term->name,
        'sportSlug' => $resolved_sport,
        'seasonLabel' => $season_label ?: '2026 Season',
        'description' => term_description($term->term_id, 'league') ?: '',
        'articleSlugs' => sr_league_article_slugs($term->term_id),
        'seoTitle' => $seo_title,
        'seoDescription' => $seo_description,
    ];
}

add_action('graphql_register_types', 'sr_register_league_hub_graphql', 25);

function sr_register_league_hub_graphql() {
    if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_object_type('SrLeagueHub', [
        'fields' => [
            'slug' => ['type' => 'String'],
            'name' => ['type' => 'String'],
            'sportSlug' => ['type' => 'String'],
            'seasonLabel' => ['type' => 'String'],
            'description' => ['type' => 'String'],
            'articleSlugs' => ['type' => ['list_of' => 'String']],
            'seoTitle' => ['type' => 'String'],
            'seoDescription' => ['type' => 'String'],
        ],
    ]);

    register_graphql_field('RootQuery', 'leagueHub', [
        'type' => 'SrLeagueHub',
        'args' => [
            'sport' => ['type' => ['non_null' => 'String']],
            'slug' => ['type' => ['non_null' => 'String']],
        ],
        'resolve' => function($source, $args) {
            $term = get_term_by('slug', sanitize_title($args['slug'] ?? ''), 'league');

            if (!$term || is_wp_error($term)) {
                return null;
            }

            $payload = sr_build_league_hub_payload($term, sanitize_title($args['sport'] ?? ''));

            return ($payload && $payload['sportSlug'] === sanitize_title($args['sport'] ?? '')) ? $payload : null;
        },
    ]);

    register_graphql_field('RootQuery', 'leagueHubs', [
        'type' => ['list_of' => 'SrLeagueHub'],
        'args' => [
            'sport' => ['type' => 'String'],
        ],
        'resolve' => function($source, $args) {
            $terms = get_terms(['taxonomy' => 'league', 'hide_empty' => false]);

            if (is_wp_error($terms)) {
                return [];
            }

            $sport_filter = sanitize_title($args['sport'] ?? '');
            $payloads = [];

            foreach ($terms as $term) {
                $payload = sr_build_league_hub_payload($term);

                if (!$payload) {
                    continue;
                }

                if ($sport_filter && $payload['sportSlug'] !== $sport_filter) {
                    continue;
                }

                $payloads[] = $payload;
            }

            return $payloads;
        },
    ]);
}
