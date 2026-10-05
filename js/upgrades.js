// ============ АПГРЕЙДЫ ============
window.getUpgradePrice = function(u) {
  return Math.floor(u.basePrice * Math.pow(1.15, u.count));
};

window.isUpgradeUnlocked = function(u) {
  if (!u.requires) return true;
  const prev = window.UPGRADES.find(x => x.id === u.requires);
  if (!prev) return true;
  return prev.count >= u.requiresCount;
};

function getLockInfo(u) {
  if (!u.requires) return '';
  const prev = window.UPGRADES.find(x => x.id === u.requires);
  if (!prev) return '';
  return `🔒 Откроется после: ${prev.name} x${u.requiresCount} (у тебя x${prev.count})`;
}

window.renderUpgrades = function() {
  const grid = $('#upgradesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  window.UPGRADES.forEach(u => {
    const unlocked = isUpgradeUnlocked(u);
    const price = getUpgradePrice(u);
    const isMultiBought = u.effect.type === 'multiplier' && u.count > 0;
    const canAfford = state.money >= price && !isMultiBought && unlocked;

    const card = document.createElement('div');
    card.className = 'upgrade-card';

    if (!unlocked) card.classList.add('locked');
    else if (!canAfford && !isMultiBought) card.classList.add('disabled');

    if (u.count > 0) card.classList.add('bought');

    const descHtml = unlocked
      ? u.desc
      : `<div class="upgrade-lock-info">${getLockInfo(u)}</div>`;

    let priceHtml;
    if (!unlocked) priceHtml = '🔒 ЗАКРЫТО';
    else if (isMultiBought) priceHtml = '✅ КУПЛЕНО';
    else priceHtml = formatMoney(price);

    card.innerHTML = `
      ${!unlocked ? '<div class="upgrade-lock-badge">🔒</div>' : ''}
      <div class="upgrade-icon">
        <img src="${u.icon}" width="52" height="52" alt=""
             onerror="this.replaceWith('${u.fallbackEmoji}')">
      </div>
      <div class="upgrade-body">
        <div class="upgrade-name">${u.name}${u.count>0 ? ' <span class="upgrade-count">x'+u.count+'</span>' : ''}</div>
        <div class="upgrade-desc">${descHtml}</div>
        <div class="upgrade-price">${priceHtml}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (!unlocked) {
        showToast(getLockInfo(u), 'danger');
        return;
      }
      if (isMultiBought) return;
      const p = getUpgradePrice(u);
      if (state.money < p) {
        showToast('Не хватает бабок, братан', 'danger');
        return;
      }
      state.money -= p;
      u.count++;

      if (u.effect.type === 'perClick') state.perClick += u.effect.value;
      else if (u.effect.type === 'perSecond') state.perSecond += u.effect.value;
      else if (u.effect.type === 'multiplier') state.multiplier *= u.effect.value;

      playSound('buy');
      showToast('Купил: ' + u.name, 'gold');

      // Сюжетная глава на 25-м уровне
      if (u.count === 25) {
        window.triggerStory(u.id);
      }

      updateStats();
      renderUpgrades();
      saveGame();
    });

    grid.appendChild(card);
  });
};

// ---------- Ачивки ----------
window.renderAchievements = function() {
  const grid = $('#achieveGrid');
  if (!grid) return;
  grid.innerHTML = '';

  window.ACHIEVEMENTS.forEach(a => {
    const unlocked = !!state.achievements[a.id];
    const card = document.createElement('div');
    card.className = 'achieve-card ' + (unlocked ? 'unlocked' : 'locked');
    card.innerHTML = `
      <img src="${a.icon}" alt="" onerror="this.replaceWith('${a.emoji}')">
      <div class="achieve-name">${a.name}</div>
      <div class="achieve-desc">${a.desc}</div>
    `;
    grid.appendChild(card);
  });
};

// ---------- Проверка ачивок ----------
window.checkAchievements = function() {
  window.ACHIEVEMENTS.forEach(a => {
    if (!state.achievements[a.id] && a.check(state)) {
      state.achievements[a.id] = true;
      showToast('🏆 Ачивка: ' + a.name, 'gold');
      saveGame();
    }
  });
};