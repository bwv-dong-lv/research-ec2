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

function toDateObject(dateString) {
  const dateParts = dateString.split('/');
  return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
}
// Custom validation method
$.validator.addMethod(
  'dateLessThan',
  function(value, element, params) {
    const fromField = $(params);
    if (!this.optional(element) && !this.optional(fromField[0])) {
      const fromDate = toDateObject(fromField.val());
      const toDate = toDateObject(value);
      return toDate <= fromDate;
    }
    return true;
  },
  '解約予定日は契約終了日前を指定してください。',
);

// Initialize the validation
$(document).ready(function() {
  $('#user-list-search-form').validate({
    rules: {
      fromDate: {
        dateLessThan: '#user-list-to-date',
      },
    },
    messages: {
      fromDate: {},
    },
  });
});
