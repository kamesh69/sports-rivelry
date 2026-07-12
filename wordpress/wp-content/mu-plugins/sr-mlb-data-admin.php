<?php
/**
 * Admin screens for MLB stats tables and teams page settings.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'sr_register_mlb_data_admin_menus', 16);

function sr_register_mlb_data_admin_menus() {
    add_submenu_page(
        'sports-rivalry-layout',
        'MLB Stats Tables',
        'MLB Stats',
        'manage_options',
        'sr-mlb-stats-admin',
        'sr_render_mlb_stats_admin_page'
    );

    add_submenu_page(
        'sports-rivalry-layout',
        'MLB Teams Page',
        'MLB Teams Page',
        'manage_options',
        'sr-mlb-teams-admin',
        'sr_render_mlb_teams_admin_page'
    );
}

function sr_parse_json_array_field($raw, $label) {
    $value = trim((string) $raw);

    if ('' === $value) {
        return [];
    }

    $decoded = json_decode(wp_unslash($value), true);

    if (!is_array($decoded)) {
        return new WP_Error('sr_invalid_json', sprintf('Invalid JSON for %s.', $label));
    }

    return $decoded;
}

function sr_parse_team_id_list($raw) {
    if (is_array($raw)) {
        $parts = $raw;
    } else {
        $parts = preg_split('/[\s,]+/', (string) $raw) ?: [];
    }

    return array_values(array_filter(array_map(static function ($id) {
        return sanitize_key((string) $id);
    }, $parts)));
}

function sr_render_mlb_stats_admin_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['sr_save_mlb_stats']) && check_admin_referer('sr_save_mlb_stats_action')) {
        $season_label = sanitize_text_field(wp_unslash($_POST['mlb_stats_season_label'] ?? '2026'));
        $batting = sr_parse_json_array_field($_POST['mlb_stats_batting_json'] ?? '[]', 'batting');
        $pitching = sr_parse_json_array_field($_POST['mlb_stats_pitching_json'] ?? '[]', 'pitching');
        $fielding = sr_parse_json_array_field($_POST['mlb_stats_fielding_json'] ?? '[]', 'fielding');

        if (is_wp_error($batting) || is_wp_error($pitching) || is_wp_error($fielding)) {
            $error = is_wp_error($batting) ? $batting : (is_wp_error($pitching) ? $pitching : $fielding);
            echo '<div class="notice notice-error"><p>' . esc_html($error->get_error_message()) . '</p></div>';
        } else {
            sr_save_mlb_stats_settings([
                'seasonLabel' => $season_label,
                'batting' => $batting,
                'pitching' => $pitching,
                'fielding' => $fielding,
            ]);
            sr_revalidate_mlb_stats_after_save();
            echo '<div class="notice notice-success"><p>MLB stats tables saved. <code>/mlb/stats</code> will refresh shortly.</p></div>';
        }
    }

    $settings = sr_get_mlb_stats_settings();
    $season_label = (string) ($settings['seasonLabel'] ?? '2026');
    $batting_json = wp_json_encode($settings['batting'] ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    $pitching_json = wp_json_encode($settings['pitching'] ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    $fielding_json = wp_json_encode($settings['fielding'] ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

    ?>
    <div class="wrap">
        <h1>MLB Stats Tables</h1>
        <p>
            Curate the leaderboards on <code>/mlb/stats</code>. Leave a table as <code>[]</code> to use the
            frontend default mock data for that tab.
        </p>
        <p>
            Each table is a JSON array of row objects. Batting rows need fields like
            <code>rk</code>, <code>name</code>, <code>team</code>, <code>pos</code>, <code>avg</code>, <code>ops</code>, <code>war</code>.
            Pitching rows use <code>era</code>, <code>whip</code>, <code>ip</code>. Fielding rows use <code>fldPct</code>, <code>drs</code>, <code>oaa</code>.
        </p>
        <form method="post">
            <?php wp_nonce_field('sr_save_mlb_stats_action'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="mlb_stats_season_label">Season label</label></th>
                    <td>
                        <input name="mlb_stats_season_label" id="mlb_stats_season_label" class="regular-text" value="<?php echo esc_attr($season_label); ?>">
                        <p class="description">Shown in page titles, e.g. <code>2026</code>.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="mlb_stats_batting_json">Batting JSON</label></th>
                    <td><textarea name="mlb_stats_batting_json" id="mlb_stats_batting_json" rows="14" class="large-text code"><?php echo esc_textarea($batting_json); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="mlb_stats_pitching_json">Pitching JSON</label></th>
                    <td><textarea name="mlb_stats_pitching_json" id="mlb_stats_pitching_json" rows="14" class="large-text code"><?php echo esc_textarea($pitching_json); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="mlb_stats_fielding_json">Fielding JSON</label></th>
                    <td><textarea name="mlb_stats_fielding_json" id="mlb_stats_fielding_json" rows="14" class="large-text code"><?php echo esc_textarea($fielding_json); ?></textarea></td>
                </tr>
            </table>
            <?php submit_button('Save MLB Stats', 'primary', 'sr_save_mlb_stats'); ?>
        </form>
    </div>
    <?php
}

function sr_render_mlb_teams_admin_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['sr_save_mlb_teams']) && check_admin_referer('sr_save_mlb_teams_action')) {
        $featured_ids = sr_parse_team_id_list($_POST['mlb_teams_featured_ids'] ?? '');
        $hero_title = sanitize_text_field(wp_unslash($_POST['mlb_teams_hero_title'] ?? ''));
        $hero_description = sanitize_textarea_field(wp_unslash($_POST['mlb_teams_hero_description'] ?? ''));
        $timeline = sr_parse_json_array_field($_POST['mlb_teams_timeline_json'] ?? '[]', 'timeline');
        $quick_facts = sr_parse_json_array_field($_POST['mlb_teams_quick_facts_json'] ?? '[]', 'quick facts');

        if (is_wp_error($timeline) || is_wp_error($quick_facts)) {
            $error = is_wp_error($timeline) ? $timeline : $quick_facts;
            echo '<div class="notice notice-error"><p>' . esc_html($error->get_error_message()) . '</p></div>';
        } else {
            sr_save_mlb_teams_page_settings([
                'featuredTeamIds' => $featured_ids,
                'heroTitle' => $hero_title,
                'heroDescription' => $hero_description,
                'timeline' => $timeline,
                'quickFacts' => $quick_facts,
            ]);
            sr_revalidate_mlb_teams_page_after_save();
            echo '<div class="notice notice-success"><p>MLB Teams page settings saved. <code>/mlb/teams</code> will refresh shortly.</p></div>';
        }
    }

    $settings = sr_get_mlb_teams_page_settings();
    $featured_ids = implode(', ', $settings['featuredTeamIds'] ?? []);
    $timeline_json = wp_json_encode($settings['timeline'] ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    $quick_facts_json = wp_json_encode($settings['quickFacts'] ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

    ?>
    <div class="wrap">
        <h1>MLB Teams Page</h1>
        <p>
            Curate featured teams, timeline, and quick facts on <code>/mlb/teams</code>.
            Leave fields empty to use frontend defaults. The 30-team directory itself still comes from the Next.js dataset until a live MLB API is wired.
        </p>
        <form method="post">
            <?php wp_nonce_field('sr_save_mlb_teams_action'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="mlb_teams_featured_ids">Featured team IDs</label></th>
                    <td>
                        <input name="mlb_teams_featured_ids" id="mlb_teams_featured_ids" class="large-text" value="<?php echo esc_attr($featured_ids); ?>">
                        <p class="description">
                            Comma-separated team IDs for the carousel, e.g.
                            <code>nyy, lad, bos, chc, atl, hou</code>.
                            Common IDs: <code>nyy</code>, <code>lad</code>, <code>bos</code>, <code>chc</code>, <code>atl</code>, <code>hou</code>, <code>sf</code>, <code>phi</code>, <code>bal</code>, <code>tex</code>.
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="mlb_teams_hero_title">Hero title</label></th>
                    <td><input name="mlb_teams_hero_title" id="mlb_teams_hero_title" class="regular-text" value="<?php echo esc_attr($settings['heroTitle'] ?? ''); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="mlb_teams_hero_description">Hero description</label></th>
                    <td><textarea name="mlb_teams_hero_description" id="mlb_teams_hero_description" class="large-text" rows="3"><?php echo esc_textarea($settings['heroDescription'] ?? ''); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="mlb_teams_timeline_json">Timeline JSON</label></th>
                    <td>
                        <textarea name="mlb_teams_timeline_json" id="mlb_teams_timeline_json" rows="12" class="large-text code"><?php echo esc_textarea($timeline_json); ?></textarea>
                        <p class="description">Array of <code>{ "year": "1903", "title": "...", "description": "..." }</code>.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="mlb_teams_quick_facts_json">Quick facts JSON</label></th>
                    <td>
                        <textarea name="mlb_teams_quick_facts_json" id="mlb_teams_quick_facts_json" rows="12" class="large-text code"><?php echo esc_textarea($quick_facts_json); ?></textarea>
                        <p class="description">Array of <code>{ "icon": "⚾", "value": "30", "label": "Teams" }</code>.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save MLB Teams Page', 'primary', 'sr_save_mlb_teams'); ?>
        </form>
    </div>
    <?php
}
