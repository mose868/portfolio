/**
 * Main script for interactive portfolio website features.
 * Assumes a single-page layout where navigation links point to sections
 * within the same page using hash IDs (e.g., href="#services").
 */

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {

    // --- DOM Element Selection ---
    // Select elements robustly, checking if they exist on the page.
    const navToggle = document.getElementById('navToggle'); // Mobile menu button
    const navbar = document.getElementById('navbar'); // Main navigation container
    const navLinks = navbar ? navbar.querySelectorAll('a[href^="#"]') : []; // Links pointing to sections
    const header = document.getElementById('header'); // Site header
    const backToTop = document.getElementById('backToTop'); // Back to top button
    const themeToggle = document.getElementById('theme-toggle'); // Dark mode toggle checkbox

    const portfolioFilters = document.querySelectorAll('.portfolio-filter'); // Buttons to filter portfolio
    const portfolioItems = document.querySelectorAll('.portfolio-item'); // Individual portfolio items

    const contactForm = document.querySelector('.contact-form form'); // Contact form element
    const newsletterForm = document.querySelector('.newsletter-form'); // Newsletter form element
    const formInputs = document.querySelectorAll('.form-control'); // Inputs in forms for validation styles

    const heroName = document.querySelector('.hero-name'); // Element for hero name animation
    const heroSubtitle = document.querySelector('.hero p'); // Element for hero subtitle typing effect
    const heroSection = document.querySelector('.hero'); // Hero section for parallax

    const skillBars = document.querySelectorAll('.skill-progress > div'); // Skill bar inner divs
    const counters = document.querySelectorAll('.counter-value'); // Elements displaying counters

    const animatedElements = document.querySelectorAll('.fade-in'); // Elements with fade-in animation class
    const lazyImages = document.querySelectorAll('img[data-src]'); // Images to be lazy-loaded

    const yearElement = document.querySelector('.footer-bottom p'); // Footer paragraph for dynamic year

    // --- Initialization ---
    initializeTheme();
    initializeMobileNav();
    initializeBackToTop();
    initializeStickyHeader();
    initializeSmoothScrolling();
    initializeScrollBasedFeatures(); // Active nav highlighting, animations on scroll
    initializePortfolio();
    initializeForms();
    initializeAnimations(); // Hero text, skill bars, counters, etc.
    initializeLazyLoading();
    initializeFooterYear();
    // initializeCustomCursor(); // Uncomment if needed
    // initializePreloader(); // Call this separately if needed, usually tied to window.onload

    // --- Feature Implementations ---

    /**
     * Initializes Dark Mode based on localStorage and toggle interaction.
     */
    function initializeTheme() {
        if (!themeToggle) return; // Exit if toggle doesn't exist

        // Apply saved theme on load
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }

        // Add event listener for theme changes
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    /**
     * Sets up the mobile navigation toggle.
     */
    function initializeMobileNav() {
        if (!navToggle || !navbar) return;

        navToggle.addEventListener('click', function() {
            navbar.classList.toggle('show');
            // Ensure the toggle button itself has ID 'navToggle' if you want to change its text
            if (navToggle.id === 'navToggle') {
                navToggle.textContent = navbar.classList.contains('show') ? '✕' : '☰'; // Example text change
            }
            // Or if using the button from previous HTML:
            // const toggleBtn = document.querySelector('.toggle-btn'); // Select the button if different
            // toggleBtn.innerHTML = navbar.classList.contains('show') ? '<svg>...</svg>' : '<svg>...</svg>'; // Change SVG or content
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbar || !navToggle) return;
            const isClickInsideNav = navbar.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navbar.classList.contains('show')) {
                navbar.classList.remove('show');
                 if (navToggle.id === 'navToggle') {
                    navToggle.textContent = '☰';
                 }
                 // Reset toggle button appearance if needed
            }
        });
    }

    /**
     * Initializes the Back to Top button visibility and click behavior.
     */
    function initializeBackToTop() {
        if (!backToTop) return;

        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }, { passive: true }); // Use passive listener for scroll performance

        // Scroll to top on click
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /**
     * Initializes the sticky header functionality.
     */
    function initializeStickyHeader() {
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) { // Adjust scroll distance as needed
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }, { passive: true });
    }

    /**
     * Initializes smooth scrolling for anchor links within the page.
     */
    function initializeSmoothScrolling() {
        if (navLinks.length === 0) return;

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href'); // Should be like "#sectionId"
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault(); // Prevent default jump only if target exists

                    // Close mobile nav if open
                    if (navbar && navbar.classList.contains('show')) {
                        navbar.classList.remove('show');
                         if (navToggle && navToggle.id === 'navToggle') {
                            navToggle.textContent = '☰';
                         }
                    }

                    const headerOffset = header ? header.offsetHeight : 0; // Get header height for offset
                    const targetPosition = targetElement.offsetTop - headerOffset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                // If targetElement is not found, the link might point elsewhere or be invalid,
                // let the browser handle it (or add specific error handling).
            });
        });
    }

    /**
     * Initializes features triggered by scroll position:
     * - Active navigation link highlighting.
     * - Triggering fade-in animations.
     * - Parallax effect.
     */
    function initializeScrollBasedFeatures() {
        // Initial setup for animations
        animatedElements.forEach(element => element.classList.add('not-visible'));

        // Combined scroll event listener for efficiency
        window.addEventListener('scroll', () => {
            highlightNavOnScroll();
            animateOnScroll();
            applyParallax();
            // Add other scroll-dependent functions here (like skill bar animation trigger)
        }, { passive: true });

        // Initial checks on load
        highlightNavOnScroll();
        animateOnScroll();
        applyParallax();
    }

    /**
     * Highlights the active navigation link based on scroll position.
     */
    function highlightNavOnScroll() {
        if (navLinks.length === 0) return;

        const sections = document.querySelectorAll('section[id]'); // Select sections with IDs
        if (sections.length === 0) return;

        let scrollPosition = window.scrollY + (header ? header.offsetHeight + 20 : 80); // Offset slightly below header
        let currentSectionId = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Special case for reaching the bottom of the page
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) { // If near bottom
             const lastSection = sections[sections.length - 1];
             if(lastSection) currentSectionId = lastSection.id;
        }
         // Special case for being at the top of the page
        if (window.scrollY < sections[0].offsetTop - (header ? header.offsetHeight : 0) ) {
             currentSectionId = sections[0].id; // Or set to null/home if preferred
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Adds 'visible' class to elements when they enter the viewport.
     */
    function animateOnScroll() {
        const elementsToAnimate = document.querySelectorAll('.fade-in.not-visible');
        elementsToAnimate.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.remove('not-visible');
                element.classList.add('visible'); // Assumes CSS handles the transition
            }
        });
    }

    /** Helper: Checks if an element is (partially) in the viewport. */
    function isElementInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        // Check if it's visible (adjust multiplier for when animation triggers)
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }

    /**
     * Applies parallax effect to the hero section background.
     */
    function applyParallax() {
        if (!heroSection) return;
        const scrollPosition = window.pageYOffset;
        // Adjust the multiplier (0.5) for different parallax speed
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    }


    /**
     * Sets up portfolio filtering and lightbox functionality.
     */
    function initializePortfolio() {
        setupPortfolioFilters();
        setupPortfolioLightbox();
    }

    /** Configures portfolio filter buttons. */
    function setupPortfolioFilters() {
        if (portfolioFilters.length === 0 || portfolioItems.length === 0) return;

        portfolioFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                portfolioFilters.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    const shouldShow = (filterValue === 'all' || itemCategory === filterValue);

                    // Improved show/hide with transition handling
                    if (shouldShow) {
                        item.style.display = 'block'; // Or 'flex', 'grid', etc. depending on layout
                        setTimeout(() => item.classList.add('show'), 10); // Add class shortly after display for transition
                    } else {
                        item.classList.remove('show');
                         // Wait for fade-out transition before hiding completely
                        item.addEventListener('transitionend', () => {
                             if (!item.classList.contains('show')) { // Check again in case filter changed quickly
                                item.style.display = 'none';
                             }
                        }, { once: true }); // Remove listener after it runs once

                        // Fallback hide if no transition or it fails
                        setTimeout(() => {
                            if (!item.classList.contains('show')) item.style.display = 'none';
                        }, 350); // Match transition duration
                    }
                });
            });
        });
         // Initialize view - show all items initially
         portfolioItems.forEach(item => {
            item.style.display = 'block';
            setTimeout(() => item.classList.add('show'), 10);
         });
         // Set 'all' filter as active initially
         const initialFilter = document.querySelector('.portfolio-filter[data-filter="all"]');
         if (initialFilter) initialFilter.classList.add('active');
    }

    /** Configures portfolio item click for lightbox. */
    function setupPortfolioLightbox() {
        if (portfolioItems.length === 0) return;

        portfolioItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgElement = this.querySelector('img');
                const titleElement = this.querySelector('.portfolio-title'); // Adjust selector if needed
                const categoryElement = this.querySelector('.portfolio-category'); // Adjust selector if needed

                if (!imgElement) return; // Don't open lightbox if no image

                const imgSrc = imgElement.src;
                const title = titleElement ? titleElement.textContent : 'Portfolio Item';
                const category = categoryElement ? categoryElement.textContent : '';

                createLightbox(imgSrc, title, category);
            });
        });
    }

    /** Creates and displays the portfolio lightbox. */
    function createLightbox(imgSrc, title, category) {
        // Remove existing lightbox if any
        const existingLightbox = document.querySelector('.portfolio-lightbox');
        if (existingLightbox) existingLightbox.remove();

        const lightbox = document.createElement('div');
        lightbox.className = 'portfolio-lightbox';
        // Basic description, can be enhanced or made dynamic
        const description = `Showcase of work in ${category || 'this category'}. Click close (✕) or outside the image to exit.`;

        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close" title="Close">&times;</span>
                <img src="${imgSrc}" alt="${title}">
                <div class="lightbox-caption">
                    ${title ? `<h3>${title}</h3>` : ''}
                    ${category ? `<p>${category}</p>` : ''}
                    <p class="lightbox-description">${description}</p>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Animate lightbox appearance
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
        });

        // Close functionality
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            lightbox.addEventListener('transitionend', () => {
                if (lightbox.parentNode) { // Check if still attached
                    lightbox.remove();
                }
                document.body.style.overflow = ''; // Restore scrolling
            }, { once: true });
             // Fallback removal
             setTimeout(() => {
                 if (lightbox.parentNode) lightbox.remove();
                 document.body.style.overflow = '';
             }, 500); // Should match transition duration
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            // Close only if clicking directly on the background overlay
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
         // Close with Escape key
         document.addEventListener('keydown', function handleEscape(e) {
             if (e.key === 'Escape') {
                 closeLightbox();
                 document.removeEventListener('keydown', handleEscape); // Clean up listener
             }
         });
    }


    /**
     * Sets up form handling (submission simulation) and basic input validation styles.
     */
    function initializeForms() {
        // Contact Form Simulation
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission(contactForm, 'Your message has been sent successfully!');
            });
        }

        // Newsletter Form Simulation
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission(newsletterForm, 'Subscribed successfully!');
            });
        }

        // Input field styling on blur (has-value class)
        if (formInputs.length > 0) {
            formInputs.forEach(input => {
                 // Check initial value on load
                 if (input.value.trim() !== '') {
                     input.classList.add('has-value');
                 }
                 // Add listener for changes
                input.addEventListener('blur', function() {
                    if (this.value.trim() !== '') {
                        this.classList.add('has-value');
                    } else {
                        this.classList.remove('has-value');
                    }
                });
            });
        }
    }

    /** Helper: Handles the simulated form submission process. */
    function handleFormSubmission(formElement, successMessageText) {
        const submitBtn = formElement.querySelector('button[type="submit"], input[type="submit"]'); // Find submit button
        const originalBtnText = submitBtn ? submitBtn.textContent || submitBtn.value : 'Submit';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...'; // Or update value for input type=submit
        }

        // --- IMPORTANT ---
        // In a real application, you would send data here using fetch() to your backend server.
        // const formData = new FormData(formElement);
        // fetch('/your-server-endpoint', { method: 'POST', body: formData })
        //   .then(response => response.json())
        //   .then(data => { /* Handle success from server */ })
        //   .catch(error => { /* Handle error */ })
        //   .finally(() => { /* Re-enable button, etc. */ });
        // --- /IMPORTANT ---


        // Simulate network delay and success
        setTimeout(() => {
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success'; // Style this class in CSS
            successMessage.textContent = successMessageText;

            formElement.innerHTML = ''; // Clear the form
            formElement.appendChild(successMessage);
        }, 1500); // 1.5 second delay simulation
    }

    /**
     * Initializes various animations like hero text, skill bars, counters.
     */
    function initializeAnimations() {
        animateHeroText();
        animateSkillBars();
        animateCounters();
        typeWriterEffect(); // Call typing effect after a delay
    }

    /** Animates the hero name letter by letter. */
    function animateHeroText() {
        if (!heroName) return;

        const text = heroName.textContent.trim();
        heroName.textContent = ''; // Clear existing text

        text.split('').forEach((letter, i) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter; // Use non-breaking space for spaces
            span.style.animationDelay = `${i * 0.08}s`; // Adjust timing
            span.className = 'animated-letter'; // Style this class in CSS for the animation
            heroName.appendChild(span);
        });
    }

     /** Animates the hero subtitle with a typewriter effect. */
    function typeWriterEffect() {
        if (!heroSubtitle) return;

        const text = heroSubtitle.textContent.trim();
        // Create a span to type into, preserving original element structure
        heroSubtitle.innerHTML = `<span class="typewriter-text"></span><span class="cursor">|</span>`;
        const typewriterSpan = heroSubtitle.querySelector('.typewriter-text');
        const cursorSpan = heroSubtitle.querySelector('.cursor');

        if (!typewriterSpan) return; // Ensure span was created

        let i = 0;
        const speed = 60; // Typing speed (ms)

        function type() {
            if (i < text.length) {
                typewriterSpan.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Typing finished, make cursor blink or disappear
                if (cursorSpan) cursorSpan.style.animation = 'blink 1s step-end infinite';
                // Alternatively: cursorSpan.style.display = 'none';
            }
        }

        // Delay start slightly after hero name animation might have started
        setTimeout(type, 1000); // Adjust delay as needed
    }


    /** Animates skill bars when the skills section is in view. */
    function animateSkillBars() {
        if (skillBars.length === 0) return;

        const skillSection = document.querySelector('.skills'); // Assuming bars are in a .skills section
        if (!skillSection) return; // Need the container to check visibility

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width') || bar.style.width || '0%';
                        bar.style.width = targetWidth; // Apply width for CSS transition
                    });
                    observer.unobserve(skillSection); // Stop observing once animated
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% visible

        // Initialize width to 0 for animation start
        skillBars.forEach(bar => {
             // Store target width if not already done (safer)
             if (!bar.hasAttribute('data-width')) {
                 bar.setAttribute('data-width', bar.style.width || '0%');
             }
            bar.style.width = '0%';
        });

        observer.observe(skillSection);
    }


    /** Animates counters from 0 to target value when in view. */
    function animateCounters() {
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const duration = 1500; // Animation duration in ms
                    let current = 0;
                    const stepTime = 16; // Roughly 60fps
                    const increment = target / (duration / stepTime);

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target; // Ensure final value is exact
                        }
                    };
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(counter); // Animate only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible

        counters.forEach(counter => {
            counter.textContent = '0'; // Start from 0
            observer.observe(counter);
        });
    }

    /**
     * Initializes lazy loading for images with data-src attribute.
     */
    function initializeLazyLoading() {
        if (lazyImages.length === 0) return;

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src'); // Remove data-src once loaded
                            img.classList.add('loaded'); // Add class for potential styling fade-in
                        }
                        observer.unobserve(img); // Stop observing once loaded
                    }
                });
            }, { rootMargin: '0px 0px 100px 0px' }); // Load images 100px before they enter viewport

            lazyImages.forEach(img => imageObserver.observe(img));

        } else {
            // Fallback for older browsers (load all images immediately)
            console.warn("IntersectionObserver not supported. Loading all images.");
            lazyImages.forEach(img => {
                 const src = img.getAttribute('data-src');
                 if (src) {
                     img.src = src;
                     img.removeAttribute('data-src');
                     img.classList.add('loaded');
                 }
            });
        }
    }

    /**
     * Updates the footer year dynamically.
     */
    function initializeFooterYear() {
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            // Be careful with replace, ensure it targets only the year
            yearElement.textContent = yearElement.textContent.replace(/© \d{4}/, `© ${currentYear}`);
             // Or if structure is different:
             // const yearSpan = yearElement.querySelector('.dynamic-year');
             // if(yearSpan) yearSpan.textContent = currentYear;
        }
    }


    /** (Optional) Initializes a custom cursor effect. */
    function initializeCustomCursor() {
        // Check if already initialized
        if (document.querySelector('.custom-cursor')) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor'; // Outer circle
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot'; // Inner dot
        document.body.appendChild(cursorDot);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;
        const speed = 0.15; // Smoothing factor for outer cursor

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Move dot instantly
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        // Smoothed movement for the outer cursor
        function animateCursor() {
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();


        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, input, textarea, [role="button"]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
        });
    }
     // Uncomment the line below in the main Initialization section to enable the custom cursor
     // initializeCustomCursor();


    /** (Optional) Initializes a preloader */
    function initializePreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) {
             console.warn("Preloader element (.preloader) not found.");
             return; // Exit if no preloader element exists
        }

        // Ensure preloader is visible initially (CSS should handle this)

        // Use window.onload to wait for all resources (images, etc.)
        window.addEventListener('load', () => {
             // Start fade out animation
             preloader.style.opacity = '0';

             // Remove preloader from DOM after transition
             preloader.addEventListener('transitionend', () => {
                 if (preloader.parentNode) { // Check if still attached
                     preloader.style.display = 'none'; // Hide completely
                     // Optional: preloader.remove(); // Remove from DOM if not needed again
                 }
             }, { once: true });

              // Fallback removal if transition doesn't fire
             setTimeout(() => {
                if (preloader.parentNode) preloader.style.display = 'none';
             }, 1000); // Duration should match CSS transition + a buffer
        });
    }
    // Call preloader initialization (often done outside DOMContentLoaded, tied to window.onload)
    // initializePreloader(); // Moved this call outside the main DOMContentLoaded

}); // End DOMContentLoaded

// Call preloader initialization separately if needed
// document.addEventListener('DOMContentLoaded', initializePreloader); // Or here if preferred
// Or better, call it directly if the element exists, and use window.onload inside it:
const preloaderElement = document.querySelector('.preloader');
if (preloaderElement) {
    window.addEventListener('load', () => {
        preloaderElement.style.opacity = '0';
        preloaderElement.addEventListener('transitionend', () => {
             if (preloaderElement.parentNode) preloaderElement.style.display = 'none';
        }, { once: true });
        // Fallback
        setTimeout(() => {
            if (preloaderElement.parentNode) preloaderElement.style.display = 'none';
        }, 1000);
    });
}