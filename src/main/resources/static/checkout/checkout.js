(function ($) {
    let idStore = new URL(location.href).searchParams.get("idStore");
    $("#btnSubmitLogin").on("click", function (e) {});
    Vue.component("modal", {
        template: "#modal-template"
    });

    var vm = new Vue({
        el: "#container",
        watch: {
        },
        data: {
            isPay:false,
            totalAmount: 0,
            showModal: false,
            user: {},
            productsOrdered: [],
            shipMethod: 0,
            payMethod: 0,
            description: "    ",
            inforPayment:{
                amount:'',
                description:'    ',
                bankcode:'',
                language:''
            }
        },
        methods: {
            initScreen: function () {
                $.blockUI({
                    message: '<h1><img src="busy.gif" /> Just a moment...</h1>',
                });
                var self = this;
                axios
                    .get(base_url + "/users/" + localStorage.getItem("idUser"), {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    })
                    .then((response) => {
                        this.user = response.data;
                    })
                    .catch((error) => {
                        if (error.response.status == 401){
                            window.location.href = "login/index.html";
                        }
                    })
                    .finally(function () {
                        $.unblockUI();
                    });
                $('#frmCreateOrder').on('submit',function () {
                    self.isPay = true;
                });
            },
            onCheckOut: function (event, product) {
                var self = this;
                if(+self.payMethod === 1){

                    self.showModal = true;
                }else{
                    self.saveOrder();
                }
            },
            clearData() {
                localStorage.removeItem("productsOrdered");
            },
            saveOrder() {
                var self = this;
                var data = {
                    idUser: localStorage.getItem("idUser"),
                    shipMethod: parseInt(this.shipMethod),
                    payMethod: parseInt(this.payMethod),
                    totalAmount: this.countTotalPrice(),
                    discription: this.description,
                    orderDetailViewModels: JSON.parse(
                        localStorage.getItem("productsOrdered")
                    ),
                };
                if(data.payMethod === 1 && self.isPay === false){
                    swal("Lỗi", "Lỗi dặt hàng: chưa thanh toán ", "error");
                    return;
                }
                axios
                    .post(base_url + "/orders/", data, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    })
                    .then((response) => {
                        swal("Thành công", "Đặt hàng thành công", "success").then(
                            function () {
                                self.clearData();
                                window.location.href = "index.html";
                            },
                            function () {
                                return false;
                            }
                        );
                    })
                    .catch((error) => {
                        console.log(error);
                        swal("Lỗi", "Lỗi dặt hàng: "+error.response.data, "error");
                    })
                    .finally(function () {
                        $.unblockUI();
                    });
            },
            countTotalPrice: function () {
                var total_price = 0;
                _.forEach(this.productsOrdered, function (value) {
                    total_price += value.amount;
                });
                this.totalAmount = parseInt(total_price);
                if(this.shipMethod === "1"){
                    this.totalAmount = this.totalAmount + 30000;
                    total_price = total_price +30000;
                }
                return total_price;
            },
            payment: function(){
                var url = 'http://sandbox.vnpayment.vn/tryitnow/Home/VnPayIPN?vnp_Amount='+this.totalPrice+'&vnp_BankCode='+this.inforPayment.bankcode+'&vnp_BankTranNo=20170829152730&vnp_CardType=ATM&vnp_OrderInfo='+this.inforPayment.description+'&vnp_PayDate='+new Date()+'&vnp_ResponseCode=00&vnp_TmnCode=2QXUI4J4&vnp_TransactionNo=12996460&vnp_TxnRef=23597&vnp_SecureHashType=SHA256&vnp_SecureHash=20081f0ee1cc6b524e273b6d4050fefd';
                window.location.href = url
            }
        },
        mounted: function () {
            var self = this;
            this.initScreen();
            this.productsOrdered = JSON.parse(
                localStorage.getItem("productsOrdered")
            );
            $('#frmCreateOrder').trigger('submit',function () {
                self.saveOrder();
            })
        },
        computed: {
            totalPrice: function () {
                return this.countTotalPrice();
            },
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
