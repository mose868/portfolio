// DOM Elements
const navToggle = document.getElementById('navToggle');
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const header = document.getElementById('header');
const portfolioFilters = document.querySelectorAll('.portfolio-filter');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const navLinks = document.querySelectorAll('#navbar a');
const darkModeCheckbox = document.getElementById('dark-mode-checkbox');

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        darkModeCheckbox.checked = true;
        document.body.classList.add('dark-mode');
    }
    
    // Initialize animations
    initScrollAnimations();
    initSmoothScrolling();
    
    // Highlight active nav link based on scroll position
    highlightNavOnScroll();
    
    // Set up portfolio filtering
    setupPortfolioFilters();
    
    // Initialize any forms
    setupForms();
    
    // Add typing animation to hero text
    animateHeroText();
    
    // Initialize skill bars animation
    animateSkillBars();
});

// Mobile Navigation Toggle
navToggle.addEventListener('click', function() {
    navbar.classList.toggle('show');
    this.textContent = navbar.classList.contains('show') ? '✕' : '☰';
});

// Close mobile nav when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideNav = navbar.contains(event.target);
    const isClickOnToggle = navToggle.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnToggle && navbar.classList.contains('show')) {
        navbar.classList.remove('show');
        navToggle.textContent = '☰';
    }
});

// Back to Top Button Visibility
window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
    // Add sticky header on scroll
    if (window.scrollY > 100) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
    
    // Update active nav link
    highlightNavOnScroll();
    
    // Trigger animations when elements are in viewport
    animateOnScroll();
});

// Back to Top Button Click
backToTop.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Function to highlight active nav item on scroll
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section');
    let scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Setup portfolio filtering
function setupPortfolioFilters() {
    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            portfolioFilters.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('show');
                    }, 50);
                } else {
                    item.classList.remove('show');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Function to initialize animations on scroll
function initScrollAnimations() {
    // Add initial fade-in class to all elements that should be animated
    const animatedElements = document.querySelectorAll('.fade-in');
    
    animatedElements.forEach(element => {
        element.classList.add('not-visible');
    });
    
    // Initial check for elements in viewport
    animateOnScroll();
}

// Function to animate elements when they come into view
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.fade-in.not-visible');
    
    animatedElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.remove('not-visible');
            element.classList.add('visible');
        }
    });
}

// Function to check if element is in viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
        rect.bottom >= 0
    );
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile nav if open
            if (navbar.classList.contains('show')) {
                navbar.classList.remove('show');
                navToggle.textContent = '☰';
            }
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Form handling
function setupForms() {
    const contactForm = document.querySelector('.contact-form form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Show success message (in a real implementation, you'd send this data to a server)
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual AJAX call in production)
            setTimeout(() => {
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = 'Your message has been sent successfully!';
                
                contactForm.innerHTML = '';
                contactForm.appendChild(successMessage);
            }, 1500);
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const submitBtn = newsletterForm.querySelector('.newsletter-btn');
            
            submitBtn.textContent = '...';
            submitBtn.disabled = true;
            
            // Simulate subscription (replace with actual AJAX call in production)
            setTimeout(() => {
                const successMessage = document.createElement('div');
                successMessage.className = 'newsletter-success';
                successMessage.textContent = 'Subscribed successfully!';
                
                newsletterForm.innerHTML = '';
                newsletterForm.appendChild(successMessage);
            }, 1500);
        });
    }
}

// Hero text animation
function animateHeroText() {
    const heroName = document.querySelector('.hero-name');
    if (!heroName) return;
    
    const text = heroName.textContent;
    heroName.textContent = '';
    
    // Add span for each letter with delay
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.animationDelay = `${i * 0.1}s`;
        span.className = 'animated-letter';
        heroName.appendChild(span);
    }
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress > div');
    
    // Initial state - set width to 0
    skillBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        bar.setAttribute('data-width', targetWidth);
    });
    
    // Function to animate when in viewport
    const animateSkillBar = () => {
        skillBars.forEach(bar => {
            const skillSection = document.querySelector('.skills');
            const sectionPosition = skillSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (sectionPosition < screenPosition) {
                const targetWidth = bar.getAttribute('data-width');
                bar.style.width = targetWidth;
            }
        });
    };
    
    // Initial check and event listener
    animateSkillBar();
    window.addEventListener('scroll', animateSkillBar);
}

// Portfolio item click handler for a lightbox effect
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const title = this.querySelector('.portfolio-title').textContent;
        const category = this.querySelector('.portfolio-category').textContent;
        
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'portfolio-lightbox';
        
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${imgSrc}" alt="${title}">
                <div class="lightbox-caption">
                    <h3>${title}</h3>
                    <p>${category}</p>
                    <p class="lightbox-description">This is a showcase of my work in ${category}. Click on the close button to go back.</p>
                </div>
            </div>
        `;
        
        // Add lightbox to body
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Show lightbox with animation
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
        
        // Close lightbox on click
        lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
            }, 300);
        });
        
        // Close lightbox when clicking outside content
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const scrollPosition = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
});

// Track visibility of sections for analytics (placeholder function)
function trackSectionVisibility() {
    const sections = document.querySelectorAll('section');
    const visibleSections = new Set();
    
    window.addEventListener('scroll', function() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // If section is visible
            if (rect.top <= windowHeight * 0.7 && rect.bottom >= windowHeight * 0.3) {
                if (!visibleSections.has(section.id)) {
                    visibleSections.add(section.id);
                    // In a real implementation, you'd send this data to your analytics service
                    console.log(`Section viewed: ${section.id}`);
                }
            }
        });
    });
}

// Initialize tracking (uncomment in production if needed)
// trackSectionVisibility();

// Add a typing effect to a subtitle (can be customized)
function typeWriterEffect() {
    const heroSubtitle = document.querySelector('.hero p');
    if (!heroSubtitle) return;
    
    const text = heroSubtitle.textContent;
    heroSubtitle.innerHTML = '<span class="typewriter"></span>';
    const typewriterSpan = document.querySelector('.typewriter');
    
    let i = 0;
    const speed = 50; // typing speed in milliseconds
    
    function type() {
        if (i < text.length) {
            typewriterSpan.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    // Start typing effect
    setTimeout(() => {
        type();
    }, 1000); // Delay before starting
}

// Call typing effect after hero text animation
setTimeout(typeWriterEffect, 1500);

// Add preloader that disappears after page loads
window.addEventListener('load', function() {
    // Create preloader if it doesn't exist
    let preloader = document.querySelector('.preloader');
    
    if (!preloader) {
        preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="loader">
                <div class="loader-inner"></div>
            </div>
        `;
        document.body.prepend(preloader);
    }
    
    // Hide preloader with animation
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 500);
});

// Add image lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
});

// Add custom cursor effect (uncomment if you want this feature)
/*
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
    
    // Add hover effect
    const links = document.querySelectorAll('a, button, .portfolio-item');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('expand');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('expand');
        });
    });
}

// Initialize custom cursor (uncomment to enable)
// initCustomCursor();
*/

// Add counters animation for any number statistics
function animateCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // milliseconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
            current += increment;
            counter.textContent = Math.floor(current);
            
            if (current < target) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.5});
        
        observer.observe(counter);
    });
}

// Call counter animation on DOM load
document.addEventListener('DOMContentLoaded', animateCounters);

// Handle contact form validation with visual feedback
const formInputs = document.querySelectorAll('.form-control');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            this.classList.add('has-value');
        } else {
            this.classList.remove('has-value');
        }
    });
});

// Dynamic year in footer copyright
const yearElement = document.querySelector('.footer-bottom p');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace(/\d{4}/, currentYear);
}