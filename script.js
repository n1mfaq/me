/* ==========================================================
   Sevastiian — landing FX
   ========================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Year
document.getElementById('year').textContent = new Date().getFullYear();

/* === Boot intro === */
(() => {
    const boot = document.getElementById('boot');
    const target = document.getElementById('boot-text');
    if (!boot || !target) return;

    if (prefersReducedMotion) {
        boot.classList.add('done');
        return;
    }

    const lines = [
        '> booting sevastiian.os v9.2 ...',
        '> loading kernel modules ............ [ ok ]',
        '> mounting /dev/neon ................ [ ok ]',
        '> establishing uplink to mainframe .. [ ok ]',
        '> spawning shell .................... [ ok ]',
        '> ready_'
    ];

    let li = 0, ci = 0;
    const tick = () => {
        if (li >= lines.length) {
            setTimeout(() => boot.classList.add('done'), 280);
            return;
        }
        target.textContent += lines[li][ci] ?? '';
        ci++;
        if (ci > lines[li].length) {
            target.textContent += '\n';
            li++;
            ci = 0;
            setTimeout(tick, 90);
        } else {
            setTimeout(tick, 14 + Math.random() * 22);
        }
    };
    tick();
})();

/* === Typewriter subtitle === */
(() => {
    const el = document.getElementById('subtitle-text');
    if (!el) return;
    const phrases = [
        'Senior Full-Stack Developer',
        'C# / .NET · React 19',
        'Microsoft Orleans · .NET Aspire',
        'distributed systems architect',
        'shipping to production'
    ];
    let pi = 0, ci = 0, deleting = false;

    const step = () => {
        const phrase = phrases[pi];
        if (!deleting) {
            ci++;
            el.textContent = phrase.slice(0, ci);
            if (ci === phrase.length) {
                deleting = true;
                return setTimeout(step, 1600);
            }
            setTimeout(step, 55 + Math.random() * 35);
        } else {
            ci--;
            el.textContent = phrase.slice(0, ci);
            if (ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
                return setTimeout(step, 350);
            }
            setTimeout(step, 25);
        }
    };
    setTimeout(step, prefersReducedMotion ? 0 : 1800);
})();

/* === Scroll progress === */
(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
})();

/* === Reveal on scroll === */
(() => {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
        targets.forEach((t) => t.classList.add('in-view'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add('in-view');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    targets.forEach((t) => io.observe(t));

    // Stagger index for skill chips
    document.querySelectorAll('.skills-grid').forEach((grid) => {
        [...grid.children].forEach((el, i) => el.style.setProperty('--i', i));
    });

    // Inject shimmer line into trait cards
    document.querySelectorAll('.trait-card').forEach((card) => {
        const shimmer = document.createElement('span');
        shimmer.className = 'shimmer';
        card.appendChild(shimmer);
    });
})();

/* === Stats count-up === */
(() => {
    const stats = document.querySelectorAll('.stat-value[data-target]');
    if (!stats.length || !('IntersectionObserver' in window)) {
        stats.forEach((el) => {
            el.textContent = el.dataset.target + (el.dataset.suffix || '');
        });
        return;
    }
    const animate = (el) => {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const value = Math.round(target * eased);
            el.textContent = value + suffix;
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = target + suffix;
        };
        requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                animate(e.target);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach((el) => io.observe(el));
})();

/* === 3D tilt === */
(() => {
    if (prefersReducedMotion) return;
    document.querySelectorAll('.tilt').forEach((el) => {
        let raf = 0;
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                el.style.setProperty('--tilt-y', ((x - 0.5) * 8).toFixed(2) + 'deg');
                el.style.setProperty('--tilt-x', ((0.5 - y) * 8).toFixed(2) + 'deg');
                el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
                el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
            });
        };
        const reset = () => {
            el.style.setProperty('--tilt-x', '0deg');
            el.style.setProperty('--tilt-y', '0deg');
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', reset);
    });
})();

/* === Magnetic buttons === */
(() => {
    if (prefersReducedMotion) return;
    document.querySelectorAll('.magnetic').forEach((btn) => {
        const strength = 0.35;
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2);
            const y = e.clientY - (r.top + r.height / 2);
            btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
})();

/* === Button ripple === */
(() => {
    document.querySelectorAll('.btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const r = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(r.width, r.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });
    });
})();

/* === Cursor glow === */
(() => {
    if (prefersReducedMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    document.body.classList.add('cursor-active');
    window.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
    });
    const tick = () => {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
    };
    tick();
})();

/* === Glitch burst on hero === */
(() => {
    const el = document.querySelector('.glitch');
    if (!el || prefersReducedMotion) return;
    setInterval(() => {
        el.style.filter = 'hue-rotate(120deg) saturate(1.4)';
        el.style.transform = 'translate(' + ((Math.random() - 0.5) * 6).toFixed(1) + 'px, ' + ((Math.random() - 0.5) * 4).toFixed(1) + 'px) skewX(' + ((Math.random() - 0.5) * 6).toFixed(1) + 'deg)';
        setTimeout(() => {
            el.style.filter = '';
            el.style.transform = '';
        }, 90);
    }, 4500 + Math.random() * 2500);
})();

/* === Copy wallet / card buttons === */
const toast = document.getElementById('toast');

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch {
            return false;
        }
    }
}

document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', async () => {
        const target = document.getElementById(btn.dataset.copyTarget);
        if (!target) return;
        const raw = target.textContent.trim();
        const text = /^\d[\d\s]+\d$/.test(raw) ? raw.replace(/\s+/g, '') : raw;
        const ok = await copyText(text);
        showToast(ok ? '✓ Copied to clipboard' : '✗ Copy failed');
    });
});

/* === Animated synthwave grid (perspective) === */
(() => {
    const canvas = document.getElementById('bg-grid');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        w = canvas.width = window.innerWidth * dpr;
        h = canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        canvas.dpr = dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
        const dpr = canvas.dpr;
        ctx.clearRect(0, 0, w, h);

        const horizon = h * 0.55;
        const spacing = 60 * dpr;
        const speed = 0.6 * dpr;

        ctx.lineWidth = 1 * dpr;

        for (let i = 0; i < 30; i++) {
            const z = ((i * spacing + t * speed) % (spacing * 30));
            const y = horizon + (z * z) / (h * 0.6);
            if (y > h) continue;
            const alpha = Math.min(0.6, z / (spacing * 10));
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        const cx = w / 2;
        for (let i = -20; i <= 20; i++) {
            const x = cx + i * spacing;
            ctx.strokeStyle = 'rgba(255, 43, 214, 0.25)';
            ctx.beginPath();
            ctx.moveTo(cx, horizon);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        if (!prefersReducedMotion) t += 1;
        requestAnimationFrame(draw);
    };
    draw();
})();

/* === Matrix rain === */
(() => {
    const canvas = document.getElementById('bg-matrix');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@*+<>{};:.アイウエオカキクケコサシスセソタチツテト'.split('');
    let cols = 0, drops = [];
    const fontSize = 16;

    const resize = () => {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(dpr, dpr);
        cols = Math.ceil(window.innerWidth / fontSize);
        drops = Array.from({ length: cols }, () => Math.random() * -50);
    };
    resize();
    window.addEventListener('resize', resize);

    ctx.font = `${fontSize}px JetBrains Mono, monospace`;

    let last = 0;
    const tick = (now) => {
        if (now - last > 60) {
            last = now;
            ctx.fillStyle = 'rgba(7, 7, 13, 0.18)';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            for (let i = 0; i < drops.length; i++) {
                const ch = chars[(Math.random() * chars.length) | 0];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // head — bright pink
                ctx.fillStyle = 'rgba(255, 43, 214, 0.95)';
                ctx.fillText(ch, x, y);
                // trail — cyan
                if (drops[i] > 1) {
                    ctx.fillStyle = 'rgba(0, 240, 255, 0.55)';
                    ctx.fillText(chars[(Math.random() * chars.length) | 0], x, y - fontSize);
                }

                if (y > window.innerHeight && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
})();
