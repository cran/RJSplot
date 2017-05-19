\name{manhattan_rjs}
\alias{manhattan_rjs}
\title{Create an interactive manhattan plot}
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
manhattan_rjs(data, assembly, axisv, distv, cell = 1e+06, outliers = TRUE, ylab = "score",
yscale = NA, plot = TRUE, jupyter = FALSE, dir = "ManhattanPlot")
}
\arguments{
\item{data}{a data frame with four columns (identifier, chromosome/scaffold, position, score).}
\item{assembly}{a data frame with an assembly to be used. It should be one of the following human assemblies data frames provided by RJSplot: \code{NCBI36}, \code{GRCh37}, \code{GRCh38}.}
\item{axisv}{value for the coordinate of the main horizontal axis.}
\item{distv}{distance between the main horizontal axis and the secondary axes (which stablishes the limit for the outlier representation).}
\item{cell}{segment size which is represented.}
\item{outliers}{logical value to enable (\code{TRUE}) or disable (\code{FALSE}) outliers.}
\item{ylab}{a title for the y axis.}
\item{yscale}{a vector with two values which specifies the minimun and maximun limits in the representation. By default maximun and minimun scores are taken as the limits.}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{manhattan_rjs} creates an interactive Manhattan plot.
}
\examples{
\donttest{
## Create an interactive Manhattan plot in the folder "ManhattanPlot" of your local machine
## Live examples on http://rjsplot.net

# Create test data
chr <- character()
pos <- numeric()

for(i in 1:nrow(GRCh38)){
  chr <- c(chr,as.character(rep(GRCh38[i,"chr"],100)))
  pos <- c(pos,sample(GRCh38[i,"start"]:GRCh38[i,"end"],100))
}

value <- round(rexp(length(pos)),2)

# Create a manhattan plot
data <- data.frame(paste0("ProbeSet_",seq_along(pos)),chr,pos,value)
manhattan_rjs(data, GRCh38, 0, 1, 0, TRUE, "log2Ratio")
}
}
