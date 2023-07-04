$('#login-form').validate({
  rules: {
    email: {
      required: true,
      email: true,
      // maxlength: 255,
    },
    password: {
      required: true,
      // maxlength: 20,
    },
  },

  messages: {
    email: {
      required: 'Email は必須です。',
      email: 'メールアドレスを正しく入力してください。',
      // maxlength: function(params, element) {
      //   const valueLength = $('#login-email').val().length;
      //   return `Emailは「${params}」文字以下で入力してください。（現在${valueLength}文字)`;
      // },
    },
    password: {
      required: 'Password は必須です。',

      // maxlength: function(params, element) {
      //   const valueLength = $('#login-password').val().length;
      //   return `Passwordは「${params}」文字以下で入力してください。（現在${valueLength}文字)`;
      // },
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
