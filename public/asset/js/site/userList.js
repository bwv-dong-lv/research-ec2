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
    onselect: function(dateText, inst) {
      $(this).valid();
      $('#user-list-search-form').validate();
      $('#user-list-search-form')
        .validate()
        .element('#user-list-from-date');
    },
  });
});

$(document).ready(function() {
  $('#user-list-to-date').datepicker({
    dateFormat: 'dd/mm/yy',
    onselect: function(dateText, inst) {
      $(this).valid();
      $('#user-list-search-form').validate();
      $('#user-list-search-form')
        .validate()
        .element('#user-list-to-date');
    },
  });
});

function toDateObject(dateString) {
  const dateParts = dateString.split('/');
  return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
}

$('#user-list-from-date').change(function() {
  $(this).validate();
  $('#user-list-search-form')
    .validate()
    .element('#user-list-from-date');
  if (!$('#user-list-search-form').valid()) {
    $('#user-list-search-form')
      .validate()
      .element('#user-list-to-date');
  }
});

$('#user-list-to-date').change(function() {
  $(this).validate();
  $('#user-list-search-form')
    .validate()
    .element('#user-list-to-date');
  if (!$('#user-list-search-form').valid()) {
    $('#user-list-search-form')
      .validate()
      .element('#user-list-from-date');
  }
});

// Custom validation method
$.validator.addMethod(
  'dateLessThan',
  function(value, element, params) {
    const fromField = $(params);

    const parts = fromField.val().split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month - 1, day);

    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return true; // Valid
    }

    if (!this.optional(element) && !this.optional(fromField[0])) {
      const fromDate = toDateObject(fromField.val());
      const toDate = toDateObject(value);
      return toDate <= fromDate;
    }
    return true;
  },
  '解約予定日は契約終了日前を指定してください。',
);

$.validator.addMethod(
  'dateMoreThan',
  function(value, element, params) {
    const fromField = $(params);

    const parts = fromField.val().split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month - 1, day);

    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return true; // Valid
    }

    if (!this.optional(element) && !this.optional(fromField[0])) {
      const fromDate = toDateObject(fromField.val());
      const toDate = toDateObject(value);
      return toDate >= fromDate;
    }
    return true;
  },
  '解約予定日は契約終了日前を指定してください。',
);

$.validator.addMethod(
  'validDay',
  function(value, element) {
    // Split the input value into day, month, and year
    const parts = value.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Create a new Date object
    const date = new Date(year, month - 1, day);

    // Check if the date is valid
    if (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    ) {
      return true; // Valid
    }

    return this.optional(element) || false; // Invalid
  },
  'Please enter a valid date.',
);

// Initialize the validation
$(document).ready(function() {
  $('#user-list-search-form').validate({
    rules: {
      fromDate: {
        validDay: true,
        dateLessThan: '#user-list-to-date',
      },
      toDate: {
        validDay: true,
        dateMoreThan: '#user-list-from-date',
      },
    },
    messages: {
      fromDate: {
        validDay: 'Started Date Fromは日付を正しく入力してください。',
      },
      toDate: {
        validDay: 'Started Date Toは日付を正しく入力してください。',
      },
    },
    onkeyup: false,
  });
});

function clearSearch() {
  $('#user-list-search-form input[type="text"]').val('');
}
