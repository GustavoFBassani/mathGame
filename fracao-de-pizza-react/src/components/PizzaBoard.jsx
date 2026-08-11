import React, { useState } from 'react';

/**
 * Componente PizzaBoard
 * 
 * Responsável por desenhar a pizza vetorial SVG e lidar com a interação de fatiamento e seleção.
 * 
 * Funcionamento da Geometria Radial SVG:
 * - A pizza é centralizada em (cx, cy) = (160, 160) com raio R = 135px.
 * - Cada fatia é um arco circular SVG de ângulo = (360 / sliceCount).
 * - O topo da pizza inicia em -90 graus (12 horas).
 * - Ao passar o mouse sobre uma fatia, ela é levemente transladada na direção do seu ângulo mediano (hover offset).
 * - Ao clicar numa fatia, a função `onSliceClick(index)` transfere a fatia para o prato.
 * 
 * @param {object} props
 * @param {number} props.sliceCount Número total de fatias (2 a 9)
 * @param {Array<{visible: boolean, onplate: boolean}>} props.slices Array com o estado de cada fatia
 * @param {Function} props.onSliceClick Callback ao clicar em uma fatia
 * @param {boolean} props.cutEffect Aciona a animação de escala quando o corte muda
 */
export default function PizzaBoard({ sliceCount, slices, onSliceClick, cutEffect }) {
  // Estado local para destacar a fatia sob o cursor do mouse
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Parâmetros geométricos da Pizza em SVG
  const cx = 160;
  const cy = 160;
  const r = 135;
  const crustWidth = 14; // Largura da borda recheada

  // Ângulo de abertura de cada fatia em graus
  const sliceAngle = 360 / sliceCount;

  /**
   * Converte graus para radianos.
   * @param {number} deg 
   * @returns {number} radianos
   */
  const toRad = (deg) => (deg * Math.PI) / 180;

  /**
   * Constrói a string do caminho vetorial SVG (`path d`) de uma fatia radial.
   * 
   * @param {number} index Índice da fatia (0 a sliceCount - 1)
   * @param {number} radiusOffset Ajuste no raio (ex: negativo para desenhar o queijo sem a borda)
   * @returns {string} Comando 'd' do elemento <path> SVG
   */
  const createSlicePath = (index, radiusOffset = 0) => {
    // Alinha a primeira fatia verticalmente (-90 graus = 12h)
    const startAngle = -90 + index * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    const radStart = toRad(startAngle);
    const radEnd = toRad(endAngle);

    const effectiveR = r + radiusOffset;

    // Coordenadas dos pontos extremos do arco
    const x1 = cx + effectiveR * Math.cos(radStart);
    const y1 = cy + effectiveR * Math.sin(radStart);
    const x2 = cx + effectiveR * Math.cos(radEnd);
    const y2 = cy + effectiveR * Math.sin(radEnd);

    // Flag para arcos maiores que 180 graus (necessário para sliceCount == 2)
    const largeArc = sliceAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${effectiveR} ${effectiveR} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  /**
   * Renderiza os recheios vetoriais (Calabresas e Manjericão) posicionados radialmente na fatia.
   * 
   * @param {number} index Índice da fatia
   */
  const renderToppings = (index) => {
    const startAngle = -90 + index * sliceAngle;
    const midAngle = startAngle + sliceAngle / 2;
    const rad = toRad(midAngle);

    // Posiciona duas rodelas de calabresa em distâncias radiais distintas
    const dist1 = r * 0.45;
    const dist2 = r * 0.72;

    const pep1X = cx + dist1 * Math.cos(rad);
    const pep1Y = cy + dist1 * Math.sin(rad);

    const pep2X = cx + dist2 * Math.cos(rad + 0.1);
    const pep2Y = cy + dist2 * Math.sin(rad + 0.1);

    const basilX = cx + (r * 0.6) * Math.cos(rad - 0.2);
    const basilY = cy + (r * 0.6) * Math.sin(rad - 0.2);

    return (
      <g className="toppings" pointerEvents="none">
        {/* Calabresa Principal */}
        <circle cx={pep1X} cy={pep1Y} r={11} fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2" />
        <circle cx={pep1X - 2} cy={pep1Y - 2} r={3} fill="#dc2626" opacity="0.6" />

        {/* Segunda Calabresa (desenhada se a fatia não for muito fina) */}
        {sliceCount <= 8 && (
          <>
            <circle cx={pep2X} cy={pep2Y} r={9} fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
            <circle cx={pep2X - 2} cy={pep2Y - 2} r={2.5} fill="#dc2626" opacity="0.6" />
          </>
        )}

        {/* Folha de Manjericão */}
        <ellipse cx={basilX} cy={basilY} rx={5} ry={2.5} fill="#15803d" transform={`rotate(${midAngle}, ${basilX}, ${basilY})`} />
      </g>
    );
  };

  return (
    <div className="pizza-board-container relative flex flex-col items-center">
      {/* Tábua Circular de Madeira */}
      <div className={`pizza-board-wood relative w-[360px] h-[360px] rounded-full p-4 flex items-center justify-center transition-transform duration-200 ${cutEffect ? 'scale-105 shadow-xl' : 'scale-100'}`}>
        
        <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            {/* Gradiente da Borda Recheada de Massa */}
            <radialGradient id="crustGrad" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="92%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>

            {/* Gradiente do Queijo Derretido */}
            <radialGradient id="cheeseGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#fde047" />
              <stop offset="88%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>
          </defs>

          {/* Sombra de Projeção da Pizza */}
          <circle cx={cx} cy={cy + 8} r={r + 4} fill="rgba(0,0,0,0.3)" />

          {/* Loop de Renderização das Fatias na Pizza */}
          {slices.map((slice, index) => {
            // Se a fatia já foi enviada ao prato (visible === false), ela fica oculta na pizza
            if (!slice.visible) return null;

            const isHovered = hoveredIndex === index;
            const startAngle = -90 + index * sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;
            const rad = toRad(midAngle);

            // Deslocamento da fatia na direção radial ao passar o mouse (Hover Offset)
            const offsetDist = isHovered ? 12 : 0;
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
                onClick={() => onSliceClick(index)}
              >
                {/* Arco da Massa Externa */}
                <path
                  d={createSlicePath(index, 0)}
                  fill="url(#crustGrad)"
                  stroke="#78350f"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Arco do Recheio / Queijo */}
                <path
                  d={createSlicePath(index, -crustWidth)}
                  fill="url(#cheeseGrad)"
                  stroke="#ca8a04"
                  strokeWidth="1"
                />

                {/* Toppings (Calabresa e Temperos) */}
                {renderToppings(index)}

                {/* Linha de Divisão do Corte */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx + r * Math.cos(toRad(startAngle))}
                  y2={cy + r * Math.sin(toRad(startAngle))}
                  stroke="#78350f"
                  strokeWidth="2.5"
                  opacity="0.7"
                />
              </g>
            );
          })}
        </svg>

        {/* Mensagem quando todas as fatias tiverem sido movidas ao prato */}
        {slices.every((s) => !s.visible) && (
          <div className="absolute inset-0 flex items-center justify-center text-amber-950/60 font-bold italic text-sm pointer-events-none">
            Pizza totalmente servida!
          </div>
        )}
      </div>
    </div>
  );
}
