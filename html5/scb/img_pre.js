$(function(){
    var img = new Image();
    img.src = "./img/bg.png"
    if(img.width == 0){

    }else {
        $("#right-img").addClass('from-right')
        $(".left-img").addClass('from-left')
    }
});
function test() {

}