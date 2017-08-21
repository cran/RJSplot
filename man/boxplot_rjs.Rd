\name{boxplot_rjs}
\alias{boxplot_rjs}
\title{Produce interactive box-and-whisker plot(s).}
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
boxplot_rjs(data, xlab = "", ylab = "", ylim = NA, cex = 1,
            plot = TRUE, jupyter = FALSE, dir = "Boxplot")
}
\arguments{
\item{data}{a Data Frame or Matrix from which the data for each box will be taken.}
\item{xlab}{a title for the x axis.}
\item{ylab}{a title for the y axis.}
\item{ylim}{a vector with two values which specifies the Y minimun and maximun values in the representation.}
\item{cex}{number indicating the amount by which plotting text and symbols should be scaled relative to the default.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{boxplot_rjs} produce interactive box-and-whisker plot(s) of the given values.
}
\examples{
## Create an interactive boxplot in the folder "Boxplot" of your local machine
## Live examples on http://rjsplot.net
boxplot_rjs(attitude, "attitude", "favourable responses")
}
