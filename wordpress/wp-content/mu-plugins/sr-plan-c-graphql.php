<?php
/**
 * Plan C GraphQL — expose articleFields without WPGraphQL for ACF.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('graphql_register_types', 'sr_register_plan_c_graphql_fields', 20);

function sr_register_plan_c_graphql_fields() {
    if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_object_type('SrArticleEssential', [
        'fields' => [
            'point' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SrRelatedArticle', [
        'fields' => [
            'slug' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SrArticleFields', [
        'description' => 'Custom article metadata exposed without ACF.',
        'fields' => [
            'deck' => ['type' => 'String'],
            'articleSummary' => ['type' => 'String'],
            'sourceArticleLink' => ['type' => 'String'],
            'sentiment' => ['type' => 'String'],
            'msnPublish' => ['type' => 'Boolean'],
            'yahooPublish' => ['type' => 'Boolean'],
            'readTime' => ['type' => 'Int'],
            'isBreaking' => ['type' => 'Boolean'],
            'isEditorsPick' => ['type' => 'Boolean'],
            'trendingScore' => ['type' => 'Int'],
            'essentials' => ['type' => ['list_of' => 'SrArticleEssential']],
            'relatedStories' => ['type' => ['list_of' => 'SrRelatedArticle']],
        ],
    ]);

    register_graphql_field('Article', 'articleFields', [
        'type' => 'SrArticleFields',
        'description' => 'Editorial metadata for The Sports Rivalry articles.',
        'resolve' => function($article) {
            $post_id = isset($article->databaseId) ? (int) $article->databaseId : 0;

            if (!$post_id) {
                return null;
            }

            return sr_resolve_article_fields_graphql($post_id);
        },
    ]);
}
