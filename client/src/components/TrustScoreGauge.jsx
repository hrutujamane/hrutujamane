import { useEffect, useRef, useState } from 'react';

const VERDICT_COLORS = {
  safe: '#10b981',
  suspicious: '#f59e0b',
  scam: '#ef4444',
};

/**
 * Trust Meter Gauge.
 * Renders an animated SVG arc speedometer with needle indications.
 */
export default function TrustScoreGauge({ score, verdict }) {
  const [displayScore, setDisplayScore] = useState(0);
  const animRef = useRef(null);

  const color = VERDICT_COLORS[verdict] || '#f59e0b';

  // Smooth ease-out gauge animation on load
  useEffect(() => {
    let start = null;
    const duration = 1200;

    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  // Dimension layouts
  const SIZE = 220;
  const STROKE_WIDTH = 12;
  const R = 86;
  const CENTER = SIZE / 2;
  
  // Circumference trigonometry calculations
  const FULL_CIRCUMFERENCE = 2 * Math.PI * R;
  const ARC_LENGTH = FULL_CIRCUMFERENCE * 0.75;
  const GAP_LENGTH = FULL_CIRCUMFERENCE - ARC_LENGTH;
  const fillLength = (displayScore / 100) * ARC_LENGTH;

  // Align start to 135 deg to center the gap downwards
  const startAngle = 135;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: `rotate(${startAngle}deg)` }}
        className="overflow-visible"
      >
        {/* Glow drop shadow helper */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH + 8}
          strokeDasharray={`${ARC_LENGTH} ${GAP_LENGTH}`}
          strokeLinecap="round"
          className="opacity-5 blur-[12px] transition-all"
        />

        {/* Outer tick guides */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R + 14}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={3}
          strokeDasharray="2 6"
          className="transition-all"
        />

        {/* Background track arc */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${ARC_LENGTH} ${GAP_LENGTH}`}
          strokeLinecap="round"
        />

        {/* Foreground filled arc */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${fillLength} ${FULL_CIRCUMFERENCE - fillLength}`}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color}55)`,
            transition: 'stroke-dasharray 0.05s ease',
          }}
        />

        {/* Dynamic Speedometer Needle Indicator */}
        {(() => {
          const needleLength = 50;
          const needleAngleRad = ((displayScore / 100) * 270 * Math.PI) / 180;
          const targetX = CENTER + needleLength * Math.cos(needleAngleRad);
          const targetY = CENTER + needleLength * Math.sin(needleAngleRad);

          return (
            <g style={{ transformOrigin: `${CENTER}px ${CENTER}px`, transform: `rotate(0deg)` }}>
              <line
                x1={CENTER}
                y1={CENTER}
                x2={targetX}
                y2={targetY}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 3px ${color}aa)`,
                }}
              />
              <circle
                cx={CENTER}
                cy={CENTER}
                r={6}
                fill="#0f0f18"
                stroke={color}
                strokeWidth={3.5}
              />
            </g>
          );
        })()}
      </svg>

      {/* Trust Rating text indicators */}
      <div className="absolute flex flex-col items-center justify-center text-center mt-6">
        <span
          className="text-4xl font-extrabold tracking-tight leading-none"
          style={{ color, textShadow: `0 0 15px ${color}33` }}
        >
          {displayScore}
        </span>
        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-2">
          Trust Score
        </span>
        <span className="text-[9px] font-semibold text-slate-600 mt-1 uppercase tracking-wider">
          out of 100
        </span>
      </div>
    </div>
  );
}
