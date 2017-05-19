\name{R4web}
\alias{R4web}
\title{Generate a PHP website which runs an R function.}
\author{
David Barrios and Carlos Prieto. Bioinformatics Service of Nucleus, University of Salamanca. See \url{http://bioinfo.usal.es/}
}
\value{
The function creates a folder in the working directory of your computer with some PHP files. Resulting folder should be added to the Apache applications directory and enable writting permissions.
}
\seealso{
  The \sQuote{RJSplot} Website: \url{http://rjsplot.net}

  \code{\link{dendrogram_rjs}}, \code{\link{densityplot_rjs}}, \code{\link{genomemap_rjs}}, \code{\link{heatmap_rjs}}, \code{\link{manhattan_rjs}}, \code{\link{network_rjs}}, \code{\link{scatterplot_rjs}}, \code{\link{symheatmap_rjs}}, \code{\link{wordcloud_rjs}}, \code{\link{boxplot_rjs}}, \code{\link{bubbles_rjs}}, \code{\link{hiveplot_rjs}}, \code{\link{piechart_rjs}}, \code{\link{barplot_rjs}}, \code{\link{tables_rjs}}, \code{\link{surface3d_rjs}}, \code{\link{scatter3d_rjs}}.
}

\usage{
R4web(...,fnfile,dir)
}
\arguments{
\item{...}{one or more \code{newInput} objects which will be included as form fields. Form values will be used as parameters for the R script.}

\item{fnfile}{a character string representing the R script file to be executed with the website.}

\item{dir}{a "character" string representing the directory where the PHP code will be saved.}
}
\description{
\code{R4web} generate a PHP website which runs an R function.
}
