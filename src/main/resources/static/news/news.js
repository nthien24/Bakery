(function ($) {
    var vm = new Vue({
        el: "#container",
        watch: {},
        data: {
            newsData: [],
        },
        methods: {
            loadPage: function () {
                var self = this;
                Base.sendApi({
                    url: base_url + "/news/",
                    onSuccess: function (data) {
                        self.newsData = data
                    },
                });
            },
        },
        mounted: function () {
            this.loadPage();
        },
        computed: {
            news: function () {
                return this.newsData;
            },
        },
        filters: {},
    });
})(jQuery);
