(function ($) {
    $.fn.fakeLoader = function() {

        //Customized Spinners
        var spinner07 = '<div class="float-left spinner7"><div class="circ1"></div><div class="circ2"></div><div class="circ3"></div><div class="circ4"></div></div>';

        //The target
        var el = $(this);

        el.html(spinner07);
        setTimeout(function(){
            $(el).fadeOut();
        }, 1200);

    }; // End Fake Loader

}(jQuery));