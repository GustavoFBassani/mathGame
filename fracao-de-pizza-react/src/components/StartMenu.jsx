import React from 'react';
import { Play, Pizza, BookOpen, CheckCircle2 } from 'lucide-react';

/**
 * StartMenu: Tela inicial de boas-vindas da Pizzaria com instruções claras.
 */
export default function StartMenu({ onStartGame }) {
  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-500 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl text-amber-100 flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Ícone de Pizza Decorativo */}
        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-amber-300 transform hover:rotate-12 transition-transform">
          <Pizza size={48} className="text-amber-950" />
        </div>

        {/* Título do Jogo */}
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-amber-300 tracking-wider mb-1 drop-shadow-md">
          Fração de Pizza
        </h1>
        <p className="text-amber-200/80 text-sm italic mb-6">
          Pizzaria Educativa de Matemática
        </p>

        {/* Quadro de Instruções */}
        <div className="bg-amber-950/80 border-2 border-amber-700/60 rounded-2xl p-4 w-full text-left mb-6 space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm mb-1">
            <BookOpen size={16} />
            <span>Como Jogar:</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>Os clientes farão pedidos representando frações (ex: 1/2, 3/4, 2/5).</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>Escolha em quantas fatias cortar a pizza (de 2 a 9 partes iguais).</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>Clique nas fatias para montá-las no prato e clique em <b>Servir</b> antes que o tempo acabe!</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>Alcance a <b>Meta de Dinheiro</b> de cada dia para avançar na semana de trabalho.</span>
          </div>
        </div>

        {/* Botão de Iniciar Expediente */}
        <button
          onClick={onStartGame}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:brightness-110 text-white font-black text-xl uppercase tracking-wider rounded-2xl shadow-xl border-2 border-emerald-300 flex items-center justify-center gap-3 transition-transform active:scale-95 animate-bounce-in"
        >
          <Play size={24} fill="currentColor" />
          <span>Abrir Pizzaria (Iniciar)</span>
        </button>
      </div>
    </div>
  );
}
