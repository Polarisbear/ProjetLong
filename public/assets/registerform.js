$(document).ready(function(){
  $('form').on('submit', function(){
    var fullname = $('input[name*='fullname']');
    var username = $('input[name*='username']');
    var password = $('input[name*='password']');
    var register = {username: username.val(),
                    fullname: fullname.val(),
                    password: password.val(),
                    type: 'user'
    };

    $.ajax({
      type: 'POST',
      url:'/register',
      data: register,
      success: function(data){
        // Faire quelquechose avec le framework en front-end
        location.reload();
      }
    });
    return false;
  });
