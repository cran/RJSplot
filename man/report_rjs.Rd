\name{report_rjs}
\alias{report_rjs}
\alias{addCSS2report}
\alias{addHTML2report}
\alias{addParagraph2report}
\alias{addPlot2report}
\alias{addImage2report}
\title{Create a report web page.}
\author{
David Barrios and Carlos Prieto. Bioinformatics Service of Nucleus, University of Salamanca. See \url{http://bioinfo.usal.es/}
}
\value{
The function creates a folder in your computer with an HTML document named index.html which contains the report. This file can be directly opened with your browser.
}
\seealso{
  The \sQuote{RJSplot} Website: \url{http://rjsplot.net}

  \code{\link{dendrogram_rjs}}, \code{\link{densityplot_rjs}}, \code{\link{genomemap_rjs}}, \code{\link{heatmap_rjs}}, \code{\link{manhattan_rjs}}, \code{\link{network_rjs}}, \code{\link{scatterplot_rjs}}, \code{\link{symheatmap_rjs}}, \code{\link{wordcloud_rjs}}, \code{\link{boxplot_rjs}}, \code{\link{bubbles_rjs}}, \code{\link{hiveplot_rjs}}, \code{\link{piechart_rjs}}, \code{\link{barplot_rjs}}, \code{\link{tables_rjs}}, \code{\link{surface3d_rjs}}, \code{\link{scatter3d_rjs}}.
}
\usage{
report_rjs(dir = "RJSreport")
addCSS2report(report,css)
addHTML2report(report,HTML)
addParagraph2report(report,p)
addPlot2report(report,plot,height=600)
addImage2report(report,img)
}
\arguments{
\item{dir}{a "character" string representing the directory where the report will be saved.}
\item{report}{a RJSreport object produced by the function \code{report_rjs}.}
\item{css}{a character string representing the CSS path to be added.}
\item{HTML}{a character string giving the HTML code to be added.}
\item{p}{a character string giving the new paragraph to be added.}
\item{plot}{a character string representing the plot directory to be added.}
\item{height}{an integer vector giving a default height of the plot.}
\item{img}{a character string representing the image path to be added.}
}
\description{
\code{report_rjs} creates a report web page.
}
