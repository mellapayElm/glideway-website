'use client';

// Official GlideWay Logo Component
export function GlidewayIconMark({ className = 'w-8 h-8' }: { className?: string }) {
  // Icon-only version: lime green C-shaped emblem with white road
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lime green C-shaped emblem */}
      <path
        d="M 30 12 A 22 22 0 0 1 48 30 L 42 36 A 16 16 0 0 0 32 18 Z"
        fill="#7CFF3A"
      />
      {/* Motion lines on left */}
      <line x1="8" y1="24" x2="26" y2="24" stroke="#7CFF3A" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="35" x2="24" y2="35" stroke="#7CFF3A" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      {/* White curved road */}
      <path
        d="M 28 38 Q 38 30 45 22"
        stroke="#ffffff"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Road dashed center */}
      <path
        d="M 28 38 Q 38 30 45 22"
        stroke="#7CFF3A"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="3,3"
      />
    </svg>
  );
}

export function GlidewayLogoFull({ className = 'w-full' }: { className?: string }) {
  // Full logo with wordmark and tagline
  return (
    <div className={className}>
      <svg
        viewBox="0 0 300 150"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Icon */}
        <g transform="translate(20, 20)">
          {/* Lime green C-shaped emblem */}
          <path
            d="M 25 8 A 20 20 0 0 1 42 25 L 37 30 A 15 15 0 0 0 28 13 Z"
            fill="#7CFF3A"
          />
          {/* Motion lines */}
          <line x1="5" y1="18" x2="20" y2="18" stroke="#7CFF3A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="7" y1="27" x2="19" y2="27" stroke="#7CFF3A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          {/* White road */}
          <path
            d="M 24 32 Q 32 26 38 20"
            stroke="#ffffff"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 24 32 Q 32 26 38 20"
            stroke="#7CFF3A"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2,2"
          />
        </g>

        {/* Wordmark: GLIDE (white) WAY (lime) */}
        <text
          x="70"
          y="55"
          fontFamily="'Arial', 'Helvetica', sans-serif"
          fontSize="42"
          fontWeight="900"
          fill="#ffffff"
          letterSpacing="2"
        >
          GLIDE
        </text>
        <text
          x="250"
          y="55"
          fontFamily="'Arial', 'Helvetica', sans-serif"
          fontSize="42"
          fontWeight="900"
          fill="#7CFF3A"
          letterSpacing="2"
        >
          WAY
        </text>

        {/* Tagline */}
        <line x1="70" y1="75" x2="105" y2="75" stroke="#7CFF3A" strokeWidth="1" />
        <text
          x="120"
          y="80"
          fontFamily="'Arial', sans-serif"
          fontSize="11"
          fontWeight="700"
          fill="#7CFF3A"
          letterSpacing="1"
        >
          RIDE SMOOTHLY, GLIDE EASILY
        </text>
        <line x1="260" y1="75" x2="295" y2="75" stroke="#7CFF3A" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function GlidewayLogoWithText({ className = 'w-full' }: { className?: string }) {
  return (
    <div className={className}>
      <GlidewayLogoFull className="w-full" />
    </div>
  );
}

export function GlidewayLogo({ variant = 'icon', size = 'md', className = '' }: { variant?: 'icon' | 'full'; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  if (variant === 'full') {
    return <GlidewayLogoFull className={className} />;
  }

  return <GlidewayIconMark className={`${sizeClasses[size]} ${className}`} />;
}

export function GlidewayLogoDark({ className = 'w-12 h-12' }: { className?: string }) {
  return <GlidewayIconMark className={className} />;
}
