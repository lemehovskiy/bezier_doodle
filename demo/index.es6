require("./sass/style.scss");

require ("jquery");

require('../build/bezier_doodle');

import {TweenMax} from "gsap";


if (NODE_ENV == 'development') {
    console.log('NODE_ENV == dev');
}


$(document).ready(function () {

    $('.doodle-sample').bezierDoodle();

    $('.doodle-sample').bezierDoodle('hide');

});