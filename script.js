// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Copy wallet
const copyBtn = document.getElementById('copy-btn');
const walletEl = document.getElementById('wallet');
const toast = document.getElementById('toast');

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
}

copyBtn.addEventListener('click', async () => {
    const text = walletEl.textContent.trim();
    try {
        await navigator.clipboard.writeText(text);
        showToast('Адрес скопирован');
    } catch {
        const range = document.createRange();
        range.selectNode(walletEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try {
            document.execCommand('copy');
            showToast('Адрес скопирован');
        } catch {
            showToast('Не удалось скопировать');
        }
        sel.removeAllRanges();
    }
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
