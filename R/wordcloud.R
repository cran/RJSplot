#create json
wordcloudJSON<-function(data){
json <- data.frame(text = data[,1], count = data[,2])
return(toJSON(json))
}

#create html wrapper for boxplot
wordcloud_rjs<-function(data, plot = TRUE, jupyter = FALSE, dir = "WordCloud"){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","cloud.min.js","wordcloud.js"), wordcloudJSON(data), plot, jupyter)
}
