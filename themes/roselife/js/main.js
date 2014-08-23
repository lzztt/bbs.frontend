$.cookie.defaults = {
   expires: 365,
   path: '/',
   domain: document.domain.split('.').slice(-2).join('.')
};

$(document).ready(function() {
// get uid and urole
   var uid = $.cookie('uid');
   uid = (!uid) ? 0 : parseInt(uid, 10);
   if (uid < 0)
   {
      uid = 0;
   }

   if (uid > 0) {
      $('.v_guest').remove();
      $('.v_user').show();
      $('.v_user' + uid).show();

      var urole = $.cookie('urole');
      if (urole)
      {
         var role = urole.split('|');
         for (var i = 0; i < role.length; ++i)
         {
            $('.v_user_' + role[i]).show();
         }
      }
   }
   else {
      $('.v_guest').show();
      $('[class*="v_user"]').remove();
   }

   // image slider
   $('.image_slider').imageSlider();

   // ajax_load container
   $('.ajax_load').each(function() {
      var container = $(this);
      var uri = container.attr('data-ajax');
      if (uri) {
         $.getJSON(uri, function(data) {
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
   var hasToggler = false, logo = $('a#logo'), navbar = $('nav#page_navbar');

   navbarToggler = function()
   {
      if (navbar.css('display') === 'none')
      {
         if (!hasToggler)
         {
            logo.on('click', function(e) {
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
            logo.off('click');
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

   // responsive table header
   var addTableHeader = function(table) {
      var headers = new Array();
      $('th', table).each(function() {
         headers.push(this.innerHTML);
      });
      if (headers.length > 0) {
         $('tbody tr', table).each(function() {
            var tds = $('td', this);
            for (i = 0; i < tds.length; i++) {
               $(tds.get(i)).attr('data-header', headers[i]);
            }
         });
      }
   };
   $('table').each(function() {
      addTableHeader(this);
   });

   // for logged-in user
   if (uid > 0)
   {
      var pmCount = $.cookie('pmCount');
      if (pmCount > 0)
      {
         $("a#pm").append('<span style="color:red;"> (' + pmCount + ') <span>');
      }

      var editorForm = $('#bbcode_editor');
      if (editorForm.length)
      {
         var editorBody = $('#bbcode_editor textarea'),
             editorTitle = $('#bbcode_editor .node_title'),
             fileTable = $('#file_list'),
             fileTableBody = $('tbody', fileTable);
         editorBody.markItUp(myBBCodeSettings);
         // button actions
         $('button.delete').click(function(e) {
            var answer = confirm("此操作不可恢复，您确认要删除该内容吗？");
            if (answer)
            {
               window.location = $(this).attr('data-action');
            }
         });

         $('button.reply').click(function(e) {
            editorForm.attr('action', $(this).attr('data-action'));
            editorTitle.hide();
            fileTable.hide();
            fileTableBody.children().remove();

            editorBody.val('').focus();

            window.scrollTo(0, editorForm.offset().top);
         });

         $('button.quote').click(function(e) {
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

         var updateFileTable = function(files) {
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

         $('button.edit').click(function(e) {
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

         $('button.create_node').click(function(e) {
            editorForm.attr('action', $(this).attr('data-action'));
            editorTitle.show();
            fileTable.hide();
            fileTableBody.children().remove();

            editorBody.val('');
            $('input', editorTitle).val('').focus();

            window.scrollTo(0, editorForm.offset().top);
         });

         $('#file_upload').click(function(e) {
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

               file.upload('/file/ajax/upload', function(res) {
                  file.val('');
                  button.prop("disabled", false);
                  button.find('span.spinner').remove();
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
                     alert('您的浏览器在上传文件过程中遇到错误，请换用其他浏览器上传文件。');
                     $.post('/bug/ajax-file-upload', 'error=' + e.message + '&res=' + encodeURIComponent(res));
                  }
               }, 'json');
            }
         });

         $('#file_clear').click(function() {
            $('#file_select').val('');
         });

         fileTable.on("click", ".file_delete", function(e) {
            //$(".file_delete", fileTable).live("click", function(e) {
            var row = this.parentNode.parentNode;
            var table = row.parentNode.parentNode;
            //alert(row.sectionRowIndex);
            table.deleteRow(row.rowIndex);
            if (table.rows.length <= 1)
            {
               fileTable.hide();
            }
         });

         $('#bbcode_editor button:submit').click(function(e) {
            if ($('#file_select').val())
            {
               alert('请先上传或清空选中的文件');
               e.preventDefault();
            }
         });

         $('button.bookmark').click(function(e) {
            var button = $(this);
            $.get(button.attr('data-action'), function(data) {
               alert('帖子成功加入到您的收藏夹中！');
            });
         });

      }
   }
});