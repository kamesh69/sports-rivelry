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

  function slugifyTitle(title) {
    return String(title || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function getPostSlug() {
    var $editable = $("#editable-post-name-full");

    if ($editable.length && $editable.text() && $editable.text().indexOf("%") === -1) {
      return $editable.text().trim();
    }

    var $input = $("#editable-post-name");

    if ($input.length && $input.val()) {
      return String($input.val()).trim();
    }

    var hiddenSlug = $("#post_name").val();

    if (hiddenSlug) {
      return String(hiddenSlug).trim();
    }

    return slugifyTitle($("#title").val());
  }

  function isPublished() {
    return $("#original_post_status").val() === "publish";
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

      if (isPublished()) {
        $view.attr("href", url);
      }
    }

    if (!isPublished()) {
      requestPreviewUrl();
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

  function refreshAdminPreviewLinks(previewUrl) {
    if (!previewUrl) {
      return;
    }

    refreshPreviewLinks(previewUrl);

    $(".notice-success a, .notice-info a").each(function () {
      var $link = $(this);
      var href = $link.attr("href") || "";

      if (
        href.indexOf("/api/preview") !== -1 ||
        href.indexOf("preview=true") !== -1 ||
        href.indexOf("cms.thesportsrivalry.com") !== -1
      ) {
        $link.attr("href", previewUrl);
        $link.attr("target", "_blank");
        $link.text("Preview on website");
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
      post_title: $("#title").val() || "",
    }).done(function (response) {
      if (response && response.success && response.data && response.data.url) {
        refreshAdminPreviewLinks(response.data.url);

        if ("publish" !== $("#original_post_status").val()) {
          var previewUrl = response.data.url;
          var $view = $("#sample-permalink a, #sample-permalink span").first();

          if ($view.length) {
            $view.attr("href", previewUrl);
          }
        }
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

  function bindPermalinkClick() {
    $(document).on("click", "#sample-permalink a", function (event) {
      if (isPublished()) {
        return;
      }

      var href = $(this).attr("href") || "";

      if (href.indexOf("/api/preview") !== -1) {
        return;
      }

      event.preventDefault();

      if (!getPostSlug() || getSelectedSportSlug() === "choose-sport") {
        window.alert("Add a title, choose a sport, then click Save Draft before previewing.");
        return;
      }

      requestPreviewUrl();

      window.setTimeout(function () {
        var nextHref = $("#sample-permalink a").first().attr("href") || "";

        if (nextHref.indexOf("/api/preview") !== -1) {
          window.open(nextHref, "_blank");
        }
      }, 250);
    });
  }

  function bindPreviewButton() {
    $("#post-preview").on("click", function (event) {
      var $button = $(this);
      var href = $button.attr("href") || "";

      if (href.indexOf("/api/preview") === -1) {
        return;
      }

      event.preventDefault();

      if (!getPostSlug() || getSelectedSportSlug() === "choose-sport") {
        window.alert("Add a title, choose a sport, then click Save Draft before previewing.");
        return;
      }

      requestPreviewUrl();

      window.setTimeout(function () {
        var nextHref = $button.attr("href") || href;

        if (nextHref.indexOf("/api/preview") !== -1) {
          window.open(nextHref, "wp-preview");
        }
      }, 250);
    });
  }

  $(function () {
    if (getConfig().postType !== "article") {
      return;
    }

    bindSportChange();
    bindPermalinkClick();
    bindPreviewButton();
    updatePermalinkDisplay();
    requestPreviewUrl();

    $("#title").on("input change", function () {
      updatePermalinkDisplay();
      requestPreviewUrl();
    });

    $(document).on("click", "#edit-slug-buttons .save, #edit-slug-buttons .cancel", function () {
      window.setTimeout(function () {
        updatePermalinkDisplay();
        requestPreviewUrl();
      }, 50);
    });
  });
})(jQuery);
