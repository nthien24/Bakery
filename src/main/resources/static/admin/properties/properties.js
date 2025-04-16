Vue.component("modal", {
    template: "#modal-template"
  });
Vue.use(window.vuelidate.default);
const { required, minLength } = window.validators;
var vm = new Vue({
    el: "#container",
    watch: {},
    data: {
        propertiesData: [],
        property:{
            id:0,
            nameProperty:''
        },
        showModal: false,
        isUpdate: false
    },
    validations: {
        property:{
            id:{},
            nameProperty:{required}
        },
    },
    methods: {
        initScreen: function(){
            axios
                .get(base_url + "/properties/")
                .then((response) => {
                    this.propertiesData = response.data;
                })
                .catch((error) => {
                    // if (error.response.status == 401)
                    //     window.location.href = "login/index.html";
                })
                .finally(function () {});
        },
        onClickEdit: function(value){

        },
        removeFromList: function(id){
            var temp = this.propertiesData.filter(e => {
                return e.id != id;
            });
            this.propertiesData = temp;
            
        },
        onDelete: function(id){
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
                    .delete(base_url + "/properties/"+id)
                    .then((response) => {
                        this.removeFromList(id);
                    })
                    .catch((error) => {
                        Swal.fire("Thất bại", "Không thể xóa thuộc tính", "error");
                    })
                    .finally(function () {});
                }
            })
            
        },
        onOpenModal: function(){
            this.isUpdate = false;
            this.showModal = !this.showModal;
        },
        onOpenUpdateModal: function(){
            this.isUpdate = true;
            this.showModal = !this.showModal;
        },
        onCreate: function(){
            var self = this;
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            axios
            .post(base_url + "/properties/",this.property, {
                headers: {
                  Authorization: "Bearer " + sessionStorage.getItem("tokenAdmin"),
                },
              })
            .then((response) => {
                this.showModal = false;
                this.propertiesData.push(response.data);
                Base.resetForm(this.property);
            })
            .catch((error) => {
                swal("Thất bại", "Thuộc tính đã tồn tại", "error");
            })
            .finally(function () {});
        },
        onUpdate: function(){
            this.isUpdate = true;
            this.showModal = !this.showModal;
        },
    },
    computed: {
        properties: function(){
            return this.propertiesData;
        }
    },
    mounted: function () {
      this.initScreen();
    },
    filters: {
      
    },
});
