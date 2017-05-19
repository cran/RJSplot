#create json
bubbleJSON<-function(data,size){

data <- data.matrix(data)

names <- rownames(data)
if(is.null(names))
  names <- paste0("Bubble",seq_len(nrow(data)))

nodes <- data.frame(name = names, a = data[,1], b = data[,2])

if(!is.null(size)){
  if(!is.numeric(size))
    warning("size: must be a numeric vector")
  else{
    if(length(size)!=nrow(nodes))
      warning("size: you must pass a value per node")
    else
      nodes$size <- size
  }
}

json <- list(nodes = nodes)

names <- colnames(data)
if(!is.null(names))
  json$names <- names[1:2]

return(toJSON(json))
}


#create html wrapper for barplot
bubbles_rjs<-function(data, size = NULL, plot = TRUE, jupyter = FALSE, dir = "BubblePlot"){
  if(min(data[,1:2])<0)
    warning("You only must pass absolute values")
  else
    createHTML(dir, c("d3.min.js","functions.js","bubbles.js"), bubbleJSON(data,size), plot, jupyter)
}
