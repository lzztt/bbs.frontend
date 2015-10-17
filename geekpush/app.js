var article = {
  title: '极客推动工作室',
  slogan: '简单专注 且有爱心',
  sections: [
    {
      type: "text",
      title: "我们是谁",
      body: [
        "极客（Geek），是一群拒绝普通，专注于自己的兴趣爱好，并把事情做到完美极致的人。",
        "而科技界的极客们——我们，则是相信可以通过自己的技术和热情，让沟通变简单，生活变丰富。"
      ]
    },
    {
      type: "text-image",
      title: "我们做什么",
      body: [
        {
          title: "宗旨与信念",
          body: "本着简单专注，且有爱心的信念，我们致力于用自己的技能搭建有效沟通的网络平台。我们相信一个卓越的本地论坛会极大的丰富和便捷海外华人的生活。",
          image: "image/do1.png"
        },
        {
          title: "两个论坛 两个平台",
          body: "六年前，我们创建了缤纷休斯顿，一年前缤纷达拉斯上线。没有垃圾信息，没有打折推广，给用户一个纯粹的信息交流环境。每年义务组织“四月看野花”和“七夕单身聚会”活动，服务用户，加深羁绊。",
          image: "image/do2.jpg"
        },
        {
          title: "愿景与未来",
          body: "我们在不断开发论坛新版本。为了用户使用方便，从电脑版到平板手机自适应版，再到马上即将上线的app版。我们也在不断丰富论坛内容，推出免费电子黄页活动，建立本地生活信息库。",
          image: "image/do3.jpg"
        }
      ]
    },
    {
      type: "card",
      title: "联系我们",
      body: [
        {
          title: "缤纷休斯顿",
          body: ["Web: http://www.houstonbbs.com", "Email: admin@houstonbbs.com"]
        },
        {
          title: "缤纷达拉斯",
          body: ["Web: http://www.dallasbbs.com", "Email: admin@dallasbbs.com"]
        },
        {
          title: "微信公众号",
          body: ["/wechat.jpg"]
        }
      ]
    },
  ],
};

var configLinks = function(article) {
  var linkOffsets = {};

  $('div.nav a', article).each(function() {
    var id = $(this).attr('href');
    if (id) {
      linkOffsets[id] = $(id).offset().top;
    }
  }).click(function(ev) {
    ev.preventDefault();
    $("html, body").animate({scrollTop: linkOffsets[$(this).attr('href')] + "px"});
    $('.active', this.parentNode).removeClass('active');
    $(this).addClass('active');
  });

  $nav = $('div.nav nav');
  var findActive = function() {
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

    $nav.find('a.active').removeClass('active');
    $nav.find('a[href=' + active + ']').addClass('active');
  }

  findActive();
  $(window).scroll(findActive);
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
      m('div.nav', [m('img', {src: 'logo.jpg'}),
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