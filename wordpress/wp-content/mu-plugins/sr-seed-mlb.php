<?php
/**
 * Seeds MLB taxonomy terms, author, articles, and MLB Hub settings for launch.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'sr_register_seed_admin_page', 20);

function sr_register_seed_admin_page() {
    add_submenu_page(
        'sports-rivalry-layout',
        'Seed MLB Content',
        'Seed MLB Content',
        'manage_options',
        'sr-seed-mlb',
        'sr_render_seed_admin_page'
    );
}

function sr_render_seed_admin_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    $message = '';
    $result = ['success' => false, 'message' => ''];

    if (isset($_POST['sr_seed_mlb']) && check_admin_referer('sr_seed_mlb_action')) {
        $result = sr_seed_mlb_content();
        $message = $result['message'];
    }

    echo '<div class="wrap">';
    echo '<h1>Seed MLB Content</h1>';

    if ($message) {
        $class = !empty($result['success']) ? 'notice-success' : 'notice-error';
        echo '<div class="notice ' . esc_attr($class) . '"><p>' . esc_html($message) . '</p></div>';
    }

    echo '<p>Creates the <code>mlb</code> sport/league terms, author <code>miles-donovan</code>, five launch articles, and MLB Hub settings (Plan C — no ACF Pro).</p>';
    echo '<form method="post">';
    wp_nonce_field('sr_seed_mlb_action');
    submit_button('Run MLB Seed', 'primary', 'sr_seed_mlb');
    echo '</form></div>';
}

function sr_seed_mlb_articles_data() {
    return [
        [
            'slug' => 'yankees-red-sox-rivalry-feels-mean-again-because-both-dugouts-need-it',
            'title' => 'Yankees-Red Sox feels mean again because both dugouts need it',
            'excerpt' => 'The talent matters, but the tone of the series is what turned this back into required viewing.',
            'deck' => 'Boston and New York have stopped treating the rivalry like nostalgia and started using it like leverage.',
            'article_summary' => 'Boston and New York have stopped treating the rivalry like nostalgia and started using it like leverage.',
            'source_article_link' => 'https://www.mlb.com/news',
            'sentiment' => 'positive',
            'content' => '<p>The Yankees and Red Sox are interesting again for the right reason: both sides finally have something to prove at the same time. One dugout is trying to protect its authority, the other is trying to steal it.</p><p>That changes how every bullpen call lands and how every star at-bat feels. Rivalry baseball gets louder when both clubs believe the next three days can reshape the month.</p><h2>Why it travels</h2><p>The best version of this feud is not about history alone. It is about pressure living in every inning, from the starter\'s tempo to the way a manager deploys his final leverage arm.</p>',
            'read_time' => 5,
            'trending_score' => 99,
            'is_breaking' => true,
            'is_editors_pick' => true,
        ],
        [
            'slug' => 'dodgers-padres-have-found-the-perfect-october-hate-cycle',
            'title' => 'Dodgers-Padres have found the perfect October hate cycle',
            'excerpt' => 'Talent is everywhere in this matchup, but the real appeal is how quickly confidence turns into insult.',
            'deck' => 'Los Angeles and San Diego now play like two clubs that no longer need a postseason prompt to remember the score.',
            'article_summary' => 'Los Angeles and San Diego now play like two clubs that no longer need a postseason prompt to remember the score.',
            'source_article_link' => 'https://www.mlb.com/news',
            'sentiment' => 'mixed',
            'content' => '<p>The Dodgers still carry the larger machinery, but the Padres have learned how to make the matchup personal enough to flatten the gap. That is why the tone changes the moment the series begins.</p><p>Every confrontation now carries playoff memory, even in June.</p>',
            'read_time' => 4,
            'trending_score' => 93,
            'is_editors_pick' => true,
        ],
        [
            'slug' => 'mets-braves-keep-punishing-any-team-that-blinks-first',
            'title' => 'Mets-Braves keep punishing any team that blinks first',
            'excerpt' => 'This race feels exhausting because both clubs force the other to live without soft innings.',
            'deck' => 'Atlanta and New York have built a divisional feud around pressure tolerance more than aesthetics.',
            'article_summary' => 'Atlanta and New York have built a divisional feud around pressure tolerance more than aesthetics.',
            'source_article_link' => 'https://www.mlb.com/news',
            'sentiment' => 'neutral',
            'content' => '<p>The Mets and Braves are difficult to watch casually because neither side leaves much room for drift. One crooked inning or one bullpen wobble usually changes the series.</p><p>That ruthless pace is why the rivalry stays useful deep into the summer.</p>',
            'read_time' => 4,
            'trending_score' => 90,
            'is_editors_pick' => true,
        ],
        [
            'slug' => 'orioles-blue-jays-keep-building-the-division-race-that-refuses-to-relax',
            'title' => 'Orioles-Blue Jays keep building the division race that refuses to relax',
            'excerpt' => 'The series feels younger, meaner, and more dangerous every time the standings tighten.',
            'deck' => 'Baltimore and Toronto do not have the oldest feud in baseball, but they might have the most impatient one right now.',
            'article_summary' => 'Baltimore and Toronto do not have the oldest feud in baseball, but they might have the most impatient one right now.',
            'source_article_link' => 'https://www.mlb.com/news',
            'sentiment' => 'positive',
            'content' => '<p>Baltimore-Toronto has become a rivalry for people who like their tension a little less ceremonial and a little more immediate. The urgency is the hook.</p><p>Every series feels like it starts with both clubs already annoyed.</p>',
            'read_time' => 3,
            'trending_score' => 86,
            'is_editors_pick' => false,
        ],
        [
            'slug' => 'astros-rangers-turned-a-division-race-into-a-contact-sport',
            'title' => 'Astros-Rangers turned a division race into a contact sport',
            'excerpt' => 'Texas and Houston keep finding new ways to make late-season baseball feel personal.',
            'deck' => 'The rivalry has enough history to matter and enough recent heat to keep every pitch feeling louder than it should.',
            'article_summary' => 'The rivalry has enough history to matter and enough recent heat to keep every pitch feeling louder than it should.',
            'source_article_link' => 'https://www.mlb.com/news',
            'sentiment' => 'negative',
            'content' => '<p>Houston and Texas do not need a trophy on the line to play like something bigger is at stake. The division math and the recent history do that work for them.</p><p>That is why every series between them feels like it starts one inning too late.</p>',
            'read_time' => 4,
            'trending_score' => 84,
            'is_editors_pick' => false,
        ],
    ];
}

function sr_ensure_term($taxonomy, $slug, $name) {
    $existing = get_term_by('slug', $slug, $taxonomy);

    if ($existing instanceof WP_Term) {
        return (int) $existing->term_id;
    }

    $created = wp_insert_term($name, $taxonomy, ['slug' => $slug]);

    if (is_wp_error($created)) {
        return 0;
    }

    return (int) $created['term_id'];
}

function sr_ensure_author_user() {
    $login = 'miles-donovan';
    $user = get_user_by('login', $login);

    if ($user instanceof WP_User) {
        return (int) $user->ID;
    }

    $user_id = wp_insert_user([
        'user_login' => $login,
        'user_pass' => wp_generate_password(24),
        'user_email' => 'miles.donovan@thesportsrivalry.com',
        'first_name' => 'Miles',
        'last_name' => 'Donovan',
        'display_name' => 'Miles Donovan',
        'role' => 'author',
        'user_nicename' => $login,
    ]);

    return is_wp_error($user_id) ? 0 : (int) $user_id;
}

function sr_upsert_article(array $article, $author_id, $sport_term_id, $league_term_id, $topic_term_id) {
    $existing = get_page_by_path($article['slug'], OBJECT, 'article');
    $post_data = [
        'post_type' => 'article',
        'post_status' => 'publish',
        'post_title' => $article['title'],
        'post_name' => $article['slug'],
        'post_excerpt' => $article['excerpt'],
        'post_content' => $article['content'],
        'post_author' => $author_id,
    ];

    if ($existing instanceof WP_Post) {
        $post_data['ID'] = $existing->ID;
        $post_id = wp_update_post($post_data, true);
    } else {
        $post_id = wp_insert_post($post_data, true);
    }

    if (is_wp_error($post_id)) {
        return 0;
    }

    wp_set_object_terms($post_id, [$sport_term_id], 'sport', false);
    wp_set_object_terms($post_id, [$league_term_id], 'league', false);

    if ($topic_term_id) {
        wp_set_object_terms($post_id, [$topic_term_id], 'topic', false);
    }

    sr_update_article_meta($post_id, $article);

    return (int) $post_id;
}

function sr_seed_mlb_content() {
    $sport_term_id = sr_ensure_term('sport', 'mlb', 'MLB');
    $league_term_id = sr_ensure_term('league', 'mlb', 'MLB');
    $topic_term_id = sr_ensure_term('topic', 'rivalries', 'Rivalries');
    $author_id = sr_ensure_author_user();

    if (!$sport_term_id || !$league_term_id || !$author_id) {
        return [
            'success' => false,
            'message' => 'Failed to create taxonomy terms or author user.',
        ];
    }

    $post_ids = [];

    foreach (sr_seed_mlb_articles_data() as $article) {
        $post_id = sr_upsert_article($article, $author_id, $sport_term_id, $league_term_id, $topic_term_id);

        if ($post_id) {
            $post_ids[] = $post_id;
        }
    }

    sr_configure_mlb_hub_from_post_ids($post_ids);
    sr_revalidate_mlb_hub_after_save();

    return [
        'success' => true,
        'message' => sprintf('Seeded %d MLB articles and configured MLB Hub settings.', count($post_ids)),
        'post_ids' => $post_ids,
    ];
}

if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('sr seed-mlb', function() {
        $result = sr_seed_mlb_content();

        if (!$result['success']) {
            WP_CLI::error($result['message']);
        }

        WP_CLI::success($result['message']);
    });
}
