const carouselBox = document.querySelector('.carousel-box');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let items = document.querySelectorAll('.carousel-item');

const configMove = {
  delay: 2500,
  transition: 'transform 0.5s ease'
};

/* --------------------------------------------------
   Duplicate first & last slides (NO cloneNode)
-------------------------------------------------- */
carouselBox.insertAdjacentHTML('beforeend', items[0].outerHTML);
carouselBox.insertAdjacentHTML('afterbegin', items[items.length - 1].outerHTML);

items = document.querySelectorAll('.carousel-item');

/* --------------------------------------------------
   State
-------------------------------------------------- */
let currentIndex = 1; // start at first REAL slide
let itemWidth = items[0].clientWidth;
let autoPlayInterval;

/* --------------------------------------------------
   Core movement
-------------------------------------------------- */
function goTo(index, animate = true) {
  currentIndex = index;
  carouselBox.style.transition = animate ? configMove.transition : 'none';
  carouselBox.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
}

const nextSlide = () => goTo(currentIndex + 1);
const prevSlide = () => goTo(currentIndex - 1);

/* --------------------------------------------------
   Edge snapping (after animation completes)
-------------------------------------------------- */
carouselBox.addEventListener('transitionend', () => {
  // Fake first → real last
  if (currentIndex === 0) {
    goTo(items.length - 2, false);
  }

  // Fake last → real first
  if (currentIndex === items.length - 1) {
    goTo(1, false);
  }
});

/* --------------------------------------------------
   Auto-play
-------------------------------------------------- */
function startAutoPlay() {
  stopAutoPlay();
  autoPlayInterval = setInterval(nextSlide, configMove.delay);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

/* --------------------------------------------------
   Controls
-------------------------------------------------- */
nextBtn.addEventListener('click', () => {
  stopAutoPlay();
  nextSlide();
  startAutoPlay();
});

prevBtn.addEventListener('click', () => {
  stopAutoPlay();
  prevSlide();
  startAutoPlay();
});

/* --------------------------------------------------
   Keyboard navigation
-------------------------------------------------- */
// document.addEventListener('keydown', e => {
//   if (e.key === 'ArrowRight') nextSlide();
//   if (e.key === 'ArrowLeft') prevSlide();
// });

/* --------------------------------------------------
   Resize handling
-------------------------------------------------- */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    itemWidth = items[0].clientWidth;
    goTo(currentIndex, false);
  }, 150);
});

/* --------------------------------------------------
   Init
-------------------------------------------------- */
goTo(currentIndex, false);
startAutoPlay();
