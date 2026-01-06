// Infinite kinetic carousel engine with images loaded check
const track = document.getElementById("carousel-track");
let position = 0;
let velocity = 0.3; // base auto-scroll speed
let lastScroll = window.scrollY;
let loopWidth;

// Wait for all images to load first
const images = track.querySelectorAll("img");
let loadedCount = 0;

images.forEach(img => {
  if (img.complete) {
    loadedCount++;
  } else {
    img.addEventListener("load", () => {
      loadedCount++;
      if (loadedCount === images.length) startCarousel();
    });
  }
});

if (loadedCount === images.length) startCarousel();

function startCarousel() {
  // calculate loop width after images are loaded
  loopWidth = track.scrollWidth / 2;

  function animate() {
    const delta = window.scrollY - lastScroll;
    lastScroll = window.scrollY;

    velocity += delta * 0.02; // scroll accelerates/reverses motion
    velocity *= 0.92;          // friction to smooth out

    position += velocity;

    // Infinite wrap
    if (position > loopWidth) position -= loopWidth;
    if (position < 0) position += loopWidth;

    track.style.transform = `translateX(${-position}px)`;

    requestAnimationFrame(animate);
  }

  animate();
}
