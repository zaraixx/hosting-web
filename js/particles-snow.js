// Particles.js snow configuration
let particlesConfig = {
    "particles": {
        "number": {
            "value": 50,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            }
        },
        "opacity": {
            "value": 0.8,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": false
        },
        "move": {
            "enable": true,
            "speed": 2,
            "direction": "bottom",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": false
            },
            "onclick": {
                "enable": false
            },
            "resize": true
        }
    },
    "retina_detect": true
};

// Initialize particles
function initParticlesSnow(config) {
    if (config) {
        // Update particles config with user settings
        if (config.density) {
            particlesConfig.particles.number.value = config.density;
        }
        if (config.speed) {
            particlesConfig.particles.move.speed = config.speed;
        }
        if (config.size) {
            particlesConfig.particles.size.value = config.size;
        }
        if (config.color) {
            particlesConfig.particles.color.value = config.color;
        }
    }
    
    // Check if particles container exists
    const container = document.getElementById('snow-container');
    if (!container) {
        console.warn('Snow container not found');
        return;
    }
    
    // Initialize particles.js
    particlesJS('snow-container', particlesConfig);
}

// Update particles configuration
function updateParticlesConfig(newConfig) {
    if (newConfig.density) {
        particlesConfig.particles.number.value = newConfig.density;
    }
    if (newConfig.speed) {
        particlesConfig.particles.move.speed = newConfig.speed;
    }
    if (newConfig.size) {
        particlesConfig.particles.size.value = newConfig.size;
    }
    if (newConfig.color) {
        particlesConfig.particles.color.value = newConfig.color;
    }
    
    // Reinitialize particles
    initParticlesSnow();
}

// Initialize Christmas mode with particles
function initChristmasParticles(christmasConfig) {
    if (!christmasConfig || !christmasConfig.enabled) {
        return;
    }
    
    // Add Christmas class to body
    document.body.classList.add('christmas-mode');
    
    // Show snow container
    const container = document.getElementById('snow-container');
    if (container) {
        container.style.display = 'block';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1';
    }
    
    // Initialize particles with config
    initParticlesSnow(christmasConfig.snow_config);
}

// Fallback initialization
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Check if config loaded and christmas mode is enabled
        if (!window.siteConfig) {
            console.log('Config not loaded, initializing default particles snow...');
            // Enable Christmas mode by default
            document.body.classList.add('christmas-mode');
            
            // Initialize with default settings
            initChristmasParticles({
                enabled: true,
                snow_config: {
                    density: 25,
                    speed: 2,
                    size: 3,
                    color: "#ffffff"
                }
            });
        }
    }, 3000);
});

// Export functions for use in config.js
window.initChristmasParticles = initChristmasParticles;
window.updateParticlesConfig = updateParticlesConfig;