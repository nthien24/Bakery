(function ($) {
    "use strict";

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('#btnSubmit').on('click', function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }
        if (check) {
            submitLogin();
        }
        return check;
    });

    function submitLogin() {
        $.blockUI({message: '<h1><img src="busy.gif" /> Just a moment...</h1>'});

        let email = $('#email').val();
        let password = $('#password').val();

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": base_url + "/authenticate",
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": "{\n\t\"username\":\"" + email + "\",\n\t\"password\":\"" + password + "\"\n}\n"
        };

        $.ajax(settings).done(function (response) {
            $.unblockUI();
            localStorage.setItem("token", response["jwttoken"]);
            localStorage.setItem("idUser", response["idUser"]);
            localStorage.setItem(USER_NAME, response["userName"]);
            // swal("Thành Công", "Đăng nhập thành công!", "success")
            //     .then(
            //         function () {
            //             redirectToSurvey();
            //         },
            //         function () {
            //             return false;
            //         });
            redirectToSurvey();
        }).fail(function (response) {
            if (response != 200) {
                swal("Thất bại", "Đăng nhập thất bại!", "error");
            }


        }).always(function () {
            $.unblockUI();
        });
    }
    function redirectToSurvey() {
        window.location.href = "../index.html";
    }
    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }


})(jQuery);
