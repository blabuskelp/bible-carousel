// ==============================
// Kinetic Carousel JS — Final
// ==============================

const track = document.getElementById("carousel-track");

let position = 0;
const TARGET_SPEED = 1;      // Cruise speed in px/frame
let direction = 1;           // +1 = left→right, -1 = right→left
let impulseVelocity = 0;

const SCROLL_FORCE = 0.2;    // Strength of user scroll boost
const FRICTION = 0.9;        // Slower decay = impulse lasts longer

let lastScroll = window.scrollY;

// Wait until all images are loaded
const images = track.querySelectorAll('img');
let loadedCount = 0;

images.forEach(img => {
  if (img.complete) loadedCount++;
  else img.addEventListener('load', () => {
    loadedCount++;
    if (loadedCount === images.length) startCarousel();
  });
});

if (loadedCount === images.length) startCarousel();

function startCarousel() {
  // Duplicate track after images are fully loaded
  track.innerHTML += track.innerHTML;

  // Wait a frame to ensure the browser renders duplicates
  requestAnimationFrame(() => {
    const loopWidth = track.scrollWidth / 2;

    function animate() {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScroll;
      lastScroll = scrollY;

      // Update direction and apply user impulse
      if (Math.abs(delta) > 0.2) {
        direction = delta > 0 ? -1 : 1;               // flip cruise
        impulseVelocity += Math.abs(delta) * SCROLL_FORCE * direction; // aligned impulse
      }

      // Smooth decay of impulse
      impulseVelocity *= FRICTION;

      // Final velocity = cruise + impulse
      const finalVelocity = TARGET_SPEED * direction + impulseVelocity;
      position += finalVelocity;

      // Seamless wrap using modulo — no jumps
      position = ((position % loopWidth) + loopWidth) % loopWidth;

      track.style.transform = `translateX(${-position}px)`;

      requestAnimationFrame(animate);
    }

    animate();
  });
}
