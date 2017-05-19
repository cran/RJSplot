#create json
piechartJSON<-function(data){

if(is.null(names(data)))
  names(data) <- paste0("Pie",seq_along(data))

json <- as.list(as.data.frame(data))

json <- list(data = json)

if(!is.null(rownames(data)))
  json$legend <- rownames(data)

return(toJSON(json))
}


#create html wrapper for barplot
piechart_rjs<-function(data, plot = TRUE, jupyter = FALSE, dir = "Piechart"){
createHTML(dir, c("d3.min.js","functions.js","pie.js"), piechartJSON(data), plot, jupyter)
}
