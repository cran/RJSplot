#create json
densityJSON<-function(data, xlab, ylab, cex){

if(is.matrix(data))
  data <- as.data.frame(data)

names <- names(data)
if(is.null(names))
  names <- paste0("V",seq_along(data))

json <- list()
for(i in seq_along(data)){
  aux <- data[[i]]
  aux <- aux[!is.na(aux)]
  aux <- density(aux)
  json[[names[i]]] <- signif(cbind(aux$x,aux$y),6)
}

labels <- list(x = xlab, y = ylab)

if(!is.numeric(cex))
  cex <- 1

json <- list(data = json, labels = labels, cex = cex)

return(toJSON(json))
}


#create html wrapper for boxplot
densityplot_rjs<-function(data, xlab = "", ylab = "", cex = 1, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","density.js"), densityJSON(data, xlab, ylab, cex), plot, jupyter)
}
