import React from 'react';
import { Clock } from 'lucide-react';

/**
 * OrderQueue: Exibe os bilhetes/comandas dos clientes pendentes (até 4).
 */
export default function OrderQueue({ orders }) {
  return (
    <div className="order-queue-container w-full max-w-4xl px-4 py-2">
      {/* Varão de metal do suporte de comandas */}
      <div className="w-full h-3 bg-gradient-to-r from-stone-800 via-stone-600 to-stone-800 rounded-full shadow-inner border border-stone-900 mb-[-6px] relative z-10 flex justify-around px-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-4 h-5 bg-stone-400 rounded-sm border border-stone-700 shadow-md transform -translate-y-1" />
        ))}
      </div>

      {/* Grid com os 4 slots de pedidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-0">
        {[0, 1, 2, 3].map((slotIndex) => {
          const order = orders.find((o) => o.slot === slotIndex);

          if (!order) {
            return (
              <div
                key={slotIndex}
                className="h-28 rounded-b-xl border-2 border-dashed border-amber-900/30 bg-amber-950/20 flex flex-col items-center justify-center text-amber-900/40 text-xs font-semibold"
              >
                Aguardando pedido...
              </div>
            );
          }

          const progress = Math.max(0, (order.tempo_restante / order.tempo_total) * 100);
          
          // Define a cor da barra de tempo
          let timerColor = 'bg-emerald-500';
          if (progress < 50 && progress >= 25) timerColor = 'bg-amber-500';
          if (progress < 25) timerColor = 'bg-red-500 animate-pulse';

          return (
            <div
              key={order.id}
              className={`h-28 rounded-b-xl bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-400 shadow-xl p-2 flex flex-col justify-between relative transform transition-all duration-300 animate-bounce-in ${
                order.flash ? 'ring-4 ring-emerald-400 scale-105' : ''
              }`}
            >
              {/* Clipe da comanda */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-4 bg-amber-800 rounded-t border border-amber-950 shadow-sm" />

              {/* Título do Pedido */}
              <div className="flex items-center justify-between text-amber-900 text-[10px] font-bold uppercase border-b border-amber-300 pb-1">
                <span>Mesa #{order.id.slice(-2)}</span>
                <div className="flex items-center gap-1 text-amber-800">
                  <Clock size={10} />
                  <span>{Math.ceil(order.tempo_restante)}s</span>
                </div>
              </div>

              {/* Fração Solicitada */}
              <div className="flex flex-col items-center justify-center my-1">
                <div className="text-2xl font-black text-amber-950 leading-none">
                  {order.numerador}
                </div>
                <div className="w-8 h-0.5 bg-amber-950 my-0.5 rounded" />
                <div className="text-2xl font-black text-amber-950 leading-none">
                  {order.denominador}
                </div>
              </div>

              {/* Barra de Tempo Limitado */}
              <div className="w-full bg-amber-300/80 rounded-full h-2 overflow-hidden border border-amber-400">
                <div
                  className={`h-full transition-all duration-200 ease-linear ${timerColor}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
