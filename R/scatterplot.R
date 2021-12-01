#create json
plotJSON<-function(x, y, id, xlab, ylab, xlim, ylim, col, pch, abline.x, abline.y, cex){
  data <- list()
  colNodes <- c("x","y")
  nodes <- data.frame(x = x, y = y)
  if(!is.null(id)){
    colNodes <- c(colNodes,"id")
    nodes[,"id"] <- id
  }
  if(!is.null(col)){
    colNodes <- c(colNodes,"col")
    nodes[,"col"] <- col
  }
  if(!is.null(pch)){
    colNodes <- c(colNodes,"pch")
    nodes[,"pch"] <- pch
  }
  data$colNodes <- colNodes
  data$nodes <- as.list(nodes)
  names(data$nodes) <- NULL

  data$labels <- list(x = xlab, y = ylab)
  if(!is.null(abline.x))
    data$axis$x <- abline.x
  if(!is.null(abline.y))
    data$axis$y <- abline.y
  if(!is.null(xlim)){
    if(length(xlim)==1)
      xlim <- c(0, xlim)
    data$scales$x <- xlim
    }
  if(!is.null(ylim)){
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
scatterplot_rjs<-function(x, y, id = NULL, xlab = "", ylab = "", xlim = NULL, ylim = NULL, col = NULL, pch = NULL, abline.x = NULL, abline.y = NULL, cex = 1, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","plot.js"), plotJSON(x, y, id, xlab, ylab, xlim, ylim, col, pch, abline.x, abline.y, cex), plot, jupyter)
}
