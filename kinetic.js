const track = document.getElementById("carousel-track");

// Duplicate images for seamless infinite scroll
track.innerHTML += track.innerHTML;
let loopWidth = track.scrollWidth / 2;

let position = 0;
const TARGET_SPEED = 1;      // Constant cruise speed
let direction = 1;           // +1 = left->right, -1 = right->left
let impulseVelocity = 0;

const FRICTION = 0.82;       // How quickly impulse decays
const SCROLL_FORCE = 0.08;   // Strength of user scroll boost
let lastScroll = window.scrollY;

function animate() {
  const scrollY = window.scrollY;
  const delta = scrollY - lastScroll;
  lastScroll = scrollY;

  if (Math.abs(delta) > 0.2) {
    // Flip cruise direction based on scroll
    direction = delta > 0 ? -1 : 1;

    // Add impulse in current direction
    impulseVelocity += delta * SCROLL_FORCE * direction;
  }

  // Smoothly decay the impulse over time
  impulseVelocity *= FRICTION;

  // Combine cruise speed + impulse
  const finalVelocity = TARGET_SPEED * direction + impulseVelocity;
  position += finalVelocity;

  // Infinite wrap logic
  if (position >= loopWidth) position -= loopWidth;
  if (position < 0) position += loopWidth;

  track.style.transform = `translateX(${-position}px)`;

  requestAnimationFrame(animate);
}

animate();
