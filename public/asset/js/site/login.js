// $.validator.addMethod(
//   'customEmail',
//   function(value, element) {
//     // Regular expression pattern for email format with dot in the head and two dots allowed
//     const pattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/;
//     return this.optional(element) || pattern.test(value);
//   },
//   'Please enter a valid email address.',
// );

$.validator.addMethod(
  'customEmail',
  function(value, element) {
    // Regular expression pattern for email format with dot in the head and two dots allowed
    const pattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return this.optional(element) || pattern.test(value);
  },
  'Please enter a valid email address.',
);

$('#login-form').validate({
  rules: {
    email: {
      required: true,
      customEmail: true,
    },
    password: {
      required: true,
    },
  },

  messages: {
    email: {
      required: 'Emailは必須です。',
      customEmail: 'メールアドレスを正しく入力してください。',
    },
    password: {
      required: 'Passwordは必須です。',
    },
  },

  submitHandler: function(form) {
    form.submit();
  },
});

$('#login-email').keyup(function() {
  $('#flash-message').addClass('d-none');
});

$('#login-password').keyup(function() {
  $('#flash-message').addClass('d-none');
});

// Disable the submit button initially
document.getElementById('submit-login').disabled = true;

window.addEventListener('load', function() {
  document.getElementById('submit-login').disabled = false;
});

document.getElementById('login-form').addEventListener('submit', function() {
  if ($('#login-form').valid()) {
    document.getElementById('submit-login').disabled = true;
  }
});
