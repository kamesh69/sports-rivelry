<?php
/**
 * Allow Next.js draft preview to read unpublished articles via GraphQL.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_filter('graphql_post_object_query_args', 'sr_allow_preview_graphql_post_query_args', 10, 5);
add_filter('graphql_post_object_connection_query_args', 'sr_allow_preview_graphql_post_connection_args', 10, 5);

function sr_get_preview_secret_from_request() {
  $secret = defined('SR_PREVIEW_SECRET') ? SR_PREVIEW_SECRET : '';

  if (!$secret) {
    return '';
  }

  $header = isset($_SERVER['HTTP_X_PREVIEW_SECRET']) ? (string) $_SERVER['HTTP_X_PREVIEW_SECRET'] : '';

  if ($header && hash_equals($secret, $header)) {
    return $secret;
  }

  return '';
}

function sr_is_preview_graphql_request() {
  return sr_get_preview_secret_from_request() !== '';
}

function sr_allow_preview_graphql_post_query_args($query_args, $source, $args, $context, $info) {
  if (!sr_is_preview_graphql_request()) {
    return $query_args;
  }

  $query_args['post_status'] = ['publish', 'draft', 'pending', 'future', 'private'];

  return $query_args;
}

function sr_allow_preview_graphql_post_connection_args($query_args, $source, $args, $context, $info) {
  if (!sr_is_preview_graphql_request()) {
    return $query_args;
  }

  $query_args['post_status'] = ['publish', 'draft', 'pending', 'future', 'private'];

  return $query_args;
}
