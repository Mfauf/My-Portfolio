// ==========================================
// Theme Switcher
// ==========================================
const themeToggle = document.getElementById('themeToggle');
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

    const sunIcon = themeToggle?.querySelector('.sun-icon');
    const moonIcon = themeToggle?.querySelector('.moon-icon');
    if (sunIcon && moonIcon) {
        sunIcon.classList.toggle('hidden', theme !== 'light');
        moonIcon.classList.toggle('hidden', theme !== 'dark');
    }

    localStorage.setItem('theme', theme);
}

// Initialize theme
setTheme(getPreferredTheme());

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
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
const langToggle = document.getElementById('langToggle');
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
    langToggle.querySelector('.lang-text').textContent = translations[lang].langText;
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(element => {
        if (lang === 'en' && element.hasAttribute('data-en')) {
            element.textContent = element.getAttribute('data-en');
        } else if (lang === 'ar' && element.hasAttribute('data-ar')) {
            element.textContent = element.getAttribute('data-ar');
        }
    });
}

// Initialize language
setLanguage(currentLang);

// Toggle language on button click
langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
});

// ==========================================
// Navigation
// ==========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==========================================
// Smooth Scroll
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
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
