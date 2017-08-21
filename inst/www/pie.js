var docSize = viewport(),
    width = docSize.width - 60,
    height = docSize.height - 30;

var numberShow = false;

var color = d3.scale.category10();

var arc = d3.svg.arc()
      .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null);

var force = d3.layout.force()
      .size([width, height]);

window.onload = function(){

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var json = JSON.parse(d3.select("#data").text());

var cex = json.cex?json.cex:1;

svg.append("style").text("text { font-size: "+(cex*10)+"px; font-family: sans-serif; }");

var data = [];
d3.entries(json.data).forEach(function(d){
  data.push(d);
});

var radius = (Math.min(width,height)/2.4)/data.length;

arc.outerRadius(radius)

force
  .charge(-(40*radius))
  .nodes(data)

var node = svg.selectAll(".node")
        .data(data)
      .enter().append("g")
	.attr("class", "node")
        .call(addPie)
        .call(force.drag);

node.append("text")
  .attr("x",0)
  .attr("y",radius+12)
  .attr("text-anchor","middle")
  .text(function(d){ return d.key; })

force.on("tick",function(){ 
  node.attr("transform", function(d){  return "translate(" + d.x + "," + d.y + ")"; });
})

force.start();

if(json.legend){

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + ((height-(color.domain().length*20))+i*20) + ")"; });

  legend.append("rect")
      .attr("x", width - 28)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 34)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d,i) { return json.legend[i];})
}

iconButton(d3.select("body"),"stats","data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNCAxNCIgaGVpZ2h0PSIxNCIgd2lkdGg9IjE0IiB2ZXJzaW9uPSIxLjEiPgo8cmVjdCByeD0iMiIgaGVpZ2h0PSIxMyIgd2lkdGg9IjEzIiBzdHJva2U9IiNjMGMwYzAiIHk9Ii41IiB4PSIuNSIgZmlsbD0iI2UwZTBlMCIvPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSguMjUyNTUpIiBmaWxsPSIjNjA2MDYwIj4KPHJlY3Qgc3R5bGU9ImNvbG9yLXJlbmRlcmluZzphdXRvO2NvbG9yOiMwMDAwMDA7aXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NoYXBlLXJlbmRlcmluZzphdXRvO3NvbGlkLWNvbG9yOiMwMDAwMDA7aW1hZ2UtcmVuZGVyaW5nOmF1dG8iIGhlaWdodD0iOC44OTgzIiB3aWR0aD0iMS41NDI0IiB5PSIyLjU1MDgiIHg9IjIuNDkxNSIvPgo8cmVjdCBzdHlsZT0iY29sb3ItcmVuZGVyaW5nOmF1dG87Y29sb3I6IzAwMDAwMDtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c2hhcGUtcmVuZGVyaW5nOmF1dG87c29saWQtY29sb3I6IzAwMDAwMDtpbWFnZS1yZW5kZXJpbmc6YXV0byIgaGVpZ2h0PSIzLjU1OTMiIHdpZHRoPSIxLjU0MjQiIHk9IjcuODg5OCIgeD0iNS45NzYiLz4KPHJlY3Qgc3R5bGU9ImNvbG9yLXJlbmRlcmluZzphdXRvO2NvbG9yOiMwMDAwMDA7aXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NoYXBlLXJlbmRlcmluZzphdXRvO3NvbGlkLWNvbG9yOiMwMDAwMDA7aW1hZ2UtcmVuZGVyaW5nOmF1dG8iIGhlaWdodD0iNi4yMjg4IiB3aWR0aD0iMS41NDI0IiB5PSI1LjIyMDMiIHg9IjQuMjM0Ii8+CjxyZWN0IHN0eWxlPSJjb2xvci1yZW5kZXJpbmc6YXV0bztjb2xvcjojMDAwMDAwO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1yZW5kZXJpbmc6YXV0bztzb2xpZC1jb2xvcjojMDAwMDAwO2ltYWdlLXJlbmRlcmluZzphdXRvIiBoZWlnaHQ9IjcuNDE1MyIgd2lkdGg9IjEuNTQyNCIgeT0iNC4wMzM5IiB4PSI3LjcxOSIvPgo8cmVjdCBzdHlsZT0iY29sb3ItcmVuZGVyaW5nOmF1dG87Y29sb3I6IzAwMDAwMDtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c2hhcGUtcmVuZGVyaW5nOmF1dG87c29saWQtY29sb3I6IzAwMDAwMDtpbWFnZS1yZW5kZXJpbmc6YXV0byIgaGVpZ2h0PSIyLjE5NDkiIHdpZHRoPSIxLjU0MjQiIHk9IjkuMjU0MiIgeD0iOS40NjEiLz4KPC9nPgo8L3N2Zz4K","show/hide Stats",displayNumbers,{"position":"absolute","top":"44px","right":"36px"})

displayButtons();
bioinfoLogo();
}

function displayNumbers(){
  if(!numberShow){
	  d3.selectAll("text.label")
		.transition()
		.duration(500)
		.style("opacity", 1)
  }else{
	  d3.selectAll("text.label")
		.transition()
		.duration(500)
		.style("opacity", 0)
  }
  numberShow = !numberShow;
}

function addPie(nodeItem){
  nodeItem.each(function(d){
    var self = d3.select(this);
    d3.select(this).selectAll(".arc")
      .data(pie(d.value))
    .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .style("fill", function(d,i) { return color(i); })
      .on("mouseover",function(d,i){
        if(!numberShow)
          self.selectAll(".label")
	    .transition()
	    .duration(500)
            .style("opacity",function(e,j){ return +(i==j); })
      })
      .on("mouseout",function(d,i){
        if(!numberShow)
          self.selectAll(".label")
	    .transition()
	    .duration(500)
            .style("opacity",0)
      })
  });
  nodeItem.each(function(d){
    d3.select(this).selectAll(".label")
      .data(pie(d.value))
    .enter().append("text")
      .attr("class", "label")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .style("text-anchor", "middle")
      .style("opacity",0)
      .text(function(d) { return d.data; })
  });
}
