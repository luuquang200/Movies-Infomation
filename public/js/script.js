
$(document).ready(function () {
    $("form").on('submit', function (event) {
        var isValid = true;

        // Validate username
        var username = $("#username").val();
        if (username.length < 5) {
            $("#username-error").text("Username must be at least 5 characters long");
            isValid = false;
        } else {
            $("#username-error").text("");
        }

        // Validate password
        var password = $("#password").val();
        if (password.length < 8) {
            $("#password-error").text("Password must be at least 8 characters long");
            isValid = false;
        } else {
            $("#password-error").text("");
        }

        // Validate retype-password
        var retypePassword = $("#retype-password").val();
        if (retypePassword !== password) {
            $("#retype-password-error").text("Passwords do not match");
            isValid = false;
        } else {
            $("#retype-password-error").text("");
        }

        // Validate name
        var name = $("#name").val();
        if (!name) {
            $("#name-error").text("Please enter your full name");
            isValid = false;
        } else {
            $("#name-error").text("");
        }

        // Validate email
        var email = $("#email").val();
        var emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            $("#email-error").text("Please enter a valid email address");
            isValid = false;
        } else {
            $("#email-error").text("");
        }

        // If form is not valid, prevent it from being submitted
        if (!isValid) {
            event.preventDefault();
        } else {
            $.ajax({
                url: '/user/register',
                type: 'post',
                data: $(this).serialize(),
                success: function() {
                    alert('Registration successful');
                },
                error: function(xhr) {
                    if (xhr.status === 400) {
                        var error = JSON.parse(xhr.responseText);
                        $('#' + error.field + '-error').text(error.message);
                    }
                }
            });

            // Prevent the form from being submitted
            event.preventDefault();
        }

    });
});