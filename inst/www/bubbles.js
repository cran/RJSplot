var nodes = [];

var docSize = viewport(),
    width = docSize.width - 40,
    height = docSize.height - 40;

var collisionPadding = 4,
    clipPadding = 4,
    minRadius = 16, // minimum collision radius
    maxRadius = 65; // also determines collision search radius

var force = d3.layout.force()
    .charge(0)
    .size([width, height])
    .on("tick", tick);

var drag = d3.behavior.drag()
      .on("drag", function(d,i) {
          var gLayout = d3.select("svg>g.layout"),
              pos = d3.transform(gLayout.attr("transform"));
              pos.translate[0] += d3.event.dx;
              pos.translate[1] += d3.event.dy;
          gLayout.attr("transform", "translate(" + pos.translate[0] + "," + pos.translate[1] + ")");
    });

var r = d3.scale.sqrt()
    .range([minRadius, maxRadius]);

window.onload = function(){

var data = JSON.parse(d3.select("#data").text());

  var len = data.nodes[0].length;

  for(var i = 0; i<len; i++){
    var node = {};
    node.name = data.nodes[0][i];
    node.a = data.nodes[1][i];
    node.b = data.nodes[2][i];
    node.size = data.nodes[3] ? data.nodes[3][i] : node.a+node.b;
    nodes.push(node);
  }

r.domain(d3.extent(nodes, function(d) { return d.size; }))

nodes.forEach(function(d) {
    d.r = r(d.size);
    d.cr = Math.max(minRadius, d.r);
    d.k = fraction(d.a, d.b);
    if (isNaN(d.k)) d.k = .5;
    if (isNaN(d.x)) d.x = (1 - d.k) * width + Math.random();
    d.bias = .5 - Math.max(.1, Math.min(.9, d.k));
});

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

    svg.append("style")
      .text("text { font-family: sans-serif; }"+
".g-a { fill: #aec7e8; } "+
".g-b { fill: #ff9896; } "+
".g-split { stroke: #000; stroke-opacity: .18; shape-rendering: crispEdges; } "+
".node text { text-anchor: middle; }")

    svg.append("rect")
        .style("opacity",0)
        .attr("width",width)
        .attr("height",height)
        .call(drag);

    svg.append("g")
      .attr("class","layout")

force.nodes(nodes).start();
updateNodes();
tick({alpha: 0}); // synchronous update

if(data.names)
  displayLegend(data.names);

displayButtons();
bioinfoLogo();
}

function displayLegend(names){
  var c = ["#aec7e8","#ff9896"];

  var legend = d3.select("svg").selectAll(".legend")
      .data(names)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (10+i*20) + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", 10)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d,i){ return c[i]; });

  // draw legend text
  legend.append("text")
      .attr("x", 32)
      .attr("y", 15)
      .text(String)
}

// Update the displayed nodes.
function updateNodes() {
  var node = d3.select("svg>g.layout").selectAll(".node").data(nodes, function(d) { return d.name; });

  node.exit().remove();

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  var aEnter = nodeEnter.append("g")
      .attr("class", "g-a");

  aEnter.append("clipPath")
      .attr("id", function(d,i) { return "g-clip-a-" + i; })
    .append("rect");

  aEnter.append("circle");

  var bEnter = nodeEnter.append("g")
      .attr("class", "g-b");

  bEnter.append("clipPath")
      .attr("id", function(d,i) { return "g-clip-b-" + i; })
    .append("rect");

  bEnter.append("circle");

  nodeEnter.append("line")
      .attr("class", "g-split");

  nodeEnter.append("text")
    .text(function(d){ return d.name; })
    .style("font-size", function(d) { return Math.max(8, d.r / Math.max(2,Math.pow(d.name.length,1/2))) + "px"; })

  nodeEnter.append("text")
    .attr("y", function(d) { return Math.max(6, d.r / 2); })
    .text(function(d){ return formatter(d.a) + " - " + formatter(d.b); })
    .style("font-size", function(d) { return Math.max(4, d.r / 4) + "px"; })

  node.selectAll("rect")
      .attr("y", function(d) { return -d.r - clipPadding; })
      .attr("height", function(d) { return 2 * d.r + 2 * clipPadding; });

  node.select(".g-a rect")
      .style("display", function(d) { return d.k > 0 ? null : "none" })
      .attr("x", function(d) { return -d.r - clipPadding; })
      .attr("width", function(d) { return 2 * d.r * d.k + clipPadding; });

  node.select(".g-b rect")
      .style("display", function(d) { return d.k < 1 ? null : "none" })
      .attr("x", function(d) { return -d.r + 2 * d.r * d.k; })
      .attr("width", function(d) { return 2 * d.r; });

  node.select(".g-a circle")
      .attr("clip-path", function(d,i) { return d.k < 1 ? "url(#g-clip-a-" + i + ")" : null; });

  node.select(".g-b circle")
      .attr("clip-path", function(d,i) { return d.k > 0 ? "url(#g-clip-b-" + i + ")" : null; });

  node.select(".g-split")
      .attr("x1", function(d) { return -d.r + 2 * d.r * d.k; })
      .attr("y1", function(d) { return -Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)); })
      .attr("x2", function(d) { return -d.r + 2 * d.r * d.k; })
      .attr("y2", function(d) { return Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)); });

  node.selectAll("circle")
      .attr("r", function(d) { return d.r; });
}

// Simulate forces and update node and label positions on tick.
function tick(e) {
  d3.selectAll("svg .node")
      .each(bias(e.alpha * 105))
      .each(collide(.5))
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  d3.selectAll(".g-label")
      .style("left", function(d) { return (d.x - d.dx / 2) + "px"; })
      .style("top", function(d) { return (d.y - d.dy / 2) + "px"; });
}

// A left-right bias causing nodes to orient by side preference.
function bias(alpha) {
  return function(d) {
    d.x += d.bias * alpha;
  };
}

// Resolve collisions between nodes.
function collide(alpha) {
  var q = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.cr + maxRadius + collisionPadding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    q.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d) && d.other !== quad.point && d !== quad.point.other) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.cr + quad.point.r + collisionPadding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

// Given two quantities a and b, returns the fraction to split the circle a + b.
function fraction(a, b) {
  var k = a / (a + b);
  if (k > 0 && k < 1) {
    var t0, t1 = Math.pow(12 * k * Math.PI, 1 / 3);
    for (var i = 0; i < 10; ++i) { // Solve for theta numerically.
      t0 = t1;
      t1 = (Math.sin(t0) - t0 * Math.cos(t0) + 2 * k * Math.PI) / (1 - Math.cos(t0));
    }
    k = (1 - Math.cos(t1 / 2)) / 2;
  }
  return k;
}
