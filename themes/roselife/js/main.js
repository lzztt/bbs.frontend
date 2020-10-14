function submitBug(msg) {
   $.post('/api/bug', msg);
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

window.addEventListener('load', function () {
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
           fetch(uri)
             .then((response) => response.json())
             .then((data) => {
               for (var prop in data) {
                 $(".ajax_" + prop, container).html(data[prop]);
               }
             });
         }
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

         // node page
         var editorForm = $('#bbcode_editor');
         if (editorForm.length)
         {
            var editorBody = $('#bbcode_editor textarea'),
                editorTitle = $('#bbcode_editor .node_title'),
                blobs = new Map(),
                reducer = window.imageBlobReduce(),
                fileList = $('#file_list'),
                template = null;

            if (fileList.get(0)) {
                template = fileList.get(0).parentElement.querySelector('template').content;
            }

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

            function clearFiles() {
               fileList.children().remove();
               blobs.clear();
            }

            $('button.reply').click(function (e) {
               editorForm.attr('action', $(this).attr('data-action'));
               editorTitle.hide();
               clearFiles();

               editorBody.val('').focus();

               window.scrollTo(0, editorForm.offset().top);
            });

            $('button.quote').click(function (e) {
               editorForm.attr('action', $(this).attr('data-action'));
               editorTitle.hide();
               clearFiles();
               var data = $($(this).attr('data-raw'));
               var author = data.find('pre.username').html(),
                   quoteText = '[quote="' + author + '"]' + data.find('pre.body').html() + '[/quote]\n';
               editorBody.val('').focus();
               $.markItUp({
                  replaceWith: quoteText
               });

               window.scrollTo(0, editorForm.offset().top);
            });

            var updateFileList = function (files) {
               var images = fileList.get(0);

               for (var i = 0; i < files.length; i++) {
                  var figure = template.cloneNode(true);

                  var img = figure.querySelector('img');
                  img.src = files[i].path;

                  var button = figure.querySelector('button');
                  button.onclick = function (e) {
                     var fig = this.parentElement.parentElement;
                     fig.parentElement.removeChild(fig);
                  };

                  var idInput = figure.querySelector('input[name="file_id[]"]');
                  idInput.disabled = false;
                  idInput.value = files[i].id;

                  var nameInput = figure.querySelector('input[name="file_name[]"]');
                  nameInput.disabled = false;
                  nameInput.value = files[i].name;

                  var codeInput = figure.querySelector('input[name="file_code[]"]');
                  codeInput.value = '[img]' + files[i].path + '[/img]';

                  images.appendChild(figure);
               }
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

               clearFiles();
               var data = $($(this).attr('data-raw'));
               var files = $.parseJSON(data.find('pre.files').html()); // may return null

               if (files instanceof Array && files.length > 0)
               {
                  updateFileList(files);
               }

               editorBody.val($($(this).attr('data-raw')).find('pre.body').html()).focus();

               window.scrollTo(0, editorForm.offset().top);
            });

            if (template) {
               document.getElementById('file_select').onchange = function (e) {
                  var fileInput = e.target;
                  var file = fileInput.files[0];
                  var images = fileList.get(0);
                  if (!file) {
                     return;
                  }

                  var id = Math.random().toString(36).substring(2, 5);

                  reducer
                     .toBlob(
                        file,
                        {
                           max: 600,
                           unsharpAmount: 80,
                           unsharpRadius: 0.6,
                           unsharpThreshold: 2
                        }
                     )
                     .then(function (blob) {
                        fileInput.value = null;
                        blobs.set(id, blob);

                        var figure = template.cloneNode(true);

                        var img = figure.querySelector('img');
                        img.src = URL.createObjectURL(blob);
                        img.onload = function () {
                           URL.revokeObjectURL(img.src);
                        };

                        var button = figure.querySelector('button');
                        button.onclick = function () {
                           var fig = this.parentElement.parentElement;
                           fig.parentElement.removeChild(fig);
                           blobs.delete(id);
                        };

                        var idInput = figure.querySelector('input[name="file_id[]"]');
                        idInput.disabled = false;
                        idInput.value = id;

                        var nameInput = figure.querySelector('input[name="file_name[]"]');
                        nameInput.disabled = false;
                        nameInput.value = file.name;

                        images.appendChild(figure);
                     });
               };
            }

            $('#bbcode_editor button:submit').click(function (e) {
               e.preventDefault();

               var formData = new FormData(editorForm.get(0));
               formData.getAll('file_id[]').forEach(id => {
                  if (blobs.has(id)) {
                     formData.append(id, blobs.get(id), id);
                  }
               });

               fetch(editorForm.attr('action'), {
                  method: 'POST',
                  body: formData,
               })
                  .then(response => response.json())
                  .then(data => {
                     validateResponse(data);

                     if (data.redirect) {
                        blobs.clear();

                        var a = document.createElement('a');
                        a.href = data.redirect;

                        if (window.location.href.replace(/#.*/, '') == a.href.replace(/#.*/, '')) {
                           window.location.reload();
                        } else {
                           window.location.assign(a.href);
                        }
                     }
                  }).catch(error => {
                     alert(error);
                  });
            });

            $('button.bookmark').click(function () {
               var button = $(this);
               $.get(button.attr('data-action'), function () {
                  alert('帖子成功加入到您的收藏夹中！');
               });
            });
         }
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

      $(".attach_images > figure").click(function (e) {
        e.preventDefault();
        if ($(window).width() < 600) {
          return;
        }

        var figure = this.cloneNode(true);
        figure.style.margin = 0;
        window.app.popup(figure);
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
