/**
 * QuizShop - Ghana Quiz Question Bank
 * Contains 60 curated questions across 6 categories (10 per category):
 * Ghana Knowledge, Football, Music, Science, Maths, and Dagbani Culture.
 */

window.QUIZ_CATEGORIES = [
  { id: 'ghana', name: 'Ghana Knowledge', emoji: '🇬🇭', desc: 'History, regions & landmarks' },
  { id: 'football', name: 'Football', emoji: '⚽', desc: 'Black Stars & GPL legends' },
  { id: 'music', name: 'Music', emoji: '🎵', desc: 'Highlife, Hiplife & Afrobeats' },
  { id: 'science', name: 'Science', emoji: '🔬', desc: 'Nature, physics & health' },
  { id: 'maths', name: 'Maths', emoji: '➗', desc: 'Quick numbers & shop math' },
  { id: 'dagbani', name: 'Dagbani Culture', emoji: '🥁', desc: 'Dagbon heritage & traditions' }
];

window.QUIZ_QUESTIONS = [
  // ==========================================
  // 1. GHANA KNOWLEDGE (10 Questions)
  // ==========================================
  {
    id: 'gh_1',
    category: 'ghana',
    question: 'In which year did Ghana gain independence from British colonial rule?',
    options: ['1954', '1957', '1960', '1963'],
    correctIndex: 1,
    explanation: 'Ghana became independent on 6th March 1957 under Dr. Kwame Nkrumah.'
  },
  {
    id: 'gh_2',
    category: 'ghana',
    question: 'How many administrative regions does Ghana currently have?',
    options: ['10', '12', '14', '16'],
    correctIndex: 3,
    explanation: 'Six new regions were created after the 2018 referendum, bringing the total to 16.'
  },
  {
    id: 'gh_3',
    category: 'ghana',
    question: 'What is the capital city of the Northern Region of Ghana?',
    options: ['Bolgatanga', 'Wa', 'Tamale', 'Yendi'],
    correctIndex: 2,
    explanation: 'Tamale is the capital of the Northern Region and the fastest-growing city in northern Ghana.'
  },
  {
    id: 'gh_4',
    category: 'ghana',
    question: 'Which lake in Ghana is the largest artificial lake in the world by surface area?',
    options: ['Lake Bosumtwi', 'Lake Volta', 'Weija Lake', 'Barekesse Lake'],
    correctIndex: 1,
    explanation: 'Lake Volta covers roughly 8,502 square kilometers, formed by the Akosombo Dam.'
  },
  {
    id: 'gh_5',
    category: 'ghana',
    question: 'What does the black star at the center of the Ghanaian flag symbolize?',
    options: ['Rich cocoa harvest', 'Gold mineral wealth', 'African emancipation and freedom', 'Unity of the 16 regions'],
    correctIndex: 2,
    explanation: 'Designed by Theodosia Okoh, the Black Star represents African freedom and emancipation.'
  },
  {
    id: 'gh_6',
    category: 'ghana',
    question: 'Which town in the Ashanti Region is world-famous for traditional Kente weaving?',
    options: ['Bonwire', 'Ejisu', 'Obuasi', 'Mampong'],
    correctIndex: 0,
    explanation: 'Bonwire is the historic home of authentic handwoven Ashanti Kente cloth.'
  },
  {
    id: 'gh_7',
    category: 'ghana',
    question: 'What is the highest mountain peak in Ghana?',
    options: ['Mount Afadja (Afadjato)', 'Mount Gemi', 'Gambaga Scarp', 'Kwahu Ridge'],
    correctIndex: 0,
    explanation: 'Mount Afadja in the Volta Region rises to 885 meters above sea level.'
  },
  {
    id: 'gh_8',
    category: 'ghana',
    question: 'What is the capital city of the Upper East Region?',
    options: ['Navrongo', 'Bawku', 'Bolgatanga', 'Zebilla'],
    correctIndex: 2,
    explanation: 'Bolgatanga, famous for its woven straw baskets and smocks, is the Upper East capital.'
  },
  {
    id: 'gh_9',
    category: 'ghana',
    question: 'Who was the first female Speaker of the Parliament of Ghana?',
    options: ['Rebecca Akufo-Addo', 'Joyce Bamford-Addo', 'Georgina Theodora Wood', 'Jane Naana Opoku-Agyemang'],
    correctIndex: 1,
    explanation: 'Justice Joyce Bamford-Addo served as Speaker of Parliament from 2009 to 2013.'
  },
  {
    id: 'gh_10',
    category: 'ghana',
    question: 'Which famous canopy walkway attraction is located in the Central Region?',
    options: ['Mole National Park', 'Kakum National Park', 'Boti Falls', 'Shai Hills'],
    correctIndex: 1,
    explanation: 'Kakum National Park near Cape Coast features a 350-meter rainforest canopy walkway.'
  },

  // ==========================================
  // 2. FOOTBALL (10 Questions)
  // ==========================================
  {
    id: 'fb_1',
    category: 'football',
    question: 'How many times has the Ghana Black Stars won the Africa Cup of Nations (AFCON)?',
    options: ['2 times', '3 times', '4 times', '5 times'],
    correctIndex: 2,
    explanation: 'Ghana won AFCON four times: in 1963, 1965, 1978, and 1982.'
  },
  {
    id: 'fb_2',
    category: 'football',
    question: 'Who is Ghana’s all-time top goal scorer for the Black Stars?',
    options: ['Abedi Pele', 'Asamoah Gyan', 'Tony Yeboah', 'Andre Ayew'],
    correctIndex: 1,
    explanation: 'Asamoah Gyan scored 51 goals for Ghana across 109 international appearances.'
  },
  {
    id: 'fb_3',
    category: 'football',
    question: 'Which Ghanaian football club is nicknamed the "Porcupine Warriors"?',
    options: ['Hearts of Oak', 'Asante Kotoko', 'Medeama SC', 'AshantiGold'],
    correctIndex: 1,
    explanation: 'Kumasi Asante Kotoko SC is famously known as the Porcupine Warriors ("Kuma Ase").'
  },
  {
    id: 'fb_4',
    category: 'football',
    question: 'In which year did the Black Stars reach the FIFA World Cup quarter-finals in South Africa?',
    options: ['2006', '2010', '2014', '2018'],
    correctIndex: 1,
    explanation: 'Ghana made history at the 2010 World Cup in South Africa, reaching the quarter-finals.'
  },
  {
    id: 'fb_5',
    category: 'football',
    question: 'Which Ghanaian youth team became the first African nation to win the FIFA U-20 World Cup in 2009?',
    options: ['Black Starlets', 'Black Satellites', 'Black Meteors', 'Black Maidens'],
    correctIndex: 1,
    explanation: 'The Black Satellites defeated Brazil on penalties in Egypt in 2009.'
  },
  {
    id: 'fb_6',
    category: 'football',
    question: 'Which Tamale-based stadium hosted matches during the 2008 Africa Cup of Nations?',
    options: ['Baba Yara Stadium', 'Alieu Mahama Sports Stadium', 'Essipong Stadium', 'Cape Coast Stadium'],
    correctIndex: 1,
    explanation: 'Tamale Sports Stadium (renamed Aliu Mahama Sports Stadium) hosted 2008 AFCON matches.'
  },
  {
    id: 'fb_7',
    category: 'football',
    question: 'Which Ghanaian legend won the African Footballer of the Year award three consecutive times (1991–1993)?',
    options: ['Samuel Kuffour', 'Michael Essien', 'Abedi Pele', 'Stephen Appiah'],
    correctIndex: 2,
    explanation: 'Abedi Ayew "Pele" won African Footballer of the Year in 1991, 1992, and 1993.'
  },
  {
    id: 'fb_8',
    category: 'football',
    question: 'What is the nickname of Ghana’s senior women’s national football team?',
    options: ['Black Queens', 'Black Princesses', 'Black Stars', 'Golden Girls'],
    correctIndex: 0,
    explanation: 'The senior women’s national team is proudly known as the Black Queens.'
  },
  {
    id: 'fb_9',
    category: 'football',
    question: 'In 2000, which Ghanaian club won the CAF Champions League undefeated in the final against Espérance?',
    options: ['Great Olympics', 'Aduana Stars', 'Hearts of Oak', 'Berekum Chelsea'],
    correctIndex: 2,
    explanation: 'Accra Hearts of Oak lifted the 2000 CAF Champions League and 2001 CAF Super Cup.'
  },
  {
    id: 'fb_10',
    category: 'football',
    question: 'Which Ghanaian midfielder scored a famous solo goal for Chelsea against Arsenal in 2006?',
    options: ['Sulley Muntari', 'Michael Essien', 'Kwadwo Asamoah', 'Thomas Partey'],
    correctIndex: 1,
    explanation: 'Michael Essien struck an unforgettable long-range thunderbolt against Arsenal in 2006.'
  },

  // ==========================================
  // 3. MUSIC (10 Questions)
  // ==========================================
  {
    id: 'mu_1',
    category: 'music',
    question: 'Who is widely celebrated as the pioneer of the Hiplife music genre in Ghana?',
    options: ['Sarkodie', 'Reggie Rockstone', 'Daddy Lumba', 'Kojo Antwi'],
    correctIndex: 1,
    explanation: 'Reggie Rockstone fused hip-hop beats with Ghanaian highlife in the mid-1990s to birth Hiplife.'
  },
  {
    id: 'mu_2',
    category: 'music',
    question: 'Which Ghanaian rapper won the first-ever BET Best International Flow award in 2019?',
    options: ['Manifest', 'Sarkodie', 'Medikal', 'Kwesi Arthur'],
    correctIndex: 1,
    explanation: 'Sarkodie won the inaugural BET Hip Hop Award for Best International Flow in 2019.'
  },
  {
    id: 'mu_3',
    category: 'music',
    question: 'Which Northern Ghanaian singer and rapper is famous for hits like "My Own" and "Bia"?',
    options: ['Fancy Gadam', 'Maccasio', 'Shatta Wale', 'Stonebwoy'],
    correctIndex: 0,
    explanation: 'Tamale superstar Fancy Gadam won VGMA New Artist of the Year in 2017.'
  },
  {
    id: 'mu_4',
    category: 'music',
    question: 'What is the real name of Ghanaian dancehall star Stonebwoy?',
    options: ['Charles Nii Armah Mensah', 'Livingstone Etse Satekla', 'Michael Owusu Addo', 'Gregory Bortey Newman'],
    correctIndex: 1,
    explanation: 'Stonebwoy was born Livingstone Etse Satekla and leads the Bhim Nation movement.'
  },
  {
    id: 'mu_5',
    category: 'music',
    question: 'Which legendary Highlife musician released the classic album "Aben Wo Ha"?',
    options: ['Nana Acheampong', 'Daddy Lumba', 'Amakye Dede', 'E.T. Mensah'],
    correctIndex: 1,
    explanation: 'Daddy Lumba’s 1998 hit "Aben Wo Ha" remains one of Ghana’s all-time greatest highlife tracks.'
  },
  {
    id: 'mu_6',
    category: 'music',
    question: 'Which Bolgatanga-born artist brought Frafra kologo music to global stages?',
    options: ['King Ayisoba', 'Atongo Zimba', 'Wiyaala', 'Sherifa Gunu'],
    correctIndex: 0,
    explanation: 'King Ayisoba popularized the two-string kologo lute internationally with energetic performances.'
  },
  {
    id: 'mu_7',
    category: 'music',
    question: 'Which Ghanaian song by Black Sherif became a global viral hit in 2022?',
    options: ['Kwaku the Traveller', 'Enjoyment', 'Terminator', 'Sugarcane'],
    correctIndex: 0,
    explanation: '"Kwaku the Traveller" topped charts across Africa and hit #1 on Shazam worldwide.'
  },
  {
    id: 'mu_8',
    category: 'music',
    question: 'Which iconic band led by E.T. Mensah was famous as the "King of Highlife"?',
    options: ['The Tempos', 'Osibisa', 'Wulomei', 'Sweet Talks'],
    correctIndex: 0,
    explanation: 'E.T. Mensah & The Tempos shaped West African dance-band highlife in the 1950s.'
  },
  {
    id: 'mu_9',
    category: 'music',
    question: 'Which singer from the Upper West Region is affectionately known as "The Lioness of Africa"?',
    options: ['Efya', 'Becca', 'Wiyaala', 'MzVee'],
    correctIndex: 2,
    explanation: 'Noella Wiyaala blends Sissala and Waala rhythms with Afro-pop and powerful vocals.'
  },
  {
    id: 'mu_10',
    category: 'music',
    question: 'Which viral 2023 Afrobeats hit by King Promise dominated dancefloors across Ghana?',
    options: ['Terminator', 'Second Sermon', 'Angela', 'Omo Ada'],
    correctIndex: 0,
    explanation: 'King Promise’s "Terminator" earned TGMA Artiste of the Year nominations and massive streams.'
  },

  // ==========================================
  // 4. SCIENCE (10 Questions)
  // ==========================================
  {
    id: 'sc_1',
    category: 'science',
    question: 'Which gas do green cocoa trees absorb from the air during photosynthesis?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    correctIndex: 2,
    explanation: 'Plants absorb carbon dioxide and sunlight to produce glucose and release oxygen.'
  },
  {
    id: 'sc_2',
    category: 'science',
    question: 'What is the chemical symbol for Gold, one of Ghana’s major natural resources?',
    options: ['Go', 'Gd', 'Ag', 'Au'],
    correctIndex: 3,
    explanation: 'Au comes from the Latin word "aurum", meaning shining dawn.'
  },
  {
    id: 'sc_3',
    category: 'science',
    question: 'Which vitamin does the human body naturally produce when exposed to gentle morning sunlight?',
    options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'],
    correctIndex: 2,
    explanation: 'Sunlight triggers Vitamin D synthesis in the skin, essential for strong bones.'
  },
  {
    id: 'sc_4',
    category: 'science',
    question: 'At standard sea-level pressure in Accra, at what temperature does pure water boil?',
    options: ['80 °C', '90 °C', '100 °C', '120 °C'],
    correctIndex: 2,
    explanation: 'Pure water boils at 100 °C (212 °F) at standard atmospheric pressure.'
  },
  {
    id: 'sc_5',
    category: 'science',
    question: 'Which part of the human body contains the smallest bones (stirrup, anvil, and hammer)?',
    options: ['Fingers', 'Ear', 'Nose', 'Foot'],
    correctIndex: 1,
    explanation: 'The middle ear holds the tiny ossicles—the smallest bones in the human body.'
  },
  {
    id: 'sc_6',
    category: 'science',
    question: 'What type of energy is generated by water flowing through the turbines of Akosombo Dam?',
    options: ['Solar energy', 'Hydroelectric energy', 'Geothermal energy', 'Nuclear energy'],
    correctIndex: 1,
    explanation: 'Hydroelectric dams convert the kinetic energy of falling water into electricity.'
  },
  {
    id: 'sc_7',
    category: 'science',
    question: 'Which planet in our solar system is closest to the Sun?',
    options: ['Venus', 'Mars', 'Mercury', 'Earth'],
    correctIndex: 2,
    explanation: 'Mercury orbits closest to the Sun, completing an orbit in just 88 Earth days.'
  },
  {
    id: 'sc_8',
    category: 'science',
    question: 'What instrument is used to measure atmospheric pressure for weather forecasting?',
    options: ['Thermometer', 'Barometer', 'Ammeter', 'Anemometer'],
    correctIndex: 1,
    explanation: 'A barometer measures air pressure, helping meteorologists predict rain or Harmattan winds.'
  },
  {
    id: 'sc_9',
    category: 'science',
    question: 'Which blood cells are primarily responsible for fighting infections in the body?',
    options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma cells'],
    correctIndex: 1,
    explanation: 'White blood cells (leukocytes) defend the immune system against bacteria and viruses.'
  },
  {
    id: 'sc_10',
    category: 'science',
    question: 'Shea butter, widely produced in northern Ghana, comes from the nut of which type of plant?',
    options: ['Palm tree', 'Shea tree (Vitellaria paradoxa)', 'Baobab tree', 'Cashew tree'],
    correctIndex: 1,
    explanation: 'Shea nuts come from the Vitellaria paradoxa tree native to the Savannah belt.'
  },

  // ==========================================
  // 5. MATHS (10 Questions)
  // ==========================================
  {
    id: 'ma_1',
    category: 'maths',
    question: 'If 1 sachet of pure water costs 50 pesewas (GHS 0.50), how much do 12 sachets cost?',
    options: ['GHS 5.00', 'GHS 6.00', 'GHS 6.50', 'GHS 7.00'],
    correctIndex: 1,
    explanation: '12 × GHS 0.50 = GHS 6.00.'
  },
  {
    id: 'ma_2',
    category: 'maths',
    question: 'Your provision shop earns 15 coins per minute. How many coins will it earn in 6 minutes?',
    options: ['75 coins', '80 coins', '90 coins', '105 coins'],
    correctIndex: 2,
    explanation: '15 × 6 = 90 coins.'
  },
  {
    id: 'ma_3',
    category: 'maths',
    question: 'A trader buys a rice bag for 100 coins and sells it for 125 coins. What is the percentage profit?',
    options: ['15%', '20%', '25%', '30%'],
    correctIndex: 2,
    explanation: 'Profit is 25 coins on a 100-coin cost, which is 25%.'
  },
  {
    id: 'ma_4',
    category: 'maths',
    question: 'What is the value of 14 × 7?',
    options: ['88', '96', '98', '104'],
    correctIndex: 2,
    explanation: '10 × 7 = 70 and 4 × 7 = 28; 70 + 28 = 98.'
  },
  {
    id: 'ma_5',
    category: 'maths',
    question: 'A customer pays with a GHS 50 note for items costing GHS 33.50. How much change should you give?',
    options: ['GHS 15.50', 'GHS 16.50', 'GHS 17.50', 'GHS 18.50'],
    correctIndex: 1,
    explanation: '50.00 − 33.50 = GHS 16.50.'
  },
  {
    id: 'ma_6',
    category: 'maths',
    question: 'If a drinks crate holds 24 bottles and you have 5 crates, how many bottles are in stock?',
    options: ['100', '110', '120', '125'],
    correctIndex: 2,
    explanation: '24 × 5 = 120 bottles.'
  },
  {
    id: 'ma_7',
    category: 'maths',
    question: 'What is 15% of 200 coins?',
    options: ['20 coins', '25 coins', '30 coins', '35 coins'],
    correctIndex: 2,
    explanation: '10% of 200 is 20, 5% is 10, so 15% = 30 coins.'
  },
  {
    id: 'ma_8',
    category: 'maths',
    question: 'Solve for x: 3x + 12 = 45',
    options: ['9', '10', '11', '12'],
    correctIndex: 2,
    explanation: '3x = 45 − 12 = 33, so x = 33 ÷ 3 = 11.'
  },
  {
    id: 'ma_9',
    category: 'maths',
    question: 'A square container shop floor has a side length of 4 meters. What is its area?',
    options: ['8 m²', '12 m²', '16 m²', '20 m²'],
    correctIndex: 2,
    explanation: 'Area of a square = side × side = 4 × 4 = 16 m².'
  },
  {
    id: 'ma_10',
    category: 'maths',
    question: 'If you save 30 coins every day for 2 full weeks, how many coins will you have saved?',
    options: ['360 coins', '400 coins', '420 coins', '450 coins'],
    correctIndex: 2,
    explanation: '2 weeks = 14 days; 14 × 30 = 420 coins.'
  },

  // ==========================================
  // 6. DAGBANI CULTURE (10 Questions)
  // ==========================================
  {
    id: 'dg_1',
    category: 'dagbani',
    question: 'What is the title of the Overlord and King of the Dagbon Kingdom?',
    options: ['Nayiri', 'Ya Naa', 'Asantehene', 'Yagbonwura'],
    correctIndex: 1,
    explanation: 'The Ya Naa is the supreme traditional ruler of Dagbon, seated at the Gbewaa Palace in Yendi.'
  },
  {
    id: 'dg_2',
    category: 'dagbani',
    question: 'Which famous Dagbon fire festival involves carrying blazing torches at night?',
    options: ['Damba Festival', 'Bugum Chugu', 'Kpini Chugu', 'Homowo'],
    correctIndex: 1,
    explanation: 'Bugum Chugu (Fire Festival) is celebrated in the first month of the Dagomba lunar calendar.'
  },
  {
    id: 'dg_3',
    category: 'dagbani',
    question: 'What is the traditional handwoven smock worn proudly in Dagbon and Northern Ghana called in Dagbani?',
    options: ['Kente', 'Bingmaa', 'Fugu / Batakari', 'Agbada'],
    correctIndex: 2,
    explanation: 'Called Bingmaa or Fugu/Batakari locally, the smock is a proud symbol of northern heritage.'
  },
  {
    id: 'dg_4',
    category: 'dagbani',
    question: 'Which iconic hourglass-shaped talking drum is played by Dagomba oral historians (Lunsi)?',
    options: ['Fontomfrom', 'Lunga', 'Gungon', 'Atumpan'],
    correctIndex: 1,
    explanation: 'The Lunga (paired with the larger Gungon bass drum) speaks proverbs and royal praise poetry.'
  },
  {
    id: 'dg_5',
    category: 'dagbani',
    question: 'In Dagbani greetings, how do you say "Good morning"?',
    options: ['Antire', 'Dasiba', 'Aniwula', 'Naa'],
    correctIndex: 1,
    explanation: '"Dasiba" is the standard Dagbani morning greeting, often answered with "Naa".'
  },
  {
    id: 'dg_6',
    category: 'dagbani',
    question: 'Which major festival in Dagbon features royal horsemanship, drumming, and dancing?',
    options: ['Aboakyer', 'Damba Festival', 'Odwira', 'Hogbetsotso'],
    correctIndex: 1,
    explanation: 'The Damba Festival showcases rich Dagbon drumming, Takai dancing, and decorated horses.'
  },
  {
    id: 'dg_7',
    category: 'dagbani',
    question: 'Which town serves as the traditional capital of the Dagbon Kingdom?',
    options: ['Savelugu', 'Yendi', 'Tolon', 'Karaga'],
    correctIndex: 1,
    explanation: 'Yendi is the historic traditional seat of the Ya Naa and the Gbewaa Palace.'
  },
  {
    id: 'dg_8',
    category: 'dagbani',
    question: 'What is the popular Dagomba staple dish made from yam pounded or prepared with soup, or maize meal?',
    options: ['Tuo Zaafi (Sagim)', 'Banku', 'Fufu', 'Kenkey'],
    correctIndex: 0,
    explanation: 'Tuo Zaafi (known as Sagim in Dagbani) served with ayoyo or dry okro soup is a beloved staple.'
  },
  {
    id: 'dg_9',
    category: 'dagbani',
    question: 'What does "Naa" mean when replying to a greeting or addressing respect in Dagbani?',
    options: ['Goodbye', 'Respectful acknowledgement / Yes', 'Thank you very much', 'Welcome home'],
    correctIndex: 1,
    explanation: '"Naa" is a polite, respectful response to greetings and elders in Dagbani.'
  },
  {
    id: 'dg_10',
    category: 'dagbani',
    question: 'Which energetic traditional Dagomba dance is performed by men holding metal rods or horsetails in a circle?',
    options: ['Bamaya', 'Takai', 'Adowa', 'Kpanlogo'],
    correctIndex: 1,
    explanation: 'Takai is a majestic male royal circle dance accompanied by Lunga and Gungon drums.'
  }
];
