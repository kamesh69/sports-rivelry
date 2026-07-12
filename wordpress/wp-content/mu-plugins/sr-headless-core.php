<?php
/**
 * Plugin Name: The Sports Rivalry Headless Core
 * Description: Registers The Sports Rivalry content models, exposes them to WPGraphQL, and notifies the Next.js frontend to revalidate pages after editorial changes.
 * Author: The Sports Rivalry
 * Version: 0.3.0
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/sr-plan-c-storage.php';
require_once __DIR__ . '/sr-sport-hub-storage.php';
require_once __DIR__ . '/sr-homepage-storage.php';
require_once __DIR__ . '/sr-plan-c-admin.php';
require_once __DIR__ . '/sr-sport-hub-admin.php';
require_once __DIR__ . '/sr-homepage-admin.php';
require_once __DIR__ . '/sr-plan-c-graphql.php';
require_once __DIR__ . '/sr-sport-hub-graphql.php';
require_once __DIR__ . '/sr-author-profiles.php';
require_once __DIR__ . '/sr-topic-hub.php';
require_once __DIR__ . '/sr-league-hub.php';
require_once __DIR__ . '/sr-mlb-data.php';
require_once __DIR__ . '/sr-mlb-data-admin.php';
require_once __DIR__ . '/sr-content-graphql.php';
require_once __DIR__ . '/sr-editorial-workflow.php';
require_once __DIR__ . '/sr-seed-mlb.php';
require_once __DIR__ . '/sr-seed-sports.php';
require_once __DIR__ . '/sr-seed-homepage.php';

const SR_EDITORIAL_POST_TYPES = ['article', 'live_blog', 'video', 'newsletter_issue', 'landing_page'];
const SR_EDITORIAL_TAXONOMIES = ['sport', 'league', 'team', 'tournament', 'topic'];

add_action('init', 'sr_register_content_types');
add_action('init', 'sr_register_taxonomies');
add_action('save_post', 'sr_trigger_frontend_revalidation', 20, 3);
add_action('graphql_register_types', 'sr_register_graphql_types');
add_filter('preview_post_link', 'sr_filter_preview_post_link', 10, 2);

function sr_register_content_types() {
    $post_types = [
        'article' => [
            'label' => 'Articles',
            'menu_icon' => 'dashicons-media-document',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions'],
            'graphql_single_name' => 'Article',
            'graphql_plural_name' => 'Articles',
        ],
        'live_blog' => [
            'label' => 'Live Blogs',
            'menu_icon' => 'dashicons-rss',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions'],
            'graphql_single_name' => 'LiveBlog',
            'graphql_plural_name' => 'LiveBlogs',
        ],
        'video' => [
            'label' => 'Videos',
            'menu_icon' => 'dashicons-video-alt3',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions'],
            'graphql_single_name' => 'Video',
            'graphql_plural_name' => 'Videos',
        ],
        'newsletter_issue' => [
            'label' => 'Newsletter Issues',
            'menu_icon' => 'dashicons-email',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
            'graphql_single_name' => 'NewsletterIssue',
            'graphql_plural_name' => 'NewsletterIssues',
        ],
        'landing_page' => [
            'label' => 'Landing Pages',
            'menu_icon' => 'dashicons-layout',
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
            'graphql_single_name' => 'LandingPage',
            'graphql_plural_name' => 'LandingPages',
        ],
    ];

    foreach ($post_types as $slug => $config) {
        register_post_type($slug, [
            'labels' => [
                'name' => $config['label'],
                'singular_name' => rtrim($config['label'], 's'),
            ],
            'public' => true,
            'show_ui' => true,
            'show_in_rest' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => $config['graphql_single_name'],
            'graphql_plural_name' => $config['graphql_plural_name'],
            'menu_icon' => $config['menu_icon'],
            'has_archive' => false,
            'rewrite' => ['slug' => $slug],
            'supports' => $config['supports'],
            'taxonomies' => ['post_tag'],
            'menu_position' => 5,
        ]);
    }

    $meta_fields = [
        'deck' => 'string',
        'read_time' => 'integer',
        'canonical_override' => 'string',
        'trending_score' => 'integer',
        'source_references' => 'string',
        'is_breaking' => 'boolean',
        'is_editors_pick' => 'boolean',
        'source_article_link' => 'string',
        'article_summary' => 'string',
        'sentiment' => 'string',
        'msn_publish' => 'string',
        'yahoo_publish' => 'string',
    ];

    foreach (SR_EDITORIAL_POST_TYPES as $post_type) {
        foreach ($meta_fields as $key => $type) {
            register_post_meta($post_type, $key, [
                'show_in_rest' => true,
                'single' => true,
                'type' => $type,
                'auth_callback' => function() {
                    return current_user_can('edit_posts');
                },
            ]);
        }
    }
}

function sr_register_taxonomies() {
    $taxonomies = [
        'sport' => ['label' => 'Sports', 'graphql_single_name' => 'Sport', 'graphql_plural_name' => 'Sports'],
        'league' => ['label' => 'Leagues', 'graphql_single_name' => 'League', 'graphql_plural_name' => 'Leagues'],
        'team' => ['label' => 'Teams', 'graphql_single_name' => 'Team', 'graphql_plural_name' => 'Teams'],
        'tournament' => ['label' => 'Tournaments', 'graphql_single_name' => 'Tournament', 'graphql_plural_name' => 'Tournaments'],
        'topic' => ['label' => 'Topics', 'graphql_single_name' => 'Topic', 'graphql_plural_name' => 'Topics'],
    ];

    foreach ($taxonomies as $slug => $config) {
        register_taxonomy($slug, SR_EDITORIAL_POST_TYPES, [
            'label' => $config['label'],
            'public' => true,
            'hierarchical' => true,
            'show_ui' => true,
            'show_in_rest' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => $config['graphql_single_name'],
            'graphql_plural_name' => $config['graphql_plural_name'],
            'rewrite' => ['slug' => $slug],
        ]);
    }
}

function sr_filter_preview_post_link($preview_link, $post) {
    if (!in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return $preview_link;
    }

    $frontend_url = defined('SR_FRONTEND_URL') ? untrailingslashit(SR_FRONTEND_URL) : '';
    $preview_secret = defined('SR_PREVIEW_SECRET') ? SR_PREVIEW_SECRET : '';

    if (!$frontend_url || !$preview_secret) {
        return $preview_link;
    }

    $path = sr_frontend_path_for_post($post->ID);

    if (!$path) {
        return $preview_link;
    }

    return add_query_arg([
        'secret' => $preview_secret,
        'slug' => $path,
    ], $frontend_url . '/api/preview');
}

function sr_trigger_frontend_revalidation($post_id, $post, $update) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    if (!$update || !in_array($post->post_type, SR_EDITORIAL_POST_TYPES, true)) {
        return;
    }

    $paths = sr_revalidation_paths_for_post($post_id, $post->post_type);
    $tags = ['wordpress', $post->post_type];

    if ('article' === $post->post_type) {
        $sports = wp_get_post_terms($post_id, 'sport', ['fields' => 'slugs']);

        foreach ($sports as $sport_slug) {
            $tags[] = 'sport-' . $sport_slug;
        }

        if (in_array('mlb', $sports, true)) {
            $tags[] = 'mlb';
        }
    }

    sr_send_revalidation_request($paths, $tags);
}

function sr_send_revalidation_request($paths, $tags) {
    $endpoint = defined('SR_REVALIDATE_ENDPOINT') ? SR_REVALIDATE_ENDPOINT : '';
    $secret = defined('SR_REVALIDATE_SECRET') ? SR_REVALIDATE_SECRET : '';

    if (!$endpoint || !$secret) {
        return;
    }

    wp_remote_post($endpoint, [
        'headers' => [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $secret,
        ],
        'body' => wp_json_encode([
            'paths' => array_values(array_unique(array_filter($paths))),
            'tags' => array_values(array_unique(array_filter($tags))),
        ]),
        'timeout' => 10,
    ]);
}

function sr_revalidation_paths_for_post($post_id, $post_type) {
    $paths = ['/', '/search', '/authors'];
    $primary_path = sr_frontend_path_for_post($post_id);

    if ($primary_path) {
        $paths[] = $primary_path;
    }

    if ('article' === $post_type) {
        $sports = wp_get_post_terms($post_id, 'sport', ['fields' => 'slugs']);
        $leagues = wp_get_post_terms($post_id, 'league', ['fields' => 'slugs']);
        $topics = wp_get_post_terms($post_id, 'topic', ['fields' => 'slugs']);

        foreach ($sports as $sport_slug) {
            $paths[] = '/' . $sport_slug;
        }

        foreach ($sports as $sport_slug) {
            foreach ($leagues as $league_slug) {
                $paths[] = '/' . $sport_slug . '/' . $league_slug;
            }
        }

        if (in_array('mlb', $sports, true)) {
            $paths[] = '/mlb/news';
        }

        foreach ($topics as $topic_slug) {
            $paths[] = '/topics/' . $topic_slug;
        }

        $author_path = sr_author_path_for_post($post_id);
        if ($author_path) {
            $paths[] = $author_path;
        }
    }

    if ('newsletter_issue' === $post_type) {
        $paths[] = '/newsletters';
    }

    if ('landing_page' === $post_type) {
        $paths[] = '/topics';
    }

    return $paths;
}

function sr_frontend_path_for_post($post_id) {
    $post = get_post($post_id);

    if (!$post) {
        return '';
    }

    if ('article' === $post->post_type) {
        $sports = wp_get_post_terms($post_id, 'sport', ['fields' => 'slugs']);

        if (empty($sports)) {
            return '';
        }

        return '/' . $sports[0] . '/' . $post->post_name;
    }

    if ('newsletter_issue' === $post->post_type) {
        return '/newsletters/' . $post->post_name;
    }

    if ('landing_page' === $post->post_type) {
        return '/' . $post->post_name;
    }

    return '';
}

function sr_author_path_for_post($post_id) {
    $author_id = (int) get_post_field('post_author', $post_id);

    if (!$author_id) {
        return '';
    }

    $author = get_userdata($author_id);

    if (!$author) {
        return '';
    }

    return '/authors/' . $author->user_nicename;
}

function sr_register_graphql_types() {
    if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_object_type('SrMediaAsset', [
        'description' => 'Reusable media asset shape for MLB hub settings.',
        'fields' => [
            'src' => ['type' => 'String'],
            'alt' => ['type' => 'String'],
            'width' => ['type' => 'Int'],
            'height' => ['type' => 'Int'],
            'credit' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SrTeamIdentity', [
        'fields' => [
            'name' => ['type' => 'String'],
            'shortName' => ['type' => 'String'],
            'primaryColor' => ['type' => 'String'],
            'accentColor' => ['type' => 'String'],
            'textColor' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SrScoreTeam', [
        'fields' => [
            'name' => ['type' => 'String'],
            'shortName' => ['type' => 'String'],
            'primaryColor' => ['type' => 'String'],
            'accentColor' => ['type' => 'String'],
            'textColor' => ['type' => 'String'],
            'score' => ['type' => 'Int'],
            'record' => ['type' => 'String'],
            'isWinner' => ['type' => 'Boolean'],
        ],
    ]);

    register_graphql_object_type('SrPlayerStat', [
        'fields' => [
            'label' => ['type' => 'String'],
            'value' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SrPlayerSpotlight', [
        'fields' => [
            'player' => ['type' => 'String'],
            'meta' => ['type' => 'String'],
            'monogram' => ['type' => 'String'],
            'footnote' => ['type' => 'String'],
            'stats' => ['type' => ['list_of' => 'SrPlayerStat']],
        ],
    ]);

    register_graphql_object_type('SrLiveGame', [
        'fields' => [
            'status' => ['type' => 'String'],
            'isLive' => ['type' => 'Boolean'],
            'clock' => ['type' => 'String'],
            'note' => ['type' => 'String'],
            'away' => ['type' => 'SrScoreTeam'],
            'home' => ['type' => 'SrScoreTeam'],
        ],
    ]);

    register_graphql_object_type('SrScoreboardGame', [
        'fields' => [
            'status' => ['type' => 'String'],
            'isLive' => ['type' => 'Boolean'],
            'detail' => ['type' => 'String'],
            'away' => ['type' => 'SrScoreTeam'],
            'home' => ['type' => 'SrScoreTeam'],
        ],
    ]);

    register_graphql_object_type('SrHubTeamEntry', [
        'fields' => [
            'slug' => ['type' => 'String'],
            'meta' => ['type' => 'String'],
            'form' => ['type' => ['list_of' => 'String']],
            'team' => ['type' => 'SrTeamIdentity'],
        ],
    ]);

    register_graphql_object_type('SrTeamHub', [
        'fields' => [
            'tabs' => ['type' => ['list_of' => 'String']],
            'teams' => ['type' => ['list_of' => 'SrHubTeamEntry']],
        ],
    ]);

    register_graphql_object_type('SrMatchup', [
        'fields' => [
            'status' => ['type' => 'String'],
            'isLive' => ['type' => 'Boolean'],
            'clock' => ['type' => 'String'],
            'info' => ['type' => 'String'],
            'venue' => ['type' => 'String'],
            'network' => ['type' => 'String'],
            'seriesNote' => ['type' => 'String'],
            'spread' => ['type' => 'String'],
            'overUnder' => ['type' => 'String'],
            'teams' => ['type' => ['list_of' => 'SrScoreTeam']],
        ],
    ]);

    register_graphql_object_type('SrTeamStanding', [
        'fields' => [
            'rank' => ['type' => 'Int'],
            'record' => ['type' => 'String'],
            'trend' => ['type' => 'String'],
            'trendLabel' => ['type' => 'String'],
            'statA' => ['type' => 'String'],
            'statB' => ['type' => 'String'],
            'team' => ['type' => 'SrTeamIdentity'],
        ],
    ]);

    register_graphql_object_type('SrStatLeader', [
        'fields' => [
            'category' => ['type' => 'String'],
            'player' => ['type' => 'String'],
            'monogram' => ['type' => 'String'],
            'value' => ['type' => 'String'],
            'team' => ['type' => 'String'],
            'slug' => ['type' => 'String'],
            'image' => ['type' => 'SrMediaAsset'],
        ],
    ]);

    register_graphql_object_type('SrVideoHighlight', [
        'fields' => [
            'title' => ['type' => 'String'],
            'duration' => ['type' => 'String'],
            'href' => ['type' => 'String'],
            'featured' => ['type' => 'Boolean'],
            'image' => ['type' => 'SrMediaAsset'],
        ],
    ]);

    register_graphql_object_type('SrOpinionItem', [
        'fields' => [
            'title' => ['type' => 'String'],
            'author' => ['type' => 'String'],
            'category' => ['type' => 'String'],
            'href' => ['type' => 'String'],
            'image' => ['type' => 'SrMediaAsset'],
        ],
    ]);

    register_graphql_object_type('SrMlbHubHero', [
        'fields' => [
            'articleSlug' => ['type' => 'String'],
            'pillPrimary' => ['type' => 'String'],
            'pillSecondary' => ['type' => 'String'],
            'headline' => ['type' => 'String'],
            'deck' => ['type' => 'String'],
            'author' => ['type' => 'String'],
            'date' => ['type' => 'String'],
            'readTime' => ['type' => 'Int'],
            'image' => ['type' => 'SrMediaAsset'],
        ],
    ]);

    register_graphql_object_type('SrMlbHubSettings', [
        'fields' => [
            'seoTitle' => ['type' => 'String'],
            'seoDescription' => ['type' => 'String'],
            'hero' => ['type' => 'SrMlbHubHero'],
            'featuredStorySlugs' => ['type' => ['list_of' => 'String']],
            'headlineSlugs' => ['type' => ['list_of' => 'String']],
            'trendingSlugs' => ['type' => ['list_of' => 'String']],
            'liveGame' => ['type' => 'SrLiveGame'],
            'scoreboardLabel' => ['type' => 'String'],
            'scoreboard' => ['type' => ['list_of' => 'SrScoreboardGame']],
            'playerSpotlight' => ['type' => 'SrPlayerSpotlight'],
            'teamHub' => ['type' => 'SrTeamHub'],
            'matchupsLabel' => ['type' => 'String'],
            'matchups' => ['type' => ['list_of' => 'SrMatchup']],
            'rankingsLabel' => ['type' => 'String'],
            'rankingsColumns' => ['type' => ['list_of' => 'String']],
            'rankings' => ['type' => ['list_of' => 'SrTeamStanding']],
            'analyticsLabel' => ['type' => 'String'],
            'statLeaders' => ['type' => ['list_of' => 'SrStatLeader']],
            'videoHighlights' => ['type' => ['list_of' => 'SrVideoHighlight']],
            'opinions' => ['type' => ['list_of' => 'SrOpinionItem']],
            'newsletterHeading' => ['type' => 'String'],
            'newsletterSubheading' => ['type' => 'String'],
        ],
    ]);

    register_graphql_field('RootQuery', 'mlbHubSettings', [
        'type' => 'SrMlbHubSettings',
        'description' => 'Manual editorial configuration for the MLB hub landing page.',
        'resolve' => function() {
            return sr_get_mlb_hub_settings_payload();
        },
    ]);
}

function sr_normalize_post_slug($post_value) {
    if (empty($post_value)) {
        return '';
    }

    if (is_numeric($post_value)) {
        $post_value = get_post((int) $post_value);
    }

    if ($post_value instanceof WP_Post) {
        return $post_value->post_name;
    }

    if (is_array($post_value)) {
        if (!empty($post_value['post_name'])) {
            return (string) $post_value['post_name'];
        }

        if (!empty($post_value['slug'])) {
            return (string) $post_value['slug'];
        }

        if (!empty($post_value['ID'])) {
            $post = get_post((int) $post_value['ID']);
            return $post instanceof WP_Post ? $post->post_name : '';
        }
    }

    return '';
}

function sr_normalize_post_slug_list($posts) {
    if (empty($posts)) {
        return [];
    }

    if (!is_array($posts)) {
        $posts = [$posts];
    }

    $slugs = array_map('sr_normalize_post_slug', $posts);

    return array_values(array_filter(array_map('trim', $slugs)));
}

function sr_normalize_media_asset($asset) {
    if (empty($asset)) {
        return null;
    }

    if (is_numeric($asset)) {
        $attachment_id = (int) $asset;
        $src = wp_get_attachment_image_url($attachment_id, 'full');

        if (!$src) {
            return null;
        }

        $meta = wp_get_attachment_metadata($attachment_id);

        return [
            'src' => $src,
            'alt' => get_post_meta($attachment_id, '_wp_attachment_image_alt', true) ?: '',
            'width' => !empty($meta['width']) ? (int) $meta['width'] : 0,
            'height' => !empty($meta['height']) ? (int) $meta['height'] : 0,
            'credit' => wp_get_attachment_caption($attachment_id) ?: null,
        ];
    }

    if (!is_array($asset)) {
        return null;
    }

    $src = !empty($asset['url']) ? $asset['url'] : (!empty($asset['src']) ? $asset['src'] : '');

    if (!$src) {
        return null;
    }

    return [
        'src' => $src,
        'alt' => !empty($asset['alt']) ? $asset['alt'] : '',
        'width' => !empty($asset['width']) ? (int) $asset['width'] : 0,
        'height' => !empty($asset['height']) ? (int) $asset['height'] : 0,
        'credit' => !empty($asset['caption']) ? wp_strip_all_tags($asset['caption']) : null,
    ];
}

function sr_normalize_team_identity($team) {
    if (empty($team) || !is_array($team)) {
        return null;
    }

    return [
        'name' => !empty($team['name']) ? (string) $team['name'] : '',
        'shortName' => !empty($team['short_name']) ? (string) $team['short_name'] : '',
        'primaryColor' => !empty($team['primary_color']) ? (string) $team['primary_color'] : '',
        'accentColor' => !empty($team['accent_color']) ? (string) $team['accent_color'] : '',
        'textColor' => !empty($team['text_color']) ? (string) $team['text_color'] : null,
    ];
}

function sr_normalize_score_team($team) {
    if (empty($team) || !is_array($team)) {
        return null;
    }

    $normalized = sr_normalize_team_identity($team);

    if (!$normalized) {
        return null;
    }

    $normalized['score'] = isset($team['score']) && '' !== $team['score'] ? (int) $team['score'] : null;
    $normalized['record'] = !empty($team['record']) ? (string) $team['record'] : null;
    $normalized['isWinner'] = isset($team['is_winner']) ? (bool) $team['is_winner'] : null;

    return $normalized;
}

function sr_normalize_stat_pairs($rows) {
    if (empty($rows) || !is_array($rows)) {
        return [];
    }

    return array_values(array_filter(array_map(function($row) {
        if (!is_array($row) || empty($row['label'])) {
            return null;
        }

        return [
            'label' => (string) $row['label'],
            'value' => isset($row['value']) ? (string) $row['value'] : '',
        ];
    }, $rows)));
}

function sr_normalize_form_values($value) {
    if (empty($value)) {
        return [];
    }

    if (is_array($value)) {
        return array_values(array_filter(array_map('trim', $value)));
    }

    $parts = preg_split('/[\r\n,]+/', (string) $value);

    return array_values(array_filter(array_map('trim', $parts)));
}

function sr_normalize_hub_team_entries($rows) {
    if (empty($rows) || !is_array($rows)) {
        return [];
    }

    return array_values(array_filter(array_map(function($row) {
        if (!is_array($row)) {
            return null;
        }

        $team = sr_normalize_team_identity(isset($row['team']) ? $row['team'] : []);

        if (!$team) {
            return null;
        }

        return [
            'slug' => !empty($row['slug']) ? (string) $row['slug'] : null,
            'meta' => !empty($row['meta']) ? (string) $row['meta'] : '',
            'form' => sr_normalize_form_values(isset($row['form']) ? $row['form'] : []),
            'team' => $team,
        ];
    }, $rows)));
}

function sr_normalize_score_teams($rows) {
    if (empty($rows) || !is_array($rows)) {
        return [];
    }

    return array_values(array_filter(array_map('sr_normalize_score_team', $rows)));
}

function sr_normalize_matchups($rows) {
    if (empty($rows) || !is_array($rows)) {
        return [];
    }

    return array_values(array_filter(array_map(function($row) {
        if (!is_array($row)) {
            return null;
        }

        return [
            'status' => !empty($row['status']) ? (string) $row['status'] : '',
            'isLive' => !empty($row['is_live']),
            'clock' => !empty($row['clock']) ? (string) $row['clock'] : null,
            'info' => !empty($row['info']) ? (string) $row['info'] : null,
            'venue' => !empty($row['venue']) ? (string) $row['venue'] : null,
            'network' => !empty($row['network']) ? (string) $row['network'] : null,
            'seriesNote' => !empty($row['series_note']) ? (string) $row['series_note'] : null,
            'spread' => !empty($row['spread']) ? (string) $row['spread'] : null,
            'overUnder' => !empty($row['over_under']) ? (string) $row['over_under'] : null,
            'teams' => sr_normalize_score_teams(isset($row['teams']) ? $row['teams'] : []),
        ];
    }, $rows)));
}

function sr_normalize_rankings($rows) {
    if (empty($rows) || !is_array($rows)) {
        return [];
    }

    return array_values(array_filter(array_map(function($row) {
        if (!is_array($row)) {
            return null;
        }

        $team = sr_normalize_team_identity(isset($row['team']) ? $row['team'] : []);

        if (!$team) {
            return null;
        }

        return [
            'rank' => isset($row['rank']) ? (int) $row['rank'] : 0,
            'record' => !empty($row['record']) ? (string) $row['record'] : '',
            'trend' => !empty($row['trend']) ? (string) $row['trend'] : 'flat',
            'trendLabel' => !empty($row['trend_label']) ? (string) $row['trend_label'] : '',
            'statA' => !empty($row['stat_a']) ? (string) $row['stat_a'] : '',
            'statB' => !empty($row['stat_b']) ? (string) $row['stat_b'] : '',
            'team' => $team,
        ];
    }, $rows)));
}

function sr_normalize_stat_leaders($rows) {
    if (empty($rows) || !is_array($rows)) {
        return [];
    }

    return array_values(array_filter(array_map(function($row) {
        if (!is_array($row) || empty($row['category']) || empty($row['player'])) {
            return null;
        }

        return [
            'category' => (string) $row['category'],
            'player' => (string) $row['player'],
            'monogram' => !empty($row['monogram']) ? (string) $row['monogram'] : '',
            'value' => isset($row['value']) ? (string) $row['value'] : '',
            'team' => !empty($row['team']) ? (string) $row['team'] : '',
            'slug' => !empty($row['slug']) ? (string) $row['slug'] : null,
            'image' => sr_normalize_media_asset(isset($row['image']) ? $row['image'] : null),
        ];
    }, $rows)));
}

function sr_normalize_video_highlights($rows) {
    if (empty($rows) || !is_array($rows)) {
        return [];
    }

    return array_values(array_filter(array_map(function($row) {
        if (!is_array($row) || empty($row['title'])) {
            return null;
        }

        return [
            'title' => (string) $row['title'],
            'duration' => !empty($row['duration']) ? (string) $row['duration'] : '',
            'href' => !empty($row['href']) ? (string) $row['href'] : null,
            'featured' => !empty($row['featured']),
            'image' => sr_normalize_media_asset(isset($row['image']) ? $row['image'] : null),
        ];
    }, $rows)));
}

function sr_normalize_opinions($rows) {
    if (empty($rows) || !is_array($rows)) {
        return [];
    }

    return array_values(array_filter(array_map(function($row) {
        if (!is_array($row) || empty($row['title'])) {
            return null;
        }

        return [
            'title' => (string) $row['title'],
            'author' => !empty($row['author']) ? (string) $row['author'] : '',
            'category' => !empty($row['category']) ? (string) $row['category'] : '',
            'href' => !empty($row['href']) ? (string) $row['href'] : null,
            'image' => sr_normalize_media_asset(isset($row['image']) ? $row['image'] : null),
        ];
    }, $rows)));
}

function sr_get_mlb_hub_settings_payload() {
    if (function_exists('sr_get_sport_hub_settings_payload')) {
        return sr_get_sport_hub_settings_payload('mlb');
    }

    return [];
}
