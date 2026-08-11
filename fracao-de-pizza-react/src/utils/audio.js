/**
 * Módulo de Sintetizador de Áudio da Pizzaria (Web Audio API)
 * 
 * Este módulo gera todos os efeitos sonoros do jogo em tempo real
 * usando osciladores de áudio nativos do navegador, dispensando o download
 * de arquivos de áudio externos (.mp3 / .wav).
 */

// Instância singleton do AudioContext
let audioCtx = null;

// Estado global de áudio mutado
let muted = false;

/**
 * Inicializa ou retoma a instância do AudioContext do navegador.
 * Necessário devido às políticas de autoplay dos navegadores modernos.
 * 
 * @returns {AudioContext|null} Instância do contexto de áudio
 */
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Se o contexto estiver suspenso (por falta de interação prévia do usuário), retoma ele
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Define se o som do jogo está mutado.
 * @param {boolean} isMuted 
 */
export function setMuted(isMuted) {
  muted = isMuted;
}

/**
 * Retorna o estado atual do áudio (mutado ou não).
 * @returns {boolean}
 */
export function isMuted() {
  return muted;
}

/**
 * Toca o som sintético de corte da pizza (knife slice effect).
 * Gera um tom dente de serra (sawtooth) deslizando rapidamente de 440Hz para 110Hz.
 */
export function playCutSound() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Tipo dente de serra para som rasgante de corte
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.12);

  // Envelope de volume (curva de ganho rápida)
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

/**
 * Toca o som de movimento de fatia (pegar fatia ou devolver ao prato).
 * 
 * @param {boolean} [isToPlate=true] True para movimento pizza->prato (tom ascendente), False para prato->pizza (tom descendente).
 */
export function playSliceMoveSound(isToPlate = true) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  const startFreq = isToPlate ? 300 : 500;
  const endFreq = isToPlate ? 600 : 250;

  osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

/**
 * Toca o som de sucesso na entrega do pedido (Acorde Dó Maior arpejado).
 * Toca as notas C5, E5, G5 e C6 em sequência rápida para criar uma sensação gratificante.
 */
export function playSuccessSound() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Frequências em Hz: C5, E5, G5, C6
  const notes = [523.25, 659.25, 783.99, 1046.50];

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

    gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.06);
    osc.stop(ctx.currentTime + idx * 0.06 + 0.3);
  });
}

/**
 * Toca o som de erro na entrega ou expiração de pedido (Buzzer grave).
 * Emite uma frequência baixa constante (150Hz -> 120Hz) com onda dente de serra.
 */
export function playErrorSound() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.setValueAtTime(120, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

/**
 * Toca o efeito sonoro de ganho de moedas ("cha-ching").
 * Emite duas notas agudas harmonizadas simulando moedas tilintando.
 */
export function playCoinSound() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'sine';

  osc1.frequency.setValueAtTime(987.77, ctx.currentTime); // Nota B5
  osc1.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // Nota E6

  osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // Nota E6
  osc2.frequency.setValueAtTime(1759.83, ctx.currentTime + 0.08); // Nota A6

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start();
  osc2.start();
  osc1.stop(ctx.currentTime + 0.3);
  osc2.stop(ctx.currentTime + 0.3);
}

/**
 * Toca o som curto de tique-taque do relógio.
 * Usado nos últimos 10 segundos do expediente para criar tensão.
 */
export function playTickSound() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);

  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.03);
}
