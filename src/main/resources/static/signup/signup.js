Vue.use(window.vuelidate.default);
const { required, minLength, email, sameAs, integer, minValue } = window.validators;
const isBiggerThanZero = Base.isBiggerThanZero;

var vm = new Vue({
    el: "#container",
    watch: {},
    data: {
        errors: {},
        validated: false,
        user: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            birthDay: "",
            password: "",
            passwordAgain: "",
            address: "",
        },
    },
    validations: {
        user: {
            firstName: { required },
            lastName: { required },
            email: { required, email },
            phone: {
                required,
                minValue: minValue(0),
                minLength: minLength(10)
            },
            birthDay: {
                required,
                mindate(date) {
                    var myDate = new Date("1900-01-01");
                    date = new Date(date)
                    return date >= myDate && date < new Date();
                }
            },
            password: { required, minLength: minLength(6) },
            passwordAgain: {
                required,
                sameAsPassword: sameAs("password"),
            },
            address: { required },
        },
    },
    methods: {
        validateForm: function (e) {
            e.preventDefault();
            this.errors = {};
            this.$v.$touch();

            if (!this.validated) return;
            var user = this.$v.user;

            if (user.firstName.$invalid) this.errors.firstName = 'Hãy nhập họ của bạn.';
            if (user.lastName.$invalid) this.errors.lastName = 'Hãy nhập tên của bạn.';
            if (user.birthDay.$invalid) this.errors.birthDay = 'Ngày sinh không hợp lệ.';
            if (user.phone.$invalid) this.errors.phone = 'Số điện thoại không hợp lệ.';
            if (user.email.$invalid) this.errors.email = 'Địa chỉ email không hợp lệ.';
            if (user.password.$invalid) this.errors.password = 'Mật khẩu không hợp lệ.';
            if (user.passwordAgain.$invalid) this.errors.passwordAgain = 'Mật khẩu nhập lại không khớp.';
            if (user.address.$invalid) this.errors.address = 'Hãy nhập địa chỉ.';

            this.hasValidate = true;

            if (this.$v.$invalid) return;
        },
        onSubmit: function (e) {
            e.preventDefault();

            this.validated = true;
            this.validateForm(e)

            if (this.$v.$invalid) return;

            this.user.name = this.user.firstName + " " + this.user.lastName;

            axios
                .post(base_url + "/users/create", this.user)
                .then(() => {
                    swal("Thành công", "Đăng kí thành công", "success")
                        .then(function () {
                            window.location.href = "login/index.html";
                        });

                })
                .catch((error) => {
                    console.log(error);
                    swal("Lỗi", "Lỗi đăng kí: " + error.response.data, "error");
                })
                .finally(() => {
                    this.loading = false
                });
        },
    },
    mounted: function () { },
    filters: {
        //   formatMoney: function (value) {
        //     return value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        //   },
    },
});
