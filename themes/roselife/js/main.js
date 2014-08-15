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
            var tds = $('td', table);
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
             fileTable = $('#ajax_file_list'),
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
               for (var i = 0; i < files.length; i++) {
                  var fid = files[i].fid;
                  var path = files[i].path;
                  var imageExt = new Array('jpeg', 'gif', 'png');
                  var fileExt = path.split('.').pop();
                  var bbcode;

                  if (imageExt.indexOf(fileExt) >= 0) {
                     bbcode = '[img]' + path + '[/img]';
                  }
                  else {
                     bbcode = '[file="' + path + '"]' + files[i].name + '[/file]';
                  }

                  var row = '<tr id="editfile-' + fid + '">' +
                      '<td><input type="text" size="30" maxlength="30" name="files[' + fid + '][name]" id="editfile-' + fid + '-name" value="' + files[i].name + '"><input type="text" style="display:none;" name="files[' + fid + '][path]" value="' + path + '"></td>' +
                      '<td>' + bbcode + '</td><td><button class="ajax_file_delete">删除</button></td></tr>';
                  fileTableBody.append(row);
               }
               addTableHeader(fileTable);
               fileTable.show();
            }
            else
            {
               fileTable.hide();
            }

            editorBody.val($($(this).attr('data-raw')).find('pre.body').html()).focus();

            window.scrollTo(0, editorForm.offset().top);
         });
      }
   }
});