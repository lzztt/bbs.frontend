google.load('visualization', '1.0', {'packages': ['corechart']});

function drawChart(chartTitle, dataJSON, divID) {

   var data = new google.visualization.DataTable();
   data.addColumn('string', 'Topping');
   data.addColumn('number', 'Slices');
   data.addRows(dataJSON);

   var options = {'title': chartTitle,
      backgroundColor: {fill: 'transparent'},
      titleTextStyle: {color: 'white'},
      legend: {textStyle: {color: 'white'}},
      'width': 400,
      'height': 300};

   var chart = new google.visualization.PieChart(document.getElementById(divID));
   chart.draw(data, options);
}

$(document).ready(function() {
   $('form#ajax-attend').submit(function(e) {
      e.preventDefault();

      var form = $(this);
      $.post(form.attr("action"), form.serialize(), function(data) {
         console.log(data);
         if (data.error)
         {
            alert(data.error);
         }
         else
         {
            $("div#activity").html(data.message);
            $("div#statistics").html(data.chart);
            if (data.comments)
            {
               $("div#comments").html(data.comments);
            }
         }
      },
              'json');
   });

   $('div.unconfirmed').click(function() {
      var el = $(this);
      $.get('/single/ajax/checkin?id=' + this.id.split('_').pop());
      var parent_id = el.parent().attr('id').replace('unconfirmed', 'confirmed');
      var parent = $('#' + parent_id);
      el.detach().appendTo(parent);
      el.removeAttr('id').removeClass('unconfirmed').addClass('confirmed').off('click').prepend('<span>' + (parent.children().length - 1) + '</span>');
      
   });
});

