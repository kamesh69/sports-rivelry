<?php
/**
 * Plan C admin UI — SR Layout menus and article meta boxes (no ACF Pro).
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'sr_register_plan_c_admin_menus');
add_action('add_meta_boxes', 'sr_register_article_meta_boxes');
add_action('save_post_article', 'sr_save_article_meta_box', 10, 2);

function sr_register_plan_c_admin_menus() {
    add_menu_page(
        'The Sports Rivalry Layout',
        'SR Layout',
        'edit_posts',
        'sports-rivalry-layout',
        'sr_render_mlb_hub_admin_page',
        'dashicons-layout',
        58
    );

    add_submenu_page(
        'sports-rivalry-layout',
        'MLB Hub',
        'MLB Hub',
        'edit_posts',
        'sports-rivalry-layout',
        'sr_render_mlb_hub_admin_page'
    );

    add_submenu_page(
        'sports-rivalry-layout',
        'MLB Hub Advanced JSON',
        'MLB Advanced JSON',
        'manage_options',
        'sr-mlb-hub-advanced',
        'sr_render_mlb_hub_advanced_page'
    );
}

function sr_render_mlb_hub_admin_page() {
    if (!current_user_can('edit_posts')) {
        return;
    }

    if (isset($_POST['sr_save_mlb_hub']) && check_admin_referer('sr_save_mlb_hub_action')) {
        $settings = sr_get_mlb_hub_storage();

        $settings['mlb_hub_seo_title'] = sanitize_text_field(wp_unslash($_POST['mlb_hub_seo_title'] ?? ''));
        $settings['mlb_hub_seo_description'] = sanitize_textarea_field(wp_unslash($_POST['mlb_hub_seo_description'] ?? ''));
        $settings['mlb_hub_hero_article'] = (int) ($_POST['mlb_hub_hero_article'] ?? 0);
        $settings['mlb_hub_hero_pill_primary'] = sanitize_text_field(wp_unslash($_POST['mlb_hub_hero_pill_primary'] ?? ''));
        $settings['mlb_hub_hero_pill_secondary'] = sanitize_text_field(wp_unslash($_POST['mlb_hub_hero_pill_secondary'] ?? ''));
        $settings['mlb_hub_hero_headline'] = sanitize_text_field(wp_unslash($_POST['mlb_hub_hero_headline'] ?? ''));
        $settings['mlb_hub_hero_deck'] = sanitize_textarea_field(wp_unslash($_POST['mlb_hub_hero_deck'] ?? ''));
        $settings['mlb_hub_hero_author'] = sanitize_text_field(wp_unslash($_POST['mlb_hub_hero_author'] ?? ''));
        $settings['mlb_hub_featured_stories'] = sr_parse_post_id_list($_POST['mlb_hub_featured_stories'] ?? []);
        $settings['mlb_hub_headlines'] = sr_parse_post_id_list($_POST['mlb_hub_headlines'] ?? []);
        $settings['mlb_hub_trending'] = sr_parse_post_id_list($_POST['mlb_hub_trending'] ?? []);
        $settings['mlb_hub_newsletter_heading'] = sanitize_text_field(wp_unslash($_POST['mlb_hub_newsletter_heading'] ?? ''));
        $settings['mlb_hub_newsletter_subheading'] = sanitize_textarea_field(wp_unslash($_POST['mlb_hub_newsletter_subheading'] ?? ''));

        sr_save_mlb_hub_storage($settings);
        sr_revalidate_mlb_hub_after_save();

        echo '<div class="notice notice-success"><p>MLB Hub settings saved.</p></div>';
    }

    $settings = sr_get_mlb_hub_storage();
    $articles = sr_get_published_article_choices();

    $render_multi_select = function($name, $selected_ids) use ($articles) {
        echo '<select name="' . esc_attr($name) . '[]" multiple size="8" style="min-width:420px;">';

        foreach ($articles as $id => $label) {
            printf(
                '<option value="%d" %s>%s</option>',
                (int) $id,
                selected(in_array((int) $id, $selected_ids, true), true, false),
                esc_html($label)
            );
        }

        echo '</select>';
    };

    ?>
    <div class="wrap">
        <h1>MLB Hub</h1>
        <p>Plan C editor: curate hero, featured, headlines, and trending without ACF Pro. Advanced modules (scoreboard, rankings) can be edited under <strong>MLB Advanced JSON</strong> or left empty to use frontend defaults.</p>
        <form method="post">
            <?php wp_nonce_field('sr_save_mlb_hub_action'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="mlb_hub_seo_title">SEO title</label></th>
                    <td><input name="mlb_hub_seo_title" id="mlb_hub_seo_title" class="regular-text" value="<?php echo esc_attr($settings['mlb_hub_seo_title'] ?? ''); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="mlb_hub_seo_description">SEO description</label></th>
                    <td><textarea name="mlb_hub_seo_description" id="mlb_hub_seo_description" class="large-text" rows="3"><?php echo esc_textarea($settings['mlb_hub_seo_description'] ?? ''); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="mlb_hub_hero_article">Hero article</label></th>
                    <td>
                        <select name="mlb_hub_hero_article" id="mlb_hub_hero_article">
                            <option value="0">— Select —</option>
                            <?php foreach ($articles as $id => $label) : ?>
                                <option value="<?php echo (int) $id; ?>" <?php selected((int) ($settings['mlb_hub_hero_article'] ?? 0), (int) $id); ?>><?php echo esc_html($label); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Hero pills</th>
                    <td>
                        <input name="mlb_hub_hero_pill_primary" placeholder="Breaking News" value="<?php echo esc_attr($settings['mlb_hub_hero_pill_primary'] ?? ''); ?>">
                        <input name="mlb_hub_hero_pill_secondary" placeholder="Pennant Race" value="<?php echo esc_attr($settings['mlb_hub_hero_pill_secondary'] ?? ''); ?>">
                    </td>
                </tr>
                <tr>
                    <th scope="row">Hero overrides</th>
                    <td>
                        <input name="mlb_hub_hero_headline" class="regular-text" placeholder="Headline override" value="<?php echo esc_attr($settings['mlb_hub_hero_headline'] ?? ''); ?>"><br>
                        <textarea name="mlb_hub_hero_deck" class="large-text" rows="2" placeholder="Deck override"><?php echo esc_textarea($settings['mlb_hub_hero_deck'] ?? ''); ?></textarea><br>
                        <input name="mlb_hub_hero_author" placeholder="Author override" value="<?php echo esc_attr($settings['mlb_hub_hero_author'] ?? ''); ?>">
                    </td>
                </tr>
                <tr>
                    <th scope="row">Featured stories</th>
                    <td><?php $render_multi_select('mlb_hub_featured_stories', sr_parse_post_id_list($settings['mlb_hub_featured_stories'] ?? [])); ?></td>
                </tr>
                <tr>
                    <th scope="row">Headlines</th>
                    <td><?php $render_multi_select('mlb_hub_headlines', sr_parse_post_id_list($settings['mlb_hub_headlines'] ?? [])); ?></td>
                </tr>
                <tr>
                    <th scope="row">Trending</th>
                    <td><?php $render_multi_select('mlb_hub_trending', sr_parse_post_id_list($settings['mlb_hub_trending'] ?? [])); ?></td>
                </tr>
                <tr>
                    <th scope="row">Newsletter band</th>
                    <td>
                        <input name="mlb_hub_newsletter_heading" class="regular-text" value="<?php echo esc_attr($settings['mlb_hub_newsletter_heading'] ?? ''); ?>"><br>
                        <textarea name="mlb_hub_newsletter_subheading" class="large-text" rows="2"><?php echo esc_textarea($settings['mlb_hub_newsletter_subheading'] ?? ''); ?></textarea>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save MLB Hub', 'primary', 'sr_save_mlb_hub'); ?>
        </form>
    </div>
    <?php
}

function sr_render_mlb_hub_advanced_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    $advanced_keys = [
        'mlb_hub_scoreboard_label',
        'mlb_hub_scoreboard',
        'mlb_hub_live_game',
        'mlb_hub_player_spotlight',
        'mlb_hub_team_hub_tabs',
        'mlb_hub_team_hub_teams',
        'mlb_hub_matchups_label',
        'mlb_hub_matchups',
        'mlb_hub_rankings_label',
        'mlb_hub_rankings_column_a',
        'mlb_hub_rankings_column_b',
        'mlb_hub_rankings',
        'mlb_hub_analytics_label',
        'mlb_hub_stat_leaders',
        'mlb_hub_video_highlights',
        'mlb_hub_opinions',
    ];

    if (isset($_POST['sr_save_mlb_advanced']) && check_admin_referer('sr_save_mlb_advanced_action')) {
        $json = wp_unslash($_POST['mlb_hub_advanced_json'] ?? '{}');
        $decoded = json_decode($json, true);

        if (!is_array($decoded)) {
            echo '<div class="notice notice-error"><p>Invalid JSON.</p></div>';
        } else {
            $settings = sr_get_mlb_hub_storage();

            foreach ($advanced_keys as $key) {
                if (array_key_exists($key, $decoded)) {
                    $settings[$key] = $decoded[$key];
                }
            }

            sr_save_mlb_hub_storage($settings);
            sr_revalidate_mlb_hub_after_save();
            echo '<div class="notice notice-success"><p>Advanced MLB Hub JSON saved.</p></div>';
        }
    }

    $settings = sr_get_mlb_hub_storage();
    $export = [];

    foreach ($advanced_keys as $key) {
        if (array_key_exists($key, $settings)) {
            $export[$key] = $settings[$key];
        }
    }

    ?>
    <div class="wrap">
        <h1>MLB Hub Advanced JSON</h1>
        <p>Paste JSON for scoreboard, rankings, matchups, and other modules. Keys must match the field map in <code>docs/mlb-wordpress-hub-fields.md</code>. Leave empty to keep frontend defaults from <code>lib/sport-page-data.ts</code>.</p>
        <form method="post">
            <?php wp_nonce_field('sr_save_mlb_advanced_action'); ?>
            <textarea name="mlb_hub_advanced_json" rows="24" class="large-text code"><?php echo esc_textarea(wp_json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)); ?></textarea>
            <?php submit_button('Save Advanced JSON', 'primary', 'sr_save_mlb_advanced'); ?>
        </form>
    </div>
    <?php
}

function sr_register_article_meta_boxes() {
    add_meta_box(
        'sr-article-fields',
        'Article Fields',
        'sr_render_article_meta_box',
        'article',
        'normal',
        'high'
    );
}

function sr_render_article_meta_box($post) {
    wp_nonce_field('sr_article_meta_box', 'sr_article_meta_box_nonce');

    $deck = get_post_meta($post->ID, 'deck', true);
    $read_time = get_post_meta($post->ID, 'read_time', true) ?: 5;
    $trending_score = get_post_meta($post->ID, 'trending_score', true) ?: 0;
    $is_breaking = (bool) get_post_meta($post->ID, 'is_breaking', true);
    $is_editors_pick = (bool) get_post_meta($post->ID, 'is_editors_pick', true);
    $essentials = get_post_meta($post->ID, 'essentials', true);
    $essentials_text = is_array($essentials) ? implode("\n", $essentials) : (string) $essentials;
    $related_ids = sr_parse_post_id_list(get_post_meta($post->ID, 'related_story_ids', true));
    $articles = sr_get_published_article_choices();
    ?>
    <p>
        <label for="sr_deck"><strong>Deck</strong></label><br>
        <textarea name="sr_deck" id="sr_deck" class="large-text" rows="2"><?php echo esc_textarea($deck); ?></textarea>
    </p>
    <p>
        <label for="sr_read_time"><strong>Read time (minutes)</strong></label><br>
        <input type="number" min="1" name="sr_read_time" id="sr_read_time" value="<?php echo (int) $read_time; ?>">
    </p>
    <p>
        <label><input type="checkbox" name="sr_is_breaking" value="1" <?php checked($is_breaking); ?>> Breaking</label>
        &nbsp;
        <label><input type="checkbox" name="sr_is_editors_pick" value="1" <?php checked($is_editors_pick); ?>> Editor's pick</label>
    </p>
    <p>
        <label for="sr_trending_score"><strong>Trending score</strong></label><br>
        <input type="number" min="0" max="100" name="sr_trending_score" id="sr_trending_score" value="<?php echo (int) $trending_score; ?>">
    </p>
    <p>
        <label for="sr_essentials"><strong>Essentials</strong> (one bullet per line)</label><br>
        <textarea name="sr_essentials" id="sr_essentials" class="large-text" rows="4"><?php echo esc_textarea($essentials_text); ?></textarea>
    </p>
    <p>
        <label for="sr_related_story_ids"><strong>Related stories</strong></label><br>
        <select name="sr_related_story_ids[]" id="sr_related_story_ids" multiple size="6" style="min-width:420px;">
            <?php foreach ($articles as $id => $label) : ?>
                <?php if ((int) $id === (int) $post->ID) { continue; } ?>
                <option value="<?php echo (int) $id; ?>" <?php selected(in_array((int) $id, $related_ids, true)); ?>><?php echo esc_html($label); ?></option>
            <?php endforeach; ?>
        </select>
    </p>
    <?php
}

function sr_save_article_meta_box($post_id, $post) {
    if (!isset($_POST['sr_article_meta_box_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['sr_article_meta_box_nonce'])), 'sr_article_meta_box')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    update_post_meta($post_id, 'deck', sanitize_textarea_field(wp_unslash($_POST['sr_deck'] ?? '')));
    update_post_meta($post_id, 'read_time', max(1, (int) ($_POST['sr_read_time'] ?? 5)));
    update_post_meta($post_id, 'trending_score', max(0, (int) ($_POST['sr_trending_score'] ?? 0)));
    update_post_meta($post_id, 'is_breaking', empty($_POST['sr_is_breaking']) ? 0 : 1);
    update_post_meta($post_id, 'is_editors_pick', empty($_POST['sr_is_editors_pick']) ? 0 : 1);

    $essentials_lines = preg_split('/\r\n|\r|\n/', sanitize_textarea_field(wp_unslash($_POST['sr_essentials'] ?? '')));
    $essentials_lines = array_values(array_filter(array_map('trim', $essentials_lines)));
    update_post_meta($post_id, 'essentials', $essentials_lines);
    update_post_meta($post_id, 'related_story_ids', sr_parse_post_id_list($_POST['sr_related_story_ids'] ?? []));
}
