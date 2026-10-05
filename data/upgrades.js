// ============ СПИСОК АПГРЕЙДОВ ============
window.UPGRADES = [
  {
    id: 'phone',
    name: 'Телефон',
    icon: 'assets/upgrades/up-phone.png',
    fallbackEmoji: '📱',
    basePrice: 50,
    effect: { type: 'perClick', value: 1 },
    desc: '+1 за клик',
    count: 0,
    requires: null,
    requiresCount: 0
  },
  {
    id: 'sim',
    name: 'Симка',
    icon: 'assets/upgrades/up-sim.png',
    fallbackEmoji: '📶',
    basePrice: 200,
    effect: { type: 'perClick', value: 5 },
    desc: '+5 за клик',
    count: 0,
    requires: 'phone',
    requiresCount: 25
  },
  {
    id: 'dealer',
    name: 'Барыга',
    icon: 'assets/upgrades/up-dealer.png',
    fallbackEmoji: '🧑',
    basePrice: 500,
    effect: { type: 'perSecond', value: 1 },
    desc: '+1 в секунду',
    count: 0,
    requires: 'sim',
    requiresCount: 25
  },
  {
    id: 'point',
    name: 'Точка',
    icon: 'assets/upgrades/up-point.png',
    fallbackEmoji: '🏪',
    basePrice: 2000,
    effect: { type: 'perSecond', value: 10 },
    desc: '+10 в секунду',
    count: 0,
    requires: 'dealer',
    requiresCount: 25
  },
  {
    id: 'scheme',
    name: 'Схема',
    icon: 'assets/upgrades/up-scheme.png',
    fallbackEmoji: '🕳️',
    basePrice: 10000,
    effect: { type: 'multiplier', value: 2 },
    desc: 'множитель x2 (одноразово)',
    count: 0,
    requires: 'point',
    requiresCount: 25
  }
];

// ============ СПИСОК АЧИВОК ============
window.ACHIEVEMENTS = [
  { id:'firstK',  name:'Первый косарь', desc:'1000 ₽',       icon:'assets/achievements/ach-firstk.png',  emoji:'🥉', check:(s)=> s.money >= 1000 },
  { id:'fiftyK',  name:'Полтос',        desc:'50 000 ₽',     icon:'assets/achievements/ach-fiftyk.png',  emoji:'🥈', check:(s)=> s.money >= 50000 },
  { id:'million', name:'Лям',           desc:'1 000 000 ₽',  icon:'assets/achievements/ach-million.png', emoji:'🥇', check:(s)=> s.money >= 1000000 },
  { id:'clicks100', name:'Кликов 100',  desc:'100 кликов',   icon:'assets/achievements/ach-clicks.png',  emoji:'👆', check:(s)=> s.totalClicks >= 100 },
  { id:'prestige1', name:'Первый переезд', desc:'1 хата',    icon:'assets/achievements/ach-prestige.png', emoji:'🏠', check:(s)=> s.prestigeLevel >= 1 }
];

// ============ СИМВОЛЫ КАЗИНО ============
// weight — вес выпадения (чем больше, тем чаще)
// payout — множитель ставки при выпадении 3-х таких подряд
// kind — 'good' | 'bad' | 'neutral'
window.CASINO_SYMBOLS = [
  { id:'cherry',  emoji:'🍒', icon:'assets/casino/sym-cherry.png',  weight:25, payout:50, kind:'good', name:'Вишня' },
  { id:'lemon',   emoji:'🍋', icon:'assets/casino/sym-lemon.png',   weight:20, payout:3,  kind:'good', name:'Лимон' },
  { id:'money',   emoji:'💰', icon:'assets/casino/sym-money.png',   weight:18, payout:5,  kind:'good', name:'Бабки' },
  { id:'diamond', emoji:'💎', icon:'assets/casino/sym-diamond.png', weight:15, payout:10, kind:'good', name:'Алмаз' },
  { id:'seven',   emoji:'7️⃣', icon:'assets/casino/sym-seven.png',   weight:12, payout:20, kind:'good', name:'Семёрка' },
  { id:'cop',     emoji:'👮', icon:'assets/casino/sym-cop.png',     weight:6,  payout:0.5, kind:'bad', name:'Мент' },
  { id:'skull',   emoji:'💀', icon:'assets/casino/sym-skull.png',   weight:4,  payout:0,  kind:'bad', name:'Череп' }
];

// ============ СЮЖЕТНЫЕ ГЛАВЫ (диалоги) ============
window.STORY = [
  {
    id: 'ch1',
    trigger: 'phone',
    chapter: 'ГЛАВА 1',
    title: 'Первый движ',
    bg: 'assets/story/bg/dlg-lavka.png',
    illustration: 'assets/story/ch1-phone.png',
    fallbackEmoji: '📱',
    avatars: {
      hero:     { file: 'assets/story/face-hero.png',     emoji: '🧑' },
      gosha:    { file: 'assets/story/face-gosha.png',    emoji: '😏' },
      stranger: { file: 'assets/story/face-stranger.png', emoji: '🕴' },
      cop:      { file: 'assets/story/face-cop.png',      emoji: '👮' }
    },
    lines: [
      { speaker:'hero',  name:'Тёма', text:'Ну чё, опять лавка, опять падик... А бабок нет.' },
      { speaker:'hero',  name:'Тёма', text:'Телефон старый, кнопочный. Но зато свой.' },
      { speaker:'gosha', name:'Гоша', text:'Э, слышь! Ты в теме?' },
      { speaker:'hero',  name:'Тёма', text:'Смотря какая тема, братан. Говори.' },
      { speaker:'gosha', name:'Гоша', text:'Симки нужны. Много. Найдёшь — озолотишься.' },
      { speaker:'hero',  name:'Тёма', text:'Хм... Симки, значит. Ну, попробуем.' },
      { speaker:'hero',  name:'Тёма', text:'В голове уже крутится схема...' }
    ],
    reward: { respect: 200, perClickBonus: 0.05, desc: '+200 уважения, +5% к клику навсегда' }
  },
  {
    id: 'ch2',
    trigger: 'sim',
    chapter: 'ГЛАВА 2',
    title: 'Точка на районе',
    bg: 'assets/story/bg/dlg-lavka.png',
    illustration: 'assets/story/ch2-sim.png',
    fallbackEmoji: '📶',
    avatars: {
      hero:     { file: 'assets/story/face-hero.png',     emoji: '🧑' },
      gosha:    { file: 'assets/story/face-gosha.png',    emoji: '😏' },
      stranger: { file: 'assets/story/face-stranger.png', emoji: '🕴' },
      cop:      { file: 'assets/story/face-cop.png',      emoji: '👮' }
    },
    lines: [
      { speaker:'hero',  name:'Тёма', text:'Прошла неделя. Уже не пацан с лавки — человек с симками.' },
      { speaker:'hero',  name:'Тёма', text:'Пять точек, десять, двадцать... Дело пошло.' },
      { speaker:'gosha', name:'Гоша', text:'Слышь, темщик. Есть барыга один, крутится у метро.' },
      { speaker:'hero',  name:'Тёма', text:'И чё с ним?' },
      { speaker:'gosha', name:'Гоша', text:'Говорят, ищет людей. Может, сведём?' },
      { speaker:'hero',  name:'Тёма', text:'Веди. Хуже не будет.' },
      { speaker:'hero',  name:'Тёма', text:'Схема складывается: симки → барыга → точки. Масштаб!' }
    ],
    reward: { respect: 500, perSecondBonus: 0.10, desc: '+500 уважения, +10% к доходу/сек навсегда' }
  },
  {
    id: 'ch3',
    trigger: 'dealer',
    chapter: 'ГЛАВА 3',
    title: 'Свои люди',
    bg: 'assets/story/bg/dlg-garage.png',
    illustration: 'assets/story/ch3-dealer.png',
    fallbackEmoji: '🧑',
    avatars: {
      hero:     { file: 'assets/story/face-hero.png',     emoji: '🧑' },
      gosha:    { file: 'assets/story/face-gosha.png',    emoji: '😏' },
      stranger: { file: 'assets/story/face-stranger.png', emoji: '🕴' },
      cop:      { file: 'assets/story/face-cop.png',      emoji: '👮' }
    },
    lines: [
      { speaker:'hero',  name:'Тёма', text:'Барыга оказался нормальным мужиком. Зовут Гоша.' },
      { speaker:'hero',  name:'Тёма', text:'Работает чётко, не борзеет. Через месяц — три барыги, все свои.' },
      { speaker:'gosha', name:'Гоша', text:'Слушай, брат. У метро гараж пустой стоит. Хозяин уехал.' },
      { speaker:'gosha', name:'Гоша', text:'Может, займём? Точка простаивает.' },
      { speaker:'hero',  name:'Тёма', text:'А мусора?' },
      { speaker:'gosha', name:'Гоша', text:'Мусора не в курсе. Пока.' },
      { speaker:'hero',  name:'Тёма', text:'Ладно. Точка — это уже серьёзно. Готовь.' }
    ],
    reward: { respect: 1000, totalBonus: 0.15, desc: '+1000 уважения, +15% к общему доходу навсегда' }
  },
  {
    id: 'ch4',
    trigger: 'point',
    chapter: 'ГЛАВА 4',
    title: 'Схема',
    bg: 'assets/story/bg/dlg-garage.png',
    illustration: 'assets/story/ch4-point.png',
    fallbackEmoji: '🏪',
    avatars: {
      hero:     { file: 'assets/story/face-hero.png',     emoji: '🧑' },
      gosha:    { file: 'assets/story/face-gosha.png',    emoji: '😏' },
      stranger: { file: 'assets/story/face-stranger.png', emoji: '🕴' },
      cop:      { file: 'assets/story/face-cop.png',      emoji: '👮' }
    },
    lines: [
      { speaker:'hero',  name:'Тёма', text:'Точка работает. Днём — ремонт телефонов, ночью — совсем другое.' },
      { speaker:'hero',  name:'Тёма', text:'Меня уже знают в районе. Уважают.' },
      { speaker:'gosha', name:'Гоша', text:'Слышь, брат. Проблема. Менты пришли к соседу, спрашивали про нас.' },
      { speaker:'hero',  name:'Тёма', text:'И чё теперь?' },
      { speaker:'gosha', name:'Гоша', text:'Либо в тень уходить, либо расширяться. Чтобы прикрывали свои. Понимаешь?' },
      { speaker:'hero',  name:'Тёма', text:'Понял. Готовь схему. Будем крышу строить.' }
    ],
    reward: { respect: 2000, perClickBonus: 0.20, desc: '+2000 уважения, +20% к клику навсегда' }
  },
  {
    id: 'ch5',
    trigger: 'scheme',
    chapter: 'ГЛАВА 5',
    title: 'Выход на новый уровень',
    bg: 'assets/story/bg/dlg-garage.png',
    illustration: 'assets/story/ch5-scheme.png',
    fallbackEmoji: '🕳️',
    avatars: {
      hero:     { file: 'assets/story/face-hero.png',     emoji: '🧑' },
      gosha:    { file: 'assets/story/face-gosha.png',    emoji: '😏' },
      stranger: { file: 'assets/story/face-stranger.png', emoji: '🕴' },
      cop:      { file: 'assets/story/face-cop.png',      emoji: '👮' }
    },
    lines: [
      { speaker:'hero',  name:'Тёма', text:'Схема разрослась на весь район. Знаю всех, меня знают все.' },
      { speaker:'hero',  name:'Тёма', text:'Но денег всё равно мало. Есть потолок, который в спальнике не пробить.' },
      { speaker:'stranger', name:'Незнакомец', text:'Мне сказали, ты умеешь решать вопросы.' },
      { speaker:'hero',  name:'Тёма', text:'Смотря какие. Ты вообще кто?' },
      { speaker:'stranger', name:'Незнакомец', text:'Неважно. Есть предложение. Большое.' },
      { speaker:'stranger', name:'Незнакомец', text:'Но сначала — переезжай. Здесь тебе тесно.' },
      { speaker:'hero',  name:'Тёма', text:'Хм. И куда переезжать?' },
      { speaker:'stranger', name:'Незнакомец', text:'Визитка на столе. Там адрес.' },
      { speaker:'hero',  name:'Тёма', text:'Пора свалить из спальника. Начинается что-то серьёзное...' }
    ],
    reward: { respect: 5000, totalBonus: 1.0, desc: '+5000 уважения, +100% к общему доходу навсегда. Открыт переезд!' }
  }
];