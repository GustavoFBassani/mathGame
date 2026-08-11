import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

/**
 * ServeButton: Botão para validar a fração que está montada no prato e entregar o pedido!
 */
export default function ServeButton({ onServe, disabled, slicesOnPlate }) {
  return (
    <button
      onClick={onServe}
      disabled={disabled || slicesOnPlate === 0}
      className={`relative px-8 py-3 rounded-2xl font-black text-lg shadow-xl uppercase tracking-wider flex items-center gap-2 border-2 transition-all transform active:scale-95 ${
        slicesOnPlate > 0 && !disabled
          ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white border-emerald-300 shadow-emerald-900/40 hover:brightness-110 hover:scale-105 animate-pulse'
          : 'bg-stone-700 text-stone-400 border-stone-600 cursor-not-allowed opacity-60'
      }`}
    >
      <UtensilsCrossed size={22} />
      <span>Servir Prato ({slicesOnPlate})</span>
    </button>
  );
}
