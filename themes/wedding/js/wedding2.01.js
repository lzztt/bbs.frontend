$(document).ready(function() {
   $('div.guest').click(function() {
      var el = $(this);
      if (el.hasClass('guest'))
      {
         el.removeClass('guest').addClass('confirmed');
         $.get('/wedding/ajax/checkin?id=' + this.id.split('_').pop());
      }
   });

   $('select#edit_list').change(function() {
      var uri = $(this).val();
      if (uri.length > 0)
      {
         window.location.href = uri;
      }
   })
});

