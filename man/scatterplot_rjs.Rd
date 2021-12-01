\name{scatterplot_rjs}
\alias{scatterplot_rjs}
\title{Produce and interactive Scatter plot (XY plot).}
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
scatterplot_rjs(x, y, id = NULL, xlab = "", ylab = "",
                xlim = NULL, ylim = NULL, col = NULL,
                pch = NULL, abline.x = NULL, abline.y = NULL, cex = 1,
                plot = TRUE, jupyter = FALSE, dir = tempdir())
}
\arguments{
\item{x}{a vector with the x data of each point.}
\item{y}{a vector with the y data of each point.}
\item{id}{a vector giving the id of each point.}
\item{xlab}{a title for the x axis.}
\item{ylab}{a title for the y axis.}
\item{xlim}{a vector with two values which specifies the X minimun and maximun values in the representation.}
\item{ylim}{a vector with two values which specifies the Y minimun and maximun values in the representation.}
\item{col}{a vector with the colour of each represented point.}
\item{pch}{a character vector with the shape of each point. It should be one of: 1-"circle", 2-"triangle-up", 3-"cross", 4-"square", 5-"diamond", 6-"triangle-down".}
\item{abline.x}{a numeric vector with x coordenates where a vertical line will be placed.}
\item{abline.y}{a numeric vector with y coordenates where a horizontal line will be placed.}
\item{cex}{number indicating the amount by which plotting text and symbols should be scaled relative to the default.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{scatterplot_rjs} generates an interactive Scatter Plot.
}
\examples{
## Create an interactive Scatter plot in a temporal directory of your local machine
## Live examples on https://rjsplot.usal.es

if(interactive()){
# Scatter plot creation
scatterplot_rjs(iris$Sepal.Width, iris$Sepal.Length,
  abline.x = c(3.4,3.8), abline.y = c(5.8,7),
  col = iris$Species, pch = as.numeric(iris$Species), id = iris$Species,
  xlab = "Sepal Width (cm)", ylab = "Sepal Length (cm)")
}
}
