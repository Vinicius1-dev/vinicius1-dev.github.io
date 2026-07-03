const rootElement = document.documentElement;
const themeButton = document.getElementById('themeToggle');
const navToggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('primary-navigation');
const navLinks = document.querySelectorAll('.nav-link');
const filterButtons = document.querySelectorAll('.project-filter');
const projectCards = document.querySelectorAll('.project-card');
const copyEmailButton = document.getElementById('copyEmail');
const copyFeedback = document.getElementById('copyFeedback');
const currentYear = document.getElementById('year');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const themeStorageKey = 'portfolio-theme';

function setTheme(theme) {
  rootElement.setAttribute('data-theme', theme);
  localStorage.setItem(themeStorageKey, theme);
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function toggleTheme() {
  const nextTheme = rootElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
}

function setActiveNavLink() {
  const sections = document.querySelectorAll('main section[id]');
  const offset = window.scrollY + 120;

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
        top: target.offsetTop - 82,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });
}

function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

  revealElements.forEach((element) => observer.observe(element));
}

function initFilterButtons() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;

      projectCards.forEach((card) => {
        const categories = card.dataset.category.split(' ');
        const isVisible = filter === 'all' || categories.includes(filter);
        card.style.display = isVisible ? 'grid' : 'none';
      });
    });
  });
}

function initCopyEmail() {
  if (!copyEmailButton || !copyFeedback) return;

  copyEmailButton.addEventListener('click', async () => {
    const email = copyEmailButton.dataset.email;
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      copyFeedback.textContent = 'E-mail copiado para a área de transferência.';
    } catch (error) {
      copyFeedback.textContent = 'Não foi possível copiar. Use copiar manualmente.';
    }

    setTimeout(() => {
      copyFeedback.textContent = '';
    }, 2800);
  });
}

function initObservers() {
  const sections = document.querySelectorAll('main section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  }, { threshold: 0.5 });

  sections.forEach((section) => observer.observe(section));
}

function setCurrentYear() {
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
}

function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    setActiveNavLink();
  });
}

function initialize() {
  setTheme(getInitialTheme());
  initHeaderScroll();
  initRevealAnimations();
  initFilterButtons();
  initCopyEmail();
  handleAnchorLinks();
  setCurrentYear();
  initObservers();

  themeButton.addEventListener('click', toggleTheme);
  navToggle.addEventListener('click', toggleMobileMenu);
  navLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));
}

window.addEventListener('DOMContentLoaded', initialize);
