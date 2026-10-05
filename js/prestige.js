// ============ ПЕРЕЕЗД (ПРЕСТИЖ) ============
window.updatePrestigeScreen = function() {
  const btn = $('#btnPrestige');
  const hint = $('#prestigeHint');
  if (!btn) return;

  // престиж открыт только если 5-я глава пройдена
  const storyUnlocked = !!state.storyDone.ch5;
  const can = state.money >= 1000000 && storyUnlocked;
  btn.disabled = !can;

  if (!storyUnlocked) {
    hint.textContent = '🔒 Пройди 5 глав сюжета, чтобы открыть переезд';
  } else if (!can) {
    hint.textContent = 'Нужно 1 000 000 ₽ (у тебя ' + formatMoney(state.money) + ')';
  } else {
    hint.textContent = 'Готов свалить! Жми.';
  }
};

window.doPrestige = function() {
  if (state.money < 1000000) return;
  if (!state.storyDone.ch5) {
    showToast('Сначала пройди сюжет, братан', 'danger');
    return;
  }
  if (!confirm('Свалить из спальника? Все бабки и апгрейды сгорят, но хата станет круче.')) return;

  state.prestigeLevel++;
  state.prestigeMult = 1 + state.prestigeLevel * 0.2;

  // сброс бабок и апгрейдов
  state.money = 0;
  state.totalEarned = 0;
  state.perClick = 1;
  state.perSecond = 0;
  state.multiplier = 1;
  state.totalClicks = 0;
  state.respect = 0;
  window.UPGRADES.forEach(u => u.count = 0);

  // сюжет НЕ сбрасываем — он пройден навсегда
  // но награды за главы тоже остаются (storyBonuses не трогаем)
  // storyDone тоже оставляем, чтобы не показывать главы заново

  showToast('🏠 Переезд! Хата x' + state.prestigeMult.toFixed(1), 'gold');
  updateStats();
  renderUpgrades();
  renderAchievements();
  updatePrestigeScreen();
  saveGame();
  switchScreen('main');
};

window.initPrestige = function() {
  $('#btnPrestige').addEventListener('click', doPrestige);
};