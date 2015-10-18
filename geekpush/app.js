;

(function(article) {
  'use strict';
  var configLinks = function(article) {
    $('> *', article).css('opacity', '0').animate({opacity: 1}, 600);
    
    $(window).load(function() {
      var isMobile, navWidth, inScrollAnimation,
        $navdiv = $('div.nav'),
        $logo = $navdiv.find('img'),
        $links = $navdiv.find('a'),
        $nav = $navdiv.find('nav'),
        linkOffsets = {};

      var hideNav = function() {
        //$navdiv.css('left', '-' + navWidth + 'px');
        //$logo.css('left', '0');
        $navdiv.animate({left: '-' + navWidth + 'px'});
        $nav.animate({opacity: 0});
        $logo.animate({left: 0});
      };

      var checkWidth = function() {
        current = $(window).width() < 768;
        if (current === isMobile) {
          return;
        }
        isMobile = current;

        if (isMobile) {
          // collect nav width
          if (!navWidth)
            navWidth = $navdiv.outerWidth();

          hideNav();
          $logo.on('click', function() {
            if ($navdiv.offset().left < 0) {
              //$navdiv.css('left', '0');
              //$logo.css('left', navWidth + 'px');
              $navdiv.animate({left: 0});
              $nav.animate({opacity: 1});
              $logo.animate({left: navWidth + 'px'});
            }
            else {
              hideNav();
            }
          });
          $links.on('click', hideNav);
        }
        else {
          $navdiv.css('left', '0');
          $nav.css('opacity', '1');
          $logo.css('left', '0').off('click');
          $links.off('click', hideNav);
        }

        // collect link offsets;
        var topOffset = isMobile ? 0 : $nav.height();
        $links.each(function() {
          var id = $(this).attr('href');
          if (id) {
            linkOffsets[id] = $(id).offset().top - topOffset;
            if (linkOffsets[id] < 0)
              linkOffsets[id] = 0;
          }
        });
      }

      $(window).on('resize', checkWidth);

      $links.click(function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        inScrollAnimation = true;
        $("html, body").animate({scrollTop: linkOffsets[$(this).attr('href')] + "px"}, {complete: function() {
            inScrollAnimation = false;
          }});
        // $(window).scrollTop(linkOffsets[$(this).attr('href')]);
        $('.active', this.parentNode).removeClass('active');
        $(this).addClass('active');
      });

      var current, findActive = function() {
        if (inScrollAnimation)
          return;

        var active, offset = $(window).scrollTop();
        for (var i in linkOffsets)
        {
          if (linkOffsets[i] <= offset) {
            active = i;
          }
          else {
            break;
          }
        }

        if (current != active) {
          $nav.find('a.active').removeClass('active');
          $nav.find('a[href=' + active + ']').addClass('active');
          current = active;
        }
      }

      $(window).on('scroll', findActive);

      // run the program
      checkWidth();
      findActive();
    });
  };

  var Article = {
    view: function(ctrl) {
      return m('article', {config: configLinks}, [
        m.component(Header),
        article.sections.map(function(section, index) {
          switch (section.type) {
            case 'text':
              return m.component(TextSection, {id: 'section' + index, data: section});
              break;
            case 'text-image':
              return m.component(TextImageSection, {id: 'section' + index, data: section});
              break;
            case 'card':
              return m.component(CardSection, {id: 'section' + index, data: section});
              break;
            default:
              return;
          }
        }),
        m.component(Footer)
      ]);
    }
  };

  var Header = {
    view: function(ctrl) {
      return m('header', {id: "home"}, [
        m('div.nav', [m('img', {src: '/geekpush/image/logo.jpg'}),
          m('nav',
            m('a', {href: '#home'}, '主页'),
            article.sections.map(function(section, index) {
              return m('a', {href: '#section' + index}, section.title);
            }))]),
        m('section', [
          m('h1', article.title),
          m('h2', article.slogan)
        ])
      ]);
    }
  };

  var Footer = {
    view: function(ctrl, data) {
      return m('footer', "Copyright © 2015 GeekPush.com. All rights reserved.");
    }
  };

  var TextSection = {
    view: function(ctrl, data) {
      var section = data.data;
      return m('section', {id: data.id}, [
        m('h1', section.title),
        m('p', section.body.map(function(line) {
          return [line, m('br')];
        }))
      ]);
    }
  };

  var TextImageSection = {
    view: function(ctrl, data) {
      var section = data.data;
      return m('section', {id: data.id}, [
        m('h1', section.title),
        section.body.map(function(ti) {
          return m('div.text-image', [
            m('p', [
              m('h2', ti.title),
              m('p', ti.body)
            ]),
            m('img', {src: ti.image})
          ]);
        })
      ]);
    }
  };

  var CardSection = {
    view: function(ctrl, data) {
      var section = data.data;
      return m('section', {id: data.id}, [
        m('h1', section.title),
        m('div', section.body.map(function(card) {
          return m('div.card', [
            m('h2', card.title),
            m('p', card.body.map(function(line) {
              return [m.trust(line
                  .replace(/(\s|^)(https?:\/\/[\w\-\.\/]{10,}.jpg)(\s|$)/g, "$1<img src='$2'>$3")
                  .replace(/(\s|^)(\/[\w\-\.\/]{3,}.jpg)(\s|$)/g, "$1<img src='$2'>$3")
                  .replace(/(\s|^)(https?:\/\/)(([\w\-]{2,10}\.){1,4}\w{2,10}(:[0-9]{1,5})?(\/[^\s<"\'\(\)\[\]\|]*)?)/g, "$1<a href='$2$3'>$3</a>")
                  .replace(/(([\w\-\.]{2,})@([\w\-]{2,10}\.){1,3}\w{2,10})/g, "<a href='mailto:$1'>$1</a>") + '<br>')];
            }))
          ])
        }))
      ]);
    }
  };

  m.mount(document.getElementById('page'), m.component(Article, article));
})(c);