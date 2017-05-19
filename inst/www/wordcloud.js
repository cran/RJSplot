var docSize = viewport(),
    width = docSize.width - 100,
    height = docSize.height - 30;

window.onload = function(){

var fill = d3.scale.category20(),
    font = "sans-serif",
    rotation = 0,
    total = 0,
    deleteMode = false;

var json = JSON.parse(d3.select("#data").text());

var svg = d3.select("body")
  .append("div")
    .attr("class","plot")
    .style("text-align","center")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")

function display(){

  var data = json.filter(function(d){ return !d.hidden; });

  total = d3.sum(data,function(d){ return d.count; });

  var multiplier = (Math.min(width,height) / Math.log2(data.length)) * 10;

  var layout = d3.layout.cloud()
    .size([width, height])
    .words(data)
    .padding(2)
    .rotate(function(){
      switch(rotation){
        case 1:
          return 0;
        case 2:
          return (~~(Math.random() * 6) - 3) * 30;
        default:
          return ~~(Math.random() * 2) * 90;
      }
    })
    .font(font)
    .fontSize(function(d){ return d.count / total * multiplier; })
    .on("end", draw);

  layout.start();

}

function draw(words) {

  var texts = svg.selectAll("text")
      .data(words, function(d){ return d.text; })

  texts.exit().remove()

  texts.enter().append("text")
      .text(function(d) { return d.text; })
      .attr("text-anchor", "middle")
      .on("click",function(d){
        if(deleteMode){
          d.hidden = true;
          d3.selectAll(".remove-selection li").filter(function(p){
                if(d.text==p.text)
                  return p.hidden = true;
                else
                  return false;
              })
              .property("checked",false)
              .select(".checkbox").style("color","rgba(0,0,0,0)");
          display();
        }
      })
      .append("title")

  texts
    .transition()
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", font)
      .style("fill", function(d, i) { return fill(i); })
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })

  texts.select("title")
        .text(function(d){
          var count = json.filter(function(p){ return p.text==d.text; })[0].count;
          return d.text+ "\nn: "+count+"\nfreq: "+formatter(count/total);
        });
}

function displayControls() {
    d3.select("head").append("style").text("body { font-family: sans-serif; font-size: 14px; }"+
"div.controls { position:absolute; left:0; top:0; padding: 0 20px; background-color: rgba(255, 255, 255, 0.8); }"+
"div.controls>p { margin: 20px 0 10px 0; }"+
"div.controls>select, ul.remove-selection { border:solid 1px #999; background:#fff; width:120px; }"+
"ul.remove-selection { color: #444; overflow-y: auto; overflow-x: hidden; list-style-type: none; padding: 6px; width:120px; }"+
"ul.remove-selection>li { white-space: nowrap; padding: 2px 0; }"+
"div.checkbox { border: solid 1px #999; width: 12px; height: 12px; display: inline-block; cursor: pointer; margin: 0 6px 0 0; font-size: 14px; line-height: 90%; color: #333; }"+
"div.checkbox:hover { background-color: #eee; }"+
"button { outline: none; background: #aaa; color: #fff; border: none; margin: 0 4px; padding: 4px 6px; cursor: pointer; text-align: center; }"+
"button::-moz-focus-inner { border: 0; }")

    var controls = d3.select("body").append("div").attr("class","controls");

    controls.append("p").text("Change font:")

    controls.append("select")
        .on("change",function(){
          font = this.value;
          display();
        })
        .selectAll("option")
          .data(["sans-serif","serif","monospace"])
        .enter().append("option")
          .property("value",String)
          .text(String)

    controls.append("p").text("Change angle:")

    controls.append("select")
        .on("change",function(){
          rotation = +this.value;
          display();
        })
        .selectAll("option")
          .data(["Hor/Ver","Horizontal","Random"])
        .enter().append("option")
          .property("value",function(d,i){ return i; })
          .text(String)

    controls.append("p").text("Delete by clicking:")

    controls.append("button")
      .html("On&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Off")
      .style({"width":"80px", "margin-left": "20px", "background": "linear-gradient(to right, #ddd 48%, #888 52%)"})
      .on("click",function(){
        deleteMode = !deleteMode;
        d3.selectAll(".plot svg text").style("cursor",deleteMode?"pointer":null)
        d3.select(this).style("background", "linear-gradient(to right, "+(deleteMode?"#888 48%, #ddd 52%":"#ddd 48%, #888 52%")+")")
      })

    controls.append("p").text("Click to remove:")

    var sortedData = json.sort(function(a, b){ return b.count-a.count; });

    var items = controls.append("ul")
        .attr("class","remove-selection")
        .style("height",(height-300)+"px")
        .selectAll("li")
          .data(sortedData)
        .enter().append("li");

    items.property("checked",true)
      .on("click",function(d){
        this.checked = !this.checked;
        d3.select(this).select(".checkbox").style("color",this.checked?null:"rgba(0,0,0,0)");
        d.hidden = !this.checked;
        display();
      })

    items.append("div")
      .attr("class","checkbox")
      .html("&#x2713")

    items.append("span")
      .text(function(d){ return d.text; })
      .attr("title",function(d){ return d.text; })
}

display();
displayControls()
displayButtons();
bioinfoLogo();
}

function svg2pdf(){

var doc = new jsPDF("l","pt",[width, height]);

d3.selectAll("text").each(function(){
	var transform = d3.transform(d3.select(this).attr("transform")),
	txt = d3.select(this.firstChild).text(),
        fontSize = parseInt(d3.select(this).style("font-size"));
        txtWidth = doc.getStringUnitWidth(txt)*fontSize,
	color = d3.rgb(d3.select(this).style("fill")),
        radians = transform.rotate*(Math.PI/180);
        doc.setFont(d3.select(this).style("font-family"));
	doc.setFontSize(fontSize);
	doc.setTextColor(color.r,color.g,color.b);
	doc.text(transform.translate[0]-(Math.cos(radians)*(txtWidth/2))+(width/2), transform.translate[1]-(Math.sin(radians)*(txtWidth/2))+(height/2), txt, -transform.rotate);
});

doc.save(d3.select("head>title").text()+".pdf");
}
