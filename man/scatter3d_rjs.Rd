\name{scatter3d_rjs}
\alias{scatter3d_rjs}
\title{Produce and interactive 3D Scatter plot (XYZ plot).}
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
scatter3d_rjs(x, y, z, color="#000", xlab = "x", ylab = "y", zlab = "z",
              plot = TRUE, jupyter = FALSE, dir = "Scatter3d")
}
\arguments{
\item{x}{a vector with the x data of each point.}
\item{y}{a vector with the y data of each point.}
\item{z}{a vector with the z data of each point.}
\item{xlab}{a title for the x axis.}
\item{ylab}{a title for the y axis.}
\item{zlab}{a title for the z axis.}
\item{color}{a vector with the colour of each represented point.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{scatter3d_rjs} generates an interactive 3D Scatter Plot.
}
\examples{
## Create an interactive 3D Scatter plot in the folder "ScatterPlot" of your local machine
## Live examples on http://rjsplot.net

# 3D Scatter plot creation
scatter3d_rjs(iris$Sepal.Width, iris$Sepal.Length, iris$Petal.Width, color = iris$Species,
              xlab = "Sepal Width (cm)", ylab = "Sepal Length (cm)", zlab = "Petal Width (cm)")
}
