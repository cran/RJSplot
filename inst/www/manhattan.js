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

var color = d3.scale.category10();

var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(formatter)
    .orient("left");

window.onload = function(){

  var data = JSON.parse(d3.select("#data").text());

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var cex = data.cex?data.cex:1;

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

  var length = 0, v = [], axis = data.axis[0], dist = data.axis[1];

  color.domain(data.scale.map(function(d){ return d.chr; }));

  data.scale.unshift({chr: "", end: 0});
  data.scale.forEach(function(d) {
    length = length + d.end;
    v.push(length);
  });

  var xExtent = [0, length];
    x.domain(xExtent);

  data.histogram.forEach(function(d){
    var i = chrIndex(d.chr);
    d.start = +d.start;
    d.end = +d.end;
    d.y = +d.y;
    d.x = v[i]+d.start;
    d.x2 = v[i]+d.end;
  })

  data.nodes.forEach(function(d){
    d.pos = +d.pos;
    d.y = +d.y;
    d.x = v[chrIndex(d.chr)]+d.pos;
  })

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickValues(v)
    .tickFormat(function(d, i){ return data.scale[i].chr });

  var zoom = d3.behavior.zoom()
    .x(x)
    .scaleExtent([1, 100])
    .on("zoom", zoomed);

  y.domain(data.yscale).nice();

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

  svg.selectAll(".tick text")
      .data(data.scale)
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
      .data(data.histogram)
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
      .style("fill", function(d) { return color(d.chr); })
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

  svg.selectAll(".dot")
      .data(data.nodes)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3)
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .style("fill", function(d) { return d3.hsl(color(d.chr)).brighter(0.6); })
      .append("title").text(function(d) {
            return d.name+"\nchrom: "+d.chr+"\npos: "+d.pos+"\n"+data.yLab+": "+formatter(d.y);
         })

  d3.select("svg").call(zoom)

  function zoomed() {

        var t = zoom.translate(),
          tx = t[0],
          ty = t[1];
        if(x(xExtent[0]) > 0) {
          tx = 0;
        } else if(x(xExtent[1]) < x.range()[1]) {
          tx -= x(xExtent[1]) - x.range()[1];
        }
        zoom.translate([tx,ty]);

    d3.select("g.x.axis").call(xAxis);
    d3.selectAll(".tick text")
      .data(data.scale)
      .attr("x", function(d) { return -(width*d3.event.scale/length*d.end/2);});
    d3.selectAll(".bar")
      .data(data.histogram)
      .attr("x", function(d) { return x(d.x); })
      .attr("width", function(d) { return x(d.x2)-x(d.x); });
    d3.selectAll(".dot")
      .data(data.nodes)
      .attr("cx", function(d) { return x(d.x); });

  }

  if(!d3.selectAll(".dot").empty()&&!d3.selectAll(".bar").empty())
    iconButton(d3.select("body"),"outliers","data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTQiIHdpZHRoPSIxNCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTQgMTQiPgo8cmVjdCBoZWlnaHQ9IjEzIiBzdHJva2U9IiNjMGMwYzAiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0iI2UwZTBlMCIgcng9IjIiIHdpZHRoPSIxMyIgeT0iMC41IiB4PSIwLjUiLz4KPGcgZmlsbD0iIzYwNjA2MCI+CjxjaXJjbGUgcj0iMSIgY3k9IjQuMSIgY3g9IjQuMSIvPgo8Y2lyY2xlIHI9IjEiIGN5PSI5LjUiIGN4PSIzLjkiLz4KPGNpcmNsZSByPSIxIiBjeT0iOS45IiBjeD0iOS43Ii8+CjxjaXJjbGUgcj0iMSIgY3k9IjMuMSIgY3g9IjguNCIvPgo8Y2lyY2xlIHI9IjEiIGN5PSI2LjgiIGN4PSI2LjIiLz4KPGNpcmNsZSByPSIxIiBjeT0iNyIgY3g9IjEwLjUiLz4KPC9nPgo8L3N2Zz4K","show/hide Outliers",displayDots,{"position":"absolute","top":"70px","right":"36px"})

  displayButtons();
  bioinfoLogo();
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

function displayDots(){
var dots = d3.selectAll(".dot");
   if(dots.style("opacity")!=0){
	dots.transition()
	.duration(500)
	.style("opacity",0);}
   else{
	dots.transition()
	.duration(500)
	.style("opacity",1);
   }
}

function svg2pdf(){

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

d3.selectAll(".dot").each(function(){
	var coords = getCoords(this, svgDoc),
	  color = d3.rgb(d3.select(this).style("fill"));
	doc.setFillColor(color.r,color.g,color.b);
	doc.circle(coords.x, coords.y, 2, 'F');
});

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
