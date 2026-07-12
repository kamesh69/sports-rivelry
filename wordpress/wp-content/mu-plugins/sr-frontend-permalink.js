(function ($) {
  function getConfig() {
    return window.srFrontendPermalink || {};
  }

  function getSelectedSportSlug() {
    var config = getConfig();
    var $select = $("#sr-article-sport-term");

    if ($select.length) {
      var slug = $select.find("option:selected").data("slug");

      if (slug) {
        return slug;
      }
    }

    var $checked = $("#sportchecklist input[type=checkbox]:checked").first();

    if (!$checked.length) {
      $checked = $("#sportchecklist input[type=radio]:checked").first();
    }

    if (!$checked.length) {
      return "choose-sport";
    }

    var termId = $checked.val();
    return (config.sportTerms && config.sportTerms[termId]) || "choose-sport";
  }

  function getPostSlug() {
    var $editable = $("#editable-post-name-full");

    if ($editable.length && $editable.text()) {
      return $editable.text().trim();
    }

    var $input = $("#editable-post-name");

    if ($input.length && $input.val()) {
      return String($input.val()).trim();
    }

    return $("#post_name").val() || "";
  }

  function updatePermalinkDisplay() {
    var config = getConfig();

    if (!config.baseUrl || config.postType !== "article") {
      return;
    }

    var sportSlug = getSelectedSportSlug();
    var postSlug = getPostSlug() || "%postname%";
    var url = config.baseUrl + "/" + sportSlug + "/" + postSlug + "/";
    var $view = $("#sample-permalink a, #sample-permalink span").first();

    if ($view.length) {
      $view.text(url);
      $view.attr("href", url);
    }
  }

  function refreshPreviewLinks(previewUrl) {
    if (!previewUrl) {
      return;
    }

    $("#post-preview").attr("href", previewUrl);

    $("#sr-frontend-url .button, .misc-pub-frontend-url a").each(function () {
      var $link = $(this);

      if ($link.text().toLowerCase().indexOf("preview") !== -1) {
        $link.attr("href", previewUrl);
      }
    });
  }

  function requestPreviewUrl() {
    var config = getConfig();

    if (!config.ajaxUrl || !config.previewNonce) {
      return;
    }

    var postId = $("#post_ID").val();

    if (!postId) {
      return;
    }

    $.post(config.ajaxUrl, {
      action: "sr_frontend_preview_url",
      nonce: config.previewNonce,
      post_id: postId,
      sport_slug: getSelectedSportSlug(),
      post_slug: getPostSlug(),
    }).done(function (response) {
      if (response && response.success && response.data && response.data.url) {
        refreshPreviewLinks(response.data.url);
      }
    });
  }

  function bindSportChange() {
    $(document).on(
      "change",
      "#sr-article-sport-term, #sportchecklist input, #taxonomy-sport input, #tagsdiv-sport input",
      function () {
        updatePermalinkDisplay();
        requestPreviewUrl();
      }
    );
  }

  function bindPreviewButton() {
    $("#post-preview").on("click", function (event) {
      var href = $(this).attr("href") || "";

      if (href.indexOf("/api/preview") !== -1) {
        event.preventDefault();
        window.open(href, "wp-preview");
      }
    });
  }

  $(function () {
    if (getConfig().postType !== "article") {
      return;
    }

    bindSportChange();
    bindPreviewButton();
    updatePermalinkDisplay();
    requestPreviewUrl();

    $(document).on("click", "#edit-slug-buttons .save, #edit-slug-buttons .cancel", function () {
      window.setTimeout(function () {
        updatePermalinkDisplay();
        requestPreviewUrl();
      }, 50);
    });
  });
})(jQuery);
