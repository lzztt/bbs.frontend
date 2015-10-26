'use strict';

var Navbar = (function() {
  var model = [
    {id: 1, name: '论坛', children: [
        {id: 5, name: '生活资讯', children: [
            {id: 8, name: '跳蚤市场'},
            {id: 9, name: '住房信息'},
            {id: 10, name: '车行天下'},
            {id: 11, name: '读书学习'},
            {id: 12, name: '招聘求职'},
            {id: 13, name: '鹊桥飞渡'},
            {id: 14, name: '咨询建议'},
            {id: 15, name: '签证移民'}]
        },
        {id: 6, name: '主题群落', children: [
            {id: 122, name: '花鸟虫鱼'},
            {id: 24, name: '家有一小'},
            {id: 16, name: '活动'},
            {id: 17, name: '情爱幽幽'},
            {id: 18, name: '摄影艺术'},
            {id: 19, name: '电脑技术'},
            {id: 20, name: '流行时尚'},
            {id: 21, name: '美食天地'},
            {id: 22, name: '生物'},
            {id: 124, name: '体育爱好者'},
            {id: 23, name: '谈天说地'}]},
        {id: 7, name: '论坛系统', children: [
            {id: 25, name: '论坛事务'},
            {id: 26, name: '论坛发展建议'},
            {id: 27, name: '我要投诉'}]}
      ]},
    {id: 2, name: '黄页', children: [
        {id: 28, name: '餐饮', children: [
            {id: 40, name: '中餐'},
            {id: 41, name: '日本'},
            {id: 42, name: '韩国'},
            {id: 43, name: '亚洲其它'},
            {id: 44, name: '美国'},
            {id: 45, name: '意大利'},
            {id: 46, name: '法国'},
            {id: 47, name: '墨西哥'},
            {id: 48, name: '其它西餐'},
            {id: 49, name: '糕点店'},
            {id: 50, name: '餐馆用品'}]},
        {id: 29, name: '律师', children: [
            {id: 51, name: '移民律师'},
            {id: 52, name: '其它律师'}]},
        {id: 30, name: '旅游', children: [
            {id: 53, name: '旅行社'},
            {id: 54, name: '机票代理'},
            {id: 55, name: '旅店'},
            {id: 56, name: '领事馆'},
            {id: 57, name: '其它'}]},
        {id: 31, name: '医疗保健', children: [
            {id: 58, name: '个人医生'},
            {id: 59, name: '牙科'},
            {id: 60, name: '眼科'},
            {id: 61, name: '中医'},
            {id: 62, name: '内科'},
            {id: 63, name: '妇产科'},
            {id: 64, name: '小儿科'},
            {id: 65, name: '心脏科'},
            {id: 66, name: '心理医生'},
            {id: 67, name: '兽医'},
            {id: 68, name: '其它'}]},
        {id: 32, name: '房地产', children: [
            {id: 69, name: '地产经纪'},
            {id: 70, name: '房屋贷款'},
            {id: 71, name: '房屋检修'},
            {id: 72, name: '装修设计'},
            {id: 73, name: '房屋保险'},
            {id: 74, name: '房产律师'},
            {id: 75, name: '搬家服务'},
            {id: 76, name: '其它'}]},
        {id: 33, name: '财经保险', children: [
            {id: 77, name: '财务顾问'},
            {id: 78, name: '会计税务'},
            {id: 79, name: '保险代理'}]},
        {id: 34, name: '超市购物', children: [
            {id: 80, name: '中国超市'},
            {id: 81, name: 'Shopping'},
            {id: 82, name: '其它'}]},
        {id: 35, name: '教育 电脑 设计', children: [
            {id: 83, name: '大学'},
            {id: 84, name: '中文学校'},
            {id: 85, name: '幼儿照顾'},
            {id: 86, name: '音乐舞蹈'},
            {id: 87, name: '功夫学校'},
            {id: 88, name: '艺术绘画'},
            {id: 89, name: '书店'},
            {id: 90, name: '电脑安装维修'},
            {id: 91, name: '平面设计'},
            {id: 92, name: '其它'}]},
        {id: 36, name: '汽车交通', children: [
            {id: 93, name: '车行'},
            {id: 94, name: '汽车保险代理'},
            {id: 95, name: '修车'},
            {id: 96, name: '驾校'},
            {id: 97, name: '其它'}]},
        {id: 37, name: '娱乐体育', children: [
            {id: 98, name: '健身房'},
            {id: 99, name: '卡拉OK'},
            {id: 100, name: '保龄球馆'},
            {id: 101, name: '影视租售'},
            {id: 102, name: '广播电视'},
            {id: 103, name: '其它'}]},
        {id: 38, name: '日常生活', children: [
            {id: 104, name: '美容美发'},
            {id: 105, name: '洗衣店'},
            {id: 106, name: '化妆品'},
            {id: 107, name: '婚嫁'},
            {id: 108, name: '照相摄影'},
            {id: 109, name: '电器维修'},
            {id: 123, name: '手机服务'},
            {id: 110, name: '清洁服务'},
            {id: 111, name: '工艺品'},
            {id: 112, name: '花店'},
            {id: 113, name: '翻译'},
            {id: 114, name: '其它'}]},
        {id: 39, name: '社团组织', children: [
            {id: 115, name: '学生学者联合会'},
            {id: 116, name: '专业协会'},
            {id: 117, name: '校友会'},
            {id: 118, name: '同乡会'},
            {id: 119, name: '文体协会'},
            {id: 120, name: '宗教'},
            {id: 121, name: '其它'}]}
      ]}
  ];

  var config = function(ulRoot, isInit) {
    console.log("nav_config", isInit);
    if (isInit)
      return;

    var isMenuVisible = false;

    var $trigger = $('<div style="position:fixed; left: 0; top: 0; padding: 1em 0.5em"><button type="button">菜单</button></div>').appendTo(document.body)
      .click(function(ev) {
        if (isMenuVisible) {
          $(ulRoot.parentNode).hide();
          $(this).css("left", 0);
          isMenuVisible = false;
        }
        else {
          $(ulRoot.parentNode).show();
          $(this).css("left", $(ulRoot.parentNode).outerWidth());
          isMenuVisible = true;
        }
      });

    var toggleLevel = function(ul) {
      $(ul).removeClass('overlay').find('ul').hide().removeClass('overlay');
      $(ul).find('span.label').removeClass('label');
    };

    // group span
    $('span', ulRoot).each(function() {
      var $this = $(this), ulNext = this.nextSibling, ulCurrent = this.parentElement.parentElement;
      $('<li><span class="back">' + $this.text() + '</span></li>').prependTo(ulNext)
        .click(function(ev) {
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          toggleLevel(ulCurrent);
        })
    })
      .click(function(ev) {
        ev.stopImmediatePropagation();
        ev.stopPropagation();

        var $this = $(this), ulNext = this.nextSibling, ulCurrent = this.parentElement.parentElement;

        var isLabel = $this.toggleClass('label').hasClass('label');

        if (isLabel) {
          $(ulNext).outerWidth($(ulCurrent).addClass('overlay').outerWidth() - $this.outerWidth()).show();
          ulNext.scrollTop = 0;
        }
        else {
          toggleLevel(ulCurrent);
        }
      });

    $('a', ulRoot).click(function(ev) {
      $trigger.click();
    });
  };

  var MenuGroup = {
    controller: function(args) {
      this.links = args.data;
      this.config = args.config;
    },
    view: function(ctrl) {
      return m('ul', {config: ctrl.config}, ctrl.links.map(function(link) {
        if ('children' in link) {
          return m('li', {class: 'group'}, [m('span', link.name), m.component(MenuGroup, {data: link.children})]);
        }
        else {
          return m('li', {class: 'link'}, m('a', {href: '/tag/' + link.id, config: m.route}, link.name));
        }
      }));
    }
  };

  return m.component(MenuGroup, {data: model, config: config});
})();

