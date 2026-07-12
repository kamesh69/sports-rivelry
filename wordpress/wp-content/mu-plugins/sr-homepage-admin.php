<?php
/**
 * Homepage admin + GraphQL.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'sr_register_homepage_admin_menu', 18);

function sr_register_homepage_admin_menu() {
    add_submenu_page(
        'sports-rivalry-layout',
        'Homepage',
        'Homepage',
        'edit_posts',
        'sr-homepage-settings',
        'sr_render_homepage_admin_page'
    );
}

function sr_render_homepage_admin_page() {
    if (!current_user_can('edit_posts')) {
        return;
    }

    if (isset($_POST['sr_save_homepage']) && check_admin_referer('sr_save_homepage_action')) {
        $settings = [];

        $settings['homepage_hero_article'] = (int) ($_POST['homepage_hero_article'] ?? 0);
        $settings['homepage_breaking_slugs'] = array_filter(array_map('sanitize_title', (array) ($_POST['homepage_breaking_slugs'] ?? [])));
        $settings['homepage_sport_rail_order'] = array_filter(array_map('sanitize_key', (array) ($_POST['homepage_sport_rail_order'] ?? [])));
        $settings['homepage_editors_pick_ids'] = sr_parse_post_id_list($_POST['homepage_editors_pick_ids'] ?? []);
        $settings['homepage_featured_author_ids'] = array_map('intval', (array) ($_POST['homepage_featured_author_ids'] ?? []));
        $settings['homepage_newsletter_issue'] = (int) ($_POST['homepage_newsletter_issue'] ?? 0);
        $settings['homepage_category_strip_json'] = wp_unslash($_POST['homepage_category_strip_json'] ?? '[]');
        $settings['homepage_quick_hits_json'] = wp_unslash($_POST['homepage_quick_hits_json'] ?? '{}');

        sr_save_homepage_storage($settings);
        sr_revalidate_homepage_after_save();

        echo '<div class="notice notice-success"><p>Homepage settings saved.</p></div>';
    }

    $settings = sr_get_homepage_storage();
    $articles = sr_get_published_article_choices();
    $users = get_users(['who' => 'authors', 'has_published_posts' => true]);
    $newsletters = get_posts(['post_type' => 'newsletter_issue', 'numberposts' => 50, 'post_status' => 'publish']);

    ?>
    <div class="wrap">
        <h1>Homepage</h1>
        <form method="post">
            <?php wp_nonce_field('sr_save_homepage_action'); ?>
            <table class="form-table">
                <tr>
                    <th>Hero article</th>
                    <td>
                        <select name="homepage_hero_article">
                            <option value="0">Auto (breaking/trending)</option>
                            <?php foreach ($articles as $id => $label) : ?>
                                <option value="<?php echo (int) $id; ?>" <?php selected((int) ($settings['homepage_hero_article'] ?? 0), (int) $id); ?>><?php echo esc_html($label); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>Editor's picks</th>
                    <td>
                        <select name="homepage_editors_pick_ids[]" multiple size="6" style="min-width:420px;">
                            <?php foreach ($articles as $id => $label) : ?>
                                <option value="<?php echo (int) $id; ?>" <?php selected(in_array((int) $id, sr_parse_post_id_list($settings['homepage_editors_pick_ids'] ?? []), true)); ?>><?php echo esc_html($label); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>Featured authors</th>
                    <td>
                        <select name="homepage_featured_author_ids[]" multiple size="6">
                            <?php foreach ($users as $user) : ?>
                                <option value="<?php echo (int) $user->ID; ?>" <?php selected(in_array((int) $user->ID, array_map('intval', (array) ($settings['homepage_featured_author_ids'] ?? [])), true)); ?>><?php echo esc_html($user->display_name); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>Newsletter issue</th>
                    <td>
                        <select name="homepage_newsletter_issue">
                            <option value="0">Default</option>
                            <?php foreach ($newsletters as $issue) : ?>
                                <option value="<?php echo (int) $issue->ID; ?>" <?php selected((int) ($settings['homepage_newsletter_issue'] ?? 0), (int) $issue->ID); ?>><?php echo esc_html($issue->post_title); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>Category strip JSON</th>
                    <td><textarea name="homepage_category_strip_json" rows="6" class="large-text code"><?php echo esc_textarea($settings['homepage_category_strip_json'] ?? '[]'); ?></textarea></td>
                </tr>
                <tr>
                    <th>Quick hits JSON</th>
                    <td><textarea name="homepage_quick_hits_json" rows="8" class="large-text code"><?php echo esc_textarea($settings['homepage_quick_hits_json'] ?? '{}'); ?></textarea></td>
                </tr>
            </table>
            <?php submit_button('Save Homepage', 'primary', 'sr_save_homepage'); ?>
        </form>
    </div>
    <?php
}

add_action('graphql_register_types', 'sr_register_homepage_graphql', 25);

function sr_register_homepage_graphql() {
    if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_object_type('SrHomepageCategoryItem', [
        'fields' => [
            'label' => ['type' => 'String'],
            'href' => ['type' => 'String'],
            'sportSlug' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SrHomepageQuickHits', [
        'fields' => [
            'enabled' => ['type' => 'Boolean'],
            'title' => ['type' => 'String'],
            'selectionMode' => ['type' => 'String'],
            'featuredArticleSlug' => ['type' => 'String'],
            'secondaryArticleSlugs' => ['type' => ['list_of' => 'String']],
            'authorSlug' => ['type' => 'String'],
            'sportSlug' => ['type' => 'String'],
            'secondaryCount' => ['type' => 'Int'],
        ],
    ]);

    register_graphql_object_type('SrHomepageSettings', [
        'fields' => [
            'heroArticleSlug' => ['type' => 'String'],
            'breakingSlugs' => ['type' => ['list_of' => 'String']],
            'sportRailOrder' => ['type' => ['list_of' => 'String']],
            'editorsPickSlugs' => ['type' => ['list_of' => 'String']],
            'featuredAuthorSlugs' => ['type' => ['list_of' => 'String']],
            'newsletterIssueSlug' => ['type' => 'String'],
            'categoryStrip' => ['type' => ['list_of' => 'SrHomepageCategoryItem']],
            'quickHits' => ['type' => 'SrHomepageQuickHits'],
        ],
    ]);

    register_graphql_field('RootQuery', 'homepageSettings', [
        'type' => 'SrHomepageSettings',
        'resolve' => function() {
            return sr_get_homepage_settings_payload();
        },
    ]);
}

function sr_get_homepage_settings_payload() {
    $settings = sr_get_homepage_storage();
    $category_strip = json_decode($settings['homepage_category_strip_json'] ?? '[]', true);
    $quick_hits = json_decode($settings['homepage_quick_hits_json'] ?? '{}', true);

    if (!is_array($category_strip)) {
        $category_strip = [];
    }

    if (!is_array($quick_hits)) {
        $quick_hits = [];
    }

    $newsletter_slug = '';

    if (!empty($settings['homepage_newsletter_issue'])) {
        $post = get_post((int) $settings['homepage_newsletter_issue']);

        if ($post instanceof WP_Post) {
            $newsletter_slug = $post->post_name;
        }
    }

    return [
        'heroArticleSlug' => sr_normalize_post_slug($settings['homepage_hero_article'] ?? 0),
        'breakingSlugs' => array_values(array_filter(array_map('sanitize_title', (array) ($settings['homepage_breaking_slugs'] ?? [])))),
        'sportRailOrder' => array_values(array_filter(array_map('sanitize_key', (array) ($settings['homepage_sport_rail_order'] ?? [])))),
        'editorsPickSlugs' => sr_normalize_post_slug_list($settings['homepage_editors_pick_ids'] ?? []),
        'featuredAuthorSlugs' => array_values(array_filter(array_map(function($user_id) {
            $user = get_userdata((int) $user_id);

            return $user ? $user->user_nicename : null;
        }, (array) ($settings['homepage_featured_author_ids'] ?? [])))),
        'newsletterIssueSlug' => $newsletter_slug,
        'categoryStrip' => array_values(array_filter(array_map(function($item) {
            if (!is_array($item) || empty($item['label'])) {
                return null;
            }

            return [
                'label' => (string) $item['label'],
                'href' => !empty($item['href']) ? (string) $item['href'] : '',
                'sportSlug' => !empty($item['sportSlug']) ? (string) $item['sportSlug'] : null,
            ];
        }, $category_strip))),
        'quickHits' => !empty($quick_hits['enabled']) ? [
            'enabled' => true,
            'title' => (string) ($quick_hits['title'] ?? ''),
            'selectionMode' => (string) ($quick_hits['selectionMode'] ?? 'manual'),
            'featuredArticleSlug' => !empty($quick_hits['featuredArticleSlug']) ? (string) $quick_hits['featuredArticleSlug'] : null,
            'secondaryArticleSlugs' => array_values(array_filter((array) ($quick_hits['secondaryArticleSlugs'] ?? []))),
            'authorSlug' => !empty($quick_hits['authorSlug']) ? (string) $quick_hits['authorSlug'] : null,
            'sportSlug' => !empty($quick_hits['sportSlug']) ? (string) $quick_hits['sportSlug'] : null,
            'secondaryCount' => isset($quick_hits['secondaryCount']) ? (int) $quick_hits['secondaryCount'] : null,
        ] : null,
    ];
}
