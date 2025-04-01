document.addEventListener('DOMContentLoaded', function() {
    // Variables and element references
    const navToggle = document.getElementById('navToggle');
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('backToTop');
    
    // Toggle mobile navigation
    if (navToggle && navbar) {
        navToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            navToggle.textContent = navbar.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navbar && navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    if (navToggle) navToggle.textContent = '☰';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Update active navigation link
                document.querySelectorAll('#navbar a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Back to top button
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
            updateActiveNavOnScroll();
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Portfolio filtering
    const portfolioFilters = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            portfolioFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const display = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
                item.style.display = display ? 'block' : 'none';
                
                if (display) {
                    setTimeout(() => item.classList.add('fade-in-visible'), 100);
                } else {
                    item.classList.remove('fade-in-visible');
                }
            });
        });
    });
    
    // Animated typing effect for hero section
    const typingElement = document.querySelector('.hero-content h1');
    if (typingElement) {
        const originalText = typingElement.innerHTML;
        typingElement.innerHTML = '';
        
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                typingElement.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        setTimeout(typeWriter, 500);
    }
    
    // Intersection Observer for scroll animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(element => fadeObserver.observe(element));
    }
    
    // Animated skill bars
    const skillBars = document.querySelectorAll('.skill-progress > div');
    
    if (skillBars.length > 0) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetWidth = entry.target.style.width;
                    entry.target.style.width = '0';
                    setTimeout(() => {
                        entry.target.style.transition = 'width 1.5s ease-in-out';
                        entry.target.style.width = targetWidth;
                    }, 200);
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        skillBars.forEach(bar => skillObserver.observe(bar));
    }
    
    // Form validation helpers
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showFormError(inputElement, message) {
        const parent = inputElement.parentElement;
        const existingError = parent.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        parent.appendChild(errorMessage);
        
        inputElement.classList.add('error');
        
        inputElement.addEventListener('input', function() {
            this.classList.remove('error');
            const error = parent.querySelector('.error-message');
            if (error) error.remove();
        }, { once: true });
    }
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const messageInput = this.querySelector('textarea');
            
            // Form validation
            if (!nameInput.value.trim()) {
                showFormError(nameInput, 'Please enter your name');
                return;
            }
            
            if (!emailInput.value.trim()) {
                showFormError(emailInput, 'Please enter your email');
                return;
            }
            
            if (!isValidEmail(emailInput.value)) {
                showFormError(emailInput, 'Please enter a valid email');
                return;
            }
            
            if (!messageInput.value.trim()) {
                showFormError(messageInput, 'Please enter your message');
                return;
            }
            
            // Success message
            const formGroups = this.querySelectorAll('.form-group');
            const submitBtn = this.querySelector('.btn-submit');
            
            formGroups.forEach(group => group.style.display = 'none');
            submitBtn.style.display = 'none';
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Your message has been sent successfully! I will get back to you soon.';
            this.appendChild(successMessage);
            
            // Reset form after delay
            setTimeout(() => {
                this.reset();
                formGroups.forEach(group => group.style.display = 'block');
                submitBtn.style.display = 'block';
                successMessage.remove();
            }, 5000);
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter-input');
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                emailInput.classList.add('error');
                return;
            }
            
            emailInput.value = '';
            emailInput.placeholder = 'Successfully subscribed!';
            
            setTimeout(() => {
                emailInput.placeholder = 'Your Email';
            }, 3000);
        });
    }
    
    // Update active nav on scroll
    function updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('#navbar a');
        
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                
                const correspondingLink = document.querySelector(`#navbar a[href="#${sectionId}"]`);
                if (correspondingLink) correspondingLink.classList.add('active');
            }
        });
    }
    
    // Portfolio modal
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.portfolio-title').textContent;
            const category = this.querySelector('.portfolio-category').textContent;
            const imgSrc = this.querySelector('.portfolio-img').src;
            
            const modal = document.createElement('div');
            modal.className = 'portfolio-modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <img src="${imgSrc}" alt="${title}">
                    <h3>${title}</h3>
                    <p>${category}</p>
                    <div class="modal-description">
                        <p>This is a detailed description of the ${title} project. Additional information about this ${category} project would appear here.</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => modal.classList.add('show-modal'), 10);
            
            const closeModal = () => {
                modal.classList.remove('show-modal');
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                }, 300);
            };
            
            modal.querySelector('.close-modal').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        });
    });
    
    // Dynamic year in footer
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
    
    // Dark mode toggle
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = localStorage.getItem('darkMode') === 'true' ? '☀️' : '🌙';
    darkModeToggle.title = 'Toggle Dark Mode';
    document.body.appendChild(darkModeToggle);
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        this.innerHTML = isDark ? '☀️' : '🌙';
    });
});

// Preload images
window.addEventListener('load', function() {
    document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = src;
            document.head.appendChild(preloadLink);
        }
    });
});

// Parallax effect
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = window.pageYOffset * 0.5 + 'px';
    }
});

// Skill counter animation
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = 1;
    const stepTime = Math.abs(Math.floor(duration / target));
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = `${start}%`;
        if (start >= target) {
            element.textContent = `${target}%`;
            clearInterval(timer);
        }
    }, stepTime);
}

// Initialize counters
const skillSection = document.querySelector('#skills');
if (skillSection) {
    const skillObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('.skill-name span:last-child').forEach(counter => {
                const target = parseInt(counter.textContent);
                animateCounter(counter, target, 1500);
            });
            skillObserver.unobserve(skillSection);
        }
    }, { threshold: 0.2 });
    
    skillObserver.observe(skillSection);
}

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
    });
});