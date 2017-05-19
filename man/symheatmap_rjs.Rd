\name{symheatmap_rjs}
\alias{symheatmap_rjs}
\title{Creates a Symetric Heatmap representation.}
\author{
David Barrios and Carlos Prieto. Bioinformatics Service of Nucleus, University of Salamanca. See \url{http://bioinfo.usal.es/}
}
\value{
The function creates a folder in your computer with an HTML document named index.html which contains the graph. This file can be directly opened with your browser.
}
\seealso{
  The \sQuote{RJSplot} Website: \url{http://rjsplot.net}

  \code{\link{dendrogram_rjs}}, \code{\link{densityplot_rjs}}, \code{\link{genomemap_rjs}}, \code{\link{heatmap_rjs}}, \code{\link{manhattan_rjs}}, \code{\link{network_rjs}}, \code{\link{scatterplot_rjs}}, \code{\link{symheatmap_rjs}}, \code{\link{wordcloud_rjs}}, \code{\link{boxplot_rjs}}, \code{\link{bubbles_rjs}}, \code{\link{hiveplot_rjs}}, \code{\link{piechart_rjs}}, \code{\link{barplot_rjs}}, \code{\link{tables_rjs}}, \code{\link{surface3d_rjs}}, \code{\link{scatter3d_rjs}}.
}
\usage{
symheatmap_rjs(links, nodes = NA, group = NULL, label = NULL,
               plot = TRUE, jupyter = FALSE, dir = "SymHeatmap")
}
\arguments{
\item{links}{an edge list table stored in a data frame with three possible columns (source node id, target node id and a link value).}
\item{nodes}{a node list stored in a data frame object with rownames as node id.}
\item{group}{a vector giving the column of \code{nodes} to show as group.}
\item{label}{a vector giving the column of \code{nodes} to show as label.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{symheatmap_rjs} creates an interactive symetric heatmap.
}
\examples{
## Create an interactive symetric heatmap in the folder "SymHeatmap" of your local machine
## Live examples on http://rjsplot.net
# prepare data
x <- 1-cor(t(mtcars))

source <- rep(rownames(x),nrow(x))
target <- rep(rownames(x),rep(ncol(x),nrow(x)))
links <- data.frame(source=source,target=target,value=as.vector(x))

# Create symetric heatmap
symheatmap_rjs(links, mtcars, group = "cyl")
}
