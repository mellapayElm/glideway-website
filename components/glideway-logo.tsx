'use client'

/**
 * GlideWay Official Logo Component
 * Circular emblem with motion lines, curved road path, and wordmark
 * Based on official brand guide
 */

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'full'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// The official GlideWay icon SVG - circle with motion lines and road path
function GlideWayIcon({ size = 48, id = 'main' }: { size?: number; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" className="flex-shrink-0">
      <defs>
        <linearGradient id={`glideGrad${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#7CFF3A" />
          <stop offset="100%" stopColor="#7CFF3A" />
        </linearGradient>
      </defs>

      {/* Main circular arc - green gradient from top to right */}
      <path
        d="M 35 50 A 45 45 0 0 1 105 105"
        stroke={`url(#glideGrad${id})`}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Motion speed lines - left side, decreasing */}
      <line x1="8" y1="55" x2="32" y2="55" stroke="#7CFF3A" strokeWidth="5" strokeLinecap="round" />
      <line x1="12" y1="75" x2="30" y2="75" stroke="#7CFF3A" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
      <line x1="16" y1="40" x2="28" y2="40" stroke="#7CFF3A" strokeWidth="3" strokeLinecap="round" opacity="0.5" />

      {/* White curved road - from lower left to upper right inside circle */}
      <path
        d="M 45 95 Q 55 75 70 55 Q 85 35 105 30"
        stroke="#ffffff"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Road center dashed line - green */}
      <path
        d="M 45 95 Q 55 75 70 55 Q 85 35 105 30"
        stroke="#7CFF3A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="5,5"
      />

      {/* Destination marker - top right */}
      <circle cx="106" cy="28" r="6" fill="#7CFF3A" />
    </svg>
  )
}

export function GlidewayLogo({ variant = 'horizontal', size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 36, text: 16 },
    md: { icon: 48, text: 20 },
    lg: { icon: 72, text: 28 },
    xl: { icon: 96, text: 36 },
  }

  const { icon: iconSize, text: textSize } = sizes[size]

  // Icon variant - just the emblem
  if (variant === 'icon') {
    return (
      <div className={className}>
        <GlideWayIcon size={iconSize} id="icon" />
      </div>
    )
  }

  // Full variant - stacked logo with icon, wordmark, and tagline
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <GlideWayIcon size={iconSize * 1.5} id="full" />

        <div className="text-center font-bold tracking-wide" style={{ fontSize: `${textSize}px` }}>
          <span className="text-white">GLIDE</span>
          <span className="text-[#7CFF3A]">WAY</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-6 h-px bg-[#7CFF3A]" />
          <span className="text-[#7CFF3A] text-xs font-semibold tracking-widest">
            RIDE SMOOTHLY, GLIDE EASILY
          </span>
          <span className="w-6 h-px bg-[#7CFF3A]" />
        </div>
      </div>
    )
  }

  // Horizontal variant - icon + text side by side for headers
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <GlideWayIcon size={iconSize} id="horiz" />

      <div className="flex flex-col">
        <div className="font-bold text-white tracking-wide" style={{ fontSize: `${textSize}px`, lineHeight: 1.1 }}>
          GLIDE<span className="text-[#7CFF3A]">WAY</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-px bg-[#7CFF3A]" />
          <span className="text-[#7CFF3A] text-[10px] font-semibold tracking-wider">
            RIDE SMOOTHLY, GLIDE EASILY
          </span>
          <span className="w-3 h-px bg-[#7CFF3A]" />
        </div>
      </div>
    </div>
  )
}

// Legacy exports for backward compatibility
export function GlidewayIconMark({ className = '' }: { className?: string }) {
  return <GlidewayLogo variant="icon" size="md" className={className} />
}

export function GlidewayLogoDark({ className = '' }: { className?: string }) {
  return <GlidewayLogo variant="full" size="lg" className={className} />
}

export function GlidewayLogoWithText({ className = '' }: { className?: string }) {
  return <GlidewayLogo variant="horizontal" size="md" className={className} />
}
