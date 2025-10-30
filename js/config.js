// Configuration management
let siteConfig = null;

// Load configuration file and make it available globally
async function loadConfig() {
    // Try multiple paths for the config file
    const configPaths = [
        'config.yaml',
        './config.yaml',
        '../config.yaml',
        '/config.yaml'
    ];

    for (const path of configPaths) {
        try {
            console.log(`Trying to fetch config from: ${path}`);
            const response = await fetch(path);
            
            if (response.ok) {
                const yamlText = await response.text();
                console.log(`Successfully loaded config from: ${path}`);
                
                try {
                    // Parse YAML content
                    siteConfig = jsyaml.load(yamlText);
                    window.siteConfig = siteConfig;
                    
                    // Initialize with the loaded config
                    initializeWithConfig(siteConfig);
                    
                    return siteConfig;
                } catch (error) {
                    console.error('Error parsing config:', error);
                }
            }
        } catch (error) {
            console.log(`Failed to load from ${path}:`, error);
        }
    }
    
    console.error('Could not load config from any location');
    return null;
}

// Initialize with config
function initializeWithConfig(config) {
    if (!config) return;
    
    console.log('Initializing with config:', config);
    
    // Initialize theme
    initTheme(config.theme);
    
    // Initialize Christmas mode if config exists (enabled state handled inside initChristmasMode)
    if (config.christmas_mode) {
        initChristmasMode(config.christmas_mode);
    }

    // Apply site-wide configuration first
    applySiteConfig(config);

    // Update navigation first
    if (config.navigation) {
        console.log('Updating navigation with config:', config.navigation);
        updateNavigation(config.navigation);
    }

    // Update all prices with currency formatting
    updateAllPrices(config);
    
    // Trigger a custom event so other scripts can know config is loaded
    const configLoadedEvent = new CustomEvent('configLoaded', { detail: { config: config } });
    document.dispatchEvent(configLoadedEvent);
}

// Format price according to currency configuration
function formatPrice(amount, config) {
    const currency = config.site.currency;
    
    // Format the number according to configuration
    const formattedAmount = new Intl.NumberFormat(navigator.language, {
        minimumFractionDigits: currency.decimal_places,
        maximumFractionDigits: currency.decimal_places,
        useGrouping: true
    }).format(amount);

    // Replace default separators with configured ones
    const parts = formattedAmount.split('.');
    const integerPart = parts[0].replace(/,/g, currency.thousands_separator);
    const decimalPart = parts[1] || '0'.repeat(currency.decimal_places);
    
    const formattedPrice = `${integerPart}${currency.decimal_separator}${decimalPart}`;
    
    // Add currency symbol in correct position
    return currency.position === 'before' 
        ? `${currency.symbol}${formattedPrice}`
        : `${formattedPrice}${currency.symbol}`;
}

// Update all price elements on the page
function updateAllPrices(config) {
    if (!config.site?.currency) return;

    console.log('Updating all prices with config:', config);
    
    // Update elements with data-price attribute
    document.querySelectorAll('[data-price]').forEach(element => {
        const price = parseFloat(element.dataset.price);
        if (!isNaN(price)) {
            // Get the unit suffix if it exists (e.g., /GB, /slot)
            const unitSpan = element.querySelector('span');
            const unit = unitSpan ? unitSpan.textContent : '';
            
            // Format the price
            const formattedPrice = formatPrice(price, config);
            
            // Update the content while preserving the unit
            if (element.classList.contains('price-amount')) {
                element.innerHTML = formattedPrice + (unit ? `<span>${unit}</span>` : '');
            } else {
                element.textContent = formattedPrice + (unit || '');
            }
        }
    });

    // Update VPS plan prices
    document.querySelectorAll('.vps-item .price-amount').forEach(element => {
        const priceSpan = element.querySelector('span[data-price]');
        if (priceSpan) {
            const price = parseFloat(priceSpan.dataset.price);
            if (!isNaN(price)) {
                priceSpan.textContent = formatPrice(price, config);
            }
        }
    });

    // Update server card prices
    document.querySelectorAll('.server-card .price-amount').forEach(element => {
        const priceSpan = element.querySelector('span[data-price]');
        if (priceSpan) {
            const price = parseFloat(priceSpan.dataset.price);
            if (!isNaN(price)) {
                priceSpan.textContent = formatPrice(price, config);
            }
        }
    });

    // Update dedicated server prices
    document.querySelectorAll('.server-item .server-price').forEach(element => {
        const priceSpan = element.querySelector('span[data-price]');
        if (priceSpan) {
            const price = parseFloat(priceSpan.dataset.price);
            if (!isNaN(price)) {
                priceSpan.textContent = formatPrice(price, config);
            }
        }
    });
}

// Initialize theme
function initTheme(themeConfig) {
    if (!themeConfig) return;
    
    // Set default theme
    const defaultTheme = themeConfig.default || 'dark';
    document.documentElement.setAttribute('data-theme', defaultTheme);
    
    // Setup theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Toggle theme between dark and light
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update theme toggle icon
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
}

// Initialize Christmas mode
function initChristmasMode(christmasConfig) {
    if (!christmasConfig) return;
    
    // Use particles.js implementation if available
    if (typeof initChristmasParticles === 'function') {
        initChristmasParticles(christmasConfig);
    } else {
        // Fallback to old snow implementation
        document.body.classList.add('christmas-mode');
        if (christmasConfig.snow_config && typeof initSnow === 'function') {
            const snowConfigWithEnabled = {
                ...christmasConfig.snow_config,
                enabled: christmasConfig.enabled
            };
            initSnow(snowConfigWithEnabled);
        }
    }
}

// Check user's saved theme preference
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
    
    // Setup mobile menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }
});

// Apply site-wide configuration
function applySiteConfig(config) {
    // Update site title and meta
    document.title = `${config.site.full_name} - ${config.site.tagline}`;
    
    // Update logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.innerHTML = `${config.site.name.slice(0, -5)}<span>${config.site.name.slice(-5)}</span>`;
    }

    // Update hero section
    updateHeroSection(config.hero);

    // Update game servers
    updateGameServers(config.servers);

    // Update features
    updateFeatures(config.features);

    // Update testimonials if they exist
    if (config.testimonials) {
        updateTestimonials(config.testimonials);
    }

    // Update FAQ if it exists
    if (config.faq) {
        updateFAQ(config.faq);
    }

    // Update footer
    updateFooter(config.footer, config.site);
}

// Update navigation
function updateNavigation(navConfig) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Get current page path
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const currentUrl = currentPath + currentHash;

    // Use the menu configuration if available, otherwise fall back to links
    const menuItems = navConfig.menu || navConfig.links || [];
    
    // Create navigation HTML
    const navHTML = menuItems.map(link => {
        if (link.dropdown) {
            const isActive = link.items.some(item => item.url === currentUrl);
            return `
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle ${isActive ? 'active' : ''}">
                        <i class="${link.icon}"></i>${link.title || link.name}
                        <i class="fas fa-chevron-down"></i>
                    </a>
                    <ul class="dropdown-menu">
                        ${link.items.map(item => `
                            <li>
                                <a href="${item.url}" ${item.url === currentUrl ? 'class="active"' : ''}>
                                    <i class="${item.icon}"></i>${item.title || item.name}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </li>
            `;
        } else {
            return `
                <li>
                    <a href="${link.url}" ${link.url === currentUrl ? 'class="active"' : ''}>
                        <i class="${link.icon}"></i>${link.title || link.name}
                    </a>
                </li>
            `;
        }
    }).join('');

    // Add nav buttons
    const navButtons = navLinks.querySelector('.nav-buttons')?.outerHTML || `
        <div class="nav-buttons">
            <button class="theme-toggle">
                <i class="fas fa-moon"></i>
            </button>
            <button class="primary-btn">Get Started</button>
        </div>
    `;

    // Update navigation
    navLinks.innerHTML = navHTML + navButtons;

    // Initialize dropdown functionality
    initDropdowns();
}

// Initialize dropdown functionality
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Mobile handling
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = dropdown.classList.contains('active');
                
                // Close all other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            });
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
}

class ConsoleAnimator {
    constructor(element, sequence) {
        this.element = element;
        this.sequence = sequence;
        this.currentLine = 0;
        this.currentChar = 0;
        this.output = '';
        this.isTyping = false;
    }

    start() {
        // Clear the console
        this.element.innerHTML = '';
        this.isTyping = true;
        this.typeNextChar();
    }

    typeNextChar() {
        if (!this.isTyping || this.currentLine >= this.sequence.length) {
            return;
        }

        const line = this.sequence[this.currentLine];

        if (this.currentChar < line.length) {
            // Add next character
            this.output += line[this.currentChar];
            this.element.textContent = this.output;
            this.currentChar++;
            setTimeout(() => this.typeNextChar(), 35);
        } else {
            // Line complete, add line break
            this.output += '\n';
            this.element.textContent = this.output;
            this.currentLine++;
            this.currentChar = 0;
            
            // Add delay between lines
            setTimeout(() => this.typeNextChar(), 700);
        }
    }

    stop() {
        this.isTyping = false;
    }
}

function initConsole(config) {
    if (!config?.hero?.console?.startup_sequence) {
        return;
    }

    const consoleText = document.querySelector('.typing-text');
    const consoleBody = document.querySelector('.console-body');
    
    if (!consoleText || !consoleBody) {
        return;
    }

    // Style the console
    consoleBody.style.cssText = `
        color: #55FF55;
        background-color: rgba(0, 0, 0, 0.8);
        font-family: 'Consolas', monospace;
        font-size: 14px;
        line-height: 1.5;
        padding: 1.5rem;
        min-height: 300px;
        white-space: pre;
    `;

    // Create and start the console animator
    const animator = new ConsoleAnimator(consoleText, config.hero.console.startup_sequence);
    
    // Start with a slight delay
    setTimeout(() => animator.start(), 500);
}

// Update hero section
function updateHeroSection(heroConfig) {
    if (!heroConfig) return;

    const heroTitle = document.querySelector('.hero-text h1');
    const heroSubtitle = document.querySelector('.hero-text p');
    const heroButton = document.querySelector('.hero-text .primary-btn');
    const consoleHostname = document.querySelector('.console-header p');

    if (heroTitle) {
        heroTitle.textContent = heroConfig.title;
    }
    
    if (heroSubtitle) {
        heroSubtitle.textContent = heroConfig.subtitle;
    }
    
    if (heroButton) {
        heroButton.textContent = heroConfig.cta_text;
        if (heroConfig.cta_url) {
            heroButton.href = heroConfig.cta_url;
        }
    }

    if (consoleHostname && heroConfig.console?.hostname) {
        consoleHostname.textContent = heroConfig.console.hostname;
    }
}

// Update game servers section
function updateGameServers(serversConfig) {
    if (!serversConfig) return;

    const serverGrid = document.querySelector('.server-grid');
    const additionalServers = document.querySelector('.additional-servers');
    const showMoreBtn = document.querySelector('.show-more-btn');
    const showMoreText = document.querySelector('.show-more-text');

    if (serverGrid && serversConfig.featured) {
        serverGrid.innerHTML = serversConfig.featured.map(server => createServerCard(server)).join('');
    }

    if (additionalServers && serversConfig.additional) {
        additionalServers.innerHTML = serversConfig.additional.map(server => createServerCard(server)).join('');
        
        // Setup show more functionality
        if (showMoreBtn && showMoreText) {
            additionalServers.style.display = 'none';
            showMoreBtn.addEventListener('click', () => {
                const isExpanded = additionalServers.style.display !== 'none';
                additionalServers.style.display = isExpanded ? 'none' : 'grid';
                showMoreText.textContent = isExpanded ? 'Show All Games' : 'Show Less';
                showMoreBtn.classList.toggle('active');
            });
        }
    }
}

// Create server card HTML
function createServerCard(server) {
    return `
        <div class="server-card ${server.name.toLowerCase()}">
            ${server.popular ? '<div class="popular-tag">Most Popular</div>' : ''}
            <div class="server-card-header">
                <img src="${server.image}" alt="${server.name}">
                <h3>${server.name}</h3>
            </div>
            <div class="server-card-body">
                <ul class="server-features">
                    ${server.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <div class="server-price">
                    <div class="price-amount" data-price="${server.price}">${server.price}<span>/${server.price_unit}</span></div>
                    <div class="price-period">${server.price_period}</div>
                </div>
                <div class="buttons">
                    <a href="${server.cta_url}" class="primary-btn">${server.cta_text || 'Deploy Server'}</a>
                </div>
            </div>
        </div>
    `;
}

// Update features section
function updateFeatures(features) {
    const featuresGrid = document.querySelector('.features-grid');
    if (featuresGrid) {
        featuresGrid.innerHTML = features.map(feature => `
            <div class="feature">
                <i class="${feature.icon}"></i>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }
}

// Update testimonials section
function updateTestimonials(testimonials) {
    const testimonialsTitle = document.querySelector('.testimonials h2');
    const testimonialsRight = document.querySelector('.testimonials-right');
    
    if (testimonialsTitle) {
        testimonialsTitle.textContent = testimonials.title;
    }

    if (testimonialsRight) {
        testimonialsRight.innerHTML = `
            <h3>${testimonials.subtitle}</h3>
            <p>${testimonials.description}</p>
            <p>${testimonials.additional_text}</p>
        `;
    }

    // Update testimonial tracks
    const tracks = document.querySelectorAll('.testimonials-track');
    const testimonialHTML = testimonials.reviews.map(review => `
        <div class="testimonial">
            <div class="testimonial-content">
                <p>"${review.text}"</p>
                <div class="testimonial-author">
                    <img src="${review.avatar}" alt="${review.author}">
                    <div>
                        <h4>${review.author}</h4>
                        <p>${review.role}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    tracks.forEach(track => {
        track.innerHTML = testimonialHTML + testimonialHTML; // Duplicate for infinite scroll
    });
}

// Update FAQ section
function updateFAQ(faq) {
    const faqContainer = document.querySelector('.faq-container');
    const faqTitle = document.querySelector('.faq h2');
    const faqHelp = document.querySelector('.faq-help-text');

    if (faqTitle) {
        faqTitle.textContent = faq.title;
    }

    if (faqContainer) {
        faqContainer.innerHTML = faq.questions.map(q => `
            <div class="faq-item">
                <div class="faq-question">
                    <h3>${q.question}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${q.answer}</p>
                </div>
            </div>
        `).join('');
    }

    if (faqHelp) {
        faqHelp.innerHTML = `<a href="${faq.help_link}"><i class="${faq.help_icon}"></i>${faq.help_text}</a>`;
    }
}

// Update footer
function updateFooter(footer, siteConfig) {
    const footerDescription = document.querySelector('.footer-section p');
    const socialLinks = document.querySelector('.social-links');
    // Find the footer section that contains "Quick Links"
    const quickLinks = Array.from(document.querySelectorAll('.footer-section')).find(section => 
        section.querySelector('h3') && section.querySelector('h3').textContent.includes('Quick Links')
    );
    const copyright = document.querySelector('.footer-bottom p');

    if (footerDescription) {
        footerDescription.textContent = footer.description;
    }

    if (socialLinks) {
        socialLinks.innerHTML = footer.social_links.map(link => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer">
                <i class="${link.icon}"></i>
            </a>
        `).join('');
    }

    if (quickLinks) {
        quickLinks.innerHTML = `
            <h3>Quick Links</h3>
            ${footer.quick_links.map(link => `
                <a href="${link.url}">${link.name}</a>
            `).join('')}
        `;
    }

    if (copyright) {
        const year = new Date().getFullYear();
        copyright.textContent = `Â© ${siteConfig.copyright_year} ${siteConfig.full_name}. All rights reserved.`;
    }
}

// Update VPS hosting page
function updateVPSPage(config) {
    if (!config.vps_hosting) {
        console.warn('No VPS hosting config found');
        return;
    }
    console.log('Updating VPS page with config:', config.vps_hosting);

    // Update hero section
    const hero = document.querySelector('.vps-hero');
    if (hero) {
        const title = hero.querySelector('h1');
        const subtitle = hero.querySelector('p');
        const cta = hero.querySelector('.primary-btn');

        if (title) title.textContent = config.vps_hosting.hero.title;
        if (subtitle) subtitle.textContent = config.vps_hosting.hero.subtitle;
        if (cta) cta.textContent = config.vps_hosting.hero.cta_text;
    }

    // Update features
    const features = document.querySelector('#features');
    if (features) {
        const title = features.querySelector('h2');
        const description = features.querySelector('.section-description');
        const grid = features.querySelector('.features-grid');

        if (title) title.textContent = config.vps_hosting.features.title;
        if (description) description.textContent = config.vps_hosting.features.description;
        if (grid) {
            grid.innerHTML = config.vps_hosting.features.items.map(feature => `
                <div class="feature">
                    <i class="${feature.icon}"></i>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `).join('');
        }
    }

    // Update plans
    const serverGrid = document.querySelector('.server-grid');
    console.log('Server grid element:', serverGrid);
    console.log('VPS plans:', config.vps_hosting.plans);
    if (serverGrid && config.vps_hosting.plans.plans_list) {
        console.log('Updating VPS plans with:', config.vps_hosting.plans.plans_list);
        serverGrid.innerHTML = config.vps_hosting.plans.plans_list.map(plan => `
            <div class="server-card">
                ${plan.popular ? '<div class="popular-tag">Most Popular</div>' : ''}
                <div class="server-card-header">
                    <i class="fas fa-server"></i>
                    <h3>${plan.name}</h3>
                </div>
                <div class="server-card-body">
                    <div class="specs-list">
                        <div class="spec-item">
                            <i class="fas fa-microchip"></i>
                            <div class="spec-details">
                                <div class="spec-value">${plan.specs.cpu}</div>
                                <div class="spec-label">Processor</div>
                            </div>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-memory"></i>
                            <div class="spec-details">
                                <div class="spec-value">${plan.specs.ram}</div>
                                <div class="spec-label">Memory</div>
                            </div>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-hdd"></i>
                            <div class="spec-details">
                                <div class="spec-value">${plan.specs.storage}</div>
                                <div class="spec-label">Storage</div>
                            </div>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-network-wired"></i>
                            <div class="spec-details">
                                <div class="spec-value">${plan.specs.bandwidth}</div>
                                <div class="spec-label">Bandwidth</div>
                            </div>
                        </div>
                    </div>
                    <ul class="server-features">
                        ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div class="server-price">
                        <div class="price-amount" data-price="${plan.price}">$${plan.price}<span>/${plan.period}</span></div>
                    </div>
                    <div class="buttons">
                        <a href="${plan.cta_url || '#'}" class="primary-btn">${plan.cta_text || 'Deploy Now'}</a>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Update price formatting after generating the HTML
        updateAllPrices(config);
    }
}

// Update dedicated hosting page
function updateDedicatedPage(config) {
    if (!config.dedicated_hosting) return;

    // Update hero section
    const hero = document.querySelector('.dedicated-hero');
    if (hero) {
        const title = hero.querySelector('h1');
        const subtitle = hero.querySelector('p');
        const cta = hero.querySelector('.primary-btn');
        
        if (title) title.textContent = config.dedicated_hosting.hero.title;
        if (subtitle) subtitle.textContent = config.dedicated_hosting.hero.subtitle;
        if (cta) cta.textContent = config.dedicated_hosting.hero.cta_text;
    }

    // Update features section
    const features = document.querySelector('.features');
    if (features) {
        const title = features.querySelector('h2');
        const description = features.querySelector('.section-description');
        const grid = features.querySelector('.features-grid');

        if (title) title.textContent = config.dedicated_hosting.features.title;
        if (description) description.textContent = config.dedicated_hosting.features.description;

        if (grid) {
            grid.innerHTML = config.dedicated_hosting.features.items.map(feature => `
                <div class="feature-card">
                    <i class="${feature.icon}"></i>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `).join('');
        }
    }

    // Update server plans section
    const serverList = document.querySelector('.server-list');
    if (serverList) {
        serverList.innerHTML = config.dedicated_hosting.servers.map(server => `
            <div class="server-item${server.popular ? ' premium' : ''}">
                ${server.popular ? '<div class="premium-tag">Most Popular</div>' : ''}
                <div class="server-name">
                    <h3>${server.name}</h3>
                    <div class="server-price">
                        <span class="amount" data-price="${server.price}">${server.price}</span>
                        <span>/${server.period}</span>
                    </div>
                </div>
                <div class="server-specs">
                    <div class="spec-item">
                        <i class="fas fa-microchip"></i>
                        <div class="spec-details">
                            <div class="spec-value cpu">${server.specs.cpu}</div>
                            <div class="spec-label">Processor</div>
                        </div>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-memory"></i>
                        <div class="spec-details">
                            <div class="spec-value ram">${server.specs.ram}</div>
                            <div class="spec-label">Memory</div>
                        </div>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-hdd"></i>
                        <div class="spec-details">
                            <div class="spec-value storage">${server.specs.storage}</div>
                            <div class="spec-label">Storage</div>
                        </div>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-network-wired"></i>
                        <div class="spec-details">
                            <div class="spec-value bandwidth">${server.specs.bandwidth}</div>
                            <div class="spec-label">Bandwidth</div>
                        </div>
                    </div>
                </div>
                <a href="${server.cta_url}" class="primary-btn cta-button">${server.cta_text}</a>
            </div>
        `).join('');
    }

    // Update currency formatting
    updateCurrencyDisplay();
}

// Update game hosting page
function updateGamePage(config) {
    if (!config.game_hosting) return;

    // Update hero section
    const hero = document.querySelector('.game-hero');
    if (hero) {
        const title = hero.querySelector('h1');
        const subtitle = hero.querySelector('p');
        const cta = hero.querySelector('.primary-btn');

        if (title) title.textContent = config.game_hosting.hero.title;
        if (subtitle) subtitle.textContent = config.game_hosting.hero.subtitle;
        if (cta) cta.textContent = config.game_hosting.hero.cta_text;
    }

    // Update features
    const features = document.querySelector('#features');
    if (features) {
        const title = features.querySelector('h2');
        const description = features.querySelector('.section-description');
        const grid = features.querySelector('.features-grid');

        if (title) title.textContent = config.game_hosting.features.title;
        if (description) description.textContent = config.game_hosting.features.description;
        if (grid) {
            grid.innerHTML = config.game_hosting.features.items.map(feature => `
                <div class="feature">
                    <i class="${feature.icon}"></i>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `).join('');
        }
    }

    // Update game servers
    const serverGrid = document.querySelector('.server-grid');
    if (serverGrid) {
        serverGrid.innerHTML = config.game_hosting.games.featured.map(game => `
            <div class="server-card ${game.name.toLowerCase()}">
                ${game.popular ? '<div class="popular-tag">Most Popular</div>' : ''}
                <div class="server-card-header">
                    <img src="${game.image}" alt="${game.name}">
                    <h3>${game.name}</h3>
                </div>
                <div class="server-card-body">
                    <ul class="server-features">
                        ${game.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div class="server-price">
                        <div class="price-amount">$${game.price}<span>/${game.unit}</span></div>
                        <div class="price-period">${game.period}</div>
                    </div>
                    <div class="buttons">
                        <button class="primary-btn">Deploy Server</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize configuration based on current page
async function initConfig() {
    const config = await loadConfig();
    if (!config) return;

    // Determine current page
    const path = window.location.pathname;
    
    if (path.includes('vps-hosting')) {
        updateVPSPage(config);
    } else if (path.includes('dedicated-hosting')) {
        updateDedicatedPage(config);
    } else if (path.includes('game-hosting')) {
        updateGamePage(config);
    } else {
        // Home page
        applySiteConfig(config);
    }
    
    // Common elements for all pages
    updateNavigation(config.navigation);
    updateFooter(config.footer, config.site);
    
    // Re-initialize interactive elements
    if (typeof initFaqAccordion === 'function') initFaqAccordion();
    if (typeof initShowMore === 'function') initShowMore();
    if (typeof initTestimonials === 'function') initTestimonials();
}

// Load configuration when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, loading configuration...');
    loadConfig();
}); 