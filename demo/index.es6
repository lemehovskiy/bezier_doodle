require("./sass/style.scss");

require ("jquery");

require('../build/bezier_doodle');

import {TweenMax} from "gsap";


if (NODE_ENV == 'development') {
    console.log('NODE_ENV == dev');
}


$(document).ready(function () {

    $('.doodle-sample').on('show.bd', function(){
        alert('show');
    })

    $('.doodle-sample').on('shown.bd', function(){
        alert('shown');
    })

    $('.doodle-sample').on('hide.bd', function(){
        alert('hide');
    })

    $('.doodle-sample').on('hidden.bd', function(){
        alert('hidden');
    })

    $('.doodle-sample').bezierDoodle();


    $('.doodle-trigger').on('click', function(){

        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $('.doodle-sample').bezierDoodle('hide');
        }
        else {
            $(this).addClass('open');
            $('.doodle-sample').bezierDoodle('show');
        }
    })

});