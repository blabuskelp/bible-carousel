const track = document.getElementById("carousel-track");

let position = 0;

const TARGET_SPEED = 1; // permanent cruise speed
let direction = 1;     // +1 or -1

let impulseVelocity = 0;
const FRICTION = 0.82;
const SCROLL_FORCE = 0.08;

let lastScroll = window.scrollY;

function animate() {
  const scrollY = window.scrollY;
  const delta = scrollY - lastScroll;
  lastScroll = scrollY;

  if (Math.abs(delta) > 0.2) {
    direction = delta > 0 ? -1 : 1;
    impulseVelocity = delta * SCROLL_FORCE * direction;
  }

  impulseVelocity *= FRICTION;

  const finalVelocity = TARGET_SPEED * direction + impulseVelocity;
  position += finalVelocity;

  const loop = track.scrollWidth / 2;
  if (position >= loop) position -= loop;
  if (position < 0) position += loop;

  track.style.transform = `translateX(${-position}px)`;
  requestAnimationFrame(animate);
}

animate();
