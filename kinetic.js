const track = document.getElementById("carousel-track");
let position = 0;
const baseVelocity = 1;  // constant auto-scroll speed
let userVelocity = 0;
let loopWidth;

const images = track.querySelectorAll("img");
let loadedCount = 0;

// Wait for all images to load
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
  // Duplicate images for seamless loop
  track.innerHTML += track.innerHTML;

  // Wait for browser to render duplicated images
  requestAnimationFrame(() => {
    loopWidth = track.scrollWidth / 2;

    // Track vertical scroll
    window.addEventListener("scroll", () => {
      const delta = window.scrollY - (window.lastScrollY || 0);
      window.lastScrollY = window.scrollY;
      userVelocity += delta * 0.1; // slower, smoother scroll effect
    });

    function animate() {
      position += baseVelocity + userVelocity;
      userVelocity *= 0.8;

      if (position > loopWidth) position -= loopWidth;
      if (position < 0) position += loopWidth;

      track.style.transform = `translateX(${-position}px)`;
      requestAnimationFrame(animate);
    }

    animate();
  });
}
