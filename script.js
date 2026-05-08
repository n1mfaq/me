// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Copy wallet / card buttons
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
        // Strip spaces from card numbers when copying
        const text = /^\d[\d\s]+\d$/.test(raw) ? raw.replace(/\s+/g, '') : raw;
        const ok = await copyText(text);
        showToast(ok ? 'Copied to clipboard' : 'Copy failed');
    });
});

// Animated cyber-grid background
const canvas = document.getElementById('bg-grid');
const ctx = canvas.getContext('2d');
let w, h;

function resize() {
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
}
resize();
window.addEventListener('resize', resize);

let t = 0;
function draw() {
    ctx.clearRect(0, 0, w, h);

    const horizon = h * 0.55;
    const spacing = 60 * devicePixelRatio;
    const speed = 0.6 * devicePixelRatio;

    ctx.lineWidth = 1 * devicePixelRatio;

    // Horizontal lines (perspective)
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

    // Vertical lines (perspective)
    const cx = w / 2;
    for (let i = -20; i <= 20; i++) {
        const x = cx + i * spacing;
        ctx.strokeStyle = 'rgba(255, 43, 214, 0.25)';
        ctx.beginPath();
        ctx.moveTo(cx, horizon);
        ctx.lineTo(x, h);
        ctx.stroke();
    }

    t += 1;
    requestAnimationFrame(draw);
}
draw();
