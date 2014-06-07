$(document).ready(function() {
   images = new Array();
   id = 0;
   
   $('ul.nav li img').each(function(index) {
      
      images.push( this.src );
      
      $(this).click(function() {
         document.getElementById("wrapper").style.backgroundImage = "url('" + this.src + "')";
         id = index;
      });
   });
   
   setInterval( function(){
      id++;
      id %= 5;
      document.getElementById("wrapper").style.backgroundImage = "url('" + images[id] + "')";
   }, 3000 );
});

