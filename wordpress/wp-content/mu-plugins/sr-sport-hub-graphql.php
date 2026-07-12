<?php
/**
 * Sport hub GraphQL payload builder.
 */

if (!defined('ABSPATH')) {
    exit;
}

function sr_get_sport_hub_settings_payload($sport) {
    $sport = sanitize_key($sport);
    $prefix = sr_sport_hub_field_prefix($sport);

    $hero = [
        'articleSlug' => sr_normalize_post_slug(sr_get_sport_hub_field($sport, $prefix . 'hero_article')),
        'pillPrimary' => sr_get_sport_hub_field($sport, $prefix . 'hero_pill_primary'),
        'pillSecondary' => sr_get_sport_hub_field($sport, $prefix . 'hero_pill_secondary'),
        'headline' => sr_get_sport_hub_field($sport, $prefix . 'hero_headline'),
        'deck' => sr_get_sport_hub_field($sport, $prefix . 'hero_deck'),
        'author' => sr_get_sport_hub_field($sport, $prefix . 'hero_author'),
        'date' => sr_get_sport_hub_field($sport, $prefix . 'hero_date'),
        'readTime' => sr_get_sport_hub_field($sport, $prefix . 'hero_read_time'),
        'image' => sr_normalize_media_asset(sr_get_sport_hub_field($sport, $prefix . 'hero_image')),
    ];

    $live_game = sr_get_sport_hub_field($sport, $prefix . 'live_game', []);
    $player_spotlight = sr_get_sport_hub_field($sport, $prefix . 'player_spotlight', []);
    $team_hub_tabs = sr_get_sport_hub_field($sport, $prefix . 'team_hub_tabs', []);
    $team_hub_teams = sr_get_sport_hub_field($sport, $prefix . 'team_hub_teams', []);
    $rankings_column_a = sr_get_sport_hub_field($sport, $prefix . 'rankings_column_a');
    $rankings_column_b = sr_get_sport_hub_field($sport, $prefix . 'rankings_column_b');

    return [
        'sport' => $sport,
        'seoTitle' => sr_get_sport_hub_field($sport, $prefix . 'seo_title'),
        'seoDescription' => sr_get_sport_hub_field($sport, $prefix . 'seo_description'),
        'hero' => $hero,
        'featuredStorySlugs' => sr_normalize_post_slug_list(sr_get_sport_hub_field($sport, $prefix . 'featured_stories', [])),
        'headlineSlugs' => sr_normalize_post_slug_list(sr_get_sport_hub_field($sport, $prefix . 'headlines', [])),
        'trendingSlugs' => sr_normalize_post_slug_list(sr_get_sport_hub_field($sport, $prefix . 'trending', [])),
        'liveGame' => !empty($live_game) ? [
            'status' => !empty($live_game['status']) ? (string) $live_game['status'] : '',
            'isLive' => !empty($live_game['is_live']),
            'clock' => !empty($live_game['clock']) ? (string) $live_game['clock'] : null,
            'note' => !empty($live_game['note']) ? (string) $live_game['note'] : null,
            'away' => sr_normalize_score_team(isset($live_game['away']) ? $live_game['away'] : []),
            'home' => sr_normalize_score_team(isset($live_game['home']) ? $live_game['home'] : []),
        ] : null,
        'scoreboardLabel' => sr_get_sport_hub_field($sport, $prefix . 'scoreboard_label'),
        'scoreboard' => array_values(array_filter(array_map(function($row) {
            if (!is_array($row)) {
                return null;
            }

            return [
                'status' => !empty($row['status']) ? (string) $row['status'] : '',
                'isLive' => !empty($row['is_live']),
                'detail' => !empty($row['detail']) ? (string) $row['detail'] : null,
                'away' => sr_normalize_score_team(isset($row['away']) ? $row['away'] : []),
                'home' => sr_normalize_score_team(isset($row['home']) ? $row['home'] : []),
            ];
        }, sr_get_sport_hub_field($sport, $prefix . 'scoreboard', [])))),
        'playerSpotlight' => !empty($player_spotlight) ? [
            'player' => !empty($player_spotlight['player']) ? (string) $player_spotlight['player'] : '',
            'meta' => !empty($player_spotlight['meta']) ? (string) $player_spotlight['meta'] : '',
            'monogram' => !empty($player_spotlight['monogram']) ? (string) $player_spotlight['monogram'] : '',
            'footnote' => !empty($player_spotlight['footnote']) ? (string) $player_spotlight['footnote'] : null,
            'stats' => sr_normalize_stat_pairs(isset($player_spotlight['stats']) ? $player_spotlight['stats'] : []),
        ] : null,
        'teamHub' => [
            'tabs' => array_values(array_filter(array_map(function($row) {
                if (is_array($row) && !empty($row['label'])) {
                    return (string) $row['label'];
                }

                return is_string($row) ? trim($row) : null;
            }, is_array($team_hub_tabs) ? $team_hub_tabs : []))),
            'teams' => sr_normalize_hub_team_entries($team_hub_teams),
        ],
        'matchupsLabel' => sr_get_sport_hub_field($sport, $prefix . 'matchups_label'),
        'matchups' => sr_normalize_matchups(sr_get_sport_hub_field($sport, $prefix . 'matchups', [])),
        'rankingsLabel' => sr_get_sport_hub_field($sport, $prefix . 'rankings_label'),
        'rankingsColumns' => array_values(array_filter([
            $rankings_column_a ? (string) $rankings_column_a : null,
            $rankings_column_b ? (string) $rankings_column_b : null,
        ])),
        'rankings' => sr_normalize_rankings(sr_get_sport_hub_field($sport, $prefix . 'rankings', [])),
        'analyticsLabel' => sr_get_sport_hub_field($sport, $prefix . 'analytics_label'),
        'statLeaders' => sr_normalize_stat_leaders(sr_get_sport_hub_field($sport, $prefix . 'stat_leaders', [])),
        'videoHighlights' => sr_normalize_video_highlights(sr_get_sport_hub_field($sport, $prefix . 'video_highlights', [])),
        'opinions' => sr_normalize_opinions(sr_get_sport_hub_field($sport, $prefix . 'opinions', [])),
        'newsletterHeading' => sr_get_sport_hub_field($sport, $prefix . 'newsletter_heading'),
        'newsletterSubheading' => sr_get_sport_hub_field($sport, $prefix . 'newsletter_subheading'),
    ];
}

add_action('graphql_register_types', 'sr_register_sport_hub_graphql', 25);

function sr_register_sport_hub_graphql() {
    if (!function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_field('RootQuery', 'sportHubSettings', [
        'type' => 'SrMlbHubSettings',
        'description' => 'Editorial configuration for a sport hub landing page.',
        'args' => [
            'sport' => [
                'type' => ['non_null' => 'String'],
                'description' => 'Sport slug (mlb, basketball, golf, nascar, football, etc.)',
            ],
        ],
        'resolve' => function($source, $args) {
            $sport = sanitize_key($args['sport'] ?? '');

            if (!$sport) {
                return null;
            }

            return sr_get_sport_hub_settings_payload($sport);
        },
    ]);
}
