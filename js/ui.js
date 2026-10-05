// ============ UI-УТИЛИТЫ ============
window.$ = (sel, root=document) => root.querySelector(sel);
window.$$ = (sel, root=document) => [...root.querySelectorAll(sel)];

// ---------- Обновление верхней панели ----------
window.updateStats = function() {
  const effClick = getEffectivePerClick();
  const effSec = getEffectivePerSecond();

  $('#uiBalance').textContent = formatMoney(state.money);
  $('#uiPerClick').textContent = '+' + formatMoney(effClick).replace(' ₽','') + ' ₽';
  $('#uiPerSecond').textContent = '+' + formatMoney(effSec).replace(' ₽','') + ' ₽';
  $('#uiMultiplier').textContent = 'x' + (state.multiplier * state.prestigeMult).toFixed(1).replace(/\.0$/,'');
  $('#uiRespect').textContent = formatNum(state.respect);

  // экран статы
  const tc = $('#uiTotalClicks'); if (tc) tc.textContent = formatNum(state.totalClicks);
  const te = $('#uiTotalEarned'); if (te) te.textContent = formatMoney(state.totalEarned);
  const pl = $('#uiPrestigeLevel'); if (pl) pl.textContent = state.prestigeLevel;
  const pm = $('#uiPrestigeMult'); if (pm) pm.textContent = 'x' + state.prestigeMult.toFixed(1).replace(/\.0$/,'');
  const cb = $('#uiCopsBeaten'); if (cb) cb.textContent = state.copsBeaten;
  const kp = $('#uiKryshaPaid'); if (kp) kp.textContent = state.kryshaPaid;
  const sp = $('#uiStoryProgress');
  if (sp) sp.textContent = Object.keys(state.storyDone).length + ' / ' + window.STORY.length;

  // престиж-экран
  const pl2 = $('#uiPrestigeLevel2'); if (pl2) pl2.textContent = state.prestigeLevel;
  const pm2 = $('#uiPrestigeMult2'); if (pm2) pm2.textContent = 'x' + state.prestigeMult.toFixed(1).replace(/\.0$/,'');
};

// ---------- Всплывающее число ----------
window.showFloatingNumber = function(amount, x, y) {
  const layer = $('#floatLayer');
  if (!layer) return;
  const el = document.createElement('div');
  el.className = 'float-money';
  el.textContent = '+' + formatMoney(amount).replace(' ₽','') + ' ₽';
  const rect = layer.getBoundingClientRect();
  el.style.left = (x - rect.left - 30) + 'px';
  el.style.top  = (y - rect.top - 20) + 'px';
  layer.appendChild(el);
  setTimeout(() => el.remove(), 800);
};

// ---------- Тост ----------
window.showToast = function(text, type='') {
  const layer = $('#toastLayer');
  if (!layer) return;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = text;
  layer.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.3s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 3000);
};

// ---------- Красная вспышка ----------
window.flashRed = function() {
  const el = document.createElement('div');
  el.className = 'flash-red';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 500);
};