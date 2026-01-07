// Kinetic carousel JS — fully corrected
const track = document.getElementById("carousel-track");

let position = 0;
const TARGET_SPEED = 1;      // cruise speed in px/frame
let direction = 1;           // +1 = left->right, -1 = right->left
let impulseVelocity = 0;

const SCROLL_FORCE = 0.2;    // stronger user scroll boost
const FRICTION = 0.9;        // slower decay = impulse lasts longer

let lastScroll = window.scrollY;

// Wait for all images to load before duplicating track
const images = track.querySelectorAll('img');
let loadedCount = 0;

images.forEach(img => {
  if (img.complete) {
    loadedCount++;
  } else {
    img.addEventListener('load', () => {
      loadedCount++;
      if (loadedCount === images.length) startCarousel();
    });
  }
});

if (loadedCount === images.length) startCarousel();

function startCarousel() {
  // Duplicate track AFTER images are loaded
  track.innerHTML += track.innerHTML;

  // Wait a frame to ensure browser has rendered duplicated images
  requestAnimationFrame(() => {
    const loopWidth = track.scrollWidth / 2;

    function animate() {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScroll;
      lastScroll = scrollY;

      // Update direction and apply user impulse
      if (Math.abs(delta) > 0.2) {
        direction = delta > 0 ? -1 : 1;
        impulseVelocity += delta * SCROLL_FORCE * direction;
      }

      // Smoothly decay the impulse
      impulseVelocity *= FRICTION;

      // Final velocity = cruise + impulse
      const finalVelocity = TARGET_SPEED * direction + impulseVelocity;
      position += finalVelocity;

      // Infinite wrap
      if (position >= loopWidth) position -= loopWidth;
      if (position < 0) position += loopWidth;

      track.style.transform = `translateX(${-position}px)`;

      requestAnimationFrame(animate);
    }

    animate();
  });
}
