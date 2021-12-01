\name{genomemap_rjs}
\alias{genomemap_rjs}
\title{Create an interative genome map.}
\author{
David Barrios and Carlos Prieto. Bioinformatics Service of Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\value{
The function creates a folder in your computer with an HTML document named index.html which contains the graph. This file can be directly opened with Firefox. If you want to open this file stored in your local machine with other Web browser, please visit the help section on the RJSplot Web site (\url{https://rjsplot.usal.es}).
}
\seealso{
  The \sQuote{RJSplot} Website: \url{https://rjsplot.usal.es}

  \code{\link{dendrogram_rjs}}, \code{\link{densityplot_rjs}}, \code{\link{genomemap_rjs}}, \code{\link{heatmap_rjs}}, \code{\link{manhattan_rjs}}, \code{\link{network_rjs}}, \code{\link{scatterplot_rjs}}, \code{\link{symheatmap_rjs}}, \code{\link{wordcloud_rjs}}, \code{\link{boxplot_rjs}}, \code{\link{bubbles_rjs}}, \code{\link{hiveplot_rjs}}, \code{\link{piechart_rjs}}, \code{\link{barplot_rjs}}, \code{\link{tables_rjs}}, \code{\link{surface3d_rjs}}, \code{\link{scatter3d_rjs}}.
}
\usage{
genomemap_rjs(assembly, track = NULL, plot = TRUE, jupyter = FALSE, dir = tempdir())
}
\arguments{
\item{assembly}{a genome assembly data frame. RJSplot provides human assemblies (NCBI36, GRCh37, GRCh38), human assemblies with cytobands (GRCh37.bands or GRCh38.bands), or methods for creating your own assembly from a FASTA file \code{\link{getAssemblyFromFasta}}.}
\item{track}{a data frame with values to represent on the genome map (chromosome, position, value).}
\item{plot}{open resulting graph in your browser.}
\item{jupyter}{embed the graph as an iframe into a Jupyter Notebook.}
\item{dir}{a "character" string representing the directory where the graph will be saved.}
}
\description{
\code{genomemap_rjs} creates an interactive genome map.
}
\examples{
## Create an interactive Genome map in a temporal directory of your local machine
## Live examples on https://rjsplot.usal.es

if(interactive()){
# Create test data
chr <- character()
pos <- numeric()

for(i in 1:nrow(GRCh38)){
  chr <- c(chr,as.character(rep(GRCh38[i,"chr"],100)))
  pos <- c(pos,sample(GRCh38[i,"start"]:GRCh38[i,"end"],100))
}

value <- round(rexp(length(pos)),2)

# Create a genome map
track <- data.frame(chr,pos,pos+1,NA,value)
genomemap_rjs(GRCh38.bands, track)
}
}
