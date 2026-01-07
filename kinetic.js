// Kinetic Carousel JS

const container = document.getElementById("my-carousel-widget");
const track = container.querySelector(".carousel-track");

let position = 0;
const TARGET_SPEED = 1;    // default cruise speed
let direction = 1;         // +1 = left→right, -1 = right→left
let impulseVelocity = 0;
const SCROLL_FORCE = 0.2;  // user scroll impulse strength
const FRICTION = 0.9;      // impulse decay

let lastScroll = window.scrollY;

// Wait for all images to load
const images = track.querySelectorAll("img");
let loadedCount = 0;

images.forEach(img => {
  if (img.complete) loadedCount++;
  else img.addEventListener("load", () => {
    loadedCount++;
    if (loadedCount === images.length) startCarousel();
  });
});

if (loadedCount === images.length) startCarousel();

function startCarousel() {
  // Duplicate track for seamless loop
  track.innerHTML += track.innerHTML;
  const loopWidth = track.scrollWidth / 2;

  function animate() {
    const scrollY = window.scrollY;
    const delta = scrollY - lastScroll;
    lastScroll = scrollY;

    // Apply scroll impulse
    if (Math.abs(delta) > 0.2) {
      direction = delta > 0 ? -1 : 1;
      impulseVelocity += Math.abs(delta) * SCROLL_FORCE * direction;
    }

    // Smooth decay of impulse
    impulseVelocity *= FRICTION;

    // Final velocity = cruise + impulse
    const finalVelocity = TARGET_SPEED * direction + impulseVelocity;
    position += finalVelocity;

    // Infinite wrap
    position = ((position % loopWidth) + loopWidth) % loopWidth;

    track.style.transform = `translateX(${-position}px)`;

    requestAnimationFrame(animate);
  }

  animate();
}
