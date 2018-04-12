/*
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/bezier_doodle
 */

'use strict';

(function ($) {

    class BezierDoodle {

        constructor(element, options) {

            let self = this;

            //extend by function call
            self.settings = $.extend(true, {

                test_property: false

            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('bezier-doodle');
            self.settings = $.extend(true, self.settings, self.data_options);



            var canvas, context, control_points = [], nodes = [], mouse = {x: 0, y: 0}, color = {
                r: 0,
                g: 0,
                b: 0
            }, cycle = 90, input = false, FPS = 60;


            let total_points = 32;

            let debug = true;

            let ease = 0.01, friction = 0.98;

            let pairs = [];

            let mouse_pos = {};

            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }


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


                self.$element.append(canvas);
                // body.appendChild(canvas);


                context = canvas.getContext('2d');


                window.onresize = onResize;

                create_control_points();

                canvas.addEventListener('mousemove', function(evt) {
                    mouse_pos = getMousePos(canvas, evt);

                }, false);


            }


            function onResize() {

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

            }


            function create_control_points() {

                for (let i = 0; i < total_points; i++) {

                    let point_angle = Math.PI * 2 * i / total_points;


                    let x = canvas.width * 0.5;
                    let y = canvas.height * 0.5;


                    control_points.push({

                        x: x,
                        y: y,
                        vx: 0,
                        vy: 0,

                        lastX: x,
                        lastY: y,

                        min: 50,
                        max: 100,
                        disturb: 150,

                        orbit: 5,
                        angle: Math.random() * Math.PI * 2,
                        speed: getRandomArbitrary(0.05, 0.1),

                        point_angle: point_angle,

                        index: i

                    });

                    nodes.push({
                        x: 0,
                        y: 0
                    })

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
                control_points.forEach(function (control_point) {

                    context.clearRect(0, 0, canvas.width, canvas.height);

                    control_point.lastX += canvas.width * 0.5 + control_point.disturb * Math.cos(control_point.point_angle) - control_point.lastX;
                    control_point.lastY += canvas.height * 0.5 + control_point.disturb * Math.sin(control_point.point_angle) - control_point.lastY;

                    control_point.x += (control_point.lastX + Math.cos(control_point.angle) * control_point.orbit) - control_point.x;
                    control_point.y += (control_point.lastY + Math.sin(control_point.angle) * control_point.orbit) - control_point.y;


                    control_point.angle += control_point.speed;

                });

                control_points.forEach(function(control_point, index){

                    let a = mouse_pos.x - control_point.x;
                    let b = mouse_pos.y - control_point.y;
                    let distance = Math.sqrt(a * a + b * b);

                    var tl = new TimelineLite();

                    if (distance < 50) {
                        TweenLite.to(control_points[index], 1, {disturb: 200})
                    }

                    else {
                        TweenLite.to(control_points[index], 1, {disturb: 150})
                    }
                })


                let next_control_point, current_control_point;

                nodes.forEach(function (node, index) {
                    current_control_point = control_points[index];
                    next_control_point = index === total_points - 1 ? control_points[0] : control_points[index + 1];

                    node.x = current_control_point.x + (next_control_point.x - current_control_point.x) * 0.5;
                    node.y = current_control_point.y + (next_control_point.y - current_control_point.y) * 0.5;
                })


            }


            function draw_debug_bullet(x, y, size = 10, color = '#a9a9a9') {
                context.beginPath();
                context.arc(x, y, size, 0, 2 * Math.PI);
                context.strokeStyle = color;
                context.lineWidth = 2;
                context.stroke();
                context.restore();
            }

            function getMousePos(canvas, evt) {
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
                    let next_node = index === total_points - 1 ? nodes[0] : nodes[index + 1];
                    let current_control_point_index = index === total_points - 1 ? 0 : index + 1;
                    context.quadraticCurveTo(control_points[current_control_point_index].x, control_points[current_control_point_index].y, next_node.x, next_node.y);
                    context.fill();
                    context.restore();
                });
                // context.stroke();

                // draw_debug_bullet(node.x, node.y, 10, '#FF0000');


            }


            window.requestAnimFrame = (function () {

                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||

                    function (callback) {

                        window.setTimeout(callback, 1000 / FPS);

                    };

            })();

            init();


        }
    }


    $.fn.bezierDoodle = function () {
        let $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i,
            ret;
        for (i = 0; i < length; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                $this[i].bezier_doodle = new BezierDoodle($this[i], opt);
            else
                ret = $this[i].bezier_doodle[opt].apply($this[i].bezier_doodle, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };

})(jQuery);