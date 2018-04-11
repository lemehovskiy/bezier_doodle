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


            // let canvas = $('<canvas/>',{'class':'doodle'});
            //
            // self.$element.append(canvas);
            //
            // let context = canvas[0].getContext('2d');
            //
            // context.width = 300;
            // context.height = 300;


            var canvas, context, nodes = [], mouse = {x: 0, y: 0}, color = {
                r: 0,
                g: 0,
                b: 0
            }, cycle = 90, input = false, FPS = 60;


            let total_points = 12;

            let debug = true;

            let ease = 0.01, friction = 0.98;

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

                createBezierNodes();


            }



            function onResize() {

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

            }


            function createBezierNodes() {

                for (let i = 0; i < total_points; i++) {

                    let point_angle = Math.PI * 2 * i / total_points;

                    // console.log(point_angle);

                    let x = canvas.width * 0.5;
                    let y = canvas.height * 0.5;


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
                        speed: getRandomArbitrary(0.01, 0.1),

                        point_angle: point_angle

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


                nodes.forEach(function (node) {

                    context.clearRect(0, 0, canvas.width, canvas.height);

                    node.lastX += canvas.width * 0.5 + node.disturb * Math.cos(node.point_angle) - node.lastX;
                    node.lastY += canvas.height * 0.5 + node.disturb * Math.sin(node.point_angle) - node.lastY;

                    node.x += (node.lastX + Math.cos(node.angle) * node.orbit) - node.x;
                    node.y += (node.lastY + Math.sin(node.angle) * node.orbit) - node.y;


                    node.angle += node.speed;

                });

            }


            function draw_debug_bullet(x, y, size = 10, color = '#a9a9a9'){
                context.beginPath();
                context.arc(x, y, size, 0, 2 * Math.PI);
                context.strokeStyle = color;
                context.lineWidth = 2;
                context.stroke();
                context.save();
            }


            function render() {

                var next_node, xc, yc;

                nodes.forEach(function (current_node, index) {

                    // clear();

                    next_node = index === nodes.length - 1 ? nodes[0] : nodes[index + 1];

                    xc = current_node.x + (next_node.x - current_node.x) * .5;
                    yc = current_node.y + (next_node.y - current_node.y) * .5;
                    // console.log('x' + xc);

                    draw_debug_bullet(xc, yc, 5);

                    context.strokeStyle = '#e5e5e5';
                    context.fillStyle = 'rgb' + '(' + color.r + ', ' + color.g + ', ' + color.b + ')';
                    context.globalAlpha = 0.5;
                    context.lineWidth = 5;
                    context.beginPath();
                    context.moveTo(xc, yc);


                    nodes.forEach(function (current_node, index) {

                        next_node = index === nodes.length - 1 ? nodes[0] : nodes[index + 1];

                        xc = current_node.x + (next_node.x - current_node.x) * 0.5;
                        yc = current_node.y + (next_node.y - current_node.y) * 0.5;

                        context.quadraticCurveTo(current_node.x, current_node.y, xc, yc);

                    });


                    context.fill();
                    context.stroke();
                    context.restore();


                    // draw_debug_bullet(xc, yc, 5);

                    //debug//debug//debug//debug//debug//debug

                    if (debug) {
                        nodes.forEach(function (current_node, index) {

                            next_node = index === nodes.length - 1 ? nodes[0] : nodes[index + 1];

                            xc = current_node.x + (next_node.x - current_node.x) * 0.5;
                            yc = current_node.y + (next_node.y - current_node.y) * 0.5;

                            // draw_debug_bullet(current_node.x, current_node.y, false, 3);
                            // draw_debug_bullet(xc, yc, false, 10);

                        });
                    }



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