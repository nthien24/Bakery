var User = (function () {

    let editMode = "Edit";
    let deleteMode = "Delete";
    $('#btnCreateUser').on('click', (function (e) {
        createUser();
    }));

    function initScreen() {
        if (!sessionStorage.getItem("tokenAdmin")) {
            window.location.href = "login/index.html";
        }
        $.blockUI({ message: '<h1><img src="busy.gif" /> Just a moment...</h1>' });
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": base_url + "/users/",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "Authorization": "Bearer " + sessionStorage.getItem("tokenAdmin")
            },
            "processData": false
        };

        $.ajax(settings).done(function (response) {
            $.unblockUI();
            parseDataToHtml(response);
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
        let containerUser = $('#containerUsers');
        containerUser.empty();
        $.each(data, function (index, value) {
            containerUser.append("  <tr class=\"tr-shadow\">\n" +
                "<td onclick=\"edit(" + value.id + ")\">" + value.id + "</td>\n" +
                "                                                <td>" + processString(value.name) + "</td>\n" +
                "                                                <td>" + processString(value.email) + "</td>\n" +
                "                                                <td>" + processString(value.phone) + "</td>\n" +
                "                                                <td>\n" +
                "                                                    <span class=\"block-email\">" + processString(value.role) + "</span>\n" +
                "                                                </td>\n" +
                "                                                <td>\n" +
                "                                                    <div class=\"table-data-feature\">\n" +
                "                                                   \<button onclick=\"User.showModalEdit(" + value.id + ")\" class=\"item containerProcess\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\">\n" +
                "                                                            <i class=\"zmdi zmdi-edit\"></i>\n" +
                "                                                        </button>\n" +
                "                                                      \<button onclick=\"User.deleteUser(" + value.id + ")\" class=\"item containerProcess\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\">\n" +
                "                                                            <i class=\"zmdi zmdi-delete\"></i>\n" +
                "                                                        </button>\n" +
                "                                                    </div>\n" +
                "                                                </td>\n" +
                "                                            </tr>\n" +
                "                                            <tr class=\"spacer\"></tr>");
        });
    }

    var deleteUser = function (id) {
        Swal.fire({
            title: 'Bạn chắc chắn muốn xóa?',
            text: "Hành động này không thể hoàn tác!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận xóa',
            cancelButtonText: 'Hủy hành động'
        }).then((result) => {
            if (result.value) {
                $.blockUI({ message: '<h1><img src="busy.gif" /> Just a moment...</h1>' });


                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": base_url_admin + "/user/delete/" + id,
                    "method": "DELETE",
                    "headers": {
                        "content-type": "application/json",
                        "cache-control": "no-cache",
                        "Authorization": "Bearer " + sessionStorage.getItem("tokenAdmin"),
                    },
                    "processData": false
                };

                $.ajax(settings).done(function (response) {
                    $.unblockUI();
                    Swal.fire("Thành Công", "Xóa người dùng thành công!", "success").then(
                        function () {


                            initScreen();
                        },
                        function () {
                            return false;
                        });
                }).fail(function (response) {
                    if (response == 401)
                        window.location.href = "login/index.html"
                    if (response != 200) {
                        Swal.fire("Thất bại", "Lỗi tải trang vui lòng thông báo admin!", "error");
                    }

                }).always(function () {
                    $.unblockUI();
                });
            }
        })

    }
    function processString(text) {
        if (text != null && text.length > 30) {
            return text.substring(0, 30) + "...";
        }
        return text;
    }

    var edit = function (id) {
        axios
            .get(base_url + "/users/" + id, {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
                },
            })
            .then((response) => {
                var user = response.data;
                var html = "<input placeholder=\"Tên người dùng..\" value=\"" + user.name + "\" id=\"name\" class=\"swal2-input\">" +
                    "<input placeholder=\"Email..\" id=\"email\"  value=\"" + user.email + "\" class=\"swal2-input\">" +
                    "<input placeholder=\"Địa chỉ..\" id=\"address\" value=\"" + user.address + "\" class=\"swal2-input\">" +
                    "<input placeholder=\"Số điện thoại..\" id=\"phone-number\" value=\"" + user.phone + "\" type=\"text\" class=\"swal2-input\">" +
                    "<input placeholder=\"Ngày tháng năm sinh..\" id=\"birthDay\" value=\"" + user.birthDay + "\" type=\"date\" class=\"swal2-input\">" +
                    "<select placeholder=\"Ngày tháng năm sinh..\" id=\"role\" value=\"" + user.role + "\" class=\"swal2-input\">" +
                    "<option value=\"ADMIN\" >" +
                    "<option value=\"USER\" >" +
                    "</select>" +
                    "<p style=\"visibility: hidden ; color:red \"  id=\"textAlert\">Vui lòng nhập đủ dữ liệu</p>"
                Swal.fire({
                    title: 'Submit your User infomation',
                    html: html,

                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        if ($("#name").val().trim() == "" || $("#email").val().trim() == "" || $("#address").val().trim() == "" || $("#birthDay").val().trim() == "" || $("#phone-number").val().trim() == "") {
                            $('#textAlert').css("visibility", "visible");
                            return;
                        }
                        let data = {
                            id: user.id,
                            name: $("#name").val(),
                            email: $("#email").val(),
                            address: $("#address").val(),
                            birthDay: $("#birthDay").val(),
                            phone: $("#phone-number").val(),
                            role: $("#role").val()
                        };


                        let settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": base_url + "/users/",
                            "method": "PUT",
                            "headers": {
                                "content-type": "application/json",
                                "cache-control": "no-cache",
                                "Authorization": "Bearer " + sessionStorage.getItem("tokenAdmin"),
                            },
                            "processData": false,
                            data: JSON.stringify(data)
                        };

                        return $.ajax(settings).done(function (response) {
                            $.unblockUI();
                        }).fail(function (response) {
                            if (response != 200) {
                                swal("Thất bại", "Lỗi tải trang vui lòng thông báo admin!", "error");
                            }

                        }).always(function () {
                            $.unblockUI();
                        });

                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then((result) => {
                    if (result.dismiss) {
                        return;
                    }
                    if (result.value == "Cập nhật người dùng thất bại") {
                        Swal.fire(
                            'Thất bại',
                            'Lỗi Cập nhật người dùng vui lòng thông báo admin!',
                            'error'
                        );
                        swal("Thất bại", "", "error");
                    } else {
                        Swal.fire(
                            'Thành công !',
                            'Cập nhật người dùng thành công',
                            'success'
                        ).then(
                            function () {


                                initScreen();
                            },
                            function () {
                                return false;
                            });
                    }

                });

            })
            .catch((error) => {
                if (error.response.status == 401)
                    window.location.href = "login/index.html"
            })
            .finally(function () {
            });

    };
    var $modal = null;
    var curentId = 0;

    var MODES = {
        UPDATE: 1,
        CREATE: 0
    };
    var currentMode = MODES.CREATE;
    function renderModal(user) {

        var html = `
                <div class="modal fade" id="staticModal" tabindex="-1" role="dialog" aria-labelledby="staticModalLabel" aria-hidden="true" data-backdrop="static">
                    <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <form class="registerForm">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticModalLabel">Đăng kí tài khoản</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="firstName" class="form-control-label">Họ</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="firstName" name="firstName"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="lastName" class="form-control-label">Tên</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="lastName" name="lastName"  class="form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="birthDay" class=" form-control-label">Sinh nhật</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="date" id="birthDay" name="birthDay"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="phone" class=" form-control-label">Số điện thoại</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="tel" id="phone" name="phone"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="email" class=" form-control-label">Địa chỉ Email</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="email" id="email" name="email"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                    
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="address" class=" form-control-label">Địa chỉ</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="address" name="address"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="role" class=" form-control-label">Role</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <select type="text" id="role" name="role"  class="input-sm form-control-sm form-control">
                                                <option value="ADMIN">ADMIN</option>
                                                <option selected value="USER">USER</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="password" class=" form-control-label">Nhập mật khẩu</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="password" id="password" name="password"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="passwordAgain" class=" form-control-label">Nhập lại mật khẩu</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="password" id="passwordAgain" name="passwordAgain"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy bỏ</button>
                                <button type="submit" class="btn btn-primary ok-button">Tạo mới</button>
                            </div>
                        </form> 
                    </div>
                </div>
            </div>`;
        Base.renderModal({
            id: "staticModal",
            html,
            rendered: function ($_modal) {
                $modal = $_modal;
                setValidator($modal.find(".registerForm"));
            },
        });
    }
    function setValidator($form) {
        const rules = {
            firstName: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                }
            },
            lastName: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                }
            },
            birthDay: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                    callback: {
                        message: Base.VALIDATE_MESG.NOT_INCORRECTLY,
                        callback: function (date) {
                            var myDate = new Date(date);
                            var today = new Date();
                            return myDate <= today;
                        }
                    }
                }
            },
            phone: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                    callback: {
                        message: Base.VALIDATE_MESG.NOT_INCORRECTLY,
                        callback: function (phoneNumber) {
                            var found = phoneNumber.search(/^(\+{1}\d{2,3}\s?[(]{1}\d{1,3}[)]{1}\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}$/);
                            return found > -1;
                        }
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                    emailAddress: {
                        message: Base.VALIDATE_MESG.EMAIL_INCORRECTLY
                    }
                }
            },
            address: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                    identical: {
                        field: 'passwordAgain',
                        message: Base.VALIDATE_MESG.PASSWORD_INCORRECTLY
                    }
                }
            },
            passwordAgain: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                    identical: {
                        field: 'password',
                        message: Base.VALIDATE_MESG.PASSWORD_INCORRECTLY,
                    }
                }
            },
        };
        Base.setValidator($form, rules, {
            isReset: false,
            successCallBack: function () {

                let data = {
                    id: curentId,
                    name: $("#firstName").val() + " " + $("#lastName").val(),
                    birthDay: $("#birthDay").val(),
                    phone: $("#phone").val(),
                    email: $("#email").val(),
                    address: $("#address").val(),
                    password: $("#password").val(),
                    role: $("#role").val()
                };
                if (currentMode === MODES.UPDATE) {
                    editUser(data, function () {
                        $form.trigger("reset");
                    });
                    return;
                }
                create(data, function () {
                    $form.trigger("reset");
                });
            },
        });
    }
    function create(data, successCallback) {
        Base.sendApi({
            isShowSwal: true,
            url: base_url + "/users/create",
            data: data,
            method: Base.constant.METHOD_POST,
            onSuccess: function (data) {
                $modal.modal('hide');
                successCallback();
                initScreen();
            }
        })
    }
    function editUser(data, successCallback) {
        Base.sendApi({
            isShowSwal: true,
            url: base_url + "/users/",
            data: data,
            method: Base.constant.METHOD_PUT,
            onSuccess: function (data) {
                $modal.modal('hide');
                successCallback();
                initScreen();
            }
        })
    }
    function showModalCreate() {
        currentMode = MODES.CREATE;
        var $form = $modal.find(".registerForm");
        $form.trigger('reset');
        $form.find('.ok-button').text("Tạo mới");
        $form.find('.modal-title').text("Đăng kí tài khoản");
        $modal.modal('show');

    }
    function showModalEdit(id) {
        var $form = $modal.find(".registerForm");
        $form.trigger('reset');
        $form.find('.ok-button').text("Cập nhật");
        $form.find('.modal-title').text("Cập nhật tài khoản");
        curentId = id;
        currentMode = MODES.UPDATE;
        Base.sendApi({
            url: base_url + "/users/" + curentId,
            onSuccess: function (user) {
                if (user) {
                    $("#firstName").val(user.name.split(" ")[0]);
                    $("#lastName").val(user.name.split(" ")[1] === undefined ? user.name : user.name.split(" ")[1]);
                    $("#birthDay").val(user.birthDay);
                    $("#phone").val(user.phone);
                    $("#email").val(user.email);
                    $("#address").val(user.address);
                    $("#role").val(user.role);
                    $("#password").val('notchange');
                    $("#passwordAgain").val('notchange');
                }
            }
        });

        $modal.modal('show');
    }
    renderModal();
    initSearch();
    function initSearch() {
        $('.input-search').on('change', function (e) {
            var keyword = $(this).val();
            if (!keyword) {
                initScreen();
                return;
            }
        });
    }
    function search() {
        var email = $('.input-search').val();
        Base.sendApi({
            url: base_url + "/users/find-by-email/" + email,
            onSuccess: function (data) {
                parseDataToHtml(data);
            }
        })
    }

    return {
        deleteUser: deleteUser,
        showModalCreate: showModalCreate,
        showModalEdit: showModalEdit,
        search: search
    }
})();
