const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('primary-navigation');
const navLinks = document.querySelectorAll('.nav-link');
const currentYear = document.getElementById('year');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleMobileMenu() {
  const isOpen = navList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

function closeMobileMenu() {
  navList.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

function handleAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMobileMenu();
      window.scrollTo({
        top: target.offsetTop - 72,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });
}

function setActiveNavLink() {
  const sections = document.querySelectorAll('main section[id]');
  const offset = window.scrollY + 100;

  sections.forEach((section) => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;

    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const inSection = offset >= sectionTop && offset < sectionTop + sectionHeight;

    link.classList.toggle('active', inSection);
  });
}

function setCurrentYear() {
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
}

function initialize() {
  handleAnchorLinks();
  setCurrentYear();

  navToggle.addEventListener('click', toggleMobileMenu);
  navLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));
  
  window.addEventListener('scroll', setActiveNavLink);
}

window.addEventListener('DOMContentLoaded', initialize);
