/**
 * Custom Hook: useGameState
 * 
 * Este hook gerencia todo o estado central e a máquina de estados do jogo "Fração de Pizza".
 * 
 * Responsabilidades:
 * 1. Controlar o status global do jogo ('START', 'PLAYING', 'PAUSED', 'DAY_SUMMARY', 'GAME_OVER', 'VICTORY').
 * 2. Gerenciar a contagem do tempo do dia (relógio regressivo de 60s).
 * 3. Gerenciar o saldo financeiro do dia atual e o faturamento total acumulado da semana.
 * 4. Gerenciar as fatias da pizza na tábua e no prato de cerâmica.
 * 5. Controlar o spawn automático de comandas de pedidos (até 4 simultâneas) e sua expiração.
 * 6. Validar a entrega dos pedidos (Servir) aplicando bônus por rapidez ou penalidades por erro.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { STAGE_STATES } from '../data/stages';
import { areFractionsEqual, calculateOrderReward } from '../utils/math';
import {
  playCutSound,
  playSliceMoveSound,
  playSuccessSound,
  playErrorSound,
  playCoinSound,
  playTickSound,
  isMuted as checkIsMuted,
  setMuted as setAudioMuted
} from '../utils/audio';
import confetti from 'canvas-confetti';

export function useGameState() {
  // Estado da Máquina de Telas
  const [gameStatus, setGameStatus] = useState('START'); // 'START' | 'PLAYING' | 'PAUSED' | 'DAY_SUMMARY' | 'GAME_OVER' | 'VICTORY'
  
  // Estágio atual (1 a 7, representando de Segunda a Domingo)
  const [currentStage, setCurrentStage] = useState(1);
  
  // Cronômetro do expediente (segundos restantes)
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Saldo de dinheiro ganho no dia atual (R$)
  const [money, setMoney] = useState(0.0);
  
  // Faturamento total acumulado nos dias concluídos da semana (R$)
  const [totalMoneyWeek, setTotalMoneyWeek] = useState(0.0);

  // Número de divisões atuais da pizza (2 a 9 fatias)
  const [sliceCount, setSliceCount] = useState(4);
  
  // Array com o estado individual de cada fatia { visible: boolean (na pizza), onplate: boolean (no prato) }
  const [slices, setSlices] = useState(() =>
    Array.from({ length: 4 }, () => ({ visible: true, onplate: false }))
  );
  
  // Efeito animado de pulso ao cortar a pizza
  const [cutEffect, setCutEffect] = useState(false);

  // Lista de comandas de pedidos ativas no momento (máximo 4)
  const [orders, setOrders] = useState([]);

  // Popups flutuantes de dinheiro (+R$ 15,50 em verde / -R$ 3,00 em vermelho)
  const [popups, setPopups] = useState([]);

  // Estado de áudio mutado
  const [isAudioMuted, setIsAudioMuted] = useState(checkIsMuted());

  // Configuração do dia atual extraída de STAGE_STATES
  const stageConfig = STAGE_STATES[currentStage - 1];

  // Ref mutável para evitar "stale closures" dentro dos callbacks dos timers (setInterval)
  const stateRef = useRef({
    gameStatus,
    currentStage,
    timeLeft,
    orders,
    money,
    sliceCount,
    slices,
    stageConfig,
    totalMoneyWeek
  });

  // Atualiza a referência sempre que algum estado relevante muda
  useEffect(() => {
    stateRef.current = {
      gameStatus,
      currentStage,
      timeLeft,
      orders,
      money,
      sliceCount,
      slices,
      stageConfig,
      totalMoneyWeek
    };
  }, [gameStatus, currentStage, timeLeft, orders, money, sliceCount, slices, stageConfig, totalMoneyWeek]);

  /**
   * Reseta todas as fatias para a posição original (todas na pizza, nenhuma no prato).
   */
  const resetPizzaSlices = useCallback((count = sliceCount) => {
    setSlices(Array.from({ length: count }, () => ({ visible: true, onplate: false })));
  }, [sliceCount]);

  /**
   * Altera a quantidade de divisões da pizza (de 2 a 9 partes iguais).
   * Reseta o prato, toca o som de corte e aciona a animação de pulso.
   */
  const changeSliceCount = useCallback((newCount) => {
    setSliceCount(newCount);
    setSlices(Array.from({ length: newCount }, () => ({ visible: true, onplate: false })));
    setCutEffect(true);
    playCutSound();
    setTimeout(() => setCutEffect(false), 300);
  }, []);

  /**
   * Transfere uma fatia da pizza para o prato ao ser clicada.
   */
  const handleSliceClick = useCallback((index) => {
    setSlices((prev) => {
      const next = [...prev];
      if (next[index] && next[index].visible) {
        next[index] = { visible: false, onplate: true };
        playSliceMoveSound(true);
      }
      return next;
    });
  }, []);

  /**
   * Devolve uma fatia do prato de volta para a pizza ao ser clicada.
   */
  const handlePlateClick = useCallback((index) => {
    setSlices((prev) => {
      const next = [...prev];
      if (next[index] && next[index].onplate) {
        next[index] = { visible: true, onplate: false };
        playSliceMoveSound(false);
      }
      return next;
    });
  }, []);

  /**
   * Dispara um popup de notificação flutuante na tela para ganhos ou perdas financeiras.
   */
  const addMoneyPopup = useCallback((amount, isPositive) => {
    const newPopup = {
      id: Date.now() + Math.random(),
      amount,
      isPositive,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 10
    };
    setPopups((prev) => [...prev, newPopup]);
    
    // Remove o popup após 1.2 segundos (tempo da animação CSS)
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== newPopup.id));
    }, 1200);
  }, []);

  /**
   * Ação do Botão "Servir Prato":
   * 1. Conta fatias no prato.
   * 2. Compara com os pedidos ativos via multiplicação cruzada (areFractionsEqual).
   * 3. Se houver correspondência: entrega para o pedido mais urgente, credita dinheiro, toca som e limpa prato.
   * 4. Se não corresponder: aplica penalidade de -R$ 3,00 e limpa o prato.
   */
  const handleServe = useCallback(() => {
    const { slices: currentSlices, sliceCount: currentSliceCount, orders: currentOrders } = stateRef.current;
    const slicesOnPlateCount = currentSlices.filter((s) => s.onplate).length;

    // Se o prato estiver vazio, não faz nada
    if (slicesOnPlateCount === 0) return;

    // Encontra pedidos matematicamente equivalentes à fração montada
    const matchingOrders = currentOrders.filter((order) =>
      areFractionsEqual(order.numerador, order.denominador, slicesOnPlateCount, currentSliceCount)
    );

    if (matchingOrders.length > 0) {
      // Prioriza o pedido com MENOS tempo restante na comanda
      matchingOrders.sort((a, b) => a.tempo_restante - b.tempo_restante);
      const bestOrder = matchingOrders[0];

      // Calcula a recompensa financeira com bônus de agilidade
      const reward = calculateOrderReward(bestOrder.tempo_restante, bestOrder.tempo_total);

      setMoney((prev) => Math.round((prev + reward) * 100) / 100);
      addMoneyPopup(reward, true);

      playSuccessSound();
      playCoinSound();

      // Dispara explosão de confetes festivos
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Remove a comanda atendida da fila
      setOrders((prev) => prev.filter((o) => o.id !== bestOrder.id));

      // Limpa o prato e devolve a pizza para o estado completo
      resetPizzaSlices();
    } else {
      // Entrega incorreta: Penalidade de -R$ 3,00
      const penalty = 3.0;
      setMoney((prev) => Math.max(0, Math.round((prev - penalty) * 100) / 100));
      addMoneyPopup(penalty, false);
      playErrorSound();

      // Limpa o prato
      resetPizzaSlices();
    }
  }, [addMoneyPopup, resetPizzaSlices]);

  /**
   * Spawna um novo pedido sorteando uma fração do pool do estágio atual.
   */
  const spawnOrder = useCallback(() => {
    const { orders: currentOrders, stageConfig: currentStageConfig } = stateRef.current;
    
    // Não ultrapassa o limite de 4 pedidos simultâneos
    if (currentOrders.length >= 4) return;

    // Encontra o primeiro slot de comanda vago (0 a 3)
    const occupiedSlots = currentOrders.map((o) => o.slot);
    let freeSlot = -1;
    for (let i = 0; i < 4; i++) {
      if (!occupiedSlots.includes(i)) {
        freeSlot = i;
        break;
      }
    }
    if (freeSlot === -1) return;

    // Sorteia uma fração permitida do dia
    const fracoesPool = currentStageConfig.fracoes;
    const randomFrac = fracoesPool[Math.floor(Math.random() * fracoesPool.length)];

    // Duração ajustada pelo multiplicador de dificuldade do dia
    const baseDuration = 25.0 * currentStageConfig.order_expiration_mult;

    const newOrder = {
      id: `order-${Date.now()}-${Math.random()}`,
      slot: freeSlot,
      numerador: randomFrac[0],
      denominador: randomFrac[1],
      tempo_total: baseDuration,
      tempo_restante: baseDuration,
      flash: false
    };

    setOrders((prev) => [...prev, newOrder]);
  }, []);

  /**
   * Efeito: Timer Principal de 1 segundo (Relógio do Dia + Expiração de Pedidos).
   */
  useEffect(() => {
    if (gameStatus !== 'PLAYING') return;

    const timerInterval = setInterval(() => {
      // 1. Decrementa o tempo restante do dia
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Fim do tempo do dia! Avalia se o jogador atingiu a meta
          clearInterval(timerInterval);
          const { money: currentMoney, stageConfig: currentStageConfig, currentStage: stageNum, totalMoneyWeek: currentWeekMoney } = stateRef.current;

          if (currentMoney >= currentStageConfig.goal) {
            // Meta Atingida! Acumula faturamento
            setTotalMoneyWeek(currentWeekMoney + currentMoney);
            if (stageNum >= 7) {
              setGameStatus('VICTORY'); // Concluiu o domingo (semana inteira)
            } else {
              setGameStatus('DAY_SUMMARY'); // Avança para o modal entre dias
            }
          } else {
            // Não atingiu a meta -> Game Over
            setGameStatus('GAME_OVER');
          }
          return 0;
        }

        // Tique-taque nos últimos 10 segundos
        if (prevTime <= 10) playTickSound();
        return prevTime - 1;
      });

      // 2. Decrementa o tempo de cada comanda ativa
      setOrders((prevOrders) => {
        const nextOrders = [];
        for (const order of prevOrders) {
          const newTime = order.tempo_restante - 1;
          if (newTime <= 0) {
            // Pedido expirou sem atendimento -> Penalidade de -R$ 5,00
            const penalty = 5.0;
            setMoney((prev) => Math.max(0, Math.round((prev - penalty) * 100) / 100));
            addMoneyPopup(penalty, false);
            playErrorSound();
          } else {
            nextOrders.push({ ...order, tempo_restante: newTime });
          }
        }
        return nextOrders;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameStatus, addMoneyPopup]);

  /**
   * Efeito: Intervalo de Spawn de Pedidos baseado no spawn_interval do estágio.
   */
  useEffect(() => {
    if (gameStatus !== 'PLAYING') return;

    // Se não houver nenhum pedido, spawna um imediatamente
    if (orders.length === 0) {
      spawnOrder();
    }

    const spawnIntervalMs = stageConfig.spawn_interval * 1000;
    const spawnTimer = setInterval(() => {
      spawnOrder();
    }, spawnIntervalMs);

    return () => clearInterval(spawnTimer);
  }, [gameStatus, stageConfig, spawnOrder, orders.length]);

  /**
   * Inicia um novo jogo do Dia 1 (Segunda-feira).
   */
  const startGame = useCallback(() => {
    setCurrentStage(1);
    setTimeLeft(STAGE_STATES[0].total_time);
    setMoney(0.0);
    setTotalMoneyWeek(0.0);
    setOrders([]);
    resetPizzaSlices(4);
    setSliceCount(4);
    setGameStatus('PLAYING');
  }, [resetPizzaSlices]);

  /**
   * Reinicia o dia atual.
   */
   const restartStage = useCallback(() => {
  setTimeLeft(STAGE_STATES[currentStage - 1].total_time);
  setMoney(0.0);
  setOrders([]);
  resetPizzaSlices(4);
  setSliceCount(4);
  setGameStatus('PLAYING');
  }, [currentStage, resetPizzaSlices]);

  /**
   * Carrega o próximo dia de trabalho após atingir a meta.
   */
  const nextStage = useCallback(() => {
    if (currentStage < 7) {
      const nextStageNum = currentStage + 1;
      setCurrentStage(nextStageNum);
      setTimeLeft(STAGE_STATES[nextStageNum - 1].total_time);
      setMoney(0.0);
      setOrders([]);
      resetPizzaSlices(4);
      setSliceCount(4);
      setGameStatus('PLAYING');
    }
  }, [currentStage, resetPizzaSlices]);

  /**
   * Alterna a pausa do jogo.
   */
  const togglePause = useCallback(() => {
    setGameStatus((prev) => (prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev));
  }, []);

  /**
   * Alterna o estado de mudo do áudio.
   */
  const toggleMute = useCallback(() => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      setAudioMuted(next);
      return next;
    });
  }, []);

  return {
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
  };
}
