const track = document.querySelector('.carousel-track');

let pos = 0;
let velocity = 1;          // cruise speed
let impulse = 0;
const cruise = 1;
const impulseStrength = 2.6;   // scroll power
const friction = 0.92;
const settle = 0.02;

const imgs = Array.from(track.children);
const totalWidth = imgs.reduce((s, img) => s + img.offsetWidth + 12, 0);

function loop() {
  pos += velocity + impulse;
  impulse *= friction;

  if (Math.abs(impulse) < 0.01) {
    velocity += (cruise - velocity) * settle;
  }

  if (pos >= totalWidth) pos -= totalWidth;
  if (pos <= -totalWidth) pos += totalWidth;

  track.style.transform = `translateX(${-pos}px)`;
  requestAnimationFrame(loop);
}

window.addEventListener('wheel', e => {
  impulse += e.deltaY * impulseStrength * 0.04;
});

loop();
