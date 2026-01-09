const track = document.getElementById("carousel-track");

let pos = 0;
let speed = 0.3;   // initial gentle drift

const cruise = 0.3;    // base drift speed
const friction = 0.94;
const scrollForce = 0.0025;

const images = Array.from(track.children);
images.forEach(img => track.appendChild(img.cloneNode(true)));

function loopWidth() {
  return images.reduce((sum, img) => sum + img.offsetWidth + 16, 0);
}

let width = 0;
setTimeout(() => width = loopWidth(), 300);

function animate() {
  pos += speed;

  // natural friction
  speed *= friction;

  // gentle gravity back toward cruise (not a clamp)
  speed += (cruise * Math.sign(speed || 1) - speed) * 0.005;

  if (pos > width) pos -= width;
  if (pos < 0) pos += width;

  track.style.transform = `translateX(${-pos}px)`;
  requestAnimationFrame(animate);
}

window.addEventListener("wheel", e => {
  // down = move right
  speed += -e.deltaY * scrollForce;
});

animate();
