$(document).ready(function () {
  (function ($) {
    "use strict";
    var vm = new Vue({
      el: "#container",
      watch: {
        productsOrdered: {
          handler: function (after, before) {
            // Changes detected.
            var data = after;
            this.totalPrice = this.countPrice(data);
            this.saveProduct();
            if (data.length == 0) {
              this.redirectToStores();
            }
          },
          deep: true,
        },
      },
      data: {
        totalPrice: 0,
        productsOrdered: [],
        name: "Hien",
      },
      methods: {
        decreaseValue: function (event, product) {
          if (product.quantity == 1){
            this.productsOrdered = this.productsOrdered.filter(e => {
              return e.id != product.id;
            });
            return;
          }
            
          product.quantity--;
        },
        increaseValue: function (event, product) {
          if(product.inStock <= product.quantity){
              return;
          }
          product.quantity++;
        },
        onSubmitOrder: function () {
          window.location.href = "checkout.html";
        },
        countPrice: function (product) {
          var total_price = 0;
          _.forEach(product, function (value) {
            var amount = value.quantity * value.price;
            value["amount"] = amount;
            total_price += amount;
          });
          return total_price;
        },
        initScreen: function () {
        },
        saveProduct() {
          const parsed = JSON.stringify(this.productsOrdered);
          localStorage.setItem("productsOrdered", parsed);
        },
        redirectToStores: function(){
          window.location.href="menu.html"
        },
        onDeleteProduct: function(idProduct){
          this.productsOrdered = this.productsOrdered.filter(function(n) {
            return n.id != idProduct;
          });
        }
      },
      mounted: function () {
        var self = this;
        if(localStorage.getItem("productsOrdered") && JSON.parse(
          localStorage.getItem("productsOrdered")
        ).length != 0){
          this.productsOrdered = JSON.parse(
            localStorage.getItem("productsOrdered")
          );
          this.totalPrice = this.countPrice(this.productsOrdered);
          return;
        }
        swal("Xin lỗi", "Giỏ hàng hiện không có sản phẩm !", "error") .then(
          function () {
              self.redirectToStores();
          },
          function () {
              return false;
          });
      },
      computed: {
        products: function(){
          return this.productsOrdered;
        }
      },
      filters: {
        formatMoney: function (value) {
          return value.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          });
        },
      },
    });
  })(jQuery);
});
