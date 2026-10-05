// ============ КРЫША + РАНДОМНЫЕ СОБЫТИЯ ============
let kryshaInterval = null;
let activeModal = null;
let kryshaTimerInt = null;

window.startKryshaTimer = function() {
  if (kryshaInterval) clearInterval(kryshaInterval);
  kryshaInterval = setInterval(() => {
    if (Math.random() < 0.5 && !activeModal) showKryshaModal();
  }, 30000);
};

window.showKryshaModal = function() {
  if (activeModal) return;
  const modal = $('#modalKrysha');
  modal.classList.remove('hidden');
  activeModal = modal;

  // звук сирены
  playSound('krysha');

  let left = 5;
  const tEl = $('#kryshaTimer');
  tEl.textContent = left;

  kryshaTimerInt = setInterval(() => {
    left--;
    tEl.textContent = left;
    if (left <= 0) {
      clearInterval(kryshaTimerInt); kryshaTimerInt = null;
      applyKryshaPenalty(0.20, true);
      closeKrysha();
    }
  }, 1000);

  $('#kryshaPay').onclick = () => {
    clearInterval(kryshaTimerInt); kryshaTimerInt = null;
    applyKryshaPenalty(0.10, false);
    state.kryshaPaid++;
    closeKrysha();
  };
  $('#kryshaIgnore').onclick = () => {
    clearInterval(kryshaTimerInt); kryshaTimerInt = null;
    applyKryshaPenalty(0.20, true);
    closeKrysha();
  };
};

function applyKryshaPenalty(pct, isFull) {
  if (state.money <= 0) {
    showToast('🍀 Повезло, братан', 'gold');
    return;
  }
  const lost = state.money * pct;
  state.money = Math.max(0, state.money - lost);
  if (isFull) flashRed();
  showToast('-' + formatMoney(lost), 'danger');
  updateStats();
  renderUpgrades();
  saveGame();
}

function closeKrysha() {
  $('#modalKrysha').classList.add('hidden');
  activeModal = null;
  updateStats();
  renderUpgrades();
}

// ---------- Рандомные события ----------
window.startRandomEvents = function() {
  setInterval(() => {
    if (activeModal) return;
    const roll = Math.random();
    if (roll < 0.33) eventObshak();
    else if (roll < 0.66) eventShodka();
    else eventOblava();
  }, 120000);
};

function eventObshak() {
  const bonus = Math.max(100, state.money * 0.05);
  state.money += bonus;
  state.totalEarned += bonus;
  playSound('buy');
  showToast('💰 Общак: +' + formatMoney(bonus), 'gold');
  updateStats(); saveGame();
}

function eventShodka() {
  playSound('chapter');
  showToast('🃏 Сходка: x3 к клику на 30 сек!', 'gold');
  const oldClick = state.perClick;
  state.perClick *= 3;
  updateStats();
  setTimeout(() => {
    state.perClick = oldClick;
    updateStats();
    showToast('Сходка закончилась');
  }, 30000);
}

function eventOblava() {
  playSound('krysha');
  const lost = state.money * 0.08;
  state.money = Math.max(0, state.money - lost);
  flashRed();
  showToast('🚨 Облава: -' + formatMoney(lost), 'danger');
  updateStats(); renderUpgrades(); saveGame();
}