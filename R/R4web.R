R4webDirectory = function(){
  path <- system.file("R4web",package="RJSplot")
  return(path)
}

R4web <- function(...,fnfile,dir){
  data <- list(...)
  if(file.exists(dir))
    unlink(dir, recursive = TRUE)
  dir.create(dir)
  dir.create(paste(dir,"tasks",sep="/"))
  www <- R4webDirectory()
  for(i in c("images","styles","header.php","index.php","form.php","result.php","upload.php"))
    file.copy(paste(www, i, sep = "/"),dir,recursive=TRUE)
  file.copy(fnfile,paste(dir,"script.R",sep="/"))
  command <- c("args <- commandArgs(TRUE)","eval(parse(text=args))")
  form <- "<?php $form = array("
  for(i in seq_along(data)){
    n <- data[[i]][[1]]
    if(is.null(data[[i]][[4]])){
      form <- paste0(form,'"',n,'" => array("',data[[i]][[2]],'","',data[[i]][[3]],'"),')
      if(data[[i]][2] %in% c("matrix","data.frame"))
        command <- c(command,paste0(n," <- read.delim(",n,")"))
        if(data[[i]][2] == "matrix")
          command <- c(command,paste0(n," <- as.matrix(",n,")"))
    }else{
      if(data[[i]][[5]])
        form <- paste0(form,'"',n,'" => array("multi",array("',paste0(data[[i]][[3]],collapse='","'),'"),array("',paste0(data[[i]][[4]],collapse='","'),'")),')
      else
        form <- paste0(form,'"',n,'" => array("simple","',data[[i]][[3]],'",array("',paste0(data[[i]][[4]],collapse='","'),'")),')
      command <- c(command,paste0(n,' <- factor(',n,',c("',paste0(data[[i]][[4]],collapse='","'),'"))'))
    }
  }
  form <- paste0(form,"); ?>")
  write(form, paste(dir, "formdata.php", sep = "/"))
  command <- c(command,"source('script.R')")
  write(command,paste(dir, "command.R", sep = "/"),sep="\n")
  message(paste0("The page has been generated in the ",dir," folder."))
}

newInput <- function(name,type=c("character","numeric","matrix","data.frame","factor"),default="",levels=NULL,multi=FALSE){
  if(length(type)>1)
    type <- "character"
  if(type=="factor" && is.null(levels)){
    type <- "character"
    warning("forgot factor's levels so type have been changed to character")
  }
  if(type!="factor" && !is.null(levels)){
    levels <- NULL
    warning("levels are for 'factor' type so they have been removed")
  }
  if(!multi && length(default)>1){
    default <- default[1]
    warning("multi is FALSE and default has length > 1, only the first element will be used")
  }
  structure(list(name,type,default,levels,multi), class = "newInput")
}
