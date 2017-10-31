\name{heatmap_rjs}
\alias{heatmap_rjs}
\title{Produce an interactive heatmap.}
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
heatmap_rjs(data, metadata = NULL, scale = c("row", "column", "none"), cluster = TRUE,
            color = c("Reds", "Greens", "Blues", "RdBkGr", "RdWhBu"),
            na.color = "transparent", cex = 1, plot = TRUE, jupyter = FALSE, 
            dir = "Heatmap", distfun = dist, hclustfun = hclust)
}
\arguments{
\item{data}{numeric matrix of the values to be plotted.}
\item{metadata}{a data frame with metadata information for column features (p.e. sample phenotypes). Samples are given in rows and features in columns.}
\item{scale}{character indicating if the values should be centered and scaled in either the row direction or the column direction, or none. The default value is "none".}
\item{cluster}{logical value to enable (\code{TRUE}) or disable (\code{FALSE}) data clustering.}
\item{color}{character indicating the color scale to paint values. The default value is "Blues".}
\item{na.color}{character indicating the color to use for missing values. Transparent by default.}
\item{cex}{number indicating the amount by which plotting text and symbols should be scaled relative to the default.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
\item{distfun}{function used to compute the distance between rows and columns.}
\item{hclustfun}{function used to compute the hierarchical clustering.}
}
\description{
\code{heatmap_rjs} creates interactive heatmaps.
}
\examples{
## Create an interactive heatmap in the folder "Heatmap" of your local machine
## Live examples on http://rjsplot.net
metadata <- data.frame(phenotype1 = sample(c("yes","no"),ncol(mtcars),TRUE),
                       phenotype2 = sample(1:5,ncol(mtcars),TRUE))

heatmap_rjs(data.matrix(mtcars), metadata, scale="column")
}
