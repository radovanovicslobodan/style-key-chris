$(function() {
  var modalSettings = {
    effect: "fadein",
    overlayColor: "#fff",
    overlayOpacity: "0.5"
  };

  var $infoModalsItems = $('a.info-btn');

  $infoModalsItems.on('click', function ( e ) {
    $.fn.custombox( this, modalSettings);
    e.preventDefault();
  });
});
