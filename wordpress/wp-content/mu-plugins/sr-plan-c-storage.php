<?php
/**
 * Plan C storage — MLB hub settings and article meta without ACF Pro.
 */

if (!defined('ABSPATH')) {
    exit;
}

const SR_MLB_HUB_OPTION = 'sr_mlb_hub_settings';

function sr_get_mlb_hub_storage() {
    return sr_get_sport_hub_storage('mlb');
}

function sr_save_mlb_hub_storage(array $settings) {
    sr_save_sport_hub_storage('mlb', $settings);
}

function sr_get_option_field($field_name, $default = null) {
    return sr_get_sport_hub_field('mlb', $field_name, $default);
}

function sr_set_option_field($field_name, $value) {
    sr_set_sport_hub_field('mlb', $field_name, $value);
}

function sr_update_article_meta($post_id, array $article) {
    update_post_meta($post_id, 'deck', $article['deck'] ?? '');
    update_post_meta($post_id, 'read_time', (int) ($article['read_time'] ?? 5));
    update_post_meta($post_id, 'trending_score', (int) ($article['trending_score'] ?? 0));
    update_post_meta($post_id, 'is_breaking', !empty($article['is_breaking']) ? 1 : 0);
    update_post_meta($post_id, 'is_editors_pick', !empty($article['is_editors_pick']) ? 1 : 0);

    if (!empty($article['source_article_link'])) {
        update_post_meta($post_id, 'source_article_link', esc_url_raw($article['source_article_link']));
    }

    if (!empty($article['article_summary'])) {
        update_post_meta($post_id, 'article_summary', sanitize_textarea_field($article['article_summary']));
    } elseif (!empty($article['deck'])) {
        update_post_meta($post_id, 'article_summary', sanitize_textarea_field($article['deck']));
    }

    if (!empty($article['sentiment'])) {
        update_post_meta($post_id, 'sentiment', sanitize_key($article['sentiment']));
    }
}

function sr_get_article_field_value($post_id, $key, $default = null) {
    $value = get_post_meta($post_id, $key, true);

    if ('' === $value || null === $value) {
        return $default;
    }

    return $value;
}

function sr_resolve_article_fields_graphql($post_id) {
    $related_ids = get_post_meta($post_id, 'related_story_ids', true);
    $related_ids = is_array($related_ids)
        ? $related_ids
        : array_filter(array_map('intval', explode(',', (string) $related_ids)));

    $related_stories = [];

    foreach ($related_ids as $related_id) {
        $related_post = get_post((int) $related_id);

        if ($related_post instanceof WP_Post) {
            $related_stories[] = ['slug' => $related_post->post_name];
        }
    }

    $essentials = [];
    $essentials_raw = get_post_meta($post_id, 'essentials', true);

    if (is_array($essentials_raw)) {
        foreach ($essentials_raw as $point) {
            $point = trim((string) $point);

            if ($point) {
                $essentials[] = ['point' => $point];
            }
        }
    } elseif (is_string($essentials_raw) && '' !== trim($essentials_raw)) {
        foreach (preg_split('/\r\n|\r|\n/', $essentials_raw) as $line) {
            $line = trim($line);

            if ($line) {
                $essentials[] = ['point' => $line];
            }
        }
    }

    return [
        'deck' => (string) (sr_get_article_field_value($post_id, 'deck', '') ?: sr_get_article_field_value($post_id, 'article_summary', '')),
        'articleSummary' => (string) sr_get_article_field_value($post_id, 'article_summary', ''),
        'sourceArticleLink' => (string) sr_get_article_field_value($post_id, 'source_article_link', ''),
        'sentiment' => (string) sr_get_article_field_value($post_id, 'sentiment', 'neutral'),
        'msnPublish' => 'yes' === sr_get_article_field_value($post_id, 'msn_publish', 'no'),
        'yahooPublish' => 'yes' === sr_get_article_field_value($post_id, 'yahoo_publish', 'no'),
        'readTime' => (int) sr_get_article_field_value($post_id, 'read_time', 5),
        'isBreaking' => (bool) sr_get_article_field_value($post_id, 'is_breaking', false),
        'isEditorsPick' => (bool) sr_get_article_field_value($post_id, 'is_editors_pick', false),
        'trendingScore' => (int) sr_get_article_field_value($post_id, 'trending_score', 0),
        'essentials' => $essentials,
        'relatedStories' => $related_stories,
    ];
}

function sr_get_published_article_choices() {
    $posts = get_posts([
        'post_type' => 'article',
        'post_status' => 'publish',
        'numberposts' => 200,
        'orderby' => 'date',
        'order' => 'DESC',
    ]);

    $choices = [];

    foreach ($posts as $post) {
        $choices[(int) $post->ID] = $post->post_title . ' (' . $post->post_name . ')';
    }

    return $choices;
}

function sr_parse_post_id_list($value) {
    if (is_array($value)) {
        return array_values(array_filter(array_map('intval', $value)));
    }

    if (is_numeric($value)) {
        return [(int) $value];
    }

    return array_values(array_filter(array_map('intval', preg_split('/\s*,\s*/', (string) $value))));
}

function sr_configure_mlb_hub_from_post_ids(array $post_ids) {
    if (empty($post_ids)) {
        return;
    }

    $settings = sr_get_mlb_hub_storage();

    $settings['mlb_hub_seo_title'] = 'MLB News, Rivalries & Pennant-Race Coverage | The Sports Rivalry';
    $settings['mlb_hub_seo_description'] = 'Rivalry-first MLB coverage with breaking headlines, curated featured stories, and the matchups fans carry all week.';
    $settings['mlb_hub_hero_article'] = (int) $post_ids[0];
    $settings['mlb_hub_hero_pill_primary'] = 'Breaking News';
    $settings['mlb_hub_hero_pill_secondary'] = 'Pennant Race';
    $settings['mlb_hub_featured_stories'] = array_slice(array_map('intval', $post_ids), 0, 4);
    $settings['mlb_hub_headlines'] = array_slice(array_map('intval', $post_ids), 0, 5);
    $settings['mlb_hub_trending'] = array_slice(array_map('intval', $post_ids), 0, 3);
    $settings['mlb_hub_newsletter_heading'] = 'Get the MLB rivalry briefing in your inbox';
    $settings['mlb_hub_newsletter_subheading'] = 'One sharp email with the matchups, momentum swings, and stories worth carrying into the week.';

    sr_save_mlb_hub_storage($settings);
}

function sr_revalidate_mlb_hub_after_save() {
    sr_revalidate_sport_hub_after_save('mlb');
}
