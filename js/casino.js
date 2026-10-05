// ============ КАЗИНО ============
// Слот-машина с 3 барабанами. Ставка выбирается, автоспин x10.

window.casinoState = {
  currentBet: 1000,
  spinning: false,
  autoSpinsLeft: 0,
  history: [],
  totalSpins: 0,
  bigWin: 0
};

const HISTORY_LIMIT = 10;

// ---------- Инициализация ----------
window.initCasino = function() {
  try {
    const raw = localStorage.getItem('temshchik_casino');
    if (raw) {
      const saved = JSON.parse(raw);
      casinoState.currentBet = saved.currentBet ?? 1000;
      casinoState.totalSpins = saved.totalSpins ?? 0;
      casinoState.bigWin = saved.bigWin ?? 0;
    }
  } catch (e) {}

  document.querySelectorAll('.bet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (casinoState.spinning) return;
      const bet = btn.dataset.bet;
      if (bet === 'all') {
        if (state.money < 100) {
          showToast('Не хватает бабок, братан', 'danger');
          return;
        }
        casinoState.currentBet = Math.floor(state.money);
      } else {
        casinoState.currentBet = parseInt(bet, 10);
      }
      updateBetUI();
    });
  });

  const spinBtn = document.getElementById('btnSpin');
  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      if (casinoState.spinning) return;
      if (casinoState.currentBet > state.money) {
        showToast('Ставка больше баланса, братан', 'danger');
        return;
      }
      spinOnce();
    });
  }

  const autoBtn = document.getElementById('btnAuto');
  if (autoBtn) {
    autoBtn.addEventListener('click', () => {
      if (casinoState.spinning) return;
      if (casinoState.currentBet > state.money) {
        showToast('Ставка больше баланса, братан', 'danger');
        return;
      }
      casinoState.autoSpinsLeft = 10;
      updateBetUI();
      spinOnce();
    });
  }

  updateBetUI();
  updateCasinoStats();
};

// ---------- Сохранение ----------
function saveCasino() {
  try {
    localStorage.setItem('temshchik_casino', JSON.stringify({
      currentBet: casinoState.currentBet,
      totalSpins: casinoState.totalSpins,
      bigWin: casinoState.bigWin
    }));
  } catch (e) {}
}

// ---------- Обновление UI ставки ----------
function updateBetUI() {
  document.querySelectorAll('.bet-btn').forEach(b => {
    b.classList.remove('active');
    const val = b.dataset.bet;
    if (val === 'all') {
      if (casinoState.currentBet === Math.floor(state.money) && state.money > 0) {
        b.classList.add('active');
      }
    } else if (parseInt(val, 10) === casinoState.currentBet) {
      b.classList.add('active');
    }
  });

  const betEl = document.getElementById('casinoBet');
  if (betEl) betEl.textContent = formatMoney(casinoState.currentBet);

  const balEl = document.getElementById('casinoBalance');
  if (balEl) balEl.textContent = formatMoney(state.money);

  const spinBtn = document.getElementById('btnSpin');
  const autoBtn = document.getElementById('btnAuto');
  const canSpin = !casinoState.spinning && casinoState.currentBet <= state.money;
  if (spinBtn) spinBtn.disabled = !canSpin;
  if (autoBtn) {
    autoBtn.disabled = !canSpin;
    autoBtn.textContent = casinoState.autoSpinsLeft > 0
      ? `🔁 x${casinoState.autoSpinsLeft}`
      : '🔁 x10';
  }
}

// ---------- Случайный символ по весам ----------
function pickWeightedSymbol() {
  const total = window.CASINO_SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * total;
  for (const sym of window.CASINO_SYMBOLS) {
    roll -= sym.weight;
    if (roll <= 0) return sym;
  }
  return window.CASINO_SYMBOLS[0];
}

// ---------- Установка символа на барабан ----------
function setReelSymbol(reelIndex, symbol) {
  const reel = document.getElementById('reel' + reelIndex);
  if (!reel) return;
  const cell = reel.querySelector('.reel-cell');
  if (!cell) return;

  cell.innerHTML = '';
  const img = new Image();
  img.onload = () => {
    cell.innerHTML = '';
    const el = document.createElement('img');
    el.src = symbol.icon;
    el.style.width = '80%';
    el.style.height = '80%';
    el.style.objectFit = 'contain';
    cell.appendChild(el);
  };
  img.onerror = () => {
    cell.textContent = symbol.emoji;
  };
  img.src = symbol.icon;

  if (!cell.textContent && !cell.querySelector('img')) {
    cell.textContent = symbol.emoji;
  }
}

// ---------- Один спин ----------
function spinOnce() {
  if (casinoState.spinning) return;
  if (casinoState.currentBet > state.money) {
    casinoState.autoSpinsLeft = 0;
    updateBetUI();
    return;
  }

  casinoState.spinning = true;

  const bet = casinoState.currentBet;
  state.money -= bet;
  updateStats();
  updateBetUI();

  playSound('casino-spin');

  const result = [pickWeightedSymbol(), pickWeightedSymbol(), pickWeightedSymbol()];

  const reels = [
    document.getElementById('reel0'),
    document.getElementById('reel1'),
    document.getElementById('reel2')
  ];
  reels.forEach(r => r.classList.add('spinning'));

  const shuffleIntervals = reels.map((reel, i) => {
    return setInterval(() => {
      const randomSym = pickWeightedSymbol();
      setReelSymbol(i, randomSym);
    }, 60);
  });

  const stopTimes = [1400, 1800, 2200];
  reels.forEach((reel, i) => {
    setTimeout(() => {
      clearInterval(shuffleIntervals[i]);
      reel.classList.remove('spinning');
      setReelSymbol(i, result[i]);
    }, stopTimes[i]);
  });

  setTimeout(() => {
    finishSpin(result, bet);
  }, stopTimes[2] + 100);
}

// ---------- Расчёт результата ----------
function finishSpin(result, bet) {
  casinoState.spinning = false;
  casinoState.totalSpins++;

  const [a, b, c] = result;
  const allSame = a.id === b.id && b.id === c.id;
  const twoSame = (a.id === b.id) || (b.id === c.id) || (a.id === c.id);

  let win = 0;
  let resultText = '';
  let resultClass = '';
  let isJackpot = false;

  if (allSame) {
    const sym = a;
    if (sym.kind === 'bad') {
      if (sym.id === 'skull') {
        win = 0;
        resultText = '💀 Три черепа! Забирай пустоту';
        resultClass = 'lose';
      } else if (sym.id === 'cop') {
        win = Math.floor(bet * 0.5);
        resultText = '👮 Три мента! Полставки вернули';
        resultClass = 'lose';
      }
    } else {
      win = bet * sym.payout;
      if (sym.payout >= 50) {
        isJackpot = true;
        resultText = `🎉 ДЖЕКПОТ! ${sym.emoji} x${sym.payout}`;
        resultClass = 'jackpot';
      } else {
        resultText = `🎊 ${sym.emoji}${sym.emoji}${sym.emoji} x${sym.payout}!`;
        resultClass = 'win';
      }
    }
  } else if (twoSame) {
    let pairSym = null;
    if (a.id === b.id) pairSym = a;
    else if (b.id === c.id) pairSym = b;
    else pairSym = a;

    if (pairSym.kind !== 'bad') {
      win = bet * 2;
      resultText = `✨ Пара ${pairSym.emoji} — x2`;
      resultClass = 'win';
    } else {
      win = 0;
      resultText = `😐 Пара ${pairSym.emoji} — не считается`;
      resultClass = 'lose';
    }
  } else {
    win = 0;
    resultText = '💸 Не повезло';
    resultClass = 'lose';
  }

  if (win > 0) {
    state.money += win;
    state.totalEarned += win;
    if (win > casinoState.bigWin) casinoState.bigWin = win;
    playSound('casino-win');
  } else {
    playSound('casino-lose');
  }

  const resultEl = document.getElementById('slotResult');
  if (resultEl) {
    resultEl.textContent = resultText;
    resultEl.className = 'slot-result ' + resultClass;
  }

  if (win > 0) {
    document.querySelectorAll('.reel').forEach(r => {
      r.classList.add('win');
      setTimeout(() => r.classList.remove('win'), 600);
    });
    if (isJackpot) flashJackpot();
  }

  addHistory(result, bet, win, isJackpot);

  updateStats();
  updateBetUI();
  updateCasinoStats();
  saveCasino();
  saveGame();

  if (casinoState.autoSpinsLeft > 0) {
    casinoState.autoSpinsLeft--;
    updateBetUI();
    if (casinoState.autoSpinsLeft > 0 && casinoState.currentBet <= state.money) {
      setTimeout(spinOnce, 800);
    } else {
      casinoState.autoSpinsLeft = 0;
      updateBetUI();
    }
  }
}

// ---------- Запись в историю ----------
function addHistory(result, bet, win, isJackpot) {
  casinoState.history.unshift({
    symbols: result.map(s => s.emoji).join(''),
    bet: bet,
    win: win,
    isWin: win > 0,
    isJackpot: isJackpot,
    time: Date.now()
  });
  if (casinoState.history.length > HISTORY_LIMIT) {
    casinoState.history = casinoState.history.slice(0, HISTORY_LIMIT);
  }
  renderHistory();
}

// ---------- Отрисовка истории ----------
function renderHistory() {
  const list = document.getElementById('historyList');
  if (!list) return;

  if (casinoState.history.length === 0) {
    list.innerHTML = '<div class="history-empty">Пока пусто</div>';
    return;
  }

  list.innerHTML = casinoState.history.map(row => {
    const cls = row.isWin ? 'win' : 'lose';
    const sign = row.win > 0 ? '+' : '';
    const amount = row.win > 0 ? formatMoney(row.win) : '-' + formatMoney(row.bet);
    const jackpot = row.isJackpot ? ' 🎉' : '';
    return `
      <div class="history-row ${cls}">
        <span class="history-symbols">${row.symbols}${jackpot}</span>
        <span class="history-amount">${sign}${amount}</span>
      </div>
    `;
  }).join('');
}

// ---------- Джекпот-вспышка ----------
function flashJackpot() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;
    background:radial-gradient(circle,#ffdd0080,#ffaa0040,transparent);
    z-index:2500;pointer-events:none;
    animation:flashAnim 0.8s ease-out forwards;
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 800);

  showToast('🎉 ДЖЕКПОТ! x' + 50 + ' от ставки!', 'gold');
}

// ---------- Обновление статистики казино ----------
function updateCasinoStats() {
  const spinsEl = document.getElementById('uiCasinoSpins');
  const bigEl = document.getElementById('uiCasinoBigWin');
  if (spinsEl) spinsEl.textContent = formatNum(casinoState.totalSpins);
  if (bigEl) bigEl.textContent = formatMoney(casinoState.bigWin);
}