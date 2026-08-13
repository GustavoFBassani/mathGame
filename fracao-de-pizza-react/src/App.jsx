import React from 'react';
import { useGameState } from './hooks/useGameState';
import HUD from './components/HUD';
import OrderQueue from './components/OrderQueue';
import PizzaBoard from './components/PizzaBoard';
import PlateBoard from './components/PlateBoard';
import SliceSelector from './components/SliceSelector';
import ServeButton from './components/ServeButton';
import MoneyPopupContainer from './components/MoneyPopupContainer';
import StartMenu from './components/StartMenu';
import PauseMenu from './components/PauseMenu';
import DaySummaryModal from './components/DaySummaryModal';
import GameOverModal from './components/GameOverModal';
import VictoryModal from './components/VictoryModal';

export default function App() {
  const {
    gameStatus,
    currentStage,
    stageConfig,
    timeLeft,
    money,
    totalMoneyWeek,
    sliceCount,
    slices,
    cutEffect,
    orders,
    popups,
    isAudioMuted,
    startGame,
    restartStage,
    nextStage,
    togglePause,
    toggleMute,
    changeSliceCount,
    handleSliceClick,
    handlePlateClick,
    handleServe
  } = useGameState();

  const slicesOnPlateCount = slices.filter((s) => s.onplate).length;

  return (
    <div className="w-screen min-h-screen pizzeria-table-bg flex flex-col items-center justify-between select-none relative overflow-x-hidden font-sans">
      {/* Container de Popups Flutuantes de Dinheiro */}
      <MoneyPopupContainer popups={popups} />

      {/* Barra de HUD Superior */}
      <HUD
        currentStage={currentStage}
        stageConfig={stageConfig}
        timeLeft={timeLeft}
        money={money}
        isPaused={gameStatus === 'PAUSED'}
        onTogglePause={togglePause}
        isAudioMuted={isAudioMuted}
        onToggleMute={toggleMute}
      />

      {/* Fila de Pedidos pendentes dos Clientes */}
      <OrderQueue orders={orders} />

      {/* Área Principal de Montagem (Mesa da Pizzaria) */}
      <main className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row items-center justify-around gap-6 p-4 my-2 relative z-10">
        
        {/* Lado Esquerdo: Pizza na Tábua + Seletor de Cortes */}
        <div className="flex flex-col items-center gap-4">
          <PizzaBoard
            sliceCount={sliceCount}
            slices={slices}
            onSliceClick={handleSliceClick}
            cutEffect={cutEffect}
          />

          <SliceSelector
            currentCount={sliceCount}
            onSelectCount={changeSliceCount}
          />
        </div>

        {/* Lado Direito: Prato de Cerâmica + Botão Servir */}
        <div className="flex flex-col items-center gap-6">
          <PlateBoard
            sliceCount={sliceCount}
            slices={slices}
            onPlateClick={handlePlateClick}
          />

          <ServeButton
            onServe={handleServe}
            slicesOnPlate={slicesOnPlateCount}
            disabled={gameStatus !== 'PLAYING'}
          />
        </div>
      </main>

      {/* Rodapé Informativo */}
      <footer className="w-full text-center py-2 text-[11px] text-amber-200/50 bg-stone-950/80 border-t border-stone-800">
        Fração de Pizza — Recriado em React + JavaScript — Baseado no jogo original IFRS
      </footer>

      {/* --- MODAIS DE TELA --- */}
      {gameStatus === 'START' && (
        <StartMenu onStartGame={startGame} />
      )}

      {gameStatus === 'PAUSED' && (
        <PauseMenu
          onResume={togglePause}
          onRestartDay={restartStage}
          onRestartGame={startGame}
          isMuted={isAudioMuted}
          onToggleMute={toggleMute}
        />
      )}

      {gameStatus === 'DAY_SUMMARY' && (
        <DaySummaryModal
          currentStage={currentStage}
          stageConfig={stageConfig}
          dayMoney={money}
          totalMoneyWeek={totalMoneyWeek}
          onNextStage={nextStage}
        />
      )}

      {gameStatus === 'GAME_OVER' && (
        <GameOverModal
          dayMoney={money}
          goalMoney={stageConfig.goal}
          onRestart={startGame}
        />
      )}

      {gameStatus === 'VICTORY' && (
        <VictoryModal
          totalMoneyWeek={totalMoneyWeek}
          onRestart={startGame}
        />
      )}
    </div>
  );
}
