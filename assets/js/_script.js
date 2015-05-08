/* Fake placeholder support in browsers that do not support the HTML input placeholder attribute. Ideally this would be paired with a javascript function that prevents form submit if the a given input's value is equivalent to the placeholder attribute. */
/*
function initPlaceholderSupport() {
    if( ! Modernizr.input.placeholder ) {
        $('[placeholder]').focus(function() {
          var input = $(this);
          if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
          }
        }).blur(function() {
          var input = $(this);
          if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
          }
        }).blur();
    }
}

initPlaceholderSupport();
*/

/* smooth scroll */
/*
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1500);
        return false;
      }
    }
  });
});
*/

$(document).ready( function()	{

    $('.button-footer').click(function(e){
            e.preventDefault();
            $('.form-popup').addClass("active");
    });

    $('.form-exit').click(function(){
            $('.form-popup').removeClass("active");
    });

    ( function map() {

        var width = $('.map').width(),
            height = width,
            graticule = d3.geo.graticule(),
            norman = [-97.44, 35.22], //35.2200° N, 97.4400° W norman
            tunisia = [9, 34], //34.0000° N, 9.0000° E tunisia
            delay = 1000,
            duration = 4000;

        var projection = d3.geo.orthographic()
            .scale(width / 2.05)
            .clipAngle(90)
            .translate([width / 2, height / 2]);

        var canvas = d3.select(".map").append("canvas")
            .attr("width", width)
            .attr("height", height);

        var context = canvas.node().getContext("2d");

        var path = d3.geo.path()
            .projection(projection)
            .context(context);

        d3.json("/assets/data/world2.json", function(error, world) {

            var countries = topojson.feature(world, world.objects.countries),
                grid = graticule(),
                globe = {type:"Sphere"};

            function projrotate(array){

                projection.rotate([-array[0], -array[1]]);

            }; //rotate function

            function draw() {

                context.beginPath();
                path(countries);
                context.fillStyle = "#bbb";
                context.fill();
                context.lineWidth = .25;
                context.strokeStyle = "#fff";
                context.stroke();
                context.closePath();

                context.beginPath();
                path(grid);
                context.lineWidth = .5;
                context.strokeStyle = "#ddd";
                context.stroke();
                context.closePath();

                context.beginPath();
                path(globe);
                context.lineWidth = 1;
                context.strokeStyle = "#000";
                context.stroke();
                context.closePath();

                context.beginPath();
                path(projection(-[tunisia[0], -tunisia[1]]));
                context.lineWidth = 1;
                context.strokeStyle = "#000";
                context.stroke();
                context.closePath();

            }; //draw function

            ( function transition() {

                projrotate(tunisia)
                draw();

                d3.transition()
                    .delay(delay)
                    .duration(duration)
                    .tween("rotate", function() {

                        var r = d3.interpolate(projection.rotate(), [-norman[0], -norman[1]]);

                        return function(t) {

                            projection.rotate(r(t));
                            context.clearRect(0, 0, width, height);
                            draw();

                        }

                    });

            }) (); //transition

        }); //d3 json

    }) (); //map

}); //document ready
