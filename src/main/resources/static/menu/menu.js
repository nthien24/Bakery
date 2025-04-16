var Menu = (function ($) {
    let idStore = new URL(location.href).searchParams.get("idStore");
    $("#btnSubmitLogin").on("click", function (e) { });
    var vm = new Vue({
        el: "#container",
        components: { Multiselect: window.VueMultiselect.default },
        watch: {
            valueSearchProperties: function (value) {
                this.onSeachProduct(value);
            },
        },
        data: {
            productsData: [],
            productsOrdered: [],
            valueSearchProperties: [],
            properties: [],
            q: ''
        },
        methods: {
            initScreen: function () {
                $.blockUI({
                    message: '<h1><img src="busy.gif" /> Just a moment...</h1>',
                });
                var self = this;
                axios
                    .get(base_url + "/product/")
                    .then((response) => {
                        self.getAllPropertiesToSearch();
                        var data = response.data;
                        if (data.length > 0) {
                            if (localStorage.getItem("productsOrdered")) {
                                this.productsOrdered = JSON.parse(
                                    localStorage.getItem("productsOrdered")
                                );
                                _.forEach(this.productsOrdered, function (value) {
                                    var product = data.find((x) => x.id === value.id);
                                    if (product) {
                                        product["isOrder"] = 1;
                                    }
                                });
                            } else {
                                localStorage.setItem("productsOrdered", []);
                            }
                            self.productsData = data;
                            return;
                        }
                        swal("Xin lỗi", "Hiện không có sản phẩm !", "error").then(
                            function () {
                                // self.redirectToStores();
                            },
                            function () {
                                return false;
                            }
                        );
                    })
                    .catch((error) => {

                    })
                    .finally(function () {
                        $.unblockUI();
                    });
            },
            onAddToCard: function (event, product) {
                var self = this;
                Base.sendApi({
                    url: base_url + "/requireToken",
                    method: Base.constant.METHOD_POST,
                    onFailed: function (rsError) {
                        swal("Lỗi", "Bạn chưa đăng nhập, chuyển hướng tới trang đăng nhập ", "error")
                            .then(function () {
                                window.location.href = "login/index.html"
                            });
                    },
                    onSuccess: function () {
                        Swal.fire({
                            position: "top-end",
                            width: 200,
                            icon: "success",
                            title: "Đã thêm",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        product["quantity"] = 1;
                        self.productsOrdered.push(product);
                        self.saveProduct();
                    }
                });
            },
            saveProduct() {
                const parsed = JSON.stringify(this.productsOrdered);
                localStorage.setItem("productsOrdered", parsed);
            },
            redirectToStores: function () {
                window.location.href = "index.html";
            },
            getAllPropertiesToSearch: function () {
                axios
                    .get(base_url + "/properties/")
                    .then((response) => {
                        this.properties = response.data;
                    })
                    .catch((error) => {

                    })
                    .finally(function () {
                        $.unblockUI();
                    });
            },
            onSeachProduct: function (q) {
                axios
                    .post(base_url + "/product/find-by-name/" + q, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        }
                    })
                    .then((response) => {
                        this.productsData = response.data;
                    })
                    .catch((error) => {
                    })
                    .finally(function () {
                        $.unblockUI();
                    });
            }

            // },
        },
        mounted: function () {
            this.initScreen();
        },
        computed: {
            products: function () {
                var resulf = this.productsData;
                if (this.q.length) {
                    var searchText = stringToASCII(this.q).toLowerCase()
                    resulf = resulf.filter(e => {
                        const productName = stringToASCII(e.nameProduct).toLowerCase();
                        return productName.includes(searchText) && e.status == "IN_STOCK"
                    });
                }
                return resulf.filter(r => r.inStock > 0).sort((a, b) => a.price - b.price);
            }
        },
        filters: {
            formatMoney: function (value) {
                var data = parseInt(value);
                return data.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                });
            },
        },
    });
    return {
        vm: vm
    }
})(jQuery);

function stringToASCII(str) {
    try {
        return str.replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g, 'a')
            .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
            .replace(/[đ]/g, 'd')
            .replace(/[ìíỉĩị]/g, 'i')
            .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
            .replace(/[ùúủũụưừứửữự]/g, 'u')
            .replace(/[ỳýỷỹỵ]/g, 'y')
    } catch {
        return ''
    }
}