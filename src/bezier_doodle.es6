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
                radius: 100,
                magnetic_radius: 150,
                segments_count: 14,
                control_point_move_radius: 10,
                debug: false

            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('bezier-doodle');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.control_points = [];
            self.is_hidden = true;

            self.canvas_rect = {};

            let canvas,
                context,
                nodes = [],
                FPS = 30,
                mouse_pos = {},
                input = false;


            init();

            function init() {

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

                let body = document.querySelector('body');

                canvas = document.createElement('canvas');

                self.$element.append(canvas);

                self.canvas_rect = canvas.getBoundingClientRect();

                canvas.style.position = 'absolute';
                canvas.style.top = 0;
                canvas.style.bottom = 0;
                canvas.style.left = 0;
                canvas.style.right = 0;
                canvas.style.zIndex = 2;
                canvas.style.cursor = 'pointer';

                context = canvas.getContext('2d');

                canvas.width = self.settings.magnetic_radius * 2 + 20;
                canvas.height = self.settings.magnetic_radius * 2 + 20;

                window.onresize = on_resize;


                if('ontouchstart' in window) {
                    canvas.addEventListener('touchstart', on_touch_start, false);
                    canvas.addEventListener('touchmove', on_touch_start, false);
                    canvas.addEventListener('touchend', on_touch_end, false);
                }
                else {
                    canvas.addEventListener('mousemove', function (evt) {
                        mouse_pos = get_mouse_pos(canvas, evt);
                        input = true;

                    }, false);

                    element.addEventListener ("mouseout", function(){
                        input = false;
                        self.control_points.forEach(function(control_point){
                            TweenLite.to(control_point, 1, {radius: self.settings.radius});
                        })
                    }, false);
                }

                create_control_points();

            }

            function on_touch_start(event) {

                event.preventDefault();

                input = true;

                mouse_pos.x = event.touches[0].pageX - self.canvas_rect.left;
                mouse_pos.y = event.touches[0].pageY - self.canvas_rect.top;

            }

            function on_touch_end(event){
                input = false;

                self.control_points.forEach(function(control_point){
                    TweenLite.to(control_point, 1, {radius: self.settings.radius});
                })
            }

            function on_resize(){
                let self = this;

                self.canvas_rect = canvas.getBoundingClientRect();
            }

            function create_control_points() {

                for (let i = 0; i < self.settings.segments_count; i++) {

                    let point_angle = Math.PI * 2 * i / self.settings.segments_count;

                    let x = canvas.width * 0.5;
                    let y = canvas.height * 0.5;

                    self.control_points.push({

                        x: x,
                        y: y,
                        vx: 0,
                        vy: 0,

                        lastX: x,
                        lastY: y,

                        min: 50,
                        max: 100,
                        radius: 60,

                        orbit: self.settings.control_point_move_radius,
                        angle: Math.random() * Math.PI * 2,
                        speed: get_random_arbitrary(0.05, 0.1),

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

                if (!self.is_hidden) {
                    clear();
                    update();
                    render();
                }

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

                    control_point.x += (control_point.lastX + Math.cos(control_point.angle) * control_point.orbit) - control_point.x;
                    control_point.y += (control_point.lastY + Math.sin(control_point.angle) * control_point.orbit) - control_point.y;

                    control_point.angle += control_point.speed;
                });

                if (input) {
                    self.control_points.forEach(function (control_point, index) {
                        let a = mouse_pos.x - control_point.x;
                        let b = mouse_pos.y - control_point.y;
                        let distance = Math.sqrt(a * a + b * b);

                        if (distance < 60) {
                            TweenLite.to(self.control_points[index], 1, {radius: self.settings.magnetic_radius});
                        }

                        else if (distance > 80) {
                            TweenLite.to(self.control_points[index], 1, {radius: self.settings.radius});
                        }
                    })
                }

                let next_control_point, current_control_point;

                nodes.forEach(function (node, index) {
                    current_control_point = self.control_points[index];
                    next_control_point = index === self.settings.segments_count - 1 ? self.control_points[0] : self.control_points[index + 1];

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

            function get_mouse_pos(canvas, evt) {

                return {
                    x: evt.clientX - self.canvas_rect.left,
                    y: evt.clientY - self.canvas_rect.top
                };
            }

            function render() {
                clear();

                context.beginPath();
                context.moveTo(nodes[0].x, nodes[0].y);

                nodes.forEach(function (node, index) {
                    let next_node = index === self.settings.segments_count - 1 ? nodes[0] : nodes[index + 1];
                    let current_control_point_index = index === self.settings.segments_count - 1 ? 0 : index + 1;
                    context.quadraticCurveTo(self.control_points[current_control_point_index].x, self.control_points[current_control_point_index].y, next_node.x, next_node.y);
                    context.fill();
                    context.restore();
                });
            }

            function get_random_arbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
        }

        hide(){
            let self = this;

            self.$element.removeClass('open');
            self.$element.trigger('hide.bd');
            self.control_points.forEach(function(control_point){
                let tl = new TimelineLite();

                tl.to(control_point, 0.5, {radius: 60});
                tl.to(self.$element, 0.7, {opacity: 0, onComplete: function(){
                    self.is_hidden = true;
                    self.$element.trigger('hidden.bd');
                }}, '-=0.5');
            })
        }

        show(){
            let self = this;

            self.$element.trigger('show.bd');
            self.$element.addClass('open');

            self.is_hidden = false;

            self.control_points.forEach(function(control_point){
                let tl = new TimelineLite();

                tl.to(control_point, 0.8, {radius: self.settings.radius});
                tl.to(self.$element, 0.3, {opacity: 1, onComplete: function(){
                    self.$element.trigger('shown.bd');
                }}, '-=.8');

            })
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