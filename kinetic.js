const track = document.getElementById("carousel-track");

let pos = 0;
let speed = 1;
let impulse = 0;

const friction = 0.94;
const impulsePower = 0.12;

const images = Array.from(track.children);
images.forEach(img => track.appendChild(img.cloneNode(true)));

function loopWidth() {
  return images.reduce((sum, img) => sum + img.offsetWidth + 16, 0);
}

let width = 0;
setTimeout(() => width = loopWidth(), 300);

function animate() {
  pos += speed + impulse;
  impulse *= friction;

  if (pos > width) pos -= width;
  if (pos < 0) pos += width;

  track.style.transform = `translateX(${-pos}px)`;
  requestAnimationFrame(animate);
}

window.addEventListener("wheel", e => {
  impulse += e.deltaY * impulsePower;
});

animate();
