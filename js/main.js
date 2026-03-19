/**
 * KAGURA - EXORCIST VTUBER WEBSITE
 * Main JavaScript File
 */

// ========================================
// CUSTOM CURSOR
// ========================================
const cursor = document.querySelector('.cursor-cross');
const cursorCross = document.querySelector('.cross-hair');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

// Check if device supports hover (not touch)
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (!isTouchDevice && cursor) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor follow
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .folder, .gallery-item, .nav-toggle');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// ========================================
// PARTICLE SYSTEM
// ========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas?.getContext('2d');

let particles = [];
const particleCount = isTouchDevice ? 25 : 50;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? '#e03d3d' : '#ff1a1a';
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            this.x -= dx * 0.02;
            this.y -= dy * 0.02;
        }
        
        if (this.y < -10) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
    }
}

function initParticles() {
    if (!canvas || !ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        const particle = new Particle();
        particle.y = Math.random() * canvas.height;
        particles.push(particle);
    }
}

function animateParticles() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

if (canvas && ctx) {
    initParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========================================
// NAVIGATION
// ========================================
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

// Scroll effect for navigation
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// FOLDER INTERACTIONS & RITUAL EFFECT
// ========================================
const folders = document.querySelectorAll('.folder');
const ritualOverlay = document.querySelector('.ritual-overlay');
const commissionDetails = document.querySelectorAll('.commission-details');
const closeButtons = document.querySelectorAll('.close-detail');

// Folder click handler
folders.forEach(folder => {
    folder.addEventListener('click', () => {
        const folderId = folder.dataset.folder;
        
        // Play ritual animation
        playRitualEffect(() => {
            // Show commission details after ritual
            const detail = document.getElementById(`detail-${folderId}`);
            if (detail) {
                detail.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
});

// Ritual effect function
function playRitualEffect(callback) {
    if (!ritualOverlay) {
        callback();
        return;
    }
    
    ritualOverlay.classList.add('active');
    
    // Create ritual particles
    createRitualParticles();
    
    // Play sound effect (optional - would need audio file)
    // const ritualSound = new Audio('sounds/ritual.mp3');
    // ritualSound.play();
    
    setTimeout(() => {
        ritualOverlay.classList.remove('active');
        if (callback) callback();
    }, 2000);
}

// Create ritual particles
function createRitualParticles() {
    const particlesContainer = document.querySelector('.ritual-particles');
    if (!particlesContainer) return;
    
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: #e03d3d;
            border-radius: 50%;
            left: 50%;
            top: 50%;
            box-shadow: 0 0 20px #e03d3d;
            animation: ritual-particle-${i} 2s ease-out forwards;
        `;
        
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 200 + Math.random() * 200;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ritual-particle-${i} {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                50% {
                    transform: translate(calc(-50% + ${tx * 0.5}px), calc(-50% + ${ty * 0.5}px)) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        particlesContainer.appendChild(particle);
    }
}

// Close detail modals
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const detail = btn.closest('.commission-details');
        if (detail) {
            detail.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close modal on background click
commissionDetails.forEach(detail => {
    detail.addEventListener('click', (e) => {
        if (e.target === detail) {
            detail.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Order button click
document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Scroll to contact section
        document.getElementById('contact').scrollIntoView({
            behavior: 'smooth'
        });
        
        // Close modal
        const detail = btn.closest('.commission-details');
        if (detail) {
            detail.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ========================================
// SCROLL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate stats counter
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements for fade-in
document.querySelectorAll('.fade-in, .stat-number, .section-header, .about-content, .gallery-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

// ========================================
// PARALLAX EFFECTS
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax for hero image
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Parallax for magical circle
    const magicalCircle = document.querySelector('.magical-circle');
    if (magicalCircle) {
        magicalCircle.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.1}deg)`;
    }
    
    // Gallery column parallax
    const column2 = document.querySelector('.column-2');
    if (column2) {
        const rect = column2.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            column2.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
    }
});

// ========================================
// GLITCH TEXT EFFECT
// ========================================
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    setInterval(() => {
        glitchText.style.textShadow = `
            ${Math.random() * 4 - 2}px 0 #8b1a1a,
            ${Math.random() * 4 - 2}px 0 #ff1a1a
        `;
        
        setTimeout(() => {
            glitchText.style.textShadow = '2px 0 #8b1a1a, -2px 0 #ff1a1a';
        }, 100);
    }, 3000);
}

// ========================================
// CONTACT FORM
// ========================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('span').textContent;
        
        // Animate button
        submitBtn.querySelector('span').textContent = 'Summoning...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.querySelector('span').textContent = 'Message Sent!';
            submitBtn.style.background = '#4CAF50';
            submitBtn.style.borderColor = '#4CAF50';
            
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 2000);
        }, 1500);
    });
}

// ========================================
// CHARACTER BANNER ANIMATION
// ========================================
const bannerChars = document.querySelectorAll('.banner-char');
bannerChars.forEach((char, index) => {
    char.style.animationDelay = `${index * 0.2}s`;
    
    // Floating animation
    setInterval(() => {
        const offset = Math.sin(Date.now() * 0.001 + index) * 5;
        char.style.transform = `translateY(${offset}px)`;
    }, 50);
});

// ========================================
// MAGICAL CIRCLE ROTATION
// ========================================
const magicalCircles = document.querySelectorAll('.magical-circle svg, .circle-rotate, .circle-rotate-reverse');

// ========================================
// IMAGE HOVER EFFECTS
// ========================================
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        // Add energy border effect
        const border = document.createElement('div');
        border.className = 'energy-border';
        border.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border: 2px solid #e03d3d;
            border-radius: 12px;
            pointer-events: none;
            animation: energy-pulse 1s ease-in-out infinite;
            z-index: 3;
        `;
        item.appendChild(border);
    });
    
    item.addEventListener('mouseleave', () => {
        const border = item.querySelector('.energy-border');
        if (border) border.remove();
    });
});

// Add energy pulse animation
const energyStyle = document.createElement('style');
energyStyle.textContent = `
    @keyframes energy-pulse {
        0%, 100% { 
            box-shadow: 0 0 10px #e03d3d, inset 0 0 10px #e03d3d;
            opacity: 0.8;
        }
        50% { 
            box-shadow: 0 0 30px #e03d3d, inset 0 0 20px #e03d3d;
            opacity: 1;
        }
    }
`;
document.head.appendChild(energyStyle);

// ========================================
// 3D TILT EFFECT FOR FOLDERS
// ========================================
folders.forEach(folder => {
    folder.addEventListener('mousemove', (e) => {
        const rect = folder.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        folder.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    folder.addEventListener('mouseleave', () => {
        folder.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ========================================
// VIDEO SECTION FUNCTIONALITY - LOCAL PLAYER
// ========================================
const mainVideoPlayer = document.getElementById('main-video-player');
const ritualPlayBtn = document.getElementById('ritual-play');
const videoControlsOverlay = document.querySelector('.video-controls-overlay');
const playerFrame = document.querySelector('.player-frame');
const currentVideoTitle = document.getElementById('current-video-title');
const videoCards = document.querySelectorAll('.video-card');

// Ritual play button - toggle play/pause
if (ritualPlayBtn && mainVideoPlayer) {
    ritualPlayBtn.addEventListener('click', () => {
        playRitualEffect(() => {
            if (mainVideoPlayer.paused) {
                mainVideoPlayer.play();
                playerFrame.classList.add('playing');
            } else {
                mainVideoPlayer.pause();
                playerFrame.classList.remove('playing');
            }
        });
    });
}

// Video player events
if (mainVideoPlayer) {
    // When video starts playing
    mainVideoPlayer.addEventListener('play', () => {
        playerFrame.classList.add('playing');
    });
    
    // When video pauses
    mainVideoPlayer.addEventListener('pause', () => {
        playerFrame.classList.remove('playing');
    });
    
    // When video ends
    mainVideoPlayer.addEventListener('ended', () => {
        playerFrame.classList.remove('playing');
    });
    
    // Click on video to toggle play/pause
    mainVideoPlayer.addEventListener('click', () => {
        if (mainVideoPlayer.paused) {
            mainVideoPlayer.play();
        } else {
            mainVideoPlayer.pause();
        }
    });
}

// Video cards click handler - load video
videoCards.forEach(card => {
    card.addEventListener('click', () => {
        const videoSrc = card.dataset.video;
        const videoTitle = card.dataset.title;
        
        if (videoSrc && mainVideoPlayer) {
            // Remove active class from all cards
            videoCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            // Play ritual effect then load video
            playRitualEffect(() => {
                // Update video source
                mainVideoPlayer.src = videoSrc;
                mainVideoPlayer.load();
                
                // Update title
                if (currentVideoTitle && videoTitle) {
                    currentVideoTitle.textContent = videoTitle;
                }
                
                // Auto play
                mainVideoPlayer.play().catch(e => {
                    console.log('Auto-play prevented:', e);
                });
                
                // Scroll to player
                document.querySelector('.video-player-container').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            });
        }
    });
});

// Live status pulse animation (if exists)
const liveDot = document.querySelector('.live-dot');
if (liveDot) {
    setInterval(() => {
        liveDot.style.boxShadow = `0 0 ${10 + Math.random() * 10}px #ff0000`;
    }, 500);
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Initialize animations
    initParticles();
    
    // Trigger hero animations
    setTimeout(() => {
        document.querySelectorAll('.title-char').forEach((char, i) => {
            setTimeout(() => {
                char.style.opacity = '1';
            }, i * 50);
        });
    }, 500);
    
    console.log('%c☠ KAGURA - Exorcist VTuber ☠', 'color: #e03d3d; font-size: 20px; font-weight: bold;');
    console.log('%cWelcome to the digital realm...', 'color: #999; font-size: 12px;');
});

// ========================================
// KEYBOARD NAVIGATION
// ========================================
document.addEventListener('keydown', (e) => {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        commissionDetails.forEach(detail => {
            detail.classList.remove('active');
        });
        document.body.style.overflow = '';
        
        // Close video modal
        closeVideoModal();
        
        // Close mobile menu
        if (navLinks) {
            navLinks.classList.remove('active');
        }
    }
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive animations
        particles = [];
    } else {
        // Resume animations
        initParticles();
    }
});
