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
    <svg width={size} height={size} viewBox="0 0 120 120" className="flex-shrink-0">
      <defs>
        <linearGradient id={`glideGrad${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#7CFF3A" />
          <stop offset="100%" stopColor="#7CFF3A" />
        </linearGradient>
      </defs>

      {/* Outer circle arc - partial circle open at bottom left */}
      <path
        d="M 25 85 A 50 50 0 1 1 60 110"
        stroke={`url(#glideGrad${id})`}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      {/* Motion speed lines - left side */}
      <line x1="5" y1="50" x2="22" y2="50" stroke="#7CFF3A" strokeWidth="4" strokeLinecap="round" />
      <line x1="8" y1="65" x2="20" y2="65" stroke="#7CFF3A" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <line x1="10" y1="35" x2="20" y2="35" stroke="#7CFF3A" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

      {/* Road/path - white curved road going up and right */}
      <path
        d="M 40 90 Q 45 70 55 60 Q 70 45 90 40"
        stroke="#ffffff"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Road center dashed line */}
      <path
        d="M 42 88 Q 47 70 57 60 Q 70 47 88 42"
        stroke="#7CFF3A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="4,4"
      />

      {/* Destination point */}
      <circle cx="90" cy="40" r="5" fill="#7CFF3A" />
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
