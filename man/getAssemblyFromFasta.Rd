\name{getAssemblyFromFasta}
\alias{getAssemblyFromFasta}
\title{Create an assembly from a FASTA file for its use as parameter of \code{genomemap_rjs} or \code{manhattan_rjs}.}
\author{
David Barrios and Carlos Prieto. Bioinformatics Service of Nucleus, University of Salamanca. See \url{https://bioinfo.usal.es/}
}
\seealso{
  The \sQuote{RJSplot} Website: \url{https://rjsplot.usal.es}

  \code{\link{genomemap_rjs}}.

  \code{\link{manhattan_rjs}}.
}
\note{
FASTA format is a text-based format for representing either nucleotide sequences or peptide sequences, in which nucleotides or amino acids are represented using single-letter codes.
}
\usage{
getAssemblyFromFasta(fasta)
}
\arguments{
\item{fasta}{a "character" string representing the input Fasta file to be added in the genome browser.}
}
\description{
\code{getAssemblyFromFasta} create assemblies from a FASTA file for their use as parameter of \code{genomemap_rjs} or \code{manhattan_rjs}.
}
\value{
a data frame in BED format ready to use as an assembly in \code{genomemap_rjs} or \code{manhattan_rjs}.
}
\examples{
## Live examples and full tutorial on https://rjsplot.usal.es
}
