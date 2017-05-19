var docSize = viewport(),
    width = docSize.width - 60,
    height = docSize.height - 60,
    margin = {top: 40, right: 40, bottom: 50, left: 90};

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var bisectDate = d3.bisector(function(d) { return d.x; }).left;

var color = d3.scale.category10();

var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(formatter)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(formatter)
    .orient("left");

window.onload = function(){

var json = JSON.parse(d3.select("#data").text());

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  svg.append("style")
    .text("text { font: 10px sans-serif; } .axis path, .axis line { fill: none; stroke: #000; shape-rendering: crispEdges; }");
  svg = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xExtent = [],
    yExtent = [];
  d3.entries(json.data).forEach(function(a) { 
    a.value.forEach(function(a){
      a.y = +a.y;
      yExtent.push(a.y);
      a.x = +a.x;
      xExtent.push(a.x);
    });
  });

  x.domain(d3.extent(xExtent)).nice();
  y.domain(d3.extent(yExtent)).nice();

if(xExtent.length > 10)
  color = d3.scale.category20();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
        .attr("x", width/2)
        .attr("y", margin.bottom-10)
        .style("text-anchor", "middle")
        .text(json.labels.x);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+30)
        .attr("x", -height/2)
        .style("text-anchor", "middle")
        .text(json.labels.y)

  var lines = svg.selectAll(".line")
      .data(d3.entries(json.data))
    .enter().append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.value); })
      .style("fill","none")
      .style("stroke",function(d) { return color(d.key); })
      .on("mouseover", function() { 
	d3.select(".focus").style("display", null);
	d3.select(this).style("stroke-width", 2);
	})
      .on("mouseout", function() {
	d3.select(this).style("stroke-width", null);
	d3.select(".focus").style("display", "none");
	})
      .on("mousemove", mousemove);

  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr("r", 3)
      .style({"fill":"none","stroke":"black"});

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  function mousemove(d) {
    var x0 = x.invert(d3.mouse(this)[0]);
    var i = bisectDate(d.value, x0, 1),
    dot = d.value[i - 1];
    d3.select(".focus").attr("transform", "translate(" + x(dot.x) + "," + y(dot.y) + ")");
    d3.select(".focus").select("text").text(d.key+" ("+Number((dot.x).toFixed(2))+","+Number((dot.y).toFixed(2))+")");
  }

  d3.select("head").append("style")
    .text("body {font: 10px sans-serif;} "+
    "div.legend { width: "+width+"px; margin: 10px "+margin.right+"px 0 "+margin.left+"px;} "+
    "div.legend>div {padding: 0 18px; margin: 4px 0; float: left; width: 110px; overflow:hidden;} "+
    "div.legend>div>span {padding: 3px 9px;} ");

  var legend = d3.select("body").append("div").attr("class", "legend");
  var legDiv = legend.selectAll("div")
      .data(color.domain())
    .enter().append("div")
      .on("mouseover", function(d,i) { 
	lines.filter(function(d,j){ return i==j; }).style("stroke-width", 2);
	})
      .on("mouseout", function(d,i) {
	lines.filter(function(d,j){ return i==j; }).style("stroke-width", null);
	})
  legDiv.append("span")
      .style("background-color", function(d) { return color(d); });
  legDiv.append("span")
    .attr("title",function(d) { return d; })
    .text(function(d) { return d; });

  displayButtons();
  bioinfoLogo();
}

function svg2pdf(){

var doc = new jsPDF("l","pt",[width + margin.left + margin.right, height + margin.top + margin.bottom]),
    svgDoc = d3.select("svg").node();

doc.setFontSize(8);
doc.setTextColor(0);
doc.setLineWidth(1);
doc.setDrawColor(0);

d3.selectAll("line").each(function(){
	var coords = getCoords(this, svgDoc);
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

d3.selectAll(".axis text").each(function(){
	var coords = getCoords(this, svgDoc),
	t = d3.select(this).text();
	if(!d3.select(this).attr("transform"))
	  doc.text(coords.x+2, coords.y+10, t);
	else
	  doc.text(coords.x+8, coords.y, t, null, 90);
});

d3.selectAll(".line").each(function(){
	var d = d3.select(this).attr("d"),
            color = d3.rgb(d3.select(this).style("stroke"));
        d = d.split("M")[1].split("L");
	doc.setDrawColor(color.r,color.g,color.b);
	for(var i = 1, uno = 0, dos = 0, coords = 0; i<d.length; i++){
	  uno = d[i-1].split(",");
	  dos = d[i].split(",");
          coords = {x:parseFloat(uno[0])+margin.left, y:parseFloat(uno[1])+margin.top, x2:parseFloat(dos[0])+margin.left, y2:parseFloat(dos[1])+margin.top};
	  doc.line(coords.x, coords.y, coords.x2, coords.y2);
	}
});

doc.save(d3.select("head>title").text()+".pdf");
}
