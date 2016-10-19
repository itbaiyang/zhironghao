app.animation('.fad', function () {
    return {
        enter: function (element, done) {
            element.css({
                opacity: 0
            });
            element.animate({
                opacity: 1
            }, 400, done);
        },
        leave: function (element, done) {
            element.css({
                opacity: 1
            });
            element.animate({
                opacity: 0
            }, 200, done);
        }
    };
});
