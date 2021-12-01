var docSize = viewport(),
    width = docSize.width - 60,
    height = docSize.height - 40,
    margin = {top: 40, right: 40, bottom: 80, left: 90};

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

window.onload = function(){

var x = d3.scale.linear()
    .range([10, 26]);

var y = d3.scale.linear()
    .range([0, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  svg.append("style")
    .text("text { font: 10px sans-serif;} "+
".mapTrack { fill: #090; }"+
".band {stroke: #000; fill: #FFF;} "+
".acen {fill: #DDD;} "+
".gpos25 {fill: rgb(25%, 25%, 25%);} "+
".gpos33 {fill: rgb(33%, 33%, 33%);} "+
".gpos50 {fill: rgb(50%, 50%, 50%);} "+
".gpos66 {fill: rgb(66%, 66%, 66%);} "+
".gpos75 {fill: rgb(75%, 75%, 75%);} "+
".gpos100 {fill: #000;} "+
".gneg {fill: #FFF;} "+
".gvar {fill: #CCC;} "+
".stalk {fill: #666; stroke: none}");

  svg = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = JSON.parse(d3.select("#data").text());

  y.domain([0,data.max]);

  var xMin = 0,
      xMax = 0,
      count = data.chrlist.length;

d3.entries(data.data).forEach(function(chr){
  chr.value.forEach(function(d){
    if(d[2]<xMin)
      xMin = d[2];
    if(d[2]>xMax)
      xMax = d[2];
  });
});

  x.domain([xMin,xMax]).nice();

  if ((width/count)<40){
    width = count*40;
    d3.select("svg").attr("width", width + margin.left + margin.right)
  }

data.chrlist.forEach(function(chr, i){

  svg.append("text")
     .attr("transform", "translate("+(i*width/count)+","+(height+16)+") rotate(45)")
     .text(chr);

    var gChr = svg.append("g")
      .attr("class", "chromosome")
      .attr("id", chr)
      .attr("transform", "translate("+(i*width/count)+","+height+") rotate(-90)")

    displayChr(gChr, y, data.chromosomes[chr]);

    gChr.selectAll(".mapTrack")
       .data(data.data[chr])
     .enter().append("path")
      .attr("class", "mapTrack")
      .attr("d", function(d){
        var x1 = x(0),
            x2 = x(d[2]),
            y1 = y(d[0]),
            y2 = y(d[1]);
        if(y2-y1<1){
          y2 = ((y1+y2)/2)+.5;
          y1 = ((y1+y2)/2)-.5;
        }
        return "M"+y1+","+x1+"L"+y2+","+x1+"L"+y2+","+x2+"L"+y1+","+x2+"Z";
      })
});

displayButtons();
bioinfoLogo();
}

function displayChr(gChr, chrScale, json){

      var bands = gChr.selectAll(".band")
        .data(json);
      bands.enter().append("path").append("title");
      bands.exit().remove();
      bands.attr("id", function(d){return (typeof d.id != 'undefined')?gChr.attr("id")+"_"+d.id:null;})
        .attr("class", function(d){return (typeof d.type != 'undefined')?"band "+d.type:"band";})
        .attr("d", function(d){
            var dPath = "",
		start = chrScale((typeof d.start == 'undefined')?0:d.start),
		end = chrScale(d.end);	    
            if(typeof d.type != 'undefined' && d.type=="acen"){
              if(d.id.indexOf("q")!=-1)
                dPath = "M"+end+",2L"+start+",5L"+end+",8Z";
              else
                dPath = "M"+start+",2L"+end+",5L"+start+",8Z";
            }else{ 
              dPath = "M"+start+",2L"+end+",2L"+end+",8L"+start+",8Z";
            }
            return dPath;
          })
      bands.select("title").text(function(d){return (typeof d.id != 'undefined')?d.id:gChr.attr("id");})
}

function svg2pdf(){

var pdfWidth = width + margin.left + margin.right,
    pdfHeight = height + margin.top + margin.bottom,
    doc = new jsPDF(pdfWidth>pdfHeight?"l":"p","pt",[pdfWidth, pdfHeight]),
    svgDoc = d3.select("svg").node();

doc.setDrawColor(0);
doc.setLineWidth(1);

d3.selectAll(".chromosome path.band:not(.acen)").each(function(){
	var coords = getCoords(this, svgDoc),
	  color = d3.rgb(d3.select(this).style("fill"));
	doc.setFillColor(color.r,color.g,color.b);
	doc.rect(coords.x, coords.y, coords.x2-coords.x, coords.y2-coords.y, 'FD');
});

d3.selectAll(".chromosome path.acen").each(function(d,i){
	var coords = getCoords(this, svgDoc),
	  color = d3.rgb(d3.select(this).style("fill"));
	doc.setFillColor(color.r,color.g,color.b);
	if(i%2==0)
	  doc.triangle(coords.x, coords.y, coords.x2, coords.y, (coords.x+coords.x2)/2, coords.y2, 'FD');
	else
	  doc.triangle(coords.x, coords.y2, coords.x2, coords.y2, (coords.x+coords.x2)/2, coords.y, 'FD');
});

doc.setFillColor(0,144,0);
d3.selectAll(".chromosome path.mapTrack").each(function(){
  var coords = getCoords(this, svgDoc);
  doc.rect(coords.x, coords.y, coords.x2-coords.x, coords.y2-coords.y, 'F');
});

d3.selectAll("text").each(function(){
	var coords = getCoords(this, svgDoc),
	t = d3.select(this.childNodes[0]).text(),
	color = d3.rgb(d3.select(this).style("fill")),
	s = parseInt(d3.select(this).style("font-size")),
	rotate = d3.select(this).attr("transform");
	rotate = rotate?rotate.indexOf("rotate(45)")!=-1:false;
	doc.setTextColor(color.r,color.g,color.b);
	doc.setFontSize(s);
	doc.text(coords.x, coords.y+6, t, null, rotate?-45:null);
});

doc.save(d3.select("head>title").text()+".pdf");
}
