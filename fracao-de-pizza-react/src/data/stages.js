export const STAGE_STATES = [
  // Dia 1 — ⭐ Fácil: Metade e quartos
  {
    day: 1,
    name: "Segunda-feira",
    total_time: 60,
    order_expiration_mult: 1.0,
    goal: 50,
    spawn_interval: 6.5,
    fracoes: [[1,2], [1,4], [3,4]],
    description: "Metades e Quartos"
  },
  // Dia 2 — ⭐ Fácil: + Terços
  {
    day: 2,
    name: "Terça-feira",
    total_time: 60,
    order_expiration_mult: 0.85,
    goal: 65,
    spawn_interval: 5.5,
    fracoes: [[1,2], [1,3], [2,3], [1,4], [3,4]],
    description: "Entrando Terços"
  },
  // Dia 3 — ⭐⭐ Médio: + Quintos
  {
    day: 3,
    name: "Quarta-feira",
    total_time: 60,
    order_expiration_mult: 0.8,
    goal: 80,
    spawn_interval: 4.8,
    fracoes: [[1,2], [1,3], [2,3], [1,4], [3,4], [2,5], [3,5]],
    description: "Introdução aos Quintos"
  },
  // Dia 4 — ⭐⭐ Médio: + Sextos
  {
    day: 4,
    name: "Quinta-feira",
    total_time: 60,
    order_expiration_mult: 0.75,
    goal: 95,
    spawn_interval: 4.2,
    fracoes: [[1,3], [2,3], [1,4], [3,4], [2,5], [3,5], [1,6], [5,6]],
    description: "Adicionando Sextos"
  },
  // Dia 5 — ⭐⭐⭐ Difícil: + Oitavos
  {
    day: 5,
    name: "Sexta-feira",
    total_time: 60,
    order_expiration_mult: 0.7,
    goal: 105,
    spawn_interval: 3.8,
    fracoes: [[1,3], [2,3], [1,4], [3,4], [2,5], [3,5], [1,6], [5,6], [1,8], [3,8]],
    description: "Horário de Pico: Oitavos"
  },
  // Dia 6 — ⭐⭐⭐ Difícil: Mix completo
  {
    day: 6,
    name: "Sábado",
    total_time: 60,
    order_expiration_mult: 0.65,
    goal: 115,
    spawn_interval: 3.4,
    fracoes: [[1,2], [1,3], [2,3], [1,4], [3,4], [2,5], [3,5], [1,6], [5,6], [1,8], [3,8]],
    description: "Sábado Movimentado"
  },
  // Dia 7 — ⭐⭐⭐⭐ Desafio final
  {
    day: 7,
    name: "Domingo",
    total_time: 60,
    order_expiration_mult: 0.55,
    goal: 130,
    spawn_interval: 3.0,
    fracoes: [[1,2], [1,3], [2,3], [1,4], [3,4], [2,5], [3,5], [1,6], [5,6], [1,8], [3,8]],
    description: "Grande Desafio de Domingo!"
  }
];
