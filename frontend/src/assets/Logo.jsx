import React from 'react';

export default function Logo({ className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 48 48"
      role="img"
      aria-label="NebulaBoard"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="#7c5cff" />
          <stop offset="1" stopColor="#00d4ff" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#g)" />
      <g fill="#fff">
        <rect x="12" y="14" width="8" height="20" rx="3" opacity="0.9" />
        <rect x="22" y="22" width="8" height="12" rx="3" opacity="0.9" />
        <rect x="32" y="18" width="4" height="16" rx="2" opacity="0.9" />
      </g>
    </svg>
  );
}
