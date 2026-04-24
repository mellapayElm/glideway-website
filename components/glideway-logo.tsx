'use client'

/**
 * GlideWay Logo Component
 * Professional branding with motion elements and road/journey symbolism
 * No letter characters - pure visual design
 */

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal' | 'text-only'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function GlidewayLogo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 40, font: 14 },
    md: { icon: 60, font: 20 },
    lg: { icon: 80, font: 28 },
  }

  const { icon: iconSize, font: fontSize } = sizes[size]

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" className={`flex-shrink-0 ${className}`}>
        {/* Outer circle - Motion effect */}
        <circle cx="50" cy="50" r="42" stroke="#7CFF3A" strokeWidth="3" fill="none" opacity="0.3" />
        
        {/* Main circle */}
        <circle cx="50" cy="50" r="38" stroke="#7CFF3A" strokeWidth="5" fill="none" />
        
        {/* Speed lines - left side */}
        <line x1="8" y1="45" x2="18" y2="45" stroke="#7CFF3A" strokeWidth="3" strokeLinecap="round" />
        <line x1="8" y1="55" x2="18" y2="55" stroke="#7CFF3A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        
        {/* Road path - journey/destination */}
        <path
          d="M 35 65 Q 50 35 70 55"
          stroke="#ffffff"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Road center line - dashed */}
        <path
          d="M 37 64 Q 50 38 68 54"
          stroke="#7CFF3A"
          strokeWidth="2"
          fill="none"
          strokeDasharray="3,3"
          strokeLinecap="round"
        />
        
        {/* Destination marker */}
        <circle cx="70" cy="55" r="4" fill="#7CFF3A" />
      </svg>
    )
  }

  // Text-only variant
  if (variant === 'text-only') {
    return (
      <div className={`font-bold ${className}`} style={{ fontSize: `${fontSize}px` }}>
        <span className="text-white">GLIDE</span>
        <span className="text-lime-400">WAY</span>
      </div>
    )
  }

  // Full logo variant (icon + text stacked)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" className="flex-shrink-0">
          {/* Outer circle - Motion effect */}
          <circle cx="50" cy="50" r="42" stroke="#7CFF3A" strokeWidth="3" fill="none" opacity="0.3" />
          
          {/* Main circle */}
          <circle cx="50" cy="50" r="38" stroke="#7CFF3A" strokeWidth="5" fill="none" />
          
          {/* Speed lines - left side */}
          <line x1="8" y1="45" x2="18" y2="45" stroke="#7CFF3A" strokeWidth="3" strokeLinecap="round" />
          <line x1="8" y1="55" x2="18" y2="55" stroke="#7CFF3A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          
          {/* Road path - journey/destination */}
          <path
            d="M 35 65 Q 50 35 70 55"
            stroke="#ffffff"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Road center line - dashed */}
          <path
            d="M 37 64 Q 50 38 68 54"
            stroke="#7CFF3A"
            strokeWidth="2"
            fill="none"
            strokeDasharray="3,3"
            strokeLinecap="round"
          />
          
          {/* Destination marker */}
          <circle cx="70" cy="55" r="4" fill="#7CFF3A" />
        </svg>
        
        <div className="text-center font-bold whitespace-nowrap" style={{ fontSize: `${fontSize}px` }}>
          <span className="text-white">GLIDE</span>
          <span className="text-lime-400">WAY</span>
        </div>
        
        <div className="text-lime-400 text-xs font-semibold tracking-wider text-center">
          RIDE SMOOTHLY, GLIDE EASILY
        </div>
      </div>
    )
  }

  // Horizontal variant (icon + text side-by-side)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" className="flex-shrink-0">
        {/* Outer circle - Motion effect */}
        <circle cx="50" cy="50" r="42" stroke="#7CFF3A" strokeWidth="3" fill="none" opacity="0.3" />
        
        {/* Main circle */}
        <circle cx="50" cy="50" r="38" stroke="#7CFF3A" strokeWidth="5" fill="none" />
        
        {/* Speed lines - left side */}
        <line x1="8" y1="45" x2="18" y2="45" stroke="#7CFF3A" strokeWidth="3" strokeLinecap="round" />
        <line x1="8" y1="55" x2="18" y2="55" stroke="#7CFF3A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        
        {/* Road path - journey/destination */}
        <path
          d="M 35 65 Q 50 35 70 55"
          stroke="#ffffff"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Road center line - dashed */}
        <path
          d="M 37 64 Q 50 38 68 54"
          stroke="#7CFF3A"
          strokeWidth="2"
          fill="none"
          strokeDasharray="3,3"
          strokeLinecap="round"
        />
        
        {/* Destination marker */}
        <circle cx="70" cy="55" r="4" fill="#7CFF3A" />
      </svg>
      
      <div className="flex flex-col">
        <div className="font-bold whitespace-nowrap" style={{ fontSize: `${fontSize}px`, lineHeight: '1' }}>
          <span className="text-white">GLIDE</span>
          <span className="text-lime-400">WAY</span>
        </div>
        <div className="text-lime-400 text-xs font-semibold tracking-wide">
          RIDE SMOOTHLY
        </div>
      </div>
    </div>
  )
}

// Keep legacy exports for backward compatibility
export function GlidewayIconMark({ className = 'w-8 h-8' }: { className?: string }) {
  return <GlidewayLogo variant="icon" className={className} />
}

export function GlidewayLogoDark({ className = 'w-12 h-12' }: { className?: string }) {
  return <GlidewayLogo variant="icon" className={className} />
}

export function GlidewayLogoWithText({ className = 'w-8' }: { className?: string }) {
  return <GlidewayLogo variant="horizontal" className={className} />
}
