const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menu.classList.toggle('is-open', !open);
});

menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.header')) closeMenu();
});

window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

// The native scroll area supports touch, keyboard and the same controls.
const reviewTrack = document.querySelector('#review-track');
const previousReview = document.querySelector('.review-previous');
const nextReview = document.querySelector('.review-next');
const reviewPosition = document.querySelector('.review-position');
const reviewCards = [...reviewTrack.querySelectorAll('.review')];

function reviewStep() {
  const gap = parseFloat(getComputedStyle(reviewTrack).gap);
  return reviewCards[0].getBoundingClientRect().width + gap;
}

function updateReviewControls() {
  const first = Math.round(reviewTrack.scrollLeft / reviewStep());
  const visible = Math.round(reviewTrack.clientWidth / reviewStep());
  const last = Math.min(reviewCards.length, first + Math.max(1, visible));
  previousReview.disabled = reviewTrack.scrollLeft < 2;
  nextReview.disabled = reviewTrack.scrollLeft + reviewTrack.clientWidth >= reviewTrack.scrollWidth - 2;
  reviewPosition.textContent = first + 1 === last
    ? `${last} de ${reviewCards.length}`
    : `${first + 1}–${last} de ${reviewCards.length}`;
}

function moveReview(direction) {
  reviewTrack.scrollBy({ left: direction * reviewStep() });
}

previousReview.addEventListener('click', () => moveReview(-1));
nextReview.addEventListener('click', () => moveReview(1));
reviewTrack.addEventListener('scroll', updateReviewControls, { passive: true });
reviewTrack.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    moveReview(event.key === 'ArrowRight' ? 1 : -1);
  }
});
new ResizeObserver(updateReviewControls).observe(reviewTrack);
updateReviewControls();
