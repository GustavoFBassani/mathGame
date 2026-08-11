import React, { useState } from 'react';

/**
 * PlateBoard: Renderiza o prato e as fatias que foram colocadas nele.
 * Clicar em uma fatia no prato devolve a fatia para a pizza!
 */
export default function PlateBoard({ sliceCount, slices, onPlateClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cx = 140;
  const cy = 140;
  const r = 110;
  const crustWidth = 12;

  const sliceAngle = 360 / sliceCount;
  const toRad = (deg) => (deg * Math.PI) / 180;

  // Conta quantas fatias estão no prato
  const slicesOnPlateCount = slices.filter((s) => s.onplate).length;

  const createSlicePath = (index, radiusOffset = 0) => {
    const startAngle = -90 + index * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    const radStart = toRad(startAngle);
    const radEnd = toRad(endAngle);

    const effectiveR = r + radiusOffset;

    const x1 = cx + effectiveR * Math.cos(radStart);
    const y1 = cy + effectiveR * Math.sin(radStart);
    const x2 = cx + effectiveR * Math.cos(radEnd);
    const y2 = cy + effectiveR * Math.sin(radEnd);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${effectiveR} ${effectiveR} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const renderToppings = (index) => {
    const startAngle = -90 + index * sliceAngle;
    const midAngle = startAngle + sliceAngle / 2;
    const rad = toRad(midAngle);

    const dist1 = r * 0.45;
    const dist2 = r * 0.72;

    const pep1X = cx + dist1 * Math.cos(rad);
    const pep1Y = cy + dist1 * Math.sin(rad);
    const pep2X = cx + dist2 * Math.cos(rad + 0.1);
    const pep2Y = cy + dist2 * Math.sin(rad + 0.1);

    return (
      <g className="toppings" pointerEvents="none">
        <circle cx={pep1X} cy={pep1Y} r={9} fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
        {sliceCount <= 8 && (
          <circle cx={pep2X} cy={pep2Y} r={7.5} fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
        )}
      </g>
    );
  };

  return (
    <div className="plate-board-container relative flex flex-col items-center">
      {/* Prato de Cerâmica (Fundo) */}
      <div className="plate-graphic relative w-[290px] h-[290px] rounded-full flex items-center justify-center">
        <svg viewBox="0 0 280 280" className="w-full h-full drop-shadow-xl overflow-visible">
          <defs>
            {/* Gradiente do Prato */}
            <radialGradient id="plateGrad" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#ffffff" />
              <stop offset="88%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </radialGradient>

            <radialGradient id="plateCrust" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
            <radialGradient id="plateCheese" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>
          </defs>

          {/* Sombra do Prato */}
          <circle cx={cx} cy={cy + 6} r={130} fill="rgba(0,0,0,0.25)" />

          {/* Borda Externa e Interna do Prato */}
          <circle cx={cx} cy={cy} r={130} fill="url(#plateGrad)" stroke="#94a3b8" strokeWidth="3" />
          <circle cx={cx} cy={cy} r={105} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

          {/* Fatias Colocadas no Prato */}
          {slices.map((slice, index) => {
            if (!slice.onplate) return null;

            const isHovered = hoveredIndex === index;
            const startAngle = -90 + index * sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;
            const rad = toRad(midAngle);

            const offsetDist = isHovered ? 8 : 0;
            const offsetX = offsetDist * Math.cos(rad);
            const offsetY = offsetDist * Math.sin(rad);

            return (
              <g
                key={index}
                className="cursor-pointer transition-transform duration-150 ease-out"
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px)`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onPlateClick(index)}
              >
                {/* Massa */}
                <path
                  d={createSlicePath(index, 0)}
                  fill="url(#plateCrust)"
                  stroke="#78350f"
                  strokeWidth="2"
                />

                {/* Queijo */}
                <path
                  d={createSlicePath(index, -crustWidth)}
                  fill="url(#plateCheese)"
                  stroke="#ca8a04"
                  strokeWidth="1"
                />

                {/* Recheios */}
                {renderToppings(index)}
              </g>
            );
          })}
        </svg>

        {/* Badge Informativo da Fração Atual no Prato */}
        <div className="absolute -bottom-3 bg-amber-900 text-amber-100 px-4 py-1 rounded-full text-sm font-bold shadow-md border-2 border-amber-500 flex items-center gap-1">
          <span>Prato:</span>
          <span className="text-amber-300 font-extrabold text-base">
            {slicesOnPlateCount} / {sliceCount}
          </span>
        </div>
      </div>
    </div>
  );
}
