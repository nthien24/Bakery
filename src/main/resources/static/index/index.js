var vm = new Vue({
    el: "#container",
    data:{
        productsData : [],
        productsOrdered: [],
    },
    methods: {
        initSearch: function(q){
            var self = this;
            $('[name="q"]').on('keyup',function (e) {
                var keyword = $(this).val();
                if(keyword){
                    self.search(keyword);
                }
                else {
                    self.productsData = [];
                }
            });

        },
        search:function(keyword) {
            var self = this;

            Base.sendApi({
                url : base_url +"/product/find-by-name/"+keyword,
                isAllowAuthen:true,
                onSuccess: function ( data) {
                    self.productsData = data;
                },
                onFailed: function (msg) {
                    console.log(msg);
                }
            })
        },
        saveProduct() {
            const parsed = JSON.stringify(this.productsOrdered);
            localStorage.setItem("productsOrdered", parsed);
        },
        onAddToCard: function (event, product) {
            var self = this;
            Base.sendApi({
                url:base_url + "/requireToken",
                method: Base.constant.METHOD_POST,
                onFailed: function(rsError){
                    swal("Lỗi", "Bạn chưa đăng nhập, chuyển hướng tới trang đăng nhập ", "error")
                        .then(function () {
                            window.location.href = "login/index.html"
                        });
                },
                onSuccess: function(){
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

    },
    mounted() {
        this.initSearch();
    },
    computed:{
        products : function () {
            return this.productsData;
        }
    },
    filters:{
        formatMoney: function (value) {
            return Base.doFormatMoney(value);
        }
    }


});
