\name{createAssembly}
\alias{createAssembly}
\title{Creates a genome assembly for \code{genomemap_rjs} or \code{manhattan_rjs}.}
\author{
David Barrios and Carlos Prieto. Bioinformatics Service of Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\seealso{
  The \sQuote{RJSplot} Website: \url{https://rjsplot.usal.es}

  \code{\link{genomemap_rjs}}.

  \code{\link{manhattan_rjs}}.
}
\usage{
createAssembly(name, size)
}
\arguments{
\item{name}{a vector with the chomosome or scaffold names.}

\item{size}{a vector with the chomosome or scaffold sizes.}
}
\description{
\code{createAssembly} create assemblies for their use as parameter of \code{genomemap_rjs} or \code{manhattan_rjs}.
}
\value{
a data frame in BED format to be used as an assembly in \code{genomemap_rjs} or \code{manhattan_rjs}.
}
\examples{
## Creates a fake genome assembly for its posterior use as parameter of genomemap or manhattan plot
## Live examples and full tutorial on https://rjsplot.usal.es

## Generate a test assembly with three scaffolds
assembly <- createAssembly(c("scaffold1","scaffold2","scaffold3"), c(1000000,800000,650000))
}
