#create json
manhattanJSON<-function(data, assembly, axisv, distv, cell, outliers, ylab, yscale, cex, dir){
if(!identical(setdiff(unique(data[,2]),unique(assembly[,1])),character(0)))
  warning("Different names of chromosomes between the assembly and the input data")

if(!is.numeric(data[,4]))
  warning("Score column must be numeric")

if(length(yscale)==2 && is.numeric(yscale)){
  yscale <- c(min(yscale),max(yscale))
  data <- data[(data[,4]>=yscale[1]) & (data[,4]<=yscale[2]),]
}else{
  yscale <- c(min(data[,4]),max(data[,4]))
}

if(cell>1){
  if(outliers){
    uplevel <- (axisv+distv)
    lowlevel <- (axisv-distv)
    outliers <- data[(data[,4]>uplevel) | (data[,4]<lowlevel),]
    normalvalues <- data #data[(data[,4]<=uplevel) & (data[,4]>=lowlevel),]
    nodes <- data.frame(chr = outliers[,2], pos = outliers[,3], y = outliers[,4], name = outliers[,1])
  }else{
    nodes <- FALSE
  }

  track <- data.frame(chr=data[,2],pos=data[,3],score=data[,4])
  histogram <- segmentation(assembly,track,cell)

  write.table(histogram, paste(dir, "segments.tsv", sep = "/"), sep = "\t", quote = FALSE, row.names = FALSE, col.names = c("chr","start","end",ylab))
}else{
  nodes <- data.frame(chr = data[,2], pos = data[,3], y = data[,4], name = data[,1])
  histogram <- FALSE
}

if(!is.numeric(cex))
  cex <- 1

if(!identical(nodes,FALSE)){
  nodes <- as.list(nodes)
  names(nodes) <- NULL
}
if(!identical(histogram,FALSE)){
  histogram <- as.list(histogram)
  names(histogram) <- NULL
}
assembly <- as.list(assembly)
names(assembly) <- NULL

return(toJSON(list(nodes = nodes, histogram = histogram, assembly = assembly, yscale = yscale, axis = c(axisv,distv), yLab = ylab, cex = cex)))
}

#create html wrapper for manhattan plot
manhattan_rjs<-function(data, assembly = GRCh38, axisv = 0, distv = 1, cell = 1e+06, outliers = TRUE, ylab = "score", yscale = NULL, cex = 1, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","manhattan.js"), manhattanJSON(data, assembly, axisv, distv, cell, outliers, ylab, yscale, cex, dir), plot, jupyter)
}
