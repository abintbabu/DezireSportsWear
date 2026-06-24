import './style.css';

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
     covers .reveal, .reveal-left, .reveal-right,
             .reveal-scale, .reveal-flip
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
     PARALLAX — Hero blobs & jersey follow scroll
     ============================================= */
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');
  const jerseyCard = document.querySelector('.jersey-card');

  function updateParallax() {
    const sy = window.scrollY;
    if (blob1) blob1.style.transform = `translateY(${sy * 0.25}px)`;
    if (blob2) blob2.style.transform = `translateY(${sy * -0.15}px)`;
    if (jerseyCard) jerseyCard.style.transform = `translateY(${sy * 0.08}px)`;
  }
  window.addEventListener('scroll', updateParallax, { passive: true });

  /* =============================================
     ANIMATED STAT COUNTERS
     ============================================= */
  function animateCounter(el) {
    const text = el.innerHTML;
    // Extract the <span> suffix HTML if present
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

  menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
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
    showToast(`Sport: ${sport} selected`);
    setTimeout(() => {
      const mat = document.getElementById('materials');
      if (mat && window.scrollY < mat.offsetTop - 200) {
        mat.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  }

  /* =============================================
     MATERIAL SELECTION
     ============================================= */
  const materialCards = document.querySelectorAll('.material-card');
  const materialInput = document.getElementById('selected-material');
  const materialValText = document.getElementById('material-val-text');
  const dispMaterial = document.getElementById('disp-material');

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
    showToast(`Material: ${material} selected`);
    setTimeout(() => {
      const order = document.getElementById('order');
      if (order && window.scrollY < order.offsetTop - 200) {
        order.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  }

  /* =============================================
     DYNAMIC ROSTER
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
      setTimeout(() => { row.remove(); updateCount(); refreshNumbers(); }, 200);
    });

    rosterContainer.appendChild(row);
    updateCount();
    setTimeout(() => row.querySelector('input').focus(), 60);
  }

  addPlayerRow();
  addPlayerBtn.addEventListener('click', addPlayerRow);

  /* =============================================
     FORM SUBMISSION
     ============================================= */
  const form = document.getElementById('order-form');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const sport      = sportInput.value;
    const material   = materialInput.value;
    const teamName   = document.getElementById('team-name').value.trim();
    const contactName= document.getElementById('contact-name').value.trim();
    const phone      = document.getElementById('phone').value.trim();

    if (!sport)        { showToast('⚠️ Please select a sport first!');       scrollToId('sports');    return; }
    if (!material)     { showToast('⚠️ Please select a material!');           scrollToId('materials'); return; }
    if (!teamName)     { document.getElementById('team-name').focus();       showToast('⚠️ Enter your team name!');    return; }
    if (!contactName)  { document.getElementById('contact-name').focus();   showToast('⚠️ Enter your name!');         return; }
    if (!phone)        { document.getElementById('phone').focus();           showToast('⚠️ Enter your phone number!'); return; }

    let valid = true;
    rosterContainer.querySelectorAll('.roster-row').forEach(row => {
      row.querySelectorAll('input, select').forEach(inp => {
        if (!inp.value) { valid = false; inp.style.borderColor = '#EF4444'; }
        else inp.style.borderColor = '';
      });
    });
    if (!valid) { showToast('⚠️ Please complete all player details!'); return; }

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast('✅ Enquiry submitted! Anoop will reach out to you soon.');
      form.reset();
      sportCards.forEach(c => c.classList.remove('selected'));
      materialCards.forEach(c => c.classList.remove('selected'));
      sportInput.value = ''; materialInput.value = '';
      sportValText.textContent = 'Not selected yet';
      materialValText.textContent = 'Not selected yet';
      dispSport.classList.remove('active');
      dispMaterial.classList.remove('active');
      rosterContainer.innerHTML = '';
      playerIndex = 0;
      addPlayerRow();
      submitBtn.textContent = 'Submit Enquiry  →';
      submitBtn.disabled = false;
    }, 1200);
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
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

});
