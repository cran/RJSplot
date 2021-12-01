#create json
circularfvJSON <- function(sequence, features){

json <- list(sequence = sequence, features = features)

return(toJSON(json))
}


#create html wrapper for biojs-vis-circularfv
circularfv_rjs <- function(sequence, features = FALSE, plot = TRUE, jupyter = FALSE, dir = tempdir()){
createHTML(dir, c("d3.min.js","circularfv.min.js","functions.js","circularfv.js"), circularfvJSON(sequence, features), plot, jupyter)
}
