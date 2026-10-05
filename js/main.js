// ============ ТОЧКА ВХОДА ============
(function() {
  'use strict';

  console.log('[main.js] старт');

  // ---------- 1. Кнопка сброса ----------
  const resetBtn = document.getElementById('btnReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Точно сбросить весь прогресс? Бабки исчезнут, схема накроется.')) {
        try {
          localStorage.removeItem('temshchik_save_v3');
          localStorage.removeItem('temshchik_casino');
        } catch(e) {}
        location.reload();
      }
    });
  }

  // ---------- 2. Загрузка ----------
  try { loadGame(); } catch (e) { console.error('[main.js] loadGame:', e); }

  // ---------- 3. Инициализация ----------
  const safeCall = (name, fn) => {
    try {
      if (typeof fn === 'function') { fn(); console.log('[main.js] ' + name + ' OK'); }
      else console.warn('[main.js] ' + name + ' — не функция');
    } catch (e) { console.error('[main.js] ' + name + ':', e); }
  };

  safeCall('initAudio', window.initAudio);
  safeCall('initScreens', window.initScreens);
  safeCall('initStoryClicks', window.initStoryClicks);
  safeCall('initPrestige', window.initPrestige);
  safeCall('initCasino', window.initCasino);
  safeCall('renderUpgrades', window.renderUpgrades);
  safeCall('renderAchievements', window.renderAchievements);
  safeCall('updateStats', window.updateStats);
  safeCall('updatePrestigeScreen', window.updatePrestigeScreen);

  // ---------- 4. Клик МУТИТЬ ----------
  const btn = document.getElementById('btnMutit');
  const btnImg = document.getElementById('btnMutitImg');

  if (btn) {
    btn.addEventListener('click', (e) => {
      try {
        const earned = getEffectivePerClick();
        state.money += earned;
        state.totalEarned += earned;
        state.totalClicks++;
        state.respect += 1;

        playSound('click');

        const rect = btn.getBoundingClientRect();
        const x = e.clientX || (rect.left + rect.width / 2);
        const y = e.clientY || (rect.top + rect.height / 2);
        showFloatingNumber(earned, x, y);

        if (btnImg && !btnImg.dataset.fallback) {
          const orig = btnImg.src;
          btnImg.src = 'assets/ui/btn-mutit-pressed.png';
          btnImg.onerror = () => { btnImg.dataset.fallback = '1'; btnImg.src = orig; };
          setTimeout(() => { if (btnImg.dataset.fallback !== '1') btnImg.src = orig; }, 100);
        }

        if (state.totalClicks % 7 === 0) {
          const phrases = ['Опа!','В теме','Заработал','Барыга','Кручу','Схема работает','+кэш','Держи краба'];
          showToast(phrases[Math.floor(Math.random() * phrases.length)]);
        }

        updateStats();
        renderUpgrades();
        checkAchievements();
        updatePrestigeScreen();
      } catch (err) { console.error('[main.js] клик:', err); }
    });
  }

  // ---------- 5. Игровой цикл ----------
  setInterval(() => {
    try {
      if (state.perSecond > 0) {
        const income = getEffectivePerSecond() / 10;
        state.money += income;
        state.totalEarned += income;
        updateStats();
      }
    } catch (e) {}
  }, 100);

  // ---------- 6. Автосохранение ----------
  setInterval(() => { try { saveGame(); } catch (e) {} }, 5000);
  window.addEventListener('beforeunload', () => { try { saveGame(); } catch (e) {} });

  // ---------- 7. События ----------
  safeCall('startKryshaTimer', window.startKryshaTimer);
  safeCall('startRandomEvents', window.startRandomEvents);
  safeCall('startFightTimer', window.startFightTimer);

  // ---------- 8. Стартовое сохранение ----------
  setTimeout(() => {
    try { saveGame(); } catch (e) {}
    try {
      if (window.audioSettings && window.audioSettings.musicOn) {
        window.playMusic && window.playMusic();
      }
    } catch (e) {}
  }, 1500);

  // ---------- 9. Регулярная перерисовка ----------
  setInterval(() => {
    try {
      const shop = document.getElementById('screen-shop');
      if (shop && shop.classList.contains('active')) renderUpgrades();

      const casino = document.getElementById('screen-casino');
      if (casino && casino.classList.contains('active')) {
        const balEl = document.getElementById('casinoBalance');
        if (balEl) balEl.textContent = formatMoney(state.money);
        if (window.casinoState && !casinoState.spinning && casinoState.currentBet > state.money && state.money >= 100) {
          casinoState.currentBet = Math.max(100, Math.floor(state.money / 2));
          if (typeof updateBetUI === 'function') updateBetUI();
        }
      }
    } catch (e) {}
  }, 800);

  console.log('[main.js] инициализация завершена');
})();