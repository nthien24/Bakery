(function ($) {
    TAB_ORDERS = 0;
    TAB_PROFILE = 1;
    Vue.use(window.vuelidate.default);
    const { required, minLength, email, sameAs, minValue } = window.validators;
    var vm = new Vue({
        el: "#container",
        watch: {
            selectedTab: function (value) {
                if (value === TAB_ORDERS) {
                    this.doGetAllOrder();
                } else {
                    this.doGetProfileUser();
                }
            },
        },
        data: {
            isChangePass: false,
            selectedTab: 0,
            orders: [],
            user: {
                id: localStorage.getItem("idUser"),
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                birthDay: "",
                password: "",
                passwordAgain: "",
                address: "",
                city: "",
                provies: "",
            },
        },
        validations() {
            var user = {
                name: { required },
                email: { required, email },
                phone: {
                    required,
                    isPhoneNumber(phone) {
                        var found = phone.search(/^(\+{1}\d{2,3}\s?[(]{1}\d{1,3}[)]{1}\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}$/);
                        return found > -1;
                    }
                },
                birthDay: {
                    required,
                    mindate(date) {
                        var myDate = new Date(date);
                        var today = new Date();
                        return myDate <= today;
                    }
                },
                address: { required },
            }
            if (this.isChangePass) {
                user.password = { required, minLength: minLength(6) }
                user.passwordAgain = {
                    required,
                    sameAsPassword: sameAs("password"),
                }

            }
            return { user }
        },
        methods: {
            initScreen: function () {
                this.doGetAllOrder();
            },
            onChangeTabs: function (indexTab) {
                this.selectedTab = indexTab;
            },
            doGetAllOrder: function () {
                var self = this;
                Base.sendApi({
                    url: base_url + "/orders/" + localStorage.getItem("idUser"),
                    onSuccess: function (data) {
                        self.orders = data;
                    },
                    onDone: function () {
                        $.unblockUI();
                    }
                });
            },
            logout: function () {
                Base.logout();
            },
            doGetProfileUser: function () {
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
                        swal("Thất bại", "Checkout thất bại", "error");
                    })
                    .finally(function () {
                        $.unblockUI();
                    });
            },
            onUpdateProfile: function () {
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }
                axios
                    .put(base_url + "/users/", this.user, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    })
                    .then((response) => {
                        if (response.data.birthDay)
                            response.data.birthDay = response.data.birthDay.slice(0, 10)
                        this.user = response.data;
                        swal("Thành công", "Cập nhật thông tin", "success");
                    })
                    .catch((error) => {
                        swal("Thất bại", "Lỗi cập nhật", "error");
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
            removeOrder(id) {
                var self = this;
                var order = _.find(self.orders, function (e) {
                    return e.id === id
                });
                if (order.status === 'PROCESS') {
                    Swal.fire({
                        title: 'Bạn chắc chắn muốn hủy?',
                        text: "Hành động này không thể hoàn tác!",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Xác nhận hủy đơn',
                        cancelButtonText: 'Không hủy đơn'
                    }).then((result) => {
                        if (result.value) {
                            Base.sendApi({
                                url: base_url + "/orders/" + id,
                                method: Base.constant.METHOD_DELETE,
                                isShowSwal: true,
                                onSuccess: function () {
                                    self.doGetAllOrder();
                                }
                            });


                        }
                    });
                    return;
                }
                Swal.fire("Thất bại", "Đơn hàng đã được xác nhận không thể xóa", "error");

            }
        },
        mounted: function () {
            this.initScreen();
        },
        computed: {},
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
