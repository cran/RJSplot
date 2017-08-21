var docSize = viewport(),
    width = docSize.width - 60,
    height = 0,
    margin = {top: 70, right: 200, bottom: 140, left: 110},
    cellSize = 14;

width = width - margin.left - margin.right;

var NAcolor = "transparent";

var colorScales = {
        Reds: ["#fee0d2","#fc9272","#de2d26"],
        Greens: ["#e5f5e0","#a1d99b","#31a354"],
        Blues: ["#deebf7","#9ecae1","#3182bd"],
        RdBkGr: ["#de2d26","#000000","#31a354"],
        RdWhBu: ["#de2d26","#ffffff","#3182bd"]
    },
    colorPNGs = {
        Reds: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAKCAYAAAAO/2PqAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADQSURBVGiB7dTNDYJAEIbhb4ltGEM/FsLBajxQlx0YY7AMPy9gFgIRNips8j4XyOzPzC5kgm+Xo5/hLLmUJcmSrd671D7j+KfxOD4xPrGHv5mjiy+Zm5qjiy/OkVBD++5f5uidJ/XeJY/cS+8bx2cZxB3t08U92P/9zwzzzp03cs60tX8825y8m60vae3V9mlnhVrSXgCwXWUIqguZZgUgC4di7QoAYC4aFoBs0LAAZIOGBSAbNCwA2SgkNWsXAQAz3IsQXEl6rF0JAEyx1NiqXmQmj6dW5YhRAAAAAElFTkSuQmCC',
        Greens: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAKCAYAAAAO/2PqAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAD7SURBVGiB7dRBTsMwEIXhZ4trINT7cJAuOA2LXg8hWm7QbR6rgmOP7BQWwdL/bSLFL5MZW3I6X9+freU1WQfLkqTV0+Wbn3dN1qtENyuHf9qetaKvO9m2p2CCKnub64/ZoKdyv4ZZN1822d5eh30OzvDXWbcZVzVcfWuv99TV3obrxfzDWmW2rB2ur2e4ZeLei/Vw1jv7KWsX/fSym9a//13N0u29M2tRa3RO/Vr9M21qSW9pWV4eknSS9CgA+KcsHZzSKUvmsgIwg6e8dwcAsBUXFoBpcGEBmAYXFoBpcGEBmEaWdNm7CQAYsj+ylY6SPvfuBQA6Llk6fgFo/J+hQhON0wAAAABJRU5ErkJggg==',
        Blues: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAKCAYAAAAO/2PqAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADxSURBVGiB7dQ7bkIxEIXhY4ttRBH7YSEUrIaC3UUpImiyAbpDc3EMvg8bihtL/1cgRniY8Via8PV73Uk+ytpa1p2HD6f4L3BxJssrzozkOf0ykecUt+Y99vyYN36vibznexV5lfNoyMszn+eYz2TyXq/O49W8pTkOs0j/fZ/NcKaIsxp2XmM8nqtR1EzfyxotNad7KO82V6O5Zs38RuKqHvL3b32zqprvv6Gk7yAdNkE+WfoQAPxTlre2TlEsKwB9+IxrdwAAtVhYALrBwgLQDRYWgG6wsAB0I1o6r90EACwLP1EKe0uXtVsBgBnnGLS/AW0gXevwbjT7AAAAAElFTkSuQmCC',
        RdBkGr: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAKCAYAAAAO/2PqAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEFSURBVGiB7dRBTsMwEIXhfyyugVAX7DgKB+mC07Do7VAXqD1GHhsT7JI6rooULL1vk04ymTy7kuPj5fl1It6FdhMgYBIIMQFSvoeQYO6pauV3ci0VfRf1tdnzs4VvST+zLmv9fr+cf1e+om7ma+Ut87XylvlaeTv3olr7X+zFjf+VAogg8rX+DZGv8/3U0VPOSR095Zz03bPUX88h3ZAjz+7OkbP35Kj7V3oW19qz90v9178RqaOnnJNWsvav9Ujw9kDEAfGImdn/tQvikMCHlZkN4SltncDMrJcPLDMbhg8sMxuGDywzG4YPLDMbRgJOW4cwM1unz4S0JzhvHcXMrOEk2H8B13D2jicme4QAAAAASUVORK5CYII=',
        RdWhBu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAKCAYAAAAO/2PqAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEjSURBVGiB7ZQ7bsNADERnCF8jCNyl80VyEBc5TQrfLkgROMcQU3i12g8tOWmUBeY1AkbL4ZAF+XF6eSX5TvIIGmAESMAMJLFoBs7/Si29rWsibcMnfauaULOqttWyT1Hbam1mkHfmKHzmXiuZI5+btu5z05qayHtj9uyzMnvlk2t7rc0cz9H4FJqTcHe4A1P+Ao5ac/ekB5p7oxdeCN46MCHQkk+dJdWjfdv3Xd7GGeeeVX2RMZr1XsZOazJOaQ9930d2XGeMd7z0+NuOm4y/3XGeq9vxJx1vB7pfQD5BCCH+L8cJfjEAOlZCiBF4tr0TCCHEo+hgCSGGQQdLCDEMOlhCiGHQwRJCDIM5cN07hBBCbMMvA3kG8L13FCGEWOFqwPkHIrtg733WUJwAAAAASUVORK5CYII='
    },
    colorPNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAADcklEQVQ4y22UTWhcZRiFz/t+3/2ZuTPJ5JqkmcQ0TWiaosVqunBRxIglCF25FelCcOkiBVeiUMR9t6Ibt4KuREQs6s4gahG6CVXaRFrzN5P7M/fnu9+PiwFJ0bM+z/vCgXMoTVOcErGn6qPB0Z00u5upw5HxSfbj7qWV/stREBvbPGE+BZPRxd7OrST9uDtlyEfqcKAwqMWoag9PotXpG5vPbYVeB3BPwEScD+893L4208/CKYg2asZA45HCUY20QVLgOIuTw/mbG58tTa85ZwHw+EQ+vPfop6vLs9lshK6HQEAKCAFiOIGGMZJI/UHR++uD7954eLQz/swAjC53f9w8G+tJH6GDZ8AG5OAsrEVjUWikGrlDLpNmorz17U2AADCx9/iXD+c7SYfhO7CBUBAKpOEcDFBoJA1ShZFGYaKha+0zf/T1bSZmXQ6q+59MOvgKVIFrcAWuIRrAQGlkDYYVhpVIqv6wWD4s5/ab3p0Hf0hmebL7fS+sfQOuAQNokA8BMOAYpcKgxEExcVT0k2q6aCYL1SXdAvmf//yDrA5/78EJDViAAAmSEDW4hBHIKjrOVo6zuZMqzlWnNm1tfbbCOt6+vyNNti8q8JgcR08ghmCQ9Wz9gi7PmTqGiXzrSwg4Qc61LZqKJRRRDggAgAMsYEENhKJWdWVSXZ6xT+fU8aVXMxsmR0RwbTShiqQM+qaAZfCYVIACFfDylWh0YV4vn4gZGQSHASc+V5IaCUc2oHqCQxmcuVTd9QwaaYAGqIASyFucr4bFYmymFr1Q+DIKxDCkNKDcJyUNs1pfOyd7F1958EUYe41fgyqgBkpgdIFGS1JNt1zQc1DWCeMiTYnGiXaj0Bhfbb70LMv2VPD822kpmwIogAqon0K9ArVApiPAobMTxk5qF9dutnD9wswq9eLqDAB2pulff/fvej5roDWgGGoNaolsTC5gsA8K4drWhc5FxkxYFVP15lsb1joGIILOwtaXe3omoXZjz0OtQPedaRMEAQLOdzaA8aBJKiOy17c2mPnfVrlo8eLce9/sBusH/EyGBYWuJqnJWbKWLIQhqWxYqonR9fdf7Z8/898xAEB/3v6UtvNuFXs2rMEp21zYkdCZ30RX5q++c40F/++SjDtKzOLxV78lv+41lS7J6ZaYXj+7+tplAM66095/AIXCz8hIhvLCAAAAAElFTkSuQmCC';

window.onload = function(){

  var data = JSON.parse(d3.select("#data").text()),
      options = data.options?data.options:{};

  if(options.NAcolor)
    NAcolor = options.NAcolor;

  var cex = options.cex?options.cex:1;

  cellSize = cellSize*cex;

  if(data.metadata)
    margin.top = margin.top + data.metadata.dim[0]*cellSize + 4;

  height = data.matrix.dim[0]*cellSize;

  d3.select("body")
    .on("click",function(){ d3.select(".scalePicker").remove(); })
    .append("div")
      .attr("class","tooltip")
      .style({"position":"absolute","display":"none","background-color":"rgba(0,0,0,0.8)","font-family":"sans-serif","font-size":(cex*12)+"px","color":"white","padding":"4px"});

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    svg.append("style").text("text { font-size: "+(cex*10)+"px; font-family: sans-serif; }"+
".axis path { fill: none; stroke: none; }"+
".axis line { fill: none; stroke: #aaa; }"+
".link { vector-effect: non-scaling-stroke; fill: none; stroke: #ccc; stroke-width: 1.5px; }"+
".brush .extent{ fill-opacity: 0.15; stroke-width: 1px; fill: #333; stroke: #333; }");

  var defs = svg.append("defs");

  d3.entries(colorScales).forEach(function(d){ addGradient(defs,d.key,d.value); });

  var rowClust = svg.append("g")
      .attr("class","rowClust")
      .attr("clip-path",addMask(defs,"rowClust",height,margin.left))
      .attr("transform", "translate(0,"+margin.top+")rotate(90)scale(1,-1)");
  var colClust = svg.append("g")
      .attr("class","colClust")
      .attr("clip-path",addMask(defs,"colClust",width,margin.top))
      .attr("transform", "translate("+margin.left+",0)");
  var matrix = svg.append("g")
      .attr("class","matrix")
      .attr("clip-path",addMask(defs,"matrix",width,height))
      .attr("transform", "translate("+margin.left+","+margin.top+")");
  var rowNames = svg.append("g")
      .attr("class","rowNames axis")
      .attr("transform", "translate("+(width+margin.left+4)+","+margin.top+")");
  var colNames = svg.append("g")
      .attr("class","colNames axis")
      .attr("transform", "translate("+margin.left+","+(height+margin.top+4)+")");

  dendrogram(rowClust,data.rows,height,margin.left-4);
  dendrogram(colClust,data.cols,width,(data.metadata?70:margin.top)-4);

  drawMetadata(colClust,data.metadata);
  drawMatrix(matrix,data.matrix,options.scaleColor);

  displayNames(rowNames,data.matrix.rows,[0,height],"right");
  displayNames(colNames,data.matrix.cols,[0,width],"bottom");

  displayButtons();
  bioinfoLogo();
}

function dendrogram(svg,root,width,height){
  if(root){
  var cluster = d3.layout.cluster()
    .separation(function() { return 1; })
    .size([width, height]);

  var diagonal = (function(d) { return "M"+d.source.x+","+d.source.y+"L"+d.target.x+","+d.source.y+"L"+d.target.x+","+d.target.y; });

  var y = d3.scale.linear()
    .range([0, height])

  var nodes = cluster.nodes(root);
      y.domain(d3.extent(nodes, function(d){ return d.height; }).reverse());
      nodes.forEach(function(d){
	d.y = d.children? y(parseFloat(d.height)) : height;
	});
  var links = cluster.links(nodes);

  svg.append("g")
    .selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal)
  }
}

function drawMetadata(svg,metadata){
  if(metadata){

    var rows = metadata.dim[0],
      cols = metadata.dim[1],
      x = d3.scale.linear().domain([0, cols]).range([0, width]),
      y = d3.scale.linear().domain([0, rows]).range([70, margin.top-4]);

    var cellWidth = x(1)-x(0),
        cellHeight = y(1)-y(0);

    if(rows==1)
      metadata.rows = [metadata.rows]; 

    metadata.data.forEach(function(d,j){
      if(typeof d[0] == "string")
        var c = d3.scale.category10();
      else
        var c = d3.scale.linear().range(["#d62728","#1f77b4"]).domain(d3.extent(d));

      svg.select("g").selectAll("."+metadata.rows[j])
        .data(d)
      .enter().append("rect")
        .attr("class","metacell "+metadata.rows[j])
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("x", function(d,i){ return x(i); })
        .attr("y", function(d,i){ return y(j); })
        .style("fill", function(d,i) { return c(d); })
        .append("title")
          .text(function(d,i){ return (metadata.rows[j])+"\nsample: "+(metadata.cols[i])+"\nvalue: "+d; });
    });
  }
}

function drawMatrix(svg,matrix,color){

  var colorDomain = d3.extent(matrix.scaled || matrix.data);
  colorDomain = [colorDomain[0],d3.mean(colorDomain),colorDomain[1]];

  displayScale(d3.select("svg"),colorDomain)

  var rows = matrix.dim[0],
      cols = matrix.dim[1],
      x = d3.scale.linear().domain([0, cols]).range([0, width]),
      y = d3.scale.linear().domain([0, rows]).range([0, height]),
      c = d3.scale.linear().range(colorScales[color]).domain(colorDomain);

  var cell = svg.selectAll(".cell")
      .data(matrix.data)
    .enter().append("rect")
      .attr("class","cell")
      .call(drawCells);
  fillCells(color);

  var brush = d3.svg.brush()
        .x(x)
        .y(y)
        .clamp([true, true])
        .on('brush', function() {
          var extent = brush.extent();
          extent[0][0] = Math.round(extent[0][0]);
          extent[0][1] = Math.round(extent[0][1]);
          extent[1][0] = Math.round(extent[1][0]);
          extent[1][1] = Math.round(extent[1][1]);
          d3.select(this).call(brush.extent(extent));
        })
        .on('brushend', function() {
          zoom(brush.extent());
          brush.clear();
          d3.select(this).call(brush);
        });

  var tooltip = d3.select(".tooltip");

  svg.append("g")
      .attr("class", "brush buttons")
      .call(brush)
      .select("rect.background")
        .on("mouseenter",function(){ 
          tooltip.style("display","block");
        })
        .on("mousemove",function(){          
          var col = Math.floor(x.invert(d3.mouse(this)[0]));
          var row = Math.floor(y.invert(d3.mouse(this)[1]));
          var label = formatter(matrix.data[col*rows + row]);
          tooltip.html("row: "+matrix.rows[row]+"<br/>col: "+matrix.cols[col]+"<br/>value: "+label);
          tooltip.style({"left":window.scrollX+d3.event.clientX+10+"px","top":window.scrollY+d3.event.clientY+10+"px"});
        })
        .on("mouseleave",function(){ 
          tooltip.style("display","none");
        })

  iconButton(d3.select("body"),"colors",colorPNG,"Change Color Scale",scalePicker,{"position":"absolute","top":"70px","right":"36px"})

  function drawCells(cells){
    var cellWidth = x(1)-x(0),
        cellHeight = y(1)-y(0);
    cells
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("x", function(d,i){ return x(Math.floor(i/rows)); })
      .attr("y", function(d,i){ return y(i%rows); })
  }

  function fillCells(color){
    c.range(colorScales[color]);
    d3.select(".scale rect").attr("fill", "url(#"+color+")")
    d3.selectAll(".cell").transition().duration(500).style("fill", function(d,i) {
      var val = (matrix.scaled || matrix.data)[i];
      if(val == null)
        return NAcolor;
      return c(val);
    })
  }

  function displayScale(svg,domain){
    var scaleWidth = 60;

    var x = d3.scale.linear()
      .range([0,scaleWidth/2])
      .domain(domain);

    var axis = d3.svg.axis()
      .scale(x)
      .tickValues(domain)
      .orient("bottom");

    var scale = svg.append("g")
	.attr("class","scale")
        .attr("transform", "translate(20,10)");
      scale.append("rect")
	.attr({x:0, y:0, height:10, width:scaleWidth, rx:2, fill:"black"})
      scale.append("g")
        .attr("class","axis")
        .attr("transform","translate(0,13)")
        .call(axis);
  }

  function scalePicker(){
    d3.event.stopPropagation();

    var colors = d3.keys(colorScales);

    var picker = d3.select("svg").append("g")
      .attr("class","scalePicker")
      .attr("transform","translate("+(width+margin.left+margin.right-90)+",10)");

    picker.append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("rx",2)
      .attr("width",60)
      .attr("height", 8 + colors.length*14)
      .style({"fill":"white","stroke":"#ccc"})

    picker.selectAll("rect>rect")
        .data(colors)
      .enter().append("rect")
      .attr("x",10)
      .attr("y",function(d,i){ return 6 + i*14; })
      .attr("rx",2)
      .attr("width",40)
      .attr("height",10)
      .attr("fill",function(d){ return "url(#"+d+")"; })
      .style("cursor","pointer")
      .on("click",fillCells);
  }

  function zoom(ex){
      var scale = [1,1], translate = [0,0];

      if(ex[0][0]==ex[1][0] || ex[0][1]==ex[1][1]){
        height = rows * cellSize;
        ex = [[0,0],[cols,rows]];
      }else{
        height = (ex[1][1] - ex[0][1]) * cellSize;
        scale = [
          cols / (ex[1][0] - ex[0][0]),
          rows / (ex[1][1] - ex[0][1])
        ];
        translate = [
          ex[0][0] * (width / cols) * scale[0] * -1,
          ex[0][1] * (height / rows) * scale[1] * -1
        ];
      }

      x.range([translate[0], width * scale[0] + translate[0]]);
      y.range([translate[1], height * scale[1] + translate[1]]);
      drawCells(cell.transition().duration(500));
      displayNames(d3.select("g.rowNames").transition().duration(500),matrix.rows.slice(ex[0][1],ex[1][1]),[0,height],"right");
      displayNames(d3.select("g.colNames").transition().duration(500).attr("transform","translate("+margin.left+","+(height+margin.top+4)+")"),matrix.cols.slice(ex[0][0],ex[1][0]),[0,width],"bottom");
      d3.select(".rowClust>g").transition().duration(500).attr("transform","translate("+translate[1]+",0)scale(1,1)");
      d3.select(".colClust>g").transition().duration(500).attr("transform","translate("+translate[0]+",0)scale("+scale[0]+",1)");
      d3.select("#rowClustMask>rect").transition().duration(500).attr("width",height);
      d3.select("#matrixMask>rect").transition().duration(500).attr("height",height);
      d3.select("svg").transition().duration(500).attr("height", height + margin.top + margin.bottom);
  }
}

function displayNames(svg,names,range,orient){

  var x = d3.scale.ordinal()
    .rangeBands(range)
    .domain(names);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient(orient);

  svg.call(xAxis);

  if(orient == "bottom")
      svg.selectAll(".tick text")
	.attr("x", 6)
	.attr("y", 6)
	.attr("transform", "rotate(45)")
	.style("text-anchor","start")
}

function addGradient(defs, id, stops){
  var offset = 100/(stops.length-1);
  var gradient = defs.append("linearGradient")
	.attr("id",id)
	.attr("x1","0%")
	.attr("y1","0%")
	.attr("x2","100%")
	.attr("y2","0%");

  stops.forEach(function(d, i){
    gradient
	.append("stop")
	.attr("offset",(offset*i)+"%")
	.style("stop-color",d);
  })
}

function addMask(defs,id,w,h){
    defs.append("clipPath")
    .attr("id", id+"Mask")
    .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h);

  return "url(#"+id+"Mask)";
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

d3.selectAll(".rowClust .link").each(function(d,i){
  var coords = getCoords(this, svgDoc);
  if(i%2!=0){
    doc.line(coords.x, coords.y, coords.x, coords.y2);
    doc.line(coords.x, coords.y2, coords.x2, coords.y2);
  }else{
    doc.line(coords.x, coords.y2, coords.x, coords.y);
    doc.line(coords.x, coords.y, coords.x2, coords.y);
  }
});

d3.selectAll(".colClust .link").each(function(d,i){
  var coords = getCoords(this, svgDoc);
  if(i%2!=0){
    doc.line(coords.x, coords.y, coords.x2, coords.y);
    doc.line(coords.x2, coords.y, coords.x2, coords.y2);
  }else{
    doc.line(coords.x, coords.y2, coords.x, coords.y);
    doc.line(coords.x, coords.y, coords.x2, coords.y);
  }
});

d3.selectAll(".metacell").each(function(){
  var coords = getCoords(this, svgDoc),
      color = d3.rgb(d3.select(this).style("fill"));
    doc.setFillColor(color.r,color.g,color.b);
    doc.rect(coords.x,coords.y,coords.x2-coords.x,coords.y2-coords.y,"F");
});

d3.selectAll(".cell").each(function(){
  var coords = getCoords(this, svgDoc),
      color = d3.rgb(d3.select(this).style("fill"));
  if(coords.x>=margin.left&&coords.y>=margin.top&&coords.x2<=margin.left+width&&coords.y2<=margin.top+height){
    doc.setFillColor(color.r,color.g,color.b);
    doc.rect(coords.x,coords.y,coords.x2-coords.x,coords.y2-coords.y,"F");
  }
});

doc.setFillColor(255);
doc.rect(0,0,margin.left,margin.top,"F");

doc.setDrawColor(170);
d3.selectAll(".tick line").each(function(){
  var coords = getCoords(this, svgDoc);
  doc.line(coords.x, coords.y, coords.x2, coords.y2);
});

d3.selectAll(".tick text").each(function(){
  var coords = getCoords(this, svgDoc),
      rotate = d3.select(this).attr("transform");
  doc.text(coords.x, coords.y+10, this.textContent, null, rotate?-45:0);
});

doc.setFillColor(255);
doc.rect(0,margin.top+height,margin.left,margin.bottom,"F");
doc.rect(margin.left+width,0,margin.right,margin.top,"F");
//doc.rect(margin.left+width,margin.top+height,margin.right,margin.bottom,"F");

d3.select(".scale rect").each(function(){
  var idGrad = d3.select(this).attr("fill").replace(/url\(\#|\)/g, "");
  doc.addImage(colorPNGs[idGrad],'PNG',20,10,60,10);
})

doc.save(d3.select("head>title").text()+".pdf");
}
