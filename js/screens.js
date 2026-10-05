// ============ ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ ============
window.switchScreen = function(name) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + name);
  if (target) target.classList.add('active');

  $$('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.screen === name);
  });

  if (name === 'shop') renderUpgrades();
  if (name === 'achieve') renderAchievements();
  if (name === 'prestige') updatePrestigeScreen();
  updateStats();
};

window.initScreens = function() {
  $$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.screen));
  });
  $$('.icon-btn[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.screen));
  });
  $('#btnOpenSettings').addEventListener('click', () => switchScreen('settings'));
};