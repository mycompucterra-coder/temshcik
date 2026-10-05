// ============ СЮЖЕТ-ДИАЛОГИ ============
let storyQueue = [];
let currentStory = null;
let currentLineIndex = 0;
let typewriterTimer = null;
let isTyping = false;

// ---------- Запуск главы ----------
window.triggerStory = function(upgradeId) {
  const chapter = window.STORY.find(s => s.trigger === upgradeId);
  if (!chapter) return;
  if (state.storyDone[chapter.id]) return;

  storyQueue.push(chapter);
  if (!currentStory) showNextStory();
};

// ---------- Показ следующей главы ----------
function showNextStory() {
  if (storyQueue.length === 0) {
    currentStory = null;
    return;
  }
  currentStory = storyQueue.shift();
  currentLineIndex = 0;

  $('#storyChapter').textContent = currentStory.chapter;
  $('#storyTitleSm').textContent = currentStory.title;

  const bgEl = $('#storyBg');
  bgEl.style.backgroundImage = `url('${currentStory.bg}')`;

  const ill = $('#storyIllustration');
  ill.classList.remove('has-image');
  ill.style.backgroundImage = '';
  const testImg = new Image();
  testImg.onload = () => {
    ill.style.backgroundImage = `url('${currentStory.illustration}')`;
    ill.classList.add('has-image');
  };
  testImg.src = currentStory.illustration;

  $('#storyFinal').classList.add('hidden');
  $('#storyHint').classList.remove('hidden');

  const modal = $('#modalStory');
  modal.classList.remove('hidden');
  activeModal = modal;

  showLine(0);
}

// ---------- Показ реплики ----------
function showLine(index) {
  if (!currentStory) return;
  const line = currentStory.lines[index];
  if (!line) {
    showFinal();
    return;
  }

  $('#storyName').textContent = line.name;

  const avatarImg = $('#storyAvatar');
  const avatarFallback = $('#storyAvatarFallback');
  const avatars = currentStory.avatars || {};
  const av = avatars[line.speaker] || { emoji: '🧑' };

  avatarImg.classList.remove('loaded');
  avatarImg.src = '';
  avatarImg.onerror = () => {
    avatarImg.classList.remove('loaded');
    avatarFallback.style.display = 'flex';
    avatarFallback.textContent = av.emoji || '🧑';
  };
  avatarImg.onload = () => {
    avatarImg.classList.add('loaded');
    avatarFallback.style.display = 'none';
  };
  avatarImg.src = av.file;
  avatarFallback.style.display = 'flex';
  avatarFallback.textContent = av.emoji || '🧑';

  $('#storyDialogue').classList.remove('right');

  typewrite(line.text);
}

// ---------- Печатная машинка ----------
function typewrite(text) {
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
  }

  const textEl = $('#storyText');
  const cursorEl = $('#storyCursor');
  textEl.textContent = '';
  cursorEl.classList.remove('hidden');
  isTyping = true;

  let i = 0;
  const speed = 22;

  typewriterTimer = setInterval(() => {
    if (i >= text.length) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
      isTyping = false;
      cursorEl.classList.add('hidden');
      return;
    }
    textEl.textContent += text.charAt(i);
    i++;
  }, speed);
}

// ---------- Финал главы ----------
function showFinal() {
  $('#storyHint').classList.add('hidden');
  const finalEl = $('#storyFinal');
  finalEl.classList.remove('hidden');

  const rewardEl = $('#storyReward');
  rewardEl.innerHTML = `<b>🎁 Награда:</b> ${currentStory.reward.desc}`;

  const nextBtn = $('#storyNext');
  nextBtn.onclick = (e) => {
    e.stopPropagation();
    applyStoryReward(currentStory);
    state.storyDone[currentStory.id] = true;
    saveGame();

    $('#modalStory').classList.add('hidden');
    activeModal = null;
    currentStory = null;
    currentLineIndex = 0;

    updateStats();
    renderAchievements();

    setTimeout(showNextStory, 300);
  };
}

// ---------- Награда ----------
function applyStoryReward(chapter) {
  const r = chapter.reward;
  if (r.respect) state.respect += r.respect;
  if (r.perClickBonus) state.storyBonuses.perClickBonus += r.perClickBonus;
  if (r.perSecondBonus) state.storyBonuses.perSecondBonus += r.perSecondBonus;
  if (r.totalBonus) state.storyBonuses.totalBonus += r.totalBonus;

  // звук фанфар
  playSound('chapter');

  showToast('📖 Глава пройдена: ' + chapter.title, 'story');
}

// ---------- Клик по модалке ----------
window.initStoryClicks = function() {
  const modal = $('#modalStory');
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'storyNext') return;
    if (!$('#storyFinal').classList.contains('hidden')) return;

    if (isTyping) {
      if (typewriterTimer) {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
      }
      isTyping = false;
      $('#storyText').textContent = currentStory.lines[currentLineIndex].text;
      $('#storyCursor').classList.add('hidden');
      return;
    }

    currentLineIndex++;
    showLine(currentLineIndex);
  });
};