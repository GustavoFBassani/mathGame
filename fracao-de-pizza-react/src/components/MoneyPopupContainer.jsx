import React from 'react';

/**
 * MoneyPopupContainer: Exibe mensagens flutuantes temporárias de dinheiro ganho/perdido.
 */
export default function MoneyPopupContainer({ popups }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {popups.map((popup) => (
        <div
          key={popup.id}
          className={`absolute font-black text-xl px-3 py-1 rounded-full shadow-2xl animate-float-up transition-all ${
            popup.isPositive
              ? 'bg-emerald-600 text-white border-2 border-emerald-300'
              : 'bg-red-600 text-white border-2 border-red-300'
          }`}
          style={{ left: `${popup.x}%`, top: `${popup.y}%` }}
        >
          {popup.isPositive ? '+' : ''}
          {popup.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      ))}
    </div>
  );
}
