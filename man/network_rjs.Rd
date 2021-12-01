\name{network_rjs}
\alias{network_rjs}
\title{Produce interactive network graph}
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
network_rjs(links, nodes = NULL,
            weight = NULL, linkLabel = NULL, linkColor = NULL,
            group = NULL, size = NULL, color = NULL, label = NULL,
            nodeColorScale = c("RdBk","RdBkGr"), cex = 1, 
            plot = TRUE, jupyter = FALSE, dir = tempdir())
}
\arguments{
\item{links}{an edge list table stored in a data frame with at least two columns (source node id and target node id).}
\item{nodes}{a node list stored in a data frame object with rownames as node id.}
\item{weight}{a vector giving the column of \code{links} to show as weight. If \code{NULL} but third \code{links} column is numeric, this one will be used as weight.}
\item{linkLabel}{a vector giving the column of \code{links} to show as link text.}
\item{linkColor}{a vector giving the column of \code{links} to compute link color or directly a vector of colors.}
\item{group}{a vector giving the column of \code{nodes} to show as group.}
\item{size}{a vector giving the column of \code{nodes} to show as size.}
\item{color}{a vector giving the column of \code{nodes} to compute node color or directly a vector of colors.}
\item{label}{a vector giving the column of \code{nodes} to show as label.}
\item{nodeColorScale}{a "character" string representing the color scale applied to nodes by default.}
\item{cex}{number indicating the amount by which plotting text and symbols should be scaled relative to the default.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{network_rjs} creates an interactive network graph.
}
\examples{
## Create an interactive network graph in a temporal directory of your local machine
## Live examples on https://rjsplot.usal.es

if(interactive()){
# Prepare data
x <- 1-cor(t(mtcars))

source <- rep(rownames(x),nrow(x))
target <- rep(rownames(x),rep(ncol(x),nrow(x)))
links <- data.frame(source=source,target=target,value=as.vector(x))

# Generate the network graph
network_rjs(links[links[,3]>0.1,], mtcars, group = "cyl", size = "hp", color = "mpg")
}
}
