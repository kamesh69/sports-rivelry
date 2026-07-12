<?php
/**
 * Multi-sport hub admin screens.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'sr_register_sport_hub_admin_menus', 15);

function sr_register_sport_hub_admin_menus() {
    $main_sports = ['mlb', 'basketball', 'golf', 'nascar', 'football'];

    foreach ($main_sports as $sport) {
        $label = strtoupper($sport === 'mlb' ? 'MLB' : ($sport === 'nascar' ? 'NASCAR' : ucfirst($sport)));

        add_submenu_page(
            'sports-rivalry-layout',
            $label . ' Hub',
            $label . ' Hub',
            'edit_posts',
            'sr-sport-hub-' . $sport,
            function() use ($sport) {
                sr_render_sport_hub_admin_page($sport);
            }
        );

        add_submenu_page(
            'sports-rivalry-layout',
            $label . ' Advanced JSON',
            $label . ' Advanced',
            'manage_options',
            'sr-sport-hub-advanced-' . $sport,
            function() use ($sport) {
                sr_render_sport_hub_advanced_page($sport);
            }
        );
    }
}

function sr_render_sport_hub_admin_page($sport) {
    if (!current_user_can('edit_posts')) {
        return;
    }

    $sport = sanitize_key($sport);
    $prefix = sr_sport_hub_field_prefix($sport);
    $label = strtoupper($sport === 'mlb' ? 'MLB' : ($sport === 'nascar' ? 'NASCAR' : ucfirst($sport)));

    if (isset($_POST['sr_save_sport_hub']) && check_admin_referer('sr_save_sport_hub_' . $sport)) {
        $settings = sr_get_sport_hub_storage($sport);

        $settings[$prefix . 'seo_title'] = sanitize_text_field(wp_unslash($_POST['hub_seo_title'] ?? ''));
        $settings[$prefix . 'seo_description'] = sanitize_textarea_field(wp_unslash($_POST['hub_seo_description'] ?? ''));
        $settings[$prefix . 'hero_article'] = (int) ($_POST['hub_hero_article'] ?? 0);
        $settings[$prefix . 'hero_pill_primary'] = sanitize_text_field(wp_unslash($_POST['hub_hero_pill_primary'] ?? ''));
        $settings[$prefix . 'hero_pill_secondary'] = sanitize_text_field(wp_unslash($_POST['hub_hero_pill_secondary'] ?? ''));
        $settings[$prefix . 'hero_headline'] = sanitize_text_field(wp_unslash($_POST['hub_hero_headline'] ?? ''));
        $settings[$prefix . 'hero_deck'] = sanitize_textarea_field(wp_unslash($_POST['hub_hero_deck'] ?? ''));
        $settings[$prefix . 'hero_author'] = sanitize_text_field(wp_unslash($_POST['hub_hero_author'] ?? ''));
        $settings[$prefix . 'featured_stories'] = sr_parse_post_id_list($_POST['hub_featured_stories'] ?? []);
        $settings[$prefix . 'headlines'] = sr_parse_post_id_list($_POST['hub_headlines'] ?? []);
        $settings[$prefix . 'trending'] = sr_parse_post_id_list($_POST['hub_trending'] ?? []);
        $settings[$prefix . 'newsletter_heading'] = sanitize_text_field(wp_unslash($_POST['hub_newsletter_heading'] ?? ''));
        $settings[$prefix . 'newsletter_subheading'] = sanitize_textarea_field(wp_unslash($_POST['hub_newsletter_subheading'] ?? ''));

        sr_save_sport_hub_storage($sport, $settings);
        sr_revalidate_sport_hub_after_save($sport);

        echo '<div class="notice notice-success"><p>' . esc_html($label) . ' Hub settings saved.</p></div>';
    }

    $settings = sr_get_sport_hub_storage($sport);
    $articles = sr_get_published_article_choices();

    $render_multi_select = function($name, $selected_ids) use ($articles) {
        echo '<select name="' . esc_attr($name) . '[]" multiple size="8" style="min-width:420px;">';

        foreach ($articles as $id => $article_label) {
            printf(
                '<option value="%d" %s>%s</option>',
                (int) $id,
                selected(in_array((int) $id, $selected_ids, true), true, false),
                esc_html($article_label)
            );
        }

        echo '</select>';
    };

    ?>
    <div class="wrap">
        <h1><?php echo esc_html($label); ?> Hub</h1>
        <p>Curate hero, featured, headlines, and trending for <code>/<?php echo esc_html($sport); ?></code>. Advanced modules under <strong><?php echo esc_html($label); ?> Advanced</strong>.</p>
        <form method="post">
            <?php wp_nonce_field('sr_save_sport_hub_' . $sport); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="hub_seo_title">SEO title</label></th>
                    <td><input name="hub_seo_title" id="hub_seo_title" class="regular-text" value="<?php echo esc_attr($settings[$prefix . 'seo_title'] ?? ''); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="hub_seo_description">SEO description</label></th>
                    <td><textarea name="hub_seo_description" id="hub_seo_description" class="large-text" rows="3"><?php echo esc_textarea($settings[$prefix . 'seo_description'] ?? ''); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="hub_hero_article">Hero article</label></th>
                    <td>
                        <select name="hub_hero_article" id="hub_hero_article">
                            <option value="0">— Select —</option>
                            <?php foreach ($articles as $id => $article_label) : ?>
                                <option value="<?php echo (int) $id; ?>" <?php selected((int) ($settings[$prefix . 'hero_article'] ?? 0), (int) $id); ?>><?php echo esc_html($article_label); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Hero pills</th>
                    <td>
                        <input name="hub_hero_pill_primary" placeholder="Breaking News" value="<?php echo esc_attr($settings[$prefix . 'hero_pill_primary'] ?? ''); ?>">
                        <input name="hub_hero_pill_secondary" placeholder="Season" value="<?php echo esc_attr($settings[$prefix . 'hero_pill_secondary'] ?? ''); ?>">
                    </td>
                </tr>
                <tr>
                    <th scope="row">Hero overrides</th>
                    <td>
                        <input name="hub_hero_headline" class="regular-text" placeholder="Headline override" value="<?php echo esc_attr($settings[$prefix . 'hero_headline'] ?? ''); ?>"><br>
                        <textarea name="hub_hero_deck" class="large-text" rows="2" placeholder="Deck override"><?php echo esc_textarea($settings[$prefix . 'hero_deck'] ?? ''); ?></textarea><br>
                        <input name="hub_hero_author" placeholder="Author override" value="<?php echo esc_attr($settings[$prefix . 'hero_author'] ?? ''); ?>">
                    </td>
                </tr>
                <tr>
                    <th scope="row">Featured stories</th>
                    <td><?php $render_multi_select('hub_featured_stories', sr_parse_post_id_list($settings[$prefix . 'featured_stories'] ?? [])); ?></td>
                </tr>
                <tr>
                    <th scope="row">Headlines</th>
                    <td><?php $render_multi_select('hub_headlines', sr_parse_post_id_list($settings[$prefix . 'headlines'] ?? [])); ?></td>
                </tr>
                <tr>
                    <th scope="row">Trending</th>
                    <td><?php $render_multi_select('hub_trending', sr_parse_post_id_list($settings[$prefix . 'trending'] ?? [])); ?></td>
                </tr>
                <tr>
                    <th scope="row">Newsletter band</th>
                    <td>
                        <input name="hub_newsletter_heading" class="regular-text" value="<?php echo esc_attr($settings[$prefix . 'newsletter_heading'] ?? ''); ?>"><br>
                        <textarea name="hub_newsletter_subheading" class="large-text" rows="2"><?php echo esc_textarea($settings[$prefix . 'newsletter_subheading'] ?? ''); ?></textarea>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save ' . $label . ' Hub', 'primary', 'sr_save_sport_hub'); ?>
        </form>
    </div>
    <?php
}

function sr_render_sport_hub_advanced_page($sport) {
    if (!current_user_can('manage_options')) {
        return;
    }

    $sport = sanitize_key($sport);
    $prefix = sr_sport_hub_field_prefix($sport);
    $label = strtoupper($sport === 'mlb' ? 'MLB' : ($sport === 'nascar' ? 'NASCAR' : ucfirst($sport)));

    $advanced_keys = [
        $prefix . 'scoreboard_label',
        $prefix . 'scoreboard',
        $prefix . 'live_game',
        $prefix . 'player_spotlight',
        $prefix . 'team_hub_tabs',
        $prefix . 'team_hub_teams',
        $prefix . 'matchups_label',
        $prefix . 'matchups',
        $prefix . 'rankings_label',
        $prefix . 'rankings_column_a',
        $prefix . 'rankings_column_b',
        $prefix . 'rankings',
        $prefix . 'analytics_label',
        $prefix . 'stat_leaders',
        $prefix . 'video_highlights',
        $prefix . 'opinions',
    ];

    if (isset($_POST['sr_save_sport_advanced']) && check_admin_referer('sr_save_sport_advanced_' . $sport)) {
        $json = wp_unslash($_POST['hub_advanced_json'] ?? '{}');
        $decoded = json_decode($json, true);

        if (!is_array($decoded)) {
            echo '<div class="notice notice-error"><p>Invalid JSON.</p></div>';
        } else {
            $settings = sr_get_sport_hub_storage($sport);

            foreach ($advanced_keys as $key) {
                if (array_key_exists($key, $decoded)) {
                    $settings[$key] = $decoded[$key];
                }
            }

            sr_save_sport_hub_storage($sport, $settings);
            sr_revalidate_sport_hub_after_save($sport);
            echo '<div class="notice notice-success"><p>Advanced ' . esc_html($label) . ' Hub JSON saved.</p></div>';
        }
    }

    $settings = sr_get_sport_hub_storage($sport);
    $export = [];

    foreach ($advanced_keys as $key) {
        if (array_key_exists($key, $settings)) {
            $export[$key] = $settings[$key];
        }
    }

    ?>
    <div class="wrap">
        <h1><?php echo esc_html($label); ?> Hub Advanced JSON</h1>
        <p>Paste JSON for scoreboard, rankings, matchups, and other modules. Leave empty to use frontend defaults.</p>
        <form method="post">
            <?php wp_nonce_field('sr_save_sport_advanced_' . $sport); ?>
            <textarea name="hub_advanced_json" rows="24" class="large-text code"><?php echo esc_textarea(wp_json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)); ?></textarea>
            <?php submit_button('Save Advanced JSON', 'primary', 'sr_save_sport_advanced'); ?>
        </form>
    </div>
    <?php
}
