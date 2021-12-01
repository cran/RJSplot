\name{newInput}
\alias{newInput}
\title{Produce a \code{newInput} object for \code{R4web}.}
\author{
David Barrios and Carlos Prieto. Bioinformatics Service of Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\value{
Return a \code{newInput} object.
}
\seealso{
  The \sQuote{RJSplot} Website: \url{https://rjsplot.usal.es}

  \code{\link{dendrogram_rjs}}, \code{\link{densityplot_rjs}}, \code{\link{genomemap_rjs}}, \code{\link{heatmap_rjs}}, \code{\link{manhattan_rjs}}, \code{\link{network_rjs}}, \code{\link{scatterplot_rjs}}, \code{\link{symheatmap_rjs}}, \code{\link{wordcloud_rjs}}, \code{\link{boxplot_rjs}}, \code{\link{bubbles_rjs}}, \code{\link{hiveplot_rjs}}, \code{\link{piechart_rjs}}, \code{\link{barplot_rjs}}, \code{\link{tables_rjs}}, \code{\link{surface3d_rjs}}, \code{\link{scatter3d_rjs}}.
}

\usage{
newInput(name, type = c("character","numeric","matrix","data.frame","factor"),
         default = "", levels = NULL, multi = FALSE)
}
\arguments{
\item{name}{character string with the variable name.}

\item{type}{character string which describes the variable type. Possible values are "character", "numeric", "matrix", "data.frame" or "factor".}

\item{default}{default value for this input.}

\item{levels}{a vector with the possible input values. It is described only for factor data \code{type}.}

\item{multi}{boolean value which indicates if multiple selection are enabled for this input. It is described only for factor data \code{type}.}
}
\description{
\code{newInput} produce \code{newInput} object for \code{R4web}.
}
