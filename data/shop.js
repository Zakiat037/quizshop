/**
 * QuizShop - Shop Progression, Provision Items & Ghanaian Leaderboard Data
 */

window.SHOP_LEVELS = [
  {
    level: 1,
    name: 'Table Shop',
    emoji: '🪵',
    upgradeCost: 0,
    tagline: 'Roadside wooden table selling chilled essentials',
    unlockText: 'Unlocks Sachet Water'
  },
  {
    level: 2,
    name: 'Container Shop',
    emoji: '📦',
    upgradeCost: 120,
    tagline: '20ft painted steel kiosk stocked for the neighbourhood',
    unlockText: 'Unlocks Rice Bag & Cooking Oil'
  },
  {
    level: 3,
    name: 'Mini Mart',
    emoji: '🏪',
    upgradeCost: 350,
    tagline: 'Bright air-cooled mart with aisles and chillers',
    unlockText: 'Unlocks Drinks Crate'
  },
  {
    level: 4,
    name: 'Supermarket',
    emoji: '🏬',
    upgradeCost: 750,
    tagline: 'Full-scale neighbourhood supermarket empire',
    unlockText: 'Unlocks Toiletries'
  }
];

window.SHOP_ITEMS = [
  {
    id: 'sachet_water',
    name: 'Sachet Water',
    emoji: '💧',
    cost: 20,
    profitPerMin: 1,
    unlockLevel: 1,
    desc: 'Ice-cold pure water sachets — always in demand!'
  },
  {
    id: 'rice_bag',
    name: 'Rice Bag',
    emoji: '🍚',
    cost: 100,
    profitPerMin: 5,
    unlockLevel: 2,
    desc: '5kg perfumed Jasmine rice bags for family kitchens.'
  },
  {
    id: 'cooking_oil',
    name: 'Cooking Oil',
    emoji: '🫗',
    cost: 150,
    profitPerMin: 7,
    unlockLevel: 2,
    desc: 'Golden vegetable cooking oil bottles for jollof & stew.'
  },
  {
    id: 'drinks_crate',
    name: 'Drinks Crate',
    emoji: '🥤',
    cost: 200,
    profitPerMin: 10,
    unlockLevel: 3,
    desc: '24-bottle chilled malt & soda crate for busy afternoons.'
  },
  {
    id: 'toiletries',
    name: 'Toiletries',
    emoji: '🧴',
    cost: 300,
    profitPerMin: 15,
    unlockLevel: 4,
    desc: 'Soaps, lotions, toothpaste & daily household packs.'
  }
];

window.AVATARS = [
  { id: 'trader_f', emoji: '👩🏾‍💼', label: 'Boss Lady' },
  { id: 'trader_m', emoji: '👨🏾‍💼', label: 'Chief Trader' },
  { id: 'scholar_f', emoji: '👩🏾‍🎓', label: 'Quiz Queen' },
  { id: 'scholar_m', emoji: '👨🏾‍🎓', label: 'Quiz King' },
  { id: 'lion', emoji: '🦁', label: 'Black Star' },
  { id: 'crown', emoji: '👑', label: 'Royalty' },
  { id: 'football', emoji: '⚽', label: 'Striker' },
  { id: 'drum', emoji: '🥁', label: 'Drummer' }
];

window.TOWNS = [
  { name: 'Accra', emoji: '🌊', vibe: 'Coastal Hub' },
  { name: 'Kumasi', emoji: '🌳', vibe: 'Garden City' },
  { name: 'Tamale', emoji: '☀️', vibe: 'Northern Star' },
  { name: 'Bolgatanga', emoji: '🧺', vibe: 'Craft Capital' }
];

// Top 20 Ghanaian players on the leaderboard (sorted dynamically with current player)
window.LEADERBOARD_PLAYERS = [
  { id: 'npc_1', name: 'Kwame Mensah', avatar: '👑', town: 'Accra', shopLevel: 4, wealth: 6850 },
  { id: 'npc_2', name: 'Amina Yakubu', avatar: '👩🏾‍💼', town: 'Tamale', shopLevel: 4, wealth: 5940 },
  { id: 'npc_3', name: 'Yaw Boateng', avatar: '👨🏾‍💼', town: 'Kumasi', shopLevel: 4, wealth: 5210 },
  { id: 'npc_4', name: 'Akosua Osei', avatar: '👩🏾‍🎓', town: 'Accra', shopLevel: 4, wealth: 4680 },
  { id: 'npc_5', name: 'Atanga Akurugu', avatar: '🥁', town: 'Bolgatanga', shopLevel: 4, wealth: 4120 },
  { id: 'npc_6', name: 'Fuseini Alhassan', avatar: '🦁', town: 'Tamale', shopLevel: 3, wealth: 3590 },
  { id: 'npc_7', name: 'Abena Serwaa', avatar: '👩🏾‍💼', town: 'Kumasi', shopLevel: 3, wealth: 3180 },
  { id: 'npc_8', name: 'Kojo Appiah', avatar: '⚽', town: 'Accra', shopLevel: 3, wealth: 2740 },
  { id: 'npc_9', name: 'Zainab Iddrisu', avatar: '👩🏾‍🎓', town: 'Tamale', shopLevel: 3, wealth: 2390 },
  { id: 'npc_10', name: 'Kofi Agyemang', avatar: '👨🏾‍🎓', town: 'Kumasi', shopLevel: 3, wealth: 2050 },
  { id: 'npc_11', name: 'Ayishetu Baba', avatar: '👑', town: 'Bolgatanga', shopLevel: 2, wealth: 1680 },
  { id: 'npc_12', name: 'Nii Armah', avatar: '👨🏾‍💼', town: 'Accra', shopLevel: 2, wealth: 1420 },
  { id: 'npc_13', name: 'Efua Dadzie', avatar: '👩🏾‍💼', town: 'Accra', shopLevel: 2, wealth: 1190 },
  { id: 'npc_14', name: 'Sulemana Mahama', avatar: '🥁', town: 'Tamale', shopLevel: 2, wealth: 960 },
  { id: 'npc_15', name: 'Adwoa Poku', avatar: '👩🏾‍🎓', town: 'Kumasi', shopLevel: 2, wealth: 780 },
  { id: 'npc_16', name: 'Akologo Ayamga', avatar: '🦁', town: 'Bolgatanga', shopLevel: 2, wealth: 610 },
  { id: 'npc_17', name: 'Kwadwo Frimpong', avatar: '⚽', town: 'Kumasi', shopLevel: 1, wealth: 440 },
  { id: 'npc_18', name: 'Mariama Abdulai', avatar: '👩🏾‍💼', town: 'Tamale', shopLevel: 1, wealth: 310 },
  { id: 'npc_19', name: 'Tetteh Quarshie Jr', avatar: '👨🏾‍🎓', town: 'Accra', shopLevel: 1, wealth: 195 },
  { id: 'npc_20', name: 'Asibi Apanga', avatar: '👩🏾‍🎓', town: 'Bolgatanga', shopLevel: 1, wealth: 95 }
];
