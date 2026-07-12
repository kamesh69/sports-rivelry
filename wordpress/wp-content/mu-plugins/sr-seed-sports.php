<?php
/**
 * Seed starter articles for all main sports.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'sr_register_seed_sports_admin_page', 21);

function sr_register_seed_sports_admin_page() {
    add_submenu_page(
        'sports-rivalry-layout',
        'Seed All Sports',
        'Seed All Sports',
        'manage_options',
        'sr-seed-sports',
        'sr_render_seed_sports_admin_page'
    );
}

function sr_render_seed_sports_admin_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    $message = '';

    if (isset($_POST['sr_seed_sports']) && check_admin_referer('sr_seed_sports_action')) {
        $result = sr_seed_all_sports_content();
        $message = $result['message'];
        $class = !empty($result['success']) ? 'notice-success' : 'notice-error';
        echo '<div class="notice ' . esc_attr($class) . '"><p>' . esc_html($message) . '</p></div>';
    }

    echo '<div class="wrap"><h1>Seed All Sports</h1>';
    echo '<p>Creates taxonomy terms and 2 starter articles each for basketball, golf, nascar, and football. Run after MLB seed.</p>';
    echo '<form method="post">';
    wp_nonce_field('sr_seed_sports_action');
    submit_button('Run All Sports Seed', 'primary', 'sr_seed_sports');
    echo '</form></div>';
}

function sr_seed_sports_articles_data() {
    return [
        'basketball' => [
            ['slug' => 'nba-finals-pressure-is-back-on-the-bench', 'title' => 'NBA Finals pressure is back on the bench', 'excerpt' => 'Rotations matter again when every possession feels like a referendum.', 'deck' => 'Coaches are being judged on matchup math as much as star talent.'],
            ['slug' => 'wnba-rivalry-week-feels-like-playoff-prep', 'title' => 'WNBA rivalry week feels like playoff prep', 'excerpt' => 'The league is leaning into repeat meetings with real stakes.', 'deck' => 'Repeat opponents are turning summer games into statement nights.'],
        ],
        'golf' => [
            ['slug' => 'pga-tour-sunday-math-is-getting-ruthless', 'title' => 'PGA Tour Sunday math is getting ruthless', 'excerpt' => 'Leaders are being chased by depth, not just one rival.', 'deck' => 'The leaderboard pressure is coming from every direction now.'],
            ['slug' => 'major-week-crowd-noise-changes-everything', 'title' => 'Major week crowd noise changes everything', 'excerpt' => 'The gallery is back to influencing pace and confidence.', 'deck' => 'Major Sundays feel louder because every swing has a witness.'],
        ],
        'nascar' => [
            ['slug' => 'cup-series-restarts-are-the-real-battleground', 'title' => 'Cup Series restarts are the real battleground', 'excerpt' => 'Clean air still rules, but chaos decides the week.', 'deck' => 'The field knows one restart can erase an entire afternoon of work.'],
            ['slug' => 'short-track-grudges-are-driving-the-playoff-race', 'title' => 'Short-track grudges are driving the playoff race', 'excerpt' => 'Contact is back on the table and points are on the line.', 'deck' => 'The playoff picture is being shaped by who refuses to give an inch.'],
        ],
        'football' => [
            ['slug' => 'premier-league-title-race-refuses-to-slow-down', 'title' => 'Premier League title race refuses to slow down', 'excerpt' => 'Every matchday feels like a swing in the table.', 'deck' => 'The top of the table is too tight for anyone to coast.'],
            ['slug' => 'isl-derby-week-is-turning-into-a-contact-sport', 'title' => 'ISL derby week is turning into a contact sport', 'excerpt' => 'Tempers are rising because the table is still open.', 'deck' => 'Derby week is less about style and more about survival.'],
        ],
    ];
}

function sr_seed_all_sports_content() {
    $author_id = function_exists('sr_ensure_author_user') ? sr_ensure_author_user() : 1;
    $total = 0;

    foreach (sr_seed_sports_articles_data() as $sport => $articles) {
        $sport_term_id = sr_ensure_term('sport', $sport, strtoupper($sport === 'nascar' ? 'NASCAR' : ucfirst($sport)));
        $league_term_id = sr_ensure_term('league', $sport, strtoupper($sport === 'nascar' ? 'NASCAR' : ucfirst($sport)));
        $post_ids = [];

        foreach ($articles as $article) {
            $article['read_time'] = 4;
            $article['trending_score'] = 70;
            $article['content'] = '<p>' . esc_html($article['excerpt']) . '</p>';
            $article['source_article_link'] = 'https://example.com/source';
            $article['article_summary'] = $article['deck'];
            $article['sentiment'] = 'neutral';

            $post_id = sr_upsert_article($article, $author_id, $sport_term_id, $league_term_id, 0);

            if ($post_id) {
                $post_ids[] = $post_id;
                $total++;
            }
        }

        if (!empty($post_ids)) {
            $prefix = sr_sport_hub_field_prefix($sport);
            $settings = sr_get_sport_hub_storage($sport);
            $settings[$prefix . 'seo_title'] = strtoupper($sport) . ' News & Rivalry Coverage | The Sports Rivalry';
            $settings[$prefix . 'seo_description'] = 'Rivalry-first ' . $sport . ' coverage with breaking headlines and curated featured stories.';
            sr_save_sport_hub_storage($sport, $settings);
            sr_configure_sport_hub_from_post_ids($sport, $post_ids);
        }
    }

    return [
        'success' => true,
        'message' => sprintf('Seeded %d articles across basketball, golf, nascar, and football.', $total),
    ];
}

if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('sr seed-sports', function() {
        $result = sr_seed_all_sports_content();
        WP_CLI::success($result['message']);
    });
}
