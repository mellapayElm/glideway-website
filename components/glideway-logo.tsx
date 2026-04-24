'use client'

/**
 * GlideWay Logo Component
 * Professional branding using official logo designs
 * Variants: horizontal (web), icon (mobile), full (primary)
 */

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'full'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function GlidewayLogo({ variant = 'horizontal', size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 14 },
    md: { icon: 48, text: 20 },
    lg: { icon: 64, text: 28 },
  }

  const { icon: iconSize, text: textSize } = sizes[size]

  // Icon variant - Stylized S for mobile app
  if (variant === 'icon') {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 120 120" className={`flex-shrink-0 ${className}`}>
        <defs>
          <linearGradient id="glideGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7CFF3A" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* Background glow */}
        <circle cx="60" cy="60" r="58" fill="#1a1a1a" />
        <circle cx="60" cy="60" r="55" stroke="#7CFF3A" strokeWidth="1.5" fill="none" opacity="0.2" />

        {/* Motion lines */}
        <line x1="12" y1="55" x2="28" y2="55" stroke="#7CFF3A" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="8" y1="70" x2="24" y2="70" stroke="#7CFF3A" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="15" y1="40" x2="28" y2="40" stroke="#7CFF3A" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

        {/* S shape */}
        <path
          d="M 50 35 Q 70 35 75 50 Q 78 60 65 70 Q 50 80 45 90"
          stroke="url(#glideGradient)"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* S inner highlight */}
        <path
          d="M 50 35 Q 70 35 75 50 Q 78 60 65 70 Q 50 80 45 90"
          stroke="#ffffff"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>
    )
  }

  // Full variant - comprehensive branding
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 120 120" className="flex-shrink-0">
          <defs>
            <linearGradient id="glideGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7CFF3A" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* Background glow */}
          <circle cx="60" cy="60" r="58" fill="#1a1a1a" />
          <circle cx="60" cy="60" r="55" stroke="#7CFF3A" strokeWidth="1.5" fill="none" opacity="0.2" />

          {/* Motion lines */}
          <line x1="12" y1="55" x2="28" y2="55" stroke="#7CFF3A" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="8" y1="70" x2="24" y2="70" stroke="#7CFF3A" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <line x1="15" y1="40" x2="28" y2="40" stroke="#7CFF3A" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

          {/* S shape */}
          <path
            d="M 50 35 Q 70 35 75 50 Q 78 60 65 70 Q 50 80 45 90"
            stroke="url(#glideGradient2)"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* S inner highlight */}
          <path
            d="M 50 35 Q 70 35 75 50 Q 78 60 65 70 Q 50 80 45 90"
            stroke="#ffffff"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        </svg>

        <div className="text-center font-bold" style={{ fontSize: `${textSize}px` }}>
          <span className="text-white">GLIDE</span>
          <span className="text-lime-400">WAY</span>
        </div>

        <div className="text-lime-400 text-xs font-semibold tracking-wider">
          RIDE SMOOTHLY, GLIDE EASILY
        </div>
      </div>
    )
  }

  // Horizontal variant - Best for website headers
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon part */}
      <svg width="48" height="48" viewBox="0 0 120 120" className="flex-shrink-0">
        <defs>
          <linearGradient id="glideHGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7CFF3A" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* Background glow */}
        <circle cx="60" cy="60" r="58" fill="#1a1a1a" />
        <circle cx="60" cy="60" r="55" stroke="#7CFF3A" strokeWidth="1.5" fill="none" opacity="0.2" />

        {/* Motion lines */}
        <line x1="30" y1="45" x2="48" y2="45" stroke="#7CFF3A" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="26" y1="60" x2="42" y2="60" stroke="#7CFF3A" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="33" y1="32" x2="48" y2="32" stroke="#7CFF3A" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

        {/* S shape */}
        <path
          d="M 60 28 Q 78 28 85 40 Q 90 50 78 60 Q 65 70 60 80"
          stroke="url(#glideHGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* S inner highlight */}
        <path
          d="M 60 28 Q 78 28 85 40 Q 90 50 78 60 Q 65 70 60 80"
          stroke="#ffffff"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>

      {/* Text part */}
      <div className="flex flex-col">
        <div className="font-bold text-white text-xl leading-tight">
          GLIDE<span className="text-lime-400">WAY</span>
        </div>
        <div className="text-lime-400 text-xs font-semibold tracking-wide">
          RIDE SMOOTHLY
        </div>
      </div>
    </div>
  )
}

// Legacy exports for backward compatibility
export function GlidewayIconMark({ className = 'w-12 h-12' }: { className?: string }) {
  return <GlidewayLogo variant="icon" className={className} />
}

export function GlidewayLogoDark({ className = 'w-12 h-12' }: { className?: string }) {
  return <GlidewayLogo variant="icon" className={className} />
}

export function GlidewayLogoWithText({ className = 'w-40' }: { className?: string }) {
  return <GlidewayLogo variant="horizontal" className={className} />
}
