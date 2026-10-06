const $ = (selector) => document.querySelector(selector);
const welcome = $('#welcome');
const music = $('#bgMusic');
const musicToggle = $('#musicToggle');

// Create the 20-photo gallery. Replace files in /images while keeping these names.
const gallery = $('#gallery');
for (let i = 1; i <= 20; i++) {
  const figure = document.createElement('figure');
  figure.className = 'memory-card reveal';
  const img = document.createElement('img');
  img.src = `images/photo${i}.jpg`;
  img.alt = `Beautiful memory ${i} with Kannamma`;
  img.loading = 'lazy';
  img.onerror = () => {
    // Stylish offline fallback shown until you add your own photo.
    const hue = 325 + (i % 4) * 12;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${i % 3 === 0 ? 1100 : 900}" viewBox="0 0 800 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue},45%,22%)"/><stop offset="1" stop-color="hsl(${hue + 35},45%,9%)"/></linearGradient></defs><rect width="800" height="900" fill="url(#g)"/><circle cx="${180 + i * 17 % 420}" cy="300" r="190" fill="hsla(${hue},75%,75%,.10)"/><text x="400" y="430" text-anchor="middle" fill="#ffd6e2" font-family="Georgia" font-size="64">Memory ${String(i).padStart(2, '0')}</text><text x="400" y="490" text-anchor="middle" fill="#c9a8b6" font-family="Arial" font-size="24">Replace images/photo${i}.jpg</text><text x="400" y="570" text-anchor="middle" fill="#ff9fbd" font-size="55">♡</text></svg>`;
    img.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };
  figure.innerHTML = `<figcaption><span>Memory ${String(i).padStart(2, '0')}</span></figcaption>`;
  figure.prepend(img);
  figure.addEventListener('click', () => openLightbox(img.src));
  gallery.appendChild(figure);
}

function tryPlayMusic() {
  music.volume = 0.35;
  music.play().then(() => musicToggle.classList.add('playing')).catch(() => {});
}

$('#enterBtn').addEventListener('click', () => {
  welcome.classList.add('hidden');
  document.body.classList.remove('locked');
  tryPlayMusic();
  setTimeout(() => welcome.remove(), 1100);
});

document.body.classList.add('locked');
musicToggle.addEventListener('click', () => {
  if (music.paused) tryPlayMusic();
  else { music.pause(); musicToggle.classList.remove('playing'); }
});

// Countdown to Kannamma's 22nd birthday: 16 October 2026.
const birthday = new Date('2026-10-16T00:00:00+05:30').getTime();
function updateCountdown() {
  const distance = birthday - Date.now();
  if (distance <= 0) {
    $('#countdown').innerHTML = '<div><strong>It’s time!</strong><span>Happy Birthday Kannamma ❤️</span></div>';
    return;
  }
  $('#days').textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
  $('#hours').textContent = String(Math.floor(distance / 3600000) % 24).padStart(2, '0');
  $('#minutes').textContent = String(Math.floor(distance / 60000) % 60).padStart(2, '0');
  $('#seconds').textContent = String(Math.floor(distance / 1000) % 60).padStart(2, '0');
}
updateCountdown(); setInterval(updateCountdown, 1000);

// Reveal elements while scrolling.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// Photo lightbox.
function openLightbox(src) { $('#lightboxImg').src = src; $('#lightbox').classList.add('open'); }
function closeLightbox() { $('#lightbox').classList.remove('open'); }
$('#closeLightbox').addEventListener('click', closeLightbox);
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') closeLightbox(); });

// Light floating hearts.
function createParticle() {
  if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const p = document.createElement('span');
  p.className = 'particle'; p.textContent = Math.random() > .3 ? '♡' : '✦';
  p.style.left = `${Math.random() * 100}%`;
  p.style.fontSize = `${10 + Math.random() * 16}px`;
  p.style.animationDuration = `${8 + Math.random() * 8}s`;
  $('#particles').appendChild(p); setTimeout(() => p.remove(), 17000);
}
setInterval(createParticle, 900);

// Final surprise and confetti.
function launchConfetti() {
  const colors = ['#ff7f9f','#ffc1d2','#fff4d6','#8e6ac4','#ffffff'];
  for (let i = 0; i < 110; i++) {
    const c = document.createElement('i'); c.className = 'confetti';
    c.style.left = `${Math.random() * 100}vw`; c.style.background = colors[i % colors.length];
    c.style.setProperty('--drift', `${(Math.random() - .5) * 280}px`);
    c.style.animationDuration = `${2.8 + Math.random() * 3}s`; c.style.animationDelay = `${Math.random() * .7}s`;
    document.body.appendChild(c); setTimeout(() => c.remove(), 7000);
  }
}
$('#surpriseBtn').addEventListener('click', () => { $('#surpriseModal').classList.add('open'); launchConfetti(); });
$('#closeSurprise').addEventListener('click', () => $('#surpriseModal').classList.remove('open'));
$('#surpriseModal').addEventListener('click', e => { if (e.target.id === 'surpriseModal') $('#surpriseModal').classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLightbox(); $('#surpriseModal').classList.remove('open'); } });
