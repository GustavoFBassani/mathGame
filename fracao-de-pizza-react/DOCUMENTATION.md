# 📚 Documentação Técnica Completa — Fração de Pizza (React + JS)

Esta documentação tem como objetivo fornecer um entendimento aprofundado sobre o funcionamento, a arquitetura de software, as regras matemáticas e o fluxo de dados do jogo **Fração de Pizza** recriado em **React e JavaScript**.

---

## 📋 Sumário
1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura de Software & Fluxo de Dados](#2-arquitetura-de-software--fluxo-de-dados)
3. [Estrutura de Pastas](#3-estrutura-de-pastas)
4. [Regras de Negócio e Mecânicas de Gameplay](#4-regras-de-negócio-e-mecânicas-de-gameplay)
5. [Lógica Matemática (Equivalência e Recompensas)](#5-lógica-matemática-equivalência-e-recompensas)
6. [Renderização Geométrica SVG das Fatias](#6-renderização-geométrica-svg-das-fatias)
7. [Sintetizador de Áudio (Web Audio API)](#7-sintetizador-de-áudio-web-audio-api)
8. [Detalhamento de Módulos e Componentes](#8-detalhamento-de-módulos-e-componentes)
9. [Guia de Execução e Manutenção](#9-guia-de-execução-e-manutenção)

---

## 1. Visão Geral do Projeto

O **Fração de Pizza** é um jogo educativo de matemática cujo objetivo pedagógico é ensinar **conceitos de frações, simplificação e frações equivalentes** através da simulação de uma pizzaria.

O jogador atua como pizzaiolo ao longo de **7 dias de expediente (Segunda a Domingo)**. Em cada dia, clientes fazem pedidos expressos através de comandas que contêm frações (ex: `1/2`, `3/4`, `2/5`). O jogador precisa:
1. Ajustar o número de cortes da pizza (entre **2 e 9 fatias iguais**).
2. Selecionar e mover a quantidade correta de fatias para o prato de cerâmica.
3. Clicar em **Servir** para entregar a fração montada antes que o tempo da comanda expire.
4. Acumular faturamento suficiente para atingir a **Meta Financeira** do dia dentro do tempo limite (60 segundos).

---

## 2. Arquitetura de Software & Fluxo de Dados

A aplicação foi construída com a biblioteca **React** utilizando a abordagem baseada em componentes funcionais e **Custom Hooks**.

### Diagrama de Arquitetura e Estado
```
                  ┌────────────────────────┐
                  │        App.jsx         │
                  └───────────┬────────────┘
                              │
                    ┌─────────┴─────────┐
                    │  useGameState.js  │ (Custom Hook Principal)
                    └─────────┬─────────┘
                              │
    ┌─────────────────────────┼─────────────────────────┐
    │                         │                         │
┌───▼──────────────┐  ┌───────▼─────────────┐  ┌────────▼────────────┐
│   HUD Header     │  │  OrderQueue (4x)    │  │  PizzaBoard (SVG)   │
└──────────────────┘  └─────────────────────┘  └─────────────────────┘
                              │                         │
                      ┌───────▼─────────────┐  ┌────────▼────────────┐
                      │ ServeButton.jsx     │  │ PlateBoard (SVG)    │
                      └─────────────────────┘  └─────────────────────┘
```

---

## 3. Estrutura de Pastas

```
fracao-de-pizza-react/
├── DOCUMENTATION.md           # Esta documentação completa do projeto
├── index.html                 # Ponto de entrada HTML5 com metadados e favicon
├── package.json               # Dependências do projeto (React 19, Lucide, Canvas-Confetti, Tailwind)
├── vite.config.js             # Configuração do bundler Vite com plugin React e TailwindCSS
├── src/
│   ├── main.jsx               # Ponto de inicialização do React DOM
│   ├── App.jsx                # Componente container raiz que une os modais e o gameplay
│   ├── index.css              # Estilos CSS globais e Tailwind v4
│   ├── data/
│   │   └── stages.js          # Configuração dos 7 estágios/dias de jogo
│   ├── utils/
│   │   ├── math.js            # Funções de multiplicação cruzada, MDC e fórmula de recompensa
│   │   └── audio.js           # Sintetizador Web Audio API sem necessidade de arquivos MP3
│   ├── hooks/
│   │   └── useGameState.js    # Hook central que gerencia o loop de jogo, timers e score
│   └── components/
│       ├── PizzaBoard.jsx     # Renderizador SVG da pizza circular com fatiamento dinâmico
│       ├── PlateBoard.jsx     # Renderizador SVG do prato com as fatias montadas
│       ├── SliceSelector.jsx  # Botões de seleção de cortes (2 a 9 fatias)
│       ├── OrderQueue.jsx     # Fila visual de até 4 comandas de pedidos
│       ├── ServeButton.jsx    # Botão de entrega "Servir Prato"
│       ├── HUD.jsx            # Barra superior com Cronômetro, Meta, Saldo e Botões
│       ├── MoneyPopupContainer.jsx # Animação flutuante de dinheiro (+R$ 15 / -R$ 3)
│       ├── StartMenu.jsx      # Tela Inicial de boas-vindas e regras
│       ├── PauseMenu.jsx      # Menu suspenso de pausa
│       ├── DaySummaryModal.jsx # Resumo do dia ao atingir a meta
│       ├── GameOverModal.jsx  # Tela de derrota quando a meta não é atingida
│       └── VictoryModal.jsx   # Tela de vitória ao concluir a semana (7 dias)
```

---

## 4. Regras de Negócio e Mecânicas de Gameplay

### A. Estágios dos 7 Dias (`stages.js`)

| Dia | Nome | Tempo | Meta (R$) | Intervalo Spawn | Pool de Frações Permite |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | Segunda-feira | 60s | R$ 50,00 | 6.5s | `1/2`, `1/4`, `3/4` (Metades e Quartos) |
| 2 | Terça-feira | 60s | R$ 65,00 | 5.5s | `1/2`, `1/3`, `2/3`, `1/4`, `3/4` (+ Terços) |
| 3 | Quarta-feira | 60s | R$ 80,00 | 4.8s | `1/2`, `1/3`, `2/3`, `1/4`, `3/4`, `2/5`, `3/5` (+ Quintos) |
| 4 | Quinta-feira | 60s | R$ 95,00 | 4.2s | `1/3`, `2/3`, `1/4`, `3/4`, `2/5`, `3/5`, `1/6`, `5/6` (+ Sextos) |
| 5 | Sexta-feira | 60s | R$ 105,00 | 3.8s | `1/3` até `3/8` (+ Oitavos) |
| 6 | Sábado | 60s | R$ 115,00 | 3.4s | Mix Completo de Frações |
| 7 | Domingo | 60s | R$ 130,00 | 3.0s | Desafio Final (Ritmo Acelerado) |

---

## 5. Lógica Matemática (Equivalência e Recompensas)

### A. Validação de Frações Equivalentes (`areFractionsEqual`)
Para verificar se a fração montada no prato atende um pedido, utilizamos a **Multiplicação Cruzada**:

$$\frac{a}{b} = \frac{c}{d} \iff a \cdot d = c \cdot b$$

- **Exemplo**: O pedido solicita $\frac{1}{2}$. A pizza está dividida em 4 fatias e o jogador coloca 2 fatias no prato ($\frac{2}{4}$).
- Cálculo: $1 \cdot 4 = 4$ e $2 \cdot 2 = 4$. Como $4 = 4$, a entrega é validada como **Correta**!

### B. Fórmula de Recompensa em Dinheiro (`calculateOrderReward`)
A recompensa financeira paga por uma entrega correta combina um **valor fixo base** com um **bônus proporcional à velocidade** de atendimento:

$$\text{Recompensa} = \text{ValorBase} + \left( \text{ValorBonusMax} \cdot \sqrt{\operatorname{clamp}\left(\frac{\text{TempoRestante} + 2.0}{\text{TempoTotal}}, 0, 1\right)} \right)$$

- **ValorBase**: R$ 12,00 (garantido por pedido correto).
- **ValorBonusMax**: R$ 8,00.
- **Lambuja**: +2,0 segundos de tolerância para compensar o tempo de reação humana.
- **Curva Suave ($\sqrt{x}$)**: Faz com que a queda do bônus seja lenta no início e acelere no final.

---

## 6. Renderização Geométrica SVG das Fatias

No componente `PizzaBoard.jsx`, as fatias são geradas dinamicamente usando **Coordenadas Polares** convertidas em **Cartesianas (x, y)** para desenhar os arcos no elemento `<svg>`:

1. **Ângulo da Fatia**: $\theta = \frac{360^\circ}{\text{sliceCount}}$
2. **Ângulo Inicial da Fatia $i$**: $\theta_{\text{start}} = -90^\circ + (i \cdot \theta)$ (o $-90^\circ$ alinha a primeira fatia ao topo 12h).
3. **Conversão para Radianos**: $rad = \frac{\theta \cdot \pi}{180}$
4. **Coordenadas Extremas do Arco SVG**:
   $$x = c_x + R \cdot \cos(rad)$$
   $$y = c_y + R \cdot \sin(rad)$$
5. **Caminho SVG (`path d`)**:
   `M cx cy L x1 y1 A R R 0 largeArc 1 x2 y2 Z`

---

## 7. Sintetizador de Áudio (Web Audio API)

O arquivo `audio.js` cria efeitos sonoros diretamente com o processador de som do navegador (sem requisições HTTP de arquivos de áudio):

- **Som de Corte**: Oscilador com onda `sawtooth` deslizando a frequência de 440Hz para 110Hz em 120ms.
- **Som de Movimento da Fatia**: Onda senoidal (`sine`) subindo de 300Hz para 600Hz.
- **Acorde de Sucesso**: Arpejo das notas Dó5, Mi5, Sol5 e Dó6 em onda `triangle`.
- **Buzzer de Erro**: Frequência grave (150Hz) em onda `sawtooth`.

---

## 8. Detalhamento de Módulos e Componentes

### `useGameState.js` (State Manager Central)
Gerencia os estados do jogo via React `useState` e `useRef` para evitar "stale closures" dentro dos intervalos do `setInterval`.

Funções principais expostas:
- `startGame()`: Inicia o expediente no Dia 1.
- `nextStage()`: Avança para o dia seguinte mantendo o faturamento acumulado.
- `changeSliceCount(newCount)`: Altera a divisão de fatias da pizza.
- `handleSliceClick(index)`: Move a fatia para o prato.
- `handlePlateClick(index)`: Devolve a fatia para a pizza.
- `handleServe()`: Executa a validação da entrega.

---

## 9. Guia de Execução e Manutenção

### Pré-requisitos
- Node.js versão 18 ou superior.

### Comandos Principais

1. **Navegar para a pasta do projeto**:
   ```bash
   cd "/Users/gustavoferreirabassani/Desktop/pastas importantes/Programação/gameMath/fracao-de-pizza-react"
   ```

2. **Rodar em Modo de Desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a URL exibida no terminal (ex: `http://localhost:5173`).

3. **Compilar o Bundle de Produção**:
   ```bash
   npm run build
   ```

---
*Documentação desenvolvida em conformidade com as diretrizes do projeto original IFRS Fração de Pizza.*
