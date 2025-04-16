$(document).ready(function () {
  (function ($) {
    "use strict";
    var vm = new Vue({
      el: "#container",
      watch: {},
      data: {
        startDate:'',
        endDate:'',
        orders: [],
        typeDate: 0,
      },
      methods: {
        loadPage: function () {
          axios
            .get(base_url + "/orders/find-by-status/3", {
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
            .finally(function () {});
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
            title: 'Bạn chắc chắn muốn xóa?',
            text: "Hành động này không thể hoàn tác!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận xóa!'
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
              .finally(function () {});
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
          var self = this;
          var data = {
            startDate: this.startDate,
            endDate: this.endDate
          };
          Base.sendApi({
            url:base_url + "/orders/statistical",
            data:data,
            method: Base.constant.METHOD_POST,
            onSuccess: function (data) {
              self.orders = data;
            },
            onFailed: function (msg) {
              self.orders =[];
              Swal.fire("Thất bại", "Không có đơn hàng nào "+ msg, "error");
            }
          });
        },
        onPrinfPdf: function () {
          var self = this;
          var data = {
            startDate: this.startDate,
            endDate: this.endDate
          };
          axios
            .post(
              base_url +
                "/orders/export/order_report.xlsx",
                data,
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
                  window.navigator.msSaveOrOpenBlob(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),
                      fileName);
              } else {
                  const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', fileName);
                  // link.setAttribute('target', '_blank');
                  // $('$container').appendChild(link);
                  link.click();
              }
            })
            .catch((error) => {
              Swal.fire("Thất bại", "Không có đơn hàng nào", "error");
            })
        },
        processTinhDoanhThu: function (quantity,price) {
          return quantity*price;
        },
      },
      computed: {
        ordersList: function () {
          return this.orders;
        },
      },
      mounted: function () {
      },
      filters: {
        formatMoney: function (value) {
          return Base.doFormatMoney(value);
        },
      },
    });
  })(jQuery);
});
