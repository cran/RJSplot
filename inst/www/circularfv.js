var docSize = viewport(),
    width = Math.min(docSize.width,docSize.height) - 30,
    height = width;

window.onload = function(){

  var data = JSON.parse(d3.select("#data").text());

  var yourDiv = document.createElement("div");
  yourDiv.id = "circularfv";
  yourDiv.style["text-align"] = "center";
  document.body.appendChild(yourDiv);

  var app = require("biojs-vis-circularfv");

  var myCircularFeatureViewer = new app({
    target: yourDiv.id,
    sequence: data.sequence,
    features: data.features,
    width: width,
    height: height
  });

  displayButtons();
  bioinfoLogo();
}
