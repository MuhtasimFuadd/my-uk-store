export default function BottlePlaceholder({
  color = "#C79A44"
}: {
  color?: string | null;
}) {
  const liquid = color || "#C79A44";
  return (
    <svg
      viewBox="0 0 200 260"
      className="h-full w-full"
      role="img"
      aria-label="Perfume bottle"
    >
      <defs>
        <linearGradient id={`glass-${liquid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A241C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0E0B08" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="200" height="260" fill="#171310" />
      {/* stopper */}
      <rect x="88" y="18" width="24" height="26" rx="3" fill="#C79A44" />
      {/* neck */}
      <rect x="92" y="42" width="16" height="24" fill={`url(#glass-${liquid})`} />
      {/* bottle body */}
      <path
        d="M70 66 H130 L142 96 V206 Q142 220 128 220 H72 Q58 220 58 206 V96 Z"
        fill={`url(#glass-${liquid})`}
        stroke="#3A3227"
        strokeWidth="1.5"
      />
      {/* liquid fill */}
      <path
        d="M62 150 H138 V206 Q138 216 128 216 H72 Q62 216 62 206 Z"
        fill={liquid}
        opacity="0.55"
      />
      {/* label */}
      <rect x="72" y="150" width="56" height="30" rx="2" fill="#F3ECE0" opacity="0.08" />
      <line x1="80" y1="160" x2="120" y2="160" stroke="#F3ECE0" strokeWidth="1" opacity="0.35" />
      <line x1="80" y1="167" x2="112" y2="167" stroke="#F3ECE0" strokeWidth="1" opacity="0.25" />
    </svg>
  );
}
