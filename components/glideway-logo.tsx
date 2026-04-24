'use client';

import Image from 'next/image';

// Logo matching the screenshot: rounded green square with bold "G" inside + wordmark
export function GlidewayIconMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="40" height="40" rx="9" fill="#22C55E" />
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="'Geist', 'Arial', sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="#0a0a0a"
      >
        G
      </text>
    </svg>
  );
}

// Legacy exports kept so existing imports don't break
export function GlidewayLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return <GlidewayIconMark className={className} />;
}

export function GlidewayLogoDark({ className = 'w-12 h-12' }: { className?: string }) {
  return <GlidewayIconMark className={className} />;
}

export function GlidewayLogoWithText({ className = 'w-8' }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="GlideWay Logo" className="h-10 w-auto object-contain" />
    </div>
  );
}
