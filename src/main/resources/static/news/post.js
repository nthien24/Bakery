(function(){
    let id = new URL(location.href).searchParams.get("id");
    Base.sendApi({
        url: base_url + "/news/"+id,
        onSuccess: function (data) {
            loadPage(data);
        },
    });
    function loadPage(post){
        var $title = $("#title").text(post.title);
        var $content = $("#content").text(post.content);
        var $image = $("#image").attr("src",post.urlImage);
    }
})();