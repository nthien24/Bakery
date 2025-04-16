var Base = (function () {
    // let base_url = "http://52.43.108.161:8181/";
    let base_url = "http://127.0.0.1:8080";
    let base_url_admin = base_url + "/admin";

    const constant = {
        METHOD_GET: 'GET',
        METHOD_POST: 'POST',
        METHOD_DELETE: 'DELETE',
        METHOD_PUT: 'PUT',
    };
    const VALIDATE_MESG = {
        DO_NOT_EMPTY: "Bắt buộc nhập",
        EMAIL_INCORRECTLY: "Mail không đúng định dạng",
        PASSWORD_INCORRECTLY: "Mật khẩu không khớp",
        NOT_INCORRECTLY: "Không đúng định dạng",
    };
    function createNavigator() {
        let navigator = $("#navigator");
        navigator.append(
            '<div class="menu-sidebar__content js-scrollbar1">\n' +
            '                <nav class="navbar-sidebar">\n' +
            '                    <ul class="list-unstyled navbar__list">\n' +
            "                       <li >\n" +
            '                            <a href="news.html">\n' +
            '                                <i class="fas fa-table"></i>Tin tức</a>\n' +
            "                        </li>\n" +
            "                        <li >\n" +
            '                            <a href="stores.html">\n' +
            '                                <i class="fas fa-table"></i>Nhà cung cấp</a>\n' +
            "                        </li>\n" +
            "                        <li >\n" +
            '                            <a href="product.html">\n' +
            '                                <i class="fas fa-table"></i>Sản phẩm</a>\n' +
            "                        </li>\n" +
            "                        <li>\n" +
            '                            <a href="users.html">\n' +
            '                                <i class="fas fa-table"></i>Người dùng</a>\n' +
            "                        </li>\n" +
            "                        <li>\n" +
            '                            <a href="orders.html">\n' +
            '                                <i class="fas fa-table"></i>Đơn hàng</a>\n' +
            "                        </li>\n" +
            "                        <li>\n" +
            '                            <a href="statistical-product.html">\n' +
            '                                <i class="fas fa-table"></i>Thống kê sản phẩm</a>\n' +
            "                        </li>\n" +
            "                        <li>\n" +
            '                            <li class="has-sub">\n' +
            '                            <a class="js-arrow open" href="#">\n' +
            '                                <i class="fas fa-copy"></i>Thống kê doanh thu</a>\n' +
            '                            <ul class="list-unstyled navbar__sub-list js-sub-list">\n' +
            "                                <li>\n" +
            '                                    <a href="statistical-order.html">Thống kê</a>\n' +
            "                                </li>\n" +
            "                                <li>\n" +
            '                                    <a href="statistical-chart.html">Biểu đồ</a>\n' +
            "                                </li>\n" +
            "                            </ul>\n" +
            "                        </li>" +
            "                        </li>\n" +
            "                    </ul>\n" +
            "                </nav>\n" +
            "            </div>"
        );
    }
    SublistSidebar();
    createNavigator();
    function checkAuthen() {
        if (!sessionStorage.getItem("tokenAdmin")) {
            window.location.href = "login/index.html";
        }
        sendApi({
            url: base_url + "/requireToken",
            method: constant.METHOD_POST,
            onFailed: function (data) {
                if (data.response.status === 401) {
                    // console.log("u need to login");
                    window.location.href = "login/index.html";
                }
            }
        });
    }
    checkAuthen();
    // Sublist Sidebar
    function SublistSidebar() {
        try {
            var arrow = $(".js-arrow");
            arrow.each(function () {
                var that = $(this);
                that.on("click", function (e) {
                    e.preventDefault();
                    that.find(".arrow").toggleClass("up");
                    that.toggleClass("open");
                    that.parent().find(".js-sub-list").slideToggle("250");
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    var PAGE_ALLOW_TO_SEARCH = ['user.html', 'product.html', 'orders.html'];

    function createHeader() {
        var html = `<header class="header-desktop">
             <div class="section__content section__content--p30">
                 <div class="container-fluid">
                     <div class="header-wrap">
                         
                         <div class="header-button">
                             <div class="account-wrap">
                                 <div class="account-item clearfix js-item-menu">
                                     <div class="image">
                                         <img src="images/icon/avatar-01.jpg" alt="Admin" />
                                     </div>
                                     <div class="content">
                                         <a class="js-acc-btn" href="#">Admin</a>
                                     </div>
                                     <div class="account-dropdown js-dropdown">
                                         <div class="info clearfix">
                                             <div class="image">
                                                 <a href="#">
                                                     <img src="images/icon/avatar-01.jpg" alt="Admin" />
                                                 </a>
                                             </div>
                                             <div class="content">
                                                 <h5 class="name">
                                                     <a href="#">admin</a>
                                                 </h5>
                                                 <span class="email">admin@example.com</span>
                                             </div>
                                         </div>
                                         <div class="account-dropdown__body">
                                             <div class="account-dropdown__item">
                                                 <a href="#">
                                                     <i class="zmdi zmdi-account"></i>Account</a>
                                             </div>
                                             <div class="account-dropdown__item">
                                                 <a href="#">
                                                     <i class="zmdi zmdi-settings"></i>Setting</a>
                                             </div>
                                             <div class="account-dropdown__item">
                                                 <a href="#">
                                                     <i class="zmdi zmdi-money-box"></i>Billing</a>
                                             </div>
                                         </div>
                                         <div class="account-dropdown__footer">
                                             <a onclick="logout">
                                                 <i class="zmdi zmdi-power"></i>Haha</a>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </header>`;
        PAGE_ALLOW_TO_SEARCH.forEach(function (page) {
            if (location.href.includes(page)) {
                html = `<header class="header-desktop">
                         <div class="section__content section__content--p30">
                             <div class="container-fluid">
                                 <div class="header-wrap">
                                     <form class="form-header" action="" method="POST">
                                         <input class="au-input au-input--xl" type="text" name="search" placeholder="Tìm kiếm người dùng, sản phẩm, đơn hàng..." />
                                         <button class="au-btn--submit" type="submit">
                                             <i class="zmdi zmdi-search"></i>
                                         </button>
                                     </form>
                                     <div class="header-button">
                                         <div class="account-wrap">
                                             <div class="account-item clearfix js-item-menu">
                                                 <div class="image">
                                                     <img src="images/icon/avatar-01.jpg" alt="Admin" />
                                                 </div>
                                                 <div class="content">
                                                     <a class="js-acc-btn" href="#">Admin</a>
                                                 </div>
                                                 <div class="account-dropdown js-dropdown">
                                                     <div class="info clearfix">
                                                         <div class="image">
                                                             <a href="#">
                                                                 <img src="images/icon/avatar-01.jpg" alt="Admin" />
                                                             </a>
                                                         </div>
                                                         <div class="content">
                                                             <h5 class="name">
                                                                 <a href="#">admin</a>
                                                             </h5>
                                                             <span class="email">admin@example.com</span>
                                                         </div>
                                                     </div>
                                                     <div class="account-dropdown__body">
                                                         <div class="account-dropdown__item">
                                                             <a href="#">
                                                                 <i class="zmdi zmdi-account"></i>Account</a>
                                                         </div>
                                                         <div class="account-dropdown__item">
                                                             <a href="#">
                                                                 <i class="zmdi zmdi-settings"></i>Setting</a>
                                                         </div>
                                                         <div class="account-dropdown__item">
                                                             <a href="#">
                                                                 <i class="zmdi zmdi-money-box"></i>Billing</a>
                                                         </div>
                                                     </div>
                                                     <div class="account-dropdown__footer">
                                                         <a onclick="logout">
                                                             <i class="zmdi zmdi-power"></i>Haha</a>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </header>`;
            }
        });
        $("#header").append(
            html
        );
    }

    createHeader();
    function logout() {
        sessionStorage.removeItem("tokenAdmin");
        window.location.href = "login/index.html";
    }
    function resetForm(data) {
        if (Array.isArray(data)) {
            data.length = 0;
        }
        // ex : this.data.form
        Object.keys(data).forEach(function (key, index) {
            data[key] = '';
        });
    }
    function createHeaderButton() {
        var token = JSON.parse(sessionStorage.getItem("user"));
        $('#header-button').append(
            " <div class=\"account-wrap\">\n" +
            "                                    <div class=\"account-item clearfix js-item-menu\">\n" +
            "                                        <div class=\"image\">\n" +
            "                                            <img src=\"images/icon/avatar-01.jpg\" alt=\"Admin\" />\n" +
            "                                        </div>\n" +
            "                                        <div class=\"content\">\n" +
            "                                            <a class=\"js-acc-btn\" href=\"#\">Admin</a>\n" +
            "                                        </div>\n" +
            "                                        <div class=\"account-dropdown js-dropdown\">\n" +
            "                                            <div class=\"info clearfix\">\n" +
            "                                                <div class=\"image\">\n" +
            "                                                    <a href=\"#\">\n" +
            "                                                        <img src=\"images/icon/avatar-01.jpg\" alt=\"Admin\" />\n" +
            "                                                    </a>\n" +
            "                                                </div>\n" +
            "                                                <div class=\"content\">\n" +
            "                                                    <h5 class=\"name\">\n" +
            "                                                        <a href=\"#\">" + token.user.name + "</a>\n" +
            "                                                    </h5>\n" +
            "                                                    <span class=\"email\">" + token.user.email + "</span>\n" +
            "                                                </div>\n" +
            "                                            </div>\n" +
            "                                            <div class=\"account-dropdown__body\">\n" +
            "                                            </div>\n" +
            "                                            <div class=\"account-dropdown__footer\">\n" +
            "                                                <a onclick=\"Base.logout()\">\n" +
            "                                                    <i class=\"zmdi zmdi-power\"></i>Logout</a>\n" +
            "                                            </div>\n" +
            "                                        </div>\n" +
            "                                    </div>\n" +
            "                                </div>"

        )
    }
    function sendApi({ url, method = constant.METHOD_GET, data, onDone = function () { }, onSuccess = function () { }, onFailed = function () { }, isShowSwal = false }) {
        switch (method) {
            case constant.METHOD_GET: {
                axios
                    .get(url, {
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
                        },
                    })
                    .then((response) => {
                        if (isShowSwal) {
                            swal("Thành Công", "Thao tác thành công!", "success");
                        }
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        if (isShowSwal) {
                            swal("Thất bại", "Thao tác thất bại", "error");
                        }
                        onFailed(error);
                    })
                    .finally(function (event) {

                        onDone();
                    });
                break;
            }
            case constant.METHOD_POST: {
                axios
                    .post(url, data, {
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
                        },
                    })
                    .then((response) => {
                        if (isShowSwal) {
                            swal("Thành Công", "Thao tác thành công!", "success");
                        }
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        if (isShowSwal) {
                            swal("Thất bại", "Thao tác thất bại", "error");;
                        }
                        onFailed(error);
                    })
                    .finally(function (event) {
                        onDone();
                    });
                break;
            }
            case constant.METHOD_DELETE: {
                axios
                    .delete(url, {
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
                        },
                    })
                    .then((response) => {
                        if (isShowSwal) {
                            swal("Thành Công", "Thao tác thành công!", "success");
                        }
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        if (isShowSwal) {
                            swal("Thất bại", "Thao tác thất bại", "error");;
                        }
                        onFailed(error);
                    })
                    .finally(function (event) {

                        onDone();
                    });
                break;
            }
            case constant.METHOD_PUT: {
                axios
                    .put(url, data, {
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
                        },
                    })
                    .then((response) => {
                        if (isShowSwal) {
                            swal("Thành Công", "Thao tác thành công!", "success");
                        }
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        if (isShowSwal) {
                            swal("Thất bại", "Thao tác thất bại", "error");;
                        }
                        onFailed(error);
                    })
                    .finally(function (event) {
                        onDone();
                    });
                break;
            }
        }
    }
    function resetData(object) {
        //Iterate through each object field, key is name of the object field`
        Object.keys(object).forEach(function (key, index) {
            object[key] = '';
        });
    }
    function renderModal(ops) {
        var html = ops.html;
        $('body').append(html);
        var modal = $("#" + ops.id);
        ops.rendered(modal);
        modal.find('.ok-button').click(function () {
            if (ops.okCallback) {
                ops.okCallback();
            }
        });
        modal.on('hidden.bs.modal', function (e) {
            if (ops.cancelCallBack) {
                ops.cancelCallBack();
            }
        });
        // $(html).find('#staticModal').modal('show');
    }
    function processString(text) {
        if (text && text.length > 30) {
            return text.substring(0, 30) + "...";
        }
        return text;
    }
    function setValidator($form, rules, options) {
        options = $.extend({}, options);
        var feedbackIcons = {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'fa fa-exclamation',
            validating: 'glyphicon glyphicon-refresh'
        };
        if (options.no_icon) {
            feedbackIcons = false;
        }
        $form.bootstrapValidator({
            fields: rules,
            feedbackIcons: feedbackIcons
        }).on('reset', function () {
            $form.data('bootstrapValidator').resetForm(true);
        }).on('success.form.bv', function (e) {
            e.preventDefault();
            if (options && options.successCallBack) {
                options.successCallBack();
                if (options.isReset == null || options.isReset === true) {
                    $form.trigger("reset");
                }
            }
        }).on('submit_error', function (ev, errors) {
            errors = errors['errors'];
            var bv = $form.data('bootstrapValidator');
            $.each(errors, function (index, error) {
                if (error['field'] !== '') {
                    bv.updateMessage(error['field'], 'blank', error['message']);
                    bv.updateStatus(error['field'], 'INVALID', 'blank');
                }
            });
        })
    }
    function doFormatMoney(value) {
        var data = parseInt(value);
        return data.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
        });
    }
    const isInputNumberBiggerThanZero = (value) => (value > 0);
    return {
        renderModal: renderModal,
        createHeaderButton: createHeaderButton,
        logout: logout,
        sendApi: sendApi,
        resetData: resetData,
        constant: constant,
        setValidator: setValidator,
        VALIDATE_MESG: VALIDATE_MESG,
        isInputNumberBiggerThanZero: isInputNumberBiggerThanZero,
        resetForm: resetForm,
        processString: processString,
        doFormatMoney: doFormatMoney
    }
})();
