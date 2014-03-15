//On Blur On Focus  
$(document).ready(function() {

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

    $('.filter').click(function(){
        $('html, body').animate({ scrollTop: 800 }, 600);

        return false;
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
  //preloader  

  // makes sure the whole site is loaded
  jQuery(window).load(function() {
    // will first fade out the loading animation
    jQuery("#status").fadeOut();
    // will fade out the whole DIV that covers the website.
    jQuery("#preloader").delay(1000).fadeOut("slow");
  })
});
