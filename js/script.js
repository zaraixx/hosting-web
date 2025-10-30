// Theme Switcher
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Function to set theme
function setTheme(isDark) {
    if (isDark) {
        body.classList.remove('light-theme');
        document.querySelectorAll('.theme-toggle').forEach(toggle => {
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
        });
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-theme');
        document.querySelectorAll('.theme-toggle').forEach(toggle => {
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
        });
        localStorage.setItem('theme', 'light');
    }
}

// Theme toggle click handler
document.querySelectorAll('.theme-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const isDarkTheme = !body.classList.contains('light-theme');
        setTheme(!isDarkTheme);
    });
});

// Apply theme colors from config
function applyThemeColors(config) {
    const root = document.documentElement;
    const colors = config.theme.colors;
    
    // Set CSS variables for both themes
    root.style.setProperty('--primary-color-dark', colors.primary.dark);
    root.style.setProperty('--primary-color-light', colors.primary.light);
    root.style.setProperty('--secondary-color-dark', colors.secondary.dark);
    root.style.setProperty('--secondary-color-light', colors.secondary.light);
    root.style.setProperty('--background-dark-dark', colors.background.dark);
    root.style.setProperty('--background-dark-light', colors.background.light);
    root.style.setProperty('--text-light-dark', colors.text.dark);
    root.style.setProperty('--text-light-light', colors.text.light);
}

// Console Animation with Minecraft server startup sequence
function initConsole(config) {
    const consoleText = config?.hero?.console?.startup_sequence || [
        "[INFO] Starting server...",
        "[INFO] Loading configuration...",
        "[INFO] Server started successfully!"
    ];
    let consoleLineIndex = 0;
    let charIndex = 0;
    const typingDelay = 30;
    const newLineDelay = 800;
    const typingText = document.querySelector('.typing-text');

    // Update console styling
    const consoleBody = document.querySelector('.console-body');
    if (consoleBody) {
        consoleBody.style.color = '#55FF55';
        consoleBody.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        consoleBody.style.fontFamily = 'Consolas, monospace';
        consoleBody.style.fontSize = '14px';
        consoleBody.style.lineHeight = '1.5';
        consoleBody.style.padding = '1.5rem';
        consoleBody.style.minHeight = '300px';
    }
    
    const consoleHostname = document.querySelector('.console-header p');
    if (consoleHostname && config?.hero?.console?.hostname) {
        consoleHostname.textContent = config.hero.console.hostname;
    }

    function typeConsoleText() {
        if (!typingText) return;
        
        if (charIndex < consoleText[consoleLineIndex].length) {
            const randomDelay = Math.random() * 20;
            typingText.innerHTML += consoleText[consoleLineIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeConsoleText, typingDelay + randomDelay);
        } else {
            typingText.innerHTML += '<br>';
            setTimeout(newConsoleLine, newLineDelay);
        }
    }

    function newConsoleLine() {
        if (consoleLineIndex < consoleText.length - 1) {
            consoleLineIndex++;
            charIndex = 0;
            setTimeout(typeConsoleText, typingDelay);
        }
    }

    // Start typing animation
    if (typingText) {
        setTimeout(typeConsoleText, 1000);
    }
}

// Initialize all animations and interactive elements
function initAnimations() {
    // Initialize FAQ accordion
    initFaqAccordion();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize testimonials
    if (typeof initTestimonials === 'function') {
        initTestimonials();
    }
    
    // Initialize show more functionality
    initShowMore();
}

// Main JavaScript file for site-wide functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize hover effects
    initHoverEffects();
});

// Initialize Mobile Menu
function initMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(event.target) && 
                !hamburgerMenu.contains(event.target)) {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking on a link (except dropdown toggles)
        const menuLinks = navLinks.querySelectorAll('a:not(.dropdown-toggle)');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// Initialize Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Get header height to offset scroll
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const scrollOffset = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: scrollOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize Scroll Animations
function initScrollAnimations() {
    // Add scroll-triggered animations to elements
    const animatedElements = document.querySelectorAll('.feature, .faq-item, .vps-item');
    
    // Create observer for elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Initialize Hover Effects
function initHoverEffects() {
    // Add hover effects to buttons and links
    const buttons = document.querySelectorAll('.primary-btn, .secondary-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 7px 14px rgba(var(--primary-color-rgb), 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(var(--primary-color-rgb), 0.1)';
        });
    });
}

// Active link highlighting
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// FAQ Accordion with smooth animations
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Prevent multiple initializations
    if (faqItems[0]?.dataset.initialized === 'true') {
        return;
    }

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Set initial state
        answer.style.maxHeight = '0px';
        
        item.dataset.initialized = 'true';
        
        question.addEventListener('click', () => {
            // Toggle active class
            const isActive = item.classList.contains('active');
            
            // First close all items
            faqItems.forEach(faqItem => {
                if (faqItem !== item) {
                    faqItem.classList.remove('active');
                    const faqAnswer = faqItem.querySelector('.faq-answer');
                    faqAnswer.style.maxHeight = '0px';
                }
            });
            
            // Then toggle the clicked item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0px';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                
                // Add animation to card
                item.style.transform = 'translateY(-8px)';
                setTimeout(() => {
                    item.style.transform = 'translateY(-5px)';
                }, 300);
            }
        });
    });
    
    // Open the first FAQ item by default
    if (faqItems.length > 0 && window.innerWidth > 768) {
        faqItems[0].classList.add('active');
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        if (firstAnswer) {
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        }
    }
}

// Initialize testimonials with smooth scrolling
function initTestimonials() {
    const columns = document.querySelectorAll('.testimonials-column');
    
    columns.forEach((column, index) => {
        const track = column.querySelector('.testimonials-track');
        if (!track) return;
        
        // Clone testimonials for smooth infinite scroll
        const testimonials = track.querySelectorAll('.testimonial');
        const clonedTestimonials = Array.from(testimonials).map(testimonial => testimonial.cloneNode(true));
        clonedTestimonials.forEach(clone => track.appendChild(clone));
        
        // Ensure smooth transition when animation restarts
        track.addEventListener('animationend', () => {
            // Reset the animation without visual interruption
            track.style.animation = 'none';
            track.offsetHeight; // Force reflow
            track.style.animation = '';
        });
        
        // Pause animation on hover
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
        
        // Touch interaction for mobile
        let touchStart = 0;
        let touchDown = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].clientY;
            touchDown = touchStart;
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const diff = touchStart - touch.clientY;
            
            // Calculate new position
            const currentTransform = window.getComputedStyle(track).transform;
            const matrix = new DOMMatrix(currentTransform);
            const newY = matrix.m42 - diff;
            
            track.style.transform = `translateY(${newY}px)`;
            touchStart = touch.clientY;
        });
        
        track.addEventListener('touchend', () => {
            track.style.transform = '';
            track.style.animationPlayState = 'running';
        });
    });
}

// Scroll animations for elements
function initScrollAnimations() {
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, {
        root: null,
        threshold: 0.1,
        rootMargin: '-50px'
    });

    // Observe elements to animate
    document.querySelectorAll('.server-card, .feature, .support-card, .faq-item').forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });
}

// Add CSS for scroll animations
function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-in-element.animate {
            opacity: 1;
            transform: translateY(0);
        }
        .server-card:nth-child(2) {
            transition-delay: 0.2s;
        }
        .server-card:nth-child(3) {
            transition-delay: 0.4s;
        }
        .feature:nth-child(2) {
            transition-delay: 0.15s;
        }
        .feature:nth-child(3) {
            transition-delay: 0.3s;
        }
        .feature:nth-child(4) {
            transition-delay: 0.45s;
        }
    `;
    document.head.appendChild(style);
}

// Parallax effect for gradient blobs
function initParallaxEffect() {
    window.addEventListener('mousemove', (e) => {
        const blobs = document.querySelectorAll('.gradient-blob');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        blobs.forEach((blob, index) => {
            const speed = 0.03 * (index + 1);
            const offsetX = (x - 0.5) * speed * 100;
            const offsetY = (y - 0.5) * speed * 100;
            
            blob.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
}

// Show More Games functionality
function initShowMore() {
    const showMoreBtn = document.querySelector('.show-more-btn');
    const additionalServers = document.querySelector('.additional-servers');
    const showMoreText = document.querySelector('.show-more-text');
    const chevronIcon = document.querySelector('.show-more-btn i');
    
    if (!showMoreBtn || !additionalServers || !showMoreText) {
        return;
    }

    // Add transition styles to additional-servers
    additionalServers.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    additionalServers.style.opacity = '0';
    additionalServers.style.transform = 'translateY(20px)';
    
    let isExpanded = false;

    showMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        
        if (isExpanded) {
            // Show additional servers
            additionalServers.style.display = 'grid';
            // Force reflow
            additionalServers.offsetHeight;
            additionalServers.style.opacity = '1';
            additionalServers.style.transform = 'translateY(0)';
            showMoreBtn.classList.add('active');
            showMoreText.textContent = 'Show Less';
            chevronIcon.style.transform = 'rotate(180deg)';
        } else {
            // Hide additional servers
            additionalServers.style.opacity = '0';
            additionalServers.style.transform = 'translateY(20px)';
            showMoreBtn.classList.remove('active');
            showMoreText.textContent = 'Show All Games';
            chevronIcon.style.transform = 'rotate(0deg)';
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                if (!isExpanded) { // Check again to prevent race conditions
                    additionalServers.style.display = 'none';
                }
            }, 300);
        }
    });
}

// Initialize dropdown functionality
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Remove any existing click listeners
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
            
            // Mobile handling
            if (window.innerWidth <= 768) {
                // Handle click on the toggle
                newToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle current dropdown
                    const wasActive = dropdown.classList.contains('active');
                    
                    // Close all dropdowns first
                    dropdowns.forEach(d => d.classList.remove('active'));
                    
                    // If it wasn't active, open it
                    if (!wasActive) {
                        dropdown.classList.add('active');
                    }
                });
                
                // Prevent clicks inside menu from closing
                menu.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            } else {
                // Desktop handling
                dropdown.addEventListener('mouseenter', () => {
                    dropdown.classList.add('active');
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    dropdown.classList.remove('active');
                });
            }
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Update dropdown behavior on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            initDropdowns();
        }, 250);
    });
}

// Load configuration and initialize site
async function initSite() {
    try {
        const response = await fetch('./config.yaml');
        const yamlText = await response.text();
        const config = jsyaml.load(yamlText);
        
        if (config) {
            // Apply theme colors
            applyThemeColors(config);
            
            // Set initial theme
            const savedTheme = localStorage.getItem('theme') || config.theme.default;
            setTheme(savedTheme === 'dark');
            
            
            // Update site title and meta
            document.title = `${config.site.full_name} - ${config.site.tagline}`;
            
            // Update logo
            const logo = document.querySelector('.logo');
            if (logo) {
                logo.innerHTML = `${config.site.name.slice(0, -5)}<span>${config.site.name.slice(-5)}</span>`;
            }
            
            // Initialize console with config
            initConsole(config);
            
            // Initialize mobile menu
            initMobileMenu();
            
            // Initialize animations
            initAnimations();

            // Initialize show more functionality
            initShowMore();
            
            // Update copyright year
            const copyright = document.querySelector('.footer-bottom p');
            if (copyright) {
                copyright.textContent = `Â© ${config.site.copyright_year} ${config.site.full_name}. All rights reserved.`;
            }
        }
    } catch (error) {
        console.error('Error loading configuration:', error);
        // Initialize with default configuration
        initConsole();
        initMobileMenu();
        initAnimations();
        initShowMore();
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize dropdowns
    initDropdowns();
    
    // Initialize animations
    initAnimations();
    
    // Initialize show more functionality
    initShowMore();
    
    // Initialize FAQ accordion
    initFaqAccordion();
    
    // Load configuration
    loadConfig().then(config => {
        if (config) {
            // Update page content based on config
            applySiteConfig(config);
            
            
            // Re-initialize interactive elements after content update
            initShowMore();
            initFaqAccordion();
            initTestimonials();
        }
    });
});

// Remove duplicate initialization
document.addEventListener('DOMContentLoaded', initSite); 