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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var BezierDoodle = function () {
        function BezierDoodle(element, options) {
            _classCallCheck(this, BezierDoodle);

            var self = this;

            //extend by function call
            self.settings = $.extend(true, {
                radius: 150,
                magnetic_radius: 200,
                segments_count: 14,
                control_point_move_radius: 10,
                debug: false

            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('bezier-doodle');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.control_points = [];

            var canvas = void 0,
                context = void 0,
                nodes = [],
                FPS = 30,
                mouse_pos = {},
                mouse_over = false,
                is_shown = false;

            init();

            function init() {

                window.requestAnimFrame = function () {
                    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                        window.setTimeout(callback, 1000 / FPS);
                    };
                }();

                var body = document.querySelector('body');

                canvas = document.createElement('canvas');

                self.$element.append(canvas);

                canvas.style.position = 'absolute';
                canvas.style.top = 0;
                canvas.style.bottom = 0;
                canvas.style.left = 0;
                canvas.style.right = 0;
                canvas.style.zIndex = 2;
                canvas.style.cursor = 'pointer';

                context = canvas.getContext('2d');

                canvas.width = self.$element.outerWidth();
                canvas.height = self.$element.outerWidth();

                // window.onresize = on_resize;

                canvas.addEventListener('mousemove', function (evt) {
                    mouse_pos = get_mouse_pos(canvas, evt);
                    mouse_over = true;
                }, false);

                element.addEventListener("mouseout", function () {
                    mouse_over = false;
                    self.control_points.forEach(function (control_point) {
                        TweenLite.to(control_point, 1, { radius: self.settings.radius });
                    });
                }, false);

                create_control_points();
            }

            function create_control_points() {

                for (var i = 0; i < self.settings.segments_count; i++) {

                    var point_angle = Math.PI * 2 * i / self.settings.segments_count;

                    var x = canvas.width * 0.5;
                    var y = canvas.height * 0.5;

                    self.control_points.push({

                        x: x,
                        y: y,
                        vx: 0,
                        vy: 0,

                        lastX: x,
                        lastY: y,

                        min: 50,
                        max: 100,
                        radius: self.settings.radius,

                        orbit: self.settings.control_point_move_radius,
                        angle: Math.random() * Math.PI * 2,
                        speed: get_random_arbitrary(0.05, 0.1),

                        point_angle: point_angle,

                        index: i

                    });

                    nodes.push({
                        x: 0,
                        y: 0
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
                self.control_points.forEach(function (control_point) {

                    context.clearRect(0, 0, canvas.width, canvas.height);

                    control_point.lastX += canvas.width * 0.5 + control_point.radius * Math.cos(control_point.point_angle) - control_point.lastX;
                    control_point.lastY += canvas.height * 0.5 + control_point.radius * Math.sin(control_point.point_angle) - control_point.lastY;

                    control_point.x += control_point.lastX + Math.cos(control_point.angle) * control_point.orbit - control_point.x;
                    control_point.y += control_point.lastY + Math.sin(control_point.angle) * control_point.orbit - control_point.y;

                    control_point.angle += control_point.speed;
                });

                if (mouse_over) {
                    self.control_points.forEach(function (control_point, index) {
                        var a = mouse_pos.x - control_point.x;
                        var b = mouse_pos.y - control_point.y;
                        var distance = Math.sqrt(a * a + b * b);

                        if (distance < 60) {
                            TweenLite.to(self.control_points[index], 1, { radius: self.settings.magnetic_radius });
                        } else if (distance > 80) {
                            TweenLite.to(self.control_points[index], 1, { radius: self.settings.radius });
                        }
                    });
                }

                var next_control_point = void 0,
                    current_control_point = void 0;

                nodes.forEach(function (node, index) {
                    current_control_point = self.control_points[index];
                    next_control_point = index === self.settings.segments_count - 1 ? self.control_points[0] : self.control_points[index + 1];

                    node.x = current_control_point.x + (next_control_point.x - current_control_point.x) * 0.5;
                    node.y = current_control_point.y + (next_control_point.y - current_control_point.y) * 0.5;
                });
            }

            function draw_debug_bullet(x, y) {
                var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
                var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#a9a9a9';

                context.beginPath();
                context.arc(x, y, size, 0, 2 * Math.PI);
                context.strokeStyle = color;
                context.lineWidth = 2;
                context.stroke();
                context.restore();
            }

            function get_mouse_pos(canvas, evt) {
                var rect = canvas.getBoundingClientRect();
                return {
                    x: evt.clientX - rect.left,
                    y: evt.clientY - rect.top
                };
            }

            function render() {
                clear();

                context.beginPath();
                context.moveTo(nodes[0].x, nodes[0].y);

                nodes.forEach(function (node, index) {
                    var next_node = index === self.settings.segments_count - 1 ? nodes[0] : nodes[index + 1];
                    var current_control_point_index = index === self.settings.segments_count - 1 ? 0 : index + 1;
                    context.quadraticCurveTo(self.control_points[current_control_point_index].x, self.control_points[current_control_point_index].y, next_node.x, next_node.y);
                    context.fill();
                    context.restore();
                });
            }

            function get_random_arbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
        }

        _createClass(BezierDoodle, [{
            key: 'show',
            value: function show() {
                var self = this;

                self.control_points.forEach(function (control_point) {
                    TweenLite.to(control_point, 1, { radius: self.settings.radius });
                });
            }
        }, {
            key: 'hide',
            value: function hide() {}
        }]);

        return BezierDoodle;
    }();

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