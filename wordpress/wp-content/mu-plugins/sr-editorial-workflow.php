<?php
/**
 * EssentiallySports-style editorial workflow (Plan C / free tier).
 * Classic editor, Yoast-friendly article CPT, source link, summary, sentiment, admin columns.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', 'sr_enable_article_tags', 20);
add_filter('use_block_editor_for_post_type', 'sr_disable_block_editor_for_articles', 10, 2);
add_action('add_meta_boxes', 'sr_register_editorial_meta_boxes', 20);
add_action('save_post_article', 'sr_save_editorial_meta_boxes', 15, 2);
add_filter('manage_article_posts_columns', 'sr_article_admin_columns');
add_action('manage_article_posts_custom_column', 'sr_render_article_admin_column', 10, 2);
add_filter('manage_edit-article_sortable_columns', 'sr_article_sortable_columns');
add_action('wp_dashboard_setup', 'sr_customize_dashboard');
add_action('admin_enqueue_scripts', 'sr_editorial_admin_styles');
add_filter('gettext', 'sr_rename_posts_labels', 10, 3);

function sr_enable_article_tags() {
    register_taxonomy_for_object_type('post_tag', 'article');
}

function sr_disable_block_editor_for_articles($use_block_editor, $post_type) {
    if ('article' === $post_type) {
        return false;
    }

    return $use_block_editor;
}

function sr_register_editorial_meta_boxes() {
    add_meta_box(
        'sr-source-article',
        'Source Article Link',
        'sr_render_source_article_meta_box',
        'article',
        'side',
        'high'
    );

    add_meta_box(
        'sr-article-summary',
        'Article Summary',
        'sr_render_article_summary_meta_box',
        'article',
        'side',
        'default'
    );

    add_meta_box(
        'sr-editorial-signals',
        'Editorial Signals',
        'sr_render_editorial_signals_meta_box',
        'article',
        'side',
        'default'
    );

    add_meta_box(
        'sr-syndication',
        'Syndication',
        'sr_render_syndication_meta_box',
        'article',
        'side',
        'low'
    );
}

function sr_render_source_article_meta_box($post) {
    wp_nonce_field('sr_editorial_meta_box', 'sr_editorial_meta_box_nonce');
    $value = get_post_meta($post->ID, 'source_article_link', true);
    ?>
    <p>
        <label for="sr_source_article_link"><strong>Source URL</strong> <span style="color:#d63638;">*</span></label>
        <input
            type="url"
            class="widefat"
            name="sr_source_article_link"
            id="sr_source_article_link"
            value="<?php echo esc_attr($value); ?>"
            placeholder="https://example.com/story"
        >
    </p>
    <p class="description">Original reporting link, social embed, or reference source for this story.</p>
    <?php
}

function sr_render_article_summary_meta_box($post) {
    $summary = get_post_meta($post->ID, 'article_summary', true);
    $deck = get_post_meta($post->ID, 'deck', true);
    ?>
    <p>
        <label for="sr_article_summary"><strong>Summary</strong></label>
        <textarea name="sr_article_summary" id="sr_article_summary" class="widefat" rows="5" placeholder="One or two sentence deck shown on cards and SEO."><?php echo esc_textarea($summary ?: $deck); ?></textarea>
    </p>
    <p class="description">Used as the article deck on the frontend when the main Deck field is empty.</p>
    <?php
}

function sr_render_editorial_signals_meta_box($post) {
    $sentiment = get_post_meta($post->ID, 'sentiment', true) ?: 'neutral';
    ?>
    <p>
        <label for="sr_sentiment"><strong>Sentiment</strong></label>
        <select name="sr_sentiment" id="sr_sentiment" class="widefat">
            <?php foreach (sr_sentiment_choices() as $key => $label) : ?>
                <option value="<?php echo esc_attr($key); ?>" <?php selected($sentiment, $key); ?>><?php echo esc_html($label); ?></option>
            <?php endforeach; ?>
        </select>
    </p>
    <?php
}

function sr_render_syndication_meta_box($post) {
    $msn = get_post_meta($post->ID, 'msn_publish', true);
    $yahoo = get_post_meta($post->ID, 'yahoo_publish', true);
    ?>
    <p><strong>MSN Publish</strong></p>
    <label><input type="radio" name="sr_msn_publish" value="yes" <?php checked($msn, 'yes'); ?>> Yes</label><br>
    <label><input type="radio" name="sr_msn_publish" value="no" <?php checked($msn !== 'yes', true); ?>> No</label>
    <p><strong>Yahoo Publish</strong></p>
    <label><input type="radio" name="sr_yahoo_publish" value="yes" <?php checked($yahoo, 'yes'); ?>> Yes</label><br>
    <label><input type="radio" name="sr_yahoo_publish" value="no" <?php checked($yahoo !== 'yes', true); ?>> No</label>
    <p class="description">Optional flags for future syndication workflows.</p>
    <?php
}

function sr_sentiment_choices() {
    return [
        'neutral' => 'Neutral',
        'positive' => 'Positive',
        'negative' => 'Negative',
        'mixed' => 'Mixed',
    ];
}

function sr_save_editorial_meta_boxes($post_id, $post) {
    if (!isset($_POST['sr_editorial_meta_box_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['sr_editorial_meta_box_nonce'])), 'sr_editorial_meta_box')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $source = esc_url_raw(wp_unslash($_POST['sr_source_article_link'] ?? ''));

    if ($source) {
        update_post_meta($post_id, 'source_article_link', $source);
    }

    $summary = sanitize_textarea_field(wp_unslash($_POST['sr_article_summary'] ?? ''));
    update_post_meta($post_id, 'article_summary', $summary);

    if ($summary && !get_post_meta($post_id, 'deck', true)) {
        update_post_meta($post_id, 'deck', $summary);
    }

    $sentiment = sanitize_key($_POST['sr_sentiment'] ?? 'neutral');
    update_post_meta($post_id, 'sentiment', array_key_exists($sentiment, sr_sentiment_choices()) ? $sentiment : 'neutral');
    update_post_meta($post_id, 'msn_publish', ('yes' === ($_POST['sr_msn_publish'] ?? 'no')) ? 'yes' : 'no');
    update_post_meta($post_id, 'yahoo_publish', ('yes' === ($_POST['sr_yahoo_publish'] ?? 'no')) ? 'yes' : 'no');
}

function sr_article_admin_columns($columns) {
    $new = [];

    foreach ($columns as $key => $label) {
        $new[$key] = $label;

        if ('title' === $key) {
            $new['sr_sport'] = 'Sport';
            $new['sr_breaking'] = 'Breaking';
            $new['sr_editors_pick'] = "Editor's Pick";
            $new['sr_trending'] = 'Trending';
        }
    }

    return $new;
}

function sr_render_article_admin_column($column, $post_id) {
    switch ($column) {
        case 'sr_sport':
            $terms = get_the_terms($post_id, 'sport');
            echo $terms && !is_wp_error($terms) ? esc_html(implode(', ', wp_list_pluck($terms, 'name'))) : '—';
            break;
        case 'sr_breaking':
            echo get_post_meta($post_id, 'is_breaking', true) ? 'Yes' : '—';
            break;
        case 'sr_editors_pick':
            echo get_post_meta($post_id, 'is_editors_pick', true) ? 'Yes' : '—';
            break;
        case 'sr_trending':
            $score = (int) get_post_meta($post_id, 'trending_score', true);
            echo $score > 0 ? esc_html((string) $score) : '—';
            break;
    }
}

function sr_article_sortable_columns($columns) {
    $columns['sr_trending'] = 'sr_trending';
    return $columns;
}

function sr_customize_dashboard() {
    remove_meta_box('dashboard_primary', 'dashboard', 'side');

    wp_add_dashboard_widget(
        'sr-editorial-dashboard',
        'The Sports Rivalry Editorial',
        'sr_render_editorial_dashboard_widget'
    );
}

function sr_render_editorial_dashboard_widget() {
    $counts = wp_count_posts('article');
    $published = isset($counts->publish) ? (int) $counts->publish : 0;
    $draft = isset($counts->draft) ? (int) $counts->draft : 0;
    $future = isset($counts->future) ? (int) $counts->future : 0;
    ?>
    <p><strong><?php echo esc_html((string) $published); ?></strong> published articles · <strong><?php echo esc_html((string) $draft); ?></strong> drafts · <strong><?php echo esc_html((string) $future); ?></strong> scheduled</p>
    <ul style="list-style:disc; padding-left:18px;">
        <li><a href="<?php echo esc_url(admin_url('post-new.php?post_type=article')); ?>">Add new article</a></li>
        <li><a href="<?php echo esc_url(admin_url('edit.php?post_type=article')); ?>">All articles</a></li>
        <li><a href="<?php echo esc_url(admin_url('admin.php?page=sports-rivalry-layout')); ?>">MLB Hub layout</a></li>
        <li><a href="<?php echo esc_url(admin_url('admin.php?page=sr-seed-mlb')); ?>">Seed MLB content</a></li>
    </ul>
    <p class="description">Classic editor is enabled for articles. Use Sport taxonomy (<code>mlb</code> required for MLB stories), featured image, Yoast SEO, and the Article Fields box.</p>
    <?php
}

function sr_editorial_admin_styles($hook) {
    if (!in_array($hook, ['post.php', 'post-new.php', 'edit.php'], true)) {
        return;
    }

    $screen = get_current_screen();

    if (!$screen || 'article' !== $screen->post_type) {
        return;
    }

    wp_add_inline_style('wp-admin', '
        #sr-source-article .inside input[type="url"] { width: 100%; }
        .column-sr_sport { width: 10%; }
        .column-sr_breaking, .column-sr_editors_pick, .column-sr_trending { width: 8%; }
    ');
}

function sr_rename_posts_labels($translated, $text, $domain) {
    if ('default' !== $domain || !is_admin()) {
        return $translated;
    }

    if ('Posts' === $text) {
        return 'Legacy Posts';
    }

    return $translated;
}

add_filter('wpseo_accessible_post_types', 'sr_enable_yoast_for_articles');
add_filter('tiny_mce_before_init', 'sr_configure_classic_editor');

function sr_enable_yoast_for_articles($post_types) {
    if (!in_array('article', $post_types, true)) {
        $post_types[] = 'article';
    }

    return $post_types;
}

function sr_configure_classic_editor($init) {
    $init['fontsize_formats'] = '12pt 14pt 16pt 18pt 24pt';
    $init['font_formats'] = 'Georgia=georgia,serif;Arial=arial,helvetica,sans-serif;Helvetica=helvetica,arial,sans-serif;Times New Roman=times new roman,times,serif';
    $init['default_font_family'] = 'georgia';
    $init['default_font_size'] = '12pt';

    return $init;
}
