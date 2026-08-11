import React, { useEffect } from 'react';
import { PartyPopper, RotateCcw, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * VictoryModal: Tela de vitória ao concluir com sucesso os 7 dias da semana!
 */
export default function VictoryModal({ totalMoneyWeek, onRestart }) {
  const formatMoney = (val) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Dispara chuva de confetes ao abrir
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 }
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-amber-100 flex flex-col items-center text-center">
        
        {/* Ícone de Coroa */}
        <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-amber-200 animate-bounce">
          <Crown size={48} className="text-amber-950" />
        </div>

        <h2 className="text-3xl font-black uppercase text-amber-300 tracking-wider mb-1">
          Parabéns!
        </h2>
        <p className="text-emerald-400 font-bold text-base mb-6">
          Você concluiu com sucesso a semana inteira!
        </p>

        <div className="bg-amber-950/80 border-2 border-amber-700/60 rounded-2xl p-4 w-full text-center space-y-2 mb-6">
          <div className="text-xs uppercase tracking-wider text-amber-300 font-bold">
            Faturamento Total da Semana
          </div>
          <div className="text-3xl font-black text-amber-200">
            {formatMoney(totalMoneyWeek)}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:brightness-110 text-white font-black text-lg uppercase tracking-wider rounded-2xl shadow-xl border-2 border-emerald-300 flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <RotateCcw size={22} />
          <span>Jogar Novamente</span>
        </button>
      </div>
    </div>
  );
}
