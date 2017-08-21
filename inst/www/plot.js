var docSize = viewport(),
    width = docSize.width - 60,
    height = docSize.height - 30,
    margin = {top: 40, right: 40, bottom: 80, left: 90};

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var color = d3.scale.category10();

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

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

  var cex = json.cex?json.cex:1;

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
  svg.append("style")
      .text("text { font: "+(cex*10)+"px sans-serif; }"+
      ".axis path, .axis line { fill: none; stroke: #000; shape-rendering: crispEdges; }");
  svg = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  json.nodes.forEach(function(d) {
    d.x = +d.x;
    d.y = +d.y;
  });

  if (typeof json.scales != 'undefined') {
    if (typeof json.scales.x != 'undefined') {
      x.domain(json.scales.x);
    } else {
      x.domain(d3.extent(json.nodes, function(d) { return d.x; })).nice();
    }
    if (typeof json.scales.y != 'undefined') {
      y.domain(json.scales.y);
    } else {
      y.domain(d3.extent(json.nodes, function(d) { return d.y; })).nice();
    }
  } else {
    x.domain(d3.extent(json.nodes, function(d) { return d.x; })).nice();
    y.domain(d3.extent(json.nodes, function(d) { return d.y; })).nice();
  }

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

  if (typeof json.axis != 'undefined') {
	if (typeof json.axis.x != 'undefined') {
	json.axis.x.forEach(function(d){
	  svg.append("line")
	      .attr("x1", x(d))
	      .attr("y1", 0)
	      .attr("x2", x(d))
	      .attr("y2", height)
	      .style({"stroke-width": 1, "stroke": "grey"});
	});
	}
	if (typeof json.axis.y != 'undefined') {
	json.axis.y.forEach(function(d){
	  svg.append("line")
	      .attr("x1", 0)
	      .attr("y1", y(d))
	      .attr("x2", width)
	      .attr("y2", y(d))
	      .style({"stroke-width": 1, "stroke": "grey"});
	});
	}
  }

  svg.selectAll(".dot")
      .data(json.nodes)
    .enter().append("path")
      .attr("class", "dot")
      .attr("transform", function(d) { return "translate("+x(d.x)+","+y(d.y)+")"; })
      .attr("d", d3.svg.symbol().type(function(d){
	if (typeof d.pch != 'undefined') {
	  switch(d.pch){
            case 2:
              return "triangle-up";
              break;
            case 3:
              return "cross";
              break;
            case 4:
              return "square";
              break;
            case 5:
              return "diamond";
              break;
            case 6:
              return "triangle-down";
              break;
            default:
              return "circle";
          }
	}
	return "circle";
	}))
      .style("fill", function(d){ return validColor(d.col,color); })
      .append("title").text(function(d){return ((typeof d.id != 'undefined')?d.id+" ":"")+"("+Number((d.x).toFixed(2))+","+Number((d.y).toFixed(2))+")";})

  displayButtons();
  bioinfoLogo();
}

function validColor(col,scale) {
    if (!col) { return scale("undefined"); }
    if (col === "") { return false; }
    if (col === "inherit") { return false; }
    if (col === "transparent") { return false; }
    
    var image = document.createElement("img");
    image.style.color = "transparent";
    image.style.color = col;
    if(image.style.color !== "transparent")
      return col;
    else
      return scale(col);
}

function svg2pdf(){

var doc = new jsPDF("l","pt",[width + margin.left + margin.right, height + margin.top + margin.bottom]),
    svgDoc = d3.select("svg").node();

doc.polygon = function(path, x, y, scale, style) {
    if(path.indexOf("A")!=-1){
      this.circle(x, y, 4.5*scale[0], style);
    }else{
      var closed = path.indexOf("Z")!=-1,
          points = [];
      path = path.replace(/M|Z/g,"").split(/[LHV]/); 
      for(var i = 0; i<path.length; i++){
        var p = path[i].split(/[,| ]/).filter(function(d){ return d.length>0; }),
        pLen = p.length;
        if(pLen==1){
          if(i%2!=0){
            points.push([+p[0],points[points.length-1][1]]);
          }else{
            points.push([+points[points.length-1][0],+p[0]]);
          }
        }
        if(pLen==2){
          points.push([+p[0],+p[1]]);
        }
        if(pLen>2){
          for(var j = 0; j<pLen; j=j+2){
            points.push([+p[j],+p[j+1]]);
          }
        }
      }

      var acc = [],
        x1 = points[0][0],
        y1 = points[0][1],
        cx = x1,
        cy = y1;
      for(var i=1; i<points.length; i++) {
          var point = points[i],
            dx = point[0]-cx,
            dy = point[1]-cy;
          acc.push([dx, dy]);
          cx += dx;
          cy += dy;
      }
      this.lines(acc, x+(x1*scale[0]), y+(y1*scale[1]), scale, style, closed);
    }
}

doc.setFontSize(8);
doc.setTextColor(0);
doc.setDrawColor(0);
doc.setLineWidth(1);

d3.selectAll("line").each(function(){
	var coords = getCoords(this, svgDoc);
	if(d3.select(this).style("stroke")!="rgb(0, 0, 0)")
	  doc.setDrawColor(128);
	else
	  doc.setDrawColor(0);
	doc.line(coords.x, coords.y, coords.x2, coords.y2);
});

doc.setDrawColor(0);

d3.selectAll("g.x path").each(function(){
	var coords = getCoords(this, svgDoc);
	doc.line(coords.x, coords.y, coords.x2, coords.y);
});

d3.selectAll("g.y path").each(function(){
	var coords = getCoords(this, svgDoc);
	doc.line(coords.x2, coords.y, coords.x2, coords.y2);
});

d3.selectAll("path.dot").each(function(){
    var coords = getCoords(this, svgDoc),
      x = (coords.x+coords.x2)/2,
      y = (coords.y+coords.y2)/2,
      color = d3.rgb(d3.select(this).style("fill"));
    doc.setFillColor(color.r,color.g,color.b);
    var points = d3.select(this).attr("d");
    doc.polygon(points, x, y, [1,1], 'F');
});

d3.selectAll("text").each(function(){
	var coords = getCoords(this, svgDoc),
	t = d3.select(this).text();
	if(!d3.select(this).attr("transform"))
	  doc.text(coords.x+2, coords.y+10, t);
	else
	  doc.text(coords.x+8, coords.y, t, null, 90);
});

doc.save(d3.select("head>title").text()+".pdf");
}
