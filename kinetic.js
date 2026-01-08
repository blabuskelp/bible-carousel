const track = document.querySelector('.carousel-track');

let position = 0;
let velocity = 1;          // current belt direction + speed
let impulse = 0;

const cruiseSpeed = 1;     // final resting speed
const impulseStrength = 3.2;
const friction = 0.88;
const settleForce = 0.03;

const imgs = Array.from(track.children);
imgs.forEach(img => track.appendChild(img.cloneNode(true)));

function calcLoopWidth() {
  return Array.from(track.children)
    .slice(0, imgs.length)
    .reduce((sum, img) => sum + img.offsetWidth + 6, 0);
}

let loopWidth = 0;
setTimeout(() => loopWidth = calcLoopWidth(), 600);

function animate() {
  velocity += impulse;
  impulse *= friction;

  // settle velocity toward cruiseSpeed but keep direction
  const dir = Math.sign(velocity) || 1;
  velocity += (dir * cruiseSpeed - velocity) * settleForce;

  position += velocity;

  if (position > loopWidth) position -= loopWidth;
  if (position < 0) position += loopWidth;

  track.style.transform = `translateX(${-position}px)`;
  requestAnimationFrame(animate);
}

window.addEventListener('wheel', e => {
  impulse += -e.deltaY * impulseStrength * 0.04;
});

animate();
