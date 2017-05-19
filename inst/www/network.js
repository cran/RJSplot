var docSize = viewport(),
    width = docSize.width - 24,
    height = docSize.height - 260;

window.onload = function(){

var graph = JSON.parse(d3.select("#data").text());

graph.nodes.forEach(function(n){
  var fields = d3.keys(n);
  n.attr = {};
  fields.forEach(function(f){
    if(f!="name"){
      n.attr[f] = n[f];
      delete n[f];
    }
  })
});

graph.links.forEach(function(l){
  var fields = d3.keys(l);
  l.attr = {};
  fields.forEach(function(f){
    if(f!="source"&&f!="target"){
      l.attr[f] = l[f];
      delete l[f];
    }
  })
});

var nodes = graph.nodes,
    links = graph.links;

var attr = graph.attr?graph.attr:{};

var colorDomain = d3.extent(nodes, function(d) { return d.attr[attr.color]; }),
    sizeDomain = d3.extent(nodes, function(d) { return d.attr[attr.size]; }),
    weightDomain = d3.extent(links, function(d) { return d.attr[attr.weight]; });

var color = d3.scale.category20();
var areaColor = d3.scale.category10();

var size = d3.scale.linear()
    .range([3,12])
    .domain(sizeDomain);

var weight = d3.scale.linear()
    .range([1,5])
    .domain(weightDomain);

if(typeof colorDomain[0] == 'number'){
var colorRK = d3.scale.linear()
    .domain(colorDomain)
    .range(["#d62728","#000000"]);

var colorRKG = d3.scale.linear()
    .domain([colorDomain[0],colorDomain[0]+(colorDomain[1]-colorDomain[0])/2,colorDomain[1]])
    .range(["#d62728","#000000","#2ca02c"]);
}

var force = d3.layout.force()
    .size([width, height])
    .on("tick", tick );

d3.select("head").append("style")
.text("body { font-family: sans-serif; font-size: 12px; }"+
"div.tab-wrap { padding: 0 10px; }"+
"div.tab-wrap>div:first-child { text-align: right; border-top: solid 1px #888; }"+
"div.tab-wrap>div:first-child>div { position: relative; top: -24px; display: inline-block; padding: 4px 8px; margin: 0 2px; border: solid 1px #888; border-radius: 5px 5px 0 0; background: #fff; width: 100px; text-align: center; cursor: pointer; }"+
"@-moz-document url-prefix() { div.tab-wrap>div:first-child>div { top: -25px; } }"+
"div.tables { overflow-y: auto; clear: both; }"+
"div.switch { width: 30px; height: 21px; margin: 5px; background-color: #888; border-radius: 5px; float: right; position: relative; top: -28px; margin-right: 10px; cursor: pointer; }")

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("style")
     .text("text { font-family: sans-serif; pointer-events: none; } "+
".buttons rect { fill: #888; stroke: #666; stroke-width: 1.5px; cursor: pointer; } "+
".buttons text { stroke-width: 0.5px; font-size: 10px; fill: #444; } "+
".axis .domain { stroke: #666; stroke-width: 4px; stroke-linecap: round; } "+
".handle { fill: #888; stroke: #666; } "+
".scale text { font-size: 12px; fill: #444; } "+
".link { stroke: #999; stroke-opacity: .6; } "+
".distance { stroke-width: 0.5px; font-size: 7px; fill: #999; } "+
".node circle { stroke: #fff; stroke-width: 1.5px; } "+
".node>text { stroke-width: 0.5px; font-size: 8px; fill: #444; }"+
".area { opacity: 0.2; stroke-width: 3; }");

var defs = svg.append("defs");

addGradient("gradRK", ["#d62728","#000000"]);
addGradient("gradRKG", ["#d62728","#000000","#2ca02c"]);

var buttons = svg.append("g")
      .attr("class", "buttons")
      .attr("transform", "translate(20,20)")

  addButton(0,"PDF export",null,svg2pdf);
  addButton(15,"SVG export",null,svgDownload);
  addButton(30,"Show/Hide text",null,clickText);

var sliders = buttons.append("g")
      .attr("transform", "translate(150,0)");

if(weightDomain[0]!=weightDomain[1]){
  brushSlider(height-50,weightDomain,"Filter edges by weight",function(x){
    var names = [];
    links.forEach(function(d){
      if(d.attr[attr.weight]<x[0] || d.attr[attr.weight]>x[1])
        d.noShow = true;
      else{
        delete d.noShow;
        if(names.indexOf(d.source.name)==-1)
          names.push(d.source.name)
        if(names.indexOf(d.target.name)==-1)
          names.push(d.target.name)
      }
    });
    nodes.forEach(function(d){
      if(names.indexOf(d.name)==-1)
        d.noShow = true;
      else
        delete d.noShow;
    });
    drawNet();
  });
}

drawNet();

displaySlider(5, [0, -400], -200, "Node repulsion", "charge");
displaySlider(20, [0, 100], 80, "Edge distance", "linkDistance");

if(typeof colorDomain[0] == 'number'){
    addButton(45,null,"url(#gradRK)",function(){ clickColor(colorRK, "url(#gradRK)"); });
    addButton(60,null,"url(#gradRKG)",function(){ clickColor(colorRKG, "url(#gradRKG)"); });

    var scale = svg.append("g")
	.attr("class","scale")
        .attr("transform", "translate("+(width-320)+",20)")
	.style("opacity","0")
    scale.append("rect")
	.attr("x",0)
	.attr("y",0)
	.attr("height",10)
	.attr("width",300)
	.attr("rx",2);
    scale.append("text")
	.attr("x",0)
	.attr("y",25)
	.text(formatter(colorDomain[0]));
    scale.append("text")
	.attr("x",300)
	.attr("y",25)
	.attr("text-anchor", "end")
	.text(formatter(colorDomain[1]));

    clickColor(colorRK, "url(#gradRK)");
}

drawTables();

function tick() {
    svg.selectAll(".link").attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
	
    svg.selectAll(".distance")
          .attr("x", function(d) { return ((d.target.x)+(d.source.x))/2; })
          .attr("y", function(d) { return ((d.target.y)+(d.source.y))/2; });

    svg.selectAll(".node").attr("transform", function(d){	return "translate(" + d.x + "," + d.y + ")"; });

    svg.selectAll(".area").each(function(dd){
          var points = nodes.filter(function(d){ return (d.attr[attr.group]==dd.group)&&!d.noShow; });
          dd.xExt = d3.extent(points,function(d){ return d.x;});
          dd.yExt = d3.extent(points,function(d){ return d.y;});
        })
        .attr("x", function(d){ return d.xExt[0]-3 })
        .attr("y", function(d){ return d.yExt[0]-3 })
        .attr("width", function(d){ return d.xExt[1]-d.xExt[0]+6 })
        .attr("height", function(d){ return d.yExt[1]-d.yExt[0]+6 });
}

function drawNet(){

  force
      .nodes(nodes.filter(function(d){ return !d.noShow; }))
      .links(links.filter(function(d){ return !d.noShow; }))
      .start();

  // nodes
  var node = svg.selectAll(".node")
      .data(force.nodes(), function(d) { return d.name; });

  node.exit().remove();

  var nodeEnter = node.enter().insert("g",".buttons")
	.attr("class", "node")
	.call(force.drag);

  nodeEnter.append("circle")
      .attr("r", function(d) { return attr.size?size(d.attr[attr.size]):5; })
      .style("fill", function(d) { return color(d.attr[attr.color]); })

  nodeEnter.append("text")
      .attr("x", function(d) { return attr.size?(4+size(d.attr[attr.size])):8; })
      .attr("y", 2)
      .text(function(d) { return attr.label?d.attr[attr.label]:d.name; });

  nodeEnter.append("title")
      .text(function(d) {
        var str = d.name;
        for(i in d.attr)
          str = str+"\n"+i+": "+formatter(d.attr[i]);
        return str; 
      });

  // links
  var link = svg.selectAll(".link")
      .data(force.links(), function(d) { return d.source.name+" "+d.target.name; });

  link.exit().remove();

  link.enter().insert("line",".node")
      .attr("class", "link")
      .style("stroke-width", function(d) { return weight(d.attr[attr.weight]); });

  if(attr.weight){
    var distance = svg.selectAll(".distance")
          .data(force.links(), function(d) { return d.source.name+" "+d.target.name; });

    distance.exit().remove();

    distance.enter().insert("text",".node")
        .attr("class","distance")
        .text(function(d) { return formatter(d.attr[attr.weight]); });
  }

  // areas
  var groups = [];
  if(attr.group){
    groups = d3.set(force.nodes().map(function(d){return d.attr[attr.group];})).values();
    groups = groups.map(function(d){
      var dd = {};
      dd.group = d;
      dd.xExt = [0,0];
      dd.yExt = [0,0];
      return dd;
    });
  }

  var area = svg.selectAll(".area")
        .data(groups);

  area.exit().remove();

  area.enter().insert("rect",".link")
    .attr("class", "area")
    .attr("rx", 10)
    .style("stroke",function(d) { return areaColor(d.group); })
    .style("fill",function(d) { return d3.rgb(areaColor(d.group)).brighter(0.6); });
}

function clickText() {
  var texts = d3.selectAll(".distance, .node>text");
    if(texts.style("opacity")!=0){
	texts.transition()
	.duration(500)
	.style("opacity",0);}
    else{
	texts.transition()
	.duration(500)
	.style("opacity",1);
    }
}

function clickColor(newcolor, fill) {
  color = newcolor;
  d3.selectAll(".node circle").transition()
       .duration(500)
       .style("fill", function(d){ return color(d.attr[attr.color]) });
  d3.select(".scale rect")
	.style("fill", fill);
  d3.select(".scale").transition()
	.duration(500)
	.style("opacity",(fill!="black")?1:0);
}

function addGradient(id, stops){
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

function addButton(y,txt,fill,callback) {
    buttons.append("rect")
	.attr("x",0)
	.attr("y",y)
	.attr("rx",2)
	.attr("ry",2)
	.attr("width",30)
	.attr("height",10)
	.style("fill",fill)
	.on("click", callback);
    if(txt){
	buttons.append("text")
	.attr("x",35)
	.attr("y",y+8)
	.text(txt);
    }
}

function displaySlider(y, domain, start, txt, name){
	var scale = d3.scale.linear()
	    .domain(domain)
	    .range([0, 200])
	    .clamp(true);

	var brush = d3.svg.brush()
	    .x(scale)
	    .extent([0, 0])
	    .on("brush", brushed);

	sliders.append("text")
	    .attr("x", 210)
	    .attr("y", y+3)
	    .text(txt);

	var slider = sliders.append("g")
	    .attr("transform", "translate(0,"+ y +")")
	    .attr("class", "x axis")
	    .call(d3.svg.axis()
	      .scale(scale)
	      .orient("bottom")
	      .tickSize(0)
              .ticks(0))
	    .append("g")
	      .attr("class", "slider")
	      .call(brush);

	var handle = slider.append("circle")
	    .attr("class", "handle")
	    .attr("r", 6);

	slider
	    .call(brush.extent([start, start]))
	    .call(brush.event);

	slider.selectAll(".extent, .resize, .background").remove();

	function brushed() {
	  var value = brush.extent()[0];

	  if (d3.event.sourceEvent) {
	    value = scale.invert(d3.mouse(this)[0]);
	    brush.extent([value, value]);
	  }

	  handle.attr("cx", scale(value));
	  force[name](value).start();
	}
}

function brushSlider(y,domain,txt,callback){

  var x = d3.scale.linear()
      .range([0, 200])
      .domain(domain);

  var brush = d3.svg.brush()
      .x(x)
      .extent(domain)
      .on("brush", brushmove);

  var brushg = buttons.append("g")
      .attr("class", "axis brushSlider")
      .attr("transform", "translate(0," + y + ")")
      .call(d3.svg.axis().scale(x).orient("top").tickValues(domain).tickSize(0).tickPadding(12));

  brushg.selectAll("text")
    .style("text-anchor", "middle");

  brushg.append("text")
    .attr("x", 220)
    .attr("y", 3)
    .text(txt);

  brushg.append("g")
      .attr("class","brush")
      .call(brush);

  brushg.selectAll(".resize>rect").remove();

  brushg.selectAll(".resize").append("circle")
      .attr("class", "handle")
      .attr("r",6)

  brushg.selectAll(".resize").append("path")
      .attr("d","m -12,-22 c -1,0 -2,1 -2,2 l 0,8 c 0,1 1,2 2,2 l 10,0 2,2 2,-2 10,0 c 1,0 2,-1 2,-2 l 0,-8 c 0,-1 -1,-2 -2,-2 l -24,0 z")
      .style({"visibility":null,"fill":"#ddd","stroke":"#aaa"})

  var cloudText = brushg.selectAll(".resize")
      .append("text")
      .attr("x",0)
      .attr("y",-12)
      .style("text-anchor","middle")
      .text(function(d,i){ return d3.round(domain[+!i],1); });

  brushg.select(".extent")
      .attr("y",-3)
      .attr("height", 6)
      .style({"fill-opacity": ".8", "stroke": "none", "fill": "#47c0c0"});

  brushg.select(".background").remove();

  function brushmove() {
    var extent = brush.extent();
    cloudText.text(function(d,i){ return d3.round(extent[+!i],1); })
    callback(extent);
  }
}

function drawTables(){
  var div = d3.select("body").append("div")
        .attr("class","tab-wrap"),
      items = div.append("div");

  div = div.append("div").attr("class","tables")
          .style("height","210px")

  drawTable(nodes);
  drawTable(links);

  d3.select("body").insert("div",".tab-wrap")
    .attr("class","switch")
    .html('<svg xmlns="http://www.w3.org/2000/svg" height="20" width="29" viewBox="0 0 14 14" version="1.1"><path fill="#ffffff" d="m4.2852 2.3666v4.3255h-2.7983l2.7561 2.8709 2.757 2.871 2.757-2.871 2.756-2.8709h-2.7983v-4.3255h-5.4293z"/></svg>')
    .on("click",function(){
      var buttArrow = d3.select(this).select('svg'),
      funSwitch = function(divH,svgH,brushY,arrowR){
        div.transition().duration(500).style("height",divH+"px")
        svg.transition().duration(500).attr("height",svgH)
        svg.select(".brushSlider").transition().duration(500).attr("transform","translate(0,"+brushY+")")
        buttArrow.transition().duration(500).style("transform","rotate("+arrowR+"deg)")
        force.size([width, svgH]).start();
      }
      if(div.style("height")!="0px"){
        height += 210;
        funSwitch(0,height,height-50,180);
      }else{
        height -= 210;
        funSwitch(210,height,height-50,0);
      }
    })

  function drawTable(data){
    var tab = div.append("table"),
        thead = tab.append("thead").append("tr"),
        tbody = tab.append("tbody"),
        columns = d3.keys(data[0].attr),
        name = "nodes";

    if(data[0].name){
      thead.append("th").text("name");
    }else{
      name = "links";
      thead.append("th").text("source");
      thead.append("th").text("target");
    }
    tab.attr("class",name+" display")
    columns.forEach(function(d){
      thead.append("th").text(d);
    })

    data.forEach(function(d){
      var tr = tbody.append("tr");
      if(name=="nodes"){
        tr.append("td").text(d.name);
        tr.on("mouseover",function(){
          svg.selectAll("g.node").filter(function(p){ return d.name===p.name; }).select("circle").style({"stroke":"yellow","stroke-width":"3"});
        })
        tr.on("mouseout",function(){
          svg.selectAll("g.node>circle").style({"stroke":null,"stroke-width":null});
        })
      }else{
        tr.append("td").text(d.source.name);
        tr.append("td").text(d.target.name);
        tr.on("mouseover",function(){
          svg.selectAll("line.link").filter(function(p){ return d.source.name===p.source.name && d.target.name===p.target.name; }).style({"stroke":"yellow","stroke-opacity":"1"});
        })
        tr.on("mouseout",function(){
          svg.selectAll("line.link").style({"stroke":null,"stroke-opacity":null});
        })
      }
      columns.forEach(function(col){
        var val = d.attr[col],
            td = tr.append("td");
        if(isNaN(val))
          td.text(val);
        else
          td.attr("class","dt-body-right").text(formatter(val));
      })
    });

    $(tab.node()).DataTable({
      dom: 'fBt',
      "bPaginate": false,
      buttons: ['copy','csv','excel']
    });

    var divtab = d3.select(tab.node().parentNode);

    if(name=="links")
      divtab.style("display","none");

    items.append("div")
      .text(name)
      .style("border-bottom-color",name=="nodes"?"#fff":null)
      .on("click",function(){
        items.selectAll("div").style("border-bottom-color",null)
        d3.select(this).style("border-bottom-color","#fff")
        div.selectAll("div.tables>div").style("display","none")
        divtab.style("display",null)
      })
  }
}

bioinfoLogo();
}

function svg2pdf(){

var doc = new jsPDF("l","pt",[width,height]);

if(!d3.select(".scale").empty()) {
if(d3.select(".scale").style("opacity")!=0){
    var imgGrad = "";
    if(d3.select(".scale rect").style("fill").indexOf("#gradRKG")!=-1){
	imgGrad = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAKCAYAAAAO/2PqAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAECSURBVGiB7dSxbcMwEIXh/24PI1DnYTKIi0yTwotlgBSBM4aeC0cOLVMy5RSKgPc10oHUuwNtMD72+1fEu6ROQA9IujyL+voO9KP6dr+Qim8R/aiWprJGa6N6PutnhqK+5Ldk3e6tZQ31/f5ifv096/dMi7Xr/uKcNc6aWJvIGura7znUtf/DfVaxVn4bQEBEQOV9bi0iIB/vm1zL9l7P9p7MWNC7ui+XndVc78UZld7NGU/2Lmd/kP+Z5FumdAQ6zMz+K9EJHRNit/YsZmYNXnLtCczMWvnCMrPN8IVlZpvhC8vMNsMXlpltRgKntYcwM2vwlX1wEHyvPYmZ2YxTEIcz9Cz1Yl1UT7gAAAAASUVORK5CYII=";}else{
	imgGrad = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAKCAYAAAAO/2PqAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADeSURBVGiB7dTBqQIxGEXhO8E25OHOYizEhdW8hY1ZgAvRMrwujJK8ZOLownmB8zEDEw4kPwoZDuv1Jli/llaWFZ/nq+zbsj9pkpNetnsfPzue0Do76dUWe3Wux7rY3/m62N/52o1W7J/MVezfapW5srMrLTu7Mtdz/5GW9GqTZI83xf5RS/rb7cVczRZ/lHdbjzP//R+mti/PdbS0WwR7Lw1LAcD/tRqkfeCyAtCJnzD3BAAwFRcWgG5wYQHoBhcWgG5wYQHoRpB0nnsIAJjgFK6DtpIuc08CAA1nS9sbiMQxeZdo9AkAAAAASUVORK5CYII=";}
doc.addImage(imgGrad, 'PNG', width-320, 20, 300, 10);
doc.setFontSize(10);
doc.setTextColor(68);
d3.selectAll(".scale text").each(function(){
	var x = parseFloat(d3.select(this).attr("x"))+(width-320),
	    y = parseFloat(d3.select(this).attr("y"))+20,
	    t = d3.select(this).text();
	doc.text(x, y, t);
});
}}

var areas = [];
d3.selectAll(".area").each(function(){
  var d = {};
    d.colorf = applyOpacity(d3.rgb(d3.select(this).style("fill")),0.2,{r:255,g:255,b:255});
    d.colord = applyOpacity(d3.rgb(d3.select(this).style("stroke")),0.2,{r:255,g:255,b:255});
    d.x = parseFloat(d3.select(this).attr("x"));
    d.y = parseFloat(d3.select(this).attr("y"));
    d.width = parseFloat(d3.select(this).attr("width"));
    d.height = parseFloat(d3.select(this).attr("height"));
  areas.push(d);
});
areas.sort(function(a,b){
  var areaA = a.width * a.height,
      areaB = b.width * b.height;
  if (areaA < areaB) {
    return 1;
  }
  if (areaA > areaB) {
    return -1;
  }
  return 0;
});
areas.forEach(function(d){
  doc.setFillColor(d.colorf.r,d.colorf.g,d.colorf.b);
  doc.setDrawColor(d.colord.r,d.colord.g,d.colord.b);
  doc.roundedRect(d.x,d.y,d.width,d.height,10,10,"FD");
}); 

doc.setDrawColor(188,188,188);
d3.selectAll(".link").each(function(){
	var x1 = parseFloat(d3.select(this).attr("x1")),
		x2 = parseFloat(d3.select(this).attr("x2")),
		y1 = parseFloat(d3.select(this).attr("y1")),
		y2 = parseFloat(d3.select(this).attr("y2")),
		w = parseFloat(d3.select(this).style("stroke-width"));
	doc.setLineWidth(w);
	doc.line(x1, y1, x2, y2);
});

var show = d3.selectAll(".distance, .node>text").style("opacity")!=0;
if(show){
doc.setFontSize(8);
doc.setTextColor(143);
d3.selectAll(".distance").each(function(){
	var x = parseFloat(d3.select(this).attr("x")),
		y = parseFloat(d3.select(this).attr("y"))
		t = d3.select(this).text();
	doc.text(x, y, t);
});
}

doc.setLineWidth(1);
doc.setDrawColor(255,255,255);
doc.setFontSize(8);
doc.setTextColor(64);
d3.selectAll(".node").each(function(){
	var color = d3.rgb(d3.select(this.childNodes[0]).style("fill")),
	    position = d3.select(this).attr("transform"),
	    x = parseFloat(position.split("(")[1].split(".")[0]),
	    y = parseFloat(position.split(/[,| ]/)[1].split(".")[0]),
	    r = parseFloat(d3.select(this.childNodes[0]).attr("r")),
	    tx = parseFloat(d3.select(this.childNodes[1]).attr("x")),
	    t = d3.select(this.childNodes[1]).text();
	doc.setFillColor(color.r,color.g,color.b);
	doc.circle(x, y, r, 'FD');
	if(show)
		doc.text((x+tx),(y+2), t);
});

doc.save(d3.select("head>title").text()+".pdf");
}
