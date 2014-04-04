(function($){

  // extend jquery (because i love jQuery)
  $.imgpreload = function (imgs,settings)
  {
    settings = $.extend({},$.fn.imgpreload.defaults,(settings instanceof Function)?{all:settings}:settings);

    // use of typeof required
    // https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Operators/Special_Operators/Instanceof_Operator#Description
    if ('string' == typeof imgs) { imgs = new Array(imgs); }

    var loaded = new Array();

    $.each(imgs,function(i,elem)
           {
             var img = new Image();

             var url = elem;

             var img_obj = img;

             if ('string' != typeof elem)
               {
                 url = $(elem).attr('src') || $(elem).css('background-image').replace(/^url\((?:"|')?(.*)(?:'|")?\)$/mg, "$1");

                 img_obj = elem;
               }

               $(img).bind('load error', function(e)
                           {
                             loaded.push(img_obj);

                             $.data(img_obj, 'loaded', ('error'==e.type)?false:true);

                             if (settings.each instanceof Function) { settings.each.call(img_obj); }

                             // http://jsperf.com/length-in-a-variable
                             if (loaded.length>=imgs.length && settings.all instanceof Function) { settings.all.call(loaded); }

                             $(this).unbind('load error');
                           });

                           img.src = url;
           });
  };

  $.fn.imgpreload = function(settings)
  {
    $.imgpreload(this,settings);

    return this;
  };

  $.fn.imgpreload.defaults =
    {
    each: null // callback invoked when each image in a group loads
      , all: null // callback invoked when when the entire group of images has loaded
  };

})(jQuery);

//On Blur On Focus  
$(document).ready(function() {
    $('a.hint').tooltip({ html: true, placement: 'right' });

  //bx Slider 
  $(document).ready(function(e) {
    $('.bxslider').bxSlider({
      auto: true,
      autoControls: true
    }); 
    //Home Drop Down Menu 
    $('.cmb>option:eq(0)').attr('selected',true);
    $('.cmb').change(function(){
      window.location = $(this).val();
    });

    var viewport = $('html, body');
    var filter = $('a.filter:first'); 

    $('.filter').click(function(){
      viewport.animate({ scrollTop: filter.position().top }, 600);
      return false;
    });

    viewport.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
      if(e.which > 0 || e.type === "mousedown" || e.type === "mousewheel") viewport.stop();
    });

    //Portfolio Sorting Filter 
    jQuery(document).ready(function(e) {
      jQuery(function () {

        var filterList = {

          init: function () {

            // MixItUp plugin
            // http://mixitup.io
            jQuery('#portfoliolist').mixitup({
              targetSelector: '.portfolio',
              filterSelector: '.filter',
              effects: ['fade'],
              easing: 'snap',
              // call the hover effect
              onMixEnd: filterList.hoverEffect()
            });				

          },

          hoverEffect: function () {

            // Simple parallax effect
            jQuery('#portfoliolist .portfolio').hover(
              function () {
              jQuery(this).find('.label').stop().animate({bottom: 0}, 200, 'easeOutQuad');
              jQuery(this).find('img').stop().animate({top: -30}, 500, 'easeOutQuad');				
            },
            function () {
              jQuery(this).find('.label').stop().animate({bottom: -40}, 200, 'easeInQuad');
              jQuery(this).find('img').stop().animate({top: 0}, 300, 'easeOutQuad');								
            }		
            );				

          }

        };

        // Run the show!
        filterList.init();


      });	

    });




  });
});
