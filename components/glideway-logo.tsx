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

// The official GlideWay icon SVG - bright green C-shape with motion lines and white road
function GlideWayIcon({ size = 48, id = 'main' }: { size?: number; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" className="flex-shrink-0">
      {/* Bright lime green curved C-shape emblem */}
      <path
        d="M 50 25 A 55 55 0 0 1 115 90 L 105 100 A 45 45 0 0 0 60 35 Z"
        fill="#7CFF3A"
      />

      {/* Motion speed lines - horizontal on left */}
      <line x1="12" y1="55" x2="48" y2="55" stroke="#7CFF3A" strokeWidth="6" strokeLinecap="round" />
      <line x1="18" y1="80" x2="48" y2="80" stroke="#7CFF3A" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <line x1="22" y1="105" x2="48" y2="105" stroke="#7CFF3A" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

      {/* White curved road/path - flows from inside emblem to right */}
      <path
        d="M 55 85 Q 75 70 100 55 Q 115 45 130 40"
        stroke="#ffffff"
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Road center dashed line - bright green */}
      <path
        d="M 55 85 Q 75 70 100 55 Q 115 45 130 40"
        stroke="#7CFF3A"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="6,6"
      />
    </svg>
  )
}

      {/* Road center dashed line - bright green */}
      <path
        d="M 55 85 Q 75 70 100 55 Q 115 45 130 40"
        stroke="#7CFF3A"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="6,6"
      />
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
