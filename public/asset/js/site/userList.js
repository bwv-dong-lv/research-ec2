const curPage = $('#save-page').val();

function pageClick(obj) {
  $('#save-page').val(obj.value);
}

function prevClick() {
  $('#save-page').val(Number(curPage) - 1);
}

function nextClick() {
  $('#save-page').val(Number(curPage) + 1);
}

function firstPageClick() {
  $('#save-page').val(1);
}

function lastPageClick() {
  const lastPage = $('#save-last-page').val();
  $('#save-page').val(lastPage);
}

function exportCSV() {
  window.open('/user/export-csv', '_blank').focus();
}

$(document).ready(function() {
  $('#user-list-from-date').datepicker({
    dateFormat: 'dd/mm/yy',
  });
});

$(document).ready(function() {
  $('#user-list-to-date').datepicker({
    dateFormat: 'dd/mm/yy',
  });
});
