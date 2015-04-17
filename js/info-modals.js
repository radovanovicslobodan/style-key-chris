$(function () {
  var modalSettings = {
    effect : 'fadein',
    // position :'center, center',
    overlayColor :'#fff',
    overlayOpacity :'0.5'
  };

  // men

  var $modItemsMan = $('.weight-m, .neck-m, .shoulder-m, .chest-m, .sleevelength-m, .waist-m, .hips-m, .outseam-m, .inseam-m, .footlength-m, .jacketlength-m, .bicep-m, .wrist-m, .waistcoat-m, .pantswaistband-m, .rise-m, .thigh-m, .knee-m, .headsize-m, .glovesize-m');

  // women
  // .....

  $modItemsMan.on('click', function ( e ) {
    $.fn.custombox( this, modalSettings);
    e.preventDefault();
  });


});