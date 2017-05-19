#create an assembly
createAssembly <- function(name, size){
  return(data.frame(chr=name,start=0,end=size))
}

#get an assembly from a FASTA file
getAssemblyFromFasta <- function(fasta){
chr <- character()
sizes <- numeric()
cont <- 0
for(i in seq_along(fasta)){
  con <- file(fasta[i],"r")
  while (length(oneLine <- readLines(con, n = 1, warn = FALSE)) > 0) {
    if(grepl("^>",oneLine)){
      cont <- cont+1
      chr[cont] <- sub(">","",unlist(strsplit(oneLine,"[ \\|]"))[1])
    }else if(is.na(sizes[cont])){
      sizes[cont] <- nchar(oneLine)
    }else{
      sizes[cont] <- sizes[cont]+nchar(oneLine)
    }
  }
  close(con)
}
return(data.frame(chr=chr,start=0,end=sizes))
}

# for create json of chromosomes' cytobands
get.chromosomes <- function(assembly){
  chromosomes <- list()
  chrs <- unique(assembly[,1])
  for(chr in chrs){
    table <- assembly[(assembly[,1]==chr),-1]
    if(!is.data.frame(table))
      table <- data.frame(end = table)
    chromosomes[[chr]] <- table
  }
  return(chromosomes)
}

# segmentation function
segmentation <- function(assembly, track, cell){
  track[,3] <- as.numeric(track[,3])
  track <- track[complete.cases(track[,3]),]

  cells <- ceiling(track[,2]/cell)
  aggdata <- aggregate(track[,3],by=list(track[,1],cells),FUN=mean)

  chr.list <- unique(assembly[,1])
  chr.order <- seq_along(chr.list)
  names(chr.order) <- as.character(chr.list)
  aggdata <- aggdata[order(chr.order[as.character(aggdata[,1])],aggdata[,2]),]

  track <- data.frame(chr = aggdata[,1], start = (aggdata[,2]-1)*cell, end = aggdata[,2]*cell, y = aggdata[,3])

  for(chr in unique(track[,1])){
    max1 <- max(track[track[,1]==chr,3])
    max2 <- max(assembly[assembly[,1]==chr,3])
    if(max1>max2)
      track[(track[,1]==chr)&(track[,3]==max1),3] <- max2
  }

  return(track)
}

#create json for genome map
genomemapJSON <- function(data, assembly){
  json <- list()
  json$chrlist <- unique(assembly[,1])
  json$chromosomes <- get.chromosomes(assembly)
  json$data <- list()
  json$max <- max(assembly[,'end'])
  if(!(length(data)==1 && is.na(data))){
    data[,5] <- as.numeric(data[,5])
    data <- data[complete.cases(data[,5]),]
    if(nrow(data)>2000){
      cell <- ceiling(json$max/300)
      if(cell>1)
        data <- segmentation(assembly,data.frame(chr=data[,1],pos=(data[,2]+data[,3])/2,y=data[,5]),cell)
    }else{
      data <- data[,c(1,2,3,5)]
    }
    for(chr in json$chrlist)
      json$data[[as.vector(chr)]] <- data.matrix(data[(as.vector(data[,1])==as.vector(chr)),2:4])
  }
  return(toJSON(json))
}

#create html wrapper for genome map
genomemap_rjs <- function(assembly, track = NA, plot = TRUE, jupyter = FALSE, dir = "GenomeMap"){
  createHTML(dir, c("d3.min.js","jspdf.min.js","functions.js","genomemap.js"), genomemapJSON(track, assembly), plot, jupyter)
}
