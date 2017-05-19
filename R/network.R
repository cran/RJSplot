#create json
networkJSON<-function(links, nodes, group = NULL, size = NULL, color = NULL, label = NULL, weight = NULL){

if(ncol(links)<2)
  warning("links: must be a data frame with at least two columns")

name <- unique(c(as.vector(links[,1]),as.vector(links[,2])))

attrNames <- list()
for(i in c("group","size","color","label","weight")){
  attrName <- eval(parse(text=i))
  if(!is.null(attrName))
    attrNames[[i]] <- attrName
}

newNodes <- data.frame(name = name)
if(!(length(nodes)==1 && is.na(nodes))){
  for(i in colnames(nodes)){
      newNodes[[i]] <- nodes[name,i]
  }
}

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

json <- list(nodes = newNodes, links = newLinks)

if(length(attrNames)>0) json$attr <- attrNames

return(toJSON(json))
}

#create html wrapper for force network graph
network_rjs<-function(links, nodes = NA, weight = NULL, group = NULL, size = NULL, color = NULL, label = NULL, plot = TRUE, jupyter = FALSE, dir = "Network"){
createHTML(dir, c("datatables.min.css","jquery.min.js","datatables.min.js","d3.min.js","jspdf.min.js","functions.js","network.js"), networkJSON(links, nodes, group, size, color, label, weight), plot, jupyter)
}

#create html wrapper for symetric heatmap
symheatmap_rjs<-function(links, nodes = NA, group = NULL, label = NULL, plot = TRUE, jupyter = FALSE, dir = "SymHeatmap"){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","symheatmap.js"), networkJSON(links, nodes, group, label = label), plot, jupyter)
}

#create html wrapper for hiveplot
hiveplot_rjs<-function(links, nodes = NA, group = NULL, size = NULL, color = NULL, plot = TRUE, jupyter = FALSE, dir = "HivePlot"){
createHTML(dir, c("d3.min.js","functions.js","hive.js"), networkJSON(links, nodes, group, size, color), plot, jupyter)
}
