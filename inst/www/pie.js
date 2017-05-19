var docSize = viewport(),
    width = docSize.width - 60,
    height = docSize.height - 30;

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

svg.append("style").text("text { font-size: 10px; font-family: sans-serif; }");

var json = JSON.parse(d3.select("#data").text());

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

displayButtons();
bioinfoLogo();
}

function addPie(nodeItem){
  nodeItem.each(function(d){
    d3.select(this).selectAll(".arc")
      .data(pie(d.value))
    .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .style("fill", function(d,i) { return color(i); })
      .append("title")
        .text(function(d) { return d.data; })
  });
}
