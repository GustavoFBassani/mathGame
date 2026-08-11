import React from 'react';
import { Clock, DollarSign, Target, Pause, Volume2, VolumeX } from 'lucide-react';

/**
 * HUD: Barra superior com informações de tempo, dinheiro ganho, meta do dia e controles.
 */
export default function HUD({
  currentStage,
  stageConfig,
  timeLeft,
  money,
  isPaused,
  onTogglePause,
  isAudioMuted,
  onToggleMute
}) {
  // Formata o dinheiro para 2 casas decimais brasileiras (R$ 50,00)
  const formatMoney = (val) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Formata o tempo restante (MM:SS)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const isGoalReached = money >= stageConfig.goal;

  return (
    <div className="hud-container w-full max-w-5xl bg-amber-950/90 backdrop-blur border-b-2 border-amber-600/50 shadow-2xl px-4 py-2 flex flex-wrap items-center justify-between text-amber-100 gap-3">
      {/* Informações do Dia Atual */}
      <div className="flex items-center gap-3">
        <div className="bg-amber-800/80 border border-amber-500/50 px-3 py-1 rounded-xl text-center">
          <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
            Expediente
          </div>
          <div className="text-sm font-black text-amber-100">
            Dia {currentStage} ({stageConfig.name})
          </div>
        </div>

        {/* Meta Financeira */}
        <div className="flex items-center gap-1.5 bg-amber-900/60 border border-amber-700/50 px-3 py-1.5 rounded-xl">
          <Target size={16} className="text-amber-400" />
          <span className="text-xs text-amber-300 font-semibold">Meta:</span>
          <span className="text-sm font-black text-white">{formatMoney(stageConfig.goal)}</span>
        </div>
      </div>

      {/* Cronômetro Regressivo */}
      <div className="flex items-center gap-2 bg-stone-900/90 border-2 border-amber-600 px-4 py-1 rounded-2xl shadow-inner">
        <Clock size={20} className={timeLeft <= 15 ? 'text-red-500 animate-bounce' : 'text-amber-400'} />
        <span className={`text-xl font-black font-mono tracking-wider ${timeLeft <= 15 ? 'text-red-400' : 'text-amber-200'}`}>
          {timeFormatted}
        </span>
      </div>

      {/* Saldo de Dinheiro do Dia */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border-2 transition-all ${
          isGoalReached
            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-emerald-900/30'
            : 'bg-amber-900/80 border-amber-600 text-amber-100'
        }`}>
          <DollarSign size={18} className={isGoalReached ? 'text-emerald-400' : 'text-amber-400'} />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-amber-300 font-bold">Ganho Hoje</span>
            <span className="text-lg font-black leading-tight">{formatMoney(money)}</span>
          </div>
        </div>

        {/* Botão de Mutar Som */}
        <button
          onClick={onToggleMute}
          className="p-2 bg-amber-900/60 hover:bg-amber-800 rounded-xl border border-amber-700/50 text-amber-200 transition-all active:scale-95"
          title={isAudioMuted ? "Ativar Som" : "Mutar Som"}
        >
          {isAudioMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Botão de Pausa */}
        <button
          onClick={onTogglePause}
          className="p-2 bg-amber-800 hover:bg-amber-700 rounded-xl border border-amber-500/60 text-white font-bold transition-all active:scale-95 flex items-center gap-1 shadow-md"
        >
          <Pause size={18} />
          <span className="text-xs hidden sm:inline">Pausar</span>
        </button>
      </div>
    </div>
  );
}
