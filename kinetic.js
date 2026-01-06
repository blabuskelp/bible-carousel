const track = document.getElementById("carousel-track");
let position = 0;
let velocity = 1;      // base auto-scroll speed
let userVelocity = 0;  // reacts to scroll input
let loopWidth;

// Wait for images to load
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
  // Duplicate images for seamless loop
  track.innerHTML += track.innerHTML;
  loopWidth = track.scrollWidth / 2;

  // Track user vertical scroll
  window.addEventListener("scroll", () => {
    const delta = window.scrollY - (window.lastScrollY || 0);
    window.lastScrollY = window.scrollY;

    userVelocity += delta * 0.1; // scroll sensitivity
  });

  function animate() {
    // Auto-scroll plus user input
    velocity += userVelocity;
    userVelocity *= 0.8; // smooth out user input
    position += velocity;

    // infinite wrap
    if (position > loopWidth) position -= loopWidth;
    if (position < 0) position += loopWidth;

    track.style.transform = `translateX(${-position}px)`;

    // base friction for smooth auto-scroll
    velocity *= 0.98;

    requestAnimationFrame(animate);
  }

  animate();
}

