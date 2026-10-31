const board = document.querySelector('#board');
const echoMove = document.querySelector('#echoMove');
const playerMove = document.querySelector('#playerMove');
const toast = document.querySelector('#toast');

const walls = new Set(['1,1','1,3','2,1','3,3']);
const exits = new Set(['0,4','4,0']);
const moves = [
  {p:[0,1],e:[0,0],pm:'→',em:'·'},
  {p:[0,2],e:[0,0],pm:'↓',em:'·'},
  {p:[1,2],e:[0,1],pm:'↓',em:'→'},
  {p:[2,2],e:[0,1],pm:'→',em:'↓'},
  {p:[2,3],e:[1,1],pm:'↓',em:'↓'},
  {p:[3,3],e:[1,2],pm:'←',em:'→'},
  {p:[3,2],e:[2,2],pm:'↓',em:'↓'},
  {p:[4,2],e:[2,3],pm:'←',em:'←'}
];

for (let r=0;r<5;r++) {
  for (let c=0;c<5;c++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.pos = `${r},${c}`;
    if (walls.has(`${r},${c}`)) cell.classList.add('wall');
    if (exits.has(`${r},${c}`)) cell.classList.add('exit');
    board.appendChild(cell);
  }
}

function render(step) {
  board.querySelectorAll('.mote,.echo').forEach(el => el.remove());
  const frame = moves[step % moves.length];
  const pCell = board.querySelector(`[data-pos="${frame.p[0]},${frame.p[1]}"]`);
  const eCell = board.querySelector(`[data-pos="${frame.e[0]},${frame.e[1]}"]`);
  pCell?.append(Object.assign(document.createElement('div'), {className:'mote'}));
  eCell?.append(Object.assign(document.createElement('div'), {className:'echo'}));
  playerMove.textContent = frame.pm;
  echoMove.textContent = frame.em;
}

let step = 0;
render(step);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) setInterval(() => render(++step), 850);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__echoToast);
  window.__echoToast = setTimeout(() => toast.classList.remove('show'), 1700);
}

document.querySelector('[data-hook="play-teaser"]').addEventListener('click', () => {
  showToast('demo shift loading soon // stay locked in');
});

document.querySelector('[data-hook="notify"]').addEventListener('click', () => {
  showToast('launch hook armed // email capture next');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
