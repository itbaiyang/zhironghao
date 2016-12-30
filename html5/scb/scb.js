// go_apply = "http://172.17.3.158:8000/#/article/show/";
go_apply = "http://test.zhironghao.com/#/article/show/";

// h5_uri = "http://172.17.3.158:8000/html5/scb";
h5_uri = "http://test.zhironghao.com/html5/scb";
var carousel = new Carousel("#carousel");
carousel.init();
console.log(carousel.count2, carousel.count3)
function nextPage() {
    carousel.next()
}
function prevPage() {
    carousel.prev()
}
function goApply(url) {
    window.location.href = go_apply + url
}
$(document).ready(function(){
    var ua = navigator.userAgent.toLowerCase();
    var wx_client = ua.indexOf('micromessenger') != -1;

    // 微信初始化
    if(wx_client){
        $.ajax({
            url: "https://ssl.zhironghao.com/api/wx/share",
            type: "GET",
            data: {
                "url":h5_uri
            },
            success: function(data, textStatus, jqXHR){
                var d = eval(data);
                if (d.returnCode == 0) {
                    wx.config({
                        debug: false,
                        appId: "wx605507267852f897",
                        timestamp: "1483090709",
                        nonceStr: "da991b262e5440c68fe14109cb97358b",
                        signature: "40c2a411e5e161277e19fd947ff8964d5c0c0229",
                        jsApiList: ["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","translateVoice"],

                    });

                    wx.ready(function(){
                        wx.onMenuShareAppMessage({
                            title: 'ssssss',
                            desc: 'ssb',
                            // link: "http://ssl.zhironghao.com/api/wxShare/show?sn=" + sn + "&token=" + token,
                            link: h5_uri,
                            imgUrl: 'http://app.supeiyunjing.com/img/share.png',
                            success: function () {
                                alert("gun");
                            }
                        });
                    });
                    wx.error(function(res){
                        // console.log(res);
                    });
                }

            },
            dataType: 'json'
        });
    };

    $(".fakeloader").fakeLoader(load);
});
$.fn.fakeLoader = function(callback) {
    var spinner07 = '<div class="float-left spinner7"><div class="circ1"></div><div class="circ2"></div><div class="circ3"></div><div class="circ4"></div></div>';
    var el = $(this);
    el.html(spinner07);
    setTimeout(function(){
        $(el).fadeOut();
        callback()
    }, 1200);

};
function load()
{
    setTimeout(function(){
        $(".right-img").addClass('scb-title from-right');
        $(".left-img").addClass('scb-logo-contain from-left');
        $(".left-img-2").addClass('scb-summary from-left');
    }, 500);
}
