#create json
barplotJSON<-function(height, xlab, ylab, ylim){

height <- data.matrix(height)

rnames <- rownames(height)
if(is.null(rnames))
  rnames <- paste0("Bar",seq_len(nrow(height)))

cnames <- colnames(height)
if(is.null(cnames))
  cnames <- paste0("Bar",seq_len(ncol(height)))

labels <- list(x = xlab, y = ylab)

json <- list(data = height, rows = rnames, cols = cnames, labels = labels)

if(!(length(ylim)==1 && is.na(ylim))){
  if(length(ylim)==1)
    ylim <- c(0, ylim)
  json$scale <- ylim
}

return(toJSON(json))
}


#create html wrapper for barplot
barplot_rjs<-function(height, xlab = "", ylab = "", ylim = NA, plot = TRUE, jupyter = FALSE, dir = "Barplot"){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","barplot.js"), barplotJSON(height, xlab, ylab, ylim), plot, jupyter)
}
