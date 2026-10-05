// ============ ФАЙТЫ С МЕНТАМИ (QTE) ============
let fightInterval = null;
let qteAnim = null;

window.startFightTimer = function() {
  if (fightInterval) clearInterval(fightInterval);
  fightInterval = setInterval(() => {
    if (Math.random() < 0.6 && !activeModal) startFight();
  }, 300000);
};

window.startFight = function() {
  if (activeModal) return;
  const modal = $('#modalFight');
  modal.classList.remove('hidden');
  activeModal = modal;

  // звук начала файта
  playSound('fight');

  let pos = 0;
  let dir = 1;
  let timeLeft = 3;
  const cursor = $('#qteCursor');
  const timerEl = $('#fightTimer');
  timerEl.textContent = timeLeft;

  qteAnim = setInterval(() => {
    pos += dir * 2.5;
    if (pos >= 100) { pos = 100; dir = -1; }
    if (pos <= 0) { pos = 0; dir = 1; }
    cursor.style.left = pos + '%';
  }, 16);

  const countdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      clearInterval(qteAnim);
      loseFight();
    }
  }, 1000);

  function onKey(e) {
    if (e.code !== 'Space') return;
    e.preventDefault();
    clearInterval(countdown);
    clearInterval(qteAnim);
    document.removeEventListener('keydown', onKey);

    if (pos >= 38 && pos <= 62) {
      winFight();
    } else {
      loseFight();
    }
  }
  document.addEventListener('keydown', onKey);

  // Кнопка «БИТЬ» для мобилок
  const strikeBtn = document.getElementById('fightStrike');
  if (strikeBtn) {
    strikeBtn.onclick = () => {
      clearInterval(countdown);
      clearInterval(qteAnim);
      document.removeEventListener('keydown', onKey);
      strikeBtn.onclick = null;
      if (pos >= 38 && pos <= 62) {
        winFight();
      } else {
        loseFight();
      }
    };
  }
};

function winFight() {
  const bonus = Math.max(500, state.money * 0.15);
  state.money += bonus;
  state.totalEarned += bonus;
  state.copsBeaten++;
  state.respect += 5;
  playSound('fight-win');
  showToast('👊 Мента ушатал! +' + formatMoney(bonus) + ' и +5 уважения', 'gold');
  closeFight();
}

function loseFight() {
  const lost = state.money * 0.15;
  state.money = Math.max(0, state.money - lost);
  flashRed();
  playSound('fight-lose');
  showToast('👮 Мент отжал: -' + formatMoney(lost), 'danger');
  closeFight();
}

function closeFight() {
  $('#modalFight').classList.add('hidden');
  activeModal = null;
  updateStats(); renderUpgrades(); saveGame();
}