wwwDirectory = function(){
  path <- system.file("www",package="RJSplot")
  return(path)
}

createHTML <- function(dir, dependencies, json, show = TRUE, jupyter = FALSE){
  if(file.exists(dir))
    unlink(dir, recursive = TRUE)
  dir.create(dir)
  www <- wwwDirectory()
  indexhtml <- paste(dir, "index.html", sep = "/")
  html <- scan(file = paste(www, "template.html", sep = "/"), what = character(0), sep = "\n", quiet = TRUE)
  html <- sub("<!--title-->", basename(dir), html)
  dep <- "<!--head-->"
  for(i in seq_along(dependencies)){
    if(grepl(".css$",dependencies[i])){
      dep <- paste(dep, paste0("<link rel=\"stylesheet\" type=\"text/css\" href=\"styles/",dependencies[i],"\"></link>"), sep = "\n")
      dirName <- "styles"
    }else{
      dep <- paste(dep, paste0("<script type=\"text/javascript\" src=\"scripts/",dependencies[i],"\"></script>"), sep = "\n")
      dirName <- "scripts"
    }
    dir.create(paste(dir, dirName, sep = "/"),FALSE)
    file.copy(paste(www, dependencies[i], sep = "/"), paste(dir, dirName, sep = "/"))
  }
  html <- sub("<!--head-->", dep, html)
  if(typeof(json)=="character"){
    if(!grepl("^<",json))
      json <- paste0('<script type="application/json" id="data">',json,'</script>')
    html <- sub("<!--body-->",json,html)
    write(html, indexhtml)
  }
  if(typeof(json)=="closure"){
    con <- file(indexhtml,"w")
    for(line in html){
      if(line=="<!--body-->")
        json(con)
      else
        writeLines(line, con)
    }
    close(con)
  }
  if(identical(jupyter,TRUE) && requireNamespace("IRdisplay")){
    IRdisplay::display_html(paste0('<iframe src="',dir,'/index.html" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" onload="this.style.height=this.contentDocument.body.scrollHeight+\'px\';"></iframe>'))
  }else{
    message(paste0("The graph has been generated in the \"",normalizePath(dir),"\" path."))
    if(identical(show,TRUE))
      browseURL(normalizePath(indexhtml))
  }
}
