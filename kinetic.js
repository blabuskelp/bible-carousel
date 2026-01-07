const track = document.querySelector('.carousel-track');

let position = 0;
let impulse = 0;

const cruise = 1;
const impulseStrength = 2.8;
const friction = 0.90;
const settle = 0.02;

const imgs = Array.from(track.children);

// clone track for seamless belt
imgs.forEach(img => track.appendChild(img.cloneNode(true)));

function totalWidth() {
  return Array.from(track.children)
    .reduce((sum, img) => sum + img.offsetWidth + 12, 0) / 2;
}

let loopWidth = 0;
setTimeout(() => loopWidth = totalWidth(), 500);

function animate() {
  position += cruise + impulse;
  impulse *= friction;

  if (Math.abs(impulse) < 0.05) {
    impulse += (0 - impulse) * settle;
  }

  // true modulo wrap
  if (position > loopWidth) position -= loopWidth;
  if (position < 0) position += loopWidth;

  track.style.transform = `translateX(${-position}px)`;
  requestAnimationFrame(animate);
}

window.addEventListener('wheel', e => {
  impulse += e.deltaY * impulseStrength * 0.04;
});

animate();
