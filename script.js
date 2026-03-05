// ==========================================
// Theme Switcher
// ==========================================
const themeToggles = document.querySelectorAll('[data-theme-toggle]');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to system preference
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

// Set theme
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    htmlElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');

    themeToggles.forEach((themeToggle) => {
        const sunIcon = themeToggle?.querySelector('.sun-icon');
        const moonIcon = themeToggle?.querySelector('.moon-icon');
        if (sunIcon && moonIcon) {
            sunIcon.classList.toggle('hidden', theme !== 'light');
            moonIcon.classList.toggle('hidden', theme !== 'dark');
        }
    });

    localStorage.setItem('theme', theme);
}

// Initialize theme
setTheme(getPreferredTheme());

// Toggle theme on button click
themeToggles.forEach((themeToggle) => {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'light' : 'dark');
    }
});

// ==========================================
// Language Switcher
// ==========================================
const langToggles = document.querySelectorAll('[data-lang-toggle]');
let currentLang = localStorage.getItem('language') || 'en';

// Translation data
const translations = {
    en: {
        langText: 'ع'
    },
    ar: {
        langText: 'EN'
    }
};

// Set language
function setLanguage(lang) {
    currentLang = lang;
    htmlElement.setAttribute('lang', lang);
    htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.body.classList.toggle('font-arabic', lang === 'ar');
    document.body.classList.toggle('font-sans', lang !== 'ar');
    localStorage.setItem('language', lang);
    
    // Update language toggle button
    langToggles.forEach((langToggle) => {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = translations[lang].langText;
        }
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(element => {
        if (lang === 'en' && element.hasAttribute('data-en')) {
            element.textContent = element.getAttribute('data-en');
        } else if (lang === 'ar' && element.hasAttribute('data-ar')) {
            element.textContent = element.getAttribute('data-ar');
        }
    });

    // Update input placeholders & select options
    updatePlaceholders(lang);
}

// Initialize language
setLanguage(currentLang);

// Toggle language on button click
langToggles.forEach((langToggle) => {
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    });
});

// ==========================================
// Navigation
// ==========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navBackdrop = document.getElementById('navBackdrop');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');

function openMobileMenu() {
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    navBackdrop?.classList.add('active');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navBackdrop?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
}

function toggleMobileMenu() {
    if (navMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
    navToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMobileMenu();
        }
    });
}

if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMobileMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        closeMobileMenu();
    }
});

// Header scroll effect
const updateHeaderOnScroll = () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', updateHeaderOnScroll);
window.addEventListener('load', updateHeaderOnScroll);

// ==========================================
// Smooth Scroll
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return; // skip PDF / external links
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Active Section Highlighting
// ==========================================
const sections = document.querySelectorAll('.section');
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to current section link
            const currentLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (currentLink) {
                currentLink.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// ==========================================
// Scroll Animations
// ==========================================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.glass-card, .service-card, .tool-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate-in');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// ==========================================
// External JSON Content (Services & Tools)
// ==========================================
const serviceIcons = {
    code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    page: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
    app: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`
};

function renderServices(services) {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid || !Array.isArray(services)) return;

    servicesGrid.innerHTML = services.map(service => {
        const title = currentLang === 'ar' ? service.titleAr : service.titleEn;
        const description = currentLang === 'ar' ? service.descriptionAr : service.descriptionEn;
        const iconSvg = serviceIcons[service.icon] || serviceIcons.code;

        return `
            <div class="glass-card p-8 rounded-3xl hover:scale-105 hover:shadow-2xl transition-all duration-300 group flex flex-col">
                <div class="w-16 h-16 mb-6 text-accent-gold group-hover:scale-110 transition-transform duration-300">
                    ${iconSvg}
                </div>
                <h3 class="text-2xl font-bold mb-4 text-white" data-en="${service.titleEn}" data-ar="${service.titleAr}">${title}</h3>
                <p class="text-white/70 leading-relaxed flex-1" data-en="${service.descriptionEn}" data-ar="${service.descriptionAr}">${description}</p>
            </div>
        `;
    }).join('');
}

function renderTools(tools) {
    const toolsGrid = document.getElementById('toolsGrid');
    if (!toolsGrid || !Array.isArray(tools)) return;

    toolsGrid.innerHTML = tools.map(tool => {
        const label = currentLang === 'ar' ? tool.nameAr : tool.nameEn;
        return `
            <div class="carousel-card-tool glass-card p-5 rounded-2xl text-center hover:scale-105 transition-transform duration-300 group flex flex-col items-center">
                <img src="${tool.icon}" alt="${tool.nameEn}" class="w-10 h-10 mb-3 group-hover:scale-110 transition-transform duration-300">
                <h3 class="text-white text-sm font-semibold leading-tight" data-en="${tool.nameEn}" data-ar="${tool.nameAr}">${label}</h3>
            </div>
        `;
    }).join('');
}

function renderProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid || !Array.isArray(projects)) return;

    projectsGrid.innerHTML = projects.map(project => {
        const name = currentLang === 'ar' ? project.nameAr : project.nameEn;
        const visitLabel = currentLang === 'ar' ? 'زيارة المشروع' : 'Visit Project';
        return `
            <div class="glass-card rounded-3xl overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group flex flex-col">
                <div class="relative overflow-hidden">
                    <img
                        src="${project.screenshot}"
                        alt="${project.nameEn}"
                        class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    >
                    <div class="hidden w-full aspect-video bg-white/5 items-center justify-center">
                        <svg class="w-16 h-16 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                    </div>
                </div>
                <div class="p-6 flex flex-col gap-4 flex-1">
                    <h3 class="text-xl font-bold text-white" data-en="${project.nameEn}" data-ar="${project.nameAr}">${name}</h3>
                    <a href="${project.url}" target="_blank" rel="noopener noreferrer"
                       class="mt-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary-dark font-semibold text-sm hover:scale-105 hover:shadow-lg hover:shadow-accent-gold/30 transition-all duration-300">
                        <span data-en="Visit Project" data-ar="زيارة المشروع">${visitLabel}</span>
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// Carousel – auto-scroll + arrow navigation
// ==========================================
function initCarousel(trackId, prevBtnId, nextBtnId, intervalMs = 3500) {
    const track   = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    if (!track || !prevBtn || !nextBtn) return;

    const getStep = () => {
        const card = track.firstElementChild;
        if (!card) return 220;
        const gap = parseFloat(getComputedStyle(track).gap) || 20;
        return card.offsetWidth + gap;
    };

    const scrollNext = () => {
        const { scrollLeft, scrollWidth, clientWidth } = track;
        if (scrollLeft + clientWidth >= scrollWidth - 4) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: getStep(), behavior: 'smooth' });
        }
    };

    const scrollPrev = () => {
        if (track.scrollLeft <= 4) {
            track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: -getStep(), behavior: 'smooth' });
        }
    };

    // RTL: flip direction
    const isRtl = () => document.documentElement.dir === 'rtl';
    prevBtn.addEventListener('click', () => isRtl() ? scrollNext() : scrollPrev());
    nextBtn.addEventListener('click', () => isRtl() ? scrollPrev() : scrollNext());

    let timer = setInterval(scrollNext, intervalMs);
    const pause = () => clearInterval(timer);
    const resume = () => { timer = setInterval(scrollNext, intervalMs); };

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend',   resume, { passive: true });
}

async function loadExternalContent() {
    try {
        const [servicesResponse, toolsResponse, projectsResponse, linksResponse] = await Promise.all([
            fetch('services.json'),
            fetch('mytools.json'),
            fetch('projects.json'),
            fetch('links.json')
        ]);

        if (!servicesResponse.ok || !toolsResponse.ok || !projectsResponse.ok || !linksResponse.ok) {
            throw new Error('Failed to load external JSON content');
        }

        const [services, tools, projects, links] = await Promise.all([
            servicesResponse.json(),
            toolsResponse.json(),
            projectsResponse.json(),
            linksResponse.json()
        ]);

        renderServices(services);
        renderTools(tools);
        renderProjects(projects);

        // Apply CV link
        const cvBtn = document.getElementById('cvBtn');
        if (cvBtn && links.cv) cvBtn.href = links.cv;

        // Apply services details link
        const servicesDetailsBtn = document.getElementById('servicesDetailsBtn');
        if (servicesDetailsBtn && links.servicesDetails) servicesDetailsBtn.href = links.servicesDetails;

        initCarousel('toolsGrid', 'toolsPrev', 'toolsNext', 3000);

        setLanguage(currentLang);
        animateOnScroll();
    } catch (error) {
        console.error('Error loading JSON content:', error);
    }
}

window.addEventListener('load', loadExternalContent);

// Update placeholders on language change
function updatePlaceholders(lang) {
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
        const key = lang === 'ar' ? 'data-placeholder-ar' : 'data-placeholder-en';
        if (el.hasAttribute(key)) {
            el.placeholder = el.getAttribute(key);
        }
    });
    // Update select options text
    document.querySelectorAll('select option[data-en]').forEach(opt => {
        if (lang === 'ar' && opt.hasAttribute('data-ar')) {
            opt.textContent = opt.getAttribute('data-ar');
        } else if (lang === 'en' && opt.hasAttribute('data-en')) {
            opt.textContent = opt.getAttribute('data-en');
        }
    });
}
