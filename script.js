// --- AUDIO ENGINE ---
let audioCtx = null, isMusicPlaying = false;
function initAudio() {
    if (isMusicPlaying) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    playSynthLoop();
    isMusicPlaying = true;
}
function playSynthLoop() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(level <= 5 ? 55 : 73, audioCtx.currentTime); // Changes pitch based on level
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 1.5);
    setTimeout(playSynthLoop, score <= 20 ? 800 : 1500); // Speeds up when critical
}

// --- PARTICLES ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y;
        this.size = Math.random() * 6 + 2;
        this.speedX = Math.random() * 8 - 4;
        this.speedY = Math.random() * -12 - 4;
        this.gravity = 0.4; this.opacity = 1; this.color = color;
    }
    update() { this.speedY += this.gravity; this.x += this.speedX; this.y += this.speedY; this.opacity -= 0.02; }
    draw() { ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.size, this.size); }
}

function explode() {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    for (let i = 0; i < 40; i++) particles.push(new Particle(window.innerWidth/2, window.innerHeight/2, color));
}

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles = particles.filter(p => p.opacity > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();

// --- GAME LOGIC ---
let level = 1, score = 100, range = 10, target = 0, timerInterval = null, timeLeft = 100, streak = 0, hintUsedThisRound = false;

function setTheme(t) { document.body.className = t === 'neon' ? '' : 'theme-' + t; }

function checkCritical() {
    const overlay = document.getElementById('criticalEffect');
    const card = document.getElementById('gameCard');
    if (score <= 20 && score > 0) {
        overlay.classList.add('is-critical');
        card.classList.add('critical-card');
    } else {
        overlay.classList.remove('is-critical');
        card.classList.remove('critical-card');
    }
}

function getHint() {
    if (score <= 50) return updateMsg("Not enough points!", "var(--accent)");
    score -= 50; 
    hintUsedThisRound = true;
    streak = 0; // Streak breaks if you use a hint
    const low = Math.max(1, target - 2);
    const high = Math.min(range, target + 2);
    updateMsg(`Near ${low}-${high}`, "var(--gold)");
    refreshUI();
}

function startTimer() {
    clearInterval(timerInterval);
    let timePassed = 0;
    timerInterval = setInterval(() => {
        timePassed += 100;
        timeLeft = 100 - (timePassed / 10000 * 100);
        document.getElementById("timerBar").style.width = timeLeft + "%";
        if (timeLeft <= 0) gameOver("TIME EXPIRED!");
    }, 100);
}

function play() {
    initAudio();
    const input = document.getElementById("guessInput");
    const val = parseInt(input.value);
    if (isNaN(val)) return;

    if (val === target) {
        clearInterval(timerInterval);
        explode();
        if (!hintUsedThisRound) streak++;
        const multiplier = streak > 1 ? streak : 1;
        score += Math.round(timeLeft * multiplier);
        updateMsg(`WINNER! ${streak > 1 ? streak+'x Streak!' : ''}`, "var(--primary)");
        setTimeout(() => { level++; range += 10; nextRound(); }, 1200);
    } else {
        score -= 10;
        document.getElementById("gameCard").classList.add("shake");
        setTimeout(() => document.getElementById("gameCard").classList.remove("shake"), 300);
        updateMsg(val < target ? "HIGHER ⬆️" : "LOWER ⬇️", "white");
        if (score <= 0) gameOver("GAME OVER!");
    }
    checkCritical();
    refreshUI();
    input.value = "";
}

function gameOver(r) {
    clearInterval(timerInterval);
    streak = 0;
    updateMsg(r, "var(--accent)");
    setTimeout(() => { level=1; score=100; range=10; nextRound(); }, 2000);
}

function nextRound() {
    target = Math.floor(Math.random() * range) + 1;
    hintUsedThisRound = false;
    localStorage.setItem("highLevel", Math.max(level, localStorage.getItem("highLevel") || 1));
    checkCritical();
    refreshUI();
    startTimer();
}

function refreshUI() {
    document.getElementById("lvlDisplay").textContent = `Level ${level}`;
    document.getElementById("rangeDisp").textContent = `1-${range}`;
    document.getElementById("scoreDisp").textContent = score;
    document.getElementById("bestLevel").textContent = localStorage.getItem("highLevel") || 1;
    document.getElementById("streakDisplay").textContent = streak;
}

function updateMsg(t, c) { const m = document.getElementById("msg"); m.textContent = t; m.style.color = c; }

document.addEventListener("keypress", (e) => { if(e.key === "Enter") play(); });
nextRound();