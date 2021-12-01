#create json
piechartJSON<-function(data, cex){

if(is.null(names(data)))
  names(data) <- paste0("Pie",seq_along(data))

json <- as.list(as.data.frame(data))

if(!is.numeric(cex))
  cex <- 1

json <- list(data = json, cex = cex)

if(!is.null(rownames(data)))
  json$legend <- rownames(data)

return(toJSON(json))
}


#create html wrapper for barplot
piechart_rjs<-function(data, cex = 1, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("d3.min.js","functions.js","pie.js"), piechartJSON(data, cex), plot, jupyter)
}
