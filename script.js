// ---- floating heart balloons ----
const scene = document.getElementById('scene');
const balloonColors = ['#e84c88', '#f4c869', '#f2a6c6', '#c22e69'];

function heartSVG(color){
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 88 C20 65, 5 45, 5 28 C5 12, 18 2, 32 2 C42 2, 50 8, 50 18 C50 8, 58 2, 68 2 C82 2, 95 12, 95 28 C95 45, 80 65, 50 88 Z" fill="${color}"/>
    <line x1="50" y1="88" x2="50" y2="118" stroke="${color}" stroke-width="2" opacity="0.6"/>
  </svg>`;
}

function spawnBalloon(){
  const b = document.createElement('div');
  b.className = 'balloon';
  const color = balloonColors[Math.floor(Math.random()*balloonColors.length)];
  b.innerHTML = heartSVG(color);
  const size = 40 + Math.random()*40;
  b.style.width = size + 'px';
  b.style.height = (size*0.95) + 'px';
  b.style.left = (Math.random()*94) + 'vw';
  b.style.animationDuration = (9 + Math.random()*7) + 's';
  b.style.animationDelay = (Math.random()*2) + 's';
  scene.appendChild(b);
  setTimeout(() => b.remove(), 18000);
}

for(let i=0;i<6;i++) setTimeout(spawnBalloon, i*700);
setInterval(spawnBalloon, 1400);

// ---- dodging No button ----
const noBtn = document.getElementById('noBtn');
const buttonRow = document.getElementById('buttonRow');
const yesBtn = document.getElementById('yesBtn');
let dodgeCount = 0;
const teases = ["Nice try 😏","Are you sure?","Really?","Come on...","Nope!","Try again 💕"];

function dodge(){
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;
  const maxX = window.innerWidth - btnW - 20;
  const maxY = window.innerHeight - btnH - 20;
  const newX = Math.max(20, Math.random()*maxX);
  const newY = Math.max(20, Math.random()*maxY);

  const currentRect = noBtn.getBoundingClientRect();
  noBtn.style.position = 'fixed';
  noBtn.style.left = currentRect.left + 'px';
  noBtn.style.top = currentRect.top + 'px';
  noBtn.style.transform = 'none';
  noBtn.offsetHeight; // force reflow so the transition has a starting point

  requestAnimationFrame(() => {
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
  });

  dodgeCount++;
  if(dodgeCount <= teases.length){
    noBtn.textContent = teases[dodgeCount-1];
  }
  // grow yes button a little each time, for fun
  const scale = Math.min(1.35, 1 + dodgeCount*0.04);
  yesBtn.style.transform = `scale(${scale})`;
}

noBtn.addEventListener('mouseenter', dodge);
noBtn.addEventListener('click', (e)=>{ e.preventDefault(); dodge(); });
noBtn.addEventListener('touchstart', (e)=>{ e.preventDefault(); dodge(); }, {passive:false});

// ---- Yes flow ----
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const closeX = document.getElementById('closeX');
const places = document.querySelectorAll('.place');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const confirmBtn = document.getElementById('confirmBtn');
const planStep = document.getElementById('planStep');
const resultStep = document.getElementById('resultStep');
const summaryBox = document.getElementById('summaryBox');

let selectedPlace = null;

function checkReady(){
  confirmBtn.disabled = !(selectedPlace && dateInput.value && timeInput.value);
}

places.forEach(p => {
  p.addEventListener('click', () => {
    places.forEach(x => x.classList.remove('selected'));
    p.classList.add('selected');
    selectedPlace = p.dataset.place;
    checkReady();
  });
});

dateInput.addEventListener('change', checkReady);
timeInput.addEventListener('change', checkReady);

yesBtn.addEventListener('click', () => {
  overlay.classList.add('show');
});

closeX.addEventListener('click', () => {
  overlay.classList.remove('show');
});
overlay.addEventListener('click', (e) => {
  if(e.target === overlay) overlay.classList.remove('show');
});

function formatDate(d){
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}
function formatTime(t){
  const [h,m] = t.split(':');
  const dt = new Date();
  dt.setHours(+h, +m);
  return dt.toLocaleTimeString(undefined, { hour:'numeric', minute:'2-digit' });
}

confirmBtn.addEventListener('click', () => {
  if(confirmBtn.disabled) return;
  planStep.style.display = 'none';
  resultStep.classList.add('show');
  summaryBox.innerHTML = `
    💗 <b>Place:</b> ${selectedPlace}<br>
    📅 <b>Date:</b> ${formatDate(dateInput.value)}<br>
    🕒 <b>Time:</b> ${formatTime(timeInput.value)}
  `;
});