// Scroll animations for elements
function initScrollAnimations() {
    const animateOnScroll = debounce((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, 50);

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

// Optimize parallax effect
function initParallaxEffect() {
    let ticking = false;
    window.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const blobs = document.querySelectorAll('.gradient-blob');
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                
                blobs.forEach((blob, index) => {
                    const speed = 0.03 * (index + 1);
                    const offsetX = (x - 0.5) * speed * 100;
                    const offsetY = (y - 0.5) * speed * 100;
                    
                    blob.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Animations for the site
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initGradientBlobs();
    initTypingEffects();
    initRevealAnimations();
    initParallaxEffects();
});

// Gradient Blobs Animation
function initGradientBlobs() {
    const blobs = document.querySelectorAll('.gradient-blob');
    
    if (blobs.length === 0) return;
    
    // Random movement for each blob
    blobs.forEach((blob, index) => {
        // Generate random animation parameters
        const speed = Math.random() * 10 + 30; // 30-40s
        const xDirection = Math.random() > 0.5 ? 1 : -1;
        const yDirection = Math.random() > 0.5 ? 1 : -1;
        const xMove = Math.random() * 10 + 5; // 5-15%
        const yMove = Math.random() * 10 + 5; // 5-15%
        
        // Set unique animation
        blob.style.animation = `blob-move-${index} ${speed}s ease-in-out infinite`;
        
        // Create keyframes for this specific blob
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes blob-move-${index} {
                0%, 100% {
                    transform: translate(0, 0);
                }
                33% {
                    transform: translate(${xMove * xDirection}%, ${yMove * yDirection}%);
                }
                66% {
                    transform: translate(${-xMove * xDirection}%, ${-yMove * yDirection}%);
                }
            }
        `;
        document.head.appendChild(styleSheet);
    });
}

// Typing Effect for Console Elements
function initTypingEffects() {
    const consoleElements = document.querySelectorAll('.console-output');
    
    consoleElements.forEach(consoleEl => {
        const lines = consoleEl.querySelectorAll('.console-line');
        let delay = 0;
        
        lines.forEach(line => {
            const text = line.textContent;
            line.textContent = '';
            line.style.display = 'block';
            
            setTimeout(() => {
                typeText(line, text, 0);
            }, delay);
            
            // Increase delay for next line
            delay += text.length * 40 + 500; // Adjust typing speed and pause between lines
        });
    });
}

// Helper function for typing effect
function typeText(element, text, index) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => {
            typeText(element, text, index + 1);
        }, Math.random() * 40 + 30); // Random typing speed for more natural effect
    } else {
        // Add cursor blink effect after typing is complete
        if (!element.classList.contains('cursor-blink')) {
            element.classList.add('cursor-blink');
        }
    }
}

// Scroll-triggered Reveal Animations
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if (revealElements.length === 0) return;
    
    // Create observer for elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class to trigger animation
                entry.target.classList.add('revealed');
                
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each element
    revealElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add reveal class to elements if they already exist
    document.querySelectorAll('.feature, .vps-item, .faq-item').forEach(element => {
        if (!element.classList.contains('reveal-on-scroll')) {
            element.classList.add('reveal-on-scroll');
            observer.observe(element);
        }
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.2;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
    
    // Add parallax to hero section background
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < heroSection.offsetHeight) {
                heroSection.style.backgroundPositionY = `${scrollY * 0.5}px`;
            }
        });
    }
}

// Counter Animation for Numbers
function initCounterAnimations() {
    const counterElements = document.querySelectorAll('.counter');
    
    if (counterElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.dataset.target) || 0;
                const duration = parseInt(target.dataset.duration) || 2000;
                const prefix = target.dataset.prefix || '';
                const suffix = target.dataset.suffix || '';
                
                animateCounter(target, targetValue, duration, prefix, suffix);
                
                // Unobserve after starting animation
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counterElements.forEach(element => {
        observer.observe(element);
    });
}

// Helper function for counter animation
function animateCounter(element, target, duration, prefix, suffix) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = prefix + Math.floor(start) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = prefix + target + suffix;
        }
    }
    
    updateCounter();
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    addScrollAnimationStyles();
    initScrollAnimations();
    initParallaxEffect();
});

// Optimize scroll animations with debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 