import React from 'react';
import { Scissors } from 'lucide-react';

/**
 * SliceSelector: Permite alterar a quantidade de divisões da pizza (2 a 9 fatias).
 */
export default function SliceSelector({ currentCount, onSelectCount }) {
  const options = [2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="slice-selector-container bg-amber-950/80 backdrop-blur border-2 border-amber-600/60 rounded-2xl p-3 shadow-lg flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-amber-200 text-xs uppercase tracking-wider font-bold">
        <Scissors size={16} className="text-amber-400" />
        <span>Cortar Pizza em:</span>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-[340px]">
        {options.map((num) => {
          const isSelected = currentCount === num;
          return (
            <button
              key={num}
              onClick={() => onSelectCount(num)}
              className={`w-10 h-10 rounded-xl font-black text-base flex items-center justify-center transition-all transform active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-t from-amber-600 to-amber-400 text-amber-950 shadow-lg shadow-amber-500/40 ring-2 ring-amber-200 scale-105'
                  : 'bg-amber-900/90 text-amber-100 hover:bg-amber-800 hover:text-white border border-amber-700/50'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
