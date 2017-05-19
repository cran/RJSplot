\name{hiveplot_rjs}
\alias{hiveplot_rjs}
\title{Produce interactive hive plot}
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
hiveplot_rjs(links, nodes = NA, group = NULL, size = NULL, color = NULL,
             plot = TRUE, jupyter = FALSE, dir = "HivePlot")
}
\arguments{
\item{links}{an edge list table stored in a data frame with three possible columns (source node id, target node id and link value).}
\item{nodes}{node attributes stored in a data frame with rownames as node id.}
\item{group}{column name of \code{nodes} data frame which describes visualized axes.}
\item{size}{column name of \code{nodes} data frame which describes each node size.}
\item{color}{column name of \code{nodes} data frame which describes each node color.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{hiveplot_rjs} creates an interactive hive plot.
}
\examples{
## Create an interactive hive plot in the folder "HivePlot" of your local machine
## Live examples on http://rjsplot.net
# Prepare data
x <- 1-cor(t(mtcars))

source <- rep(rownames(x),nrow(x))
target <- rep(rownames(x),rep(ncol(x),nrow(x)))
links <- data.frame(source=source,target=target,value=as.vector(x))

# Generate the hive plot
hiveplot_rjs(links, mtcars, group = "cyl", size = "wt", color = "carb")
}
