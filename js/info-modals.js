$(function () {
  var modalSettings = {
    effect : 'fadein',
    // position :'center, center',
    overlayColor :'#fff',
    overlayOpacity :'0.5'
  };

  // men

  var $modItemsMan = $('.weight-m, .neck-m, .shoulder-m, .chest-m, .sleevelength-m, .waist-m, .hips-m, .outseam-m, .inseam-m, .footlength-m, .jacketlength-m, .bicep-m, .wrist-m, .waistcoat-m, .pantswaistband-m, .rise-m, .thigh-m, .knee-m, .headsize-m, .glovesize-m');

  $modItemsMan.on('click', function ( e ) {
    $.fn.custombox( this, modalSettings);
    e.preventDefault();
  });

  // women

  var $modItemsWoman = $('.weight-w, .neck-w, .shoulder-w, .bust-w, .underbust-w, .sleevelength-w, .waist-w, .hips-w, .outseam-w, .inseam-w, .footlength-w, .jacketlength-w, .bicep-w, .wrist-w, .waistcoat-w, .bustpoint-w, .waistpoint-w, .skirtlength-w, .pantswaistband-w, .rise-w, .thigh-w, .knee-w, .headsize-w, .glovesize-w');

   $modItemsWoman.on('click', function ( e ) {
    $.fn.custombox( this, modalSettings);
    e.preventDefault();
  });


});