var News = (function () {
    
    var $modal = null;
    var MODES={
        CREATE : 0,
        UPDATE:1
    };
    renderModal();
    function renderModal() {
        var html = `
                <div class="modal fade" id="staticModal" tabindex="-1" role="dialog" aria-labelledby="staticModalLabel" aria-hidden="true" data-backdrop="static">
                    <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <form class="registerForm">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticModalLabel">Tạo bài viết mới</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                    <div class="row form-group">
                                        <input type="hidden" id="mode">
                                        <input type="hidden" id="id-new">
                                        <div class="col col-sm-3">
                                            <label for="title" class="form-control-label">Tiêu đề</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="title" name="title"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="input-normal" class=" form-control-label">Nội dung</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="content" name="content"  class="form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="input-large" class=" form-control-label">Đường dẫn hình ảnh</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="image" name="image"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy bỏ</button>
                                <button type="button" class="btn btn-primary ok-button">Tạo mới</button>
                            </div>
                        </form> 
                    </div>
                </div>
            </div>`;
            
        Base.renderModal({
            id: "staticModal",
            html,
            okCallback: function () {
                $modal.find(".ok-button").trigger("submit");
            },
            rendered: function ($_modal) {
                $modal = $_modal;
                setValidator($modal.find(".registerForm"));
            },
        });
    }
    function showModal(type,id){
        $modal.find('#mode').val(type);
        if(MODES.UPDATE){
            renderModalEditNew(id);
        }
        renderModalCreateNew();
        $modal.modal("show");

    }
    function renderModalCreateNew() {
        $modal.find('.ok-button').text('Tạo mới');
        $modal.find('.modal-title').text('Tạo mới bài viết');
    }
    function renderModalEditNew(id) {
        Base.sendApi({
            url: base_url + "/news/" + id,
            onSuccess: function (data) {
                $modal.find('#id-new').val(data.id);
                $modal.find('.ok-button').text('Cập nhật');
                $modal.find('.modal-title').text('Cập nhật tin tức');
                $modal.find('#title').val(data.title);
                $modal.find('#content').val(data.content);
                $modal.find('#image').val(data.urlImage);
                $modal.modal('show');
            }
        });
    }
    function create(data) {
        Base.sendApi({
            isShowSwal: true,
            url: base_url + "/news/",
            data: data,
            method: Base.constant.METHOD_POST,
            onSuccess : function(){
                $modal.modal('hide');
                loadPage();
            }
        });
    }
    loadPage();
    function loadPage() {
        Base.sendApi({
            url: base_url + "/news/",
            onSuccess: function (data) {
                renderPage(data);
            },
        });
    }
    function renderPage(news) {
        var html = "";
        var $ctn = $("#containerStores");
        news.forEach((element) => {
            html+="<tr class=\"tr-shadow\">\n" +
                "                                                <td>"+Base.processString(element.title) +"</td>\n" +
                "                                                <td class=\"desc\">"+Base.processString(element.content) +"</td>\n" +
                "                                                <td>"+Base.processString(element.urlImage) +"</td>\n" +
                "                                                \n" +
                "                                                <td>\n" +
                "                                                    <div class=\"table-data-feature\">\n" +
                "                                                        <button data-id=\"118\" class=\"item containerProcess\" onclick=\"News.showModal(1,"+element.id+")\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Edit\">\n" +
                "                                                            <i class=\"zmdi zmdi-edit\"></i>\n" +
                "                                                        </button>\n" +
                "                                                        <button data-id=\"118\" class=\"item containerProcess\" onclick=\"News.deleteNew("+element.id+")\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\">\n" +
                "                                                            <i class=\"zmdi zmdi-delete\"></i>\n" +
                "                                                        </button>\n" +
                "                                                    </div>\n" +
                "                                                </td>\n" +
                "                                            </tr>";
        });
        $ctn.empty();
        $ctn.append(html);
    }
    function setValidator($form) {
        var rules = {
            title: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                }
            },
            content: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                }
            },
            image: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    }
                }
            },
        };
        Base.setValidator($form,rules,{
            successCallBack : function(){
                var data = {
                    id: $modal.find("#id-new").val(),
                    title: $modal.find("#title").val(),
                    content: $modal.find("#content").val(),
                    urlImage: $modal.find("#image").val(),
                };
                if(+$modal.find('#mode').val() === MODES.CREATE){
                    create(data);
                    return;
                }
                editNew(data);
            }
        });
        
    }
    function deleteNew(id) {
        Base.sendApi({
            url: base_url + "/news/" + id,
            method: Base.constant.METHOD_DELETE,
            isShowSwal: true,
            onDone: function () {
                loadPage();
            },
        });
    }
    function editNew(data) {
        Base.sendApi({
            url: base_url + "/news/",
            data:data,
            method: Base.constant.METHOD_PUT,
            isShowSwal: true,
            onDone: function () {
                $modal.modal('hide');
                loadPage();
            },
        });
    }
    return {
        showModal: showModal,
        deleteNew:deleteNew,
    };
})();
