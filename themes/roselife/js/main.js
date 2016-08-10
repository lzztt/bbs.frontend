function submitBug(msg) {
   $.post('/api/bug?action=post', msg);
}

var session = {
   set: function (key, value) {
      if (value == null) {
         sessionStorage.removeItem(key);
      }
      else {
         sessionStorage.setItem(key, JSON.stringify(value));
      }
   },
   get: function (key) {
      var value = sessionStorage.getItem(key);
      if (value == null) {
         return null;
      }
      else {
         return JSON.parse(value);
      }
   },
   remove: function (key) {
      sessionStorage.removeItem(key);
   },
   clear: function () {
      sessionStorage.clear();
   }
};

var cache = {
   set: function (key, value) {
      if (value == null) {
         localStorage.removeItem(key);
      }
      else {
         localStorage.setItem(key, JSON.stringify(value));
      }
   },
   get: function (key) {
      var value = localStorage.getItem(key);
      if (value == null) {
         return null;
      }
      else {
         return JSON.parse(value);
      }
   },
   remove: function (key) {
      localStorage.removeItem(key);
   },
   clear: function () {
      localStorage.clear();
   }
};

var validateResponse = function (data) {
   if (!data) {
      alert('服务器没有响应');
      return false;
   }
   else {
      if (data.error) {
         alert(data.error);
         return false;
      }
   }
   return true;
};

$(document).ready(function () {
   var loadSession = function (data) {
      if (data.sessionID) {
         cache.set('sessionID', data.sessionID);
         cache.set('uid', data.uid);
         if (data.uid > 0) {
            cache.set('username', data.username);
            cache.set('role', data.role);
         }
         if (data.pm > 0) {
            session.set('pm', data.pm);
         }
         return data.uid;
      }
      else {
         if (data.error) {
            alert(data.error);
         }
         else {
            alert('对话加载失败');
         }
         return 0;
      }
   };

   var showPage = function (uid) {
      // image slider
      $('.image_slider').imageSlider();

      // ajax_load container
      $('.ajax_load').each(function () {
         var container = $(this);
         var uri = container.attr('data-ajax');
         if (uri) {
            $.getJSON(uri, function (data) {
               for (var prop in data)
               {
                  $('.ajax_' + prop, container).html(data[prop]);
               }
            });
         }
      });

      // menu
      $('nav#page_navbar ul.sf-menu').superfish();

      // navbar toggler
      var hasToggler = false, toggler = $('div.nav_mobile > a.icon-menu'), navbar = $('nav#page_navbar');
      var navbarToggler = function ()
      {
         if (navbar.css('display') === 'none')
         {
            if (!hasToggler)
            {
               toggler.on('click', function (e) {
                  e.preventDefault();
                  navbar.toggleClass('hidden');
               });
               hasToggler = true;
            }
         }
         else
         {
            if (hasToggler)
            {
               toggler.off('click');
               hasToggler = false;
            }
            if (!navbar.hasClass('hidden'))
            {
               navbar.addClass('hidden');
            }
         }
      }

      navbarToggler();
      $(window).resize(navbarToggler);

      $('div.nav_mobile a.icon-left-big').click(function (e) {
         e.preventDefault();
         window.history.back();
      });

      $('div.nav_mobile a.icon-right-big').click(function (e) {
         e.preventDefault();
         window.history.forward();
      });

      $('div.nav_mobile a.icon-cw').click(function (e) {
         e.preventDefault();
         location.reload();
      });

      // responsive table header
      var addTableHeader = function (table) {
         var headers = new Array();
         $('th', table).each(function () {
            headers.push(this.innerHTML);
         });
         if (headers.length > 0) {
            $('tbody tr', table).each(function () {
               var tds = $('td', this);
               for (i = 0; i < tds.length; i++) {
                  $(tds.get(i)).attr('data-header', headers[i]);
               }
            });
         }
      };
      $('table').each(function () {
         addTableHeader(this);
      });

      var showGuestPage = function () {
         $('.v_guest').show();
         $('[class*="v_user"]').remove();
      };
      var showUserPage = function () {
         $('.v_guest').remove();
         $('.v_user').show();
         $('[class*="v_user_"]').hide()
         $('.v_user_' + uid).show();

         var role = cache.get('role');
         if (role && role instanceof Array)
         {
            for (var i = 0; i < role.length; ++i)
            {
               $('.v_user_' + role[i]).show();
            }
         }
         var username = cache.get('username');
         if (username)
         {
            $('#username').text(username);
         }

         // check pm every 5 minutes
         var pmCheckTime = cache.get('pmCheckTime');
         if( !pmCheckTime || Date.now() > pmCheckTime + 300000)
         {
            $.get('/api/message/new', function (data) {
               if (data.count && data.count > 0) {
                  $("a#pm").append('<span style="color:red;"> (' + data.count + ')<span>');
               }
            });
            cache.set('pmCheckTime', Date.now());
         }

         // node page
         var editorForm = $('#bbcode_editor');
         if (editorForm.length)
         {
            var editorBody = $('#bbcode_editor textarea'),
                editorTitle = $('#bbcode_editor .node_title'),
                fileTable = $('#file_list'),
                fileTableBody = $('tbody', fileTable);

            editorBody.markItUp(myBBCodeSettings);

            // button actions
            $('button.report').click(function (e) {
               var reason = prompt("请管理员审查本贴，原因如下 (目前只支持举报QQ骗子和办假学位证)：", "本贴疑似骗子贴/办证贴");
               if (reason) {
                  $.ajax({
                     type: "POST",
                     url: '/api/report',
                     data: $(this).attr('data-action') + "&reason=" + encodeURIComponent(reason),
                     success: function (data) {
                        if (data && "error" in data) {
                           alert("举报失败: " + data.error + " :(");
                        } else {
                           alert("举报成功，谢谢您为维护良好信息交流环境做出的努力！");
                        }
                     },
                     error: function() {
                        alert("系统错误，举报失败 :(");
                     }
                  });
               }
            });

            $('button.delete').click(function (e) {
               var answer = confirm("此操作不可恢复，您确认要删除该内容吗？");
               if (answer)
               {
                  window.location = $(this).attr('data-action');
               }
            });

            $('button.reply').click(function (e) {
               editorForm.attr('action', $(this).attr('data-action'));
               editorTitle.hide();
               fileTable.hide();
               fileTableBody.children().remove();

               editorBody.val('').focus();

               window.scrollTo(0, editorForm.offset().top);
            });

            $('button.quote').click(function (e) {
               editorForm.attr('action', $(this).attr('data-action'));
               editorTitle.hide();
               fileTable.hide();
               fileTableBody.children().remove();
               var data = $($(this).attr('data-raw'));
               var author = data.find('pre.username').html(),
                   quoteText = '[quote="' + author + '"]' + data.find('pre.body').html() + '[/quote]\n';
               editorBody.val('').focus();
               $.markItUp({
                  replaceWith: quoteText
               });

               window.scrollTo(0, editorForm.offset().top);
            });

            var updateFileTable = function (files) {
               for (var i = 0; i < files.length; i++) {
                  var fid = files[i].fid ? files[i].fid : files[i].path,
                      imageExt = new Array('jpeg', 'gif', 'png'),
                      fileExt = files[i].path.split('.').pop(),
                      bbcode;

                  if (imageExt.indexOf(fileExt) >= 0) {
                     bbcode = '[img]' + files[i].path + '[/img]';
                  }
                  else {
                     bbcode = '[file="' + files[i].path + '"]' + files[i].name + '[/file]';
                  }

                  var row = '<tr><td><input type="text" name="files[' + fid + '][name]" value="' + files[i].name + '"><input type="hidden" name="files[' + fid + '][path]" value="' + files[i].path + '"></td>' +
                      '<td>' + bbcode + '</td><td><button type="button" class="file_delete">删除</button></td></tr>';
                  fileTableBody.append(row);
               }
               addTableHeader(fileTable);
            }

            $('button.edit').click(function (e) {
               var action = $(this).attr('data-action');
               editorForm.attr('action', action);
               if (action.split('/')[1] == 'node')
               {
                  editorTitle.show();
               }
               else
               {
                  editorTitle.hide();
               }

               fileTableBody.children().remove();
               var data = $($(this).attr('data-raw'));
               var files = $.parseJSON(data.find('pre.files').html()); // may return null

               if (files instanceof Array && files.length > 0)
               {
                  updateFileTable(files);
                  fileTable.show();
               }
               else
               {
                  fileTable.hide();
               }

               editorBody.val($($(this).attr('data-raw')).find('pre.body').html()).focus();

               window.scrollTo(0, editorForm.offset().top);
            });

            $('button.create_node').click(function (e) {
               editorForm.attr('action', $(this).attr('data-action'));
               editorTitle.show();
               fileTable.hide();
               fileTableBody.children().remove();

               editorBody.val('');
               $('input', editorTitle).val('').focus();

               window.scrollTo(0, editorForm.offset().top);
            });

            $('#file_upload').click(function (e) {
               var file = $('#file_select');
               if (file.val().length > 0)
               {
                  var totalSize = 0, files = file.get(0).files;
                  if (files)
                  {
                     // check count
                     if (files.length > 5)
                     {
                        alert('一次只能上传 5 张图片');
                        return;
                     }
                     // check total file size
                     for (i = 0; i < files.length; i++)
                     {
                        totalSize += files[i].size;
                        if (totalSize > 5242880)
                        {
                           alert('一次只能上传图片的总大小为 5 MB，您只能选择前 ' + i + ' 张图片上传');
                           return;
                        }
                     }
                  }
                  var button = $(this);
                  button.prepend('<span class="spinner"></span>');
                  button.prop("disabled", true);

                  file.upload('/api/file?action=post', function (res) {
                     file.val('');
                     button.prop("disabled", false);
                     button.find('span.spinner').remove();
                     if (res) {
                        try {
                           if (res.error && res.error.length > 0) {
                              var msg = '';
                              if (Object.prototype.toString.call(res.error) === '[object Array]') {
                                 for (var i = 0; i < res.error.length; i++) {
                                    msg = msg + res.error[i].name + ' : ' + res.error[i].error + "\n";
                                 }
                              }
                              else // string
                              {
                                 msg = res.error;
                              }
                              alert(msg);
                           }

                           if (res.saved && res.saved.length > 0) {
                              updateFileTable(res.saved);
                              fileTable.show();
                           }
                        }
                        catch (e)
                        {
                           alert('上传文件失败，请换用其他浏览器上传文件。错误信息:' + e.message);
                           submitBug({msg: e.message, data: res});
                        }
                     }
                  });
               }
            });

            $('#file_clear').click(function () {
               $('#file_select').val('');
            });

            fileTable.on("click", ".file_delete", function (e) {
               //$(".file_delete", fileTable).live("click", function(e) {
               var row = this.parentNode.parentNode;
               var table = row.parentNode.parentNode;
               table.deleteRow(row.rowIndex);
               if (table.rows.length <= 1)
               {
                  fileTable.hide();
               }
            });

            $('#bbcode_editor button:submit').click(function (e) {
               if ($('#file_select').val())
               {
                  alert('请先上传或清空选中的文件');
                  e.preventDefault();
               }
            });

            $('button.bookmark').click(function () {
               var button = $(this);
               $.get(button.attr('data-action'), function () {
                  alert('帖子成功加入到您的收藏夹中！');
               });
            });
         }

         // user bookmark page
         var nids = [];
         $('button.edit_bookmark').click(function () {
            var button = $(this);
            if (button.text() == '编辑') {
               button.text('保存');
               $('button.delete_bookmark').show();
            }
            else
            {
               if (nids) {
                  button.prop("disabled", true);
                  $.get('/api/bookmark/' + nids.join() + '?action=delete', function () {
                     button.text('编辑');
                     $('button.delete_bookmark').hide();
                     nids = [];
                     button.prop("disabled", false);
                  });
               }
               else {
                  button.text('编辑');
                  $('button.delete_bookmark').hide();
               }
            }

         });

         $('button.delete_bookmark').click(function () {
            button = $(this);
            nids.push(button.attr('data-nid'));
            button.parent().remove();
         });
      }

      // scroll to top
      var $window = $(window),
          goTopButton = $('#goTop'),
          goTopButtonIsVisible = false;

      var showGoTop = function () {
         goTopButtonIsVisible = true;
         goTopButton.stop().animate({
            bottom: '50px'
         }, 300);
      };
      var hideGoTop = function () {
         goTopButtonIsVisible = false;
         goTopButton.stop().animate({
            bottom: '-100px'
         }, 300);
      };

      var toggleGoTop = function () {
         if ($window.scrollTop() > 300) {
            if (!goTopButtonIsVisible) {
               showGoTop();
            }
         }
         else {
            if (goTopButtonIsVisible) {
               hideGoTop();
            }
         }
      };

      toggleGoTop();
      $window.scroll(toggleGoTop);
      goTopButton.click(function (e) {
         $('html, body').stop().animate({
            scrollTop: 0
         }, 300, hideGoTop);
         e.preventDefault();
      });

      // popup windows
      var popupForms = {
         login: {
            html: '<form accept-charset="UTF-8" autocomplete="on" method="post">'
                + '<fieldset><label class="label">注册邮箱</label><input name="email" type="email" required autofocus></fieldset>'
                + '<fieldset><label class="label">密码</label><input name="password" type="password" required></fieldset>'
                + '<fieldset><button type="submit">登录</button></fieldset></form>',
            handler: '/api/authentication',
            success: function (data) {
               if (validateResponse(data)) {
                  loadSession(data);
                  return '<script>location.reload();</script>';
               }
            }
         },
         changePassword: {
            html: '<form accept-charset="UTF-8" autocomplete="off" method="post">'
                + '<fieldset><label class="label oldpassword">旧密码</label><input name="password_old" type="password" required autofocus></fieldset>'
                + '<fieldset><label class="label">新密码</label><input name="password" type="password" required></fieldset>'
                + '<fieldset><label class="label">确认新密码</label><input name="password2" type="password" required></fieldset>'
                + '<fieldset><button type="submit">更改密码</button></fieldset></form>',
            handler: '/api/user/[uid]?action=put',
            vars: {uid: cache.get('uid')},
            success: function (data) {
               if (validateResponse(data)) {
                  return '密码更改成功。';
               }
            }
         },
         sendPM: {
            html: '<form accept-charset="UTF-8" autocomplete="off" method="post">'
                + '<fieldset><label class="label">收信人</label><a href="/app/user/profile/[uid]">[username]</a><input name="toUID" type="hidden" value="[uid]"></fieldset>'
                + '<fieldset><label class="label">短信正文</label><textarea name="body" required autofocus></textarea></fieldset>'
                + '<fieldset><button type="submit">发送短信</button></fieldset></form>',
            handler: '/api/message',
            success: function (data) {
               if (validateResponse(data)) {
                  return '短信发送成功。';
               }
            }
         }
      };

      var popupbox = $('div#popupbox'),
          messagebox = $('div#messagebox'),
          overlay = $('<div id="overlay"></div>'),
          popupVisible = false;

      overlay.click(function () {
         overlay.detach();
         popupbox.hide()
         popupVisible = false;
      });

      var centerPopupBox = function () {
         popupbox.css('left', $window.scrollLeft() + Math.max(($window.width() - popupbox.outerWidth()) / 2, 0));
         popupbox.css('top', $window.scrollTop() + Math.max(($window.height() - popupbox.outerHeight()) / 2, 0));
      };

      $('a.popup').click(function (e) {
         e.preventDefault();
         var link = $(this);
         var key = link.attr('href').substr(1);

         if (key in popupForms) {
            // add overlay
            if (!jQuery.contains(document, overlay[0])) {
               overlay.insertBefore(popupbox);
            }

            var html = popupForms[key].html;
            var handler = popupForms[key].handler;

            // apply varibles
            var vars = {};
            if ('vars' in popupForms[key]) {
               vars = $.extend(vars, popupForms[key].vars);
            }
            if (link.attr('data-vars')) {
               vars = $.extend(vars, JSON.parse(link.attr('data-vars')));
            }
            if (!$.isEmptyObject(vars)) {
               for (var k in vars) {
                  html = html.replace(new RegExp('\\[' + k + '\\]', 'g'), String(vars[k]));
                  handler = handler.replace(new RegExp('\\[' + k + '\\]', 'g'), String(vars[k]));
               }
            }

            // show popup
            popupbox.html(html).show(0, centerPopupBox);
            popupVisible = true;

            $(window).resize(function () {
               if (popupVisible) {
                  centerPopupBox();
               }
            });

            var form = $('form', popupbox);
            form.submit(function (e) {
               e.preventDefault();
               if (handler) {
                  $.ajax({
                     method: "POST",
                     url: handler,
                     data: form.serialize(),
                     dataType: 'json',
                     success: function (data) {
                        var response = popupForms[key].success(data);
                        if (response) {
                           popupbox.html(response);
                        }
                     },
                     error: function () {
                        alert('错误：提交数据错误');
                     }
                  });
               }
               else
               {
                  alert('错误：无法提交数据');
               }
            });
         }
      });

      if (uid > 0) {
         showUserPage();
      }
      else
      {
         showGuestPage();
      }
   };

   // get uid and urole
   var sessionID = $.cookie('LZXSID');
   if (sessionID == null) {
      // boot as guest
      showPage(0);
   }
   else {
      // cache and session expired, reload client side cache.
      if (sessionID != cache.get('sessionID')) {
         // clear client cache and session
         cache.clear();
         session.clear();
         // boot as guest
         // showPage(0);
         $.get('/api/authentication/' + sessionID, function (data) {
            loadSession(data);
            showPage(cache.get('uid'));
         });
      }
      else {
         showPage(cache.get('uid'));
      }
   }
});
