var docSize = viewport(),
    width = Math.min(docSize.width,docSize.height) - 30,
    height = width,
    margin = {top: 150, right: 10, bottom: 10, left: 150};

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var triangle = true;

window.onload = function(){

  var json = JSON.parse(d3.select("#data").text()),
      attr = json.attr?json.attr:{},
      options = json.options?json.options:{};

  var x = d3.scale.ordinal().rangeBands([0, width]),
      z = d3.scale.linear().range([0.1,1]).domain(d3.extent(json.links, function(d){return d[attr.weight];})),
      color = d3.scale.category10();

  displaySelect();

  var svg = d3.select("body").append("div")
    .attr("class","plot")
    .style("text-align","center")
    .append("svg")

  var cex = options.cex?options.cex:1;

  svg.append("style").text("text { font-size: "+(cex*10)+"px; font-family: sans-serif; }");

  svg = svg.append("g")

  var matrix = [],
      nodes = json.nodes,
      n = nodes.length;

  // Compute index per node.
  nodes.forEach(function(node, i) {
    node.index = i;
    node.count = 0;
    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
  });

  // Convert links to matrix; count character occurrences.
  json.links.forEach(function(link) {
    matrix[link.source][link.target].z = link[attr.weight];
    matrix[link.target][link.source].z = link[attr.weight];
    nodes[link.source].count += link[attr.weight];
    nodes[link.target].count += link[attr.weight];
  });

  // Precompute the orders.
  var orders = {
    name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
    count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
    group: d3.range(n).sort(function(a, b) { return nodes[b][attr.group] - nodes[a][attr.group]; })
  };

  // The default sort order.
  x.domain(orders.name);

  svg.append("rect")
      .style("fill","#eee")
      .attr("width", width)
      .attr("height", height);

  var row = svg.selectAll(".row")
      .data(matrix)
    .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .each(row);

  row.append("line")
      .attr("x2", width)
	.style("stroke","#fff");

  row.append("text")
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .text(function(d, i) { return attr.label?nodes[i][attr.label]:nodes[i].name; });

  var column = svg.selectAll(".column")
      .data(matrix)
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

  column.append("line")
      .attr("x1", -width)
	.style("stroke","#fff");

  column.append("text")
      .attr("dy", ".32em")
      .text(function(d, i) { return attr.label?nodes[i][attr.label]:nodes[i].name; });

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) { return d.z; }))
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("height", x.rangeBand())
        .style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", function(d) { return nodes[d.x][attr.group] == nodes[d.y][attr.group] ? color(nodes[d.x][attr.group]) : null; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .append("title")
          .text(function(d) {
            return nodes[d.x].name + " - " + nodes[d.y].name + " \nvalue: " + formatter(d.z);
          })
  }

  function mouseover(p) {
    d3.selectAll(".row text").style("fill", function(d, i) {
if(i == p.y) return "red"; else return null;
});
    d3.selectAll(".column text").style("fill", function(d, i) {
if(i == p.x) return "red"; else return null; 
});
  }

  function mouseout() {
    d3.selectAll("text").style("fill", null);
  }

  d3.select("select.order").on("change", function() {
    order(this.value);
  });

  d3.select("select.layout").on("change", function() {
    layout(this.value);
  });

  function order(value) {
    x.domain(orders[value]);

    var t = svg.transition().duration(2500);

    t.selectAll(".row")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .selectAll(".cell")
        .delay(function(d) { return x(d.x) * 4; })
        .attr("x", function(d) { return x(d.x); });

    t.selectAll(".column")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
  }

  function layout(value){
    triangle = (value == "triangle");

    d3.select(".plot>svg").attr(triangle?{
       "width": width*1.75,
       "height": height
      }:{
       "width": (width + margin.left + margin.right),
       "height": (height + margin.top + margin.bottom)
    })

    svg.attr("transform", triangle? "translate(" + width/6 + "," + height + ")rotate(-45)" : "translate(" + margin.left + "," + margin.top + ")")

    row.selectAll("text").attr(triangle?{
      "x": width + 6,
      "text-anchor": "start"
    }:{
      "x": -6,
      "text-anchor": "end"
    })

    column.selectAll("text").attr(triangle?{
      "x": -6,
      "y": - x.rangeBand() / 2,
      "text-anchor": "end",
      "transform": "rotate(180)"
    }:{
      "x": 6,
      "y": x.rangeBand() / 2,
      "text-anchor": "start",
      "transform": null
    })
  }

  layout(triangle?"triangle":"square");
  displayButtons();
  bioinfoLogo();
}

function displaySelect() {
    d3.select("head").append("style").text("body { font-family: sans-serif; font-size: 14px; }"+
"div.controls { position:absolute; left:0; top:0; padding: 0 20px; background-color: rgba(255, 255, 255, 0.8); }"+
"div.controls>p { margin: 20px 0 10px 0; }"+
"div.controls>select { border:solid 1px #999; background:#fff; width:120px; }")

    var controls = d3.select("body").append("div").attr("class","controls");

    controls.append("p").text("Change layout:")

    controls.append("select")
        .attr("class", "layout")
        .selectAll("option")
          .data(["triangle","square"])
        .enter().append("option")
          .property("value",String)
          .text(String)

    controls.append("p").text("Change order:")

    controls.append("select")
        .attr("class", "order")
        .selectAll("option")
          .data([["name","by name"],["count","by Frequency"],["group","by Cluster"]])
        .enter().append("option")
          .property("value",function(d){ return d[0]; })
          .text(function(d){ return d[1]; })
}

function svg2pdf(){

  if(triangle){
    alert("PDF export not available in triangle mode!");
  }else{

    var doc = new jsPDF("l","pt",[width + margin.left + margin.right, height + margin.top + margin.bottom]),
        svgDoc = d3.select("svg").node(),
        dim = d3.select("rect.cell").attr("width");

    doc.setDrawColor(255);
    doc.setFillColor(238,238,238);
    for(i=0;i<width/dim;i++){
      for(j=0;j<height/dim;j++){
        doc.rect((i*dim+margin.left),(j*dim+margin.top), dim, dim, 'FD');
      }
    }

    d3.selectAll(".cell").each(function(){
      var self = d3.select(this),
          x = +self.attr("x") + margin.left,
          y = d3.transform(d3.select(this.parentNode).attr("transform")).translate[1] + margin.top,
          o = self.style("fill-opacity");
      try{
        var color = d3.rgb(self.style("fill"));
        color = applyOpacity(color,o,{r:255,g:255,b:255});
        doc.setFillColor(color.r,color.g,color.b);
      }catch(e){
        doc.setFillColor((1-o).toString());
      }
      doc.rect(x, y, dim, dim, 'FD');
    });

    doc.setFontSize(10);
    doc.setTextColor(64);
    d3.selectAll(".row text").each(function(){
      var self = d3.select(this),
          y = d3.transform(d3.select(this.parentNode).attr("transform")).translate[1] + margin.top,
          txt = self.text(),
          txtWidth = doc.getStringUnitWidth(txt) * 10,
          x = margin.left - txtWidth;
      doc.text(x-6, y+14, txt);
    });
    d3.selectAll(".column text").each(function(){
      var self = d3.select(this),
          x = d3.transform(d3.select(this.parentNode).attr("transform")).translate[0] + margin.left,
          txt = self.text(),
          y = margin.top;
      doc.text(x+14, y-6, txt, null, 90);
    });

    doc.save("heatmap.pdf");
  }
}
