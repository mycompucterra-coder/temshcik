// ============ СОСТОЯНИЕ ИГРЫ ============
const SAVE_KEY = 'temshchik_save_v3';

window.state = {
  money: 0,
  totalEarned: 0,
  perClick: 1,
  perSecond: 0,
  multiplier: 1,
  respect: 0,
  totalClicks: 0,
  copsBeaten: 0,
  kryshaPaid: 0,
  prestigeLevel: 0,
  prestigeMult: 1,
  achievements: {},
  storyDone: {},
  storyBonuses: {
    perClickBonus: 0,
    perSecondBonus: 0,
    totalBonus: 0
  }
};

// ---------- Форматирование чисел ----------
window.formatMoney = function(n) {
  if (n < 1000) return Math.floor(n) + ' ₽';
  if (n < 1e6) return trim(n/1000) + 'K ₽';
  if (n < 1e9) return trim(n/1e6) + 'M ₽';
  if (n < 1e12) return trim(n/1e9) + 'B ₽';
  return trim(n/1e12) + 'T ₽';
};
function trim(x) {
  return (Math.round(x * 10) / 10).toString().replace(/\.0$/, '');
}
window.formatNum = function(n) { return Math.floor(n).toLocaleString('ru-RU'); };

// ---------- Итоговые доходы ----------
window.getEffectivePerClick = function() {
  const base = state.perClick * (1 + state.storyBonuses.perClickBonus);
  return base * state.multiplier * state.prestigeMult * (1 + state.storyBonuses.totalBonus);
};
window.getEffectivePerSecond = function() {
  const base = state.perSecond * (1 + state.storyBonuses.perSecondBonus);
  return base * state.multiplier * state.prestigeMult * (1 + state.storyBonuses.totalBonus);
};

// ---------- Сохранение ----------
window.saveGame = function() {
  try {
    const data = {
      money: state.money,
      totalEarned: state.totalEarned,
      perClick: state.perClick,
      perSecond: state.perSecond,
      multiplier: state.multiplier,
      respect: state.respect,
      totalClicks: state.totalClicks,
      copsBeaten: state.copsBeaten,
      kryshaPaid: state.kryshaPaid,
      prestigeLevel: state.prestigeLevel,
      prestigeMult: state.prestigeMult,
      achievements: state.achievements,
      storyDone: state.storyDone,
      storyBonuses: state.storyBonuses,
      upgrades: window.UPGRADES.map(u => ({ id: u.id, count: u.count }))
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch(e) { console.warn('save error', e); }
};

// ---------- Загрузка ----------
window.loadGame = function() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw);

    state.money = d.money ?? 0;
    state.totalEarned = d.totalEarned ?? 0;
    state.perClick = d.perClick ?? 1;
    state.perSecond = d.perSecond ?? 0;
    state.multiplier = d.multiplier ?? 1;
    state.respect = d.respect ?? 0;
    state.totalClicks = d.totalClicks ?? 0;
    state.copsBeaten = d.copsBeaten ?? 0;
    state.kryshaPaid = d.kryshaPaid ?? 0;
    state.prestigeLevel = d.prestigeLevel ?? 0;
    state.prestigeMult = d.prestigeMult ?? 1;
    state.achievements = d.achievements ?? {};
    state.storyDone = d.storyDone ?? {};
    state.storyBonuses = d.storyBonuses ?? { perClickBonus:0, perSecondBonus:0, totalBonus:0 };

    if (Array.isArray(d.upgrades)) {
      d.upgrades.forEach(saved => {
        const u = window.UPGRADES.find(x => x.id === saved.id);
        if (u) u.count = saved.count ?? 0;
      });
    }
    return true;
  } catch(e) { console.warn('load error', e); return false; }
};

// ---------- Сброс ----------
window.resetGame = function() {
  try { localStorage.removeItem(SAVE_KEY); } catch(e) {}
  location.reload();
};