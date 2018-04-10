/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/bezier_doodle
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var BezierDoodle = function BezierDoodle(element, options) {
        _classCallCheck(this, BezierDoodle);

        var self = this;

        //extend by function call
        self.settings = $.extend(true, {

            test_property: false

        }, options);

        self.$element = $(element);

        //extend by data options
        self.data_options = self.$element.data('bezier-doodle');
        self.settings = $.extend(true, self.settings, self.data_options);

        // let canvas = $('<canvas/>',{'class':'doodle'});
        //
        // self.$element.append(canvas);
        //
        // let context = canvas[0].getContext('2d');
        //
        // context.width = 300;
        // context.height = 300;


        var canvas,
            context,
            nodes = [],
            mouse = { x: 0, y: 0 },
            color = {
            r: 0,
            g: 0,
            b: 0
        },
            cycle = 90,
            input = false,
            FPS = 60;

        function init() {

            var body = document.querySelector('body');

            canvas = document.createElement('canvas');

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            canvas.style.position = 'absolute';
            canvas.style.top = 0;
            canvas.style.bottom = 0;
            canvas.style.left = 0;
            canvas.style.right = 0;
            canvas.style.zIndex = -1;
            canvas.style.cursor = 'pointer';

            body.appendChild(canvas);

            context = canvas.getContext('2d');

            window.onresize = onResize;

            createBezierNodes();
        }

        function onResize() {

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createBezierNodes() {

            for (var quantity = 0, len = 3; quantity < len; quantity++) {

                var theta = Math.PI * 2 * quantity / len;

                var x = canvas.width * 0.5;
                var y = canvas.height * 0.5;

                nodes.push({

                    x: x,
                    y: y,
                    vx: 0,
                    vy: 0,

                    lastX: x,
                    lastY: y,

                    min: 150,
                    max: 250,
                    disturb: 150,

                    orbit: 20,
                    angle: Math.random() * Math.PI * 2,
                    speed: 0.05 + Math.random() * 0.05,

                    theta: theta

                });
            }

            loop();
        }

        function loop() {

            clear();
            update();
            render();

            requestAnimFrame(loop);
        }

        function clear() {

            context.clearRect(0, 0, innerWidth, innerHeight);
        }

        function update() {

            var ease = 0.01,
                friction = 0.98;

            nodes.forEach(function (node) {

                context.clearRect(0, 0, canvas.width, canvas.height);

                node.lastX += (canvas.width * 0.5 + node.disturb * Math.cos(node.theta) - node.lastX) * 0.08;
                node.lastY += (canvas.height * 0.5 + node.disturb * Math.sin(node.theta) - node.lastY) * 0.08;

                // Motion
                node.x += (node.lastX + Math.cos(node.angle) * node.orbit - node.x) * 0.08;
                node.y += (node.lastY + Math.sin(node.angle) * node.orbit - node.y) * 0.08;

                // Ease
                node.vx += (node.min - node.disturb) * ease;

                // Friction
                node.vx *= friction;

                node.disturb += node.vx;

                if (input) {
                    node.disturb += (node.max - node.disturb) * reactivity;
                }

                node.angle += node.speed;
            });
        }

        function render() {

            var currentIndex, nextIndex, xc, yc;

            nodes.forEach(function () {

                clear();

                currentIndex = nodes[nodes.length - 1];
                nextIndex = nodes[0];

                xc = currentIndex.x + (nextIndex.x - currentIndex.x) * 0.5;
                yc = currentIndex.y + (nextIndex.y - currentIndex.y) * 0.5;

                context.save();
                context.strokeStyle = '#e5e5e5';
                context.fillStyle = 'rgb' + '(' + color.r + ', ' + color.g + ', ' + color.b + ')';
                context.globalAlpha = 0.5;
                context.lineWidth = 5;
                context.beginPath();
                context.moveTo(xc, yc);

                for (var i = 0; i < nodes.length; i++) {

                    currentIndex = nodes[i];
                    nextIndex = i + 1 > nodes.length - 1 ? nodes[i - nodes.length + 1] : nodes[i + 1];

                    xc = currentIndex.x + (nextIndex.x - currentIndex.x) * 0.5;
                    yc = currentIndex.y + (nextIndex.y - currentIndex.y) * 0.5;

                    context.quadraticCurveTo(currentIndex.x, currentIndex.y, xc, yc);
                }

                context.fill();
                context.stroke();
                context.restore();

                context.save();
                context.globalAlpha = 1.0;
                context.lineWidth = 1;
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.strokeStyle = '#a9a9a9';
                context.fillStyle = '#a9a9a9';

                context.restore();
            });
        }

        window.requestAnimFrame = function () {

            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {

                window.setTimeout(callback, 1000 / FPS);
            };
        }();

        init();
    };

    $.fn.bezierDoodle = function () {
        var $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i = void 0,
            ret = void 0;
        for (i = 0; i < length; i++) {
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object' || typeof opt == 'undefined') $this[i].bezier_doodle = new BezierDoodle($this[i], opt);else ret = $this[i].bezier_doodle[opt].apply($this[i].bezier_doodle, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };
})(jQuery);

/***/ })
/******/ ]);