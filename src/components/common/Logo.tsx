import { useState } from "react"

const FALLBACK_SVG = (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <rect width="40" height="40" rx="10" fill="#0a0a09" />
    <text
      x="20"
      y="26"
      textAnchor="middle"
      fontFamily="Archivo, sans-serif"
      fontWeight="800"
      fontSize="18"
      fill="#FFD54A"
    >
      EH
    </text>
  </svg>
)

interface LogoProps {
  className?: string
}

export function Logo({ className = "h-10 w-10" }: LogoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span className={className}>{FALLBACK_SVG}</span>
  }

  return (
    <img
      src="/logo.png"
      alt="EventHub logo"
      className={`${className} rounded-xl object-cover`}
      onError={() => setFailed(true)}
    />
  )
}
