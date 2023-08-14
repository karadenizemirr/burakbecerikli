$(document).ready(function () {
  $(window).on('resize', function () {
    var $div = $('#responsiveDiv');
    if ($(window).width() <= 768) {
      $div.removeClass('w-50').addClass('w-100');
    } else {
      $div.removeClass('w-100').addClass('w-50');
    }
  }).trigger('resize');
});


$(function () {
  $('#task-button').click(function () {
    $.ajax({
      url: '/task',
      method: 'GET',
      success: function (response) {
        var tableBody = $('#task-table tbody'); // Tablo gövdesi

        // Her bir veri öğesi için tablo satırı oluşturma
        response.data.forEach(function (task) {
          var row = $('<tr>'); // Satır oluşturma

          // Satır hücrelerini oluşturma ve verileri ekleme
          var nameCell = $('<td>').text(task.name);
          var statusCell = $('<td>');

          if (task.status) {
            statusCell.append($('<span>').text('İşlem devam ediyor')).addClass('badge text-bg-success badge-sm mt-2')
          } else {
            statusCell.append($('<span>').text('İşlem bitti')).addClass('badge text-bg-danger badge-sm mt-2')
          }
          // Hücreleri satıra ekleme
          row.append(nameCell);
          row.append(statusCell);

          // Satırı tabloya ekleme
          tableBody.append(row);
        });
      }
    })
  })
})