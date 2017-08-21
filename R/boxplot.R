#create json
boxplotJSON<-function(data, xlab, ylab, ylim, cex){

data <- data.matrix(data)
data[is.infinite(data)] <- NA

if(length(ylim) %in% c(1,2) && all(!is.na(ylim))){
  if(length(ylim)==1)
    ylim <- c(0, ylim)
  if(length(ylim)==2)
    scale <- ylim
}else{
  scale <- c(min(data,na.rm=TRUE),max(data,na.rm=TRUE))
}

data <- boxplot(data,plot=FALSE)

data <- list(names=data$names, n=data$n, stats=t(data$stats), out=data$out, group=(data$group-1))

labels <- list(x = xlab, y = ylab)

if(!is.numeric(cex))
  cex <- 1

json <- list(data = data, labels = labels, scale = scale, cex = cex)

return(toJSON(json))
}


#create html wrapper for boxplot
boxplot_rjs<-function(data, xlab = "", ylab = "", ylim = NA, cex = 1, plot = TRUE, jupyter = FALSE, dir = "Boxplot"){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","boxplot.js"), boxplotJSON(data, xlab, ylab, ylim, cex), plot, jupyter)
}
