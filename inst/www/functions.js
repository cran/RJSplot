function fileDownload(blob,name){
  if(window.navigator.msSaveBlob){
    window.navigator.msSaveBlob(blob, name);
  }else{
    var reader = new FileReader();
    reader.onload = function (event) {
      var save = document.createElement('a');
      save.href = event.target.result;
      save.target = '_blank';
      save.download = name;
      var clicEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      save.dispatchEvent(clicEvent);
      (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(blob);
  }
}

function svgDownload(){
  var svg = d3.select("svg");
  svg.select(".buttons").style("display", "none");
  var svgString = new XMLSerializer().serializeToString(svg.node());
  svg.select(".buttons").style("display", null);
  var blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
  fileDownload(blob, d3.select("head>title").text()+'.svg');
}

function canvasExport(){
  var pngButton = document.createElement("button");
  pngButton.appendChild(document.createTextNode("PNG"));
  pngButton.style = "position:absolute;right:10px;top:10px";
  pngButton.addEventListener("click",getPNG);
  document.body.appendChild(pngButton);

  function getPNG(){
    var canvas = document.querySelector("body>canvas");
    canvas.toBlob(function(blob){
      fileDownload(blob, document.querySelector("head>title").textContent+'.png');
    })
  }
}

function getCoords(elem, svgDoc) {

  var offset = svgDoc.getBoundingClientRect();

  var bbox = elem.getBBox(),
    x = bbox.x,
    y = bbox.y,
    x2 = x+bbox.width,
    y2 = y+bbox.height;

  var matrix = elem.getScreenCTM();

  return {
    x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
    y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top,
    x2: (matrix.a * x2) + (matrix.c * y2) + matrix.e - offset.left,
    y2: (matrix.b * x2) + (matrix.d * y2) + matrix.f - offset.top
  };
}

function applyOpacity(rgb,alpha,old){
  var blending = function(newC,old){
    return alpha * newC + (1 - alpha) * old;
  }
  return {r: blending(rgb.r,old.r), g: blending(rgb.g,old.g), b: blending(rgb.b,old.b)};
}

function viewport(){
  var e = window,
      a = 'inner';
  if ( !( 'innerWidth' in window ) ){
    a = 'client';
    e = document.documentElement || document.body;
  }
  return { width : e[a+'Width'] , height : e[a+'Height'] }
}

function formatter(d){
  if(typeof d == 'number'){
    var dabs = Math.abs(d);
    if((dabs>0 && dabs<1e-3) || dabs>1e+5)
      d = d.toExponential(3);
    else
      d = Math.round(d * 1000) / 1000;
  }
  return d;
}

function iconButton(sel,alt,src,title,job,style){
    sel.append("img")
      .attr("class","icon")
      .attr("alt", alt)
      .attr("width", 14)
      .attr("height", 14)
      .attr("src", src)
      .attr("title", title)
      .style("cursor","pointer")
      .style(style)
      .on("click", job);
}

function displayButtons(){

  var svgIcon_b64 = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSIxNCIgd2lkdGg9IjE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgdmlld0JveD0iMCAwIDE0IDE0Ij4KPHJlY3Qgc3R5bGU9ImNvbG9yLXJlbmRlcmluZzphdXRvO2NvbG9yOiMwMDAwMDA7aXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NoYXBlLXJlbmRlcmluZzphdXRvO3NvbGlkLWNvbG9yOiMwMDAwMDA7aW1hZ2UtcmVuZGVyaW5nOmF1dG8iIHJ5PSIyLjYzNDciIGhlaWdodD0iMTMuNTE3IiB3aWR0aD0iMTMuNTE3IiBzdHJva2U9IiNkZWE4NTMiIHk9Ii4yNDEzOCIgeD0iLjI0MTM4IiBzdHJva2Utd2lkdGg9Ii40ODI3NiIgZmlsbD0iI2ZjZjNkYiIvPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCguNzY1NzQgLjY0MzE1IC0uNjQzMTUgLjc2NTc0IDMuNjI1OSAuMDEwNCkiPgo8cGF0aCBvcGFjaXR5PSIuOTkiIHN0eWxlPSJjb2xvci1yZW5kZXJpbmc6YXV0bztjb2xvcjojMDAwMDAwO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1yZW5kZXJpbmc6YXV0bztzb2xpZC1jb2xvcjojMDAwMDAwO2ltYWdlLXJlbmRlcmluZzphdXRvIiBkPSJtMi4yMjQ4IDYuMDQwMmMwLTIuNjUzOCAyLjE1MTMtNC44MDUxIDQuODA1MS00LjgwNTEgMi42NTM4IDNlLTcgNC44MDUxIDIuMTUxMyA0LjgwNTEgNC44MDUxIiBzdHJva2U9IiNhMDYyMDAiIHN0cm9rZS13aWR0aD0iLjciIGZpbGw9IiNmZmQ1NmYiLz4KPHBhdGggb3BhY2l0eT0iLjk4IiBkPSJtMS4zMDUzIDEuMjM1MWgxMS40NDkiIHN0cm9rZT0iI2EwNjIwMCIgc3Ryb2tlLXdpZHRoPSIuNyIgZmlsbD0ibm9uZSIvPgo8cmVjdCBzdHlsZT0iY29sb3ItcmVuZGVyaW5nOmF1dG87Y29sb3I6IzAwMDAwMDtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c2hhcGUtcmVuZGVyaW5nOmF1dG87c29saWQtY29sb3I6IzAwMDAwMDtpbWFnZS1yZW5kZXJpbmc6YXV0byIgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1KSIgaGVpZ2h0PSIxLjU5MTgiIHdpZHRoPSIxLjU5MTgiIHN0cm9rZT0iIzY5NGMwZiIgeT0iNS4wNDgzIiB4PSIzLjMwMTYiIHN0cm9rZS13aWR0aD0iLjUiIGZpbGw9Im5vbmUiLz4KPC9nPgo8L3N2Zz4K";

  var pdfIcon_b64 = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSIxNCIgd2lkdGg9IjE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTQgMTQiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXBQYXRoNDE4OSIgY2xpcFBhdGhVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBzdHlsZT0iY29sb3ItcmVuZGVyaW5nOmF1dG87Y29sb3I6IzAwMDAwMDtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c2hhcGUtcmVuZGVyaW5nOmF1dG87c29saWQtY29sb3I6IzAwMDAwMDtpbWFnZS1yZW5kZXJpbmc6YXV0byIgZD0ibTkuMDM4NiAwLjAwMDNoLTYuMjMyNWMtMC4zMzQ4IDAtMC42MDU4IDAuMjY4OS0wLjYwNTggMC42MDM4djEyLjc5MmMwIDAuMzM0OCAwLjI3MTAxIDAuNjAzOCAwLjYwNTg0IDAuNjAzOGg4LjM4NzdjMC4zMzQ4MyAwIDAuNjA1ODQtMC4yNjkgMC42MDU4NC0wLjYwMzh2LTEwLjYzNWMtMC45MjEtMC45MTk4LTEuODQxOS0xLjg0MDQtMi43NjE3LTIuNzYwOXoiIGZpbGw9IiNkMzFlMWUiLz4KPC9jbGlwUGF0aD4KPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXJHcmFkaWVudDQxNjkiIHkyPSItLjM1NTkzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDI9IjUuNTExNSIgeTE9IjE0Ljc3MSIgeDE9IjkuMDgxNyI+CjxzdG9wIHN0b3AtY29sb3I9IiM5NzE2MTYiIG9mZnNldD0iMCIvPgo8c3RvcCBzdG9wLWNvbG9yPSIjZDUxYjFiIiBvZmZzZXQ9Ii40NDkxNCIvPgo8c3RvcCBzdG9wLWNvbG9yPSIjZTg1YzVjIiBvZmZzZXQ9IjEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cGF0aCBzdHlsZT0iY29sb3ItcmVuZGVyaW5nOmF1dG87Y29sb3I6IzAwMDAwMDtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c2hhcGUtcmVuZGVyaW5nOmF1dG87c29saWQtY29sb3I6IzAwMDAwMDtpbWFnZS1yZW5kZXJpbmc6YXV0byIgZD0ibTkuMDM4NiAwLjAwMDI5OThoLTYuMjMyNWMtMC4zMzQ4IDAtMC42MDU4IDAuMjY4OS0wLjYwNTggMC42MDM4djEyLjc5MmMwIDAuMzM0OCAwLjI3MTAxIDAuNjAzOCAwLjYwNTg0IDAuNjAzOGg4LjM4NzdjMC4zMzQ4MyAwIDAuNjA1ODQtMC4yNjkgMC42MDU4NC0wLjYwMzh2LTEwLjYzNWMtMC45MjEtMC45MTk5LTEuODQxNi0xLjg0MDUtMi43NjE0LTIuNzYxeiIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudDQxNjkpIi8+CjxwYXRoIHN0eWxlPSJjb2xvci1yZW5kZXJpbmc6YXV0bztjb2xvcjojMDAwMDAwO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1yZW5kZXJpbmc6YXV0bztzb2xpZC1jb2xvcjojMDAwMDAwO2ltYWdlLXJlbmRlcmluZzphdXRvIiBkPSJtMTEuNjM5IDIuOTEzMy0yLjc2MTItMi43NjExdjIuMTU3M2MwIDAuMzM0OSAwLjI3MTAxIDAuNjAzOCAwLjYwNTg0IDAuNjAzOGgyLjE1NTJ6IiBmaWxsPSIjOWUxNjE2Ii8+CjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0xLjk1OTMgMTMuNTc5YzAuNzg1NC0wLjM2OSAxLjc1NTQtMS41IDIuOTUyNS0zLjQ0NSAwLjE3NTgtMC4yODUzIDEuMTUyMS0wLjYyNDEgMi45NTM2LTEuMDI0OGwxLjA3NjEtMC4yMzkzIDAuNTc2NyAwLjQyNWMxLjgyNzggMS4zNDcxIDMuOTYzOCAxLjY1MzEgNC4zOTE4IDAuNjI4NCAwLjEyNS0wLjI5OTQgMC4xMjMtMC4zNTU3LTAuMDI2LTAuNjU0Ny0wLjIxMi0wLjQyNy0wLjQ5Ni0wLjYyMDMtMS4xNTYtMC43ODk3LTAuNjI4LTAuMTYwNy0yLjE3Mi0wLjE4MjUtMy4wMzI4LTAuMDQyOGwtMC41ODA5IDAuMDkzOC0wLjM1NTItMC4zNDQyYy0wLjM5LTAuMzc4MS0xLjEzNzQtMS4zNTIyLTEuNTk0OC0yLjA3OWwtMC4yOTI5LTAuNDY1NCAwLjI2NC0wLjk0MDNjMC4zMzE0LTEuMTggMC41MTM2LTIuNDQzNiAwLjQzMTQtMi45OTA0LTAuMTU4NC0xLjA1MjgtMC43OTY3LTEuNjYyNC0xLjUxNTEtMS40NDcyLTAuNDIwOCAwLjEyNjA1LTAuNTgzNSAwLjM0NzIyLTAuNzE4MyAwLjk3NjItMC4xMzU3IDAuNjMyNSAwLjAwNzEgMS42MDc4IDAuNDEyMSAyLjgxODVsMC4zMTcgMC45NDc0LTAuMzI3NCAwLjkxMDJjLTAuNDIxNyAxLjE3MjctMS4xNTEgMi44NzQ4LTEuNTA0NiAzLjUxMTctMC4yNzE3IDAuNDg5My0wLjMwMTYgMC41MTEyLTEuNTEyNSAxLjEwNjYtMS4zNjk0IDAuNjczNDktMi4yNzI0IDEuMzQxNC0yLjU1MDQgMS44ODY0LTAuMjUyMTIgMC40OTQyLTAuMjI3NjkgMC42OTU3NCAwLjEyNzM3IDEuMDUwOCAwLjI3MDEzIDAuMjcwMTMgMC4zNjU1MiAwLjMwODI0IDAuNzcxNTkgMC4zMDgyNCAwLjI4OTU2IDAgMC42MjQ0OS0wLjA3NTU3IDAuODkzLTAuMjAxNTR6bS0xLjQ2MDItMC4zMjdjLTAuNTAzOTMtMC41NTY4MyAwLjMxMzM3LTEuNDIxOCAyLjI3MzMtMi40MDU4IDAuNDYwMjMtMC4yMzEwNiAwLjg1OTA2LTAuNDIwMTMgMC44ODYyNi0wLjQyMDEzIDAuMDg3MjQyIDAtMS4wMDcgMS41NzA2LTEuNDE2MSAyLjAzMjctMC40NDc3OCAwLjUwNTc0LTEuMTA4OCAwLjk1OS0xLjM5ODUgMC45NTktMC4xMDcxNiAwLTAuMjYyMzYtMC4wNzQ1OS0wLjM0NDktMC4xNjU3OXptMTAuODctMy4yOTY4Yy0wLjUzMi0wLjE4ODQtMS4zMzgtMC42Mjk5LTEuNzY4NS0wLjk2OTdsLTAuMjIyMy0wLjE3NTMgMC40NDg5LTAuMDc2NGMwLjI0NzAyLTAuMDQxOTM5IDAuOTE4MjctMC4wNzQ2ODcgMS40OTE3LTAuMDcyNTYxIDAuODA4NTIgMC4wMDI2MyAxLjEwODQgMC4wMzg5MjMgMS4zMzU5IDAuMTYwMyAwLjQ5ODk1IDAuMjY2MjggMC41MTQzMyAwLjk0MjI1IDAuMDI3MTcgMS4xOTQyLTAuMzUzODMgMC4xODI5OC0wLjY2NDg2IDAuMTY4NjMtMS4zMTI1LTAuMDYwNTE1em0tNS43NTgzLTEuMTY4MWMwLjE5NTctMC4zODkyIDAuNTIzNC0xLjE0ODcgMC43MjgzLTEuNjg3OCAwLjIwNDgtMC41MzkxIDAuMzg0Ni0wLjk5MjUgMC4zOTk0LTEuMDA3NnMwLjEyMDkgMC4xMjc3IDAuMjM1NyAwLjMxNzNjMC4zMTIxIDAuNTE1NCAwLjk3MzEgMS4zODQ4IDEuMzY4NSAxLjhsMC4zNSAwLjM2NzUtMC45MzA2IDAuMjEyNWMtMC41MTE5IDAuMTE2OS0xLjI4NTMgMC4zMjM1LTEuNzE4OSAwLjQ1OTFsLTAuNzg4MiAwLjI0NjZ6bTAuMzc1OC00Ljk2ODFjLTAuMzIwOS0wLjk5NjMtMC40MzQ0LTEuOTc4NS0wLjI5ODctMi41ODQ5IDAuMTE2My0wLjUxOTU0IDAuMjczMi0wLjY5MDUzIDAuNjMzOC0wLjY5MDUzIDAuNTE4OTkgMCAwLjYxODA0IDEuMTMyNyAwLjIzNjY2IDIuNzA3LTAuMTI1MSAwLjUxNjQtMC4yNTk2IDAuOTk2NC0wLjI5ODkgMS4wNjY2LTAuMDQ4IDAuMDg1Ni0wLjEzNzctMC4wNzgyLTAuMjcyOS0wLjQ5ODF6IiBjbGlwLXBhdGg9InVybCgjY2xpcFBhdGg0MTg5KSIvPgo8L3N2Zz4K";

  iconButton(d3.select("body"),"svg",svgIcon_b64,"SVG export",svgDownload,{"position":"absolute","top":"20px","right":"36px"});
  iconButton(d3.select("body"),"pdf",pdfIcon_b64,"PDF export",svg2pdf,{"position":"absolute","top":"44px","right":"36px"});
}

function bioinfoLogo(){
  var divLogo = document.createElement("div");
    divLogo.style.position = "fixed";
    divLogo.style.bottom = "10px";
    divLogo.style.right = "10px";
  var aLogo = document.createElement("a");
    aLogo.href = "http://bioinfo.usal.es";
    aLogo.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="50" width="50" version="1.1"><path d="m50 25c0 6.9036 0.09292 25.093 0.09292 25.093s-18.189-0.093-25.093-0.093c-13.807 0-25-11.193-25-25s11.193-25 25-25 25 11.193 25 25z" fill="#fff"/><path style="color-rendering:auto;text-decoration-color:#000000;color:#000000;isolation:auto;mix-blend-mode:normal;shape-rendering:auto;solid-color:#000000;block-progression:tb;text-decoration-line:none;text-decoration-style:solid;image-rendering:auto;white-space:normal;text-indent:0;text-transform:none" d="m34.25 1.9277c-1.984 1.9109-3.601 4.4402-4.445 7.0098-0.477 1.4505-0.705 2.9575-0.535 4.3615-1.273-0.597-2.708-0.893-4.18-0.879-2.689 0.026-5.536 1.008-8.004 2.894-2.468 1.887-4.126 4.35-4.795 6.891-0.354 1.346-0.414 2.73-0.156 4.039-1.153-0.295-2.412-0.37-3.678-0.279-2.7342 0.196-5.6214 1.131-7.9902 2.549l1.334 2.23c0.4973-0.298 1.0319-0.572 1.5898-0.82l7.6294 9.695c-0.344 0.416-0.703 0.814-1.0747 1.172l1.8047 1.871c1.984-1.911 3.601-4.442 4.445-7.012 0.421-1.279 0.659-2.607 0.592-3.865 1.161 0.467 2.439 0.694 3.744 0.682 0.17-0.002 0.342-0.018 0.512-0.028a10.328 10.328 0 0 1 -0.012 -4.933l-5.318-6.756c0.301-0.533 0.662-1.056 1.08-1.561l4.961 6.303a10.328 10.328 0 0 1 1.125 -1.824l-4.658-5.918c0.161-0.137 0.32-0.277 0.492-0.408 0.317-0.243 0.645-0.46 0.975-0.664l4.435 5.636a10.328 10.328 0 0 1 1.617 -1.201l-4.22-5.363c0.623-0.25 1.247-0.44 1.863-0.564l4.027 5.117a10.328 10.328 0 0 1 2.127 -0.551l-3.728-4.738c1.741 0.123 3.187 0.796 4.134 1.976 0.607 0.756 0.957 1.656 1.053 2.647a10.328 10.328 0 0 1 2.625 0.326c-0.022-0.595-0.088-1.185-0.234-1.756 1.277 0.412 2.714 0.52 4.158 0.416 2.734-0.196 5.619-1.129 7.988-2.547l-1.336-2.23c-0.496 0.297-1.029 0.571-1.586 0.818l-7.631-9.6933c0.344-0.4161 0.703-0.8115 1.075-1.1699l-1.805-1.8731zm-0.496 4.7383l6.871 8.73c-0.648 0.197-1.301 0.352-1.945 0.463l-5.866-7.4547c0.271-0.5863 0.584-1.1715 0.94-1.7383zm-1.729 3.988l4.245 5.393c-1.739-0.052-3.097-0.549-3.776-1.395-0.695-0.866-0.861-2.295-0.469-3.998zm-17.193 12.233l5.514 7.006c-1.979-0.014-3.624-0.698-4.666-1.997-1.063-1.323-1.347-3.088-0.848-5.009zm-5.1015 5.654c1.7385 0.052 3.0965 0.549 3.7755 1.395 0.695 0.866 0.861 2.295 0.469 3.998l-4.2445-5.393zm-2.4121 0.188l5.8676 7.457c-0.27 0.585-0.585 1.17-0.94 1.736l-6.871-8.731c0.6472-0.196 1.2999-0.351 1.9434-0.462z"/><path d="m38.287 38.907 1.7197-1.7197 8.0096 7.2603-2.469 2.469z" fill-rule="evenodd" stroke="#000" stroke-width=".47797px"/><circle style="color-rendering:auto;color:#000000;isolation:auto;mix-blend-mode:normal;shape-rendering:auto;solid-color:#000000;image-rendering:auto" cx="-30.93" transform="rotate(-90)" stroke="#000" cy="32.03" r="8.8741" stroke-width="2.4" fill="none"/><path fill="#a00" d="m27.054 29.41h0.99976v-3.2483q0-0.14282 0.01099-0.29663l-0.817 0.718q-0.088 0.074-0.172 0.052-0.08-0.026-0.113-0.073l-0.19409-0.26733 1.4026-1.2415h0.49805v4.3579h0.91553v0.46875h-2.5305v-0.46875z"/><path d="m33.536 27.474q0 0.62988-0.13184 1.095-0.13184 0.46142-0.36255 0.76538-0.23071 0.30029-0.54566 0.45044-0.31128 0.14648-0.67017 0.14648t-0.67017-0.14648q-0.31128-0.15015-0.54199-0.45044-0.22705-0.30396-0.35889-0.76538-0.13184-0.46509-0.13184-1.095 0-0.62988 0.13184-1.0913 0.13184-0.46509 0.35889-0.76904 0.23071-0.30396 0.54199-0.45044 0.31128-0.15015 0.67017-0.15015t0.67017 0.15015q0.31494 0.14648 0.54566 0.45044 0.23071 0.30396 0.36255 0.76904 0.13184 0.46143 0.13184 1.0913zm-0.63721 0q0-0.54932-0.08789-0.91919-0.08789-0.37354-0.23804-0.60059-0.14648-0.22705-0.34058-0.32593-0.19409-0.09888-0.4065-0.09888-0.2124 0-0.40649 0.09888-0.19043 0.09888-0.34058 0.32593-0.14648 0.22705-0.23438 0.60059-0.08789 0.36987-0.08789 0.91919t0.08789 0.92285q0.08789 0.36987 0.23438 0.59692 0.15015 0.22705 0.34058 0.32593 0.19409 0.09521 0.40649 0.09521t0.4065-0.09521q0.19409-0.09888 0.34058-0.32593 0.15015-0.22705 0.23804-0.59692 0.08789-0.37354 0.08789-0.92285z"/><path d="m34.672 29.41h0.99976v-3.2483q0-0.14282 0.01099-0.29663l-0.817 0.718q-0.08789 0.07324-0.17212 0.05127-0.08057-0.02564-0.11352-0.07324l-0.19409-0.26733 1.4026-1.2415h0.49805v4.3579h0.91553v0.46875h-2.5305v-0.46875z"/><path d="m27.054 35.41h0.99976v-3.2483q0-0.14282 0.01099-0.29663l-0.81665 0.71777q-0.08789 0.07324-0.17212 0.05127-0.08057-0.02564-0.11353-0.07324l-0.19409-0.26733 1.4026-1.2415h0.49805v4.3579h0.91553v0.46875h-2.5305v-0.46875z"/><path d="m30.862 35.41h0.99976v-3.2483q0-0.14282 0.01099-0.29663l-0.81665 0.71777q-0.08789 0.07324-0.17212 0.05127-0.08057-0.02564-0.11352-0.07324l-0.19409-0.26733 1.4026-1.2415h0.49805v4.3579h0.91553v0.46875h-2.5305v-0.46875z"/><path fill="#007800" d="m37.344 33.474q0 0.62988-0.13184 1.095-0.13184 0.46143-0.36255 0.76538-0.23071 0.30029-0.54565 0.45044-0.31128 0.14648-0.67017 0.14648t-0.67017-0.14648q-0.31128-0.15015-0.54199-0.45044-0.22705-0.30396-0.35889-0.76538-0.13184-0.46509-0.13184-1.095 0-0.62988 0.13184-1.0913 0.13184-0.46509 0.35889-0.76904 0.23071-0.30396 0.54199-0.45044 0.31128-0.15015 0.67017-0.15015t0.67017 0.15015q0.31494 0.14648 0.54565 0.45044t0.36255 0.76904q0.13184 0.46142 0.13184 1.0913zm-0.63721 0q0-0.54932-0.08789-0.91919-0.08789-0.37354-0.23804-0.60059-0.14648-0.22705-0.34058-0.32593-0.19409-0.09888-0.40649-0.09888t-0.40649 0.09888q-0.19043 0.09888-0.34058 0.32593-0.14648 0.22705-0.23438 0.60059-0.08789 0.36987-0.08789 0.91919t0.08789 0.92285q0.08789 0.36987 0.23438 0.59692 0.15015 0.22705 0.34058 0.32593 0.19409 0.09522 0.40649 0.09522t0.40649-0.09522q0.19409-0.09888 0.34058-0.32593 0.15015-0.22705 0.23804-0.59692 0.08789-0.37354 0.08789-0.92285z"/></svg>';
  divLogo.appendChild(aLogo);
  document.body.appendChild(divLogo);
}

function bioinfoLogo(){}
