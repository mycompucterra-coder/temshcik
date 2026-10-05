// ============ ЗВУК ============
// Управление звуками через Web Audio API с fallback на <audio>.
// Настройки (вкл/выкл, громкость, музыка) хранятся в localStorage.

const AUDIO_SETTINGS_KEY = 'temshchik_audio';

// Настройки звука
window.audioSettings = {
  soundOn: true,
  musicOn: false,
  volume: 0.7
};

// Кэш AudioBuffer'ов (для Web Audio)
const audioBuffers = {};
// Кэш HTMLAudioElement (fallback)
const audioElements = {};
// Фоновая музыка
let musicElement = null;
// Web Audio Context (создаётся лениво после первого действия пользователя)
let audioCtx = null;

// ---------- Инициализация ----------
window.initAudio = function() {
  // Загружаем настройки
  try {
    const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (typeof saved.soundOn === 'boolean') audioSettings.soundOn = saved.soundOn;
      if (typeof saved.musicOn === 'boolean') audioSettings.musicOn = saved.musicOn;
      if (typeof saved.volume === 'number') audioSettings.volume = Math.max(0, Math.min(1, saved.volume));
    }
  } catch (e) {
    console.warn('[audio] не удалось загрузить настройки', e);
  }

  // Обновляем UI кнопок
  updateSoundUI();

  // Навешиваем обработчики
  const btnMute = document.getElementById('btnMute');
  const btnMusic = document.getElementById('btnMusic');
  const volumeSlider = document.getElementById('volumeSlider');

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      audioSettings.soundOn = !audioSettings.soundOn;
      saveAudioSettings();
      updateSoundUI();
    });
  }

  if (btnMusic) {
    btnMusic.addEventListener('click', () => {
      audioSettings.musicOn = !audioSettings.musicOn;
      saveAudioSettings();
      updateSoundUI();
      if (audioSettings.musicOn) playMusic();
      else stopMusic();
    });
  }

  if (volumeSlider) {
    volumeSlider.value = Math.round(audioSettings.volume * 100);
    const volumeValue = document.getElementById('volumeValue');
    if (volumeValue) volumeValue.textContent = Math.round(audioSettings.volume * 100);
    volumeSlider.addEventListener('input', (e) => {
      audioSettings.volume = Math.max(0, Math.min(1, e.target.value / 100));
      if (volumeValue) volumeValue.textContent = e.target.value;
      if (musicElement) musicElement.volume = audioSettings.volume * 0.5;
      saveAudioSettings();
    });
  }

  // Ленивое создание Web Audio Context (по первому взаимодействию)
  const resumeCtx = () => {
    if (!audioCtx) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
      } catch (e) { /* остаёмся на HTMLAudio */ }
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    document.removeEventListener('click', resumeCtx);
    document.removeEventListener('touchstart', resumeCtx);
  };
  document.addEventListener('click', resumeCtx);
  document.addEventListener('touchstart', resumeCtx);
};

// ---------- Сохранение настроек ----------
function saveAudioSettings() {
  try {
    localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(audioSettings));
  } catch (e) {}
}

// ---------- Обновление UI настроек звука ----------
function updateSoundUI() {
  const muteIcon = document.getElementById('muteIcon');
  const musicIcon = document.getElementById('musicIcon');
  const btnMute = document.getElementById('btnMute');
  const btnMusic = document.getElementById('btnMusic');

  if (muteIcon) muteIcon.textContent = audioSettings.soundOn ? '🔊' : '🔇';
  if (btnMute) btnMute.classList.toggle('muted', !audioSettings.soundOn);
  if (musicIcon) musicIcon.textContent = audioSettings.musicOn ? '🎵' : '🔕';
  if (btnMusic) btnMusic.classList.toggle('muted', !audioSettings.musicOn);
}

// ---------- Проигрывание звука ----------
window.playSound = function(name) {
  if (!audioSettings.soundOn) return;
  if (!name) return;

  const url = `assets/audio/${name}.mp3`;

  // Сначала пробуем Web Audio (если готов контекст и буфер уже загружен)
  if (audioCtx && audioBuffers[name]) {
    try {
      const src = audioCtx.createBufferSource();
      src.buffer = audioBuffers[name];
      const gain = audioCtx.createGain();
      gain.gain.value = audioSettings.volume;
      src.connect(gain).connect(audioCtx.destination);
      src.start(0);
      return;
    } catch (e) { /* fallback ниже */ }
  }

  // Fallback — HTMLAudio
  try {
    if (!audioElements[name]) {
      audioElements[name] = new Audio(url);
      audioElements[name].preload = 'auto';
    }
    const el = audioElements[name];
    el.volume = audioSettings.volume;
    el.currentTime = 0;
    const p = el.play();
    if (p && p.catch) p.catch(() => { /* автоплей блокируется — молча */ });
  } catch (e) { /* тихо */ }

  // Параллельно пытаемся подгрузить буфер в Web Audio (для следующего раза)
  if (audioCtx && !audioBuffers[name]) {
    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => audioCtx.decodeAudioData(buf))
      .then(decoded => { audioBuffers[name] = decoded; })
      .catch(() => {});
  }
};

// ---------- Фоновая музыка ----------
window.playMusic = function() {
  if (!audioSettings.musicOn) return;
  if (!musicElement) {
    musicElement = new Audio('assets/audio/bg.mp3');
    musicElement.loop = true;
    musicElement.preload = 'auto';
    musicElement.volume = audioSettings.volume * 0.5;
  }
  musicElement.volume = audioSettings.volume * 0.5;
  const p = musicElement.play();
  if (p && p.catch) p.catch(() => { /* автоплей блокируется */ });
};

window.stopMusic = function() {
  if (musicElement) {
    try { musicElement.pause(); } catch (e) {}
  }
};