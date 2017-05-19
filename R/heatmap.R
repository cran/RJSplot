heatmapJSON <- function(x, meta, scale, cluster, color){
if(!is.matrix(x) || !is.numeric(x)){
  x <- data.matrix(x)
  warning("data: a numeric matrix should be passed") 
}

if(!is.null(meta)){
  if(nrow(meta)!=ncol(x)){
    meta <- NULL
    warning("metadata: must have the same rows as data columns")
  }
}

rownames(x) <- rownames(x,FALSE)
colnames(x) <- colnames(x,FALSE,"sample")

if(cluster){
  hcRows <- hclust(dist(x))
  rowsJSON <- dendrogramJSON(hcRows)

  hcCols <- hclust(dist(t(x)))
  colsJSON <- dendrogramJSON(hcCols)

  x <- x[c(hcRows$order),c(hcCols$order)]
}else{
  rowsJSON <- toJSON(FALSE)
  colsJSON <- toJSON(FALSE)
}

mat <- list(rows=rownames(x),cols=colnames(x),data=as.vector(x),dim=dim(x))

if(length(scale)==1){
  if(scale == "row")
    mat$scaled <- as.vector(t(scale(t(x),TRUE,TRUE)))
  if(scale == "column")
    mat$scaled <- as.vector(scale(x,TRUE,TRUE))
}

mat <- toJSON(mat)

if(!is.null(meta)){
  if(cluster){
    if(ncol(meta)==1){
      colname <- colnames(meta)
      meta <- data.frame(x=meta[c(hcCols$order),])
      colnames(meta) <- colname
    }else{
      meta <- meta[c(hcCols$order),]
    }
  }
  li <- as.list(meta)
  names(li) <- NULL
  meta <- list(rows=colnames(meta,FALSE,"phenotype"),cols=colnames(x),data=li,dim=rev(dim(meta)))
}else{
  meta <- FALSE
}
meta <- toJSON(meta)

if(length(color)!=1 || !(color %in% c("Reds","Greens","Blues","RdBkGr","RdWhBu")))
  color <- "Blues"

return(paste0("{\"rows\":",rowsJSON,",\"cols\":",colsJSON,",\"matrix\":",mat,",\"metadata\":",meta,",\"color\":\"",color,"\"}"))
}

heatmap_rjs<-function(data, metadata = NULL, scale = c("row", "column", "none"), cluster = TRUE, color=c("Reds","Greens","Blues","RdBkGr","RdWhBu"), plot = TRUE, jupyter = FALSE, dir = "Heatmap"){
createHTML(dir, c("d3.min.js", "jspdf.min.js", "functions.js", "heatmap.js"), heatmapJSON(data, metadata, scale, cluster, color), plot, jupyter)
}
