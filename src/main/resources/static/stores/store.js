(function ($) {

    $('#btnSubmitLogin').on('click', (function (e) {

    }));

    function initScreen() {
        $.blockUI({message: '<h1><img src="busy.gif" /> Just a moment...</h1>'});

        email = $('#email').val();
        password = $('#password').val();

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": base_url + "/stores/",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "postman-token": "0491f917-1f54-fc06-1103-84fda7385f29"
            },
            "processData": false
        };

        $.ajax(settings).done(function (response) {
            $.unblockUI();
            parseDataToHtml(response);
            // swal("Thành Công", "Đăng nhập thành công!", "success");
        }).fail(function (response) {
            if (response != 200) {
                swal("Thất bại", "Lỗi tải trang vui lòng thông báo admin!", "error");
            }


        }).always(function () {
            $.unblockUI();
        });
    }

    initScreen();

    function parseDataToHtml(arrData) {
        let data = [];
        data = arrData;
        let containerStore = $('#containerStore');

        $.each(data, function (index, value) {
            if (index % 2 == 0) {
                containerStore.append("<div class=\"single_about_area\">\n" +
                    "        <div class=\"container\">\n" +
                    "            <div class=\"row align-items-center\">\n" +
                    "                <div class=\"col-xl-6 col-lg-6\">\n" +
                    "                    <div class=\"single_about_thumb thumb_n2\">\n" +
                    "                        <img src=\"" + value.image + "\" alt=\"\">\n" +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "                <div class=\"col-xl-5 offset-xl-1 col-lg-5 offset-lg-1\">\n" +
                    "                    <div class=\"single_about_text\">\n" +
                    "                        <h3>" + value.nameStore + " </h3>\n" +
                    "                            <p class=\"about_text1\">\n" +
                    "                                " + value.address + "     </p>\n" +
                    "                            <p class=\"about_text2\">\n" +
                    value.description + " </p>\n" +
                    "                             </p>\n" +
                    "                            <a href=\"menu.html?idStore="+value.id+"\" class=\"boxed_btn\">Xem menu</a>\n" +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "    </div>");
            } else {
                containerStore.append("<div class=\"single_about_area\">\n" +
                    "        <div class=\"container\">\n" +
                    "            <div class=\"row align-items-center\">\n" +
                    "                <div class=\"col-xl-5 col-lg-5\">\n" +
                    "                    <div class=\"single_about_text\">\n" +
                    "                        <h3>" + value.nameStore + "</h3>\n" +
                    "                            <p class=\"about_text1\">\n" +
                    "                                " + value.address + "     </p>\n" +                 "                            <p class=\"about_text2\">\n" +
                    value.description + " </p>\n" +

                    "                            <a href=\"menu.html?idStore="+value.id+"\" class=\"boxed_btn\">Xem Menu</a>\n" +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "                <div class=\"col-xl-6 offset-xl-1 col-lg-6 offset-lg-1\">\n" +
                    "                    <div class=\"single_about_thumb thumb_n1\">\n" +
                    "                        <img src=\"" + value.image + "\" alt=\"\">\n" +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "    </div>");
            }
        });
    }

})(jQuery);
