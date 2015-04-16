$(function(){

  $(".nav-head-notifications a").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(".dropdown-link").removeClass("active");
      $(".dropdown").hide();
      $(".nav-head-notifications-info").show();
      $(".nav-head-notifications").addClass("active");
      $(document).one('click', function(e){
          if($(".nav-head-notifications-info").has(e.target).length === 0){
             $(".nav-head-notifications-info").hide();
             $(".nav-head-notifications").removeClass("active");
          }
      });
  });
  
  $(".nav-head-feedback a").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(".dropdown-link").removeClass("active");
      $(".dropdown").hide();
      $(".nav-head-feedback-info").show();
      $(".nav-head-feedback").addClass("active");
      $(document).one('click', function(e){
          if($(".nav-head-feedback-info").has(e.target).length === 0){
             $(".nav-head-feedback-info").hide();
             $(".nav-head-feedback").removeClass("active");
          }
      });
  });
  
  $(".nav-head-account a").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(".dropdown-link").removeClass("active");
      $(".dropdown").hide();
      $(".nav-head-account-info").show();
      $(".nav-head-account").addClass("active");
      $(document).one('click', function(e){
          if($(".nav-head-account-info").has(e.target).length === 0){
             $(".nav-head-account-info").hide();
             $(".nav-head-account").removeClass("active");
          }
      });
  });
  
  $(".measurements-content fieldset:first").addClass("active");
  $( ".measurements-content h2" ).on( "click", function() {
    $(this).next().toggle();
    $(this).parent().toggleClass("active")
    return false;
  });

  $(".friend-list .link a").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(".friend-list-field").show();
      $(document).one('click', function(e){
          if($(".friend-list-field").has(e.target).length === 0){
             $(".friend-list-field").hide();
          }
      });
  });

  $('.tab-wrap > div').hide();
  $('.tab-wrap > div:first').show();
  $('.tabs li:first').addClass('active');
  $('.tabs li a').click(function(){
  	$('.tabs li').removeClass('active');
  	$(this).parent().addClass('active');
  	var currentTab = $(this).attr('href');
  	$('.tab-wrap > div').hide();
  	$(currentTab).show();
  	return false;
  });

  $( ".item-survey" ).on( "click", function() {
    $(this).toggleClass("active")
    return false;
  });

});