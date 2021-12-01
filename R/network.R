#create json
networkJSON<-function(links, nodes, group = NULL, size = NULL, color = NULL, label = NULL, weight = NULL, linkLabel = NULL, linkColor = NULL, nodeColorScale = NULL, cex = 1){

if(ncol(links)<2)
  warning("links: must be a data frame with at least two columns")

name <- unique(c(as.vector(links[,1]),as.vector(links[,2])))

attrNames <- list()
for(i in c("weight","linkLabel","linkColor")){
  attrName <- eval(parse(text=i))
  if(!is.null(attrName) && length(attrName)==1){
    if(is.character(attrName) && (attrName %in% colnames(links)))
      attrNames[[i]] <- attrName
    if((is.integer(attrName) || is.double(attrName)) && (attrName <= ncol(links)))
      attrNames[[i]] <- colnames(links)[attrName]
  }
}

newNodes <- data.frame(name = name)
if(!is.null(nodes)){

  for(i in c("group","size","color","label")){
    attrName <- eval(parse(text=i))
    if(!is.null(attrName) && length(attrName)==1){
      if(is.character(attrName) && (attrName %in% colnames(nodes)))
        attrNames[[i]] <- attrName
      if((is.integer(attrName) || is.double(attrName)) && (attrName <= ncol(nodes)))
        attrNames[[i]] <- colnames(nodes)[attrName]
    }
  }

  for(i in colnames(nodes)){
      newNodes[[i]] <- nodes[name,i]
  }
}

if(!is.null(color) && is.null(attrNames[["color"]]))
  newNodes[["_color"]] <- color

linkslength <- nrow(links)
source <- numeric(linkslength)
target <- numeric(linkslength)
for(i in 1:linkslength){
  source[i] <- which(name == as.vector(links[i,1]))-1
  target[i] <- which(name == as.vector(links[i,2]))-1
}

newLinks <- data.frame(source,target)
if(ncol(links)>2){
  for(i in colnames(links)[3:ncol(links)])
    newLinks[[i]] <- links[,i]
  if(is.null(weight) && is.numeric(links[,3]))
    attrNames[["weight"]] <- colnames(links)[3]
}

if(!is.null(linkColor) && is.null(attrNames[["linkColor"]]))
  newLinks[["_color"]] <- linkColor

if(!is.numeric(cex))
  cex <- 1

json <- list(nodes = newNodes, links = newLinks, options = list(cex = cex))

if(length(attrNames)>0) json$attr <- attrNames

if(!is.null(nodeColorScale) && nodeColorScale[1] %in% c("RdBk","RdBkGr")){
  json$options$nodeColorScale <- nodeColorScale[1]
}

return(toJSON(json))
}

#create html wrapper for force network graph
network_rjs<-function(links, nodes = NULL, weight = NULL, linkLabel = NULL, linkColor = NULL, group = NULL, size = NULL, color = NULL, label = NULL, nodeColorScale = c("RdBk","RdBkGr"), cex = 1, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("datatables.min.css","jquery.min.js","datatables.min.js","d3.min.js","jspdf.min.js","functions.js","network.js"), networkJSON(links, nodes, group, size, color, label, weight, linkLabel, linkColor, nodeColorScale, cex), plot, jupyter)
}

#create html wrapper for symetric heatmap
symheatmap_rjs<-function(links, nodes = NULL, group = NULL, label = NULL, cex = 1, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","symheatmap.js"), networkJSON(links, nodes, group, label = label, cex = cex), plot, jupyter)
}

#create html wrapper for hiveplot
hiveplot_rjs<-function(links, nodes = NULL, group = NULL, size = NULL, color = NULL, cex = 1, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("d3.min.js","functions.js","hive.js"), networkJSON(links, nodes, group, size, color, cex = cex), plot, jupyter)
}
