var docSize = viewport(),
    width = docSize.width - 60,
    height = docSize.height - 30,
    margin = {top: 40, right: 40, bottom: 140, left: 90};

window.onload = function(){

  var json = JSON.parse(d3.select("#data").text());

  var single = false;

  if(typeof json.cols == 'string')
    single = true;
  else{
    margin.right = 120;
    width = width + 30;
  }

  var largerword = d3.max(json.rows,function(d){ return d.length; })*4;
  if(largerword>margin.bottom)
    margin.bottom = largerword;

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  var color = d3.scale.category10();

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(formatter)
    .orient("left")

  x.domain(json.rows);

  // create svg
  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  svg.append("style").text("text { font: 10px sans-serif; }"+
".axis { font: 10px sans-serif; }"+
".axis path, .axis line { fill: none; stroke: #000; shape-rendering: crispEdges; }");  

  svg = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height + 20) + ")")
      .call(xAxis)
		.append("text")
		  .attr("x", width)
		  .attr("y", -4)
		  .style("text-anchor", "end")
		  .style("font-size", "10px") 
		  .text(json.labels.x);

  svg.selectAll(".x.axis .tick text")
	  .attr("x", 8)
	  .attr("y", 8)
	  .attr("transform", "rotate(45)")
	  .style("text-anchor", "start")

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-20,0)")
      .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 12)
		  .attr("x", 0)
		  .style("text-anchor", "end")
		  .style("font-size", "10px") 
		  .text(json.labels.y);

  // initialize bars
  var gBar = svg.selectAll(".gBar")
      .data(json.data)
    .enter().append("g")
      .attr("class","gBar")

  gBar.each(function(d,i){

    var bar = d3.select(this).selectAll("path")
        .data(single?[d]:d)
      .enter().append("path")
        .style("fill",function(d,j){ return color(json.cols[j]) });

    bar.append("title")
        .text(function(d,j) { return "("+json.rows[i]+", "+(single?"":json.cols[j]+", ")+d+")"; });
  })

  displayBar("stack");

  if(!single){

    // draw legend
    var legend = svg.append("g")
        .attr("class","legend")
        .attr("transform", "translate("+width+",100)")
        .selectAll("g")
            .data(json.cols)
          .enter().append("g")
            .attr("transform", function(d,i){ return "translate(0,"+(i*20)+")"; })

    legend.append("rect")
      .attr("x", 6)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", 30)
      .attr("y", 14)
      .text(String)

    // layout controls
    d3.select("head").append("style")
    .text("body { font-family: sans-serif; font-size: 10px; }"+
    ".controls { position: absolute; top: 10px; right: 60px; width: 60px; padding: 5px 16px; }"+
    ".controls .option { padding: 3px; margin: 4px 0; text-align: center; background: #888; color: #fff; border: solid 2px rgba(0,0,0,0); cursor: pointer; border-radius: 2px; font-weight: bold; }")

    var div = d3.select("body").append("div")
      .attr("class","controls")

    var options = div.selectAll(".option")
      .data(["stack","dodge","overlap"])
    .enter().append("p")
      .attr("class","option")
      .style("border-color",function(d,i){ return i?null:"#666"; })
      .text(String)
      .on("click",function(d){
        options.style("border-color",null)
        d3.select(this).style("border-color","#666")
        displayBar(d);
      })
  }

  // define layouts
  function displayBar(type){
    var dataExtent = function(ex){
          if(ex[0]>0)
            ex[0] = 0;
          if(ex[1]<0)
            ex[1] = 0;
          y.domain(ex);
        },
        rangeBand = x.rangeBand(),
        getX = function(i){ return x(json.rows[i]); }

    if(type=="stack"){

      dataExtent(single ? d3.extent(json.data) : d3.extent(json.data.map(function(d){ return d3.sum(d); })));

      gBar.each(function(d,i){

        var bar = d3.select(this).selectAll("path")
          .attr("d",function(d){
            var tl, tr, bl, br;
            tl = [getX(i),y(0)];
            tr = [tl[0]+rangeBand,tl[1]];
            bl = [tl[0],tl[1]];
            br = [tr[0],tl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })

        var accum = 0;
        bar.transition().duration(1000)
          .attr("d",function(d){
            var tl, tr, bl, br;
            bl = [getX(i),y(accum)];
            br = [bl[0]+rangeBand,bl[1]];
            accum = accum + d;
            tl = [bl[0],y(accum)];
            tr = [br[0],tl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })
      })
    }

    if(type=="dodge"){

      rangeBand = rangeBand/json.cols.length;
      getX = function(i,j){
        return x(json.rows[i])+(rangeBand*j);
      }

      dataExtent(d3.extent(d3.merge(json.data)));

      gBar.each(function(d,i){

        var bar = d3.select(this).selectAll("path")
          .attr("d",function(d,j){
            var tl, tr, bl, br;
            tl = [getX(i,j),y(0)];
            tr = [tl[0]+rangeBand,tl[1]];
            bl = [tl[0],tl[1]];
            br = [tr[0],tl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })

        bar.transition().duration(1000)
          .attr("d",function(d,j){
            var tl, tr, bl, br;
            tl = [getX(i,j),y(d)];
            tr = [tl[0]+rangeBand,tl[1]];
            bl = [tl[0],y(0)];
            br = [tr[0],bl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })
      })
    }

    if(type=="overlap"){

      dataExtent(d3.extent(d3.merge(json.data)));

      gBar.each(function(d,i){

        var bar = d3.select(this).selectAll("path")
          .attr("d",function(d){
            var tl, tr, bl, br;
            tl = [getX(i),y(0)];
            tr = [tl[0]+rangeBand,tl[1]];
            bl = [tl[0],tl[1]];
            br = [tr[0],tl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })

        var data = [],
            start = d.map(function(){ return 0; });
        for(var j = 0; j < d.length; j++)
          data.push([j,d[j]]);
        data = data.sort(function(a,b){ return Math.abs(a[1])-Math.abs(b[1]); });
        for(var j = 0; j < d.length-1; j++)
          start[data[j+1][0]] = data[j][1];

        bar.transition().duration(1000)
          .attr("d",function(d,j){
            var tl, tr, bl, br;
            bl = [getX(i),y(start[j])];
            br = [bl[0]+rangeBand,bl[1]];
            tl = [bl[0],y(d)];
            tr = [br[0],tl[1]];
            return "M"+tl+"L"+tr+"L"+br+"L"+bl+"Z";
          })
      })
    }

    d3.select(".y.axis").transition().duration(1000).call(yAxis)
  }

  displayButtons();
  bioinfoLogo();
}

function svg2pdf(){

  var doc = new jsPDF("l","pt",[width + margin.left + margin.right, height + margin.top + margin.bottom]),
      svgDoc = d3.select("svg").node();

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setDrawColor(0);
  doc.setLineWidth(1);

  d3.selectAll(".gBar>path").each(function(){
    var coords = getCoords(this, svgDoc),
    color = d3.rgb(d3.select(this).style("fill"));
    doc.setFillColor(color.r,color.g,color.b);
    doc.rect(coords.x, coords.y, coords.x2-coords.x, coords.y2-coords.y, 'F');
  });

  d3.selectAll(".axis line").each(function(){
    var coords = getCoords(this, svgDoc);
    doc.line(coords.x, coords.y, coords.x2, coords.y2);
  });

  d3.selectAll(".x.axis path").each(function(){
    var coords = getCoords(this, svgDoc);
    doc.line(coords.x, coords.y, coords.x2, coords.y);
  });

  d3.selectAll(".y.axis path").each(function(){
    var coords = getCoords(this, svgDoc);
    doc.line(coords.x2, coords.y, coords.x2, coords.y2);
  });

  d3.selectAll(".x.axis>text, .y.axis .tick text, .legend text").each(function(){
    var coords = getCoords(this, svgDoc),
    t = d3.select(this).text();
    doc.text(coords.x+2, coords.y+10, t);
  });

  d3.selectAll(".y.axis>text").each(function(){
    var coords = getCoords(this, svgDoc),
    t = d3.select(this).text();
    doc.text(coords.x+8, coords.y, t, null, 90);
  });

  d3.selectAll(".x.axis .tick text").each(function(){
    var coords = getCoords(this, svgDoc),
    fontSize = parseFloat(d3.select(this).style("font-size")),
    t = d3.select(this).text();
    doc.setFontSize(fontSize);
    doc.text(coords.x-4, coords.y+10, t, null, -45);
  });

  if(!d3.select(".legend").empty()){
    d3.selectAll(".legend rect").each(function(){
      var coords = getCoords(this, svgDoc),
      color = d3.rgb(d3.select(this).style("fill"));
      doc.setFillColor(color.r,color.g,color.b);
      doc.rect(coords.x, coords.y, coords.x2-coords.x, coords.y2-coords.y, 'F');
    })
  }

  doc.save(d3.select("head>title").text()+".pdf");
}
