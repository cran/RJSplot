\name{bubbles_rjs}
\alias{bubbles_rjs}
\title{Produce interactive bubble plots.}
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
bubbles_rjs(data, size = NULL, plot = TRUE, jupyter = FALSE, dir = tempdir())
}
\arguments{
\item{data}{a numeric Data Frame or Matrix with two columns and one row per bubble which contains represented values for each bubble. Row names will be used as bubble names.}
\item{size}{a vector giving each bubble size.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{bubbles_rjs} produce interactive bubble plot(s) of the given values.
}
\examples{
## Create an interactive barplot in a temporal directory of your local machine
## Live examples on https://rjsplot.usal.es
if(interactive()){
bubbles_rjs(scale(mtcars[,c("mpg","hp")],FALSE),mtcars$wt)
}
}
