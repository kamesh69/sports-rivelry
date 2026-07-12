<?php
/**
 * Author profile user meta + GraphQL.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('show_user_profile', 'sr_render_author_profile_fields');
add_action('edit_user_profile', 'sr_render_author_profile_fields');
add_action('personal_options_update', 'sr_save_author_profile_fields');
add_action('edit_user_profile_update', 'sr_save_author_profile_fields');

function sr_render_author_profile_fields($user) {
    if (!current_user_can('edit_user', $user->ID)) {
        return;
    }

    $beat = get_user_meta($user->ID, 'author_beat', true);
    $bio = get_user_meta($user->ID, 'author_bio', true);
    $expertise = get_user_meta($user->ID, 'author_expertise', true);
    $role = get_user_meta($user->ID, 'author_role', true);
    $socials = get_user_meta($user->ID, 'author_socials', true);
    ?>
    <h2>The Sports Rivalry Author Profile</h2>
    <table class="form-table">
        <tr>
            <th><label for="author_role">Role</label></th>
            <td><input name="author_role" id="author_role" class="regular-text" value="<?php echo esc_attr($role); ?>"></td>
        </tr>
        <tr>
            <th><label for="author_beat">Beat</label></th>
            <td><input name="author_beat" id="author_beat" class="regular-text" value="<?php echo esc_attr($beat); ?>"></td>
        </tr>
        <tr>
            <th><label for="author_bio">Bio</label></th>
            <td><textarea name="author_bio" id="author_bio" class="large-text" rows="4"><?php echo esc_textarea($bio); ?></textarea></td>
        </tr>
        <tr>
            <th><label for="author_expertise">Expertise</label></th>
            <td><input name="author_expertise" id="author_expertise" class="large-text" value="<?php echo esc_attr($expertise); ?>"></td>
        </tr>
        <tr>
            <th><label for="author_socials">Social links JSON</label></th>
            <td><textarea name="author_socials" id="author_socials" class="large-text code" rows="4"><?php echo esc_textarea(is_array($socials) ? wp_json_encode($socials, JSON_PRETTY_PRINT) : (string) $socials); ?></textarea></td>
        </tr>
    </table>
    <?php
}

function sr_save_author_profile_fields($user_id) {
    if (!current_user_can('edit_user', $user_id)) {
        return;
    }

    update_user_meta($user_id, 'author_role', sanitize_text_field(wp_unslash($_POST['author_role'] ?? '')));
    update_user_meta($user_id, 'author_beat', sanitize_text_field(wp_unslash($_POST['author_beat'] ?? '')));
    update_user_meta($user_id, 'author_bio', sanitize_textarea_field(wp_unslash($_POST['author_bio'] ?? '')));
    update_user_meta($user_id, 'author_expertise', sanitize_text_field(wp_unslash($_POST['author_expertise'] ?? '')));

    $socials = json_decode(wp_unslash($_POST['author_socials'] ?? '[]'), true);
    update_user_meta($user_id, 'author_socials', is_array($socials) ? $socials : []);
}

function sr_build_author_profile_payload($user) {
    if (!$user instanceof WP_User) {
        return null;
    }

    $socials_raw = get_user_meta($user->ID, 'author_socials', true);
    $socials = [];

    if (is_array($socials_raw)) {
        foreach ($socials_raw as $item) {
            if (!is_array($item) || empty($item['url'])) {
                continue;
            }

            $socials[] = [
                'platform' => (string) ($item['platform'] ?? ''),
                'label' => (string) ($item['label'] ?? $item['platform'] ?? 'Link'),
                'url' => esc_url_raw($item['url']),
            ];
        }
    }

    return [
        'slug' => $user->user_nicename,
        'name' => $user->display_name,
        'role' => (string) get_user_meta($user->ID, 'author_role', true) ?: 'Contributor',
        'beat' => (string) get_user_meta($user->ID, 'author_beat', true) ?: 'Sports',
        'bio' => (string) get_user_meta($user->ID, 'author_bio', true),
        'expertise' => (string) get_user_meta($user->ID, 'author_expertise', true),
        'avatarUrl' => get_avatar_url($user->ID, ['size' => 720]),
        'socials' => $socials,
    ];
}

add_action('graphql_register_types', 'sr_register_author_profile_graphql', 25);

function sr_register_author_profile_graphql() {
    if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_object_type('SrAuthorSocial', [
        'fields' => [
            'platform' => ['type' => 'String'],
            'label' => ['type' => 'String'],
            'url' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SrAuthorProfile', [
        'fields' => [
            'slug' => ['type' => 'String'],
            'name' => ['type' => 'String'],
            'role' => ['type' => 'String'],
            'beat' => ['type' => 'String'],
            'bio' => ['type' => 'String'],
            'expertise' => ['type' => 'String'],
            'avatarUrl' => ['type' => 'String'],
            'socials' => ['type' => ['list_of' => 'SrAuthorSocial']],
        ],
    ]);

    register_graphql_field('RootQuery', 'authorProfile', [
        'type' => 'SrAuthorProfile',
        'args' => ['slug' => ['type' => ['non_null' => 'String']]],
        'resolve' => function($source, $args) {
            $user = get_user_by('slug', sanitize_title($args['slug'] ?? ''));

            return $user ? sr_build_author_profile_payload($user) : null;
        },
    ]);

    register_graphql_field('RootQuery', 'authorProfiles', [
        'type' => ['list_of' => 'SrAuthorProfile'],
        'resolve' => function() {
            $users = get_users(['who' => 'authors', 'has_published_posts' => true]);

            return array_values(array_filter(array_map('sr_build_author_profile_payload', $users)));
        },
    ]);
}
