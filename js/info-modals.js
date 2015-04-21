/* 
Author: Slobodan Radovanovic
Desctiption: 
  This jQuery code is for modal windows which 
  appears on pages: measurements-men.html 
  and measurements-women.html
*/

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
