\name{dendrogram_rjs}
\alias{dendrogram_rjs}
\title{Draw a Dendrogram.}
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
dendrogram_rjs(data, metadata = NULL, method = "complete",
               plot = TRUE, jupyter = FALSE, dir = "Dendrogram")
}
\arguments{
\item{data}{a dissimilarity object of class dist (p.e. produced by function dist).}
\item{metadata}{a data frame with metadata information for leaf features (p.e. sample phenotypes). Corresponding Leaf/Sample should be provided as row name.}
\item{method}{Name of the agglomeration method to be used. It should be (an unambiguous abbreviation of) one of "ward.D", "ward.D2", "single", "complete", "average" (= UPGMA), "mcquitty" (= WPGMA), "median" (= WPGMC) or "centroid" (= UPGMC).}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{A "character" string representing the directory where the graph will be saved.}
}
\description{
\code{dendrogram_rjs} creates a dendrogram.
}
\examples{
## Create a dendrogram in the folder "Dendrogram" of your local machine
## Live examples on http://rjsplot.net
dendrogram_rjs(dist(USArrests),USArrests)
}
