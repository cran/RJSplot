#create json
barplotJSON<-function(height, xlab, ylab, ylim, cex){

height <- data.matrix(height)

rnames <- rownames(height)
if(is.null(rnames))
  rnames <- paste0("Bar",seq_len(nrow(height)))

cnames <- colnames(height)
if(is.null(cnames))
  cnames <- paste0("Bar",seq_len(ncol(height)))

labels <- list(x = xlab, y = ylab)

if(!is.numeric(cex))
  cex <- 1

json <- list(data = height, rows = rnames, cols = cnames, labels = labels, cex = cex)

if(!is.null(ylim)){
  if(length(ylim)==1)
    ylim <- c(0, ylim)
  json$scale <- ylim
}

return(toJSON(json))
}


#create html wrapper for barplot
barplot_rjs<-function(height, xlab = "", ylab = "", ylim = NULL, cex = 1, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","barplot.js"), barplotJSON(height, xlab, ylab, ylim, cex), plot, jupyter)
}
