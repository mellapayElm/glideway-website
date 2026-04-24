'use client';

interface GlidewayLogoProps {
  className?: string;
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg";
}

export function GlidewayLogo({ className = "w-8 h-8", variant = "icon", size = "md" }: GlidewayLogoProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  const displaySize = size ? sizeMap[size] : className;

  if (variant === "full") {
    return (
      <svg viewBox="0 0 400 280" className={`${displaySize} w-auto`} xmlns="http://www.w3.org/2000/svg">
        {/* G Emblem with Motion Lines */}
        <g>
          {/* Motion Lines */}
          <line x1="20" y1="60" x2="70" y2="60" stroke="#7CFF3A" strokeWidth="8" strokeLinecap="round" />
          <line x1="25" y1="95" x2="65" y2="95" stroke="#7CFF3A" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          <line x1="30" y1="125" x2="60" y2="125" stroke="#7CFF3A" strokeWidth="4" strokeLinecap="round" opacity="0.4" />

          {/* G Letter */}
          <path
            d="M 150 50 C 100 50 60 90 60 140 C 60 190 100 230 150 230 C 180 230 205 215 220 195 L 190 170 C 182 182 168 190 150 190 C 115 190 87 162 87 140 C 87 118 115 90 150 90 C 170 90 188 100 200 115 L 200 140 L 130 140 L 130 170 L 230 170 L 230 115 C 215 75 185 50 150 50 Z"
            fill="#7CFF3A"
          />

          {/* White Road */}
          <path d="M 230 105 Q 290 70 340 40" stroke="white" strokeWidth="14" strokeLinecap="round" fill="none" />

          {/* Road Dashed Center Line */}
          <path
            d="M 230 105 Q 290 70 340 40"
            stroke="#7CFF3A"
            strokeWidth="2"
            strokeDasharray="6,6"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* GLIDE in white, WAY in lime */}
        <text x="20" y="270" fontSize="72" fontWeight="bold" fill="white" fontFamily="'Arial', sans-serif">
          GLIDE
        </text>
        <text x="280" y="270" fontSize="72" fontWeight="bold" fill="#7CFF3A" fontFamily="'Arial', sans-serif">
          WAY
        </text>

        {/* Tagline */}
        <text x="20" y="295" fontSize="14" fill="#7CFF3A" fontFamily="'Arial', sans-serif" letterSpacing="1" fontWeight="600">
          RIDE SMOOTHLY, GLIDE EASILY
        </text>
      </svg>
    );
  }

  // Icon variant (default)
  return (
    <svg viewBox="0 0 120 120" className={displaySize} xmlns="http://www.w3.org/2000/svg">
      {/* Motion Lines */}
      <line x1="8" y1="45" x2="38" y2="45" stroke="#7CFF3A" strokeWidth="5" strokeLinecap="round" />
      <line x1="12" y1="65" x2="34" y2="65" stroke="#7CFF3A" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <line x1="16" y1="82" x2="30" y2="82" stroke="#7CFF3A" strokeWidth="3" strokeLinecap="round" opacity="0.4" />

      {/* G Letter */}
      <path
        d="M 65 18 C 40 18 22 36 22 60 C 22 84 40 102 65 102 C 80 102 93 93 100 80 L 82 70 C 77 78 72 83 65 83 C 48 83 35 70 35 60 C 35 50 48 38 65 38 C 75 38 84 43 90 51 L 90 60 L 50 60 L 50 75 L 105 75 L 105 51 C 96 28 82 18 65 18 Z"
        fill="#7CFF3A"
      />

      {/* White Road */}
      <path d="M 100 48 Q 135 25 155 10" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* Road Dashed Center Line */}
      <path
        d="M 100 48 Q 135 25 155 10"
        stroke="#7CFF3A"
        strokeWidth="1.5"
        strokeDasharray="3,3"
        fill="none"
      />
    </svg>
  );
}

// Legacy exports for compatibility
export function GlidewayIconMark({ className = "w-8 h-8" }: { className?: string }) {
  return <GlidewayLogo className={className} variant="icon" />;
}

export function GlidewayLogoDark({ className = "w-12 h-12" }: { className?: string }) {
  return <GlidewayLogo className={className} variant="icon" />;
}

export function GlidewayLogoWithText({ className = "w-8" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <GlidewayLogo className={className} variant="full" />
    </div>
  );
}
