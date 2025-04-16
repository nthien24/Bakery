var Base = (function () {
    var constant = {
        METHOD_GET : 'GET',
        METHOD_POST : 'POST',
        METHOD_DELETE : 'DELETE',
        METHOD_PUT : 'PUT',
    };
    // let base_url = "http://52.43.108.161:8181/";
    let base_url = "http://127.0.0.1:8080";
    let USER_NAME = "username";
    let USER_ID = "idUser";
    let TOKEN = "token";
    function processString(text) {
        if (text && text.length > 30) {
            return text.substring(0, 30) + "...";
        }
        return text;
    }
    function sendApi({url,method=constant.METHOD_GET,data,onDone=function(){},onSuccess=function(){},onFailed=function(){},isShowSwal=false,isAllowAuthen=false}){
        var header = {
            Authorization: "Bearer " + localStorage.getItem("token")
        };
        if(isAllowAuthen){
            header = {};
        }
        switch (method){
            case constant.METHOD_GET:{
                axios
                    .get(url, {
                        headers:header,
                    })
                    .then((response) => {
                        if(isShowSwal ){
                            swal("Thành Công", "Thao tác thành công!", "success");
                        }
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        if(isShowSwal ){
                            swal("Thất bại", "Thao tác thất bại", "error");;
                        }
                        onFailed(error);
                    })
                    .finally(function (event) {

                        onDone();
                    });
                break;
            }
            case constant.METHOD_POST:{
                axios
                    .post(url, data, {
                        headers:header,
                    })
                    .then((response) => {
                        if(isShowSwal ){
                            swal("Thành Công", "Thao tác thành công!", "success");
                        }
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        if(isShowSwal ){
                            swal("Thất bại", "Thao tác thất bại", "error");;
                        }
                        onFailed(error);
                    })
                    .finally(function (event) {
                        onDone();
                    });
                break;
            }
            case constant.METHOD_DELETE:{
                axios
                    .delete(url, {
                        headers:header,
                    })
                    .then((response) => {
                        if(isShowSwal ){
                            swal("Thành Công", "Thao tác thành công!", "success");
                        }
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        if(isShowSwal ){
                            swal("Thất bại", "Thao tác thất bại", "error");;
                        }
                        onFailed(error);
                    })
                    .finally(function (event) {

                        onDone();
                    });
                break;
            }
            case constant.METHOD_PUT:{
                axios
                    .put(url,data, {
                        headers:header,
                    })
                    .then((response) => {
                        if(isShowSwal ){
                            swal("Thành Công", "Thao tác thành công!", "success");
                        }
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        if(isShowSwal ){
                            swal("Thất bại", "Thao tác thất bại", "error");;
                        }
                        onFailed(error);
                    })
                    .finally(function (event) {
                        onDone();
                    });
                break;
            }
        }
    }
    function getUserName() {
        return localStorage.getItem(USER_NAME);
    }
    function logout() {
        localStorage.removeItem("token");
        window.location.href = "login/index.html";
    }
    function loadHeader(isLogin) {
        var divLogin = '<li><a href="./login/index.html">Đăng nhập</a></li>';
        // var nameUser = Base.getUserName();
        var token = localStorage.getItem("token");
        var username = localStorage.getItem('username');
        if (isLogin) {
            divLogin = "<li><a href=\"user.html\">"+Base.processString(username)+"</a></li>"
        }
        $("#header").append(
            '<div class="header-area ">' +
                ' <div id="sticky-header" class="main-header-area">' +
                ' <div class="container">' +
                '	 <div class="row align-items-center"> ' +
                '<div class="col-xl-10 col-lg-10"> ' +
                '<div class="main-menu d-none d-lg-block">' +
                ' <nav> <ul class="mein_menu_list" id="navigation">' +
                ' <li><a href="menu.html">Sản phẩm</a></li> ' +
                ' <li><a href="about.html">Về chúng tôi</a></li>' +
                // ' <li><a href="service.html">Thương hiệu</a></li>' +
                '<li><a href="gallery.html">Hình ảnh</a></li>' +
                ' <div class="logo-img d-none d-lg-block">' +
                ' <a href="index.html"> <img src="img/logo.png" alt=""> </a> ' +
                "</div>" +
                '  <li><a href="news.html">Tin tức</a> </li> ' +
                divLogin +
                "</ul> " +
                "</nav> " +
                "</div>" +
                " </div> " +
                '<div class="col-xl-2 col-lg-2 d-none d-lg-block"> ' +
                '<div class="custom_order"> ' +
                '<a href="cart.html" class="boxed_btn_white">Giỏ hàng</a>' +
                " </div> " +
                "</div> " +
                '<div class="col-12">' +
                ' <div class="mobile_menu d-block d-lg-none">' +
                "</div> " +
                "</div> " +
                '<div class="logo-img-small d-sm-block d-md-block d-lg-none">' +
                ' <a href="index.html"> ' +
                '<img src="img/logo.png" alt=""> ' +
                "</a> " +
                "</div> " +
                "</div> " +
                "</div> " +
                "</div> " +
                "</div>"
        );
    }
    function loadFooter() {
        $("#footer").append(
            `
            <div class="footer-bottom">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-xl-7 col-md-12 col-lg-8">
                            <div class="copyright">
                                    <p class="footer-text text-center"><!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
        Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This website is made with <i class="fa fa-heart-o" aria-hidden="true"></i></a>
        <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. --></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        );
    }
    loadFooter();
    checkAuthen();
    function checkAuthen() {
        var isLogin = true;
        sendApi({
            url:base_url + "/requireToken",
            method: constant.METHOD_POST,
            onFailed: function(rsError){
                isLogin = rsError.response.status !== 401
            },
            onDone: function(){
                loadHeader(isLogin);
            }
        })
    }
    function doFormatMoney(value) {
        var data = parseInt(value);
        return data.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
        });
    }
    function renderModal(ops){
        var html = ops.html;
        $('body').append(html);
        var modal = $("#"+ops.id);
        ops.rendered(modal);
        modal.find('.ok-button').click(function(){
            if(ops.okCallback){
                ops.okCallback();
            }
        });
        modal.on('hidden.bs.modal', function (e) {
            if(ops.cancelCallBack){
                ops.cancelCallBack();
            }
        });
        // $(html).find('#staticModal').modal('show');
    }
    const isBiggerThanZero = (value) => (value >= 0);
    return {
        sendApi:sendApi,
        getUserName: getUserName,
        constant:constant,
        logout: logout,
        isBiggerThanZero:isBiggerThanZero,
        processString:processString,
        doFormatMoney:doFormatMoney,
        renderModal:renderModal,
    };
})();
(function ($) {
    "use strict";
    // TOP Menu Sticky
    $(window).on("scroll", function () {
        var scroll = $(window).scrollTop();
        if (scroll < 400) {
            $("#sticky-header").removeClass("sticky");
            $("#back-top").fadeIn(500);
        } else {
            $("#sticky-header").addClass("sticky");
            $("#back-top").fadeIn(500);
        }
    });
    $('[type="date"]').prop('max', function(){
        return new Date().toJSON().split('T')[0];
    });
    $(document).ready(function () {
        // mobile_menu
        var menu = $("ul#navigation");
        if (menu.length) {
            menu.slicknav({
                prependTo: ".mobile_menu",
                closedSymbol: "+",
                openedSymbol: "-",
            });
        }
        // blog-menu
        // $('ul#blog-menu').slicknav({
        //   prependTo: ".blog_menu"
        // });

        // review-active
        $(".slider_sctive").owlCarousel({
            loop: true,
            margin: 0,
            items: 1,
            autoplay: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>',
            ],
            nav: false,
            dots: true,
            autoplayHoverPause: true,
            autoplaySpeed: 800,
            responsive: {
                0: {
                    items: 1,
                    dots: false,
                },
                767: {
                    items: 1,
                    dots: false,
                },
                992: {
                    items: 1,
                },
            },
        });

        // for filter
        // init Isotope
        var $grid = $(".grid").isotope({
            itemSelector: ".grid-item",
            percentPosition: true,
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: 1,
                // gutter: 10
            },
        });

        // filter items on button click
        $(".portfolio-menu").on("click", "button", function () {
            var filterValue = $(this).attr("data-filter");
            $grid.isotope({ filter: filterValue });
        });

        //for menu active class
        $(".portfolio-menu button").on("click", function (event) {
            $(this).siblings(".active").removeClass("active");
            $(this).addClass("active");
            event.preventDefault();
        });

        // wow js
        new WOW().init();

        // counter
        $(".counter").counterUp({
            delay: 10,
            time: 10000,
        });

        /* magnificPopup img view */
        $(".popup-image").magnificPopup({
            type: "image",
            gallery: {
                enabled: true,
            },
        });

        /* magnificPopup img view */
        $(".img-pop-up").magnificPopup({
            type: "image",
            gallery: {
                enabled: true,
            },
        });
        /* magnificPopup video view */
        $(".popup-video").magnificPopup({
            type: "iframe",
        });

        // scrollIt for smoth scroll
        $.scrollIt({
            upKey: 38, // key code to navigate to the next section
            downKey: 40, // key code to navigate to the previous section
            easing: "linear", // the easing function for animation
            scrollTime: 600, // how long (in ms) the animation takes
            activeClass: "active", // class given to the active nav element
            onPageChange: null, // function(pageIndex) that is called when page is changed
            topOffset: 0, // offste (in px) for fixed top navigation
        });

        // scrollup bottom to top
        $.scrollUp({
            scrollName: "scrollUp", // Element ID
            topDistance: "4500", // Distance from top before showing element (px)
            topSpeed: 300, // Speed back to top (ms)
            animation: "fade", // Fade, slide, none
            animationInSpeed: 200, // Animation in speed (ms)
            animationOutSpeed: 200, // Animation out speed (ms)
            scrollText: '<i class="fa fa-angle-double-up"></i>', // Text for element
            activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
        });

        // blog-page

        //testmonial_active
        $(".testmonial_active").owlCarousel({
            loop: true,
            margin: 60,
            items: 1,
            autoplay: true,
            nav: false,
            dots: true,
            autoplayHoverPause: true,
            autoplaySpeed: 800,
            responsive: {
                0: {
                    items: 1,
                },
                767: {
                    items: 1,
                },
                992: {
                    items: 2,
                },
            },
        });

        // blog-dtails-page

        //project-active
        $(".project-active").owlCarousel({
            loop: true,
            margin: 30,
            items: 1,
            // autoplay:true,
            navText: [
                '<i class="Flaticon flaticon-left-arrow"></i>',
                '<i class="Flaticon flaticon-right-arrow"></i>',
            ],
            nav: true,
            dots: false,
            // autoplayHoverPause: true,
            // autoplaySpeed: 800,
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                },
                767: {
                    items: 1,
                    nav: false,
                },
                992: {
                    items: 2,
                    nav: false,
                },
                1200: {
                    items: 1,
                },
                1501: {
                    items: 2,
                },
            },
        });

        //project-active

        //about-pro-active
        $(".about-pro-active").owlCarousel({
            loop: true,
            margin: 30,
            items: 1,
            // autoplay:true,
            navText: [
                '<i class="Flaticon flaticon-left-arrow"></i>',
                '<i class="Flaticon flaticon-right-arrow"></i>',
            ],
            nav: true,
            dots: false,
            // autoplayHoverPause: true,
            // autoplaySpeed: 800,
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                },
                767: {
                    items: 1,
                    nav: false,
                },
                992: {
                    items: 1,
                    nav: false,
                },
                1200: {
                    items: 1,
                },
            },
        });
    });

    if (document.getElementById("default-select")) {
        $("select").niceSelect();
    }

    //------- Mailchimp js --------//
    function mailChimp() {
        $("#mc_embed_signup").find("form").ajaxChimp();
    }
    mailChimp();

    // Search Toggle
    $("#search_input_box").hide();
    $("#search").on("click", function () {
        $("#search_input_box").slideToggle();
        $("#search_input").focus();
    });
    $("#close_search").on("click", function () {
        $("#search_input_box").slideUp(500);
    });
    // Search Toggle
    $("#search_input_box").hide();
    $("#search_1").on("click", function () {
        $("#search_input_box").slideToggle();
        $("#search_input").focus();
    });
    
    // checkAuthen();sss
})(jQuery);
