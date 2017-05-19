#create json
densityJSON<-function(data, xlab, ylab){

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
  json[[names[i]]] <- data.frame(x = aux$x, y = aux$y)
}

labels <- list(x = xlab, y = ylab)

json <- list(data = json, labels = labels)

return(toJSON(json))
}


#create html wrapper for boxplot
densityplot_rjs<-function(data, xlab = "", ylab = "", plot = TRUE, jupyter = FALSE, dir = "DensityPlot"){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","density.js"), densityJSON(data, xlab, ylab), plot, jupyter)
}
