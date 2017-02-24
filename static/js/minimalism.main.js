/*!

    Theme Name: Minimalism
    Version: 1.1

    Author: BETADELI
    Author URI: http://www.betadeli.com/

    © 2014-2017

 */

(function ($, window, undefined) {
  'use strict';

    var minimalism = window.minimalism,
        $window = $(window),
        $document = $(document);

    /*** LOADED */
    $window.on('load', function() {

        $('body').removeClass('preload');

    });

    /*** READY */
    $document.ready(function() {

        /*-------------------- FUNCTIONS --------------------*/
        function _iframes($container, $items) {
            $items.find('.media iframe').parents('.box').css('opacity', '.1').end().load(function() {
                clearTimeout($container._isRelayouting);
                $container._isRelayouting = setTimeout(function() {
                    $container.masonry('layout');
                }, 500);

                $(this).parents('.box').css('opacity', '1');
            });
        }

        function _fetch($container, $loader) {
            var $next = $('#content .pagination .next');

            if(!$loader.hasClass('loading') && $next.length) {
                $loader.addClass('loading');

                $.get($next.attr('href'), function(data) {
                    var $items = $(data).find('#content .items .grid .item');

                    if($items.length) {
                        _iframes($container, $items);

                        $items.imagesLoaded(function() {
                            $container.append($items).masonry('appended', $items);

                            $('#content .pagination .pages').empty().append( $(data).find('#content .pagination .pages').children() );

                            try {
                                if(Tumblr) {
                                    Tumblr.LikeButton.get_status_by_post_ids( $items.map(function() { return this.id; }).get() );
                                }
                            } catch(err) {

                            }

                            $loader.removeClass('loading');
                        });
                    } else {
                        $loader.removeClass('loading').addClass('loaded');
                    }
                })
                .fail(function() {
                    $loader.removeClass('loading');
                })
                .always(function() {
                    // NA
                });
            } else if(!$loader.hasClass('loaded') && !$next.length) {
                $loader.removeClass('loading').addClass('loaded');
            }
        }

        /*-------------------- DATA LOADER --------------------*/
        (function() {
            if($('body').hasClass('index')) {
                var $container = $('#content .items .grid'),
                    $loader = $('#content .pagination .loader');

                if($container.length) {
                    var $items = $container.find('.item');

                    $container.masonry({
                        itemSelector: '.item',
                        columnWidth: '.item-sizer',
                        transitionDuration: '0.3s'
                    });

                    if($items.length) {
                        _iframes($container, $items);

                        var once = true;
                        $items.imagesLoaded().progress(function() {
                            $container.masonry('layout');

                            if(once) {
                              once = false;
                              $('#content').css('opacity', '1');
                            }
                        }).always( function( instance ) {
                            $('#content').css('opacity', '1');
                        });
                    } else {
                        $('#content').css('opacity', '1');
                    }
                }

                if($loader.length) {
                    if(minimalism.infiniteScrolling) {
                        $window.scroll(function() {
                            if( ($window.height() + $window.scrollTop()) >= $loader.offset().top ) { // LOADER IN VIEW
                                _fetch($container, $loader);
                            }
                        });
                    }

                    $loader.click(function(e) {
                        e.preventDefault();

                        if($loader.hasClass('loaded')) {
                            $('html, body').stop().animate({scrollTop: $('#content').offset().top - $('#header .navigation-holder .navigation').height() - 20 }, 500, 'swing');
                        } else {
                            _fetch($container, $loader);
                        }
                    });
                }
            }
        })();

        /*-------------------- NAVIGATION --------------------*/
        (function() {
            var $navigation = $('#header .navigation-holder .navigation'),
                $menu = $navigation.find('.menu'),
                $toggle = $navigation.find('.toggle');

            if ($menu.children().length) {
                if(minimalism.headerPosition === "" && minimalism.navigationSticky) {
                    var $holder = $navigation.parents('.navigation-holder');

                    $window.scroll(function() {
                        if( $window.scrollTop() >= $holder.offset().top ) { // NAVIGATION IN VIEW
                            $holder.css('min-height', $navigation.height() + 'px').addClass('sticky');
                        } else {
                            $holder.removeClass('sticky');
                        }
                    });
                }

                $toggle.click(function(e) {
                    e.preventDefault();
                    $navigation.toggleClass('expand');
                });
            } else {
                $navigation.addClass('empty');
            }
        })();

        /*-------------------- SLIDING HEADER IMAGE --------------------*/
        (function() {
            if(minimalism.headerPosition === "" && minimalism.headerImageSliding) {
                var $image = $('#header .header .image');

                if($image.length) {
                    var position = parseInt( $image.css('background-position-y') );
                    $window.scroll(function() {
                        if($window.scrollTop() < $image.height()) {
                            $image.css('background-position-y', (position - Math.min( Math.abs( $window.scrollTop() / 10 ), 40 )) + '%');
                        }
                    });
                }
            }
        })();

    });

})(jQuery, this);
