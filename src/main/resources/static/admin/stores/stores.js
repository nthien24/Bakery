var Store = (function ($) {
    let editMode = "Edit";
    let deleteMode = "Delete";
    $("#btnCreateStore").on("click", function (e) {
        createStore();
    });

    function initScreen() {
        if (!sessionStorage.getItem("tokenAdmin")) {
            window.location.href = "login/index.html";
        }
        $.blockUI({
            message: '<h1><img src="busy.gif" /> Just a moment...</h1>',
        });

        email = $("#email").val();
        password = $("#password").val();

        var settings = {
            async: true,
            crossDomain: true,
            url: base_url + "/providers/",
            method: "GET",
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
            processData: false,
        };

        $.ajax(settings)
            .done(function (response) {
                $.unblockUI();
                parseDataToHtml(response);
            })
            .fail(function (response) {
                if (response != 200) {
                    swal(
                        "Thất bại",
                        "Lỗi tải trang vui lòng thông báo admin!",
                        "error"
                    );
                }
            })
            .always(function () {
                $.unblockUI();
            });
    }

    initScreen();

    function parseDataToHtml(arrData) {
        let data = [];
        data = arrData;
        let containerStore = $("#containerStores");
        containerStore.empty();
        $.each(data, function (index, value) {
            containerStore.append(
                '  <tr class="tr-shadow">\n' +
                    "                                                <td>" +
                    processString(value.nameStore) +
                    "</td>\n" +
                    '                                                <td >' +
                    processString(value.address) +
                    "</td>\n" +
                    '                                                <td class="desc">' +
                    processString(value.description) +
                    "</td>\n" +
                    "                                                \n" +
                    "                                                <td>\n" +
                    '                                                    <div class="table-data-feature">\n' +
                    '                                                        <button id="' +
                    value.id +
                    '" class="item containerProcess" data-toggle="tooltip" data-placement="top" onclick="Store.showForEdit('+value.id+')" title="Edit">\n' +
                    '                                                            <i class="zmdi zmdi-edit"></i>\n' +
                    "                                                        </button>\n" +
                    '                                                        <button id="' +
                    value.id +
                    '" class="item containerProcess" data-toggle="tooltip" data-placement="top" onclick="Store.delete('+value.id+')" title="Delete">\n' +
                    '                                                            <i class="zmdi zmdi-delete"></i>\n' +
                    "                                                        </button>\n" +
                    "                                                    </div>\n" +
                    "                                                </td>\n" +
                    "                                            </tr>\n" +
                    '                                            <tr class="spacer"></tr>'
            );
        });
    }

    function editStore(id) {
        let data = {
            idStore: id,
            nameStore: $("#name").val(),
            description: $("#description").val(),
            address: $("#address").val(),
            image: $("#image").val(),
        };
        Base.sendApi({
            isShowSwal: true,
            url: base_url_admin + "/providers/edit",
            method: Base.constant.METHOD_PUT,
            data : data,
            onSuccess:function(){
                $modal.modal('hide');
                initScreen();
            }
        });
    }

    function deleteStore(id) {
        Base.sendApi({
            isShowSwal: true,
            url: base_url_admin + "/providers/delete/" + id,
            method: Base.constant.METHOD_DELETE,
            onSuccess:function(){
                initScreen();
            }
        });
    }

    function processString(text) {
        if (text && text.length > 30) {
            return text.substring(0, 30) + "...";
        }
        return text;
    }
    
    var MODES= {
        UPDATE : 1,
        CREATE :0
    }
    var currentMode= MODES.CREATE;
    var $modal = null;
    var curentId = 0;
    
    function renderModal(){
        var html = `
                <div class="modal fade" id="staticModal" tabindex="-1" role="dialog" aria-labelledby="staticModalLabel" aria-hidden="true" data-backdrop="static">
                    <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <form class="registerForm">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticModalLabel">Đăng kí nhà cung cấp</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="name" class="form-control-label">Tên nhà cung cấp</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="name" name="name"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                     <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="address" class="form-control-label">Địa chỉ nhà cung cấp</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="address" name="address"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="description" class=" form-control-label">Chú thích</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="description" name="description"  class="form-control">
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
                setValidator($modal.find(".registerForm"),$modal);
            },
        });
    }
    renderModal();
    function showForCreate(){
        $modal.find('.ok-button').text('Tạo mới');
        $modal.find('.modal-title').text('Đăng kí nhà cung cấp');
        currentMode = MODES.CREATE;
        $modal.modal('show');
    }
    function showForEdit(id){
        currentMode = MODES.UPDATE;
        curentId = id;
        Base.sendApi({
            url: base_url + "/providers/"+id,
            onSuccess:function(data){
                $modal.find('.ok-button').text('Cập nhật');
                $modal.find('.modal-title').text('Cập nhật nhà cung cấp');
                $modal.find("#name").val(data.nameStore);
                $modal.find("#description").val(data.description);
                $modal.find("#address").val(data.address);
                $modal.find("#image").val(data.image);
                $modal.modal('show');
            }
        });
    }
    function create(data) {
        Base.sendApi({
            isShowSwal: true,
            url: base_url + "/admin/providers/create",
            data: data,
            method: Base.constant.METHOD_POST,
            onSuccess:function(){
                $modal.modal('hide');
                initScreen();
            },
            onFailed:function(msg){
                console.log(msg);
            }
        });
    }
    function setValidator($form,$modal) {
        var rules = {
            name: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                }
            },
            address: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                }
            },
        };
        Base.setValidator($form,rules,{
            successCallBack: function(){
                if(currentMode === MODES.UPDATE){
                    editStore(curentId);
                    return;
                }
                let data = {
                    nameStore: $("#name").val(),
                    description: $("#description").val(),
                    address: $("#address").val(),
                    image: $("#image").val(),
                };
                create(data);
            }
        });
    }
    return {
        showModal :renderModal,
        showForCreate:showForCreate,
        delete: deleteStore,
        showForEdit:showForEdit
    }
})(jQuery);
