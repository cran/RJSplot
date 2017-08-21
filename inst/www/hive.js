var docSize = viewport(),
    width = Math.min(docSize.width,docSize.height) - 100,
    height = width,
    innerRadius = height/20,
    outerRadius = height/2-20;

var radius = d3.scale.linear()
    .range([innerRadius, outerRadius]);

var color = d3.scale.category10();

window.onload = function(){

var body = d3.select("body");

  // Load the data
  var graph = JSON.parse(d3.select("#data").text()),
      nodes = [],
      links = graph.links,
      attr = graph.attr?graph.attr:{},
      options = graph.options?graph.options:{},
      cex = options.cex?options.cex:1,
      defaultInfo;

body.append("p").attr("id","info")
  .style({"font-family": "sans-serif", "font-size": (12*cex)+"px", "margin":"20px 30px"});

var svg = body.append("div")
    .attr("class","plot")
    .style("text-align","center")
    .append("svg")
      .attr("width", width)
      .attr("height", height)

  svg.append("style").text(
".axis { stroke: #000; stroke-width: 1.5px; }"+
".node circle { stroke: #fff; }"+
".link { fill: none; stroke: #999; stroke-opacity: .3; }"+
".link.active { stroke: red; stroke-width: 2px; stroke-opacity: 1; }"+
".node circle.active { stroke: red; stroke-width: 3px; }");

  svg = svg.append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  // Prepare nodes
  graph.nodes.forEach(function(n){
    var nName = n.name,
    nGroup = attr.group?n[attr.group]:"undefined",
    nColor = attr.color?n[attr.color]:"undefined";
    delete n.name;
    nodes.push({name:nName,group:nGroup,color:nColor,attr:n,connectors:[]});
  });

  var axes = d3.set(nodes.map(function(d){ return d.group; })).values();

  // Calculate all necessary axes to display
    var allAxes = [];
    for(var i = 0; i<axes.length; i++){
      var a = "-"+((i==0)?axes[axes.length-1]:axes[i-1]),
          b = "-"+((i==axes.length-1)?axes[0]:axes[i+1]);
      if(a==b)
        if(i==0)
          a = "";
        else
          b = "";
      allAxes.push(axes[i]+a);
      allAxes.push(axes[i]+b);
    }
    axes = allAxes;

  var angle = d3.scale.ordinal()
    .domain(axes)
    .range(axes.map(function(d,i){ return 2*Math.PI/axes.length*i; }));

  var size = d3.scale.linear()
      .range([3,12])
      .domain(d3.extent(nodes, function(d) { return d.attr[attr.size]; }));

  var weight = d3.scale.linear()
      .range([1,5])
      .domain(d3.extent(links, function(d) { return d[attr.weight]; }));

  // Prepare node connectors
  nodes.forEach(function(node){
    axes.forEach(function(axis){
      var a = axis.split("-");
      if(a[0]==node.group)
        node.connectors.push({node:node,group:axis})
    })
  })

  // Prepare links
  links.forEach(function(link) {
    link.source = nodes[link.source];
    link.target = nodes[link.target];
    var sAxis = link.source.group+"-"+link.target.group,
        tAxis = link.target.group+"-"+link.source.group;
    if(sAxis == tAxis){
      sAxis = link.source.connectors[0].group;
      tAxis = link.target.connectors[1].group;
    }
    link.source = {node:link.source,group:sAxis};
    link.target = {node:link.target,group:tAxis};
  });

  // Initialize the info display.
  var info = d3.select("#info")
      .text(defaultInfo = "Showing " + links.length + " links among " + nodes.length + " nodes.");

  // Nest nodes by axis, for computing the rank.
  var nodesByAxis = d3.nest()
      .key(function(d) { return d.group; })
      .sortKeys(d3.ascending)
      .sortValues(function(a,b) { return a.color < b.color ? -1 : a.color > b.color ? 1 : a.color >= b.color ? 0 : NaN; })
      .entries(nodes);

  // Compute the rank for each axis, with padding between groups.
  nodesByAxis.forEach(function(axis) {
    var lastName = axis.values[0].color, count = 0;
    axis.values.forEach(function(d, i) {
      if (d.color != lastName) lastName = d.color, count += 2;
      d.index = count++;
    });
    //axis.count = count - 1;
  });

  // Set the radius domain.
  radius.domain(d3.extent(nodes, function(d) { return d.index; }));

  // Draw the axes.
  svg.selectAll(".axis")
      .data(axes)
    .enter().append("line")
      .attr("class", "axis")
      .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")"; })
      .attr("x1", innerRadius-15)
      .attr("x2", outerRadius+15);

  // Draw the links.
  svg.append("g")
      .attr("class", "links")
    .selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .style("stroke-width",function(d){ return weight(d[attr.weight]); })
      .attr("d", link()
      .angle(function(d) { return angle(d.group); })
      .radius(function(d) { return radius(d.node.index); }))
      .on("mouseover", linkMouseover)
      .on("mouseout", mouseout);

  svg.append("g")
      .attr("class", "nodes")
    .selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .style("fill", function(d) { return color(d.color); })
    .selectAll("circle")
      .data(function(d) { return d.connectors; })
    .enter().append("circle")
      .attr("transform", function(d) { return "rotate(" + degrees(angle(d.group)) + ")"; })
      .attr("cx", function(d) { return radius(d.node.index); })
      .attr("r", function(d) { return attr.size?size(d.node.attr[attr.size]):5; })
      .on("mouseover", nodeMouseover)
      .on("mouseout", mouseout);

  // Highlight the link and connected nodes on mouseover.
  function linkMouseover(d) {
    d3.select(this).classed("active", true);
    svg.selectAll(".node circle").classed("active", function(p) { 
return (d.source.node.name == p.node.name && d.source.group == p.group) || (d.target.node.name == p.node.name && d.target.group == p.group); });
    info.text(d.source.node.name + " → " + d.target.node.name);
  }

  // Highlight the node and connected links on mouseover.
  function nodeMouseover(d) {
    var nodeName = d.node.name
        str = nodeName;
    svg.selectAll(".link").classed("active", function(p) { return p.source.node.name == nodeName || p.target.node.name == nodeName; });
    svg.selectAll(".node circle").classed("active", function(p) { return p.node.name == nodeName; });
    for(i in d.node.attr)
      str = str+", "+i+": "+formatter(d.node.attr[i]);
    info.text(str);
  }

  // Clear any highlighted nodes or links.
  function mouseout() {
    svg.selectAll(".active").classed("active", false);
    info.text(defaultInfo);
  }

  displayButtons();
  bioinfoLogo();
}

// A shape generator for Hive links, based on a source and a target.
// The source and target are defined in polar coordinates (angle and radius).
// Ratio links can also be drawn by using a startRadius and endRadius.
// This class is modeled after d3.svg.chord.
function link() {
  var source = function(d) { return d.source; },
      target = function(d) { return d.target; },
      angle = function(d) { return d.angle; },
      startRadius = function(d) { return d.radius; },
      endRadius = startRadius,
      arcOffset = -Math.PI / 2;

  function link(d, i) {
    var s = node(source, this, d, i),
        t = node(target, this, d, i),
        x;
    if (t.a < s.a) x = t, t = s, s = x;
    if (t.a - s.a > Math.PI) s.a += 2 * Math.PI;
    var a1 = s.a + (t.a - s.a) / 3,
        a2 = t.a - (t.a - s.a) / 3;
    return s.r0 - s.r1 || t.r0 - t.r1
        ? "M" + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
        + "L" + Math.cos(s.a) * s.r1 + "," + Math.sin(s.a) * s.r1
        + "C" + Math.cos(a1) * s.r1 + "," + Math.sin(a1) * s.r1
        + " " + Math.cos(a2) * t.r1 + "," + Math.sin(a2) * t.r1
        + " " + Math.cos(t.a) * t.r1 + "," + Math.sin(t.a) * t.r1
        + "L" + Math.cos(t.a) * t.r0 + "," + Math.sin(t.a) * t.r0
        + "C" + Math.cos(a2) * t.r0 + "," + Math.sin(a2) * t.r0
        + " " + Math.cos(a1) * s.r0 + "," + Math.sin(a1) * s.r0
        + " " + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
        : "M" + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
        + "C" + Math.cos(a1) * s.r1 + "," + Math.sin(a1) * s.r1
        + " " + Math.cos(a2) * t.r1 + "," + Math.sin(a2) * t.r1
        + " " + Math.cos(t.a) * t.r1 + "," + Math.sin(t.a) * t.r1;
  }

  function node(method, thiz, d, i) {
    var node = method.call(thiz, d, i),
        a = +(typeof angle === "function" ? angle.call(thiz, node, i) : angle) + arcOffset,
        r0 = +(typeof startRadius === "function" ? startRadius.call(thiz, node, i) : startRadius),
        r1 = (startRadius === endRadius ? r0 : +(typeof endRadius === "function" ? endRadius.call(thiz, node, i) : endRadius));
    return {r0: r0, r1: r1, a: a};
  }

  link.source = function(_) {
    if (!arguments.length) return source;
    source = _;
    return link;
  };

  link.target = function(_) {
    if (!arguments.length) return target;
    target = _;
    return link;
  };

  link.angle = function(_) {
    if (!arguments.length) return angle;
    angle = _;
    return link;
  };

  link.radius = function(_) {
    if (!arguments.length) return startRadius;
    startRadius = endRadius = _;
    return link;
  };

  link.startRadius = function(_) {
    if (!arguments.length) return startRadius;
    startRadius = _;
    return link;
  };

  link.endRadius = function(_) {
    if (!arguments.length) return endRadius;
    endRadius = _;
    return link;
  };

  return link;
}

function degrees(radians) {
  return radians / Math.PI * 180 - 90;
}
