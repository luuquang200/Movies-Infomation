
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

    // review page pagination
    let currentPage = 1;
    let totalPages = 1;
    loadReviews(currentPage);

    function loadReviews(page) {
        let movieId = window.location.pathname.split('/')[2];
        $.getJSON(`/movie/${movieId}/reviews?page=${page}`, function(response) {
            totalPages = response.total_pages;
            const reviewContainer = $('#reviewContainer');
            reviewContainer.empty();

            response.data.forEach(review => {
                const reviewHtml = `
                    <div class="card mb-4 m-4">
                        <div class="card-header">
                            <h5 class="card-title">${review.reviewtitle}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">by ${review.author} on ${formatDate(review.submissiondate)}</h6>
                        </div>
                        <div class="card-body">
                            <p class="card-text">${review.reviewtext}</p>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted">${review.authorrating} out of 10 stars</small>
                        </div>
                    </div>
                `;
                reviewContainer.append(reviewHtml);
            });

            // update pagination ui
            const pagination = $('#pagination');
            pagination.empty();
            let paginationHtml = '';
            if (response.total_pages > 1) {
                paginationHtml += `
                    <li class="page-item">
                        <a class="page-link" id="prevPage" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                `;
                for (let i = 1; i <= response.total_pages; i++) {
                    paginationHtml += `
                        <li class="page-item page-link-item ${i === page ? 'active' : ''}">
                            <a data-page="${i}" class="page-link">${i}</a>
                        </li>
                    `;
                }
                paginationHtml += `
                    <li class="page-item">
                        <a class="page-link" id="nextPage" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                `;
            }
            pagination.append(paginationHtml);
        });
    }

    $(document).on('click', '.page-link-item a', function(e) {
        e.preventDefault();
        currentPage = $(this).data('page');
        loadReviews(currentPage);
    });

    $(document).on('click', '#prevPage', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            loadReviews(currentPage);
        }
    });

    $(document).on('click', '#nextPage', function(e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            loadReviews(currentPage);
        }
    });


    function formatDate(date) {
        if (date) {
            return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        } else {
            return '';
        }
    }

});