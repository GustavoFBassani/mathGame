/**
 * Módulo de Utilitários Matemáticos para o Jogo Fração de Pizza
 * 
 * Contém funções puras para equivalência de frações, simplificação,
 * e a fórmula de cálculo da recompensa em dinheiro com base na agilidade de entrega.
 */

/**
 * Verifica se duas frações são matematicamente equivalentes usando multiplicação cruzada.
 * 
 * Exemplo:
 *  - Fração pedida no bilhete: 1/2
 *  - Fração no prato: 2/4
 *  - Multiplicação cruzada: 1 * 4 === 2 * 2 (4 === 4 -> true)
 * 
 * @param {number} n1 Numerador da primeira fração (ex: pedido)
 * @param {number} d1 Denominador da primeira fração
 * @param {number} n2 Numerador da segunda fração (ex: prato)
 * @param {number} d2 Denominador da segunda fração (ex: fatias da pizza)
 * @returns {boolean} True se as frações forem equivalentes, False caso contrário.
 */
export function areFractionsEqual(n1, d1, n2, d2) {
  // Evita divisão ou cálculo com denominador zero por segurança
  if (d1 === 0 || d2 === 0) return false;

  // Algoritmo da Multiplicação Cruzada (a/b == c/d <==> a*d == c*b)
  return n1 * d2 === n2 * d1;
}

/**
 * Calcula o Máximo Divisor Comum (MDC) de dois números inteiros utilizando
 * o Algoritmo de Euclides recursivo.
 * 
 * @param {number} a Primeiro número
 * @param {number} b Segundo número
 * @returns {number} O maior número que divide a e b sem deixar resto.
 */
export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Simplifica uma fração para sua forma irredutível.
 * 
 * Exemplo: 4/8 -> 1/2
 * 
 * @param {number} num Numerador original
 * @param {number} den Denominador original
 * @returns {{ num: number, den: number }} Objeto com numerador e denominador simplificados
 */
export function simplifyFraction(num, den) {
  if (den === 0) return { num: 0, den: 1 };
  
  const divisor = gcd(Math.abs(num), Math.abs(den));
  return {
    num: num / divisor,
    den: den / divisor
  };
}

/**
 * Calcula a recompensa financeira recebida pelo jogador ao entregar um pedido correto.
 * 
 * A fórmula é idêntica à do GameMaker original (orderManager.gml):
 *   recompensa = valorBase + (valorBonusMax * sqrt(clamp((tempoRestante + 2s) / tempoTotal, 0, 1)))
 * 
 * Observações de Design:
 * - A adição de +2 segundos é uma margem de tolerância ("lambuja") para recompensar a velocidade de reação.
 * - A raiz quadrada (sqrt) faz o bônus cair devagar no começo e mais rápido perto do fim, tornando o jogo mais justo.
 * 
 * @param {number} tempoRestante Tempo restante na comanda em segundos
 * @param {number} tempoTotal Tempo total de expiração da comanda em segundos
 * @param {number} [valorBase=12.00] Valor fixo garantido por pedido correto (R$ 12,00)
 * @param {number} [valorBonusMax=8.00] Valor bônus máximo por entrega instantânea (R$ 8,00)
 * @returns {number} Valor final da recompensa arredondado para 2 casas decimais (R$)
 */
export function calculateOrderReward(tempoRestante, tempoTotal, valorBase = 12.00, valorBonusMax = 8.00) {
  // Limita a razão entre 0 e 1, incluindo +2.0 segundos de bônus
  const ratio = Math.max(0, Math.min(1, (tempoRestante + 2.0) / tempoTotal));
  
  // Curva de bônus suave (raiz quadrada)
  const bonusMult = Math.sqrt(ratio);
  
  const reward = valorBase + (valorBonusMax * bonusMult);

  // Arredonda para 2 casas decimais (R$ XX,XX)
  return Math.round(reward * 100) / 100;
}
