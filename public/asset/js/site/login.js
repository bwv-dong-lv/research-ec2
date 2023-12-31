$.validator.addMethod(
  'customEmail',
  function(value, element) {
    // Regular expression pattern for email format with dot in the head and two dots allowed
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

$('#user-add-email').on('blur', function() {
  $('#user-add-form')
    .validate()
    .element('#user-add-email');
});

$('#login-email').on('blur', function() {
  $('#login-form')
    .validate()
    .element('#login-email');
});

$('#login-password').on('blur', function() {
  $('#login-form')
    .validate()
    .element('#login-password');
});
