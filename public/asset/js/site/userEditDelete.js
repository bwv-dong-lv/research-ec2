$('#user-update-started-date').datepicker({
  dateFormat: 'dd/mm/yy',
  onSelect: function(dateText, inst) {
    // Trigger validation for the datepicker field
    $(this).valid();
    $('#user-add-form').validate();
  },
});

$('#user-add-name').on('keyup blur', function() {
  $(this).valid();
  $('#user-add-form').validate();
});
$('#user-add-email').on('keyup blur', function() {
  $(this).valid();
  $('#user-add-form').validate();
});
$('#user-update-started-date').on('keyup blur', function() {
  $(this).valid();
  $('#user-add-form').validate();
});

// check password
$.validator.addMethod(
  'passwordPattern',
  function(value) {
    if (value.trim() === '') {
      return true;
    }
    return /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(value);
  },
  'パスワードには半角数字のみ、または半角英字のみの値は使用できません。',
);

// check 1 byte
$.validator.addMethod(
  'oneByteCharacter',
  function(value, element) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(value);
    return bytes.length === value.length;
  },
  'Vui lòng nhập một ký tự có độ dài 1 byte.',
);

// check eai email format
$.validator.addMethod(
  'customEmail',
  function(value, element) {
    // Regular expression pattern for email format with dot in the head and two dots allowed
    const pattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return this.optional(element) || pattern.test(value);
  },
  'Please enter a valid email address.',
);

// check format dd/mm/yyyy
$.validator.addMethod(
  'dateDDMMYYYY',
  function(value, element) {
    // Check for the format dd/mm/yyyy
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return this.optional(element) || dateRegex.test(value);
  },
  'Please enter a date in the format dd/mm/yyyy.',
);

// Add a custom validation method to check for invalid days in a month
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

    return false; // Invalid
  },
  'Please enter a valid date.',
);

$('#user-add-form').validate({
  rules: {
    username: {
      required: true,
      maxlength: 100,
      oneByteCharacter: true,
    },
    email: {
      required: true,
      customEmail: true,
      maxlength: 255,
    },
    group: {
      required: true,
    },
    startedDate: {
      required: true,
      dateDDMMYYYY: true,
      validDay: true,
    },
    position: {
      required: true,
    },
    password: {
      minlength: 8,
      maxlength: 20,
      passwordPattern: true,
      oneByteCharacter: true,
    },
    confirmPassword: {
      equalTo: '#user-add-password',
      required: function(element) {
        return (
          $('#user-add-password')
            .val()
            .trim() !== ''
        );
      },
      // oneByteCharacter: true,
    },
  },

  messages: {
    username: {
      required: 'User Nameは必須です。',
      maxlength: function(params, element) {
        const valueLength = $('#user-add-name').val().length;
        return `User Nameは「${params}」文字以下で入力してください。（現在${valueLength}文字)`;
      },
      oneByteCharacter: 'User Nameは半角英数で入力してください',
    },
    email: {
      required: 'Emailは必須です。',
      email: 'Please enter your email address correctly.',
      maxlength: function(params, element) {
        const valueLength = $('#user-add-email').val().length;
        return `Emailは「${params}」文字以下で入力してください。（現在${valueLength}文字)`;
      },
      customEmail: 'メールアドレスを正しく入力してください',
    },
    group: {
      required: 'Groupは必須です。',
    },
    startedDate: {
      required: 'Started Dateは必須です。',
      dateDDMMYYYY: 'Started Dateは日付を正しく入力してください。',
      validDay: 'Started Dateは日付を正しく入力してください。',
    },
    position: {
      required: 'Positionは必須です。',
    },
    password: {
      minlength: 'パスワードは半角英数字記号で8～20文字で入力してください。',
      maxlength: 'パスワードは半角英数字記号で8～20文字で入力してください。',
      oneByteCharacter: 'User Nameは半角英数で入力してください',
    },
    confirmPassword: {
      equalTo: '確認用のパスワードが間違っています。',
      required: 'Password Confirmationは必須です。',
      oneByteCharacter: 'User Nameは半角英数で入力してください',
    },
  },

  submitHandler: function(form) {
    form.submit();
  },
});

function backToUserList() {
  // Perform your desired JavaScript actions here
  window.location.href = '/user';
}

function submitAdd() {
  const form = document.getElementById('user-add-form');

  form.action = '/user/add';
}

function submitUpdate() {
  const form = document.getElementById('user-add-form');

  form.action = '/user/update';
}

const maxLength = 12;
$('#user-add-group > option').text(function(i, text) {
  if (text.length > maxLength) {
    return text.substr(0, maxLength) + ' ...';
  }
});

document.getElementById('submit-update').disabled = true;

window.addEventListener('load', function() {
  document.getElementById('submit-update').disabled = false;
});

document.getElementById('user-add-form').addEventListener('submit', function() {
  if ($('#user-add-form').valid()) {
    document.getElementById('submit-update').disabled = true;
  }
});
