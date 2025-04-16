var Product = (function ($) {
    "use strict";
    var MODES = {
        CREATE: 0,
        UPDATE: 1
    };
    var $modal = null;
    var $modalImportProduct = null;
    var $modalExportProduct = null;
    var modesExIm = {
        IMPORT: 0,
        EXPORTL: 1
    };
    function renderModalCreateProduct() {
        var html = `
                <div class="modal fade" id="staticModal" tabindex="-1" role="dialog" aria-labelledby="staticModalLabel" aria-hidden="true" data-backdrop="static">
                    <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <form class="registerForm">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticModalLabel">Tạo sản phẩm mới</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                        <input type="hidden" id="mode">
                                        <input type="hidden" id="id-new">
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="name" class="form-control-label">Tên sản phẩm</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="name" name="name"  class="input-sm form-control-sm form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="price" class=" form-control-label">Giá bán sản phẩm (Đồng)</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="number" id="price" name="price"  class="form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="realPrice" class=" form-control-label">Giá nhập sản phẩm (Đồng)</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="number" id="realPrice" name="realPrice"  class="form-control">
                                        </div>
                                    </div>
                                     <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="description" class="form-control-label">Chú thích</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="text" id="description" name="description"  class="input-sm form-control-sm form-control">
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
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="quantity" class=" form-control-label">Số lượng</label>
                                        </div>
                                        <div class="col col-sm-6">
                                            <input type="number" id="quantity" name="quantity"  class="input-sm form-control-sm form-control">
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
    function addControl() {
        renderModalCreateProduct();
        renderModalImportProduct();
        renderModalExportProduct();
        loadPage();
    }
    function addEvents() {

    }
    addControl();
    addEvents();
    function setValidator($form) {
        var rules = {
            name: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                    callback: {
                        message: Base.VALIDATE_MESG.NOT_INCORRECTLY,
                        callback: function (input) {
                            return input > -1;
                        }
                    }
                }
            },
            realPrice: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                    callback: {
                        message: Base.VALIDATE_MESG.NOT_INCORRECTLY,
                        callback: function (input) {
                            return input > -1;
                        }
                    }
                }
            },
            image: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    }
                }
            },
            quantity: {
                validators: {
                    notEmpty: {
                        message: Base.VALIDATE_MESG.DO_NOT_EMPTY
                    },
                    callback: {
                        message: Base.VALIDATE_MESG.NOT_INCORRECTLY,
                        callback: function (input) {
                            return input > -1;
                        }
                    }
                }
            },
        };
        Base.setValidator($form, rules, {
            successCallBack: function () {
                var data = {
                    id: $modal.find("#id-new").val(),
                    nameProduct: $modal.find("#name").val(),
                    price: $modal.find("#price").val(),
                    realPrice: $modal.find("#realPrice").val(),
                    description: $modal.find("#description").val(),
                    images: $modal.find("#image").val(),
                    quantity: $modal.find("#quantity").val(),
                };
                if (+$form.find('#mode').val() === MODES.UPDATE) {
                    edit(data);
                }
                else {
                    create(data);
                }
            }
        });
    }

    function create(data) {
        Base.sendApi({
            url: base_url + "/admin/product/",
            data: data,
            method: Base.constant.METHOD_POST,
            isShowSwal: true,
            onDone: function () {
                $modal.modal('hide');
                loadPage();
            }
        });
    }
    function showModalCreateProduct(type, productId) {
        $modal.find('#mode').val(type);
        if (type === MODES.UPDATE) {
            renderModalUpdateProduct(productId)
        }
        renderModalCreate();
    }
    function renderModalCreate() {
        $modal.find('.ok-button').text('Tạo mới');
        $modal.find('.modal-title').text('Tạo mới sản phẩm');
        $modal.modal('show');
    }
    function renderModalUpdateProduct(id) {
        Base.sendApi({
            url: base_url + "/product/find/" + id,
            onSuccess: function (data) {
                $modal.find('#id-new').val(data.id);
                $modal.find('.ok-button').text('Cập nhật');
                $modal.find('.modal-title').text('Cập nhật sản phẩm');
                $modal.find('#name').val(data.nameProduct);
                $modal.find('#price').val(data.price);
                $modal.find('#realPrice').val(data.realPrice);
                $modal.find('#description').val(data.description);
                $modal.find('#image').val(data.images);
                $modal.find('#quantity').val(data.quantity);
                $modal.modal('show');
            }
        });
    }
    function loadPage() {
        Base.sendApi({
            url: base_url + "/product/",
            onSuccess: function (data) {
                renderProducts(data);
            },
        });
    }
    function renderProducts(data) {
        var $ctn = $('#products-ctn');
        $ctn.empty();
        var html = "";
        data.forEach(product => {
            html += "<tr class=\"tr-shadow\">\n" +
                "                                                <td>\n" +
                "                                                    <label class=\"au-checkbox\">\n" +
                "                                                        <input type=\"checkbox\">\n" +
                "                                                        <span class=\"au-checkmark\"></span>\n" +
                "                                                    </label>\n" +
                "                                                </td>\n" +
                "                                                <td>" + product.id + "</td>\n" +
                "                                                <td>\n" +
                "                                                    <span class=\"block-email\">" + Base.processString(product.nameProduct) + "</span>\n" +
                "                                                </td>\n" +
                "                                                <td class=\"desc\">" + Base.doFormatMoney(product.realPrice) + "</td>\n" +
                "                                                <td class=\"desc\">" + Base.doFormatMoney(product.price) + "</td>\n" +
                "                                                <td class=\"desc\">" + product.inStock + "</td>\n" +
                "                                                <td>" + Base.processString(product.description) + "</td>\n" +
                "                                                <td>" + Base.processString(product.images) + "</td>\n" +
                "                                                <td>\n" +
                "                                                    <div class=\"table-data-feature\">\n" +
                "                                                        <button onclick=\"Product.showModalCreateProduct(1," + product.id + ")\" class=\"item containerProcess\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Edit\">\n" +
                "                                                            <i class=\"zmdi zmdi-edit\"></i>\n" +
                "                                                        </button>\n" +
                "                                                        <button  onclick=\"Product.deleteProduct(" + product.id + ")\" class=\"item containerProcess\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\">\n" +
                "                                                            <i class=\"zmdi zmdi-delete\"></i>\n" +
                "                                                        </button>\n" +
                "                                                    </div>\n" +
                "                                                </td>\n" +
                "                                            </tr>";
        });
        $ctn.append(html);
    }
    function renderModalImportProduct() {
        var html = `
                <div class="modal fade" id="staticModalImport" tabindex="-1" role="dialog" aria-labelledby="staticModalLabel" aria-hidden="true" data-backdrop="static">
                    <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <form class="registerForm">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticModalLabel">Phiếu nhập</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="selectInStockStore" class="form-control-label">Nhà cung cấp</label>
                                        </div>
                                        <div class="col-12 col-md-9">
<!--                                            <input type="text" id="name" name="name"  class="input-sm form-control-sm form-control">-->
                                            <select name="providesName"  class="form-control dropdown-providers providerName">
                                                <option selected value="0">Please select</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="name1" class=" form-control-label">Người nhập</label>
                                        </div>
                                        <div class="col-12 col-md-9">
                                            <input type="text" id="name1" name="name1"  class="form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="name2" class=" form-control-label">Người giao</label>
                                        </div>
                                        <div class="col-12 col-md-9">
                                            <input type="text" id="name2" name="name2"  class="form-control">
                                        </div>
                                    </div>
                                     <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="description" class="form-control-label">Tên sản phẩm</label>
                                        </div>
                                        <div class="col-12 col-md-9">
                                                <select  class="form-control dropdown-products">
                                                    <option selected value="0">Please select</option>
                                                </select>
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="quantity" class=" form-control-label">Số lượng</label>
                                        </div>
                                        <div class="col col-md-9">
                                                    <div class="input-group">
                                                        <input type="number" id="quantity" name="quantity" min="1" class="form-control">
                                                        <div class="input-group-btn">
                                                            <button type="button" onclick="Product.addProductToDataImport(0)" class="btn btn-primary">Cập nhật</button>
                                                        </div>
                                                    </div>
                                                
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <input type="hidden" name="data-product-ids">
                                        <div class="col-12">
                                            <div class="table-wrapper-scroll-y my-custom-scrollbar">
                                                            <table class="table table-bordered table-striped mb-0" id="data-order">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Id</th>
                                                                        <th>Tên sản phẩm</th>
                                                                        <th>Số lượng</th>
                                                                        <th>Hành động</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody class="products-import">
                                                                </tbody>
                                                            </table>
                                                        </div>
                                        </div>
                                    </div>
                                </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy bỏ</button>
                                <button type="button" class="btn btn-primary prinft-button">Xuất phiếu</button>
                                <button type="button" class="btn btn-primary ok-button">Nhập hàng</button>
                            </div>
                        </form> 
                    </div>
                </div>
            </div>`;

        Base.renderModal({
            id: "staticModalImport",
            html,
            okCallback: function () {
                importProduct();
            },
            cancelCallBack: function () {
                $modalImportProduct.find('input[name=data-product-ids]').val('');
            },
            rendered: function ($_modal) {
                $modalImportProduct = $_modal;
                renderDropdownProviders(modesExIm.IMPORT);
                renderDropdownProducts(modesExIm.IMPORT);
                $modalImportProduct.find('.prinft-button').click(function () {
                    printfImport();
                });
            },
        });
    }

    function printfImport() {
        var profile = {
            nameStore: $modalImportProduct.find('.providerName').val(),
            name1: $modalImportProduct.find('#name1').val(),
            name2: $modalImportProduct.find('#name2').val(),
        };
        var products = [];
        $.each($modalImportProduct.find('.products-import tr'), function (index, value) {
            var $value = $(value);
            products.push({
                id: $value.find('.id-product').text(),
                nameProduct: $value.find('.name-product').text(),
                quantity: $value.find('.product-quantity').text(),
                realPrice: $value.find('.real-price').val(),
            })
        });
        var data = {
            profile: profile,
            products: products,
        };
        var dataString = encodeURIComponent(JSON.stringify(data));
        window.open("./printf/printf-instock.html?data=" + dataString);
    }
    function renderModalExportProduct() {
        var html = `
                <div class="modal fade" id="staticModalExport" tabindex="-1" role="dialog" aria-labelledby="staticModalLabel" aria-hidden="true" data-backdrop="static">
                    <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <form class="registerForm">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticModalLabel">Phiếu Xuất</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                    <div class="row form-group">
                                        <div class="col col-sm-3">
                                            <label for="selectInStockStore" class="form-control-label">Mã đơn hàng</label>
                                        </div>
                                        <div class="col-12 col-md-9">
                                            <select name="orders"  class="form-control dropdown-orders orderName">
                                                <option selected value="0">Please select</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row form-group form-ep">
                                        <div class="col col-sm-3">
                                            <label for="name1" class=" form-control-label">Khách hàng</label>
                                        </div>
                                        <div class="col-12 col-md-9">
                                            <input type="text" id="name1" name="name1"  class="form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group form-ep">
                                        <div class="col col-sm-3">
                                            <label for="name2" class=" form-control-label">Địa chỉ</label>
                                        </div>
                                        <div class="col-12 col-md-9">
                                            <input type="text" id="name2" name="name2"  class="form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group form-ep">
                                        <div class="col col-sm-3">
                                            <label for="name3" class=" form-control-label">Số điện thoại</label>
                                        </div>
                                        <div class="col-12 col-md-9">
                                            <input type="text" id="name3" name="name3"  class="form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group form-ep">
                                        <div class="col col-sm-3">
                                            <label for="name4" class=" form-control-label">Phí vận chuyển</label>
                                        </div>
                                        <div class="col-12 col-md-9">
                                            <input type="text" id="name4" name="name4"  class="form-control">
                                        </div>
                                    </div>
                                    <div class="row form-group form-ep">
                                        <div class="col col-sm-3">
                                            <label for="name5" class=" form-control-label">Ngày mua hàng</label>
                                        </div>
                                        <div class="col-12 col-md-9">
                                            <input type="date" id="name5" name="name5"  class="form-control">
                                        </div>
                                    </div>
                                     <div class="row form-group form-ex">
                                        <div class="col col-sm-3">
                                            <label for="description" class="form-control-label">Tên sản phẩm</label>
                                        </div>
                                        <div class="col-12 col-md-9">
                                                <select name="productName" class="form-control dropdown-products">
                                                    <option selected value="0">Please select</option>
                                                </select>
                                        </div>
                                    </div>
                                    <div class="row form-group form-ex">
                                        <div class="col col-sm-3">
                                            <label for="quantity" class=" form-control-label">Số lượng</label>
                                        </div>
                                        <div class="col col-md-9">
                                                    <div class="input-group">
                                                        <input type="number" id="quantity" min="1" name="quantity" class="form-control">
                                                        <div class="input-group-btn">
                                                            <button type="button" onclick="Product.addProductToDataImport(1)" class="btn btn-primary">Cập nhật</button>
                                                        </div>
                                                    </div>
                                                
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <input type="hidden" name="data-product-ids">
                                        <div class="col-12">
                                            <div class="table-wrapper-scroll-y my-custom-scrollbar">
                                                            <table class="table table-bordered table-striped mb-0" id="data-order">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Id</th>
                                                                        <th>Tên sản phẩm</th>
                                                                        <th>Số lượng</th>
                                                                        <th>Hành động</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody class="products-import">
                                                                </tbody>
                                                            </table>
                                                        </div>
                                        </div>
                                    </div>
                                </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy bỏ</button>
                                <button type="button" class="btn btn-primary prinft-button form-ep">Xuất phiếu</button>
                                <button type="button" class="btn btn-primary ok-button form-ex">Xuất hàng</button>
                            </div>
                        </form> 
                    </div>
                </div>
            </div>`;
        Base.renderModal({
            id: "staticModalExport",
            html,
            okCallback: function () {
                exportProduct();
            },
            cancelCallBack: function () {
                $modalExportProduct.find('input[name=data-product-ids]').val('');
            },
            rendered: function ($_modal) {
                $modalExportProduct = $_modal;
                renderDropdownOrders(modesExIm.EXPORTL)
                renderDropdownProducts(modesExIm.EXPORTL);
                $modalExportProduct.find('.prinft-button').click(function () {
                    printfExport();
                })
            },
        });
    }
    function printfExport() {
        var profile = {
            nameStore: $modalExportProduct.find('.providerName').val(),
            name1: $modalExportProduct.find('#name1').val(),
            name2: $modalExportProduct.find('#name2').val(),
            name3: $modalExportProduct.find('#name3').val(),
            name4: $modalExportProduct.find('#name4').val(),
            name5: $modalExportProduct.find('#name5').val()
        };
        var products = [];
        $.each($modalExportProduct.find('.products-import tr'), function (index, value) {
            var $value = $(value);
            products.push({
                id: $value.find('.id-product').text(),
                nameProduct: $value.find('.name-product').text(),
                quantity: $value.find('.product-quantity').text(),
                price: $value.find('.product-price').text(),
            })
        });
        var data = {
            profile: profile,
            products: products,
        };
        var dataString = encodeURIComponent(JSON.stringify(data));
        window.open("./printf/printf-outstock.html?data=" + dataString);
    }
    function formName($modal, data) {
        data = data || {}
        var profile = {
            nameStore: $modal.find('.providerName').val(),
            name1: $modal.find('#name1').val(data.fullName),
            name2: $modal.find('#name2').val(data.address),
            name3: $modal.find('#name3').val(data.phoneNumber),
            name4: $modal.find('#name4').val(data.shipMethod === "FAST" ? 30000 : 0),
            name5: $modal.find('#name5').val(data.dateOrder),
        };
        return profile
    }
    function renderDropdownProviders(type) {
        Base.sendApi({
            url: base_url + "/providers/",
            onSuccess: function (data) {
                var html = '';
                var $modal = type === modesExIm.IMPORT ? $modalImportProduct : $modalExportProduct;
                data.forEach(function (provider) {
                    html += "<option value=\"" + provider.id + "\">" + provider.nameStore + "</option>"
                });
                $modal.find('.dropdown-providers').append(html);
            }
        })
    }
    function renderDropdownOrders(type) {
        Base.sendApi({
            url: base_url + "/orders/",
            onSuccess: function (data) {
                var html = '';
                var $modal = type === modesExIm.IMPORT ? $modalImportProduct : $modalExportProduct;
                data.forEach(function (order) {
                    html += "<option value=\"" + order.id + "\">" + order.id + "</option>"
                });
                $modal.find('.dropdown-orders').append(html);
                $modal.find('.dropdown-orders').on('change', function (e) {
                    $modal.find('.products-import').html('')
                    $modal.find('input[name=data-product-ids]').val('')
                    var value = e.target.value;
                    if (value != 0) {
                        $modal.find('.form-ex').hide()
                        $modal.find('.form-ep').show()

                        var currentOrder = data.find(item => item.id == value);
                        console.log(currentOrder)
                        formName($modal, currentOrder)

                        Base.sendApi({
                            url: base_url + "/orders/details/" + value,
                            onSuccess: function (data) {
                                data.forEach(product => {
                                    var html = `
                                        <tr id="${product.product.id}" class="tr-shadow">
                                            <td class="id-product">${product.product.id}</td>
                                                <td>
                                                    <span class="block-email name-product">${product.product.nameProduct}</span>
                                                    </td>
                                                <td class="desc product-quantity">${product.quantity}</td>
                                                <input class="product-price" type="hidden" value="${product.product.price}">
                                            <td>
                                            
                                            </td>
                                        </tr>
                                    `
                                    var inUseIds = $modal.find('input[name=data-product-ids]').val();
                                    $modal.find('input[name=data-product-ids]').val(inUseIds + "-" + product.product.id);
                                    $modal.find('.products-import').append(html);
                                })
                            }
                        })
                    } else {
                        $modal.find('.form-ep').hide()
                        $modal.find('.form-ex').show()
                    }
                })
            }
        })
    }
    function addProductToDataImport(type) {
        var $modal = type === modesExIm.IMPORT ? $modalImportProduct : $modalExportProduct;
        var currentProduct = _.find(window.productData, function (e) {
            return e.id == Number($modal.find('.dropdown-products').val());
        });
        var product = {
            id: currentProduct.id,
            name: currentProduct.nameProduct,
            quantity: $modal.find('input[name=quantity]').val(),
            realPrice: currentProduct.realPrice,
        };
        if (!product.id || !product.name || !product.quantity) {
            alert("Thiếu dữ liệu");
            return;
        }
        if (product.quantity < 1) {
            alert("Số lượng không hợp lệ");
            return;
        }
        //check exist product
        var productIds = $modal.find('input[name=data-product-ids]').val().split('-');
        var productIdInUse = _.find(productIds, function (value) {
            return value == product.id;
        });
        if (productIdInUse) {
            var $product = $modal.find('#' + productIdInUse);
            var $productQuantity = $product.find('.product-quantity').text();
            var total = Number($productQuantity) + Number(product.quantity);
            $product.find('.product-quantity').text(total + "");
            return;
        }
        var html = "<tr id='" + product.id + "' class=\"tr-shadow\" >\n" +
            "            <td class='id-product'>" + product.id + "</td>\n" +
            "        <td>\n" +
            "        <span class=\"block-email name-product\">" + product.name + "</span>\n" +
            "        </td>\n" +
            "        <td class=\"desc product-quantity \">" + product.quantity + "</td>\n" +

            "<input class=\"real-price\" type='hidden' value='" + product.realPrice + "'>" +
            "        <td>\n" +
            "        <div class=\"table-data-feature\">\n" +
            "            <button type='button' class=\"item containerProcess\" onclick='Product.removeProductToDataImport(" + type + "\," + product.id + ")'  data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete\">\n" +
            "               <i class=\"zmdi zmdi-delete\"></i>\n" +
            "            </button>\n" +
            "            </div>\n" +
            "       </td>\n" +
            "</tr>";
        var inUseIds = $modal.find('input[name=data-product-ids]').val();
        $modal.find('input[name=data-product-ids]').val(inUseIds + "-" + product.id);
        $modal.find('.products-import').append(html);
    }
    function removeProductToDataImport(type, id) {
        var $modal = type === modesExIm.IMPORT ? $modalImportProduct : $modalExportProduct;
        var $productIds = $modal.find('input[name=data-product-ids]');
        var productIds = $productIds.val().split('-');
        productIds = productIds.filter(function (item) {
            return item !== id
        });
        productIds.join("-");
        $productIds.val(productIds);
        $modal.find('.products-import #' + id).remove();
    }
    function renderDropdownProducts(type) {
        Base.sendApi({
            url: base_url + "/product/",
            onSuccess: function (data) {
                var html = '';
                var $modal = type === modesExIm.IMPORT ? $modalImportProduct : $modalExportProduct;
                $modal.find('.dropdown-products').empty();
                $modal.find('.dropdown-products').append("<option value=\"0\">Please select</option>");
                data.forEach(function (product) {
                    html += "<option value=\"" + product.id + "\">" + product.nameProduct + "</option>"
                });
                // $modal.find('.product-data').val(JSON.stringify(data));
                window.productData = data
                $modal.find('.dropdown-products').append(html);
            }
        })
    }

    function showModalProduct(type) {
        var $thismodal = type == 0 ? $modalImportProduct : $modalExportProduct;
        renderDropdownProducts(type);
        $thismodal.find('form').trigger('reset');
        $thismodal.find('form .products-import').empty();
        $thismodal.modal('show');
        if (type == 1) {
            $thismodal.find('.form-ep').hide()
            $thismodal.find('.form-ex').show()
        }
    }
    function importProduct() {
        var data = [];
        $.each($modalImportProduct.find('.products-import tr'), function (index, value) {
            data.push({
                id: $(this).find('.id-product').text(),
                quantity: $(this).find('.product-quantity').text(),
            })
        });
        Base.sendApi({
            url: base_url + "/admin/product/import/",
            data: data,
            isShowSwal: true,
            onSuccess: function () {
                loadPage();
                $modalImportProduct.modal('hide');
            },
            method: Base.constant.METHOD_POST,
        });
    }
    function exportProduct() {
        var productsExport = [];
        var totalAmount = 0;
        $.each($modalExportProduct.find('.products-import tr'), function (index, value) {
            var quantity = $(this).find('.product-quantity').text();
            var price = Number($(this).find('.product-price').val());
            var amount = Number(quantity) * price;
            productsExport.push({
                id: $(this).find('.id-product').text(),
                quantity: quantity,
                amount: amount
            });
            totalAmount += price;
        });
        var user = JSON.parse(sessionStorage.getItem("user"));
        var data = {
            idUser: user.user.id,
            shipMethod: 0,
            payMethod: 0,
            totalAmount: totalAmount,
            orderDetailViewModels: productsExport,
        };
        Base.sendApi({
            url: base_url + "/orders/",
            data: data,
            method: Base.constant.METHOD_POST,
            onSuccess: function () {
                loadPage();
                $modalExportProduct.modal('hide');
                swal("Thành công", "Xuất hàng thành công", "success");
            },
            onFailed: function (e) {
                swal("Thất bại", e.response.data, "error");
            }
        });
    }
    function search() {
        var value = $('.input-search').val();
        Base.sendApi({
            url: base_url + "/product/find-by-name/" + value,
            onSuccess: function (data) {
                renderProducts(data);
            }
        });
    }
    validateSearch();
    function validateSearch() {
        $('.input-search').on('change', function (value) {
            if (!$(value.target).val()) {
                loadPage();
            }
        })
    }
    function deleteProduct(id) {
        Base.sendApi({
            url: base_url + "/admin/product/delete/" + id,
            method: Base.constant.METHOD_DELETE,
            isShowSwal: true,
            onSuccess: function (data) {
                loadPage();
            }
        });
    }
    function edit(data) {
        Base.sendApi({
            url: base_url + "/admin/product/",
            data: data,
            method: Base.constant.METHOD_PUT,
            isShowSwal: true,
            onDone: function () {
                $modal.modal('hide');
                loadPage();
            },
        });
    }
    return {
        showModalCreateProduct: showModalCreateProduct,
        showModalProduct: showModalProduct,
        addProductToDataImport: addProductToDataImport,
        removeProductToDataImport: removeProductToDataImport,
        importProduct: importProduct,
        search: search,
        deleteProduct: deleteProduct
    }
})(jQuery);
