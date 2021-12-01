#create json
dendrogramJSON<-function(hc){

  labels<-hc$labels
  height<-signif(hc$height,3)
  merge<-data.frame(hc$merge)

  node <-  character(nrow(merge))
  for (i in (1:nrow(merge))) {
    if (merge[i,1]<0 & merge[i,2]<0) {
      node[i] <- paste0('{\"height\":',height[i],',\"children\":[{\"name\":\"',labels[-merge[i,1]],'\"},{\"name\":\"',labels[-merge[i,2]],'\"}]}')
    }
    else if (merge[i,1]>0 & merge[i,2]<0) {
      node[i] <- paste0('{\"height\":',height[i],',\"children:\"',node[merge[i,1]],',\"name\":\"',labels[-merge[i,2]],'\"}]}')
    }
    else if (merge[i,1]<0 & merge[i,2]>0) {
      node[i] <- paste0('{\"height\":',height[i],',\"children\":[{\"name\":\"',labels[-merge[i,1]],'\"},',node[merge[i,2]],']}')
    }
    else if (merge[i,1]>0 & merge[i,2]>0) {
      node[i] <- paste0('{\"height\":',height[i],',\"children\":[',node[merge[i,1]],',',node[merge[i,2]],']}')
    }
  }

  return(node[nrow(merge)])
}

dendrometaJSON <- function(data, metadata, method, cex){

  if(class(data)!="dist"){
    data <- as.dist(data)
    warning("data: a dissimilarity structure as produced by dist should be passed")
  }

  labels <- attr(data,"Labels")

  if(!is.null(metadata)){
    if(length(setdiff(labels,rownames(metadata)))>0){
      metadata <- NULL
      warning("metadata: rownames differs from data")
    }else{
      if(ncol(metadata)==1)
        colname <- colnames(metadata)
      metadata <- metadata[labels,]
    }
  }

  hc <- hclust(data, method)

  dendrogram <- dendrogramJSON(hc)

  if(!is.null(metadata)){
    if(is.null(dim(metadata))){
      names(metadata) <- labels
      met <- data.frame(x=metadata[c(hc$order)])
      colnames(met) <- colname
    }else{
      met <- metadata[c(hc$order),]
    }
    li <- as.list(met)
    names(li) <- NULL
    metadata <- list(rows=hc$labels[hc$order],cols=colnames(met,FALSE,"phenotype"),data=li,dim=dim(met))
  }

  metadata <- toJSON(metadata)

  if(!is.numeric(cex))
    cex <- 1

  return(paste0("{\"root\":",dendrogram,",\"size\":",attr(data,"Size"),",\"metadata\":",metadata,",\"cex\":",cex,"}"))
}

#create html wrapper for Dendrogram
dendrogram_rjs<-function(data, metadata = NULL, method = "complete", cex = 1, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("d3.min.js", "jspdf.min.js", "functions.js", "dendrogram.js"), dendrometaJSON(data,metadata,method,cex), plot, jupyter)
}
