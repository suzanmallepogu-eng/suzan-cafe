/* ==========================================================
   SUZAN CAFÉ — GLOBAL JAVASCRIPT
   Interactive features for navigation, filtering, lightbox,
   coffee mood selector, and form validation.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================
       1. STICKY NAVBAR SCROLL TRANSFORMATION
       ====================================================== */
    const headerNav = document.querySelector('.header-nav');

    function updateNavbar() {
        if (!headerNav) return;
        if (window.scrollY > 40) {
            headerNav.classList.add('scrolled');
        } else {
            headerNav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    /* Ensure hero video autoplays smoothly on all mobile & desktop browsers */
    const heroVideo = document.querySelector('.hero-video');
    const heroSoundToggle = document.getElementById('heroSoundToggle');

    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.playsInline = true;
        heroVideo.setAttribute('muted', '');
        heroVideo.setAttribute('playsinline', '');
        heroVideo.play().catch(() => {
            // Autoplay with fallback
        });

        if (heroSoundToggle) {
            const mutedIcon = heroSoundToggle.querySelector('.sound-icon-muted');
            const unmutedIcon = heroSoundToggle.querySelector('.sound-icon-unmuted');
            const soundLabel = heroSoundToggle.querySelector('.sound-label');

            heroSoundToggle.addEventListener('click', () => {
                if (heroVideo.muted) {
                    heroVideo.muted = false;
                    heroVideo.volume = 1.0;
                    heroSoundToggle.classList.add('unmuted');
                    if (mutedIcon) mutedIcon.style.display = 'none';
                    if (unmutedIcon) unmutedIcon.style.display = 'block';
                    if (soundLabel) soundLabel.textContent = 'Sound On';
                    heroSoundToggle.setAttribute('aria-label', 'Mute ambient café video sound');
                } else {
                    heroVideo.muted = true;
                    heroSoundToggle.classList.remove('unmuted');
                    if (mutedIcon) mutedIcon.style.display = 'block';
                    if (unmutedIcon) unmutedIcon.style.display = 'none';
                    if (soundLabel) soundLabel.textContent = 'Sound Off';
                    heroSoundToggle.setAttribute('aria-label', 'Unmute ambient café video sound');
                }
            });
        }
    }


    /* ======================================================
       2. MOBILE MENU DRAWER
       ====================================================== */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileBackdrop = document.querySelector('.mobile-backdrop');

    function toggleMobileMenu(open) {
        if (!mobileDrawer) return;
        const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');

        mobileDrawer.classList.toggle('open', isOpen);
        if (mobileToggle) mobileToggle.classList.toggle('open', isOpen);
        if (mobileBackdrop) mobileBackdrop.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => toggleMobileMenu());
    }

    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Close mobile drawer upon clicking any navigation link
    document.querySelectorAll('.mobile-drawer .nav-link').forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });


    /* ======================================================
       3. ACTIVE NAVIGATION HIGHLIGHTING
       ====================================================== */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });


    /* ======================================================
       4. SCROLL REVEAL (IntersectionObserver)
       ====================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }


    /* ======================================================
       5. MENU CATEGORY FILTERING (menu.html)
       ====================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    if (filterButtons.length > 0 && menuItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                menuItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('hide');
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(12px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.classList.add('hide');
                    }
                });
            });
        });
    }


    /* ======================================================
       6. PHOTO GALLERY & LIGHTBOX MODAL
       ====================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox-modal');

    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        let currentIndex = 0;
        const imagesData = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption');
            return {
                src: img ? img.getAttribute('src') : '',
                caption: caption ? caption.textContent.trim() : (img ? img.getAttribute('alt') : '')
            };
        });

        function showLightbox(index) {
            if (index < 0) index = imagesData.length - 1;
            if (index >= imagesData.length) index = 0;
            currentIndex = index;

            if (lightboxImg) lightboxImg.src = imagesData[currentIndex].src;
            if (lightboxCaption) lightboxCaption.textContent = imagesData[currentIndex].caption;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => showLightbox(index));
        });

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showLightbox(currentIndex - 1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showLightbox(currentIndex + 1); });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
            if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
        });
    }


    /* ======================================================
       7. COFFEE MOOD SELECTOR (experiences.html)
       ====================================================== */
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodResult = document.getElementById('moodResult');

    const moodRecommendations = {
        morning: {
            title: 'Slow Morning Ritual',
            tagline: 'Warm ceramic cup, natural morning light & gentle pace',
            recommendation: 'Artisan Flat White with Silky Microfoam & Warm Butter Croissant',
            description: 'Begin your morning in our sunlit window corner. Let the natural warmth of the sun and the rich nutty notes of freshly extracted espresso ease you into a peaceful, focused day.'
        },
        focus: {
            title: 'Creative Focus Zone',
            tagline: 'Quiet table, power outlets & deep concentration',
            recommendation: 'Double Shot Espresso or Nitro Cold Brew',
            description: 'Find a quiet table by our dark wood booths. Pair our single-origin pour-over with comfortable seating, crisp ambient sound, and natural light to fuel your creative flow.'
        },
        catchup: {
            title: 'Afternoon Catch Up',
            tagline: 'Lively atmosphere, shared smiles & delicious sips',
            recommendation: 'Velvety Caffe Latte & Basque Burnt Cheesecake to share',
            description: 'Settle in our center oak tables with good friends. Enjoy the hum of friendly conversations, warm pendant lights, and freshly baked sweet treats made for sharing.'
        },
        sweet: {
            title: 'Sweet Comfort Moment',
            tagline: 'Pure indulgence, cozy warmth & delicate chocolate',
            recommendation: 'Rich Belgian Hot Chocolate with Cocoa Dusting & Salted Brownie',
            description: 'Take a break from the hustle with our decadent dark chocolate mocha or rich hot chocolate, paired with a fresh-baked sea-salt fudge brownie in a cozy armchair.'
        },
        evening: {
            title: 'Evening Dusk Wind-Down',
            tagline: 'Amber Edison glow, relaxed mood & soothing aroma',
            recommendation: 'Decaf Caramel Cortado or Calming Herbal Chamomile Infusion',
            description: 'When twilight falls outside our grid windows, the warm amber lamps take over. Unwind with a soothing warm infusion or smooth decaf brew to end your day gracefully.'
        }
    };

    if (moodButtons.length > 0 && moodResult) {
        moodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                moodButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const moodKey = btn.getAttribute('data-mood');
                const data = moodRecommendations[moodKey] || moodRecommendations.morning;

                moodResult.innerHTML = `
                    <div class="mood-result-card">
                        <span class="section-tag">${data.tagline}</span>
                        <h3 style="font-size: 2rem; color: var(--coffee-dark); margin-bottom: 8px;">${data.title}</h3>
                        <p style="font-size: 1.1rem; font-weight: 600; color: var(--amber-accent); margin-bottom: 14px;">Recommended: ${data.recommendation}</p>
                        <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">${data.description}</p>
                    </div>
                `;
            });
        });
    }


    /* ======================================================
       8. CONTACT FORM VALIDATION & FEEDBACK (contact.html)
       ====================================================== */
    const contactForm = document.getElementById('cafeContactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('senderName');
            const email = document.getElementById('senderEmail');
            const message = document.getElementById('senderMessage');

            if (!name || !email || !message) return;

            if (name.value.trim().length < 2) {
                showFeedback('Please enter your full name.', 'error');
                name.focus();
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value.trim())) {
                showFeedback('Please enter a valid email address.', 'error');
                email.focus();
                return;
            }

            if (message.value.trim().length < 5) {
                showFeedback('Please share a brief message or inquiry.', 'error');
                message.focus();
                return;
            }

            // Successful submission simulation
            showFeedback('Thank you for reaching out! Your message has been received. We look forward to welcoming you at SUZAN CAFÉ.', 'success');
            contactForm.reset();
        });
    }

    function showFeedback(msg, type) {
        if (!formFeedback) return;
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback ${type}`;
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

});