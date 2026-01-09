const track = document.getElementById("carousel-track");

let pos = 0;
let speed = 0;

const friction = 0.92;       // how fast scroll input fades
const scrollForce = 0.002;   // scroll sensitivity
const cruiseSpeed = 0.35;    // constant drift speed (always on)

const images = Array.from(track.children);
images.forEach(img => track.appendChild(img.cloneNode(true)));

function loopWidth() {
  return images.reduce((sum, img) => sum + img.offsetWidth + 16, 0);
}

let width = 0;
setTimeout(() => width = loopWidth(), 300);

function animate() {
  pos += speed;

  // Ease into constant cruise instead of stopping
  if (Math.abs(speed) > cruiseSpeed) {
    speed *= friction;
  } else if (speed !== 0) {
    speed = cruiseSpeed * Math.sign(speed);
  }

  if (pos > width) pos -= width;
  if (pos < 0) pos += width;

  track.style.transform = `translateX(${-pos}px)`;
  requestAnimationFrame(animate);
}

window.addEventListener("wheel", e => {
  // down scroll = left → right
  speed += -e.deltaY * scrollForce;
});

animate();
