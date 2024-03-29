var docSize = viewport(),
    width = docSize.width - 60,
    height = docSize.height - 30,
    margin = {top: 40, right: 40, bottom: 140, left: 90};

var numberShow = false;
    
window.onload = function(){

  var json = JSON.parse(d3.select("#data").text());

  if(typeof json.data.n == 'number')
    json.data.n = [json.data.n];

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  var nBoxes = json.data.n.length;
  if(nBoxes*40 > width)
    width = nBoxes*40;

  var data = [],
      i = 0,
      j = 0;

  var defaultFill = "#1f77b4";
  if(json.data.color && !Array.isArray(json.data.color)){
    if(validColor(json.data.color))
      defaultFill = json.data.color;
    delete json.data.color;
  }

  var color = d3.scale.category10();

  for(; i < nBoxes; i++){
    var d = {};
    d.name = json.data.names[i];
    d.n = json.data.n[i];
    d.stats = json.data.stats[i];
    d.out = [];
    for(; json.data.group[j] == i; j++)
      d.out.push(json.data.out[j]);
    if(json.data.color)
      d.color = validColor(json.data.color[i],color);
    data.push(d);
  }

  var chart = box()
        .height(height)
        .domain(json.scale);

  var cex = json.cex?json.cex:1;

  var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
 
  svg.append("style")
        .text("text { font-size: "+(cex*10)+"px; font-family: sans-serif; } "+
".box line, .box rect, .box circle { fill: "+defaultFill+"; stroke: #000; stroke-width: 1px; } "+
".box .center { stroke-dasharray: 3,3; } "+
".box .outlier { fill: none;  stroke: #000; } "+
".box text { opacity: 0; }"+
".axis path, .axis line { fill: none; stroke: #000; shape-rendering: crispEdges; }")

  var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scale.ordinal()
                .domain(json.data.names)
                .rangeRoundBands([0 , width], 0.7, 0.3);

  var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

  var y = d3.scale.linear()
                .domain(json.scale)
                .range([height, 0]);

  var yAxis = d3.svg.axis()
                .scale(y)
                .tickFormat(formatter)
                .orient("left");

  g.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-20,0)")
      .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 12)
          .attr("x", 0)
          .style("text-anchor", "end")
          .text(json.labels.y);
    
  var gxaxis = g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height + 20) + ")")

  gxaxis.call(xAxis)
        .append("text")
          .attr("x", width)
          .attr("y", -4)
          .style("text-anchor", "end")
          .text(json.labels.x);

  gxaxis.selectAll(".tick text")
      .attr("x", 8)
      .attr("y", 8)
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start")

  var gxaxisRect = gxaxis.node().getBoundingClientRect();
  if(gxaxisRect.height>margin.bottom){
    margin.bottom = gxaxisRect.height + 10;
    svg.attr("height", height + margin.top + margin.bottom);
  }
  if(gxaxisRect.width>width+margin.right){
    margin.right = gxaxisRect.width-width;
    svg.attr("width", width + margin.left + margin.right);
  }

  g.selectAll(".box")
        .data(data)
      .enter().append("g")
        .attr("class", "box")
        .attr("transform", function(d){ return "translate(" +  x(d.name)  + ",0)"; })
      .call(chart.width(x.rangeBand()))
      .on("mouseover", function(){
        if(!numberShow)
      d3.select(this).selectAll("text")
        .transition()
        .duration(500)
        .style("opacity", 1)
    })
      .on("mouseout", function(){
        if(!numberShow)
      d3.select(this).selectAll("text")
        .transition()
        .duration(500)
        .style("opacity", 0)
    });

iconButton(d3.select("body"),"stats","data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNCAxNCIgaGVpZ2h0PSIxNCIgd2lkdGg9IjE0IiB2ZXJzaW9uPSIxLjEiPgo8cmVjdCByeD0iMiIgaGVpZ2h0PSIxMyIgd2lkdGg9IjEzIiBzdHJva2U9IiNjMGMwYzAiIHk9Ii41IiB4PSIuNSIgZmlsbD0iI2UwZTBlMCIvPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSguMjUyNTUpIiBmaWxsPSIjNjA2MDYwIj4KPHJlY3Qgc3R5bGU9ImNvbG9yLXJlbmRlcmluZzphdXRvO2NvbG9yOiMwMDAwMDA7aXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NoYXBlLXJlbmRlcmluZzphdXRvO3NvbGlkLWNvbG9yOiMwMDAwMDA7aW1hZ2UtcmVuZGVyaW5nOmF1dG8iIGhlaWdodD0iOC44OTgzIiB3aWR0aD0iMS41NDI0IiB5PSIyLjU1MDgiIHg9IjIuNDkxNSIvPgo8cmVjdCBzdHlsZT0iY29sb3ItcmVuZGVyaW5nOmF1dG87Y29sb3I6IzAwMDAwMDtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c2hhcGUtcmVuZGVyaW5nOmF1dG87c29saWQtY29sb3I6IzAwMDAwMDtpbWFnZS1yZW5kZXJpbmc6YXV0byIgaGVpZ2h0PSIzLjU1OTMiIHdpZHRoPSIxLjU0MjQiIHk9IjcuODg5OCIgeD0iNS45NzYiLz4KPHJlY3Qgc3R5bGU9ImNvbG9yLXJlbmRlcmluZzphdXRvO2NvbG9yOiMwMDAwMDA7aXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NoYXBlLXJlbmRlcmluZzphdXRvO3NvbGlkLWNvbG9yOiMwMDAwMDA7aW1hZ2UtcmVuZGVyaW5nOmF1dG8iIGhlaWdodD0iNi4yMjg4IiB3aWR0aD0iMS41NDI0IiB5PSI1LjIyMDMiIHg9IjQuMjM0Ii8+CjxyZWN0IHN0eWxlPSJjb2xvci1yZW5kZXJpbmc6YXV0bztjb2xvcjojMDAwMDAwO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1yZW5kZXJpbmc6YXV0bztzb2xpZC1jb2xvcjojMDAwMDAwO2ltYWdlLXJlbmRlcmluZzphdXRvIiBoZWlnaHQ9IjcuNDE1MyIgd2lkdGg9IjEuNTQyNCIgeT0iNC4wMzM5IiB4PSI3LjcxOSIvPgo8cmVjdCBzdHlsZT0iY29sb3ItcmVuZGVyaW5nOmF1dG87Y29sb3I6IzAwMDAwMDtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c2hhcGUtcmVuZGVyaW5nOmF1dG87c29saWQtY29sb3I6IzAwMDAwMDtpbWFnZS1yZW5kZXJpbmc6YXV0byIgaGVpZ2h0PSIyLjE5NDkiIHdpZHRoPSIxLjU0MjQiIHk9IjkuMjU0MiIgeD0iOS40NjEiLz4KPC9nPgo8L3N2Zz4K","show/hide Stats",displayNumbers,{"position":"absolute","top":"70px","right":"36px"})

displayButtons();
bioinfoLogo();
}

function displayNumbers(){
  if(!numberShow){
      d3.selectAll("g.box").selectAll("text")
        .transition()
        .duration(500)
        .style("opacity", 1)
  }else{
      d3.selectAll("g.box").selectAll("text")
        .transition()
        .duration(500)
        .style("opacity", 0)
  }
  numberShow = !numberShow;
}

function box(){
  var height = 1,
      width = 1,
      domain = null;

  function box(g){
    var scale = d3.scale.linear()
        .domain(domain())
        .range([height,0]);

    g.append("line")
      .attr("class","center")
      .attr("x1", width/2)
      .attr("x2", width/2)
      .attr("y1", function(d){ return scale(d.stats[4]); })
      .attr("y2", function(d){ return scale(d.stats[0]); });

    g.append("rect")
      .attr("class","box")
      .attr("x", 0)
      .attr("y", function(d){ return scale(d.stats[3]); })
      .attr("width",width)
      .attr("height", function(d){ return scale(d.stats[1])-scale(d.stats[3]); })
      .style("fill", function(d){ return d.color ? d.color : null; });

    [["median",2],["whisker",4],["whisker",0]].forEach(function(p){
      g.append("line")
        .attr("class",p[0])
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", function(d){ return scale(d.stats[p[1]]); })
        .attr("y2", function(d){ return scale(d.stats[p[1]]); })
    });

    g.selectAll(".outlier")
          .data(function(d){ return d.out; })
        .enter().append("circle")
          .attr("class","outlier")
          .attr("cx",width/2)
          .attr("cy",function(d){ return scale(d); })
          .attr("r",5)

    g.selectAll("text")
          .data(function(d){ return d.stats; })
        .enter().append("text")
          .attr("y",function(d){ return scale(d)+4; })
          .attr("x",function(d,i){ return -6+(width+12)*(i%2); })
          .style("text-anchor",function(d,i){ return i%2==0?"end":"start"; })
          .text(function(d){ return formatter(d); });
  }

  box.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x == null ? x : d3.functor(x);
    return box;
  };

  box.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return box;
  };

  box.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return box;
  };

  return box;
}

function svg2pdf(){

var doc = new jsPDF("l","pt",[width + margin.left + margin.right, height + margin.top + margin.bottom]),
    svgDoc = d3.select("svg").node();

doc.setFontSize(8);
doc.setTextColor(0);
doc.setDrawColor(125);
doc.setLineWidth(1);

d3.selectAll(".center").each(function(){
    var coords = getCoords(this, svgDoc);
    doc.line(coords.x, coords.y, coords.x2, coords.y2);
});

doc.setDrawColor(0);

d3.selectAll("rect").each(function(){
    var coords = getCoords(this, svgDoc);
    doc.setFillColor(70,130,180);
    doc.rect(coords.x, coords.y, coords.x2-coords.x, coords.y2-coords.y, 'FD');
});

d3.selectAll("line:not(.center)").each(function(){
    var coords = getCoords(this, svgDoc);
    doc.line(coords.x, coords.y, coords.x2, coords.y2);
});

d3.selectAll("circle").each(function(){
    var coords = getCoords(this, svgDoc);
    doc.circle(coords.x+5, coords.y+5, 5);
});

d3.selectAll("g.x path").each(function(){
    var coords = getCoords(this, svgDoc);
    doc.line(coords.x, coords.y, coords.x2, coords.y);
});

d3.selectAll("g.y path").each(function(){
    var coords = getCoords(this, svgDoc);
    doc.line(coords.x2, coords.y, coords.x2, coords.y2);
});

d3.selectAll(".x>text, .y .tick text").each(function(){
    var coords = getCoords(this, svgDoc),
    t = d3.select(this).text();
    doc.text(coords.x+2, coords.y+10, t);
});

d3.selectAll(".y>text").each(function(){
    var coords = getCoords(this, svgDoc),
    t = d3.select(this).text();
    doc.text(coords.x+8, coords.y, t, null, 90);
});

d3.selectAll(".x .tick text").each(function(){
    var coords = getCoords(this, svgDoc),
    t = d3.select(this).text();
    doc.text(coords.x-6, coords.y+8, t, null, -45);
});

doc.save(d3.select("head>title").text()+".pdf");
}
