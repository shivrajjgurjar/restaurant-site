document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------------------------------------- */
    /* UTILITIES                                   */
    /* -------------------------------------------------------------------------- */
    const select = (sel) => document.querySelector(sel);
    const selectAll = (sel) => document.querySelectorAll(sel);
    
    /* -------------------------------------------------------------------------- */
    /* NAVIGATION                                  */
    /* -------------------------------------------------------------------------- */
    const nav = select('#main-nav');
    const brandText = select('#nav-brand-text');
    const brandSub = select('#nav-brand-sub');
    const navLinks = selectAll('.nav-link');
    const navCta = select('#nav-cta');
    const hamburgerLines = [select('.hamburger-line-1'), select('.hamburger-line-2'), select('.hamburger-line-3')];
    const navIcon = select('#nav-brand-icon');
    
    let isMobileMenuOpen = false;

    // Nav Scroll Logic matching [class.bg-white/95] logic
    const updateNavState = () => {
        if (isMobileMenuOpen) return; // Mobile menu style takes precedence

        const isScrolled = window.scrollY > 20;
        
        if (isScrolled) {
            nav.classList.add('bg-white/95', 'backdrop-blur-md', 'border-gray-200', 'py-3');
            nav.classList.remove('bg-transparent', 'border-transparent', 'py-6');
            
            brandText.classList.remove('text-white');
            brandText.classList.add('text-gray-900');
            
            navLinks.forEach(link => {
                link.classList.remove('text-white', 'hover:text-gold');
                link.classList.add('text-gray-800', 'hover:text-deep-red');
            });

            // CTA Button update
            navCta.classList.remove('border-white', 'text-white');
            navCta.classList.add('border-deep-red', 'text-deep-red');

            // Hamburger update
            hamburgerLines.forEach(l => {
                 l.classList.remove('bg-white');
                 l.classList.add('bg-gray-900');
            });

        } else {
            nav.classList.add('bg-transparent', 'border-transparent', 'py-6');
            nav.classList.remove('bg-white/95', 'backdrop-blur-md', 'border-gray-200', 'py-3');
            
            brandText.classList.add('text-white');
            brandText.classList.remove('text-gray-900');

            navLinks.forEach(link => {
                link.classList.add('text-white', 'hover:text-gold');
                link.classList.remove('text-gray-800', 'hover:text-deep-red');
            });

            navCta.classList.add('border-white', 'text-white');
            navCta.classList.remove('border-deep-red', 'text-deep-red');

            hamburgerLines.forEach(l => {
                 l.classList.add('bg-white');
                 l.classList.remove('bg-gray-900');
            });
        }
    };

    window.addEventListener('scroll', () => requestAnimationFrame(updateNavState));

    /* -------------------------------------------------------------------------- */
    /* MOBILE MENU                                   */
    /* -------------------------------------------------------------------------- */
    const mobileToggle = select('#mobile-toggle');
    const mobileMenu = select('#mobile-menu');
    const mobileLinks = selectAll('.mobile-link');
    const mobileDivider = select('#mobile-divider');
    const mobileCta = select('#mobile-cta');

    mobileToggle.addEventListener('click', () => {
        isMobileMenuOpen = !isMobileMenuOpen;
        
        // Hamburger Animation
        const [l1, l2, l3] = hamburgerLines;
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            
            // Icon rotate
            navIcon.classList.add('rotate-180');
            brandSub.classList.remove('text-gold');
            brandSub.classList.add('text-white/50');
            
            // Lines
            l1.classList.add('rotate-45', 'translate-y-2');
            l2.classList.add('opacity-0');
            l3.classList.add('-rotate-45', '-translate-y-2');
            
            // Force white lines on menu open
            hamburgerLines.forEach(l => {
                l.classList.remove('bg-gray-900');
                l.classList.add('bg-white');
            });
            brandText.classList.remove('text-gray-900');
            brandText.classList.add('text-white');

            // Overlay Reveal
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
            
            // Staggered Items
            mobileLinks.forEach(link => {
                link.classList.remove('translate-y-12', 'opacity-0');
                link.classList.add('translate-y-0', 'opacity-100');
            });
            mobileDivider.classList.remove('scale-x-0');
            mobileDivider.classList.add('scale-x-100');
            
            mobileCta.classList.remove('translate-y-8', 'opacity-0');
            mobileCta.classList.add('translate-y-0', 'opacity-100');

        } else {
            document.body.style.overflow = '';
            
            navIcon.classList.remove('rotate-180');
            brandSub.classList.add('text-gold');
            brandSub.classList.remove('text-white/50');

            l1.classList.remove('rotate-45', 'translate-y-2');
            l2.classList.remove('opacity-0');
            l3.classList.remove('-rotate-45', '-translate-y-2');

            // Reset Overlay
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');

            mobileLinks.forEach(link => {
                link.classList.add('translate-y-12', 'opacity-0');
                link.classList.remove('translate-y-0', 'opacity-100');
            });
            mobileDivider.classList.add('scale-x-0');
            mobileDivider.classList.remove('scale-x-100');
            mobileCta.classList.add('translate-y-8', 'opacity-0');
            mobileCta.classList.remove('translate-y-0', 'opacity-100');
            
            // Re-run nav state check immediately to restore colors
            updateNavState();
        }
    });

    // Close mobile menu on link click
    selectAll('.mobile-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionId = link.dataset.section;
            if(isMobileMenuOpen) mobileToggle.click();
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            }, 300); // Wait for transition
        });
    });

    // Desktop Nav Click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
             const sectionId = link.dataset.section;
             document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* -------------------------------------------------------------------------- */
    /* HERO CAROUSEL                                 */
    /* -------------------------------------------------------------------------- */
    const slides = selectAll('.hero-slide');
    const dots = selectAll('.hero-dot');
    const prevBtn = select('#hero-prev');
    const nextBtn = select('#hero-next');
    let currentSlide = 0;
    let autoPlayInterval;

    const updateCarousel = () => {
        slides.forEach((slide, index) => {
            const content = slide.querySelector('.hero-content');
            const bg = slide.querySelector('.hero-bg');
            
            if (index === currentSlide) {
                slide.style.transform = 'translateX(0%)';
                slide.style.zIndex = '20';
                // Activate content animations
                content.classList.remove('opacity-0', 'translate-y-10');
                content.classList.add('opacity-100', 'translate-y-0');
                // BG Scale
                bg.classList.add('scale-105');
                bg.classList.remove('scale-100');
            } else if (index < currentSlide) {
                slide.style.transform = 'translateX(-100%)';
                slide.style.zIndex = '10';
                content.classList.add('opacity-0', 'translate-y-10');
                content.classList.remove('opacity-100', 'translate-y-0');
                bg.classList.remove('scale-105');
                bg.classList.add('scale-100');
            } else {
                slide.style.transform = 'translateX(100%)';
                slide.style.zIndex = '10';
                content.classList.add('opacity-0', 'translate-y-10');
                content.classList.remove('opacity-100', 'translate-y-0');
                bg.classList.remove('scale-105');
                bg.classList.add('scale-100');
            }
        });

        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('bg-gold', 'w-8');
                dot.classList.remove('bg-white/30', 'w-3');
            } else {
                dot.classList.remove('bg-gold', 'w-8');
                dot.classList.add('bg-white/30', 'w-3');
            }
        });
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    };

    const resetTimer = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 6000);
    };

    // Listeners
    nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
    
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            currentSlide = idx;
            updateCarousel();
            resetTimer();
        });
    });

    // Swipe Support
    let touchStartX = 0;
    const heroSection = select('#home');
    heroSection.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive: true});
    heroSection.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) { nextSlide(); resetTimer(); }
        if (touchEndX > touchStartX + 50) { prevSlide(); resetTimer(); }
    }, {passive: true});

    // Init
    updateCarousel();
    resetTimer();

    /* -------------------------------------------------------------------------- */
    /* FEATURED CAROUSEL                               */
    /* -------------------------------------------------------------------------- */
    const featuredContainer = select('#featured-scroll');
    select('#featured-prev').addEventListener('click', () => featuredContainer.scrollBy({ left: -450, behavior: 'smooth' }));
    select('#featured-next').addEventListener('click', () => featuredContainer.scrollBy({ left: 450, behavior: 'smooth' }));

    /* -------------------------------------------------------------------------- */
    /* REVEAL ANIMATIONS                             */
    /* -------------------------------------------------------------------------- */
    // Targets: About section text/images, Menu items
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // For custom CSS based reveals
                if (entry.target.classList.contains('reveal-hidden')) {
                     entry.target.classList.add('reveal-visible');
                     entry.target.classList.remove('reveal-hidden');
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });

    selectAll('.reveal-anim-trigger, .menu-item-card').forEach(el => revealObserver.observe(el));

    /* -------------------------------------------------------------------------- */
    /* MENU LOGIC                                    */
    /* -------------------------------------------------------------------------- */
    // Tab Scrolling
    const menuTabs = selectAll('.menu-tab-btn');
    let isManualScroll = false;
    let manualScrollTimer;

    menuTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const catId = btn.dataset.cat;
            isManualScroll = true;
            
            // Scroll to section
            document.getElementById(catId).scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Update UI manually
            updateActiveTab(catId);

            clearTimeout(manualScrollTimer);
            manualScrollTimer = setTimeout(() => isManualScroll = false, 1000);
        });
    });

    const updateActiveTab = (activeId) => {
        menuTabs.forEach(btn => {
            if(btn.dataset.cat === activeId) {
                btn.className = "menu-tab-btn flex-shrink-0 px-6 py-2 rounded-full border transition-colors duration-300 font-serif text-lg whitespace-nowrap active:scale-95 bg-gray-900 text-gold border-gray-900";
            } else {
                btn.className = "menu-tab-btn flex-shrink-0 px-6 py-2 rounded-full border transition-colors duration-300 font-serif text-lg whitespace-nowrap active:scale-95 bg-white text-gray-600 border-gray-200 hover:border-gold";
            }
        });
    };

    // ScrollSpy
    const menuObserver = new IntersectionObserver((entries) => {
        if(isManualScroll) return;
        const visible = entries.find(e => e.isIntersecting);
        if(visible) {
            updateActiveTab(visible.target.id);
        }
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    selectAll('.menu-category-section').forEach(sec => menuObserver.observe(sec));

    /* -------------------------------------------------------------------------- */
    /* LOCATION PARALLAX                                */
    /* -------------------------------------------------------------------------- */
    const locSection = select('#location');
    const mapContainer = select('#map-parallax-container');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if(!ticking) {
            window.requestAnimationFrame(() => {
                const rect = locSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                    const move = (progress - 0.5) * 60;
                    mapContainer.style.transform = `translate3d(0, ${move}px, 0)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, {passive: true});

    /* -------------------------------------------------------------------------- */
    /* SCROLL TO TOP                                    */
    /* -------------------------------------------------------------------------- */
    const scrollTopBtn = select('#scroll-to-top');
    const progressCircle = select('#scroll-progress-circle');
    
    window.addEventListener('scroll', () => {
         const scrollY = window.scrollY;
         const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
         
         // Visibility
         if (scrollY > 500) {
             scrollTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
             scrollTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
         } else {
             scrollTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
             scrollTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
         }

         // Progress Ring
         const progress = Math.min((scrollY / docHeight) * 100, 100);
         // Stroke dasharray is approx 301.59
         const offset = 301.59 - (progress / 100 * 301.59);
         progressCircle.style.strokeDashoffset = offset;
    }, {passive: true});

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* -------------------------------------------------------------------------- */
    /* CONTACT FORM                                  */
    /* -------------------------------------------------------------------------- */
    const form = select('#contact-form');
    const submitBtn = select('#submit-btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic Validity Check
        if(form.checkValidity()) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sent Successfully';
            submitBtn.disabled = true;
            
            // Reset simulation
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert('Thank you! For immediate reservations, please call us.');
            }, 2000);
        }
    });

    /* -------------------------------------------------------------------------- */
    /* FOOTER                                      */
    /* -------------------------------------------------------------------------- */
    select('#current-year').textContent = new Date().getFullYear();
});
