$(document).ready(function () {
    (function ($) {
        "use strict";
        var vm = new Vue({
            el: "#container",
            watch: {
                searchKeyword: function (value) {
                    var self = this;
                    if (!value) {
                        self.initScreen();
                    }
                }
            },
            data: {
                searchKeyword: '',
                orders: [],
                typeDate: 3,
            },
            methods: {
                initScreen: function () {
                    axios
                        .get(base_url + "/orders/", {
                            headers: {
                                Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
                            },
                        })
                        .then((response) => {
                            this.orders = response.data;
                        })
                        .catch((error) => {
                            if (error.response.status == 401)
                                window.location.href = "login/index.html";
                        })
                },
                doFormatMoney: function (value) {
                    var data = parseInt(value);
                    return data.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                    });
                },
                onDeleteOrder: function (order) {
                    var self = this;
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                        if (result.value) {
                            axios
                                .delete(base_url + "/orders/" + order.id, {
                                    headers: {
                                        Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
                                    },
                                })
                                .then((response) => {
                                    Swal.fire(
                                        "Thành công !",
                                        "Xóa đơn hàng thành công",
                                        "success"
                                    ).then(
                                        function () {
                                            self.doDeleteOrder(order.id);
                                        },
                                        function () {
                                            return false;
                                        }
                                    );
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                                .finally(function () { });
                        }
                    })

                },
                doDeleteOrder: function (idOrder) {
                    this.orders = this.orders.filter(function (value) {
                        return value.id != idOrder;
                    });
                },
                onClickOrder: function (order) {
                    window.location.href = "order-details.html?idOrder=" + order.id;
                },
                onFilterOrder: function (date) {
                    if (this.typeDate == 3) return this.initScreen();

                    axios
                        .get(base_url + "/orders/find-by-date/" + this.typeDate, {
                            headers: {
                                Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
                            },
                        })
                        .then((response) => {
                            this.orders = response.data;
                        })
                        .catch((error) => {
                            this.orders = []
                            // Swal.fire("Thất bại", "Không có đơn hàng nào", "error");
                        })
                },
                onPrinfPdf: function () {
                    var self = this;
                    axios
                        .get(
                            base_url +
                            "/orders/export/" +
                            this.typeDate +
                            "/order_report.xlsx",
                            {
                                responseType: 'blob',
                                headers: {
                                    Authorization:
                                        "Bearer " + sessionStorage.getItem("tokenAdmin"),

                                }
                            },
                        )
                        .then((response) => {
                            let fileName = "order_report.xlsx";
                            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE variant
                                window.navigator.msSaveOrOpenBlob(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
                                    fileName);
                            } else {
                                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', fileName.xlsx);
                                document.body.appendChild(link);
                                link.click();
                            }
                        })
                        .catch((error) => {
                            Swal.fire("Thất bại", "Không có đơn hàng nào", "error");
                        })
                        .finally(function () { });
                },
                searchOrder: function () {
                    var self = this;
                    if (self.searchKeyword.length) {
                        this.orders = this.orders.filter(e => {
                            return e.id.toString().indexOf(self.searchKeyword) > -1
                        });
                    }
                }
            },
            computed: {
                ordersList: function () {
                    return this.orders;
                },
            },
            mounted: function () {
                this.initScreen();
            },
            filters: {
                formatMoney: function (value) {
                    return this.doFormatMoney(value);
                },
            },
        });
    })(jQuery);
});
