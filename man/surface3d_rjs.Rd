\name{surface3d_rjs}
\alias{surface3d_rjs}
\title{Produce and interactive 3D surface.}
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
surface3d_rjs(x, color = "#fff", xlab = "x", ylab = "y", zlab = "z",
              plot = TRUE, jupyter = FALSE, dir = tempdir())
}
\arguments{
\item{x}{numeric matrix of the values to be plotted.}
\item{color}{a vector with colors to construct the color scale.}
\item{xlab}{a title for the x axis.}
\item{ylab}{a title for the y axis.}
\item{zlab}{a title for the z axis.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{surface3d_rjs} generates an interactive 3D surface.
}
\examples{
## Create an interactive 3D Surface in a temporal directory of your local machine
## Live examples on https://rjsplot.usal.es

if(interactive()){
# 3D surface creation
surface3d_rjs(volcano,color=c("red","green"))
}
}
