#create json
plotJSON<-function(x, y, id, xlab, ylab, xlim, ylim, col, pch, abline.x, abline.y, cex){
  data <- list()
  nodes <- data.frame(x= x, y = y)
  if(!(length(id)==1 && is.na(id)))
    nodes[,"id"] <- id
  if(!(length(col)==1 && is.na(col)))
    nodes[,"col"] <- col
  if(!(length(pch)==1 && is.na(pch)))
    nodes[,"pch"] <- pch
  data$nodes <- nodes
  data$labels <- list(x = xlab, y = ylab)
  if(!(length(abline.x)==1 && is.na(abline.x)))
    data$axis$x <- abline.x
  if(!(length(abline.y)==1 && is.na(abline.y)))
    data$axis$y <- abline.y
  if(!(length(xlim)==1 && is.na(xlim))){
    if(length(xlim)==1)
      xlim <- c(0, xlim)
    data$scales$x <- xlim
    }
  if(!(length(ylim)==1 && is.na(ylim))){
    if(length(ylim)==1)
      ylim <- c(0, ylim)
    data$scales$y <- ylim  
  }
  if(!is.numeric(cex))
    cex <- 1
  data$cex <- cex
  return(toJSON(data))
}


#create html wrapper for scatter plot
scatterplot_rjs<-function(x, y, id = NA, xlab = "", ylab = "", xlim = NA, ylim = NA, col = NA, pch = NA, abline.x = NA, abline.y = NA, cex = 1, plot = TRUE, jupyter = FALSE, dir = "ScatterPlot"){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","plot.js"), plotJSON(x, y, id, xlab, ylab, xlim, ylim, col, pch, abline.x, abline.y, cex), plot, jupyter)
}
