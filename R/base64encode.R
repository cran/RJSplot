base64encode <- function(filename) {
  to.read = file(filename, "rb")
  fsize <- file.size(filename)
  sbit <- readBin(to.read, raw(), n = fsize, endian = "little")
  close(to.read)
  b64c <- "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  shfts <- c(18,12,6,0)
  sand <- function(n,s) bitwAnd(bitwShiftR(n,s),63)+1
  slft <- function(p,n) bitwShiftL(as.integer(p),n)
  subs <- function(s,n) substring(s,n,n)
  npad <- ( 3 - length(sbit) %% 3) %% 3
  sbit <- c(sbit,as.raw(rep(0,npad)))
  pces <- lapply(seq(1,length(sbit),by=3),function(ii) sbit[ii:(ii+2)])
  encv <- paste0(sapply(pces,function(p) paste0(sapply(shfts,function(s)(subs(b64c,sand(slft(p[1],16)+slft(p[2],8)+slft(p[3],0),s)))))),collapse="")
  if (npad > 0) substr(encv,nchar(encv)-npad+1,nchar(encv)) <- paste0(rep("=",npad),collapse="")
  return(encv)
}
