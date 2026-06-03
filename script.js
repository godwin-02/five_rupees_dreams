/**
 * FRANCIS SOUNDARARAJAN — ULTRA-LUXURY BRAND WEBSITE INTERACTION ENGINE
 * Architectural Lifecycle Orchestration
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // MODULE 1: PREMIUM NAVIGATION & WINDOW STATE ENGINE
    // ==========================================================================
    const NavEngine = (() => {
        const html = document.documentElement;
        const nav = document.getElementById('main-nav');
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinksWrapper = document.getElementById('nav-links-menu');
        const scrollProgress = document.getElementById('scroll-progress');
        const backToTop = document.getElementById('back-to-top');
        const navLinks = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('section[id]');

        const initScrollEffects = () => {
            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                const docHeight = html.scrollHeight - window.innerHeight;

                if (docHeight > 0) {
                    scrollProgress.style.width = `${(scrollTop / docHeight) * 100}%`;
                }

                if (scrollTop > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }

                if (scrollTop > 500) {
                    nav.classList.add('scrolled');
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }, { passive: true });

            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        };

        const initScrollSpy = () => {
            const observerOptions = {
                root: null,
                rootMargin: '-30% 0px -50% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeId = entry.target.getAttribute('id');
                        navLinks.forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
                        });
                    }
                });
            }, observerOptions);

            sections.forEach(sec => observer.observe(sec));

            window.addEventListener('scroll', () => {
                if (window.scrollY < 100) {
                    navLinks.forEach((link, idx) => {
                        link.classList.toggle('active', idx === 0);
                    });
                }
            }, { passive: true });
        };

        const initMobileMenu = () => {
            menuToggle.addEventListener('click', () => {
                const isOpen = navLinksWrapper.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', isOpen);
            });

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navLinksWrapper.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                });
            });
        };

        const initScrollReveals = () => {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
        };

        return {
            init: () => {
                initScrollEffects();
                initScrollSpy();
                initMobileMenu();
                initScrollReveals();
            }
        };
    })();

    // ==========================================================================
    // MODULE 2: EXCERPTS & CINEMATIC CONTINUOUS GALLERY ENGINE
    // ==========================================================================
    const GalleryEngine = (() => {
        const GALLERY_ITEMS = [
            {
                src: "./images/author-parents.jpeg",
                title: "Sacred Ancestry",
                caption: "Francis's proud parents, the pillars of his humble origin stories.",
                description: "A portrait of the author's parents whose early lessons in faith and resilience shaped his lifelong mission."
            },
            {
                src: "./images/author-family.jpeg",
                title: "Foundational Support",
                caption: "The complete Soundararajan family sharing a unified journey.",
                description: "Francis pictured with his loving family, his primary source of inspiration and strength in both ministry and writing."
            },
            {
                src: "./images/author old family photo.jpg",
                title: "Roots of Resilience",
                caption: "An archival family portrait capturing the author's early roots and foundation.",
                description: "A precious, historic glimpse into the early family structure that nurtured Francis's early dreams from a five-rupees beginning."
            },
            {
                src: "./images/author wife cherishing moments.jpg",
                title: "Devoted Partnership",
                caption: "Francis Soundararajan sharing a quiet moment of gratitude with his wife.",
                description: "Celebrating the quiet strength and partnership of marriage that has anchored decades of community leadership."
            },
            {
                src: "./images/author-daughter.jpeg",
                title: "Joyous Exploration",
                caption: "A beautiful afternoon snapshot of his daughter exploring outdoors.",
                description: "Cherishing moments of family life amidst the author's busy global commitments."
            },
            {
                src: "./images/little-daughter.jpeg",
                title: "The Future Generation",
                caption: "His youngest daughter sharing a delightful performance on center stage.",
                description: "The light and hope of the next generation, expressing joy and faith."
            },
            {
                src: "./images/authordaughter.jpeg",
                title: "Cherished Horizons",
                caption: "Francis sharing a bright moment with his eldest daughter.",
                description: "A heartwarming moment showing the close bond between father and daughter."
            },
            {
                src: "./images/author-inlaw.jpeg",
                title: "Extended Legacies",
                caption: "A memorable cross-generational portrait with his parents-in-law.",
                description: "Celebrating heritage and family unity across generations."
            },
            {
                src: "./images/author-fams.jpeg",
                title: "Kinship & Celebrations",
                caption: "The vibrancy of the extended family gathered during a celebratory milestone.",
                description: "A joyous gathering of relatives reflecting the rich, shared community life that anchors the author's stories.",
                fallback: "./images/family-gathering.jpeg"
            },
            {
                src: "./images/John and Uta the Publishers.JPG",
                title: "Visionary Collaborators",
                caption: "Jürgen John and Uta John of Jürgen John Publishing.",
                description: "The dedicated publishing team responsible for producing and distributing 'The Five Rupees Dreams' globally."
            },
            {
                src: "./images/author with his wife and publisher.jpg",
                title: "The Publishing Alliance",
                caption: "The author, his wife, and publisher Jürgen John celebrating the book release.",
                description: "Commemorating the official milestone of bringing Francis's transformational biography to print."
            },
            {
                src: "./images/the ngo.jpg",
                title: "Global Humanitarian Initiatives",
                caption: "The NGO operations and community outreach programs supported by the author's work.",
                description: "Demonstrating the grassroots humanitarian operations and community development initiatives led by the author."
            },
            {
                src: "./images/author with fr Nelson.JPG",
                title: "Ministry & Fellowship",
                caption: "Chaplain Francis Soundararajan in fellowship with Father Nelson.",
                description: "Strengthening ecumenical bonds and sharing a shared vision of pastoral care and chaplaincy."
            }
        ];

        const track    = document.getElementById('gallery-track');
        const nextBtn  = document.getElementById('slide-next');
        const prevBtn  = document.getElementById('slide-prev');
        const viewport = document.querySelector('.premium-slider-viewport');

        let slidesCount     = GALLERY_ITEMS.length;
        let currentIndex    = 1;
        let isTransitioning = false;
        let autoPlayTimer   = null;

        const initQuoteCarousel = () => {
            const quotes = document.querySelectorAll('.book-quote-item');
            if (!quotes.length) return;
            let idx = 0;
            setInterval(() => {
                quotes[idx].classList.remove('active');
                idx = (idx + 1) % quotes.length;
                quotes[idx].classList.add('active');
            }, 6000);
        };

        const renderGallery = () => {
            if (!track) return;
            track.innerHTML = '';

            if (slidesCount === 0) {
                track.innerHTML = '<div class="slide-unit"><p style="color:var(--color-text-secondary);">No images available.</p></div>';
                nextBtn.style.display = 'none';
                prevBtn.style.display = 'none';
                return;
            }

            if (slidesCount <= 1) {
                nextBtn.style.display = 'none';
                prevBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'flex';
                prevBtn.style.display = 'flex';
            }

            GALLERY_ITEMS.forEach((item, idx) => {
                const slide = document.createElement('div');
                slide.className = 'slide-unit';
                slide.setAttribute('role', 'group');
                slide.setAttribute('aria-roledescription', 'slide');
                slide.setAttribute('aria-label', `${idx + 1} of ${slidesCount}`);

                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.caption;
                img.loading = 'lazy';
                if (item.fallback) {
                    img.onerror = () => { img.src = item.fallback; };
                }

                const caption = document.createElement('div');
                caption.className = 'slide-caption';
                caption.innerHTML = `<h5>${item.title}</h5><p><strong>${item.caption}</strong> — ${item.description}</p>`;

                slide.appendChild(img);
                slide.appendChild(caption);
                track.appendChild(slide);
            });

            if (slidesCount > 1) {
                const allSlides  = Array.from(track.querySelectorAll('.slide-unit'));
                const firstClone = allSlides[0].cloneNode(true);
                const lastClone  = allSlides[slidesCount - 1].cloneNode(true);
                firstClone.setAttribute('aria-hidden', 'true');
                lastClone.setAttribute('aria-hidden', 'true');
                firstClone.removeAttribute('role');
                lastClone.removeAttribute('role');
                track.insertBefore(lastClone, track.firstElementChild);
                track.appendChild(firstClone);
            }

            track.style.transition = 'none';
            track.style.transform  = slidesCount > 1 ? 'translateX(-100%)' : 'translateX(0)';
            track.offsetHeight; // force reflow
            track.style.transition = '';
        };

        const setupSliderInteractions = () => {
            if (!track || slidesCount <= 1) return;

            track.addEventListener('transitionend', () => {
                isTransitioning = false;
                if (currentIndex === slidesCount + 1) {
                    track.style.transition = 'none';
                    currentIndex = 1;
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                    track.offsetHeight;
                    track.style.transition = '';
                }
                if (currentIndex === 0) {
                    track.style.transition = 'none';
                    currentIndex = slidesCount;
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                    track.offsetHeight;
                    track.style.transition = '';
                }
            });

            const moveToSlide = (targetIndex) => {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIndex = targetIndex;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
            };

            const nextSlide = () => moveToSlide(currentIndex + 1);
            const prevSlide = () => moveToSlide(currentIndex - 1);

            nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
            prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

            document.addEventListener('keydown', (e) => {
                const rect      = viewport.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
                const isTyping  = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
                if (isVisible && !isTyping) {
                    if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
                    if (e.key === 'ArrowLeft')  { prevSlide(); resetAutoplay(); }
                }
            });

            let startX = 0;
            track.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; }, { passive: true });
            track.addEventListener('touchend',   (e) => {
                const delta = startX - e.changedTouches[0].screenX;
                if (Math.abs(delta) > 60) {
                    delta > 0 ? nextSlide() : prevSlide();
                    resetAutoplay();
                }
            }, { passive: true });

            const startAutoplay = () => { autoPlayTimer = setInterval(nextSlide, 5500); };
            const resetAutoplay = () => { clearInterval(autoPlayTimer); startAutoplay(); };

            viewport.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
            viewport.addEventListener('mouseleave', startAutoplay);
            startAutoplay();
        };

        return {
            init: () => {
                initQuoteCarousel();
                renderGallery();
                setupSliderInteractions();
            }
        };
    })();

    // ==========================================================================
    // MODULE 3: REVIEWS DATA & INFINITE MARQUEE CRUD ENGINE  (FIXED)
    // ==========================================================================
    const ReviewCRUDEngine = (() => {

        // ── DOM refs ──────────────────────────────────────────────────────────
        const form            = document.getElementById('review-crud-form');
        const editIndexInput  = document.getElementById('review-edit-index');
        const submitBtn       = document.getElementById('rev-submit-btn');
        const outputTarget    = document.getElementById('reviews-output-target');
        const actionTitle     = document.getElementById('form-action-title');
        const feedbackEl      = document.getElementById('review-form-feedback');
        const marqueeViewport = document.querySelector('.reviews-marquee-viewport');

        // ── Default seed reviews (empty — reviews come from user submissions only) ──
        const DEFAULT_REVIEWS = [];

        const STORAGE_KEY = 'soundar-lux-reviews-v4';
        let reviewsData   = [];

        // ── Utility: today as readable string ────────────────────────────────
        const todayStr = () => new Date().toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        // ── XSS guard ─────────────────────────────────────────────────────────
        const esc = (str) => {
            const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' };
            return String(str || '').replace(/[&<>"']/g, m => map[m]);
        };

        // ── LocalStorage ──────────────────────────────────────────────────────
        const loadReviews = () => {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                reviewsData = raw ? JSON.parse(raw) : null;
                if (!Array.isArray(reviewsData) || reviewsData.length === 0) {
                    reviewsData = DEFAULT_REVIEWS.map(r => ({ ...r }));
                    saveReviews();
                }
            } catch (_) {
                reviewsData = DEFAULT_REVIEWS.map(r => ({ ...r }));
            }
        };

        const saveReviews = () => {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsData)); }
            catch (_) { /* storage blocked — degrade silently */ }
        };

        // ── Build one review card DOM node ────────────────────────────────────
        const buildCard = (rev, idx) => {
            const card = document.createElement('div');
            card.className = 'crud-review-node';
            card.dataset.idx = idx;

            const stars = '★★★★★';

            card.innerHTML = `
                <div class="review-card-body">
                    <span class="review-stars" aria-label="5 out of 5 stars">${stars}</span>
                    <p class="crud-text">"${esc(rev.text)}"</p>
                    <h5 class="crud-author">${esc(rev.name)}</h5>
                    ${rev.title ? `<span class="crud-meta">${esc(rev.title)}</span>` : ''}
                    <span class="crud-date">${esc(rev.date || '')}</span>
                </div>
                <div class="crud-actions-wrapper">
                    <button type="button" class="crud-btn btn-edit" data-action="edit" data-idx="${idx}" aria-label="Edit review by ${esc(rev.name)}">
                        <i class="fas fa-edit" aria-hidden="true"></i> Edit
                    </button>
                    <button type="button" class="crud-btn btn-delete" data-action="delete" data-idx="${idx}" aria-label="Delete review by ${esc(rev.name)}">
                        <i class="fas fa-trash-alt" aria-hidden="true"></i> Delete
                    </button>
                </div>`;

            return card;
        };

        // ── Render marquee from current reviewsData (single group, no loop) ──
        const renderMarquee = () => {
            if (!outputTarget) return;

            outputTarget.removeEventListener('click', _handleCardAction);
            outputTarget.innerHTML = '';

            if (reviewsData.length === 0) {
                outputTarget.innerHTML =
                    '<p style="padding:2rem;color:var(--color-text-secondary);">No reviews yet — be the first to share your experience.</p>';
                return;
            }

            const group = document.createElement('div');
            group.className = 'marquee-group';

            reviewsData.forEach((rev, idx) => {
                group.appendChild(buildCard(rev, idx));
            });

            outputTarget.appendChild(group);
            outputTarget.addEventListener('click', _handleCardAction);
        };

        // ── Delegated action handler for Edit / Delete buttons ────────────────
        const _handleCardAction = (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const idx    = parseInt(btn.dataset.idx, 10);
            const action = btn.dataset.action;
            if (action === 'edit')   triggerEdit(idx);
            if (action === 'delete') triggerDelete(idx);
        };

        // ── Delete ────────────────────────────────────────────────────────────
        const triggerDelete = (idx) => {
            if (isNaN(idx) || idx < 0 || idx >= reviewsData.length) return;
            showDeleteModal(idx);
        };

        // ── Elegant delete confirmation modal ─────────────────────────────────
        const showDeleteModal = (idx) => {
            const overlay  = document.getElementById('delete-modal-overlay');
            const confirmBtn = document.getElementById('modal-confirm');
            const cancelBtn  = document.getElementById('modal-cancel');
            if (!overlay) return;

            overlay.classList.add('modal-visible');

            // Clone buttons to wipe any prior event listeners
            const newConfirm = confirmBtn.cloneNode(true);
            const newCancel  = cancelBtn.cloneNode(true);
            confirmBtn.replaceWith(newConfirm);
            cancelBtn.replaceWith(newCancel);

            const close = () => overlay.classList.remove('modal-visible');

            newConfirm.addEventListener('click', () => {
                close();
                reviewsData.splice(idx, 1);
                saveReviews();
                renderMarquee();
                resetForm();
            });

            newCancel.addEventListener('click', close);

            // Close on backdrop click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            }, { once: true });

            // Close on Escape key
            const onKey = (e) => {
                if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
            };
            document.addEventListener('keydown', onKey);

            // Focus the cancel button for accessibility
            newCancel.focus();
        };

        // ── Edit: populate form ────────────────────────────────────────────────
        const triggerEdit = (idx) => {
            if (isNaN(idx) || idx < 0 || idx >= reviewsData.length) return;
            const r = reviewsData[idx];
            document.getElementById('rev-name').value  = r.name  || '';
            document.getElementById('rev-title').value = r.title || '';
            document.getElementById('rev-text').value  = r.text  || '';
            editIndexInput.value      = idx;
            submitBtn.textContent     = 'Modify Review Entry';
            actionTitle.textContent   = 'Edit Review Statement';
            clearFeedback();
            document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
        };

        // Keep global aliases for any legacy inline calls (safety net)
        window.editReviewSystemTrigger   = triggerEdit;
        window.deleteReviewSystemTrigger = triggerDelete;

        // ── Feedback helpers ──────────────────────────────────────────────────
        const showError = (msg) => {
            if (!feedbackEl) return;
            feedbackEl.textContent = msg;
            feedbackEl.className   = 'review-feedback feedback-error';
        };

        const showSuccess = (msg) => {
            if (!feedbackEl) return;
            feedbackEl.textContent = msg;
            feedbackEl.className   = 'review-feedback feedback-success';
            setTimeout(clearFeedback, 4000);
        };

        const clearFeedback = () => {
            if (!feedbackEl) return;
            feedbackEl.textContent = '';
            feedbackEl.className   = 'review-feedback';
        };

        // ── Reset form to default create-state ────────────────────────────────
        const resetForm = () => {
            if (form) form.reset();
            editIndexInput.value    = '';
            submitBtn.textContent   = 'Publish Review';
            actionTitle.textContent = 'Leave an Impression';
            clearFeedback();
        };

        // ── Form submit: create or update ─────────────────────────────────────
        const initFormHandler = () => {
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const nameEl  = document.getElementById('rev-name');
                const titleEl = document.getElementById('rev-title');
                const textEl  = document.getElementById('rev-text');

                const name    = (nameEl?.value  || '').trim();
                const title   = (titleEl?.value || '').trim();
                const text    = (textEl?.value  || '').trim();
                const editIdx = editIndexInput.value;

                // ── Validation ────────────────────────────────────────────────
                if (!name) {
                    showError('Please enter your name.');
                    nameEl?.focus();
                    return;
                }
                if (!text) {
                    showError('Please write a review.');
                    textEl?.focus();
                    return;
                }

                const reviewObj = { name, title, text, date: todayStr() };

                if (editIdx !== '') {
                    // ── Update existing entry ─────────────────────────────────
                    const idx = parseInt(editIdx, 10);
                    if (!isNaN(idx) && idx >= 0 && idx < reviewsData.length) {
                        // Preserve original submission date
                        reviewObj.date = reviewsData[idx].date || todayStr();
                        reviewsData[idx] = reviewObj;
                    }
                } else {
                    // ── New review: prepend so it appears first ────────────────
                    reviewsData.unshift(reviewObj);
                }

                saveReviews();
                renderMarquee();
                resetForm();
                showSuccess('Your review has been published successfully.');

                // Scroll to reviews marquee so user sees their card immediately
                outputTarget?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        };

        // ── Mobile touch-pause (no-op — marquee no longer animates) ─────────
        const initMarqueeTouchPause = () => {};

        return {
            init: () => {
                loadReviews();
                renderMarquee();
                initFormHandler();
                initMarqueeTouchPause();
            }
        };
    })();

    // ==========================================================================
    // INITIALIZATION COORDINATOR
    // ==========================================================================
    NavEngine.init();
    GalleryEngine.init();
    ReviewCRUDEngine.init();
});
