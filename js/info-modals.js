$(function () {
  var modalSettings = {
    effect : 'fadein',
    // position :'center, center',
    overlayColor :'#fff',
    overlayOpacity :'0.5'
  };

  // men

  var $modItemsMan = $('.chest-m, .waist-m, .upperbody-m, .waisband-m, .hips-m, .shoulder-m, .sleevelength-m, .outseam-m, .inseam-m, .neck-m, .jacketlength-m, .bicep-m, .wrist-m, .rise-m, .thigh-m, .knee-m');

  $modItemsMan.on('click', function ( e ) {
    $.fn.custombox( this, modalSettings);
    e.preventDefault();
  });

  // women

  var $modItemsWoman = $('.bust-w, .waist-w, .hips-w, .shoulder-w, .sleevelength-w, .waistpoint-w, .outseam-w, .inseam-w, .neck-w, .underbust-w, .bicep-w, .wrist-w, .bustpoint-w, .rise-w, .thigh-w, .knee-w');

   $modItemsWoman.on('click', function ( e ) {
    $.fn.custombox( this, modalSettings);
    e.preventDefault();
  });


});