$(document).ready(function(){function c(m,l,h){var k=new google.visualization.DataTable();k.addColumn("string","Topping");k.addColumn("number","Slices");k.addRows(l);var i={title:m,backgroundColor:{fill:"transparent"},titleTextStyle:{color:"black",fontSize:14},legend:{textStyle:{color:"black"}},width:400,height:300};var j=new google.visualization.PieChart(document.getElementById(h));j.draw(k,i)}$("div.google_chart").each(function(){var h=$(this);c(h.attr("data-title"),$.parseJSON(h.attr("data-json")),h.attr("id"))});$("form#ajax-attend").submit(function(i){i.preventDefault();var h=$(this);$.post(h.attr("action"),h.serialize(),function(j){console.log(j);if(j.error){alert(j.error)}else{$("div#activity").html(j.message);$("div#statistics").html(j.chart);$("div.google_chart").each(function(){var k=$(this);c(k.attr("data-title"),$.parseJSON(k.attr("data-json")),k.attr("id"))});if(j.comments){$("div#comments").html(j.comments)}}},"json")});$("div.unconfirmed").click(function(){var h=$(this);$.get("/single/ajax/checkin?id="+this.id.split("_").pop(),function(k){var j=h.parent().attr("id").replace("unconfirmed","confirmed");var i=$("#"+j);h.detach().appendTo(i);h.removeAttr("id").removeClass("unconfirmed").addClass("confirmed").off("click").prepend("<span>"+(i.children().length-1)+"</span>")})});var f=$(window),d=$("#goTop"),b=false;var a=function(){b=true;d.stop().animate({bottom:"40px"},300)};var e=function(){b=false;d.stop().animate({bottom:"-100px"},300)};var g=function(){if(f.scrollTop()>300){if(!b){a()}}else{if(b){e()}}};g();f.scroll(g);d.click(function(h){$("html, body").stop().animate({scrollTop:0},300,e);h.preventDefault()})});