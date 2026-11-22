/**
 * QuizShop - Play, Earn, Build
 * Core game engine, LocalStorage persistence, offline profit ticker,
 * quiz arena (Solo, Battle vs Bot, Daily Tournament), shop builder,
 * leaderboard ranking, wallet monetization flows, confetti & sound FX.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'quizshop_save_v1';
  const QUESTION_TIME_SEC = 15;
  const QUESTIONS_PER_ROUND = 10;

  // ==========================================
  // 1. DEFAULT STATE & PERSISTENCE
  // ==========================================
  function createDefaultState() {
    return {
      onboarded: false,
      name: '',
      avatar: '👩🏾‍💼',
      town: 'Accra',
      coins: 0,
      shopLevel: 1,
      shopBalanceExact: 0,
      lastProfitTimestamp: Date.now(),
      totalInvested: 0,
      inventory: {
        sachet_water: 0,
        rice_bag: 0,
        cooking_oil: 0,
        drinks_crate: 0,
        toiletries: 0
      },
      stats: {
        quizzesCompleted: 0,
        correctAnswers: 0,
        bestStreak: 0,
        battleWins: 0
      },
      lastDailyRewardDate: '',
      lastTournamentWinDate: '',
      soundEnabled: true
    };
  }

  let state = loadGameState();

  // Ephemeral UI & Quiz runtime state
  let currentScreen = 'home';
  let selectedQuizMode = 'solo'; // 'solo' | 'battle'
  let leaderboardFilter = 'all'; // 'all' | 'town'
  let selectedOnboardingAvatar = '👩🏾‍💼';
  let selectedOnboardingTown = 'Accra';
  let selectedEditAvatar = '👩🏾‍💼';
  let pendingMomoPack = null;

  let quizSession = null;
  let questionIntervalId = null;
  let botTimeoutId = null;
  let adIntervalId = null;
  let audioCtx = null;

  /**
   * Load saved player progress from LocalStorage safely.
   */
  function loadGameState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      const defaults = createDefaultState();
      return {
        ...defaults,
        ...parsed,
        coins: Math.max(0, Number(parsed.coins) || 0),
        shopLevel: Math.min(4, Math.max(1, Number(parsed.shopLevel) || 1)),
        shopBalanceExact: Math.max(0, Number(parsed.shopBalanceExact) || 0),
        lastProfitTimestamp: Number(parsed.lastProfitTimestamp) || Date.now(),
        totalInvested: Math.max(0, Number(parsed.totalInvested) || 0),
        inventory: { ...defaults.inventory, ...(parsed.inventory || {}) },
        stats: { ...defaults.stats, ...(parsed.stats || {}) }
      };
    } catch (err) {
      console.warn('Could not load saved QuizShop state, starting fresh:', err);
      return createDefaultState();
    }
  }

  /**
   * Persist current game state to LocalStorage automatically.
   */
  function saveGameState() {
    try {
      state.coins = Math.max(0, Math.floor(state.coins));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Could not save QuizShop state:', err);
    }
  }

  // ==========================================
  // 2. SOUND EFFECTS (Web Audio API) & CONFETTI
  // ==========================================
  function playTone(freq, duration, type, volume, delay) {
    if (!state.soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const start = audioCtx.currentTime + (delay || 0);
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(volume || 0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + duration);
    } catch (_) {
      // Ignore audio errors if blocked by browser policy
    }
  }

  function playCorrectSound() {
    playTone(523.25, 0.12, 'triangle', 0.09, 0);
    playTone(659.25, 0.16, 'triangle', 0.09, 0.08);
  }

  function playWrongSound() {
    playTone(240, 0.16, 'sawtooth', 0.05, 0);
    playTone(180, 0.22, 'sawtooth', 0.05, 0.1);
  }

  function playCoinSound() {
    playTone(880, 0.1, 'sine', 0.08, 0);
    playTone(1174.66, 0.18, 'sine', 0.08, 0.06);
  }

  function playLevelUpSound() {
    playTone(523.25, 0.14, 'triangle', 0.1, 0);
    playTone(659.25, 0.14, 'triangle', 0.1, 0.1);
    playTone(783.99, 0.14, 'triangle', 0.1, 0.2);
    playTone(1046.5, 0.32, 'triangle', 0.11, 0.3);
  }

  /**
   * Launch celebratory confetti particles on shop level-ups and tournament wins.
   */
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#16a34a', '#facc15', '#ef4444', '#ffffff', '#38bdf8'];
    const pieces = Array.from({ length: 85 }, function () {
      return {
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 120,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 4,
        vy: 3 + Math.random() * 4.5,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });

    let frame = 0;
    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.rot += p.vRot;
        if (p.y < canvas.height + 30) active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      frame++;
      if (active && frame < 150) {
        requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(step);
  }

  // ==========================================
  // 3. TOASTS & COIN HELPERS
  // ==========================================
  function showToast(message, variant, icon) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (variant || 'success');
    const iconSpan = document.createElement('span');
    iconSpan.textContent = icon || '🪙';
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('toast-out');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 2600);
  }

  function triggerCoinPop() {
    const coinBtn = document.getElementById('hud-coin-btn');
    if (!coinBtn) return;
    coinBtn.classList.remove('pop');
    void coinBtn.offsetWidth;
    coinBtn.classList.add('pop');
  }

  /**
   * Add coins safely and save state.
   */
  function addCoins(amount, reasonToast) {
    const clean = Math.max(0, Math.floor(amount));
    if (clean <= 0) return;
    state.coins += clean;
    saveGameState();
    triggerCoinPop();
    renderAll();
    if (reasonToast) {
      showToast(reasonToast, 'gold', '🪙');
    }
  }

  /**
   * Spend coins only if player has enough balance (prevents negative coins).
   */
  function spendCoins(amount) {
    const clean = Math.max(0, Math.floor(amount));
    if (state.coins < clean) {
      showToast('Not enough coins! Play a quiz or collect shop profit.', 'error', '⚠️');
      return false;
    }
    state.coins -= clean;
    saveGameState();
    renderAll();
    return true;
  }

  // ==========================================
  // 4. SHOP PROFIT & OFFLINE TIMESTAMP ENGINE
  // ==========================================
  function getCurrentTier() {
    return window.SHOP_LEVELS.find(function (t) {
      return t.level === state.shopLevel;
    }) || window.SHOP_LEVELS[0];
  }

  function getNextTier() {
    return window.SHOP_LEVELS.find(function (t) {
      return t.level === state.shopLevel + 1;
    }) || null;
  }

  /**
   * Sum coins per minute across all owned shop items.
   */
  function getProfitPerMinute() {
    let total = 0;
    for (let i = 0; i < window.SHOP_ITEMS.length; i++) {
      const item = window.SHOP_ITEMS[i];
      const qty = Number(state.inventory[item.id]) || 0;
      total += qty * item.profitPerMin;
    }
    return total;
  }

  function getTotalItemsCount() {
    return Object.values(state.inventory).reduce(function (sum, qty) {
      return sum + (Number(qty) || 0);
    }, 0);
  }

  /**
   * Player Total Wealth used for Leaderboard ranking.
   */
  function getPlayerWealth() {
    return state.coins + Math.floor(state.shopBalanceExact) + state.totalInvested;
  }

  /**
   * Calculate profit earned since lastProfitTimestamp (works across app close/reopen).
   */
  function updateShopProfitFromTimestamp(announceOffline) {
    const now = Date.now();
    const elapsedMs = Math.max(0, now - state.lastProfitTimestamp);
    const ratePerMin = getProfitPerMinute();

    if (ratePerMin > 0 && elapsedMs > 0) {
      const earned = (elapsedMs / 60000) * ratePerMin;
      state.shopBalanceExact += earned;
      if (announceOffline && earned >= 1 && elapsedMs > 15000) {
        showToast(
          'Your shop earned +' + Math.floor(earned) + ' coins while you were away!',
          'success',
          '🏪'
        );
      }
    }
    state.lastProfitTimestamp = now;
    saveGameState();
  }

  /**
   * Transfer whole coins from Shop Balance into player's Coin wallet.
   */
  function collectShopProfit() {
    updateShopProfitFromTimestamp(false);
    const whole = Math.floor(state.shopBalanceExact);
    if (whole < 1) {
      showToast('No whole coins ready yet. Stock items or wait a moment!', 'error', '⏳');
      return;
    }
    state.shopBalanceExact -= whole;
    playCoinSound();
    addCoins(whole, 'Collected +' + whole + ' coins from your shop!');
  }

  // ==========================================
  // 5. ONBOARDING & PROFILE MANAGEMENT
  // ==========================================
  function initOnboardingUI() {
    const avatarGrid = document.getElementById('avatar-grid');
    const townGrid = document.getElementById('town-grid');
    if (!avatarGrid || !townGrid) return;

    avatarGrid.innerHTML = '';
    window.AVATARS.forEach(function (av) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'avatar-option' + (av.emoji === selectedOnboardingAvatar ? ' selected' : '');
      btn.innerHTML =
        '<span class="av-emoji">' + av.emoji + '</span>' +
        '<span class="av-label">' + av.label + '</span>';
      btn.addEventListener('click', function () {
        selectedOnboardingAvatar = av.emoji;
        Array.from(avatarGrid.children).forEach(function (c) {
          c.classList.remove('selected');
        });
        btn.classList.add('selected');
      });
      avatarGrid.appendChild(btn);
    });

    townGrid.innerHTML = '';
    window.TOWNS.forEach(function (town) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'town-option' + (town.name === selectedOnboardingTown ? ' selected' : '');
      btn.innerHTML =
        '<span class="town-emoji">' + town.emoji + '</span>' +
        '<span><strong>' + town.name + '</strong><small>' + town.vibe + '</small></span>';
      btn.addEventListener('click', function () {
        selectedOnboardingTown = town.name;
        Array.from(townGrid.children).forEach(function (c) {
          c.classList.remove('selected');
        });
        btn.classList.add('selected');
      });
      townGrid.appendChild(btn);
    });

    const form = document.getElementById('onboarding-form');
    const nameInput = document.getElementById('player-name-input');
    const nameError = document.getElementById('name-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const cleaned = nameInput.value.trim();
      if (!cleaned) {
        nameError.classList.remove('hidden');
        nameInput.focus();
        return;
      }
      nameError.classList.add('hidden');
      state.onboarded = true;
      state.name = cleaned;
      state.avatar = selectedOnboardingAvatar;
      state.town = selectedOnboardingTown;
      state.lastProfitTimestamp = Date.now();
      saveGameState();

      document.getElementById('onboarding-screen').classList.add('hidden');
      document.getElementById('app-shell').classList.remove('hidden');
      playLevelUpSound();
      showToast('Welcome ' + state.name + '! Your Table Shop is open in ' + state.town + '.', 'success', '🏪');
      renderAll();
    });
  }

  function openProfileModal() {
    const modal = document.getElementById('profile-modal');
    const nameInput = document.getElementById('edit-name-input');
    const townSelect = document.getElementById('edit-town-select');
    const editAvatarGrid = document.getElementById('edit-avatar-grid');
    document.getElementById('reset-confirm-box').classList.add('hidden');

    nameInput.value = state.name;
    townSelect.value = state.town;
    selectedEditAvatar = state.avatar;

    editAvatarGrid.innerHTML = '';
    window.AVATARS.forEach(function (av) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'avatar-option' + (av.emoji === selectedEditAvatar ? ' selected' : '');
      btn.innerHTML = '<span class="av-emoji">' + av.emoji + '</span>';
      btn.addEventListener('click', function () {
        selectedEditAvatar = av.emoji;
        Array.from(editAvatarGrid.children).forEach(function (c) {
          c.classList.remove('selected');
        });
        btn.classList.add('selected');
      });
      editAvatarGrid.appendChild(btn);
    });

    modal.classList.remove('hidden');
  }

  // ==========================================
  // 6. NAVIGATION & SCREEN RENDERING
  // ==========================================
  function switchScreen(targetScreen) {
    // If leaving active quiz mid-round, clean up timers cleanly
    if (currentScreen === 'quiz' && targetScreen !== 'quiz' && quizSession && !quizSession.finished) {
      abortQuizSession();
    }

    currentScreen = targetScreen;
    document.querySelectorAll('.screen').forEach(function (el) {
      el.classList.toggle('active', el.id === 'screen-' + targetScreen);
    });
    document.querySelectorAll('.nav-btn, .bottom-nav-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.screen === targetScreen);
    });

    if (targetScreen === 'quiz' && (!quizSession || quizSession.finished)) {
      showQuizLobby();
    }
    renderAll();
  }

  function renderHUD() {
    const tier = getCurrentTier();
    document.getElementById('hud-avatar').textContent = state.avatar;
    document.getElementById('hud-name').textContent = state.name;
    document.getElementById('hud-meta').textContent =
      'Lv. ' + tier.level + ' · ' + tier.name + ' · ' + state.town;
    document.getElementById('hud-coins').textContent = state.coins.toLocaleString();

    const soundIcon = state.soundEnabled ? '🔊' : '🔇';
    document.getElementById('rail-sound-icon').textContent = soundIcon;
    document.getElementById('rail-sound-text').textContent = state.soundEnabled ? 'Sound On' : 'Muted';
    document.getElementById('mobile-sound-icon').textContent = soundIcon;
  }

  function renderHomeDashboard() {
    const tier = getCurrentTier();
    const rate = getProfitPerMinute();
    const wholeShop = Math.floor(state.shopBalanceExact);
    const itemsCount = getTotalItemsCount();
    const rank = getPlayerRankInfo().rank;

    document.getElementById('home-town-kicker').textContent = state.town + ' Provision Network';
    document.getElementById('home-shop-title').textContent = 'Lv. ' + tier.level + ' ' + tier.name;
    document.getElementById('home-shop-tagline').textContent = tier.tagline;
    document.getElementById('home-shop-illustration').textContent = tier.emoji;

    document.getElementById('home-coins').textContent = state.coins.toLocaleString();
    document.getElementById('home-shop-balance').textContent = wholeShop.toLocaleString();
    document.getElementById('home-profit-rate').textContent = rate + '/m';
    document.getElementById('home-collect-amount').textContent = '(+' + wholeShop + ')';
    document.getElementById('home-collect-btn').disabled = wholeShop < 1;

    document.getElementById('home-rank-preview').textContent = 'Rank #' + rank;
    document.getElementById('home-items-count').textContent =
      itemsCount + (itemsCount === 1 ? ' item stocked' : ' items stocked');
    document.getElementById('home-wealth-meta').textContent = 'Wealth: ' + getPlayerWealth().toLocaleString() + ' 🪙';

    document.getElementById('stat-quizzes').textContent = state.stats.quizzesCompleted;
    document.getElementById('stat-correct').textContent = state.stats.correctAnswers;
    document.getElementById('stat-best-streak').textContent = state.stats.bestStreak;
    document.getElementById('stat-battle-wins').textContent = state.stats.battleWins;
  }

  function renderQuizLobby() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = '';

    window.QUIZ_CATEGORIES.forEach(function (cat) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'category-card';
      card.innerHTML =
        '<span class="category-emoji">' + cat.emoji + '</span>' +
        '<div>' +
        '<h3 class="category-name">' + cat.name + '</h3>' +
        '<p class="category-desc">' + cat.desc + '</p>' +
        '</div>';
      card.addEventListener('click', function () {
        startQuiz(selectedQuizMode, cat.id);
      });
      grid.appendChild(card);
    });
  }

  function renderShopScreen() {
    const tier = getCurrentTier();
    const nextTier = getNextTier();
    const rate = getProfitPerMinute();
    const wholeShop = Math.floor(state.shopBalanceExact);

    document.getElementById('shop-tier-emoji').textContent = tier.emoji;
    document.getElementById('shop-tier-level-label').textContent = 'Level ' + tier.level + ' of 4';
    document.getElementById('shop-tier-name').textContent = tier.name;
    document.getElementById('shop-tier-tagline').textContent = tier.tagline;
    document.getElementById('shop-profit-per-min').textContent = rate + ' coins/min';

    // Progression Stepper
    const stepsEl = document.getElementById('shop-progression-steps');
    stepsEl.innerHTML = '';
    window.SHOP_LEVELS.forEach(function (lvl) {
      const node = document.createElement('div');
      node.className = 'step-node' + (state.shopLevel >= lvl.level ? ' unlocked' : '');
      node.innerHTML =
        '<span class="step-emoji">' + lvl.emoji + '</span>' +
        '<span>' + lvl.name + '</span>';
      stepsEl.appendChild(node);
    });

    // Upgrade CTA
    const upgradeBar = document.getElementById('shop-upgrade-bar');
    if (nextTier) {
      upgradeBar.innerHTML =
        '<div class="upgrade-info">' +
        '<strong>Next: ' + nextTier.name + '</strong>' +
        '<span class="muted-text">' + nextTier.unlockText + '</span>' +
        '</div>' +
        '<button type="button" id="upgrade-shop-btn" class="btn btn-primary btn-lg">' +
        'Upgrade (' + nextTier.upgradeCost + ' 🪙)' +
        '</button>';
      const upBtn = document.getElementById('upgrade-shop-btn');
      upBtn.disabled = state.coins < nextTier.upgradeCost;
      upBtn.addEventListener('click', upgradeShopTier);
    } else {
      upgradeBar.innerHTML =
        '<div class="upgrade-info">' +
        '<strong>Maximum Shop Level Reached!</strong>' +
        '<span class="muted-text">All provision items unlocked. Keep stocking to climb #1!</span>' +
        '</div>';
    }

    // Collect Strip
    document.getElementById('shop-screen-balance').textContent = wholeShop.toLocaleString() + ' coins';
    document.getElementById('shop-collect-btn').disabled = wholeShop < 1;

    // Shop Items Grid
    const grid = document.getElementById('shop-items-grid');
    grid.innerHTML = '';
    window.SHOP_ITEMS.forEach(function (item) {
      const unlocked = state.shopLevel >= item.unlockLevel;
      const owned = Number(state.inventory[item.id]) || 0;
      const requiredTier = window.SHOP_LEVELS.find(function (l) {
        return l.level === item.unlockLevel;
      });

      const card = document.createElement('article');
      card.className = 'shop-item-card' + (unlocked ? '' : ' locked');

      card.innerHTML =
        '<div>' +
        '<div class="shop-item-top">' +
        '<div class="shop-item-left">' +
        '<div class="shop-item-icon">' + item.emoji + '</div>' +
        '<div>' +
        '<h4 class="shop-item-title">' + item.name + '</h4>' +
        '<div class="shop-item-stats">+' + item.profitPerMin + ' coin/min · ' + item.cost + ' 🪙</div>' +
        '</div>' +
        '</div>' +
        '<span class="shop-item-owned tabular-nums">Owned: ' + owned + '</span>' +
        '</div>' +
        '<p class="muted-text" style="margin-top:10px;">' + item.desc + '</p>' +
        '</div>';

      const footer = document.createElement('div');
      footer.className = 'shop-item-footer';

      if (unlocked) {
        const rateInfo = document.createElement('span');
        rateInfo.className = 'muted-meta tabular-nums';
        rateInfo.textContent = 'Earning ' + (owned * item.profitPerMin) + '/min';

        const buyBtn = document.createElement('button');
        buyBtn.type = 'button';
        buyBtn.className = 'btn btn-primary';
        buyBtn.textContent = 'Buy (' + item.cost + ' 🪙)';
        buyBtn.disabled = state.coins < item.cost;
        buyBtn.addEventListener('click', function () {
          buyShopItem(item);
        });

        footer.appendChild(rateInfo);
        footer.appendChild(buyBtn);
      } else {
        const lockText = document.createElement('span');
        lockText.className = 'muted-meta';
        lockText.textContent = '🔒 Unlocks at ' + (requiredTier ? requiredTier.name : 'Lv. ' + item.unlockLevel);
        footer.appendChild(lockText);
      }

      card.appendChild(footer);
      grid.appendChild(card);
    });
  }

  function upgradeShopTier() {
    const nextTier = getNextTier();
    if (!nextTier) return;
    if (!spendCoins(nextTier.upgradeCost)) return;

    state.shopLevel = nextTier.level;
    state.totalInvested += nextTier.upgradeCost;
    saveGameState();
    playLevelUpSound();
    launchConfetti();
    showToast('Level Up! Welcome to ' + nextTier.name + '!', 'success', nextTier.emoji);
    renderAll();
  }

  function buyShopItem(item) {
    if (state.shopLevel < item.unlockLevel) return;
    if (!spendCoins(item.cost)) return;

    state.inventory[item.id] = (Number(state.inventory[item.id]) || 0) + 1;
    state.totalInvested += item.cost;
    saveGameState();
    playCoinSound();
    showToast('Stocked ' + item.name + ' (+' + item.profitPerMin + ' coin/min)', 'success', item.emoji);
    renderAll();
  }

  // ==========================================
  // 7. LEADERBOARD
  // ==========================================
  function getSortedLeaderboard() {
    const currentTier = getCurrentTier();
    const myEntry = {
      id: 'player_me',
      name: state.name,
      avatar: state.avatar,
      town: state.town,
      shopLevel: currentTier.level,
      wealth: getPlayerWealth(),
      isMe: true
    };

    const combined = window.LEADERBOARD_PLAYERS.map(function (p) {
      return { ...p, isMe: false };
    });
    combined.push(myEntry);

    combined.sort(function (a, b) {
      return b.wealth - a.wealth;
    });

    return combined;
  }

  function getPlayerRankInfo() {
    const sorted = getSortedLeaderboard();
    const idx = sorted.findIndex(function (p) {
      return p.isMe;
    });
    return {
      rank: idx >= 0 ? idx + 1 : sorted.length,
      entry: sorted[idx],
      sorted: sorted
    };
  }

  function renderLeaderboardScreen() {
    const info = getPlayerRankInfo();
    const tier = getCurrentTier();

    document.getElementById('lb-my-rank').textContent = '#' + info.rank;
    document.getElementById('lb-my-avatar').textContent = state.avatar;
    document.getElementById('lb-my-name').textContent = state.name + ' (You)';
    document.getElementById('lb-my-meta').textContent = state.town + ' · Lv. ' + tier.level + ' ' + tier.name;
    document.getElementById('lb-my-wealth').textContent = info.entry.wealth.toLocaleString() + ' 🪙';

    let rows = info.sorted;
    if (leaderboardFilter === 'town') {
      rows = rows.filter(function (p) {
        return p.town === state.town;
      });
    } else {
      // Show top 20, plus ensure current player is visible if ranked #21
      const top20 = rows.slice(0, 20);
      if (!top20.some(function (p) { return p.isMe; })) {
        top20.push(info.entry);
      }
      rows = top20;
    }

    const listEl = document.getElementById('leaderboard-list');
    listEl.innerHTML = '';

    rows.forEach(function (player) {
      const globalRank = info.sorted.indexOf(player) + 1;
      const tierObj = window.SHOP_LEVELS.find(function (l) {
        return l.level === player.shopLevel;
      }) || window.SHOP_LEVELS[0];

      const row = document.createElement('div');
      row.className = 'lb-row' + (player.isMe ? ' is-me' : '');

      let rankBadge = '#' + globalRank;
      if (globalRank === 1) rankBadge = '🥇';
      else if (globalRank === 2) rankBadge = '🥈';
      else if (globalRank === 3) rankBadge = '🥉';

      row.innerHTML =
        '<div class="lb-row-left">' +
        '<span class="lb-pos tabular-nums">' + rankBadge + '</span>' +
        '<span class="lb-avatar">' + player.avatar + '</span>' +
        '<div class="lb-player-info">' +
        '<span class="lb-player-name">' + escapeHtml(player.name) + (player.isMe ? ' (You)' : '') + '</span>' +
        '<span class="lb-player-meta">' + player.town + ' · ' + tierObj.name + '</span>' +
        '</div>' +
        '</div>' +
        '<span class="lb-wealth tabular-nums">' + player.wealth.toLocaleString() + ' 🪙</span>';

      listEl.appendChild(row);
    });
  }

  // ==========================================
  // 8. WALLET & MONETIZATION FLOWS
  // ==========================================
  function getTodayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function renderWalletScreen() {
    const today = getTodayKey();
    const dailyClaimed = state.lastDailyRewardDate === today;
    const tournamentWonToday = state.lastTournamentWinDate === today;

    document.getElementById('wallet-coins').textContent = state.coins.toLocaleString();
    document.getElementById('wallet-wealth-note').textContent =
      'Total Net Worth: ' + getPlayerWealth().toLocaleString() + ' coins';
    document.getElementById('wallet-profit-min').textContent = getProfitPerMinute() + '/min';
    document.getElementById('wallet-pending').textContent =
      Math.floor(state.shopBalanceExact).toLocaleString() + ' coins';

    const dailyBtn = document.getElementById('daily-reward-btn');
    if (dailyClaimed) {
      dailyBtn.textContent = 'Claimed Today ✓';
      dailyBtn.disabled = true;
    } else {
      dailyBtn.textContent = 'Claim 30 Coins Daily';
      dailyBtn.disabled = false;
    }

    const tourneyBtn = document.getElementById('tournament-btn');
    if (tournamentWonToday) {
      tourneyBtn.textContent = 'Tournament Won Today 🏆';
      tourneyBtn.disabled = true;
    } else {
      tourneyBtn.textContent = 'Enter Tournament (50 🪙 → Win 500 🪙)';
      tourneyBtn.disabled = false;
    }
  }

  function claimDailyReward() {
    const today = getTodayKey();
    if (state.lastDailyRewardDate === today) return;
    state.lastDailyRewardDate = today;
    playCoinSound();
    addCoins(30, 'Daily Reward: +30 coins claimed!');
  }

  function openAdModal() {
    const modal = document.getElementById('ad-modal');
    const countdownEl = document.getElementById('ad-countdown-text');
    const claimBtn = document.getElementById('ad-claim-btn');

    let remaining = 5;
    claimBtn.disabled = true;
    countdownEl.textContent = 'Reward in ' + remaining + 's';
    modal.classList.remove('hidden');

    clearInterval(adIntervalId);
    adIntervalId = setInterval(function () {
      remaining -= 1;
      if (remaining > 0) {
        countdownEl.textContent = 'Reward in ' + remaining + 's';
      } else {
        clearInterval(adIntervalId);
        countdownEl.textContent = 'Reward Ready!';
        claimBtn.disabled = false;
      }
    }, 1000);
  }

  function closeAdModal() {
    clearInterval(adIntervalId);
    document.getElementById('ad-modal').classList.add('hidden');
  }

  function openMomoModal(coins, ghs) {
    pendingMomoPack = { coins: coins, ghs: ghs };
    document.getElementById('momo-pack-summary').textContent =
      coins.toLocaleString() + ' Coins · GHS ' + ghs + '.00 (Hubtel / MTN MoMo)';
    document.getElementById('momo-error').classList.add('hidden');
    document.getElementById('momo-phone').value = '';
    document.getElementById('momo-modal').classList.remove('hidden');
  }

  function enterDailyTournament() {
    const today = getTodayKey();
    if (state.lastTournamentWinDate === today) {
      showToast('You already won today’s tournament! Come back tomorrow.', 'success', '🏆');
      return;
    }
    if (!spendCoins(50)) return;
    showToast('Entered Daily Tournament (-50 coins). Score 7/10+ to win 500 coins!', 'gold', '🏆');
    switchScreen('quiz');
    startQuiz('tournament', 'mixed');
  }

  // ==========================================
  // 9. QUIZ ENGINE (Solo, Battle vs Bot, Tournament)
  // ==========================================
  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function showQuizLobby() {
    document.getElementById('quiz-lobby').classList.remove('hidden');
    document.getElementById('quiz-arena').classList.add('hidden');
    document.getElementById('quiz-summary').classList.add('hidden');
  }

  function abortQuizSession() {
    clearInterval(questionIntervalId);
    clearTimeout(botTimeoutId);
    quizSession = null;
    showQuizLobby();
  }

  /**
   * Initialize and start a 10-question quiz round.
   */
  function startQuiz(mode, categoryId) {
    clearInterval(questionIntervalId);
    clearTimeout(botTimeoutId);

    let pool;
    let catName = 'Mixed Ghana';
    if (categoryId === 'mixed') {
      pool = shuffleArray(window.QUIZ_QUESTIONS);
      catName = mode === 'tournament' ? 'Daily Tournament' : 'Ghana Mix';
    } else {
      pool = shuffleArray(
        window.QUIZ_QUESTIONS.filter(function (q) {
          return q.category === categoryId;
        })
      );
      const catObj = window.QUIZ_CATEGORIES.find(function (c) {
        return c.id === categoryId;
      });
      catName = catObj ? catObj.emoji + ' ' + catObj.name : 'Quiz';
    }

    const questions = pool.slice(0, QUESTIONS_PER_ROUND);
    const botNames = ['Kofi Bot', 'Ama Smart', 'Yaa Pro', 'Ibrahim AI'];
    const botName =
      mode === 'tournament'
        ? 'Champion Bot'
        : botNames[Math.floor(Math.random() * botNames.length)];

    quizSession = {
      mode: mode, // 'solo' | 'battle' | 'tournament'
      categoryId: categoryId,
      categoryName: catName,
      questions: questions,
      index: 0,
      correctCount: 0,
      fastCount: 0,
      streak: 0,
      bestRoundStreak: 0,
      roundCoins: 0,
      botName: botName,
      botScore: 0,
      botAnsweredCurrent: false,
      answeredCurrent: false,
      questionStartTime: 0,
      finished: false
    };

    document.getElementById('quiz-lobby').classList.add('hidden');
    document.getElementById('quiz-summary').classList.add('hidden');
    document.getElementById('quiz-arena').classList.remove('hidden');

    const isVsBot = mode === 'battle' || mode === 'tournament';
    document.getElementById('battle-hud').classList.toggle('hidden', !isVsBot);
    document.getElementById('battle-bot-status').classList.toggle('hidden', !isVsBot);
    document.getElementById('battle-you-avatar').textContent = state.avatar;
    document.getElementById('battle-you-name').textContent = state.name;
    document.getElementById('battle-bot-name').textContent = botName;
    document.getElementById('battle-bot-avatar').textContent = mode === 'tournament' ? '🏆' : '🤖';

    loadCurrentQuestion();
  }

  function loadCurrentQuestion() {
    if (!quizSession) return;
    clearInterval(questionIntervalId);
    clearTimeout(botTimeoutId);

    const q = quizSession.questions[quizSession.index];
    quizSession.answeredCurrent = false;
    quizSession.botAnsweredCurrent = false;
    quizSession.questionStartTime = performance.now();

    document.getElementById('arena-category-label').textContent = quizSession.categoryName;
    document.getElementById('arena-progress-text').textContent =
      (quizSession.index + 1) + ' / ' + quizSession.questions.length;
    document.getElementById('arena-streak-text').textContent = 'Streak: ' + quizSession.streak;
    document.getElementById('arena-round-coins').textContent = quizSession.roundCoins;
    document.getElementById('question-text').textContent = q.question;

    if (quizSession.mode === 'battle' || quizSession.mode === 'tournament') {
      document.getElementById('battle-you-score').textContent = quizSession.correctCount + ' pts';
      document.getElementById('battle-bot-score').textContent = quizSession.botScore + ' pts';
      document.getElementById('battle-bot-status').textContent =
        quizSession.botName + ' is thinking...';
      scheduleBotAnswer();
    }

    const feedbackEl = document.getElementById('quiz-feedback');
    feedbackEl.classList.add('hidden');

    const optionsEl = document.getElementById('options-list');
    optionsEl.innerHTML = '';
    q.options.forEach(function (optText, optIdx) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.innerHTML =
        '<span>' + escapeHtml(optText) + '</span>' +
        '<span class="option-status-icon" aria-hidden="true"></span>';
      btn.addEventListener('click', function () {
        handleAnswerSelection(optIdx);
      });
      optionsEl.appendChild(btn);
    });

    // Update timer bar at 100ms precision
    updateTimerVisual(QUESTION_TIME_SEC);
    questionIntervalId = setInterval(function () {
      const elapsedSec = (performance.now() - quizSession.questionStartTime) / 1000;
      const remaining = Math.max(0, QUESTION_TIME_SEC - elapsedSec);
      updateTimerVisual(remaining);
      if (remaining <= 0) {
        clearInterval(questionIntervalId);
        handleAnswerSelection(-1); // Timeout
      }
    }, 100);
  }

  function updateTimerVisual(remainingSec) {
    const pct = Math.max(0, Math.min(100, (remainingSec / QUESTION_TIME_SEC) * 100));
    const fill = document.getElementById('timer-fill');
    const text = document.getElementById('timer-seconds');
    fill.style.width = pct + '%';
    fill.classList.remove('warning', 'danger');
    if (remainingSec <= 3) fill.classList.add('danger');
    else if (remainingSec <= 6) fill.classList.add('warning');
    text.textContent = Math.ceil(remainingSec) + 's';
  }

  function scheduleBotAnswer() {
    if (!quizSession) return;
    const delayMs = 1800 + Math.random() * 4200;
    const accuracy = quizSession.mode === 'tournament' ? 0.72 : 0.7;

    botTimeoutId = setTimeout(function () {
      if (!quizSession || quizSession.finished || quizSession.botAnsweredCurrent) return;
      quizSession.botAnsweredCurrent = true;
      const botCorrect = Math.random() < accuracy;
      if (botCorrect) quizSession.botScore += 1;
      document.getElementById('battle-bot-score').textContent = quizSession.botScore + ' pts';
      document.getElementById('battle-bot-status').textContent =
        quizSession.botName + ' locked in an answer!';
    }, delayMs);
  }

  function handleAnswerSelection(chosenIndex) {
    if (!quizSession || quizSession.answeredCurrent) return;
    quizSession.answeredCurrent = true;
    clearInterval(questionIntervalId);

    // If bot hasn't answered yet in battle mode, resolve bot's answer immediately
    if ((quizSession.mode === 'battle' || quizSession.mode === 'tournament') && !quizSession.botAnsweredCurrent) {
      clearTimeout(botTimeoutId);
      quizSession.botAnsweredCurrent = true;
      const accuracy = quizSession.mode === 'tournament' ? 0.72 : 0.7;
      if (Math.random() < accuracy) quizSession.botScore += 1;
      document.getElementById('battle-bot-score').textContent = quizSession.botScore + ' pts';
    }

    const q = quizSession.questions[quizSession.index];
    const elapsedSec = (performance.now() - quizSession.questionStartTime) / 1000;
    const isCorrect = chosenIndex === q.correctIndex;
    const isFast = isCorrect && elapsedSec <= 5;

    // Style options with non-hue icons (✓ / ✕)
    const optionBtns = document.querySelectorAll('#options-list .option-btn');
    optionBtns.forEach(function (btn, idx) {
      btn.disabled = true;
      const iconSpan = btn.querySelector('.option-status-icon');
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
        iconSpan.textContent = '✓';
      } else if (idx === chosenIndex) {
        btn.classList.add('wrong');
        iconSpan.textContent = '✕';
      }
    });

    const headlineEl = document.getElementById('feedback-headline');
    if (isCorrect) {
      quizSession.correctCount += 1;
      quizSession.streak += 1;
      if (quizSession.streak > quizSession.bestRoundStreak) {
        quizSession.bestRoundStreak = quizSession.streak;
      }

      let earned = 10; // Base +10 coins
      const bonusParts = ['+10 base'];
      if (isFast) {
        earned += 5;
        quizSession.fastCount += 1;
        bonusParts.push('+5 fast');
      }
      if (quizSession.streak >= 2) {
        const streakBonus = Math.min(10, (quizSession.streak - 1) * 2);
        earned += streakBonus;
        bonusParts.push('+' + streakBonus + ' streak');
      }

      quizSession.roundCoins += earned;
      addCoins(earned, 'You earned +' + earned + ' coins!');
      playCorrectSound();

      headlineEl.className = 'feedback-headline is-correct';
      headlineEl.textContent = '✓ Correct! +' + earned + ' coins (' + bonusParts.join(', ') + ')';
    } else {
      quizSession.streak = 0;
      playWrongSound();
      headlineEl.className = 'feedback-headline is-wrong';
      headlineEl.textContent = chosenIndex === -1
        ? '⏳ Time up! The correct answer was "' + q.options[q.correctIndex] + '".'
        : '✕ Incorrect! Correct answer: "' + q.options[q.correctIndex] + '".';
    }

    if (quizSession.mode === 'battle' || quizSession.mode === 'tournament') {
      document.getElementById('battle-you-score').textContent = quizSession.correctCount + ' pts';
    }
    document.getElementById('arena-streak-text').textContent = 'Streak: ' + quizSession.streak;
    document.getElementById('arena-round-coins').textContent = quizSession.roundCoins;
    document.getElementById('feedback-explanation').textContent = q.explanation;

    const nextBtn = document.getElementById('next-question-btn');
    nextBtn.textContent =
      quizSession.index + 1 >= quizSession.questions.length ? 'See Final Results' : 'Next Question';
    document.getElementById('quiz-feedback').classList.remove('hidden');
  }

  function advanceQuiz() {
    if (!quizSession) return;
    quizSession.index += 1;
    if (quizSession.index >= quizSession.questions.length) {
      finishQuizRound();
    } else {
      loadCurrentQuestion();
    }
  }

  function finishQuizRound() {
    if (!quizSession) return;
    quizSession.finished = true;
    clearInterval(questionIntervalId);
    clearTimeout(botTimeoutId);

    // Update global player stats
    state.stats.quizzesCompleted += 1;
    state.stats.correctAnswers += quizSession.correctCount;
    if (quizSession.bestRoundStreak > state.stats.bestStreak) {
      state.stats.bestStreak = quizSession.bestRoundStreak;
    }

    let modeBonus = 0;
    let emoji = '🎉';
    let title = 'Quiz Complete!';
    let subtitle = 'Great knowledge! Use your coins to stock your shop.';

    if (quizSession.mode === 'battle') {
      if (quizSession.correctCount > quizSession.botScore) {
        modeBonus = 50;
        state.stats.battleWins += 1;
        emoji = '🏆';
        title = 'Battle Victory!';
        subtitle = 'You defeated ' + quizSession.botName + ' (' + quizSession.correctCount + ' vs ' + quizSession.botScore + ')!';
        launchConfetti();
        playLevelUpSound();
      } else if (quizSession.correctCount === quizSession.botScore) {
        modeBonus = 20;
        emoji = '🤝';
        title = 'Draw Match!';
        subtitle = 'Tied with ' + quizSession.botName + ' (' + quizSession.correctCount + ' pts each).';
      } else {
        emoji = '💪';
        title = quizSession.botName + ' Won!';
        subtitle = 'Score ' + quizSession.correctCount + ' vs ' + quizSession.botScore + '. Challenge again!';
      }
    } else if (quizSession.mode === 'tournament') {
      if (quizSession.correctCount >= 7) {
        modeBonus = 500;
        state.lastTournamentWinDate = getTodayKey();
        state.stats.battleWins += 1;
        emoji = '👑';
        title = 'Daily Tournament Champion!';
        subtitle = 'You scored ' + quizSession.correctCount + '/10 and won the 500-coin prize!';
        launchConfetti();
        playLevelUpSound();
      } else {
        emoji = '🎯';
        title = 'Tournament Complete';
        subtitle = 'You scored ' + quizSession.correctCount + '/10 (needed 7/10 to win 500 coins). Try again!';
      }
    } else if (quizSession.correctCount >= 8) {
      launchConfetti();
      playLevelUpSound();
    }

    if (modeBonus > 0) {
      quizSession.roundCoins += modeBonus;
      addCoins(modeBonus, 'Bonus +' + modeBonus + ' coins awarded!');
    } else {
      saveGameState();
    }

    document.getElementById('quiz-arena').classList.add('hidden');
    document.getElementById('quiz-summary').classList.remove('hidden');

    document.getElementById('summary-emoji').textContent = emoji;
    document.getElementById('summary-title').textContent = title;
    document.getElementById('summary-subtitle').textContent = subtitle;
    document.getElementById('summary-total-coins').textContent = '+' + quizSession.roundCoins + ' 🪙';
    document.getElementById('summary-correct').textContent =
      quizSession.correctCount + ' / ' + quizSession.questions.length;
    document.getElementById('summary-fast').textContent = quizSession.fastCount;
    document.getElementById('summary-streak').textContent = quizSession.bestRoundStreak;
    document.getElementById('summary-mode-bonus').textContent = '+' + modeBonus + ' 🪙';
    document.getElementById('summary-battle-row').classList.toggle('hidden', quizSession.mode === 'solo');

    renderAll();
  }

  // ==========================================
  // 10. GLOBAL RENDER & EVENT WIRING
  // ==========================================
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderAll() {
    if (!state.onboarded) return;
    renderHUD();
    renderHomeDashboard();
    renderShopScreen();
    renderLeaderboardScreen();
    renderWalletScreen();
  }

  function bindEvents() {
    // Navigation buttons (rail & bottom nav)
    document.querySelectorAll('.nav-btn, .bottom-nav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchScreen(btn.dataset.screen);
      });
    });

    // Top HUD triggers
    document.getElementById('hud-coin-btn').addEventListener('click', function () {
      switchScreen('wallet');
    });
    document.getElementById('hud-profile-trigger').addEventListener('click', openProfileModal);
    document.getElementById('rail-profile-btn').addEventListener('click', openProfileModal);

    // Sound toggles
    function toggleSound() {
      state.soundEnabled = !state.soundEnabled;
      saveGameState();
      renderHUD();
      showToast(state.soundEnabled ? 'Sound effects enabled' : 'Sound muted', 'success', state.soundEnabled ? '🔊' : '🔇');
    }
    document.getElementById('rail-sound-btn').addEventListener('click', toggleSound);
    document.getElementById('mobile-sound-btn').addEventListener('click', toggleSound);

    // Home Dashboard buttons
    document.getElementById('home-collect-btn').addEventListener('click', collectShopProfit);
    document.getElementById('shop-collect-btn').addEventListener('click', collectShopProfit);
    document.getElementById('home-play-quiz-btn').addEventListener('click', function () {
      switchScreen('quiz');
    });

    document.querySelectorAll('[data-quick-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setQuizMode(btn.dataset.quickMode);
        switchScreen('quiz');
      });
    });

    document.querySelectorAll('[data-go-screen]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchScreen(btn.dataset.goScreen);
      });
    });

    // Quiz Mode Segmented Tabs
    function setQuizMode(mode) {
      selectedQuizMode = mode;
      document.querySelectorAll('[data-quiz-mode]').forEach(function (b) {
        const isActive = b.dataset.quizMode === mode;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      document.getElementById('mode-description').textContent =
        mode === 'battle'
          ? 'Battle vs Computer: 10 questions. Outscore the bot for +50 bonus coins!'
          : 'Answer 10 questions at your own pace. Fast answers (under 5s) earn +5 bonus coins!';
    }

    document.querySelectorAll('[data-quiz-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setQuizMode(btn.dataset.quizMode);
      });
    });

    // Quiz Arena Controls
    document.getElementById('quiz-quit-btn').addEventListener('click', abortQuizSession);
    document.getElementById('next-question-btn').addEventListener('click', advanceQuiz);
    document.getElementById('summary-play-again-btn').addEventListener('click', function () {
      if (quizSession && quizSession.mode === 'tournament') {
        showQuizLobby();
      } else if (quizSession) {
        startQuiz(quizSession.mode, quizSession.categoryId);
      } else {
        showQuizLobby();
      }
    });
    document.getElementById('summary-go-shop-btn').addEventListener('click', function () {
      switchScreen('shop');
    });

    // Leaderboard Filters
    document.querySelectorAll('[data-lb-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        leaderboardFilter = btn.dataset.lbFilter;
        document.querySelectorAll('[data-lb-filter]').forEach(function (b) {
          const isActive = b.dataset.lbFilter === leaderboardFilter;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        renderLeaderboardScreen();
      });
    });

    // Wallet & Monetization Buttons
    document.getElementById('daily-reward-btn').addEventListener('click', claimDailyReward);
    document.getElementById('watch-ad-btn').addEventListener('click', openAdModal);
    document.getElementById('ad-cancel-btn').addEventListener('click', closeAdModal);
    document.getElementById('ad-claim-btn').addEventListener('click', function () {
      closeAdModal();
      playCoinSound();
      addCoins(20, 'Ad Reward: +20 free coins added!');
    });

    document.getElementById('tournament-btn').addEventListener('click', enterDailyTournament);

    document.querySelectorAll('.momo-pack-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openMomoModal(Number(btn.dataset.coins), Number(btn.dataset.ghs));
      });
    });

    document.getElementById('momo-cancel-btn').addEventListener('click', function () {
      document.getElementById('momo-modal').classList.add('hidden');
    });

    document.getElementById('momo-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const digits = document.getElementById('momo-phone').value.replace(/\D/g, '');
      const errorEl = document.getElementById('momo-error');
      if (digits.length < 10) {
        errorEl.classList.remove('hidden');
        return;
      }
      errorEl.classList.add('hidden');
      const network = document.getElementById('momo-network').value;
      const pack = pendingMomoPack;
      document.getElementById('momo-modal').classList.add('hidden');
      if (pack) {
        playLevelUpSound();
        addCoins(pack.coins, '+' + pack.coins.toLocaleString() + ' coins purchased via ' + network + '!');
      }
    });

    // Profile Modal
    document.getElementById('profile-cancel-btn').addEventListener('click', function () {
      document.getElementById('profile-modal').classList.add('hidden');
    });

    document.getElementById('profile-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const cleaned = document.getElementById('edit-name-input').value.trim();
      if (!cleaned) return;
      state.name = cleaned;
      state.town = document.getElementById('edit-town-select').value;
      state.avatar = selectedEditAvatar;
      saveGameState();
      document.getElementById('profile-modal').classList.add('hidden');
      showToast('Profile updated!', 'success', state.avatar);
      renderAll();
    });

    document.getElementById('reset-game-btn').addEventListener('click', function () {
      document.getElementById('reset-confirm-box').classList.remove('hidden');
    });
    document.getElementById('reset-cancel-btn').addEventListener('click', function () {
      document.getElementById('reset-confirm-box').classList.add('hidden');
    });
    document.getElementById('reset-confirm-btn').addEventListener('click', function () {
      localStorage.removeItem(STORAGE_KEY);
      state = createDefaultState();
      document.getElementById('profile-modal').classList.add('hidden');
      document.getElementById('app-shell').classList.add('hidden');
      document.getElementById('player-name-input').value = '';
      document.getElementById('onboarding-screen').classList.remove('hidden');
      showToast('Progress reset. Open a fresh shop!', 'success', '🔄');
    });
  }

  // ==========================================
  // 11. BOOTSTRAP
  // ==========================================
  function init() {
    initOnboardingUI();
    renderQuizLobby();
    bindEvents();

    if (state.onboarded) {
      document.getElementById('onboarding-screen').classList.add('hidden');
      document.getElementById('app-shell').classList.remove('hidden');
      updateShopProfitFromTimestamp(true);
      renderAll();
    } else {
      document.getElementById('onboarding-screen').classList.remove('hidden');
      document.getElementById('app-shell').classList.add('hidden');
    }

    // Live passive shop profit ticker (updates every 1 second using timestamp delta)
    setInterval(function () {
      if (!state.onboarded) return;
      const beforeWhole = Math.floor(state.shopBalanceExact);
      updateShopProfitFromTimestamp(false);
      const afterWhole = Math.floor(state.shopBalanceExact);
      if (afterWhole !== beforeWhole) {
        renderHomeDashboard();
        renderShopScreen();
        renderWalletScreen();
        renderLeaderboardScreen();
      }
    }, 1000);

    // Recalculate immediately when browser tab returns to foreground
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && state.onboarded) {
        updateShopProfitFromTimestamp(true);
        renderAll();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
