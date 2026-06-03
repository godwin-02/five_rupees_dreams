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
      title: 'Roots of Resilience',
      caption: 'An archival portrait capturing the author\'s earliest roots.',
      desc: 'A precious historic glimpse into the family structure that nurtured Francis\'s dreams from a five-rupees beginning.'
    },
    {
      src: './images/author wife cherishing moments.jpg',
      title: 'Devoted Partnership',
      caption: 'Francis sharing a quiet moment of gratitude with his wife.',
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
      title: 'The Future Generation',
      caption: 'His youngest daughter — radiant with hope and possibility.',
      desc: 'The light and hope of the next generation, expressing joy and faith in abundance.'
    },
    {
      src: './images/authordaughter.jpeg',
      title: 'Cherished Horizons',
      caption: 'Francis sharing a bright moment with his eldest daughter.',
      desc: 'A heartwarming moment showing the unbreakable bond between father and daughter.'
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
      src: './images/John and Uta the Publishers.JPG',
      title: 'Visionary Collaborators',
      caption: 'Jürgen John and Uta John — the publishing visionaries.',
      desc: 'The dedicated publishing team behind distributing The Five Rupees Dreams to the global stage.'
    },
    {
      src: './images/author with his wife and publisher.jpg',
      title: 'The Publishing Alliance',
      caption: 'The author, his wife, and publisher at the book release.',
      desc: 'Commemorating the official milestone of bringing this transformational biography to print.'
    },
    {
      src: './images/the ngo.jpg',
      title: 'Global Humanitarian Impact',
      caption: 'Community outreach programs supported by the author\'s work.',
      desc: 'Demonstrating the grassroots humanitarian operations and community development initiatives led by the author.'
    },
    {
      src: './images/author with fr Nelson.JPG',
      title: 'Ministry & Fellowship',
      caption: 'Chaplain Francis Soundararajan in fellowship with Father Nelson.',
      desc: 'Strengthening ecumenical bonds and sharing a vision of pastoral care and chaplaincy worldwide.'
    }
  ];

  const track    = document.getElementById('gallery-track');
  const prevBtn  = document.getElementById('gallery-prev');
  const nextBtn  = document.getElementById('gallery-next');
  const dotsWrap = document.getElementById('gallery-dots');
  const curEl    = document.getElementById('gallery-current');
  const totEl    = document.getElementById('gallery-total');
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
    if (curEl) curEl.textContent = current + 1;
    if (totEl) totEl.textContent = total;

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
   6. CONTACT ENGINE — EmailJS with FormSubmit fallback
   ============================================================ */
const ContactEngine = (() => {

  /*
   * ── EmailJS Setup ────────────────────────────────────────
   * TO ENABLE EMAIL DELIVERY:
   *  1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
   *  2. Create an Email Service (Gmail, Outlook, etc.)
   *  3. Create an Email Template with variables:
   *       {{from_name}}, {{from_email}}, {{message}}
   *  4. Replace the three constants below with your real values.
   *
   * Until configured, the form falls back to FormSubmit.co
   * which delivers emails without any backend setup.
   */
  const EMAILJS_PUBLIC_KEY  = 'YOUR_EMAILJS_PUBLIC_KEY';   // e.g. 'abc123XYZ'
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';           // e.g. 'service_xxxxxx'
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';          // e.g. 'template_xxxxxx'
  const AUTHOR_EMAIL        = 'soundfrancis@gmail.com';

  const EMAILJS_READY = (
    EMAILJS_PUBLIC_KEY  !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
    EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID'         &&
    EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID'
  );

  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const feedback  = document.getElementById('contact-feedback');

  const showFb = (msg, type) => {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className   = 'form-feedback ' + type;
    if (type === 'success') setTimeout(clearFb, 7000);
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

  /* ── FormSubmit fallback (no backend, no account needed) ── */
  const sendViaFormSubmit = async (name, email, message) => {
    const payload = new FormData();
    payload.append('name',    name);
    payload.append('email',   email);
    payload.append('message', message);
    payload.append('_subject', `New message from ${name} — Five Rupees Dreams`);
    payload.append('_captcha', 'false');
    payload.append('_template', 'box');

    const res = await fetch(`https://formsubmit.co/ajax/${AUTHOR_EMAIL}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: payload
    });

    const data = await res.json();
    if (!res.ok || data.success !== 'true') throw new Error('FormSubmit failed');
  };

  /* ── EmailJS send ──────────────────────────────────────── */
  const sendViaEmailJS = (name, email, message) => {
    if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');
    emailjs.init(EMAILJS_PUBLIC_KEY);
    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  name,
      from_email: email,
      message:    message,
      reply_to:   email
    });
  };

  const init = () => {
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFb();

      const name    = (document.getElementById('contact-name')?.value    || '').trim();
      const email   = (document.getElementById('contact-email')?.value   || '').trim();
      const message = (document.getElementById('contact-message')?.value || '').trim();

      /* Validation */
      if (!name)    { showFb('Please enter your name.',         'error'); document.getElementById('contact-name')?.focus();    return; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      showFb('Please enter a valid email.',     'error'); document.getElementById('contact-email')?.focus();   return; }
      if (!message) { showFb('Please write a message.',         'error'); document.getElementById('contact-message')?.focus(); return; }

      setLoading(true);

      try {
        if (EMAILJS_READY) {
          await sendViaEmailJS(name, email, message);
        } else {
          await sendViaFormSubmit(name, email, message);
        }
        form.reset();
        showFb('Your message has been sent to Francis. He will be in touch soon.', 'success');
      } catch (err) {
        console.error('Contact send error:', err);
        showFb('Message could not be sent. Please email directly: soundfrancis@gmail.com', 'error');
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
