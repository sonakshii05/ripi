/* ============================================================
   SONAKSHI PORTFOLIO — PREMIUM SCRIPT.JS
   ============================================================ */
'use strict';

// ============================================================
// THEME — init before paint to prevent flash
// ============================================================
(function () {
    const saved = localStorage.getItem('sonakshi-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
})();

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
function setupScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = docH > 0 ? `${(window.scrollY / docH) * 100}%` : '0%';
    }, { passive: true });
}

// ============================================================
// NAVBAR — glass on scroll + active link
// ============================================================
function setupNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);

        // Highlight active nav link
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
        });
    }, { passive: true });

    // Smooth scroll on desktop nav links
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ============================================================
// THEME TOGGLE
// ============================================================
function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    function syncIcon() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const thumb = btn.querySelector('.theme-toggle-thumb');
        if (thumb) thumb.textContent = isDark ? '🌙' : '☀️';
    }
    syncIcon();

    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('sonakshi-theme', next);
        syncIcon();
    });
}

// ============================================================
// MOBILE MENU
// ============================================================
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-menu');
    const overlay = document.getElementById('menuOverlay');
    if (!hamburger || !mobileMenu) return;

    function open() {
        mobileMenu.classList.add('open');
        overlay && overlay.classList.add('open');
        hamburger.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        mobileMenu.classList.remove('open');
        overlay && overlay.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () =>
        mobileMenu.classList.contains('open') ? close() : open()
    );
    closeBtn && closeBtn.addEventListener('click', close);
    overlay && overlay.addEventListener('click', close);

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            close();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300);
        });
    });
}

// ============================================================
// CUSTOM CURSOR
// ============================================================
function setupCursor() {
    const dot = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!dot || !follower) return;

    let fx = 0, fy = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
        cx = e.clientX; cy = e.clientY;
        dot.style.left = cx + 'px';
        dot.style.top = cy + 'px';
    });

    (function loop() {
        fx += (cx - fx) * 0.12;
        fy += (cy - fy) * 0.12;
        follower.style.left = fx + 'px';
        follower.style.top = fy + 'px';
        requestAnimationFrame(loop);
    })();

    const targets = 'a, button, .skill-card, .project-card, .contact-card, .timeline-content, .experience-content, input, textarea';
    document.addEventListener('mouseover', e => { if (e.target.closest(targets)) { dot.classList.add('hovered'); follower.classList.add('hovered'); } });
    document.addEventListener('mouseout', e => { if (e.target.closest(targets)) { dot.classList.remove('hovered'); follower.classList.remove('hovered'); } });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; follower.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; follower.style.opacity = '1'; });
}

// ============================================================
// PARTICLE CANVAS
// ============================================================
function setupParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [], raf;

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    class P {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.r = Math.random() * 1.4 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.28;
            this.vy = (Math.random() - 0.5) * 0.28;
            this.life = 0;
            this.max = Math.random() * 200 + 100;
            this.col = ['167,139,250', '56,189,248', '244,114,182'][Math.floor(Math.random() * 3)];
        }
        step() {
            this.x += this.vx; this.y += this.vy; this.life++;
            const mid = this.max / 2;
            this.a = this.life < mid ? (this.life / mid) * 0.45 : ((this.max - this.life) / mid) * 0.45;
            if (this.life >= this.max) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.col},${this.a})`;
            ctx.fill();
        }
    }

    function init(n = 75) {
        particles = [];
        for (let i = 0; i < n; i++) {
            const p = new P();
            p.life = Math.random() * p.max;
            particles.push(p);
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 95) {
                    const a = (1 - d / 95) * 0.07;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(167,139,250,${a})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        particles.forEach(p => { p.step(); p.draw(); });
        raf = requestAnimationFrame(animate);
    }

    new ResizeObserver(() => { resize(); init(); }).observe(canvas.parentElement);
    resize(); init(); animate();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else animate();
    });
}

// ============================================================
// ORB MOUSE PARALLAX
// ============================================================
function setupOrbParallax() {
    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;
    document.addEventListener('mousemove', e => {
        const dx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
        orbs.forEach((o, i) => {
            const f = (i + 1) * 14;
            o.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
        });
    });
}

// ============================================================
// SCROLL REVEAL  (IntersectionObserver)
// ============================================================
function setupScrollReveal() {
    const map = [
        { sel: '.section-label', cls: 'reveal' },
        { sel: '.section-title', cls: 'reveal' },
        { sel: '.intro-text', cls: 'reveal' },
        { sel: '.current-focus', cls: 'reveal' },
        { sel: '.important-question', cls: 'reveal' },
        { sel: '.hire-me-reason', cls: 'reveal' },
        { sel: '.currently-exploring', cls: 'reveal' },
        { sel: '.about-list', cls: 'reveal' },
        { sel: '.skill-card', cls: 'reveal' },
        { sel: '.skill-card-softskills', cls: 'reveal' },
        { sel: '.timeline-item', cls: 'reveal-left' },
        { sel: '.experience-item', cls: 'reveal-left' },
        { sel: '.project-card', cls: 'reveal' },
        { sel: '.contact-subtext', cls: 'reveal' },
        { sel: '.contact-card', cls: 'reveal' },
        { sel: '.footer-inner', cls: 'reveal' },
    ];

    map.forEach(({ sel, cls }) => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add(cls);
            if (i < 4) el.classList.add(`stagger-${i + 1}`);
        });
    });

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
}

// ============================================================
// SKILL BARS  (animate width on first view)
// ============================================================
function setupSkillBars() {
    const fills = document.querySelectorAll('.fill');
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('animated'); io.unobserve(e.target); }
        });
    }, { threshold: 0.5 });
    fills.forEach(f => io.observe(f));
}

// ============================================================
// 3D CARD TILT
// ============================================================
function setupCardTilt() {
    document.querySelectorAll('.project-card, .skill-card, .contact-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            const rX = -(y / r.height) * 6;
            const rY = (x / r.width) * 6;
            card.style.transform = `perspective(700px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
    });
}

// ============================================================
// SMOOTH SCROLL for all anchor links
// ============================================================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
}

// ============================================================
// IMAGE PARALLAX on profile photo
// ============================================================
function setupImageParallax() {
    const img = document.querySelector('.header-image');
    if (!img) return;
    window.addEventListener('scroll', () => {
        const offset = window.scrollY * 0.12;
        img.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
}

// ============================================================
// TYPING QUOTE EFFECT (subtle shimmer every few seconds)
// ============================================================
function setupQuoteHighlight() {
    const el = document.querySelector('.typing-text');
    if (!el) return;
    setInterval(() => {
        el.style.borderLeftColor = 'var(--accent-blue)';
        setTimeout(() => { el.style.borderLeftColor = 'var(--accent-purple)'; }, 1000);
    }, 4000);
}

// ============================================================
// AI CHATBOT
// ============================================================
function setupChat() {
    const fab = document.getElementById('chatFab');
    const win = document.getElementById('chatWindow');
    const closeBtn = document.getElementById('chatClose');
    const messagesEl = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    if (!fab || !win) return;

    // Conversation history for multi-turn context (max 10 turns kept by backend)
    let history = [];
    let isOpen = false;
    let isBusy = false;

    // ── Toggle open / close ──────────────────────────────
    function toggleChat() {
        isOpen = !isOpen;
        win.classList.toggle('open', isOpen);
        fab.classList.toggle('open', isOpen);

        if (isOpen) {
            // Inject welcome message once
            if (!messagesEl.querySelector('.chat-msg')) {
                appendBot("Hi! 👋 I'm Ripi, Sonakshi's AI assistant. Ask me anything about her skills, projects, or background!");
            }
            setTimeout(() => input.focus(), 350);
        }
    }

    fab.addEventListener('click', toggleChat);
    closeBtn && closeBtn.addEventListener('click', toggleChat);

    // Close on outside click
    document.addEventListener('click', e => {
        if (isOpen && !win.contains(e.target) && !fab.contains(e.target)) toggleChat();
    });

    // ── Send on Enter ────────────────────────────────────
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
    sendBtn.addEventListener('click', send);

    // ── Main send function ───────────────────────────────
    async function send() {
        const text = input.value.trim();
        if (!text || isBusy) return;

        isBusy = true;
        sendBtn.disabled = true;
        input.value = '';

        // Show user bubble
        appendUser(text);

        // Show typing indicator
        const typingId = appendTyping();

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history }),
            });

            const data = await res.json();
            removeTyping(typingId);

            if (data.reply) {
                appendBot(data.reply);
                // Record turn in history
                history.push(
                    { role: 'user', content: text },
                    { role: 'assistant', content: data.reply }
                );
                // Keep history manageable client-side too
                if (history.length > 20) history = history.slice(-20);
            } else {
                appendBot('Sorry, something went wrong. Please try again.');
            }
        } catch {
            removeTyping(typingId);
            appendBot('Network error — is the server running? Try refreshing.');
        }

        isBusy = false;
        sendBtn.disabled = false;
        input.focus();
    }

    // ── DOM helpers ──────────────────────────────────────
    function appendUser(text) {
        const msg = createBubble('user', escapeHtml(text));
        messagesEl.appendChild(msg);
        scrollToBottom();
    }

    function appendBot(text) {
        const msg = createBubble('bot', escapeHtml(text));
        messagesEl.appendChild(msg);
        scrollToBottom();
    }

    function createBubble(role, html) {
        const wrap = document.createElement('div');
        wrap.className = `chat-msg ${role}`;

        const icon = document.createElement('div');
        icon.className = 'msg-icon';
        icon.textContent = role === 'bot' ? '✨' : '🙂';

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = html;

        wrap.appendChild(icon);
        wrap.appendChild(bubble);
        return wrap;
    }

    function appendTyping() {
        const id = 'typing-' + Date.now();
        const wrap = document.createElement('div');
        wrap.className = 'chat-msg bot';
        wrap.id = id;

        const icon = document.createElement('div');
        icon.className = 'msg-icon';
        icon.textContent = '✨';

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';

        wrap.appendChild(icon);
        wrap.appendChild(bubble);
        messagesEl.appendChild(wrap);
        scrollToBottom();
        return id;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        });
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/\n/g, '<br>');
    }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    setupScrollProgress();
    setupNavbar();
    setupThemeToggle();
    setupMobileMenu();
    setupCursor();
    setupParticles();
    setupOrbParallax();
    setupScrollReveal();
    setupSkillBars();
    setupSmoothScroll();
    setupImageParallax();
    setupQuoteHighlight();
    setTimeout(setupCardTilt, 150);
    setupChat();
});
