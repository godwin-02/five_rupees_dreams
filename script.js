/**
 * THE FIVE RUPEES DREAMS — Francis Soundararajan
 * Premium Author Platform · Complete Interaction Engine
 * =========================================================
 * Modules:
 *  1. NavEngine        — scroll effects, spy, mobile drawer
 *  2. GalleryEngine    — swipe + drag gallery with captions
 *  3. QuotesEngine     — book excerpt carousel
 *  4. ReviewEngine     — swipeable review carousel + CRUD
 *  5. ContactEngine    — EmailJS / FormSubmit delivery
 *  6. UtilEngine       — scroll reveals, back-to-top, footer year
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

/* ============================================================
   1. NAV ENGINE
   ============================================================ */
const NavEngine = (() => {
  const nav        = document.getElementById('main-nav');
  const toggle     = document.getElementById('menu-toggle');
  const drawer     = document.getElementById('nav-drawer');
  const overlay    = document.getElementById('nav-overlay');
  const progress   = document.getElementById('scroll-progress');
  const backTop    = document.getElementById('back-to-top');
  const navLinks   = document.querySelectorAll('.nav-links a');
  const sections   = document.querySelectorAll('main section[id]');
  const html       = document.documentElement;

  /* Scroll progress + nav shrink + back-to-top */
  const onScroll = () => {
    const scrollY   = window.scrollY;
    const maxScroll = html.scrollHeight - window.innerHeight;
    if (progress && maxScroll > 0) {
      progress.style.width = ((scrollY / maxScroll) * 100) + '%';
    }
    nav  && nav.classList.toggle('scrolled', scrollY > 40);
    backTop && backTop.classList.toggle('visible', scrollY > 500);
  };

  /* Scroll spy */
  const initSpy = () => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-35% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => obs.observe(s));
  };

  /* Mobile drawer */
  const openDrawer = () => {
    drawer  && drawer.classList.add('open');
    overlay && overlay.classList.add('active');
    toggle  && toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer  && drawer.classList.remove('open');
    overlay && overlay.classList.remove('active');
    toggle  && toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const init = () => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    initSpy();

    toggle  && toggle.addEventListener('click', () => {
      drawer && drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });

    overlay && overlay.addEventListener('click', closeDrawer);

    navLinks.forEach(a => a.addEventListener('click', closeDrawer));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });

    backTop && backTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  };

  return { init };
})();

/* ============================================================
   3. GALLERY ENGINE
   ============================================================ */
const GalleryEngine = (() => {

  const ITEMS = [
    {
      src: './images/author.jpeg',
      title: 'The Author',
      caption: 'Francis Soundararajan — Author, Chaplain & Humanitarian.',
      desc: 'A defining portrait of the man behind The Five Rupees Dreams, whose journey from poverty to purpose has inspired thousands.'
    },
    {
      src: './images/author-parents.jpeg',
      title: 'Sacred Ancestry',
      caption: 'The pillars of a humble origin — Francis with his parents.',
      desc: "A portrait of the author's parents, whose early lessons in faith and resilience shaped his lifelong mission."
    },
    {
      src: './images/author-family.jpeg',
      title: 'Foundational Support',
      caption: 'The complete Soundararajan family sharing a unified journey.',
      desc: 'Francis pictured with his loving family — his primary source of inspiration and strength in both ministry and writing.'
    },
    {
      src: './images/author old family photo.jpg',
      title: 'Early Family Memories',
      caption: 'The roots of a humble journey shaped by love, values, and perseverance.',
      desc: 'A precious historic glimpse into the family structure that nurtured Francis\'s dreams from a five-rupees beginning.'
    },
    {
      src: './images/author wife cherishing moments.jpg',
      title: 'Moments of Togetherness',
      caption: 'Shared laughter, companionship, and cherished family memories.',
      desc: 'Celebrating the quiet strength and partnership of marriage that has anchored decades of community leadership.'
    },
    {
      src: './images/author-daughter.jpeg',
      title: 'Joyous Exploration',
      caption: 'A beautiful snapshot of his daughter exploring the world.',
      desc: 'Cherishing moments of family life amidst the author\'s busy global commitments.'
    },
    {
      src: './images/little-daughter.jpeg',
      title: 'Little Daughter',
      caption: 'A source of inspiration, joy, and hope for tomorrow.',
      desc: 'The light and hope of the next generation, expressing joy and faith in abundance.'
    },
    {
      src: './images/authordaughter.jpeg',
      title: 'Cherished Horizons',
      caption: 'Francis sharing a bright moment with his eldest daughter.',
      desc: 'A heartwarming moment showing the unbreakable bond between father and daughter.'
    },
    {
      src: './images/father and daughter.jpeg',
      title: 'Father & Daughter',
      caption: 'A tender portrait of love, legacy, and lifelong connection.',
      desc: 'A quiet moment that speaks volumes — the bond between a father and his daughter, rooted in faith and warmth.'
    },
    {
      src: './images/author-inlaw.jpeg',
      title: 'Extended Legacies',
      caption: 'A cross-generational portrait with his parents-in-law.',
      desc: 'Celebrating heritage and family unity woven across generations.'
    },
    {
      src: './images/author-fams.jpeg',
      title: 'Kinship & Celebration',
      caption: 'The extended family gathered during a celebratory milestone.',
      desc: 'A joyous gathering of relatives reflecting the rich community life that anchors the author\'s story.',
      fallback: './images/family-gathering.jpeg'
    },
    {
      src: './images/cute family.jpeg',
      title: 'Joyful Family Moments',
      caption: 'Simple moments that became lasting memories and blessings.',
      desc: 'A beautiful reminder that the greatest gifts in life are the people we share our journey with.'
    },
    {
      src: './images/family-gathering.jpeg',
      title: 'Family Gathering',
      caption: 'Celebrating unity, traditions, and the strength of family bonds.',
      desc: 'Together in love and laughter — a family gathering that echoes the warmth woven throughout this biography.'
    },
    {
      src: './images/Grandchild.jpeg',
      title: 'Generations of Hope',
      caption: 'A reminder that every journey continues through future generations.',
      desc: 'The story does not end — it is carried forward with joy, innocence, and the promise of tomorrow.'
    },
    {
      src: './images/grandmother.jpeg',
      title: 'Beloved Grandmother',
      caption: 'Wisdom, sacrifice, and unconditional love across generations.',
      desc: 'A portrait honouring the quiet strength of a grandmother whose love laid the foundation for everything that followed.'
    },
    {
      src: './images/John and Uta the Publishers.JPG',
      title: 'Publishing Partners',
      caption: 'Friends and supporters who helped bring a dream into reality.',
      desc: 'Jürgen John and Uta John — the dedicated publishing team behind distributing The Five Rupees Dreams to the global stage.'
    },
    {
      src: './images/author with his wife and publisher.jpg',
      title: 'Author, Family & Publisher',
      caption: 'Celebrating partnership, support, and the journey of publishing.',
      desc: 'Commemorating the official milestone of bringing this transformational biography to print alongside loved ones.'
    },
    {
      src: './images/jubilee of Fr.Nelson.jpeg',
      title: 'Jubilee Celebration',
      caption: 'A joyful milestone honoring faith, service, and dedication.',
      desc: 'Marking years of faithful service — a jubilee that reflects the enduring spirit of pastoral commitment and community.'
    },
    {
      src: './images/Thooya with Fr. Nelson.jpeg',
      title: 'Thooya & Fr. Nelson',
      caption: 'A memorable moment of encouragement, learning, and friendship.',
      desc: 'A cherished encounter that bridged hearts and deepened the bonds of ecumenical fellowship and mutual respect.'
    },
    {
      src: './images/author with fr Nelson.JPG',
      title: 'Friendship & Guidance',
      caption: 'Meaningful moments with mentors who inspired growth and purpose.',
      desc: 'Strengthening ecumenical bonds and sharing a vision of pastoral care and chaplaincy worldwide.'
    },
    {
      src: './images/the ngo.jpg',
      title: 'Community Service Mission',
      caption: 'Empowering lives through education, compassion, and social outreach.',
      desc: 'Demonstrating the grassroots humanitarian operations and community development initiatives led by the author.'
    }
  ];

  const track    = document.getElementById('gallery-track');
  const prevBtn  = document.getElementById('gallery-prev');
  const nextBtn  = document.getElementById('gallery-next');
  const dotsWrap = document.getElementById('gallery-dots');
  const viewport = document.querySelector('.gallery-viewport');

  let current      = 0;
  let isAnimating  = false;
  let autoTimer    = null;
  let dragStart    = 0;
  let isDragging   = false;

  const total = ITEMS.length;

  const buildSlides = () => {
    if (!track) return;
    track.innerHTML = '';

    ITEMS.forEach((item, i) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `Photo ${i + 1} of ${total}: ${item.title}`);

      const img = document.createElement('img');
      img.src     = item.src;
      img.alt     = item.caption;
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      if (item.fallback) img.onerror = () => { img.src = item.fallback; };

      const cap = document.createElement('div');
      cap.className = 'gallery-caption';
      cap.setAttribute('aria-hidden', 'true');
      cap.innerHTML = `<h5>${item.title}</h5><p>${item.caption} — ${item.desc}</p>`;

      slide.appendChild(img);
      slide.appendChild(cap);
      track.appendChild(slide);
    });
  };

  const buildDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    ITEMS.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  };

  const updateUI = () => {
    const dots = dotsWrap ? dotsWrap.querySelectorAll('.gallery-dot') : [];
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  };

  const goTo = (index) => {
    if (isAnimating || index === current) return;
    isAnimating = true;
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateUI();
    setTimeout(() => { isAnimating = false; }, 580);
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5500);
  };

  const stopAuto  = () => clearInterval(autoTimer);

  /* Pointer / touch drag */
  const onDragStart = (x) => { dragStart = x; isDragging = true; stopAuto(); };
  const onDragEnd   = (x) => {
    if (!isDragging) return;
    isDragging = false;
    const delta = dragStart - x;
    if (Math.abs(delta) > 50) { delta > 0 ? next() : prev(); }
    startAuto();
  };

  const bindDrag = () => {
    if (!viewport) return;

    /* Touch */
    viewport.addEventListener('touchstart', e => onDragStart(e.changedTouches[0].clientX), { passive: true });
    viewport.addEventListener('touchend',   e => onDragEnd(e.changedTouches[0].clientX),   { passive: true });

    /* Mouse / Pointer */
    viewport.addEventListener('mousedown',  e => { e.preventDefault(); onDragStart(e.clientX); });
    window.addEventListener ('mouseup',    e => onDragEnd(e.clientX));
    viewport.style.cursor = 'grab';
    viewport.addEventListener('mousedown', () => { viewport.style.cursor = 'grabbing'; });
    window.addEventListener ('mouseup',   () => { viewport.style.cursor = 'grab'; });
  };

  const init = () => {
    if (!track) return;
    buildSlides();
    buildDots();
    updateUI();

    /* set track to flex with translateX */
    track.style.transform = 'translateX(0)';

    prevBtn && prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { next(); startAuto(); });

    /* Keyboard */
    document.addEventListener('keydown', e => {
      if (!viewport) return;
      const r = viewport.getBoundingClientRect();
      if (r.top > window.innerHeight || r.bottom < 0) return;
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { next(); startAuto(); }
      if (e.key === 'ArrowLeft')  { prev(); startAuto(); }
    });

    bindDrag();

    viewport && viewport.addEventListener('mouseenter', stopAuto);
    viewport && viewport.addEventListener('mouseleave', startAuto);
    startAuto();
  };

  return { init };
})();


/* ============================================================
   4. QUOTES ENGINE (Book excerpts)
   ============================================================ */
const QuotesEngine = (() => {
  const slides  = document.querySelectorAll('.quote-slide');
  const dots    = document.querySelectorAll('.quote-dot');
  let current   = 0;
  let timer     = null;

  const goTo = (i) => {
    slides[current].classList.remove('active');
    dots[current]  && dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]  && dots[current].classList.add('active');
  };

  const init = () => {
    if (!slides.length) return;

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    });

    const resetTimer = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 6000);
    };

    resetTimer();
  };

  return { init };
})();

/* ============================================================
   5. REVIEW ENGINE — swipeable carousel + CRUD
   ============================================================ */
const ReviewEngine = (() => {

  const STORAGE_KEY = 'frd-reviews-v6'; /* bumped from v5 — clears seeded data */

  /* ── DOM refs ───────────────────────────────────────────── */
  const track      = document.getElementById('reviews-track');
  const prevBtn    = document.getElementById('reviews-prev');
  const nextBtn    = document.getElementById('reviews-next');
  const dotsWrap   = document.getElementById('reviews-dots');
  const curEl      = document.getElementById('rev-current');
  const totEl      = document.getElementById('rev-total');
  const form       = document.getElementById('review-form');
  const editIdxInp = document.getElementById('rev-edit-index');
  const submitBtn  = document.getElementById('rev-submit-btn');
  const formTitle  = document.getElementById('review-form-title');
  const feedback   = document.getElementById('review-feedback');
  const modal      = document.getElementById('delete-modal');
  const modalOk    = document.getElementById('modal-confirm');
  const modalNo    = document.getElementById('modal-cancel');

  /* ── State ──────────────────────────────────────────────── */
  let reviews     = [];
  let current     = 0;
  let isAnim      = false;
  let autoTimer   = null;
  let dragStart   = 0;
  let isDragging  = false;
  const PER_PAGE  = 2; /* cards per "slide" on desktop */

  /* ── Storage ────────────────────────────────────────────── */
  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      reviews = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(reviews)) reviews = [];
    } catch (_) { reviews = []; }
  };

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)); } catch (_) {}
  };

  /* ── XSS guard ──────────────────────────────────────────── */
  const esc = s => String(s || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c])
  );

  /* ── Page count ─────────────────────────────────────────── */
  const perPage  = () => window.innerWidth <= 768 ? 1 : 2;
  const pages    = () => Math.max(1, Math.ceil(reviews.length / perPage()));

  /* ── Build track ────────────────────────────────────────── */
  const render = () => {
    if (!track) return;
    const pp    = perPage();
    const total = pages();
    track.innerHTML = '';

    /* Empty state */
    if (reviews.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'review-card';
      empty.setAttribute('role', 'group');
      empty.innerHTML = `
        <div class="review-node review-empty-state" style="text-align:center;padding:2.5rem 1.5rem;grid-column:1/-1;">
          <div style="font-size:2.5rem;margin-bottom:1rem;opacity:0.3;">✦</div>
          <p style="color:var(--text-muted);font-size:0.95rem;line-height:1.6;">No reviews yet. Be the first to share your experience with this book.</p>
        </div>`;
      track.appendChild(empty);
      if (curEl) curEl.textContent = '0';
      if (totEl) totEl.textContent = '0';
      if (dotsWrap) dotsWrap.innerHTML = '';
      const counterEl = document.getElementById('reviews-counter');
      if (counterEl) counterEl.style.visibility = 'hidden';
      const navEl = document.querySelector('.reviews-nav');
      if (navEl) { navEl.querySelector('#reviews-prev').style.visibility = 'hidden'; navEl.querySelector('#reviews-next').style.visibility = 'hidden'; }
      return;
    }

    /* Restore nav visibility */
    const counterEl = document.getElementById('reviews-counter');
    if (counterEl) counterEl.style.visibility = '';
    if (prevBtn) prevBtn.style.visibility = '';
    if (nextBtn) nextBtn.style.visibility = '';

    for (let p = 0; p < total; p++) {
      const page = document.createElement('div');
      page.className = 'review-card';
      page.setAttribute('role', 'group');
      page.setAttribute('aria-roledescription', 'slide');
      page.setAttribute('aria-label', `Reviews page ${p + 1} of ${total}`);

      const slice = reviews.slice(p * pp, p * pp + pp);
      slice.forEach((rev, localIdx) => {
        const globalIdx = p * pp + localIdx;
        page.appendChild(buildCard(rev, globalIdx));
      });

      track.appendChild(page);
    }

    /* Update counter & dots */
    if (curEl) curEl.textContent = Math.min(current + 1, total);
    if (totEl) totEl.textContent = total;

    buildDots(total);
    clampIndex(total);
    applyTransform();
  };

  const buildCard = (rev, idx) => {
    const node = document.createElement('div');
    node.className = 'review-node';
    node.innerHTML = `
      <span class="review-stars" aria-label="5 stars">★★★★★</span>
      <p class="review-text">"${esc(rev.text)}"</p>
      <h5 class="review-author">${esc(rev.name)}</h5>
      ${rev.role ? `<span class="review-role">${esc(rev.role)}</span>` : ''}
      <span class="review-date">${esc(rev.date || '')}</span>
      <div class="review-actions" aria-label="Review actions">
        <button class="review-crud-btn btn-edit-rev" data-action="edit" data-idx="${idx}" aria-label="Edit review by ${esc(rev.name)}">
          <i class="fas fa-pen" aria-hidden="true"></i> Edit
        </button>
        <button class="review-crud-btn btn-delete-rev" data-action="delete" data-idx="${idx}" aria-label="Delete review by ${esc(rev.name)}">
          <i class="fas fa-trash" aria-hidden="true"></i> Delete
        </button>
      </div>`;
    return node;
  };

  const buildDots = (total) => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot' + (i === current ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Reviews page ${i + 1}`);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  };

  const clampIndex = (total) => {
    if (current >= total) current = Math.max(0, total - 1);
  };

  const applyTransform = () => {
    if (track) track.style.transform = `translateX(-${current * 100}%)`;

    const total = pages();
    if (curEl) curEl.textContent = Math.min(current + 1, total);

    const dots = dotsWrap ? dotsWrap.querySelectorAll('.reviews-dot') : [];
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  };

  const goTo = (i) => {
    if (isAnim) return;
    isAnim  = true;
    current = (i + pages()) % pages();
    applyTransform();
    setTimeout(() => { isAnim = false; }, 580);
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 7000);
  };
  const stopAuto  = () => clearInterval(autoTimer);

  /* ── Drag / swipe ───────────────────────────────────────── */
  const container = document.querySelector('.reviews-track-container');
  const onDs = x => { dragStart = x; isDragging = true; stopAuto(); };
  const onDe = x => {
    if (!isDragging) return;
    isDragging = false;
    const d = dragStart - x;
    if (Math.abs(d) > 50) { d > 0 ? next() : prev(); }
    startAuto();
  };

  const bindDrag = () => {
    if (!container) return;
    container.addEventListener('touchstart', e => onDs(e.changedTouches[0].clientX), { passive: true });
    container.addEventListener('touchend',   e => onDe(e.changedTouches[0].clientX), { passive: true });
    container.addEventListener('mousedown',  e => { e.preventDefault(); onDs(e.clientX); });
    window.addEventListener   ('mouseup',   e => onDe(e.clientX));
    container.style.cursor = 'grab';
    container.addEventListener('mousedown', () => { container.style.cursor = 'grabbing'; });
    window.addEventListener   ('mouseup',  () => { container.style.cursor = 'grab'; });
  };

  /* ── Delegated click for edit/delete ────────────────────── */
  const onTrackClick = (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const idx    = parseInt(btn.dataset.idx, 10);
    const action = btn.dataset.action;
    if (action === 'edit')   triggerEdit(idx);
    if (action === 'delete') triggerDelete(idx);
  };

  /* ── Edit ───────────────────────────────────────────────── */
  const triggerEdit = (idx) => {
    if (isNaN(idx) || idx < 0 || idx >= reviews.length) return;
    const r = reviews[idx];
    const nameEl  = document.getElementById('rev-name');
    const titleEl = document.getElementById('rev-title');
    const textEl  = document.getElementById('rev-text');
    if (nameEl)  nameEl.value  = r.name  || '';
    if (titleEl) titleEl.value = r.role  || '';
    if (textEl)  textEl.value  = r.text  || '';
    editIdxInp.value   = idx;
    submitBtn.querySelector('span').textContent = 'Update Review';
    formTitle.textContent = 'Edit Your Review';
    clearFb();
    document.getElementById('review-form-section') &&
      document.getElementById('review-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ── Delete modal ───────────────────────────────────────── */
  const triggerDelete = (idx) => {
    if (!modal) return;
    modal.removeAttribute('hidden');
    requestAnimationFrame(() => modal.removeAttribute('hidden'));

    const newOk = modalOk.cloneNode(true);
    const newNo = modalNo.cloneNode(true);
    modalOk.replaceWith(newOk);
    modalNo.replaceWith(newNo);

    const close = () => {
      modal.setAttribute('hidden', '');
      document.removeEventListener('keydown', onEsc);
    };

    const onEsc = e => { if (e.key === 'Escape') close(); };

    newOk.addEventListener('click', () => {
      close();
      reviews.splice(idx, 1);
      save();
      current = 0;
      render();
      resetForm();
    });

    newNo.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); }, { once: true });
    document.addEventListener('keydown', onEsc);
    newNo.focus();
  };

  /* ── Feedback ───────────────────────────────────────────── */
  const showFb = (msg, type) => {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className   = 'form-feedback ' + type;
    if (type === 'success') setTimeout(clearFb, 5000);
  };
  const clearFb = () => {
    if (!feedback) return;
    feedback.textContent = '';
    feedback.className   = 'form-feedback';
  };

  /* ── Reset form ─────────────────────────────────────────── */
  const resetForm = () => {
    if (form) form.reset();
    editIdxInp.value = '';
    if (submitBtn) submitBtn.querySelector('span').textContent = 'Publish Review';
    if (formTitle) formTitle.textContent = 'Leave an Impression';
    clearFb();
  };

  /* ── Form submit ────────────────────────────────────────── */
  const initForm = () => {
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = (document.getElementById('rev-name')?.value  || '').trim();
      const role  = (document.getElementById('rev-title')?.value || '').trim();
      const text  = (document.getElementById('rev-text')?.value  || '').trim();
      const eidx  = editIdxInp.value;

      if (!name) { showFb('Please enter your name.', 'error');   document.getElementById('rev-name')?.focus();  return; }
      if (!text) { showFb('Please write a review.',  'error');   document.getElementById('rev-text')?.focus();  return; }

      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const obj   = { name, role, text, date: today };

      if (eidx !== '') {
        const i = parseInt(eidx, 10);
        if (!isNaN(i) && i >= 0 && i < reviews.length) {
          obj.date     = reviews[i].date || today;
          reviews[i]   = obj;
        }
      } else {
        reviews.unshift(obj);
      }

      save();
      current = 0;
      render();
      resetForm();
      showFb('Your review has been published.', 'success');
    });
  };

  /* ── Resize: re-render so per-page adapts ───────────────── */
  let resizeTimer;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { current = 0; render(); }, 300);
  };

  const init = () => {
    load();
    render();
    bindDrag();
    initForm();

    prevBtn && prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { next(); startAuto(); });
    track   && track.addEventListener('click', onTrackClick);

    window.addEventListener('resize', onResize, { passive: true });
    startAuto();
  };

  return { init };
})();


/* ============================================================
   6. CONTACT ENGINE
   ============================================================
   Two-tier delivery:
     Tier 1 — POST /api/contact  (Node/Express server.js)
              Works when the site is served via: npm start
     Tier 2 — FormSubmit.co      (zero-backend fallback)
              Works when the site is opened as a static file
              or the Node server is not yet running.
   Both tiers deliver to soundarfrancis@gmail.com with
   Reply-To set to the visitor's email.
   ============================================================ */
const ContactEngine = (() => {

  /* ── Config ─────────────────────────────────────────────── */
  const AUTHOR_EMAIL = 'soundarfrancis@gmail.com';
  const TIMEOUT_MS   = 14000;

  /*
   * Set BACKEND_URL to the full URL of your Node server when deployed.
   * Examples:
   *   'https://your-app.railway.app'
   *   'https://fiverupeesdreams.com'
   * Leave as '/api/contact' for local development (npm start).
   * When the server is unreachable the form falls back to FormSubmit.
   */
  const BACKEND_URL = '/api/contact';

  /* ── DOM refs ───────────────────────────────────────────── */
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const feedback  = document.getElementById('contact-feedback');

  /* ── UI helpers ─────────────────────────────────────────── */
  const showFb = (msg, type) => {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className   = 'form-feedback ' + type;
    if (type === 'success') setTimeout(clearFb, 9000);
  };

  const clearFb = () => {
    if (!feedback) return;
    feedback.textContent = '';
    feedback.className   = 'form-feedback';
  };

  const setLoading = (on) => {
    if (!submitBtn) return;
    submitBtn.classList.toggle('loading', on);
    submitBtn.disabled = on;
  };

  /* ── Tier 1: Node/Express backend ───────────────────────── */
  const sendViaBackend = async (name, email, message) => {
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

    let res;
    try {
      res = await fetch(BACKEND_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, message }),
        signal:  ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    console.log('[ContactEngine] Backend response:', res.status);

    /* 405 = server not running / wrong origin — let fallback handle it */
    if (res.status === 405 || res.status === 404) {
      throw Object.assign(new Error('backend_unavailable'), { fallback: true });
    }

    let data = {};
    try { data = await res.json(); } catch (_) {}

    if (!res.ok || !data.success) {
      throw new Error(data.message || `Server error ${res.status}`);
    }

    return data;
  };

  /* ── Tier 2: FormSubmit.co (no backend needed) ──────────── */
  const sendViaFormSubmit = async (name, email, message) => {
    console.log('[ContactEngine] Using FormSubmit fallback...');

    const payload = new FormData();
    payload.append('name',     name);
    payload.append('email',    email);
    payload.append('message',  message);
    payload.append('_replyto', email);
    payload.append('_subject', `New message from ${name} — Five Rupees Dreams`);
    payload.append('_captcha', 'false');
    payload.append('_template', 'box');

    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

    let res;
    try {
      res = await fetch(`https://formsubmit.co/ajax/${AUTHOR_EMAIL}`, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    payload,
        signal:  ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    console.log('[ContactEngine] FormSubmit response:', res.status);

    let data = {};
    try { data = await res.json(); } catch (_) {}

    if (!res.ok || data.success === false) {
      throw new Error('FormSubmit delivery failed');
    }
  };

  /* ── Form submit handler ────────────────────────────────── */
  const init = () => {
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFb();

      const name    = (document.getElementById('contact-name')?.value    || '').trim();
      const email   = (document.getElementById('contact-email')?.value   || '').trim();
      const message = (document.getElementById('contact-message')?.value || '').trim();

      /* Client-side validation */
      if (!name) {
        showFb('Please enter your name.', 'error');
        document.getElementById('contact-name')?.focus();
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFb('Please enter a valid email address.', 'error');
        document.getElementById('contact-email')?.focus();
        return;
      }
      if (!message) {
        showFb('Please write a message.', 'error');
        document.getElementById('contact-message')?.focus();
        return;
      }
      if (message.length < 10) {
        showFb('Message must be at least 10 characters.', 'error');
        document.getElementById('contact-message')?.focus();
        return;
      }

      setLoading(true);
      console.log('[ContactEngine] Sending... | Recipient:', AUTHOR_EMAIL);

      try {
        /* ── Try backend first ────────────────────────────── */
        try {
          await sendViaBackend(name, email, message);
          console.log('[ContactEngine] Success — delivered via backend.');
        } catch (backendErr) {
          /* Only fall back if backend is unreachable/405 */
          if (!backendErr.fallback) throw backendErr;

          console.log('[ContactEngine] Backend not available — trying FormSubmit...');
          await sendViaFormSubmit(name, email, message);
          console.log('[ContactEngine] Success — delivered via FormSubmit.');
        }

        form.reset();
        showFb('Your message has been sent to Francis. He will be in touch soon.', 'success');

      } catch (err) {
        const isAbort   = err.name === 'AbortError';
        const isNetwork = err.message === 'Failed to fetch';

        console.error('[ContactEngine] Failure:', err.message);

        if (isAbort) {
          showFb('Request timed out. Please check your connection and try again.', 'error');
        } else if (isNetwork) {
          showFb('Network error. Please email directly: ' + AUTHOR_EMAIL, 'error');
        } else {
          showFb(err.message || 'Message could not be sent. Please email: ' + AUTHOR_EMAIL, 'error');
        }
      } finally {
        setLoading(false);
      }
    });
  };

  return { init };
})();

/* ============================================================
   7. UTIL ENGINE — scroll reveals, back-to-top, footer year
   ============================================================ */
const UtilEngine = (() => {

  const initReveals = () => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
  };

  const initFooterYear = () => {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  };

  /* Keyboard-accessible modal close */
  const initModalA11y = () => {
    document.addEventListener('keydown', e => {
      const modal = document.getElementById('delete-modal');
      if (modal && !modal.hasAttribute('hidden') && e.key === 'Escape') {
        modal.setAttribute('hidden', '');
      }
    });
  };

  const init = () => {
    initReveals();
    initFooterYear();
    initModalA11y();
  };

  return { init };
})();

/* ============================================================
   BOOTSTRAP ALL MODULES
   ============================================================ */
NavEngine.init();
GalleryEngine.init();
QuotesEngine.init();
ReviewEngine.init();
ContactEngine.init();
UtilEngine.init();

}); /* end DOMContentLoaded */
