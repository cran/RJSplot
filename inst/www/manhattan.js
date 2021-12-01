var docSize = viewport(),
    width = Math.max(1200,docSize.width - 60),
    height = docSize.height - 30,
    margin = {top: 40, right: 40, bottom: 80, left: 90};

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var scaleColor = d3.scale.category10();

var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(formatter)
    .orient("left");

window.onload = function(){

  var data = JSON.parse(d3.select("#data").text());

  var length = 0, v = [], axis = data.axis[0], dist = data.axis[1];

  var assembly = [],
      len = data.assembly[0].length;

  for(var i = 0; i<len; i++){
    var row = {};
    row.chr = data.assembly[0][i];
    row.start = data.assembly[1][i];
    row.end = data.assembly[2][i];
    assembly.push(row);
  }

  scaleColor.domain(assembly.map(function(d){ return d.chr; }));

  assembly.unshift({chr: "", end: 0});
  assembly.forEach(function(d) {
    length = length + d.end;
    v.push(length);
  });

  var xExtent = [0, length];
    x.domain(xExtent);

  var histogram = [];
  len = 0;
  if(data.histogram)
    len = data.histogram[0].length;

  for(var i = 0; i<len; i++){
    var row = {};
    row.chr = data.histogram[0][i];
    row.start = data.histogram[1][i];
    row.end = data.histogram[2][i];
    row.y = data.histogram[3][i];
    var ind = chrIndex(row.chr);
    row.x = v[ind]+row.start;
    row.x2 = v[ind]+row.end;
    histogram.push(row);
  }

  var nodes = [];
  len = 0;
  if(data.nodes)
    len = data.nodes[0].length;

  for(var i = 0; i<len; i++){
    var node = {};
    node.chr = data.nodes[0][i];
    node.pos = data.nodes[1][i];
    node.y = data.nodes[2][i];
    node.name = data.nodes[3][i];
    node.x = v[chrIndex(node.chr)]+node.pos;
    nodes.push(node);
  }

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickValues(v)
    .tickFormat(function(d, i){ return assembly[i].chr });

  var zoom = d3.behavior.zoom()
    .x(x)
    .scaleExtent([1, 100])
    .on("zoom", zoomed);

  y.domain(data.yscale).nice();

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  if(nodes.length){

    d3.select("head").append("style").text("div.tooltip { position: absolute; z-index: 99; display: none; background-color: rgba(0,0,0,0.8); font-family: sans-serif; font-size: 12px; color: white; padding: 4px; }");
    var tooltip = d3.select("body").append("div").attr("class","tooltip");

    var canvas = d3.select("body").insert("canvas","svg")
    .style("position","absolute")
    .style("left", margin.left+"px")
    .style("top", margin.top+"px")
    .attr("width", width)
    .attr("height", height)

    var ctx = canvas.node().getContext("2d");

    svg.style("position","absolute")
      .style("top",0)
      .style("left",0)
    .on("mousemove", function(){
      var tolerance = 5;
      var pos = {
        x: d3.mouse(this)[0],
        y: d3.mouse(this)[1]
      };
      pos.minX = x.invert(pos.x - margin.left - tolerance);
      pos.maxX = x.invert(pos.x - margin.left + tolerance);
      pos.minY = y.invert(pos.y - margin.top + tolerance);
      pos.maxY = y.invert(pos.y - margin.top - tolerance);

      var matches = nodes.filter(function(node) {
        if (node.x >= pos.minX && node.x <= pos.maxX && 
            node.y >= pos.minY && node.y <= pos.maxY) {
          return true;
        }
      })

      if(matches.length){
        var txt = [];
        matches.forEach(function(d){
          txt.push(d.name+" (chrom: "+d.chr+", pos: "+d.pos+", "+data.yLab+": "+formatter(d.y)+")");
        })
        tooltip.html(txt.join("<br/>"));
        tooltip.style({"display": "block",
          "left": (pos.x + 10) + "px",
          "top" : (pos.y + 10) + "px"});
      }else{
        tooltip.html("");
        tooltip.style("display", "none");
      }
    })
    .on("mouseout", function(){
        tooltip.html("");
        tooltip.style("display", "none");
    })
  }

  var cex = data.cex?data.cex:1;

  var showDots = true;

  svg.append("style")
    .text("text { font: "+(cex*10)+"px sans-serif; } "+
  ".axis path, .axis line { fill: none; stroke: #000; shape-rendering: crispEdges; }");

  var defs = svg.append("defs");
    defs.append("clipPath")
    .attr("id", "mask")
    .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);
    defs.append("clipPath")
    .attr("id", "xMask")
    .append("rect")
        .attr("x", -1)
        .attr("y", -15)
        .attr("width", width+2)
        .attr("height", margin.bottom+15);

  svg = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("clip-path", "url(#xMask)")
      .call(xAxis)
      .append("text")
        .attr("x", width/2)
        .attr("y", margin.bottom-10)
        .style("text-anchor", "middle")
        .text("chromosome");

  svg.selectAll(".x .tick text")
      .data(assembly)
      .attr("x", function(d) { return x(-d.end/2); });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+30)
        .attr("x", -height/2)
        .style("text-anchor", "middle")
        .text(data.yLab);

  svg = svg.append("g")
        .attr("clip-path", "url(#mask)");

  svg.selectAll(".bar")
      .data(histogram)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { 
          if(axis<d.y)
              return y(d.y);
          else
              return y(axis);
          })
      .attr("width", function(d) { return x(d.x2)-x(d.x); })
      .attr("height", function(d) { return y(y.domain()[1]-Math.abs(axis-d.y)); })
      .style("fill", function(d) { return scaleColor(d.chr); })
      .append("title").text(function(d) {
            return "chrom: "+d.chr+"\nstart: "+d.start+"\nend: "+d.end+"\n"+data.yLab+": "+formatter(d.y);
         })

  svg.append("line")
      .attr("x1", x(0))
      .attr("y1", y(axis))
      .attr("x2", x(length))
      .attr("y2", y(axis))
      .style({"stroke-width": 1, "stroke": "black"});

  svg.append("line")
      .attr("x1", x(0))
      .attr("y1", y(axis+dist))
      .attr("x2", x(length))
      .attr("y2", y(axis+dist))
      .attr("class", "bounds")
      .style({"stroke-width": 1, "stroke": "grey"});

  svg.append("line")
      .attr("x1", x(0))
      .attr("y1", y(axis-dist))
      .attr("x2", x(length))
      .attr("y2", y(axis-dist))
      .attr("class", "bounds")
      .style({"stroke-width": 1, "stroke": "grey"});

  d3.select("svg").call(zoom)

  render();

  if(nodes.length && !d3.selectAll(".bar").empty())
    iconButton(d3.select("body"),"outliers","data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTQiIHdpZHRoPSIxNCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTQgMTQiPgo8cmVjdCBoZWlnaHQ9IjEzIiBzdHJva2U9IiNjMGMwYzAiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0iI2UwZTBlMCIgcng9IjIiIHdpZHRoPSIxMyIgeT0iMC41IiB4PSIwLjUiLz4KPGcgZmlsbD0iIzYwNjA2MCI+CjxjaXJjbGUgcj0iMSIgY3k9IjQuMSIgY3g9IjQuMSIvPgo8Y2lyY2xlIHI9IjEiIGN5PSI5LjUiIGN4PSIzLjkiLz4KPGNpcmNsZSByPSIxIiBjeT0iOS45IiBjeD0iOS43Ii8+CjxjaXJjbGUgcj0iMSIgY3k9IjMuMSIgY3g9IjguNCIvPgo8Y2lyY2xlIHI9IjEiIGN5PSI2LjgiIGN4PSI2LjIiLz4KPGNpcmNsZSByPSIxIiBjeT0iNyIgY3g9IjEwLjUiLz4KPC9nPgo8L3N2Zz4K","show/hide Outliers",displayDots,{"position":"absolute","top":"70px","right":"36px"})

  svg2pdf = function(){

var doc = new jsPDF("l","pt",[width + margin.left + margin.right, height + margin.top + margin.bottom]),
    svgDoc = d3.select("svg").node();

doc.setFontSize(8);
doc.setTextColor(0);
doc.setDrawColor(0);
doc.setLineWidth(1);

d3.selectAll(".bar").each(function(){
	var coords = getCoords(this,svgDoc),
	  color = d3.rgb(d3.select(this).style("fill"));
	doc.setFillColor(color.r,color.g,color.b);
	doc.rect(coords.x, coords.y, coords.x2-coords.x, coords.y2-coords.y, 'F');
});

  if(nodes.length){
    nodes.forEach(function(node){
        var coords = [x(node.x)+margin.left,y(node.y)+margin.top],
            color = d3.rgb(scaleColor(node.chr)).brighter(0.6);

	doc.setFillColor(color.r,color.g,color.b);
	doc.circle(coords[0], coords[1], 2, 'F');
    })
  }

doc.setFillColor(255);
doc.rect(0, 0, margin.left, height + margin.top + margin.bottom, 'F');
doc.rect(0, 0, width + margin.left + margin.right, margin.top, 'F');
doc.rect(margin.left+width, 0, width + margin.left + margin.right-(margin.left+width), height + margin.top + margin.bottom, 'F');
doc.rect(0, margin.top+height, width + margin.left + margin.right, height + margin.top + margin.bottom-(margin.top+height), 'F');

d3.selectAll("line").each(function(){
	var coords = getCoords(this, svgDoc);
	if(d3.select(this).attr("class")=="bounds")
		doc.setDrawColor(128);
	else
		doc.setDrawColor(0);
	doc.line(coords.x, coords.y, coords.x2, coords.y2);
});

d3.selectAll("g.x path").each(function(){
	var coords = getCoords(this, svgDoc);
	doc.line(coords.x, coords.y, coords.x2, coords.y);
});

d3.selectAll("g.y path").each(function(){
	var coords = getCoords(this, svgDoc);
	doc.line(coords.x2, coords.y, coords.x2, coords.y2);
});

d3.selectAll("text").each(function(){
	var coords = getCoords(this, svgDoc),
	t = d3.select(this).text();
	if(!d3.select(this).attr("transform"))
	  doc.text(coords.x, coords.y+9, t);
	else
	  doc.text(coords.x+9, coords.y, t, null, 90);
});

doc.setFillColor(255);
doc.rect(0, 0, 0, height + margin.top + margin.bottom, 'F');
doc.rect(margin.left+width+margin.right, 0, width + margin.left + margin.right-(margin.left+width+margin.right), height + margin.top + margin.bottom, 'F');

doc.save(d3.select("head>title").text()+".pdf");
  }

  displayButtons();
  bioinfoLogo();

  function render() {
    if(nodes.length){
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      if(showDots){
        nodes.forEach(function(node) {
          ctx.fillStyle = d3.rgb(scaleColor(node.chr)).brighter(0.6);
          ctx.beginPath();
          ctx.arc(x(node.x), y(node.y), 3, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.fill();
        });
      }
    }

    ctx.restore();
  }

  function zoomed() {

        var t = d3.event.translate,
          tx = t[0],
          ty = t[1];
        if(x(xExtent[0]) > 0) {
          tx = 0;
        } else if(x(xExtent[1]) < x.range()[1]) {
          tx -= x(xExtent[1]) - x.range()[1];
        }
        zoom.translate([tx,ty]);

    d3.select("g.x.axis").call(xAxis);
    d3.selectAll(".x .tick text")
      .data(assembly)
      .attr("x", function(d) { return -(width*d3.event.scale/length*d.end/2);});
    d3.selectAll(".bar")
      .attr("x", function(d) { return x(d.x); })
      .attr("width", function(d) { return x(d.x2)-x(d.x); });

    render();
  }

  function displayDots(){
    showDots = !showDots;
    render();
  }

}

function chrIndex(chr){
  var i = 0;
  switch(chr) {
    case "X":
        i = 23;
        break;
    case "Y":
        i = 24;
        break;
    default:
        i = +chr;
  } 
  return i-1;
}

function svg2pdf(){
  alert("data is not loaded yet!");
};
