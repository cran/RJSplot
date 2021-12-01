#create html wrapper for data table
tables_rjs<-function(data, plot = TRUE, jupyter = FALSE, dir = tempdir()){

tablesHTML<-function(con){
  if(is.data.frame(data) || is.matrix(data)){
    writeLines("<table class=\"display\" cellspacing=\"0\" width=\"100%\">", con)
    data <- cbind(row=rownames(data,FALSE),data)
    str <- ""
    for(i in colnames(data,FALSE))
      str <- paste0(str,"<th>",i,"</th>")
    writeLines(c("<thead>",paste0("<tr>",str,"</tr>"),"</thead>","<tbody>"), con)
    for(i in seq_len(nrow(data))){
      str <- ""
      for(j in data[i,]){
        td <- "<td>"
        if(is.numeric(j))
          td <- "<td class=\"dt-body-right\">"
        str <- paste0(str,td,j,"</td>")
      }
      str <- paste0("<tr>",str,"</tr>")
      writeLines(str,con)
    }
    writeLines(c("</tbody>","</table>"),con)
  }else
    warning("data: you must pass a data frame or matrix")
}

  createHTML(dir, c("datatables.min.css","jquery.min.js","datatables.min.js","functions.js","datatables.start.js"), tablesHTML, plot, jupyter)
}
