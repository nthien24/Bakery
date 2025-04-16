$(document).ready(function () {
  (function ($) {
    "use strict";
    var vm = new Vue({
      el: "#container",
      watch: {},
      data: {
        startDate: '',
        endDate: '',
        productsData: []
      },
      methods: {
        onFilterOrder: function () {
          var self = this;
          if (!self.startDate || !self.endDate) {
            Swal.fire("Thất bại", "Hãy chọn khoảng thời gian", "error");;
            return;
          }
          var data = {
            startDate: this.startDate,
            endDate: this.endDate
          };
          axios
            .post(base_url + "/product/statistical", data, {
              headers: {
                Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
              },
            })
            .then((response) => {
              this.productsData = response.data;
            })
            .catch((error) => {
              this.productsData = [];
              Swal.fire("Thất bại", "Không có đơn hàng nào", "error");
            })
            .finally(function () { });
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
              "/product/export/product_report ", data,
              {
                responseType: 'blob',
                headers: {
                  Authorization:
                    "Bearer " + sessionStorage.getItem("tokenAdmin"),

                }
              },
            )
            .then((response) => {
              let fileName = "product_report.xlsx";
              if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE variant
                window.navigator.msSaveOrOpenBlob(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
                  fileName);
              } else {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                // document.body.appendChild(link);
                link.click();
              }
            })
            .catch((error) => {
              Swal.fire("Thất bại", "Không có đơn hàng nào", "error");
            })
            .finally(function () { });
        },
        formatMoney: function (value) {
          var data = parseInt(value);
          return data.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          });
        }
      },
      computed: {
        products: function () {
          return this.productsData;
        },
      },
      mounted: function () {
      },
      filters: {
        formatMoney: function (value) {
          return this.formatMoney(value);
        },
      },
    });
  })(jQuery);
});
