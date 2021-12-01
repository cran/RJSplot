\name{circularfv_rjs}
\alias{circularfv_rjs}
\title{Pruduce a circular sequence viewer.}
\author{
David Barrios and Carlos Prieto. Bioinformatics Service of Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\value{
The function creates a folder in your computer with an HTML document named index.html which contains the graph. This file can be directly opened with your browser.
}
\seealso{
  The \sQuote{RJSplot} Website: \url{https://rjsplot.usal.es}

  \code{\link{dendrogram_rjs}}, \code{\link{densityplot_rjs}}, \code{\link{genomemap_rjs}}, \code{\link{heatmap_rjs}}, \code{\link{manhattan_rjs}}, \code{\link{network_rjs}}, \code{\link{scatterplot_rjs}}, \code{\link{symheatmap_rjs}}, \code{\link{wordcloud_rjs}}, \code{\link{boxplot_rjs}}, \code{\link{bubbles_rjs}}, \code{\link{hiveplot_rjs}}, \code{\link{piechart_rjs}}, \code{\link{barplot_rjs}}, \code{\link{tables_rjs}}, \code{\link{surface3d_rjs}}, \code{\link{scatter3d_rjs}}.
}

\usage{
circularfv_rjs(sequence, features = FALSE,
               plot = TRUE, jupyter = FALSE, dir = tempdir())
}
\arguments{
\item{sequence}{a "character" string giving the DNA sequence.}
\item{features}{Data Frame with the segments that will be seen in the viewer. It cotains 5 columns which describes the identifier, start coordinate, stop coordinate, segment type and segment color.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{circularfv_rjs} creates  a circular sequence viewer.
}
\examples{
if(interactive()){
## Creates a circular sequence viewer in a temporal directory of your local machine
## Generate test input data
sequence <- paste(sample(c("c","a","t","g"), 10000, replace = TRUE), collapse = "")
data <- matrix(round(runif(12,0,10000)),6,2)
features <- data.frame(id = 0:5, start = data[,1], stop = data[,2],
type = c("voluptate","non","voluptate","sit","et","proident"),
color = c("SandyBrown","Tan","Wheat","SteelBlue","LightSkyBlue","LightBlue"))

## Create the circular sequence viewver
circularfv_rjs(sequence, features)
}
}
