/* eslint-disable no-undef */

/*!

Theme Name: Minimalism
Version: 1.1

Author: BETADELI
Author URI: http://www.betadeli.com/

© 2014-2017

*/

(($, window, Tumblr) => {
  const minimalism = window.minimalism;
  const $window = $(window);
  const $document = $(window.document);

  /* ** LOADED ** */
  $window.on('load', () =>
  $('body').removeClass('preload')
  );

  /* ** READY ** */
  $document.ready(() => {
    /* -------------------- FUNCTIONS -------------------- */
    function $iframes($container, $items) {
      $items.find('.media iframe').parents('.box').css('opacity', '.1').end()
      .on('load', event => {
        clearTimeout($container.$isRelayouting);
        $container.$isRelayouting = setTimeout(() =>
          $container.masonry('layout')
        , 500);

        $(event.target).parents('.box').css('opacity', '1');
      });
    }

    function $fetch($container, $loader) {
      const $next = $('#content .pagination .next');

      if (!$loader.hasClass('loading') && $next.length) {
        $loader.addClass('loading');

        $.get($next.attr('href'), data => {
          const $items = $(data).find('#content .items .grid .item');

          if ($items.length) {
            $iframes($container, $items);

            $items.imagesLoaded(() => {
              $container.append($items).masonry('appended', $items);

              $('#content .pagination .pages').empty().append($(data).find('#content .pagination .pages').children());

              if (Tumblr && Tumblr.LikeButton) {
                Tumblr.LikeButton.get_status_by_post_ids($items.map((i, e) => e.id).get());
              }

              $loader.removeClass('loading');
            });
          } else {
            $loader.removeClass('loading').addClass('loaded');
          }
        })
        .fail(() =>
        $loader.removeClass('loading')
        );
      } else if (!$loader.hasClass('loaded') && !$next.length) {
        $loader.removeClass('loading').addClass('loaded');
      }
    }

    /* -------------------- DATA LOADER -------------------- */
    (() => {
      if ($('body').hasClass('index')) {
        const $container = $('#content .items .grid');
        const $loader = $('#content .pagination .loader');

        if ($container.length) {
          const $items = $container.find('.item');

          $container.masonry({
            itemSelector: '.item',
            columnWidth: '.item-sizer',
            transitionDuration: '0.3s',
          });

          if ($items.length) {
            $iframes($container, $items);

            let once = true;
            $items.imagesLoaded()
            .progress(() => {
              $container.masonry('layout');

              if (once) {
                once = false;
                $('#content').css('opacity', '1');
              }
            })
            .always(() =>
            $('#content').css('opacity', '1')
            );
          } else {
            $('#content').css('opacity', '1');
          }
        }

        if ($loader.length) {
          if (minimalism.infiniteScrolling) {
            $window.scroll(() => {
              if (($window.height() + $window.scrollTop()) >= $loader.offset().top) { // LOADER IN VIEW
                $fetch($container, $loader);
              }
            });
          }

          $loader.click(e => {
            e.preventDefault();

            if ($loader.hasClass('loaded')) {
              $('html, body').stop().animate({ scrollTop: $('#content').offset().top - $('#header .navigation-holder .navigation').height() - 20 }, 500, 'swing');
            } else {
              $fetch($container, $loader);
            }
          });
        }
      }
    })();

    /* -------------------- NAVIGATION -------------------- */
    (() => {
      const $navigation = $('#header .navigation-holder .navigation');
      const $menu = $navigation.find('.menu');
      const $toggle = $navigation.find('.toggle');

      if ($menu.children().length) {
        if (minimalism.headerPosition === '' && minimalism.navigationSticky) {
          const $holder = $navigation.parents('.navigation-holder');

          $window.scroll(() => {
            if ($window.scrollTop() >= $holder.offset().top) { // NAVIGATION IN VIEW
              $holder.css('min-height', `${$navigation.height()}px`).addClass('sticky');
            } else {
              $holder.removeClass('sticky');
            }
          });
        }

        $toggle.click(e => {
          e.preventDefault();
          $navigation.toggleClass('expand');
        });
      } else {
        $navigation.addClass('empty');
      }
    })();

    /* -------------------- SLIDING HEADER IMAGE -------------------- */
    (() => {
      if (minimalism.headerPosition === '' && minimalism.headerImageSliding) {
        const $image = $('#header .header .image');

        if ($image.length) {
          const position = parseInt($image.css('background-position-y'), 10);
          $window.scroll(() => {
            if ($window.scrollTop() < $image.height()) {
              $image.css('background-position-y', `${position - Math.min(Math.abs($window.scrollTop() / 10), 40)}%`);
            }
          });
        }
      }
    })();
  });
})(jQuery, this, Tumblr);
