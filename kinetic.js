const track = document.getElementById("carousel-track");
let position = 0;
let velocity = 1;      // base auto-scroll speed (pixels/frame)
let userVelocity = 0;  // reacts to user scroll
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
  loopWidth = track.scrollWidth / 2;

  // Track vertical scroll (user input)
  window.addEventListener("scroll", () => {
    const delta = window.scrollY - (window.lastScrollY || 0);
    window.lastScrollY = window.scrollY;

    // Slower, smoother scroll reaction
    userVelocity += delta * 0.02; // smaller multiplier = slower scroll effect
  });

  function animate() {
    // Combine base auto-scroll with user input
    position += velocity + userVelocity;

    // Smooth out user input over time
    userVelocity *= 0.5;

    // Infinite wrap
    if (position > loopWidth) position -= loopWidth;
    if (position < 0) position += loopWidth;

    track.style.transform = `translateX(${-position}px)`;

    // Slight friction to keep auto-scroll smooth
    velocity *= 0.99;

    requestAnimationFrame(animate);
  }

  animate();
}
