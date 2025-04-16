$(document).ready(function () {
  (function ($) {
    "use strict";

    var vm = new Vue({
      el: "#container",
      watch: {
        status: function(value){
          var self = this;
          if(this.isFirstLoad){
            this.isFirstLoad = false;
            return;
          }
          Swal.fire({
            title: "Xác nhận thay đổi?",
            text: "Sẽ thay đổi trạng thái đơn hàng",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đổi trạng thái",
          }).then((result) => {
            if (result.value) {
                self.changeStatusOrder(value);
            }
          });
        }
        

      },
      data: {
        isFirstLoad:true,
        orderDetails: [],
        idOrder:0,
        status:''
      },
      methods: {
        changeStatusOrder: function(value){

          var data = {
            idOrder: this.idOrder,
            status: value
          };
          axios
              .put(base_url + "/orders/",data, {
                headers: {
                  Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
                },
              })
              .then((response) => {

              })
              .catch((error) => {
                Swal.fire("Lỗi", "Lỗi thay đổi trạng thái đơn hàng", "error");
              })
              .finally(function () {
                $.unblockUI();
              });
        },
        initScreen: function () {
          axios
            .get(base_url + "/orders/details/" + this.idOrder, {
              headers: {
                Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
              },
            })
            .then((response) => {
              this.orderDetails = response.data;
              if(this.orderDetails.length != 0){
                this.setStatusSelected(this.orderDetails[0].orders.status);
                if(this.orderDetails[0].orders.status === 'DONE'){
                  $('.status-options').attr("disabled",true);
                }
              }
            })
            .catch((error) => {
              if (error.response.status == 401)
                window.location.href = "login/index.html"
            })
            .finally(function () {
              $.unblockUI();
            });
        },
        doFormatMoney: function (value) {
          var data = parseInt(value);
          return data.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          });
        },
        onClickOrder: function (order) {
          this.createDialogOrderDetail(order);
        },
        setStatusSelected: function(status){
          switch (status){
            case "WAITING":{
              this.status = 0 ;
              break;
            }
            case "PROCESS":{
              this.status = 1 ;
              break;
            }
            case "SHIPPING":{
              this.status = 2 ;
              break;
            }
            case "DONE":{
              this.status = 3 ;
              break;
            }
            case "RETURN":{
              this.status = 4 ;
              break;
            }
            case "HOLD":{
              this.status = 5 ;
              break;
            }

          }
        }
      },
      computed: {
        selectedStatus: function(){
          var resulf = this.status;
          return resulf;
        }

      },
      mounted: function () {
        this.idOrder = new URL(location.href).searchParams.get('idOrder');
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
