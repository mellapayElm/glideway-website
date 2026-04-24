'use client'

/**
 * GlideWay Official Logo Component
 * Circular emblem with motion lines, curved road path, and wordmark
 * Based on official brand screenshot
 */

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'full'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// The official GlideWay icon SVG - bright green C-shape emblem with motion lines and white road
function GlideWayIcon({ size = 60, id = 'main' }: { size?: number; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" className="flex-shrink-0">
      {/* Bright lime green C-shaped emblem (filled arc) */}
      <path
        d="M 60 30 A 60 60 0 0 1 130 100 L 115 115 A 45 45 0 0 0 75 45 Z"
        fill="#7CFF3A"
      />

      {/* Motion speed lines - horizontal on left, decreasing length and opacity */}
      <line x1="15" y1="60" x2="60" y2="60" stroke="#7CFF3A" strokeWidth="7" strokeLinecap="round" />
      <line x1="20" y1="90" x2="58" y2="90" stroke="#7CFF3A" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      <line x1="28" y1="120" x2="56" y2="120" stroke="#7CFF3A" strokeWidth="5" strokeLinecap="round" opacity="0.6" />

      {/* White curved road/swoosh - flows from inside emblem to right */}
      <path
        d="M 65 100 Q 85 80 105 65 Q 125 50 145 45"
        stroke="#ffffff"
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Road center dashed line - bright green */}
      <path
        d="M 65 100 Q 85 80 105 65 Q 125 50 145 45"
        stroke="#7CFF3A"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="7,7"
      />
    </svg>
  )
}

export function GlidewayLogo({ variant = 'horizontal', size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 40, text: 16 },
    md: { icon: 56, text: 22 },
    lg: { icon: 80, text: 32 },
    xl: { icon: 120, text: 44 },
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
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <GlideWayIcon size={iconSize} id="full" />

        <div className="text-center font-bold tracking-tight" style={{ fontSize: `${textSize}px`, lineHeight: 1 }}>
          <span className="text-white">GLIDE</span>
          <span className="text-[#7CFF3A]">WAY</span>
        </div>

        <div className="flex items-center gap-3 justify-center">
          <span className="w-8 h-px bg-[#7CFF3A]" />
          <span className="text-[#7CFF3A] text-xs font-bold tracking-widest whitespace-nowrap">
            RIDE SMOOTHLY, GLIDE EASILY
          </span>
          <span className="w-8 h-px bg-[#7CFF3A]" />
        </div>
      </div>
    )
  }

  // Horizontal variant - icon + text side by side for headers
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <GlideWayIcon size={iconSize} id="horiz" />

      <div className="flex flex-col justify-center">
        <div className="font-bold text-white tracking-tight" style={{ fontSize: `${textSize}px`, lineHeight: 1.1 }}>
          GLIDE<span className="text-[#7CFF3A]">WAY</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-4 h-px bg-[#7CFF3A]" />
          <span className="text-[#7CFF3A] text-[11px] font-bold tracking-wider">
            RIDE SMOOTHLY
          </span>
          <span className="w-4 h-px bg-[#7CFF3A]" />
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
