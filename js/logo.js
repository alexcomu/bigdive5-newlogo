/****************************
* VARIABLES                 *
*****************************/

var images = ['/img/triangle/bigdive5-02.png',
                '/img/triangle/bigdive5-03.png',
                '/img/triangle/bigdive5-04.png',
                '/img/triangle/bigdive5-05.png',
                '/img/triangle/bigdive5-06.png',
                '/img/triangle/bigdive5-07.png',
                '/img/triangle/bigdive5-08.png',
                '/img/triangle/bigdive5-09.png',
                '/img/triangle/bigdive5-10.png'],
    titles = ['5 edition', 'HACKING', 'DEVELOPMENT', 'VISUALIZATION', 'DATA SCIENCE'],
    text_apex = 'th';

var width = 910,
    height = 410,
    nodes_number=190,
    title_cont = 0;


var svg = d3.select("body").append("svg").attr("class","mySvg")
    .attr("width", width)
    .attr("height", height);

var bigdive = {
    width: 400,
    height: 250,
    xpos: 90,
    ypos: 80,
    forcex: 300,
    forcey: 210,
    logo_width: 250,
    logo_height: 71,
    logox: 165,
    logoy: 140,
    texty: 260,
    apex_texty: 240
};

var nodes = d3.range(nodes_number).map(function() { return {radius: Math.random() * 12 + 7}; }),
    root = nodes[0];

var force = d3.layout.force()
    .gravity(0.05)
    .charge(function(d, i) { return i ? 0 : -2000; })
    .nodes(nodes)
    .size([width, height]);

root.radius = 0;
root.fixed = true;
force.start();

// TRIANGLE IMAGES
svg.selectAll("image")
    .data(nodes.slice(1))
    .enter().append("image")
    .attr("class", "triangle")
    .attr("width", function(d) { return d.radius; })
    .attr("height", function(d) { return d.radius; })
    .attr("xlink:href", function(d, i) { return images[i % images.length]; });

// BIG DIVE RECTANGLE
svg.append("rect")
    .attr("class", "bigdive_container")
    .attr("x", bigdive.xpos)
    .attr("y", bigdive.ypos)
    .attr("width", bigdive.width)
    .attr("height", bigdive.height)
    .attr("fill", "white");

// BIG DIVE LOGO
svg.append("image")
    .attr("class", "bigdive_logo")
    .attr('width', bigdive.logo_width)
    .attr('height', bigdive.logo_height)
    .attr('x', bigdive.logox)
    .attr('y', bigdive.logoy)
    .attr("xlink:href", "/img/bigdive5-logo.png");

// Text
svg.append("text")
    .attr("class", "bigdive_title")
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .attr("x", function(){
        return bigdive.logox + (bigdive.logo_width/2);
    })
    .attr("y", bigdive.texty)
    .attr("font-family", "Montserrat;")
    .attr("font-size", "28px")
    .text("5 edition");

svg.append("text")
    .attr("class", "apex")
    .style("fill", "black")
    .attr("x", function(){
        return bigdive.logox + (bigdive.logo_width/2) - 43;
    })
    .attr("y", bigdive.apex_texty)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .text(text_apex);

/****************************
* ACTIONS                   *
*****************************/

var force_timer = setInterval(function(){
    root.px = bigdive.forcex;
    root.py = bigdive.forcey;
    force.resume();
}, 50);

var text_timer = setInterval(function(){
    title_cont++;
    set_title();
}, 1500);

force.on("tick", function(e) {
    var q = d3.geom.quadtree(nodes),
    i = 0,
    n = nodes.length;
    while (++i < n) q.visit(collide(nodes[i]));

    svg.selectAll(".triangle")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; });
});

svg.on("mousemove", function() {
    var p1 = d3.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
    force.resume();
});

/****************************
* UTILS                      *
*****************************/

function set_title(){
    title_cont = title_cont % titles.length;
    svg.select(".apex").style("opacity", function(){
        if(title_cont) return 0;
        return 1;
    });
    svg.select(".bigdive_title").html(function(){ return titles[title_cont];})
}

function collide(node) {
    var r = node.radius + 16,
    nx1 = node.x - r,
    nx2 = node.x + r,
    ny1 = node.y - r,
    ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + quad.point.radius;
            if (l < r) {
                l = (l - r) / l * .5;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}
