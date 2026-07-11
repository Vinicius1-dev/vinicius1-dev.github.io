const menu = document.getElementById("menu");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav a");
const header = document.querySelector(".header");
const yearElement = document.getElementById("year");
const progressBar = document.getElementById("scroll-progress");
const cursorGlow = document.getElementById("cursor-glow");
const backToTop = document.getElementById("back-to-top");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const magneticItems = document.querySelectorAll(".magnetic");
const counters = document.querySelectorAll("[data-count]");
const projectFilterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-project]");
const heroBackdrop = document.querySelector(".hero-backdrop");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealSkillItems = document.querySelectorAll(".reveal-skill");
const skillCards = document.querySelectorAll(".skill-pro-card");

function closeMenu() {
  if (!menu || !nav) return;

  nav.classList.remove("open");
  menu.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
}

function updateActiveLink() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPosition = window.scrollY + 130;

  sections.forEach((section) => {
    const id = section.getAttribute("id");
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
}

function updateScrollProgress() {
  if (!progressBar) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function updateFloatingActions() {
  if (!backToTop) return;

  backToTop.classList.toggle("is-visible", window.scrollY > 620);
}

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  if (!Number.isFinite(target)) return;

  let current = 0;
  const increment = Math.max(1, Math.ceil(target / 36));
  const timer = window.setInterval(() => {
    current += increment;

    if (current >= target) {
      counter.textContent = `${target}+`;
      window.clearInterval(timer);
      return;
    }

    counter.textContent = current;
  }, 34);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("is-visible");

    if (entry.target.classList.contains("metrics-grid")) {
      counters.forEach((counter) => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = "true";
        animateCounter(counter);
      });
    }

    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.16,
  rootMargin: "0px 0px -40px 0px",
});

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${(index % 4) * 70}ms`;
  revealObserver.observe(item);
});

// Observer para animações de entrada da seção de habilidades
const revealSkillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("skill-visible");
    revealSkillObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
});

revealSkillItems.forEach((item) => {
  revealSkillObserver.observe(item);
});

// Mouse tracking para efeito de brilho nos cards de habilidades
if (!prefersReducedMotion) {
  skillCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

// Adicionar classe .js ao elemento html se JavaScript estiver habilitado
document.documentElement.classList.add("js");

if (!prefersReducedMotion) {
  window.addEventListener("pointermove", (event) => {
    if (cursorGlow) {
      document.body.classList.add("is-pointer-active");
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    }
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    document.body.classList.remove("is-pointer-active");
  });

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((y / rect.height) - 0.5) * -8;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  magneticItems.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      item.style.transform = `translate(${x * 0.16}px, ${y * 0.18}px)`;
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });

  let parallaxFrame = null;
  window.addEventListener("pointermove", (event) => {
    if (!heroBackdrop || window.innerWidth < 880) return;

    if (parallaxFrame) {
      window.cancelAnimationFrame(parallaxFrame);
    }

    parallaxFrame = window.requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 14;
      heroBackdrop.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }, { passive: true });
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
}

projectFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    projectFilterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    projectCards.forEach((card) => {
      const projectTypes = card.dataset.project.split(" ");
      const shouldShow = filter === "todos" || projectTypes.includes(filter);

      card.classList.toggle("is-filtered-out", !shouldShow);

      if (shouldShow) {
        card.classList.remove("filter-pop");
        window.requestAnimationFrame(() => {
          card.classList.add("filter-pop");
        });
      }
    });
  });
});

if (menu && nav) {
  menu.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menu.classList.toggle("open", isOpen);
    menu.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

window.addEventListener("scroll", () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 12);
  }

  updateActiveLink();
  updateScrollProgress();
  updateFloatingActions();
}, { passive: true });

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  updateActiveLink();
  updateScrollProgress();
  updateFloatingActions();
});

const contactForm = document.getElementById("contact-form");
const contactSubmit = document.getElementById("contact-submit");
const contactStatus = document.getElementById("contact-form-status");
const contactMessage = document.getElementById("contact-message");
const messageCount = document.getElementById("message-count");
const contactWebsite = document.getElementById("contact-website");

if (contactMessage && messageCount) {
  const updateMessageCount = () => {
    messageCount.textContent = String(contactMessage.value.length);
  };

  contactMessage.addEventListener("input", updateMessageCount);
  updateMessageCount();
}

if (
  contactForm &&
  contactSubmit &&
  contactStatus
) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    contactStatus.textContent = "";
    contactStatus.className = "contact-form-status";

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    if (
      contactWebsite &&
      contactWebsite.value.trim() !== ""
    ) {
      contactStatus.textContent =
        "Não foi possível enviar a mensagem.";

      contactStatus.classList.add("is-error");
      return;
    }

    const formAction = contactForm.getAttribute("action");

    if (
      !formAction ||
      formAction.includes("SEU_ID_AQUI")
    ) {
      contactStatus.textContent =
        "Configure o endereço do formulário antes de enviar.";

      contactStatus.classList.add("is-error");
      return;
    }

    contactSubmit.disabled = true;
    contactSubmit.classList.add("is-loading");

    try {
      const response = await fetch(formAction, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Falha no envio");
      }

      contactStatus.textContent =
        "Mensagem enviada com sucesso! Obrigado pelo contato.";

      contactStatus.classList.add("is-success");

      contactForm.reset();

      if (messageCount) {
        messageCount.textContent = "0";
      }
    } catch (error) {
      contactStatus.textContent =
        "Não foi possível enviar agora. Tente novamente ou entre em contato pelo LinkedIn.";

      contactStatus.classList.add("is-error");
    } finally {
      contactSubmit.disabled = false;
      contactSubmit.classList.remove("is-loading");
    }
  });
}
