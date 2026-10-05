/* Clinic content: directions, services, doctors */
window.CLINIC = {
  phone: '+998954341010',
  phoneLabel: '+998 95 434 10 10',

  // YouTube Shorts from https://www.youtube.com/@Complexmeduz
  // type: 'tips' — shifokor maslahatlari, 'reviews' — bemorlar fikri / klinika hayoti
  videos: [
    { id: 'esuHeCVDdRY', type: 'tips',    title: { uz: 'Nimaga uyqu sifati buziladi?', ru: 'Почему нарушается качество сна?' } },
    { id: 'hAo4DibhMvM', type: 'reviews', title: { uz: 'Har kuni yuzlab bemorlar bizga ishonadi', ru: 'Каждый день сотни пациентов доверяют нам' } },
    { id: 'bFNZs9Ky3c0', type: 'tips',    title: { uz: "99% bemorlar kasallik tanasida borligini bilmaydi", ru: '99% пациентов не знают о своей болезни' } },
    { id: 'FD0MXUJW9yI', type: 'reviews', title: { uz: "Qozog'istondan kelgan bemorimiz", ru: 'Наш пациент из Казахстана' } },
    { id: 'L2RH1559WP4', type: 'tips',    title: { uz: "Farzandingiz sog'ligi birinchi o'rinda bo'lsin", ru: 'Здоровье ребёнка — на первом месте' } },
    { id: 'Ddj4oFL5e54', type: 'tips',    title: { uz: "Migren (bosh og'rig'i) belgilari", ru: 'Признаки мигрени (головной боли)' } },
    { id: 'bSfK0jXmCiE', type: 'reviews', title: { uz: 'Bemorlarimiz uchun doim eng yaxshisi', ru: 'Для наших пациентов — только лучшее' } },
    { id: 'gWw5CV6KekI', type: 'tips',    title: { uz: 'Qandli diabetning asoratlari', ru: 'Осложнения сахарного диабета' } },
    { id: 'KJ0ADhWXKvA', type: 'tips',    title: { uz: 'Buyrakni ishdan chiqaruvchi omillar', ru: 'Факторы, разрушающие почки' } },
    { id: 'URinkJaH3QU', type: 'reviews', title: { uz: 'Bemorimizning samimiy fikrlari', ru: 'Искренний отзыв нашего пациента' } },
    { id: '7EcM94F2Jjw', type: 'tips',    title: { uz: 'Infarktning belgilari', ru: 'Признаки инфаркта' } }
  ],

  directions: [
    { key: 'cardio', icon: 'heart' },
    { key: 'endo', icon: 'droplet' },
    { key: 'rheum', icon: 'bone' },
    { key: 'nephro', icon: 'kidney' },
    { key: 'gastro', icon: 'stomach' },
    { key: 'therapy', icon: 'stethoscope' },
    { key: 'allergy', icon: 'flower' },
    { key: 'ent', icon: 'ear' },
    { key: 'neuro', icon: 'brain' },
    { key: 'uzi', icon: 'scan' }
  ],

  services: [
    { key: 'inpatient', icon: 'bed' },
    { key: 'lab', icon: 'flask' },
    { key: 'physio', icon: 'zap' },
    { key: 'ecg', icon: 'activity' },
    { key: 'eeg', icon: 'brain' },
    { key: 'echoeg', icon: 'waves' },
    { key: 'egds', icon: 'stomach' },
    { key: 'colpo', icon: 'microscope' },
    { key: 'massage', icon: 'hand' }
  ],

  // Filter tags shown as chips
  tags: {
    cardio:   { uz: 'Kardiolog',        ru: 'Кардиолог' },
    rheum:    { uz: 'Revmatolog',       ru: 'Ревматолог' },
    nephro:   { uz: 'Nefrolog',         ru: 'Нефролог' },
    endo:     { uz: 'Endokrinolog',     ru: 'Эндокринолог' },
    gastro:   { uz: 'Gastroenterolog',  ru: 'Гастроэнтеролог' },
    therapy:  { uz: 'Terapevt',         ru: 'Терапевт' },
    allergy:  { uz: 'Allergolog',       ru: 'Аллерголог' },
    ent:      { uz: 'LOR',              ru: 'ЛОР' },
    neuro:    { uz: 'Nevrolog',         ru: 'Невролог' },
    derm:     { uz: 'Dermatovenerolog', ru: 'Дерматовенеролог' }
  },

  quals: {
    high:  { uz: 'Oliy toifali shifokor',        ru: 'Врач высшей категории' },
    second:{ uz: 'Ikkinchi toifali shifokor',    ru: 'Врач второй категории' },
    third: { uz: 'Uchinchi toifali shifokor',    ru: 'Врач третьей категории' },
    dms:   { uz: 'Tibbiyot fanlari doktori',     ru: 'Доктор медицинских наук' },
    prof:  { uz: 'Professor',                    ru: 'Профессор медицинских наук' },
    cms:   { uz: 'Tibbiyot fanlari nomzodi',     ru: 'Кандидат медицинских наук' }
  },

  // schedule: true = Mon–Sat 08:30–17:00, false = by phone
  // photo/photoPos — portrait + focal point for the round crop; site — doctor's personal website
  doctors: [
    {
      name: { uz: 'Jabborov Azim Ataxanovich', ru: 'Жабборов Азим Атаханович' },
      spec: { uz: 'Kardiolog, Revmatolog, Nefrolog', ru: 'Кардиолог, Ревматолог, Нефролог' },
      tags: ['cardio', 'rheum', 'nephro'],
      kids: false, quals: ['high', 'dms', 'prof'], exp: 36, reviews: 20, schedule: true
    },
    {
      name: { uz: 'Sattorov Izzat Sharifovich', ru: 'Сатторов Иззат Шарифович' },
      spec: { uz: 'Otorinolaringolog-jarroh, LOR', ru: 'Отоларинголог-хирург, ЛОР (отоларинголог)' },
      tags: ['ent'],
      kids: true, quals: ['second'], exp: 7, reviews: 0, schedule: true
    },
    {
      name: { uz: 'Abidova Dildora Xasanovna', ru: 'Абидова Дилдора Хасановна' },
      spec: { uz: 'Endokrinolog', ru: 'Эндокринолог' },
      tags: ['endo'],
      kids: false, quals: [], exp: 7, reviews: 0, schedule: true,
      photo: 'assets/doctors/abidova-dildora.jpg', photoPos: '50% 40%',
      site: 'https://endokrinolog-dildora.uz/'
    },
    {
      name: { uz: 'Maxmudov Ezoz Maxsudovich', ru: 'Махмудов Эзоз Махсудович' },
      spec: { uz: 'Nevrolog, Nevropatolog', ru: 'Невролог, Невропатолог' },
      tags: ['neuro'],
      kids: true, quals: ['third'], exp: 6, reviews: 0, schedule: true
    },
    {
      name: { uz: 'Arzikulova Mukaddas Tashpulatovna', ru: 'Арзикулова Мукаддас Ташпулатовна' },
      spec: { uz: 'Kardiolog', ru: 'Кардиолог' },
      tags: ['cardio'],
      kids: true, quals: ['high'], exp: 38, reviews: 7, schedule: true
    },
    {
      name: { uz: 'Abidova Iroda Xasanovna', ru: 'Абидова Ирода Хасановна' },
      spec: { uz: 'Gastroenterolog, Terapevt', ru: 'Гастроэнтеролог, Терапевт' },
      tags: ['gastro', 'therapy'],
      kids: false, quals: ['cms'], exp: 9, reviews: 0, schedule: true
    },
    {
      name: { uz: 'Axmedov Xushnud Saparbayevich', ru: 'Ахмедов Хушнуд Сапарбаевич' },
      spec: { uz: 'Allergolog', ru: 'Аллерголог' },
      tags: ['allergy'],
      kids: true, quals: ['high'], exp: 22, reviews: 38, schedule: true,
      photo: 'assets/doctors/axmedov-xushnud.jpg', photoPos: '50% 40%',
      site: 'https://allergolog-ahmedov.uz/'
    },
    {
      name: { uz: 'Salohova Dilorom Nigmatjonovna', ru: 'Салохова Дилором Нигматжоновна' },
      spec: { uz: 'Dermatovenerolog', ru: 'Дерматовенеролог' },
      tags: ['derm'],
      kids: false, quals: [], exp: null, reviews: 0, schedule: false
    },
    {
      name: { uz: 'Yodgarova Umida Gaybullayevna', ru: 'Ёдгарова Умида Гайбуллаевна' },
      spec: { uz: 'Nevrolog', ru: 'Невролог' },
      tags: ['neuro'],
      kids: false, quals: ['dms'], exp: 14, reviews: 0, schedule: false
    },
    {
      name: { uz: 'Rahmatullina Gulnara Mitxatovna', ru: 'Рахматуллина Гульнара Митхатовна' },
      spec: { uz: 'Nevrolog', ru: 'Невролог' },
      tags: ['neuro'],
      kids: false, quals: [], exp: null, reviews: 1, schedule: false
    },
    {
      name: { uz: 'Soliyev Avazbek Alijonovich', ru: 'Солиев Авазбек Алижонович' },
      spec: { uz: 'Nevrolog, Funksional diagnostika shifokori', ru: 'Невролог, Врач функциональной диагностики' },
      tags: ['neuro'],
      kids: false, quals: ['high'], exp: 23, reviews: 1, schedule: false
    }
  ]
};
