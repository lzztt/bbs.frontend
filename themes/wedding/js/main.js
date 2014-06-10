$(document).ready(function() {
   var images = $('ul.nav li img').get();
   var current = 0;
   var bgswitch = null;

   for (i = 0; i < images.length; i++) {
      images[i].onclick = function() {
         document.getElementById("wrapper").style.backgroundImage = "url('" + this.src + "')";
         current = i;
      };
   }
   ;

   var bgon = function() {
      current++;
      if (current >= images.length)
      {
         current = 0;
      }

      document.getElementById("wrapper").style.backgroundImage = "url('" + images[current].src + "')";
   };

   bgswitch = setInterval(bgon, 3000);

   $('button#bgswitch').click(function() {
      if (bgswitch === null)
      {
         bgswitch = setInterval(bgon, 3000);
         $(this).text("停止图片轮播");
      }
      else
      {
         clearInterval(bgswitch);
         bgswitch = null;
         $(this).text("开始图片轮播");
      }
   });
});

