import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

/**
 * GameOverModal: Tela de derrota quando o jogador não atinge a meta do dia.
 */
export default function GameOverModal({ dayMoney, goalMoney, onRestart }) {
  const formatMoney = (val) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-b from-red-950 via-amber-950 to-stone-950 border-4 border-red-600 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-amber-100 flex flex-col items-center text-center">
        
        {/* Ícone de Alerta */}
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-red-300 animate-pulse">
          <AlertTriangle size={36} className="text-white" />
        </div>

        <h2 className="text-3xl font-black uppercase text-red-400 tracking-wider mb-1">
          Fim de Jogo!
        </h2>
        <p className="text-amber-200/80 text-sm mb-6">
          Você não atingiu a meta financeira do dia.
        </p>

        <div className="bg-red-950/60 border-2 border-red-800/80 rounded-2xl p-4 w-full text-left space-y-2 mb-6 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-red-200">Arrecadado Hoje:</span>
            <span className="font-bold text-red-400">{formatMoney(dayMoney)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-200">Meta Necessária:</span>
            <span className="font-bold text-amber-200">{formatMoney(goalMoney)}</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 text-white font-black text-lg uppercase tracking-wider rounded-2xl shadow-xl border-2 border-amber-300 flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <RotateCcw size={22} />
          <span>Tentar Novamente</span>
        </button>
      </div>
    </div>
  );
}
