$(function() {
  var modalSettings = {
    effect: "fadein",
    overlayColor: "#fff",
    overlayOpacity: "0.5"
  };

  // man

  var $modItemsMan = $(
    ".height-m, .chest-m, .waist-m, .upperbody-m, .waisband-m, .hips-m, .shoulder-m, .sleevelength-m, .outseam-m, .inseam-m, .neck-m, .jacketlength-m, .bicep-m, .wrist-m, .rise-m, .thigh-m, .knee-m"
  );

  $modItemsMan.on("click", function(e) {
    $.fn.custombox(this, modalSettings);
    e.preventDefault();
  });

  // woman

  var $modItemsWoman = $(
    ".height-w, .bust-w, .waist-w, .hips-w, .shoulder-w, .sleevelength-w, .waistpoint-w, .outseam-w, .inseam-w, .neck-w, .underbust-w, .bicep-w, .wrist-w, .bustpoint-w, .rise-w, .thigh-w, .knee-w"
  );

  $modItemsWoman.on("click", function(e) {
    $.fn.custombox(this, modalSettings);
    e.preventDefault();
  });
});
