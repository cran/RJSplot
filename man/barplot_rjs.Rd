\name{barplot_rjs}
\alias{barplot_rjs}
\title{Produce interactive bar plot(s).}
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
barplot_rjs(height, xlab = "", ylab = "", ylim = NA,
            plot = TRUE, jupyter = FALSE, dir = "Barplot")
}
\arguments{
\item{height}{either a vector or matrix of values describing the bars which make up the plot.}
\item{xlab}{a title for the x axis.}
\item{ylab}{a title for the y axis.}
\item{ylim}{a vector with two values which specifies the Y minimun and maximun values in the representation.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{barplot_rjs} produce interactive bar plot(s) of the given values.
}
\examples{
## Create an interactive barplot in the folder "Barplot" of your local machine
## Live examples on http://rjsplot.net
barplot_rjs(USArrests, "states", "arrests")
}
