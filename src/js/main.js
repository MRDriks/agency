const burgerMenu = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const fastScroll = document.querySelector('.fast-scroll');

burgerMenu.addEventListener('click', () => {
  burgerMenu.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

fastScroll.addEventListener('click', () => {
  mobileMenu.scrollIntoView({behavior: 'smooth'});
});