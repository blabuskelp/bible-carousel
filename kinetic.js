// Cinematic carousel (old-style behavior, robust)
const container = document.querySelector('#my-carousel-widget');
const track = container.querySelector('.carousel-track');

const GAP = 6;              // MUST match CSS gap / margin-right between items (px)
const CRUISE = 1;            // final resting cruise speed (px/frame)
const IMPULSE_STRENGTH = 0.12; // multiplier for wheel delta -> impulse (tune)
const FRICTION = 0.90;       // impulse decay (0-1)
const SETTLE = 0.04;         // how fast velocity eases to cruise in last direction

let imgs = Array.from(track.children);
let pos = 0;                 // current position along strip
let velocity = CRUISE;       // current belt velocity (signed)
let impulse = 0;             // temporary boost from scroll
let loopWidth = 0;

// Wait for images to finish loading, then duplicate and compute widths
let loaded = 0;
imgs.forEach(img => {
  if (img.complete) loaded++;
  else img.addEventListener('load', () => {
    loaded++;
    if (loaded === imgs.length) init();
  });
});
if (loaded === imgs.length) init();

function computeLoopWidth() {
  // compute width of a single set of images including gaps
  const imgsNow = Array.from(track.children).slice(0, imgs.length);
  return imgsNow.reduce((sum, el, i) => {
    const w = el.getBoundingClientRect().width;
    // add gap after each item except possibly the last (we'll treat as consistent)
    return sum + w + GAP;
  }, 0);
}

function init() {
  // duplicate nodes for seamless loop
  imgs.forEach(img => track.appendChild(img.cloneNode(true)));

  // allow layout to settle then compute loop width
  requestAnimationFrame(() => {
    loopWidth = computeLoopWidth();
    // small guard: if loopWidth is 0 (images haven't rendered), retry shortly
    if (!loopWidth) {
      setTimeout(() => { loopWidth = computeLoopWidth(); }, 200);
    }
    animate();
  });
}

function animate() {
  // apply impulse and friction
  pos += velocity + impulse;
  impulse *= FRICTION;

  // settle velocity toward CRUISE while preserving direction
  const dir = Math.sign(velocity) || 1;
  velocity += (dir * CRUISE - velocity) * SETTLE;

  // true modulo wrap so no matter how large pos gets we stay inside [0, loopWidth)
  if (loopWidth) pos = ((pos % loopWidth) + loopWidth) % loopWidth;

  track.style.transform = `translate3d(${-pos}px,0,0)`;
  requestAnimationFrame(animate);
}

// Wheel handler: sets direction and gives an impulse
window.addEventListener('wheel', (e) => {
  // e.deltaY > 0 means user scrolls down (we'll treat that as one direction)
  const d = e.deltaY;
  if (Math.abs(d) < 1) return; // ignore tiny wheel noise

  // If user changed scroll direction, flip cruise direction immediately
  const wantedDir = d > 0 ? 1 : -1;

  // If velocity is opposite of wantedDir, flip its sign to prefer new dir
  if (Math.sign(velocity) !== wantedDir) {
    velocity = Math.abs(velocity) * wantedDir;
  }

  // Add impulse proportional to the magnitude of the scroll. Multiply tuned factor.
  impulse += Math.abs(d) * IMPULSE_STRENGTH * wantedDir;
}, { passive: true });
