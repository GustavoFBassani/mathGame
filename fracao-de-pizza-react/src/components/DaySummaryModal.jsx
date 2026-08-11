import React from 'react';
import { ArrowRight, Trophy, DollarSign, Calendar } from 'lucide-react';

/**
 * DaySummaryModal: Exibido ao concluir um dia com sucesso (Meta atingida).
 */
export default function DaySummaryModal({
  currentStage,
  stageConfig,
  dayMoney,
  totalMoneyWeek,
  onNextStage
}) {
  const formatMoney = (val) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-500 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-amber-100 flex flex-col items-center text-center">
        
        {/* Ícone de Troféu */}
        <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-amber-300 animate-bounce">
          <Trophy size={36} className="text-amber-950" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black uppercase text-amber-300 tracking-wider mb-1">
          Dia Concluído!
        </h2>
        <p className="text-emerald-400 font-bold text-sm mb-6 flex items-center gap-1">
          ✓ Meta atingida com sucesso!
        </p>

        {/* Quadro de Resumo Financeiro */}
        <div className="bg-amber-950/80 border-2 border-amber-700/60 rounded-2xl p-4 w-full text-left space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm border-b border-amber-800/60 pb-2">
            <span className="text-amber-300 font-medium flex items-center gap-1.5">
              <Calendar size={16} /> Expediente:
            </span>
            <span className="font-bold">{stageConfig.name} (Dia {currentStage})</span>
          </div>

          <div className="flex justify-between items-center text-sm border-b border-amber-800/60 pb-2">
            <span className="text-amber-300 font-medium flex items-center gap-1.5">
              <DollarSign size={16} /> Total do Dia:
            </span>
            <span className="font-black text-emerald-400 text-base">{formatMoney(dayMoney)}</span>
          </div>

          <div className="flex justify-between items-center text-sm border-b border-amber-800/60 pb-2">
            <span className="text-amber-300 font-medium">Meta Exigida:</span>
            <span className="font-bold text-amber-100">{formatMoney(stageConfig.goal)}</span>
          </div>

          <div className="flex justify-between items-center text-sm pt-1">
            <span className="text-amber-200 font-bold">Acumulado da Semana:</span>
            <span className="font-black text-amber-300 text-lg">{formatMoney(totalMoneyWeek)}</span>
          </div>
        </div>

        {/* Botão Próximo Dia */}
        <button
          onClick={onNextStage}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:brightness-110 text-white font-black text-lg uppercase tracking-wider rounded-2xl shadow-xl border-2 border-emerald-300 flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <span>Próximo Dia</span>
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
}
