
$(document).ready(function () {
    // validate register form
    $("#regiter-form").on('submit', function (event) {
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
                    window.location.href = '/user/login';
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

    // validate login form
    $("#login-form").on('submit', function (event) {
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

        // If form is not valid, prevent it from being submitted
        if (!isValid) {
            event.preventDefault();
        } else {
            $.ajax({
                url: '/user/login',
                type: 'post',
                data: $(this).serialize(),
                success: function() {
                    alert('Login successful');
                    window.location.href = '/home';
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


    // import data
    $('#dataFiles').on('change', function() {
        var fileList = $('#fileList');
        var fileNames = [];
        $.each(this.files, function(i, file) {
            fileNames.push(file.name);
        });
        fileList.text(fileNames.join(', '));
    });

    // movie details page

    $('#showMoreCasts').click(function(e) {
        e.preventDefault();
        $('#moreCasts').show();
        $('#dots').hide();
        $(this).hide();
        $('#showLessCasts').show();
    });

    $('#showLessCasts').click(function(e) {
        e.preventDefault();
        $('#moreCasts').hide();
        $('#dots').show();
        $(this).hide();
        $('#showMoreCasts').show();
    });

    $('.more').click(function(e) {
        e.preventDefault();
        $(this).parent().hide();
        $('.full-text').show();
    });

    $('.less').click(function(e) {
        e.preventDefault();
        $(this).parent().hide();
        $('.synopsis').show();
    });

});