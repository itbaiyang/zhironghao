// go_apply = "http://172.17.3.158:8000/#/article/show/";
go_apply = "http://test.zhironghao.com/#/article/show/";
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
