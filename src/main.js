import './style.css';
import { designs } from './designs.js';

document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     SCROLL PROGRESS BAR
     ============================================= */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* =============================================
     SCROLL REVEAL — Unified Observer
     ============================================= */
  const allReveal = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-flip'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  allReveal.forEach(el => revealObserver.observe(el));

  /* =============================================
     PARALLAX
     ============================================= */
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');

  function updateParallax() {
    const sy = window.scrollY;
    if (blob1) blob1.style.transform = `translateY(${sy * 0.25}px)`;
    if (blob2) blob2.style.transform = `translateY(${sy * -0.15}px)`;
  }
  window.addEventListener('scroll', updateParallax, { passive: true });

  /* =============================================
     ANIMATED STAT COUNTERS
     ============================================= */
  function animateCounter(el) {
    const text = el.innerHTML;
    const spanMatch = text.match(/<span>(.*?)<\/span>/);
    const suffix = spanMatch ? spanMatch[1] : '';
    const rawNum = text.replace(/<span>.*?<\/span>/g, '').trim();
    const target = parseInt(rawNum.replace(/[^0-9]/g, ''), 10);
    if (!target || isNaN(target)) return;
    const duration = 1400;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.innerHTML = Math.floor(eased * target) + (suffix ? `<span>${suffix}</span>` : '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsBar = document.querySelector('.hero-stats');
  if (statsBar) statsObserver.observe(statsBar);

  /* =============================================
     NAVBAR SCROLL EFFECT
     ============================================= */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* =============================================
     MOBILE MENU
     ============================================= */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  /* =============================================
     INTERACTIVE KIT LAB (JERSEY CUSTOMIZER)
     ============================================= */
  const svgJersey = document.getElementById('custom-jersey-svg');
  const inputCustomName = document.getElementById('custom-name');
  const inputCustomNum = document.getElementById('custom-num');
  
  const jerseyTextName = document.getElementById('jersey-name');
  const jerseyTextNum = document.getElementById('jersey-number');
  
  const selectCollar = document.getElementById('custom-collar');
  const selectPattern = document.getElementById('custom-pattern');
  const rectPattern = document.getElementById('jersey-pattern');
  
  const collarCrewPath = document.getElementById('collar-crew');
  const collarVPath = document.getElementById('collar-v');

  // Text inputs synchronization
  if (inputCustomName && jerseyTextName) {
    inputCustomName.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase();
      jerseyTextName.textContent = val || 'DEZIRE';
    });
  }

  if (inputCustomNum && jerseyTextNum) {
    inputCustomNum.addEventListener('input', (e) => {
      const val = e.target.value;
      jerseyTextNum.textContent = val || '10';
    });
  }

  // Color Selectors
  const primarySwatches = document.getElementById('primary-swatches');
  const accentSwatches = document.getElementById('accent-swatches');

  let activePrimary = '#FCE22A';
  let activeAccent = '#0D0D0D';

  function setupSwatches(container, isPrimary) {
    if (!container) return;
    const btns = container.querySelectorAll('.swatch-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const colorVal = btn.dataset.color;
        
        if (isPrimary) {
          activePrimary = colorVal;
          svgJersey.style.setProperty('--primary-color', activePrimary);
          
          // Update spec sheet
          const summaryPrimary = document.getElementById('summary-color-primary');
          const summaryPrimaryName = document.getElementById('summary-color-primary-name');
          if (summaryPrimary) summaryPrimary.style.background = activePrimary;
          if (summaryPrimaryName) summaryPrimaryName.textContent = btn.title;
        } else {
          activeAccent = colorVal;
          svgJersey.style.setProperty('--accent-color', activeAccent);
          svgJersey.style.setProperty('--text-color', activeAccent);

          // Update spec sheet
          const summaryAccent = document.getElementById('summary-color-accent');
          const summaryAccentName = document.getElementById('summary-color-accent-name');
          if (summaryAccent) summaryAccent.style.background = activeAccent;
          if (summaryAccentName) summaryAccentName.textContent = btn.title;
        }
      });
    });
  }

  setupSwatches(primarySwatches, true);
  setupSwatches(accentSwatches, false);

  // Collar toggles
  if (selectCollar) {
    selectCollar.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'vneck') {
        collarCrewPath.style.display = 'none';
        collarVPath.style.display = 'block';
        document.getElementById('summary-collar').textContent = 'V-Neck';
      } else {
        collarCrewPath.style.display = 'block';
        collarVPath.style.display = 'none';
        document.getElementById('summary-collar').textContent = 'Crew Neck';
      }
    });
  }

  // Pattern changes
  if (selectPattern && rectPattern) {
    selectPattern.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'none') {
        rectPattern.setAttribute('fill', 'none');
        document.getElementById('summary-pattern').textContent = 'Solid';
      } else {
        rectPattern.setAttribute('fill', `url(#pat-${val})`);
        document.getElementById('summary-pattern').textContent = selectPattern.options[selectPattern.selectedIndex].text;
      }
    });
  }

  // Inject customizable details to first Roster Row
  const applyBtn = document.getElementById('apply-to-roster-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const nameVal = inputCustomName.value.trim();
      const numVal = inputCustomNum.value.trim();
      
      const rosterRows = rosterContainer.querySelectorAll('.roster-row');
      if (rosterRows.length > 0) {
        const firstRow = rosterRows[0];
        const nameInput = firstRow.querySelector('input[placeholder="Player name"]');
        const numInput = firstRow.querySelector('input[placeholder="No."]');
        
        if (nameInput) nameInput.value = nameVal;
        if (numInput) numInput.value = numVal;
        
        showToast('✅ Custom kit details loaded into Roster row 1!');
        scrollToId('order');
        updateRosterSummary();
      }
    });
  }

  /* =============================================
     WORLD CUP PRESETS SELECTOR
     ============================================= */
  const wcCards = document.querySelectorAll('.wc-card');
  const presets = {
    'Argentina': {
      primary: '#FFFFFF',
      accent: '#6EC6F5',
      text: '#003087',
      pattern: 'stripes',
      name: 'MESSI',
      num: '10',
      collar: 'crew'
    },
    'Brazil': {
      primary: '#F7D02C',
      accent: '#009C3B',
      text: '#003399',
      pattern: 'none',
      name: 'VINÍCIUS',
      num: '10',
      collar: 'vneck'
    },
    'Portugal': {
      primary: '#D01515',
      accent: '#006400',
      text: '#FFFFFF',
      pattern: 'none',
      name: 'RONALDO',
      num: '7',
      collar: 'crew'
    },
    'India Cricket': {
      primary: '#003DA5',
      accent: '#FFB300',
      text: '#FFB300',
      pattern: 'mesh',
      name: 'KOHLI',
      num: '18',
      collar: 'crew'
    }
  };

  wcCards.forEach(card => {
    card.addEventListener('click', () => {
      const country = card.dataset.country;
      const config = presets[country];
      if (!config) return;

      // Apply primary color
      activePrimary = config.primary;
      svgJersey.style.setProperty('--primary-color', config.primary);
      const primBtn = Array.from(primarySwatches.querySelectorAll('.swatch-btn')).find(b => b.dataset.color.toLowerCase() === config.primary.toLowerCase());
      primarySwatches.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
      if (primBtn) primBtn.classList.add('active');
      document.getElementById('summary-color-primary').style.background = config.primary;
      document.getElementById('summary-color-primary-name').textContent = primBtn ? primBtn.title : 'Custom';

      // Apply accent color
      activeAccent = config.accent;
      svgJersey.style.setProperty('--accent-color', config.accent);
      svgJersey.style.setProperty('--text-color', config.text);
      const accBtn = Array.from(accentSwatches.querySelectorAll('.swatch-btn')).find(b => b.dataset.color.toLowerCase() === config.accent.toLowerCase());
      accentSwatches.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
      if (accBtn) accBtn.classList.add('active');
      document.getElementById('summary-color-accent').style.background = config.accent;
      document.getElementById('summary-color-accent-name').textContent = accBtn ? accBtn.title : 'Custom';

      // Apply name & number
      inputCustomName.value = config.name;
      jerseyTextName.textContent = config.name;
      inputCustomNum.value = config.num;
      jerseyTextNum.textContent = config.num;

      // Apply pattern
      selectPattern.value = config.pattern;
      if (config.pattern === 'none') {
        rectPattern.setAttribute('fill', 'none');
        document.getElementById('summary-pattern').textContent = 'Solid';
      } else {
        rectPattern.setAttribute('fill', `url(#pat-${config.pattern})`);
        document.getElementById('summary-pattern').textContent = selectPattern.options[selectPattern.selectedIndex].text;
      }

      // Apply collar
      selectCollar.value = config.collar;
      if (config.collar === 'vneck') {
        collarCrewPath.style.display = 'none';
        collarVPath.style.display = 'block';
        document.getElementById('summary-collar').textContent = 'V-Neck';
      } else {
        collarCrewPath.style.display = 'block';
        collarVPath.style.display = 'none';
        document.getElementById('summary-collar').textContent = 'Crew Neck';
      }

      // Live updates to the main Form Sport Selection
      const sportsCard = Array.from(document.querySelectorAll('.sport-card')).find(c => c.dataset.sport === (country === 'India Cricket' ? 'Cricket' : 'Football'));
      if (sportsCard) selectSport(sportsCard);

      // Toast notification & smooth scroll
      showToast(`🏆 Loaded ${country} preset template!`);
      scrollToId('home');
    });
  });

  /* =============================================
     SPORT SELECTION
     ============================================= */
  const sportCards = document.querySelectorAll('.sport-card');
  const sportInput = document.getElementById('selected-sport');
  const sportValText = document.getElementById('sport-val-text');
  const dispSport = document.getElementById('disp-sport');

  sportCards.forEach(card => {
    card.addEventListener('click', () => selectSport(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectSport(card); }
    });
  });

  function selectSport(card) {
    sportCards.forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
    card.classList.add('selected');
    card.setAttribute('aria-pressed', 'true');
    const sport = card.dataset.sport;
    sportInput.value = sport;
    sportValText.textContent = `⚡ ${sport}`;
    dispSport.classList.add('active');
    
    // Update spec sheet
    const summarySport = document.getElementById('summary-sport');
    if (summarySport) summarySport.textContent = sport;

    // Toggle sleeves for basketball
    if (sport === 'Basketball') {
      const sleeveL = document.getElementById('jersey-sleeve-l');
      const sleeveLAcc = document.getElementById('jersey-sleeve-l-accent');
      const sleeveR = document.getElementById('jersey-sleeve-r');
      const sleeveRAcc = document.getElementById('jersey-sleeve-r-accent');
      if (sleeveL) sleeveL.style.display = 'none';
      if (sleeveLAcc) sleeveLAcc.style.display = 'none';
      if (sleeveR) sleeveR.style.display = 'none';
      if (sleeveRAcc) sleeveRAcc.style.display = 'none';
    } else {
      const sleeveL = document.getElementById('jersey-sleeve-l');
      const sleeveLAcc = document.getElementById('jersey-sleeve-l-accent');
      const sleeveR = document.getElementById('jersey-sleeve-r');
      const sleeveRAcc = document.getElementById('jersey-sleeve-r-accent');
      if (sleeveL) sleeveL.style.display = 'block';
      if (sleeveLAcc) sleeveLAcc.style.display = 'block';
      if (sleeveR) sleeveR.style.display = 'block';
      if (sleeveRAcc) sleeveRAcc.style.display = 'block';
    }

    showToast(`Sport: ${sport} selected`);
    setTimeout(() => {
      const mat = document.getElementById('materials');
      if (mat && window.scrollY < mat.offsetTop - 200) {
        mat.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  }

  /* =============================================
     MATERIAL SELECTION & FABRIC SCANNER ZOOM
     ============================================= */
  const materialCards = document.querySelectorAll('.material-card');
  const materialInput = document.getElementById('selected-material');
  const materialValText = document.getElementById('material-val-text');
  const dispMaterial = document.getElementById('disp-material');
  
  const zoomRect = document.getElementById('zoom-rect');
  const zoomLabel = document.getElementById('texture-label-display');
  const zoomSlider = document.getElementById('texture-zoom');

  const patternMapping = {
    'Polyester Dry-Fit': { pattern: 'url(#zoom-pat-dryfit)', text: 'Polyester Dry-Fit Weave' },
    'Microfiber Mesh': { pattern: 'url(#zoom-pat-mesh)', text: 'Microfiber Honeycomb Mesh' },
    'Spandex Blend': { pattern: 'url(#zoom-pat-spandex)', text: 'Spandex 4-Way Ribbed Blend' },
    'Cotton Blend': { pattern: 'url(#zoom-pat-cotton)', text: 'Soft Organic Cotton Weave' }
  };

  materialCards.forEach(card => {
    card.addEventListener('click', () => selectMaterial(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMaterial(card); }
    });
  });

  function selectMaterial(card) {
    materialCards.forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
    card.classList.add('selected');
    card.setAttribute('aria-pressed', 'true');
    const material = card.dataset.material;
    materialInput.value = material;
    materialValText.textContent = `🧵 ${material}`;
    dispMaterial.classList.add('active');

    // Update fabric scanner
    const match = patternMapping[material];
    if (match && zoomRect && zoomLabel) {
      zoomRect.setAttribute('fill', match.pattern);
      zoomLabel.textContent = match.text;
    }
    
    // Update spec sheet
    const summaryMaterial = document.getElementById('summary-material');
    if (summaryMaterial) summaryMaterial.textContent = material;

    showToast(`Material: ${material} selected`);
    setTimeout(() => {
      const order = document.getElementById('order');
      if (order && window.scrollY < order.offsetTop - 200) {
        order.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  }

  // Handle Zoom Scale slider
  if (zoomSlider && svgJersey) {
    zoomSlider.addEventListener('input', (e) => {
      const scale = e.target.value;
      const patterns = ['zoom-pat-dryfit', 'zoom-pat-mesh', 'zoom-pat-spandex', 'zoom-pat-cotton'];
      patterns.forEach(patId => {
        const pat = document.getElementById(patId);
        if (pat) pat.setAttribute('patternTransform', `scale(${scale})`);
      });
    });
  }

  /* =============================================
     DYNAMIC ROSTER & INVOICE SPEC SHEET SPECIFICS
     ============================================= */
  const rosterContainer = document.getElementById('roster-container');
  const addPlayerBtn = document.getElementById('add-player');
  const rosterCountEl = document.getElementById('roster-count');
  let playerIndex = 0;

  function updateCount() {
    const n = rosterContainer.querySelectorAll('.roster-row').length;
    rosterCountEl.textContent = `${n} player${n !== 1 ? 's' : ''}`;
  }

  function refreshNumbers() {
    rosterContainer.querySelectorAll('.roster-row').forEach((row, i) => {
      const numEl = row.querySelector('.row-num');
      if (numEl) numEl.textContent = i + 1;
    });
  }

  // Live Spec Sheet Invoice Calculator
  function updateRosterSummary() {
    const rows = rosterContainer.querySelectorAll('.roster-row');
    const totalCount = rows.length;
    document.getElementById('summary-count').textContent = `${totalCount} Player${totalCount !== 1 ? 's' : ''}`;

    const sizes = { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'XXL+': 0 };
    rows.forEach(row => {
      const select = row.querySelector('select');
      if (select && select.value) {
        const val = select.value;
        if (['XXL', 'XXXL'].includes(val)) {
          sizes['XXL+']++;
        } else if (sizes.hasOwnProperty(val)) {
          sizes[val]++;
        }
      }
    });

    const sizeGrid = document.getElementById('summary-sizes');
    if (sizeGrid) {
      sizeGrid.innerHTML = `
        <div class="size-badge">XS: ${sizes.XS}</div>
        <div class="size-badge">S: ${sizes.S}</div>
        <div class="size-badge">M: ${sizes.M}</div>
        <div class="size-badge">L: ${sizes.L}</div>
        <div class="size-badge">XL: ${sizes.XL}</div>
        <div class="size-badge">XXL+: ${sizes['XXL+']}</div>
      `;
    }
  }

  function addPlayerRow() {
    playerIndex++;
    const row = document.createElement('div');
    row.className = 'roster-row';
    row.innerHTML = `
      <div class="row-num">${playerIndex}</div>
      <input type="text" placeholder="Player name" aria-label="Player Name" required>
      <input type="number" placeholder="No." min="0" max="999" aria-label="Jersey Number" required>
      <select aria-label="Size" required>
        <option value="" disabled selected>Size</option>
        <option>XS</option><option>S</option><option>M</option>
        <option>L</option><option>XL</option><option>XXL</option><option>XXXL</option>
      </select>
      <button type="button" class="remove-btn" aria-label="Remove">✕</button>
    `;

    row.querySelector('.remove-btn').addEventListener('click', () => {
      row.style.transition = 'opacity 0.2s, transform 0.2s';
      row.style.opacity = '0';
      row.style.transform = 'translateX(-10px)';
      setTimeout(() => { 
        row.remove(); 
        updateCount(); 
        refreshNumbers(); 
        updateRosterSummary();
      }, 200);
    });

    row.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', updateRosterSummary);
      input.addEventListener('change', updateRosterSummary);
    });

    rosterContainer.appendChild(row);
    updateCount();
    updateRosterSummary();
    setTimeout(() => {
      const inp = row.querySelector('input');
      if (inp) inp.focus();
    }, 60);
  }

  addPlayerRow();
  addPlayerBtn.addEventListener('click', addPlayerRow);

  /* =============================================
     DESIGNS GALLERY
     ============================================= */
  const designsGrid      = document.getElementById('designs-grid');
  const loadMoreBtn      = document.getElementById('load-more-btn');
  const loadMoreWrap     = document.getElementById('load-more-wrap');
  const designsCountLbl  = document.getElementById('designs-count-label');
  const designSearchInput= document.getElementById('design-search');

  const PAGE_SIZE = 20;
  let currentPage = 1;
  let filteredDesigns = designs.slice();

  function renderDesigns() {
    const pageItems = filteredDesigns.slice(0, currentPage * PAGE_SIZE);
    designsGrid.innerHTML = pageItems.map(d => `
      <div class="design-card reveal-flip" data-id="${d.id}" tabindex="0" role="button" aria-label="Design ${d.id}">
        <div class="design-img-wrap">
          <img src="${d.thumb}" alt="Jersey Design #${d.id}" loading="lazy" draggable="false">
          <div class="design-wm-layer" aria-hidden="true">DEZIRE SPORTS WEAR</div>
        </div>
        <div class="design-card-footer">
          <span class="design-num">Design #${d.id}</span>
          <button class="btn-customize" data-id="${d.id}">Customize →</button>
        </div>
      </div>
    `).join('');

    // Re-observe reveal elements
    designsGrid.querySelectorAll('.reveal-flip').forEach(el => revealObserver.observe(el));

    // Bind card & button clicks
    designsGrid.querySelectorAll('.design-card').forEach(card => {
      card.addEventListener('click', e => {
        if (!e.target.closest('.btn-customize')) openDesignModal(card.dataset.id);
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDesignModal(card.dataset.id); }
      });
    });
    designsGrid.querySelectorAll('.btn-customize').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); openDesignModal(btn.dataset.id); });
    });

    const showing = pageItems.length;
    designsCountLbl.textContent = `Showing ${showing} of ${filteredDesigns.length} designs`;
    if (showing >= filteredDesigns.length) {
      loadMoreWrap.style.display = 'none';
    } else {
      loadMoreWrap.style.display = 'flex';
    }
  }

  loadMoreBtn.addEventListener('click', () => { currentPage++; renderDesigns(); });

  designSearchInput.addEventListener('input', () => {
    const q = designSearchInput.value.trim().replace(/[^0-9]/g, '');
    filteredDesigns = q ? designs.filter(d => d.id.includes(q)) : designs.slice();
    currentPage = 1;
    renderDesigns();
  });

  renderDesigns();

  /* =============================================
     DESIGN CUSTOMIZER MODAL
     ============================================= */
  const designModal   = document.getElementById('design-modal');
  const modalClose    = document.getElementById('modal-close');
  const modalImg      = document.getElementById('modal-design-img');
  const modalDesignId = document.getElementById('modal-design-id');
  const modalRosterContainer = document.getElementById('modal-roster-container');
  const modalAddPlayer= document.getElementById('modal-add-player');
  const modalRosterCount = document.getElementById('modal-roster-count');
  const modalLogoFile = document.getElementById('modal-logo-file');
  const modalLogoLabelText = document.getElementById('modal-logo-label-text');

  let modalPlayerIndex = 0;
  let activeDesignId = null;

  function openDesignModal(id) {
    const design = designs.find(d => d.id === id);
    if (!design) return;
    activeDesignId = id;
    modalImg.src = design.full;
    modalImg.alt = `Jersey Design #${id}`;
    modalDesignId.textContent = `Design #${id}`;
    document.getElementById('modal-team-name').value = '';
    document.getElementById('modal-branding-name').value = '';
    document.getElementById('modal-notes').value = '';
    modalLogoLabelText.textContent = 'Upload logo…';
    modalLogoFile.value = '';
    modalRosterContainer.innerHTML = '';
    modalPlayerIndex = 0;
    addModalPlayerRow();
    designModal.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeDesignModal() {
    designModal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  modalClose.addEventListener('click', closeDesignModal);
  designModal.addEventListener('click', e => { if (e.target === designModal) closeDesignModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDesignModal(); });

  modalLogoFile.addEventListener('change', () => {
    const f = modalLogoFile.files[0];
    modalLogoLabelText.textContent = f ? f.name : 'Upload logo…';
  });

  function updateModalRosterCount() {
    const n = modalRosterContainer.querySelectorAll('.roster-row').length;
    modalRosterCount.textContent = `${n} player${n !== 1 ? 's' : ''}`;
  }

  function addModalPlayerRow() {
    modalPlayerIndex++;
    const row = document.createElement('div');
    row.className = 'roster-row';
    row.innerHTML = `
      <div class="row-num">${modalPlayerIndex}</div>
      <input type="text" placeholder="Player name" aria-label="Player Name">
      <input type="number" placeholder="No." min="0" max="999" aria-label="Jersey Number">
      <select aria-label="Size">
        <option value="" disabled selected>Size</option>
        <option>XS</option><option>S</option><option>M</option>
        <option>L</option><option>XL</option><option>XXL</option><option>XXXL</option>
      </select>
      <button type="button" class="remove-btn" aria-label="Remove">✕</button>
    `;
    row.querySelector('.remove-btn').addEventListener('click', () => {
      row.remove();
      modalRosterContainer.querySelectorAll('.roster-row').forEach((r, i) => {
        const numEl = r.querySelector('.row-num');
        if (numEl) numEl.textContent = i + 1;
      });
      updateModalRosterCount();
    });
    modalRosterContainer.appendChild(row);
    updateModalRosterCount();
  }

  modalAddPlayer.addEventListener('click', addModalPlayerRow);

  function buildOrderMessage(designId, teamName, brandName, notes, roster) {
    const rosterLines = roster.map((p, i) =>
      `  ${i + 1}. ${p.name || '—'} | #${p.num || '—'} | ${p.size || '—'}`
    ).join('\n');
    return [
      `*DEZIRE SPORTS WEAR — ORDER ENQUIRY*`,
      ``,
      `Design:  #${designId}`,
      `Team:    ${teamName || '—'}`,
      brandName ? `Branding: ${brandName}` : null,
      ``,
      `*Roster (${roster.length} player${roster.length !== 1 ? 's' : ''}):*`,
      rosterLines,
      notes ? `\nNotes: ${notes}` : null,
      ``,
      `_(Logo will be shared as image in this thread)_`,
    ].filter(l => l !== null).join('\n');
  }

  function collectModalRoster() {
    const rows = modalRosterContainer.querySelectorAll('.roster-row');
    return Array.from(rows).map(row => {
      const inputs = row.querySelectorAll('input');
      const sel = row.querySelector('select');
      return { name: inputs[0]?.value.trim(), num: inputs[1]?.value.trim(), size: sel?.value };
    });
  }

  document.getElementById('modal-submit-wa').addEventListener('click', () => {
    const teamName  = document.getElementById('modal-team-name').value.trim();
    const brandName = document.getElementById('modal-branding-name').value.trim();
    const notes     = document.getElementById('modal-notes').value.trim();
    if (!teamName) { document.getElementById('modal-team-name').focus(); showToast('⚠️ Enter your team name!'); return; }
    const roster = collectModalRoster();
    const msg = buildOrderMessage(activeDesignId, teamName, brandName, notes, roster);
    window.open(`https://wa.me/919809080973?text=${encodeURIComponent(msg)}`, '_blank');
    closeDesignModal();
    showToast('✅ Opening WhatsApp with your order!');
  });

  document.getElementById('modal-submit-email').addEventListener('click', () => {
    const teamName  = document.getElementById('modal-team-name').value.trim();
    const brandName = document.getElementById('modal-branding-name').value.trim();
    const notes     = document.getElementById('modal-notes').value.trim();
    if (!teamName) { document.getElementById('modal-team-name').focus(); showToast('⚠️ Enter your team name!'); return; }
    const roster = collectModalRoster();
    const subject = encodeURIComponent(`Order Enquiry – Design #${activeDesignId} – ${teamName}`);
    const body = encodeURIComponent(buildOrderMessage(activeDesignId, teamName, brandName, notes, roster).replace(/\*/g, '').replace(/_/g, ''));
    window.open(`mailto:deziresportswearweb@gmail.com?subject=${subject}&body=${body}`, '_self');
    closeDesignModal();
    showToast('✅ Opening email with your order!');
  });

  /* =============================================
     ORDER FORM — design pre-fill from gallery
     ============================================= */
  const selectedDesignInput = document.getElementById('selected-design');
  const summaryDesign = document.getElementById('summary-design');

  // expose so gallery cards can prefill the form via "Use this design" path
  window._selectDesignForForm = function(id) {
    selectedDesignInput.value = id;
    if (summaryDesign) summaryDesign.textContent = `#${id}`;
  };

  /* =============================================
     FORM SUBMISSION — real WhatsApp + Email
     ============================================= */
  const form = document.getElementById('order-form');

  function validateAndCollectForm() {
    const sport      = sportInput.value;
    const material   = materialInput.value;
    const teamName   = document.getElementById('team-name').value.trim();
    const contactName= document.getElementById('contact-name').value.trim();
    const phone      = document.getElementById('phone').value.trim();
    const designId   = selectedDesignInput?.value || '';
    const email      = document.getElementById('email').value.trim();
    const notes      = document.getElementById('notes').value.trim();

    if (!sport)        { showToast('⚠️ Please select a sport first!');       scrollToId('sports');    return null; }
    if (!material)     { showToast('⚠️ Please select a material!');           scrollToId('materials'); return null; }
    if (!teamName)     { document.getElementById('team-name').focus();       showToast('⚠️ Enter your team name!');    return null; }
    if (!contactName)  { document.getElementById('contact-name').focus();   showToast('⚠️ Enter your name!');         return null; }
    if (!phone)        { document.getElementById('phone').focus();           showToast('⚠️ Enter your phone number!'); return null; }

    let valid = true;
    rosterContainer.querySelectorAll('.roster-row').forEach(row => {
      row.querySelectorAll('input, select').forEach(inp => {
        if (!inp.value) { valid = false; inp.style.borderColor = '#EF4444'; }
        else inp.style.borderColor = '';
      });
    });
    if (!valid) { showToast('⚠️ Please complete all player details!'); return null; }

    const roster = Array.from(rosterContainer.querySelectorAll('.roster-row')).map(row => {
      const inputs = row.querySelectorAll('input');
      const sel = row.querySelector('select');
      return { name: inputs[0]?.value.trim(), num: inputs[1]?.value.trim(), size: sel?.value };
    });

    return { sport, material, teamName, contactName, phone, email, notes, designId, roster };
  }

  function buildFullOrderMessage(data) {
    const rosterLines = data.roster.map((p, i) =>
      `  ${i + 1}. ${p.name} | #${p.num} | ${p.size}`
    ).join('\n');
    return [
      `*DEZIRE SPORTS WEAR — ORDER ENQUIRY*`,
      ``,
      data.designId ? `Design:   #${data.designId}` : null,
      `Sport:    ${data.sport}`,
      `Material: ${data.material}`,
      `Team:     ${data.teamName}`,
      `Contact:  ${data.contactName} | ${data.phone}`,
      data.email ? `Email:    ${data.email}` : null,
      ``,
      `*Roster (${data.roster.length} player${data.roster.length !== 1 ? 's' : ''}):*`,
      rosterLines,
      data.notes ? `\nNotes: ${data.notes}` : null,
    ].filter(l => l !== null).join('\n');
  }

  function resetForm() {
    form.reset();
    sportCards.forEach(c => c.classList.remove('selected'));
    materialCards.forEach(c => c.classList.remove('selected'));
    sportInput.value = ''; materialInput.value = '';
    if (selectedDesignInput) selectedDesignInput.value = '';
    sportValText.textContent = 'Not selected yet';
    materialValText.textContent = 'Not selected yet';
    dispSport.classList.remove('active');
    dispMaterial.classList.remove('active');
    rosterContainer.innerHTML = '';
    playerIndex = 0;
    addPlayerRow();
    document.getElementById('summary-sport').textContent = '—';
    document.getElementById('summary-material').textContent = '—';
    if (summaryDesign) summaryDesign.textContent = 'Not selected';
    updateRosterSummary();
  }

  // WhatsApp submit (primary button)
  document.getElementById('submit-btn').addEventListener('click', e => {
    if (e.target.closest('form')) return; // let form submit handle if needed
    const data = validateAndCollectForm();
    if (!data) return;
    const msg = buildFullOrderMessage(data);
    window.open(`https://wa.me/919809080973?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('✅ Opening WhatsApp with your order!');
    resetForm();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const channel = document.activeElement?.dataset?.channel;
    const data = validateAndCollectForm();
    if (!data) return;
    const msg = buildFullOrderMessage(data);

    if (channel === 'email') {
      const subject = encodeURIComponent(`Order Enquiry – ${data.teamName} – ${data.sport}`);
      const body = encodeURIComponent(msg.replace(/\*/g, '').replace(/_/g, ''));
      window.open(`mailto:deziresportswearweb@gmail.com?subject=${subject}&body=${body}`, '_self');
      showToast('✅ Opening email with your order!');
    } else {
      window.open(`https://wa.me/919809080973?text=${encodeURIComponent(msg)}`, '_blank');
      showToast('✅ Opening WhatsApp with your order!');
    }
    resetForm();
  });

  function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* =============================================
     TOAST
     ============================================= */
  let toastTimer;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

});
