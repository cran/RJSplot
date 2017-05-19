report_rjs <- function(dir = "RJSreport"){
createHTML(dir,NULL,"<!--body-->",FALSE)
structure(list(dir = dir, call = match.call()), class = "RJSreport")
}

addCSS2report <- function(report,css){
  css <- scan(css, what = character(), sep = "\n", quiet = TRUE)
  css <- paste("<style type=\"text/css\">",paste0(css,collapse="\n"),"</style>","<!--head-->",sep="\n")
  widgetReport(report,function(html){
    html <- sub("<!--head-->",css, html)
    return(html)
  })
}

addHTML2report <- function(report,HTML){
widgetReport(report,function(html){
  html <- sub("<!--body-->",paste(HTML,"<!--body-->",sep="\n"), html)
  return(html)
})
}

addParagraph2report <- function(report,p){
widgetReport(report,function(html){
  p <- paste0("<p>",p,"</p>")
  html <- sub("<!--body-->",paste(p,"<!--body-->",sep="\n"), html)
  return(html)
})
}

addPlot2report <- function(report,plot,height=600){
  html <- scan(file = paste(plot,"index.html",sep="/"), what = character(0), sep = "\n", quiet = TRUE)

  embedFiles <- function(type){
    if(dir.exists(paste(plot,type,sep="/"))){
      for(i in dir(paste(plot,type,sep="/"))){
        text <- scan(file = paste(plot,type,i,sep="/"), what = character(0), sep = "\n", quiet = TRUE)
        text <- paste0(text,collapse="\n")
        if(type=="styles")
          text <- paste('<style type="text/css">',text,'</style>',sep="\n")
        else
          text <- paste('<script type="text/javascript">',text,'</script>',sep="\n")
        line <- grep(paste(type,i,sep="/"),html,fixed=TRUE)
        html[line] <<- text
      }
    }
  }

  embedFiles("styles")
  embedFiles("scripts")
  tmp <- tempfile()
  write(html,tmp)
  plot <- paste0("<iframe src=\"data:text/html;base64,",base64encode(tmp),"\" width=\"100%\" height=\"",height,"\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" onload=\"this.style.height=this.contentDocument.body.scrollHeight+'px';\"></iframe>")
  widgetReport(report,function(html){
    html <- sub("<!--body-->",paste(plot,"<!--body-->",sep="\n"), html)
    return(html)
  })
}

addImage2report <- function(report,img){
  mime <- c("image/jpeg","image/jpeg","image/png","image/svg","image/gif")
  names(mime) <- c("jpeg","jpg","png","svg","gif")
  imgname <- sub("^.*/","",img)
  extension <- sub("^.*\\.","",imgname)
  img <- paste0("<img alt=\"",imgname,"\" src=\"data:",mime[extension],";base64,",base64encode(img),"\"></img>")
  widgetReport(report,function(html){
    html <- sub("<!--body-->",paste(img,"<!--body-->",sep="\n"), html)
    return(html)
  })
}

widgetReport <- function(report,fn){
if(class(report)=="RJSreport"){
  dir <- paste(report$dir,"index.html",sep="/")
  html <- scan(file = dir, what = character(0), sep = "\n", quiet = TRUE)
  html <- fn(html)
  write(html, dir)
}else
  warning("you must pass a RJSreport object")
}
