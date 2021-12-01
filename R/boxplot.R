#create json
boxplotJSON<-function(data, xlab, ylab, outline, col, ylim, cex){

data <- data.matrix(data)
data[is.infinite(data)] <- NA

if(!is.null(ylim) && length(ylim) %in% c(1,2)){
  if(length(ylim)==1)
    ylim <- c(0, ylim)
  if(length(ylim)==2)
    scale <- ylim
}else{
  scale <- c(min(data,na.rm=TRUE),max(data,na.rm=TRUE))
}

data <- boxplot(data,plot=FALSE)

if(!outline){
  data$out <- numeric(0)
  data$group <- numeric(0)
  scale <- c(min(data$stats),max(data$stats))
}

data <- list(names=data$names, n=data$n, stats=t(signif(data$stats,3)), out=data$out, group=(data$group-1))

if(!is.null(col))
  data$color <- col

labels <- list(x = xlab, y = ylab)

if(!is.numeric(cex))
  cex <- 1

json <- list(data = data, labels = labels, scale = scale, cex = cex)

return(toJSON(json))
}


#create html wrapper for boxplot
boxplot_rjs<-function(data, xlab = "", ylab = "", outline = TRUE, col = NULL, ylim = NULL, cex = 1, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","boxplot.js"), boxplotJSON(data, xlab, ylab, outline, col, ylim, cex), plot, jupyter)
}
