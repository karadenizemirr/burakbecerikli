$(document).ready(function() {
  $(window).on('resize', function() {
    var $div = $('#responsiveDiv');
    if ($(window).width() <= 768) {
      $div.removeClass('w-50').addClass('w-100');
    } else {
      $div.removeClass('w-100').addClass('w-50');
    }
  }).trigger('resize');
});
