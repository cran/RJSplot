$(document).ready(function() {
  $('body').css({"font-family":"sans-serif","color":"#333"});
  $('table').DataTable({
    dom: 'lftBp',
    "lengthMenu": [ 20, 50, 100 ],
    buttons: ['copy','csv','excel','pdf']
  });
  $('.dt-buttons').css("padding-top","0.25em")
  bioinfoLogo();
});
