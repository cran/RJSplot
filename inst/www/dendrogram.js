var docSize = viewport(),
    width = docSize.width - 60,
    height = 0,
    margin = {top: 10, right: 160, bottom: 10, left: 10};

width = width - margin.left - margin.right;

var diagonal = (function(d) { return "M"+d.source.y+","+d.source.x+"L"+d.source.y+","+d.target.x+"L"+d.target.y+","+d.target.x; });

window.onload = function(){

  var data = JSON.parse(d3.select("#data").text());

  height = data.size*14;

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    svg.append("style").text("text {font-size:10px;font-family:sans-serif;}");
    svg = svg.append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");

  var gap = 0;
  if(data.metadata){
    gap = data.metadata.dim[1]*14;
    drawMetadata(svg.append("g").attr("transform", "translate("+(width - gap)+",0)"),data.metadata);
    gap = gap + 4;
  }

  var cluster = d3.layout.cluster()
    .separation(function() { return 1; })
    .size([height, width - gap]);

  var x = d3.scale.linear()
    .range([0, width - gap])

  var nodes = cluster.nodes(data.root);
      x.domain(d3.extent(nodes, function(d){ return d.height; }).reverse())
      nodes.forEach(function(d){
	d.y = d.children? x(parseFloat(d.height)) : (width - gap);
	});
  var links = cluster.links(nodes);

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal)
      .style({"fill": "none", "stroke": "#ccc", "stroke-width": "1.5px"});

  var node = svg.selectAll(".node")
      .data(nodes.filter(function(d){ return !d.children; }))
    .enter().append("text")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + (d.y + gap) + "," + d.x + ")"; })
      .attr("dx", 8)
      .attr("dy", 3)
      .text(function(d) { return d.name; });

  displayButtons();
  bioinfoLogo();
}

function drawMetadata(svg,metadata){
    var rows = metadata.dim[0],
      cols = metadata.dim[1],
      x = d3.scale.linear().domain([0, cols]).range([0, cols*14]),
      y = d3.scale.linear().domain([0, rows]).range([0, height]);

    var cellWidth = 14,
        cellHeight = 14;

    if(cols==1)
      metadata.cols = [metadata.cols];

    metadata.data.forEach(function(d,j){
      if(typeof d[0] == "string")
        var c = d3.scale.category10();
      else
        var c = d3.scale.linear().range(["#d62728","#1f77b4"]).domain(d3.extent(d));

      svg.selectAll("."+metadata.cols[j])
        .data(d)
      .enter().append("rect")
        .attr("class","metacell "+metadata.cols[j])
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("x", function(d,i){ return x(j); })
        .attr("y", function(d,i){ return y(i); })
        .style("fill", function(d,i) { return c(d); })
        .append("title")
          .text(function(d,i){ return (metadata.cols[j])+"\nsample: "+(metadata.rows[i])+"\nvalue: "+d; });
    });
}

function svg2pdf(){

var PDFw = width + margin.left + margin.right,
    PDFh = height + margin.top + margin.bottom;

var doc = new jsPDF((PDFw>PDFh)?"l":"p","pt",[PDFw,PDFh]),
    svgDoc = d3.select("svg").node();

doc.setFontSize(10);
doc.setTextColor(0);
doc.setDrawColor(128);
doc.setLineWidth(1);

d3.selectAll(".metacell").each(function(){
  var coords = getCoords(this, svgDoc),
      color = d3.rgb(d3.select(this).style("fill"));
    doc.setFillColor(color.r,color.g,color.b);
    doc.rect(coords.x,coords.y,coords.x2-coords.x,coords.y2-coords.y,"F");
});

d3.selectAll("path.link").each(function(d,i){
	var coords = getCoords(this, svgDoc);
	if(i%2!=0){
	  doc.line(coords.x, coords.y, coords.x, coords.y2);
	  doc.line(coords.x, coords.y2, coords.x2, coords.y2);
	}else{
	  doc.line(coords.x, coords.y2, coords.x, coords.y);
	  doc.line(coords.x, coords.y, coords.x2, coords.y);
	}
});

d3.selectAll("text.node").each(function(){
	var coords = getCoords(this, svgDoc),
	t = d3.select(this).text();
	doc.text(coords.x, coords.y + 10, t);
});

doc.save(d3.select("head>title").text()+".pdf");
}
