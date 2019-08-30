var Module = (function(window, document, undefined) {

    function init() {
        var mbutton = document.getElementsByClassName("mbutton")[0];
        var nav = document.getElementsByClassName("nav")[0];

        mbutton.addEventListener("click", function() {
            nav.classList.toggle("open");
        }, false);

    }

    document.addEventListener("DOMContentLoaded", function() {
        init();
    });

})(window, document)