\name{densityplot_rjs}
\alias{densityplot_rjs}
\title{Draw an interactive density plot.}
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
densityplot_rjs(data, xlab = "", ylab = "",
                plot = TRUE, jupyter = FALSE, dir = "DensityPlot")
}
\arguments{
\item{data}{a data frame from which distribution will be represented for each column.}
\item{xlab}{a title for the x axis.}
\item{ylab}{ a title for the y axis.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{densityplot_rjs} creates density plots.
}
\examples{
## Creates a density plot in the folder "DensityPlot" of your local machine
## Live examples on http://rjsplot.net

## Generate test input data
data <- data.frame(Uni05 = (1:100)/21, Norm = rnorm(100), `5T` = rt(100, df = 5),
Gam2 = rgamma(100, shape = 2))

# Create the density plot
densityplot_rjs(data, "x", "y")
}
