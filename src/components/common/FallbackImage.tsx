import { useState, type ImgHTMLAttributes } from "react"

const FALLBACK = "/placeholder.svg"

export function FallbackImage({ src, alt, onError, className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <img
      src={imgSrc || FALLBACK}
      alt={alt}
      className={className}
      onError={(e) => {
        if (imgSrc !== FALLBACK) setImgSrc(FALLBACK)
        onError?.(e)
      }}
      {...props}
    />
  )
}
