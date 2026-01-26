import React from "react";

const AviraLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 220"
    fill="currentColor"
    className={className}
    role="img"
    aria-label="AVIRA logo"
  >
    {/* House-shaped A */}
    <g transform="translate(26,24)">
      <polygon points="70,4 4,96 136,96" />
      <rect x="8" y="96" width="28" height="80" rx="6" ry="6" />
      <rect x="100" y="96" width="28" height="80" rx="6" ry="6" />
      <rect x="100" y="96" width="18" height="46" fill="white" />
      <g transform="translate(42,56)" fill="white">
        <rect x="0" y="0" width="18" height="18" rx="3" />
        <rect x="22" y="0" width="18" height="18" rx="3" />
        <rect x="0" y="22" width="18" height="18" rx="3" />
        <rect x="22" y="22" width="18" height="18" rx="3" />
      </g>
      <rect x="36" y="96" width="64" height="20" rx="4" ry="4" />
    </g>

    {/* Wordmark */}
    <text
      x="180"
      y="150"
      fontFamily="Poppins, Montserrat, Arial, sans-serif"
      fontWeight="700"
      fontSize="116"
      letterSpacing="4"
    >
      VIRA
    </text>
  </svg>
);

export default AviraLogo;
