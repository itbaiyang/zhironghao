// go_apply = "http://172.17.3.158:8000/#/article/apply/";
go_apply = "http://test.zhironghao.com/#/article/apply/";
// go_apply = "http://app.supeiyunjing.com/#/article/apply/";

var carousel = new Carousel("#carousel")
carousel.init()
function changePage() {
    carousel.showPane(1)
}
function goApply(url) {
    window.location.href = go_apply + url
}