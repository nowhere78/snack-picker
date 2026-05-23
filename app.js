document.addEventListener('DOMContentLoaded', () => {
  // Initialize Clicks / Votes database from LocalStorage or default votes
  let clickStats = {};
  const STORAGE_KEY = 'snack_picker_clicks_v1';
  
  let userVotes = {};
  const USER_VOTES_KEY = 'snack_picker_user_votes_v1';
  
  function initStats() {
    const saved = localStorage.getItem(STORAGE_KEY);
    let needsReset = false;
    if (saved) {
      clickStats = JSON.parse(saved);
      // Check if any vote is > 350, which means we need to scale down/reset to new defaultVotes
      const values = Object.values(clickStats);
      if (values.some(v => v > 350)) {
        needsReset = true;
      }
    }
    
    if (!saved || needsReset) {
      clickStats = {};
      SNACK_DATA.forEach(snack => {
        clickStats[snack.id] = snack.defaultVotes;
      });
      saveStats();
      // Clear old user votes if resetting
      if (needsReset) {
        userVotes = {};
        localStorage.removeItem(USER_VOTES_KEY);
      }
    } else {
      // Fill in new snacks if added later
      SNACK_DATA.forEach(snack => {
        if (clickStats[snack.id] === undefined) {
          clickStats[snack.id] = snack.defaultVotes;
        }
      });
    }
    
    // Init user personal votes limit tracking
    const savedVotes = localStorage.getItem(USER_VOTES_KEY);
    if (savedVotes) {
      userVotes = JSON.parse(savedVotes);
    }
  }

  function saveStats() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clickStats));
  }

  function showToast(message, iconClass = 'fa-solid fa-square-check') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  function handleUpvote(snackId, element) {
    const snack = SNACK_DATA.find(s => s.id === snackId);
    if (!snack) return;
    
    const isAlreadyVoted = userVotes[snackId] && userVotes[snackId] > 0;
    
    if (isAlreadyVoted) {
      showToast(`"${snack.name}" 쿠팡 & 구매 페이지로 이동합니다! 🛒`, 'fa-solid fa-cart-shopping');
      // Immediately open link
      window.open(snack.link, '_blank');
      return;
    }
    
    // Count how many unique snacks have already been voted
    const prevVotedCount = Object.keys(userVotes).length;
    
    userVotes[snackId] = 1;
    clickStats[snackId] = (clickStats[snackId] || 0) + 1;
    
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(userVotes));
    saveStats();
    
    updateRankingUI();
    renderSnackGrid();
    
    // Trigger vibration if supported for mobile feedback
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
    
    // Highlight the clicked element
    setTimeout(() => {
      const updatedElements = document.querySelectorAll(`[data-id="${snackId}"] .card-votes, [data-id="${snackId}"] .podium-votes, [data-id="${snackId}"] .rank-row-votes`);
      updatedElements.forEach(el => {
        el.classList.add('flame-active');
        setTimeout(() => el.classList.remove('flame-active'), 400);
      });
    }, 50);
    
    if (prevVotedCount === 0) {
      // First unique snack: vote only, no redirect
      showToast(`"${snack.name}" 투표 완료! (한 번 더 누르시면 쿠팡으로 이동합니다) 🗳️`, 'fa-solid fa-square-check');
    } else {
      // Second or subsequent unique snack: vote and redirect to Coupang link
      showToast(`"${snack.name}" 투표 완료! 쿠팡 & 구매 페이지로 이동합니다. 🛒`, 'fa-solid fa-cart-shopping');
      setTimeout(() => {
        window.open(snack.link, '_blank');
      }, 800);
    }
  }

  function registerClick(snackId) {
    // In details modal click, we can register it as check/vote too if not voted yet
    if (!userVotes[snackId]) {
      userVotes[snackId] = 1;
      clickStats[snackId] = (clickStats[snackId] || 0) + 1;
      localStorage.setItem(USER_VOTES_KEY, JSON.stringify(userVotes));
      saveStats();
      updateRankingUI();
      renderSnackGrid();
    }
  }

  initStats();

  // --- Element Selectors ---
  const podiumContainer = document.getElementById('podium-container');
  const rankingGrid = document.getElementById('ranking-grid');
  const snackGrid = document.getElementById('snack-grid');
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const noResults = document.getElementById('no-results');
  
  // Modal Elements
  const modal = document.getElementById('snack-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalImgFallback = document.getElementById('modal-img-fallback');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalCategory = document.getElementById('modal-category');
  const modalVotes = document.getElementById('modal-votes');
  const modalBtnBuy = document.getElementById('modal-btn-buy');
  const modalBadge = document.getElementById('modal-badge');

  // State Variables
  let currentCategory = 'all';
  let searchQuery = '';

  // Category translation map
  const categoryMap = {
    snack: '바삭스낵',
    potato: '감자칩',
    choco: '초코/파이',
    biscuit: '쿠키/비스킷',
    jelly: '젤리/기타'
  };

  // --- 1. Top 12 Ranking Dashboard ---
  function updateRankingUI() {
    // Sort all snacks by vote count
    const sortedSnacks = [...SNACK_DATA].sort((a, b) => {
      const votesA = clickStats[a.id] || 0;
      const votesB = clickStats[b.id] || 0;
      return votesB - votesA;
    });

    const top12 = sortedSnacks.slice(0, 12);
    
    // Top 3 Podium Rendering
    // Podium arrangement: Rank 2 on Left, Rank 1 in Center, Rank 3 on Right
    const rank1 = top12[0];
    const rank2 = top12[1];
    const rank3 = top12[2];
    
    let podiumHTML = '';
    
    // Helper to render podium card
    const makePodiumCard = (snack, rankNum) => {
      if (!snack) return '';
      const votes = clickStats[snack.id];
      const hasImage = snack.image && !snack.image.includes('placeholder');
      const isVoted = userVotes[snack.id] && userVotes[snack.id] > 0;
      
      const imageHTML = hasImage 
        ? `<img src="${snack.image}" alt="${snack.name}" class="podium-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
        : '';
      const fallbackHTML = `<div class="podium-fallback-icon" style="${hasImage ? 'display:none;' : 'display:flex;'}"><i class="fa-solid fa-cookie"></i></div>`;
      
      const crownHTML = rankNum === 1 ? `<i class="fa-solid fa-crown podium-crown"></i>` : '';
      
      return `
        <div class="podium-card rank-${rankNum} glass-panel" data-id="${snack.id}">
          ${crownHTML}
          <div class="podium-badge">${rankNum}</div>
          <div class="podium-img-wrapper">
            ${imageHTML}
            ${fallbackHTML}
          </div>
          <h3 class="podium-name">${snack.name}</h3>
          <span class="podium-votes ${isVoted ? 'voted' : ''}"><i class="${isVoted ? 'fa-solid fa-square-check' : 'fa-regular fa-square'}"></i> ${votes.toLocaleString()}</span>
        </div>
      `;
    };

    podiumHTML += makePodiumCard(rank2, 2);
    podiumHTML += makePodiumCard(rank1, 1);
    podiumHTML += makePodiumCard(rank3, 3);
    
    podiumContainer.innerHTML = podiumHTML;

    // Rank 4-12 Grid Rendering
    let gridHTML = '';
    for (let i = 3; i < top12.length; i++) {
      const snack = top12[i];
      const rankNum = i + 1;
      const votes = clickStats[snack.id];
      const hasImage = snack.image && !snack.image.includes('placeholder');
      const isVoted = userVotes[snack.id] && userVotes[snack.id] > 0;
      
      const imageHTML = hasImage
        ? `<img src="${snack.image}" alt="${snack.name}" class="rank-row-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
        : '';
      const fallbackHTML = `<div class="rank-row-fallback-icon" style="${hasImage ? 'display:none;' : 'display:flex;'}"><i class="fa-solid fa-cookie"></i></div>`;

      gridHTML += `
        <div class="rank-row-item" data-id="${snack.id}">
          <span class="rank-row-num">${rankNum}</span>
          <div class="rank-row-img-wrapper">
            ${imageHTML}
            ${fallbackHTML}
          </div>
          <div class="rank-row-info">
            <span class="rank-row-name">${snack.name}</span>
            <span class="rank-row-votes ${isVoted ? 'voted' : ''}"><i class="${isVoted ? 'fa-solid fa-square-check' : 'fa-regular fa-square'}"></i> ${votes.toLocaleString()}</span>
          </div>
        </div>
      `;
    }
    
    rankingGrid.innerHTML = gridHTML;

    // Attach Click Events to Ranking Items
    document.querySelectorAll('.podium-card, .rank-row-item').forEach(element => {
      element.addEventListener('click', (e) => {
        // Prevent modal open if voting element was clicked
        if (e.target.closest('.podium-votes') || e.target.closest('.rank-row-votes')) {
          return;
        }
        const id = element.getAttribute('data-id');
        openModal(id);
      });

      const voteBtn = element.querySelector('.podium-votes, .rank-row-votes');
      if (voteBtn) {
        voteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = element.getAttribute('data-id');
          handleUpvote(id, voteBtn);
        });
      }
    });
  }

  updateRankingUI();

  // --- 2. All Snacks Catalog Grid ---
  function renderSnackGrid() {
    const filtered = SNACK_DATA.filter(snack => {
      const matchesCategory = currentCategory === 'all' || snack.category === currentCategory;
      const matchesSearch = snack.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            snack.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      snackGrid.innerHTML = '';
      noResults.style.display = 'block';
      return;
    }
    
    noResults.style.display = 'none';
    
    let gridHTML = '';
    filtered.forEach(snack => {
      const votes = clickStats[snack.id] || 0;
      const hasImage = snack.image && !snack.image.includes('placeholder');
      const isVoted = userVotes[snack.id] && userVotes[snack.id] > 0;
      
      const imageHTML = hasImage
        ? `<img src="${snack.image}" alt="${snack.name}" class="card-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
        : '';
      const fallbackHTML = `
        <div class="card-img-fallback" style="${hasImage ? 'display:none;' : 'display:flex;'}">
          <i class="fa-solid fa-cookie"></i>
          <span style="font-size:0.75rem; color:var(--text-dim);">${snack.name}</span>
        </div>`;

      gridHTML += `
        <div class="snack-card" data-id="${snack.id}">
          <div class="card-img-wrapper">
            <span class="card-category-badge">${categoryMap[snack.category] || '기타'}</span>
            ${imageHTML}
            ${fallbackHTML}
          </div>
          <div class="card-content">
            <h3 class="card-title">${snack.name}</h3>
            <p class="card-desc">${snack.desc}</p>
            <div class="card-footer">
              <span class="card-votes ${isVoted ? 'voted' : ''}"><i class="${isVoted ? 'fa-solid fa-square-check' : 'fa-regular fa-square'}"></i> ${votes.toLocaleString()}</span>
              <button class="card-btn-buy">
                상세보기 <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    snackGrid.innerHTML = gridHTML;

    // Attach click handlers
    document.querySelectorAll('.snack-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent modal open if voting button was clicked
        if (e.target.closest('.card-votes')) {
          return;
        }
        const id = card.getAttribute('data-id');
        openModal(id);
      });

      const voteBtn = card.querySelector('.card-votes');
      if (voteBtn) {
        voteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = card.getAttribute('data-id');
          handleUpvote(id, voteBtn);
        });
      }
    });
  }

  renderSnackGrid();

  // Search Input Handler
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchQuery.trim().length > 0) {
      searchClearBtn.style.display = 'flex';
    } else {
      searchClearBtn.style.display = 'none';
    }
    renderSnackGrid();
  });

  // Clear Search Handler
  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClearBtn.style.display = 'none';
    renderSnackGrid();
    searchInput.focus();
  });

  // Category Tab Filter Handler
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderSnackGrid();
    });
  });

  // --- 3. Interactive Detail & Redirect Modal ---
  function openModal(id) {
    const snack = SNACK_DATA.find(s => s.id === id);
    if (!snack) return;

    const votes = clickStats[snack.id] || 0;
    const hasImage = snack.image && !snack.image.includes('placeholder');

    modalTitle.textContent = snack.name;
    modalDesc.textContent = snack.desc;
    modalCategory.textContent = categoryMap[snack.category] || '기타';
    modalVotes.textContent = votes.toLocaleString();
    
    // Set buy redirect url
    modalBtnBuy.setAttribute('href', snack.link);
    modalBtnBuy.setAttribute('data-id', snack.id);

    // Dynamic Badge based on Popularity rank
    const sorted = [...SNACK_DATA].sort((a,b) => clickStats[b.id] - clickStats[a.id]);
    const rankIndex = sorted.findIndex(s => s.id === id);
    if (rankIndex < 3) {
      modalBadge.textContent = `${rankIndex + 1}위 ★ BEST`;
      modalBadge.style.background = 'var(--gold)';
      modalBadge.style.color = '#000';
    } else if (rankIndex < 12) {
      modalBadge.textContent = `인기 ${rankIndex + 1}위`;
      modalBadge.style.background = 'var(--primary)';
      modalBadge.style.color = '#fff';
    } else {
      modalBadge.textContent = '인기 스낵';
      modalBadge.style.background = 'var(--accent-cyan)';
      modalBadge.style.color = '#fff';
    }

    if (hasImage) {
      modalImg.src = snack.image;
      modalImg.alt = snack.name;
      modalImg.style.display = 'block';
      modalImgFallback.style.display = 'none';
    } else {
      modalImg.style.display = 'none';
      modalImgFallback.style.display = 'flex';
      modalImgFallback.querySelector('i').className = 'fa-solid fa-cookie';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scroll
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Track click on "Buy" button and increment vote count
  modalBtnBuy.addEventListener('click', (e) => {
    const id = modalBtnBuy.getAttribute('data-id');
    if (id) {
      registerClick(id);
      // Update vote display inside the modal in real-time
      modalVotes.textContent = (clickStats[id] || 0).toLocaleString();
    }
  });

  // --- 4. Interactive Roulette Engine (HTML5 Canvas) ---
  const rouletteWheel = document.getElementById('roulette-wheel');
  const btnSpin = document.getElementById('btn-spin');
  let isSpinning = false;
  
  // Create Canvas Element inside roulette-wheel container
  const canvas = document.createElement('canvas');
  rouletteWheel.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  // Dynamic 8 snacks for roulette (reshuffled on load/spin)
  let rouletteSnacks = [];
  
  function selectRouletteSnacks() {
    // Pick 8 random snacks from database
    const shuffled = [...SNACK_DATA].sort(() => 0.5 - Math.random());
    rouletteSnacks = shuffled.slice(0, 8);
  }
  
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const size = rouletteWheel.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    drawWheel();
  }

  window.addEventListener('resize', resizeCanvas);

  function drawWheel() {
    const size = rouletteWheel.clientWidth;
    const center = size / 2;
    const radius = center - 8;
    ctx.clearRect(0, 0, size, size);
    
    if (rouletteSnacks.length === 0) return;
    
    const sliceAngle = (2 * Math.PI) / rouletteSnacks.length;
    
    // Segment Colors (Neon theme palette)
    const colors = [
      '#1a123a', '#24194c', '#150d32', '#2c1e5d',
      '#100a29', '#1e1443', '#0e0824', '#281b55'
    ];
    
    rouletteSnacks.forEach((snack, index) => {
      const angle = index * sliceAngle;
      
      // Draw slice background
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle, angle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      // Inner glowing border for segments
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.stroke();
      
      // Draw text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + sliceAngle / 2);
      
      // Text styling
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      
      // Dynamic text size based on length
      const textLen = snack.name.length;
      let fontSize = 12;
      if (textLen > 6) fontSize = 10;
      if (textLen > 8) fontSize = 8.5;
      
      ctx.font = `bold ${fontSize}px 'Noto Sans KR', sans-serif`;
      
      // Alternating text colors (Accent Pink vs White)
      ctx.fillStyle = index % 2 === 0 ? '#ec4899' : '#ffffff';
      
      // Draw text with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      
      // Limit text length to prevent overflow in wheel center
      const dispText = textLen > 9 ? snack.name.substring(0,8) + '..' : snack.name;
      ctx.fillText(dispText, radius - 20, 0);
      ctx.restore();
    });

    // Outer Chrome Border
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#a855f7';
    ctx.stroke();
  }

  // Initial load configuration
  selectRouletteSnacks();
  // Execute canvas drawing after a brief timeout to let container render layout
  setTimeout(resizeCanvas, 100);

  // Spin Action Handler
  btnSpin.addEventListener('click', spinWheel);
  
  // Clicking the wheel center also spins
  const centerBtn = document.querySelector('.wheel-center');
  if (centerBtn) {
    centerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      spinWheel();
    });
  }

  function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    btnSpin.disabled = true;
    
    // Choose 8 new random items on spin for variety
    selectRouletteSnacks();
    drawWheel();
    
    // Calculate randomized spin rotation
    const numSlices = rouletteSnacks.length;
    const winnerIndex = Math.floor(Math.random() * numSlices);
    const sliceAngle = 360 / numSlices;
    
    // Base 5 full spins (1800deg) + offset to align winning slice under the top pointer (which is at -90deg/270deg)
    // Pointer is at the top (270 degrees in canvas space).
    // Canvas draw starts at 0 degree (east/right).
    // To align winner slice at top:
    // winner slice center angle = (winnerIndex + 0.5) * sliceAngle.
    // We need to rotate the wheel by: 270 - (winnerIndex + 0.5) * sliceAngle.
    const targetDegrees = 1800 + (270 - (winnerIndex + 0.5) * sliceAngle);
    
    // Apply spin rotation transition
    rouletteWheel.style.transition = 'transform 5s cubic-bezier(0.1, 0.8, 0.1, 1)';
    rouletteWheel.style.transform = `rotate(${targetDegrees}deg)`;
    
    // Play subtle audio click or add visual pulse if desired
    rouletteWheel.classList.add('spinning');
    
    setTimeout(() => {
      // End of spin cycle
      isSpinning = false;
      btnSpin.disabled = false;
      rouletteWheel.classList.remove('spinning');
      
      const winner = rouletteSnacks[winnerIndex];
      
      // Dynamic overlay modal opening for the winner
      setTimeout(() => {
        openModal(winner.id);
        
        // Reset wheel rotation styling smoothly without animation transition
        rouletteWheel.style.transition = 'none';
        const finalRotation = targetDegrees % 360;
        rouletteWheel.style.transform = `rotate(${finalRotation}deg)`;
      }, 500);
      
    }, 5000);
  }

  // --- 5. Request Snack Modal & Formspree Integration ---
  const floatingReqBtn = document.getElementById('floating-req-btn');
  const searchRequestBtn = document.getElementById('search-request-btn');
  const requestModal = document.getElementById('request-modal');
  const requestModalCloseBtn = document.getElementById('request-modal-close-btn');
  const snackRequestForm = document.getElementById('snack-request-form');

  // Formspree Form ID (사용자가 본인의 ID로 교체 가능)
  const FORMSPREE_FORM_ID = 'YOUR_FORMSPREE_ID_HERE'; 

  if (requestModal && requestModalCloseBtn) {
    if (floatingReqBtn) {
      floatingReqBtn.addEventListener('click', () => {
        requestModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (searchRequestBtn) {
      searchRequestBtn.addEventListener('click', () => {
        const reqNameInput = document.getElementById('req-snack-name');
        if (reqNameInput && searchQuery) {
          reqNameInput.value = searchQuery;
        }
        requestModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    const closeRequestModal = () => {
      requestModal.classList.remove('active');
      document.body.style.overflow = '';
      if (snackRequestForm) snackRequestForm.reset();
    };

    requestModalCloseBtn.addEventListener('click', closeRequestModal);
    requestModal.addEventListener('click', (e) => {
      if (e.target === requestModal) closeRequestModal();
    });

    if (snackRequestForm) {
      snackRequestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const snackName = document.getElementById('req-snack-name').value;
        const submitBtn = document.getElementById('btn-submit-request');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> 전송 중...`;

        const actionUrl = FORMSPREE_FORM_ID !== 'YOUR_FORMSPREE_ID_HERE' 
          ? `https://formspree.io/f/${FORMSPREE_FORM_ID}`
          : null;

        if (actionUrl) {
          const data = new FormData(snackRequestForm);
          fetch(actionUrl, {
            method: 'POST',
            body: data,
            headers: {
              'Accept': 'application/json'
            }
          }).then(response => {
            if (response.ok) {
              showSuccessFeedback(snackName);
              closeRequestModal();
            } else {
              alert('전송 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
            }
            resetSubmitBtn();
          }).catch(error => {
            alert('네트워크 오류가 발생했습니다.');
            resetSubmitBtn();
          });
        } else {
          // Demo Mode (simulated send)
          setTimeout(() => {
            showSuccessFeedback(snackName);
            closeRequestModal();
            resetSubmitBtn();
          }, 1200);
        }

        function resetSubmitBtn() {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> 신청서 제출하기`;
        }

        function showSuccessFeedback(name) {
          alert(`[신청 완료] "${name}" 과자 신청이 정상 접수되었습니다!\n빠르게 검토 후 추가하도록 하겠습니다. 감사합니다! 🍪`);
        }
      });
    }
  }
});
