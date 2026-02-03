
// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.getElementById('loading-progress');
const loadingText = document.getElementById('loading-text');
const mainContent = document.getElementById('main-content');
const visitorCountElement = document.getElementById('visitor-count');
const particlesContainer = document.getElementById('particles-container');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');

// NEW: Dark Mode Toggle elements
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeIcon = document.getElementById('dark-mode-icon');

// Loading screen messages
const loadingMessages = [
    'Initializing...',
    'Loading AWS services...',
    'Connecting to cloud...',
    'Fetching data...',
    'Almost ready...',
    'Welcome!'
];

// Create particles for loading screen
function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Loading screen animation
function startLoadingAnimation() {
    let progress = 0;
    let messageIndex = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(hideLoadingScreen, 800);
        }
        
        loadingProgress.style.width = progress + '%';
        
        // Update loading message
        if (messageIndex < loadingMessages.length - 1 && progress > (messageIndex + 1) * (100 / loadingMessages.length)) {
            messageIndex++;
            loadingText.textContent = loadingMessages[messageIndex];
        }
    }, 200);
}

// Hide loading screen and show main content
function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.classList.add('loaded');
        startMainAnimations();
    }, 800);
}

// Start main content animations
function startMainAnimations() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Start typing animation for tagline
    setTimeout(() => {
        const tagline = document.getElementById('animated-tagline');
        if (tagline) {
            typeWriter(tagline, tagline.textContent, 50);
        }
    }, 1000);
    
    // // Start visitor counter
    // setTimeout(() => {
    //     updateVisitorCount();
    // }, 1500);
    
    // Animate skill bars
    setTimeout(() => {
        animateSkillBars();
    }, 2000);
    
    // Animate progress bars
    setTimeout(() => {
        animateProgressBars();
    }, 2500);
}

// Typing animation function
function typeWriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const level = bar.getAttribute('data-level');
            bar.style.width = level + '%';
        }, index * 200);
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        }, index * 200);
    });
}

// // Visitor Counter Functions
// async function updateVisitorCount() {
//     try {
//         visitorCountElement.textContent = 'Loading...';
//         visitorCountElement.classList.add('loading');
        
//         const response = await fetch(API_URL, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         // Animate counter
//         animateCounter(visitorCountElement, 0, data.count, 1500);
//         visitorCountElement.classList.remove('loading');
        
//         console.log('Visitor count updated:', data.count);
        
//     } catch (error) {
//         console.error('Error fetching visitor count:', error);
//         visitorCountElement.textContent = 'Error loading count';
//         visitorCountElement.classList.remove('loading');
        
//         // Retry after 5 seconds
//         setTimeout(updateVisitorCount, 5000);
//     }
// }

// Animate counter with easing
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Final bounce effect
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    requestAnimationFrame(update);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Special animations for specific elements
            if (entry.target.classList.contains('skills-section')) {
                setTimeout(() => animateSkillBars(), 500);
            }
            
            if (entry.target.classList.contains('education-section')) {
                setTimeout(() => animateProgressBars(), 500);
            }
        }
    });
}, observerOptions);

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Navbar scroll effect
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile navigation toggle (add functionality here if needed)
function initMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active'); // Toggles the 'active' class
        navToggle.classList.toggle('open'); // Optional: adds 'open' class for animated hamburger icon
        document.body.classList.toggle('no-scroll'); // Optional: prevents scrolling when menu is open
    });

    // Close menu when a nav link is clicked (for smooth scrolling)
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    });
}

// Parallax effect for hero section content
function handleParallax() {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content'); // Target content within hero
    const heroVisual = document.querySelector('.hero-visual'); // Target avatar

    if (heroContent) {
        // Move the hero content upwards as you scroll down
        // This makes it appear to scroll out faster than the rest of the page.
        // Adjust the multiplier (e.g., -0.3) for desired speed.
        heroContent.style.transform = `translateY(-${scrolled * 0.3}px)`;

        // Optional: Add a parallax effect to the hero visual (avatar) as well
        // Make it move at a slightly different speed for depth
        if (heroVisual) {
            heroVisual.style.transform = `translateY(-${scrolled * 0.2}px)`;
        }
    }
}


// Add hover effects to interactive elements
function initHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-primary, .cta-secondary, .project-link');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for ripple animation
function addRippleCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Error handling for network issues
function initNetworkHandling() {
    window.addEventListener('online', function() {
        console.log('Connection restored, updating visitor count...');
        updateVisitorCount();
    });

    window.addEventListener('offline', function() {
        console.log('Connection lost');
        if (visitorCountElement) {
            visitorCountElement.textContent = 'Offline';
        }
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

// NEW: Dark Mode Functions
function setMode(mode) {
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeIcon.classList.remove('fa-sun');
        darkModeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    }
}

function toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
        setMode('light');
    } else {
        setMode('dark');
    }
}


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting Apple-style resume...');
    
    // Create particles for loading screen
    createParticles();
    
    // Start loading animation
    startLoadingAnimation();
    
    // Initialize other features
    initSmoothScrolling();
    initMobileNav();
    initHoverEffects();
    initNetworkHandling();
    initPerformanceMonitoring();
    
    // Add ripple CSS
    addRippleCSS();

    // NEW: Dark mode initialization on load
     const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        // If a theme preference is saved (e.g., 'light' or 'dark'), use it
        setMode(savedTheme);
    } else {
        // If no theme preference is saved, default to dark mode
        setMode('dark');
    }

    // Attach dark mode toggle listener
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
});

// Add scroll event listeners
window.addEventListener('scroll', function() {
    handleNavbarScroll();
    handleParallax(); // Call parallax on scroll
});

// Add resize event listener for responsive adjustments
window.addEventListener('resize', function() {
    // Handle responsive adjustments if needed
    console.log('Window resized');
});

// Easter egg - Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((key, index) => key === konamiSequence[index])) {
        
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
        
        console.log('🎉 Easter egg activated! Apple would be proud!');
    }
});

// Add rainbow animation CSS for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Add custom cursor effect for premium feel
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(0, 122, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none; /* Hidden by default */
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.display = 'block'; // Show on mouse move
    });
    
    document.addEventListener('mousedown', function() {
        cursor.style.transform = 'scale(0.8)';
    });
    
    document.addEventListener('mouseup', function() {
        cursor.style.transform = 'scale(1)';
    });
}

// Initialize custom cursor on desktop (adjust width as needed for tablet/mobile)
if (window.innerWidth > 768) {
    initCustomCursor();
}