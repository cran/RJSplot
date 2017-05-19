surface3dJSON <- function(x,color,xlab,ylab,zlab){
  if(!is.matrix(x) || !is.numeric(x)){
    x <- data.matrix(x)
    warning("x: a numeric matrix should be passed")
  }
  json <- list(row=nrow(x),col=ncol(x),matrix=as.vector(x),extent=c(min(x),max(x)),color=color,xlab=xlab,ylab=ylab,zlab=zlab)
  return(toJSON(json))
}

surface3d_rjs <- function(x, color = "#fff", xlab = "x", ylab = "y", zlab = "z", plot = TRUE, jupyter = FALSE, dir = "Surface3d"){
  createHTML(dir, c("three.min.js","OrbitControls.js","functions.js","surface3d.js"), surface3dJSON(x,color,xlab,ylab,zlab), plot, jupyter)
}

scatter3dJSON <- function(x,y,z,color,xlab,ylab,zlab){
  points <- length(x)
  if(!(points==length(y) && points==length(z)))
    stop("vectors must have the same length")
  if(length(color)!=1 && length(color)!=points){
    color <- "#000"
    warning("invalid color vector length")
  }
  json <- list(x=x,y=y,z=z,color=color,len=points,a=c(min(x),max(x)),b=c(min(y),max(y)),c=c(min(z),max(z)),xlab=xlab,ylab=ylab,zlab=zlab)
  return(toJSON(json))
}

scatter3d_rjs <- function(x, y, z, color = "#000", xlab = "x", ylab = "y", zlab = "z", plot = TRUE, jupyter = FALSE, dir = "Scatter3d"){
  createHTML(dir, c("three.min.js","OrbitControls.js","functions.js","scatter3d.js"), scatter3dJSON(x,y,z,color,xlab,ylab,zlab), plot, jupyter)
}
