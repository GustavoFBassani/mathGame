import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

/**
 * PauseMenu: Menu suspenso durante a pausa da partida.
 */
export default function PauseMenu({ onResume, onRestartDay, isMuted, onToggleMute }) {
  return (
    <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-amber-950 border-4 border-amber-500 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-amber-100 flex flex-col items-center text-center">
        
        <h2 className="text-2xl font-black uppercase text-amber-300 tracking-wider mb-6">
          Jogo Pausado
        </h2>

        <div className="flex flex-col gap-3 w-full">
          {/* Continuar */}
          <button
            onClick={onResume}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl border border-emerald-400 flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
          >
            <Play size={18} fill="currentColor" />
            <span>Continuar Expediente</span>
          </button>

          {/* Reiniciar Dia */}
          <button
            onClick={onRestartDay}
            className="w-full py-3 bg-amber-800 hover:bg-amber-700 text-amber-100 font-bold rounded-xl border border-amber-600 flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
          >
            <RotateCcw size={18} />
            <span>Reiniciar este Dia</span>
          </button>

          {/* Som */}
          <button
            onClick={onToggleMute}
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-xl border border-stone-600 flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{isMuted ? 'Ativar Som' : 'Desativar Som'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
