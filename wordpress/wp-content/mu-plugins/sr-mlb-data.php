<?php
/**
 * MLB stats tables + teams page settings (JSON in wp_options).
 */

if (!defined('ABSPATH')) {
    exit;
}

const SR_MLB_STATS_OPTION = 'sr_mlb_stats_settings';
const SR_MLB_TEAMS_OPTION = 'sr_mlb_teams_page_settings';

function sr_get_mlb_stats_settings() {
    $stored = get_option(SR_MLB_STATS_OPTION, []);

    return is_array($stored) ? $stored : [];
}

function sr_get_mlb_teams_page_settings() {
    $stored = get_option(SR_MLB_TEAMS_OPTION, []);

    return is_array($stored) ? $stored : [];
}

add_action('graphql_register_types', 'sr_register_mlb_data_graphql', 27);

function sr_register_mlb_data_graphql() {
    if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_object_type('SrMlbTimelineEvent', [
        'fields' => [
            'year' => ['type' => 'String'],
            'title' => ['type' => 'String'],
            'description' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SrMlbQuickFact', [
        'fields' => [
            'icon' => ['type' => 'String'],
            'value' => ['type' => 'String'],
            'label' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SrMlbStatsSettings', [
        'fields' => [
            'seasonLabel' => ['type' => 'String'],
            'battingJson' => ['type' => 'String'],
            'pitchingJson' => ['type' => 'String'],
            'fieldingJson' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SrMlbTeamsPageSettings', [
        'fields' => [
            'featuredTeamIds' => ['type' => ['list_of' => 'String']],
            'timeline' => ['type' => ['list_of' => 'SrMlbTimelineEvent']],
            'quickFacts' => ['type' => ['list_of' => 'SrMlbQuickFact']],
            'heroTitle' => ['type' => 'String'],
            'heroDescription' => ['type' => 'String'],
        ],
    ]);

    register_graphql_field('RootQuery', 'mlbStatsSettings', [
        'type' => 'SrMlbStatsSettings',
        'resolve' => function() {
            $settings = sr_get_mlb_stats_settings();

            return [
                'seasonLabel' => (string) ($settings['seasonLabel'] ?? '2026'),
                'battingJson' => wp_json_encode($settings['batting'] ?? []),
                'pitchingJson' => wp_json_encode($settings['pitching'] ?? []),
                'fieldingJson' => wp_json_encode($settings['fielding'] ?? []),
            ];
        },
    ]);

    register_graphql_field('RootQuery', 'mlbTeamsPageSettings', [
        'type' => 'SrMlbTeamsPageSettings',
        'resolve' => function() {
            $settings = sr_get_mlb_teams_page_settings();

            return [
                'featuredTeamIds' => array_values(array_filter(array_map('strval', $settings['featuredTeamIds'] ?? []))),
                'timeline' => is_array($settings['timeline'] ?? null) ? $settings['timeline'] : [],
                'quickFacts' => is_array($settings['quickFacts'] ?? null) ? $settings['quickFacts'] : [],
                'heroTitle' => (string) ($settings['heroTitle'] ?? ''),
                'heroDescription' => (string) ($settings['heroDescription'] ?? ''),
            ];
        },
    ]);
}
