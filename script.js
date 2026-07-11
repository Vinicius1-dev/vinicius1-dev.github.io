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

function getPortfolioText(key, replacements = {}) {
  let text =
    typeof window.translatePortfolioText === "function"
      ? window.translatePortfolioText(key)
      : key;

  Object.entries(replacements).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });

  return text;
}

function updateMenuAriaLabel(isOpen) {
  if (!menu) return;

  menu.setAttribute(
    "aria-label",
    getPortfolioText(
      isOpen ? "accessibility.closeMenu" : "accessibility.openMenu"
    )
  );
}

function closeMenu() {
  if (!menu || !nav) return;

  nav.classList.remove("open");
  menu.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  updateMenuAriaLabel(false);
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
    updateMenuAriaLabel(isOpen);
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
const contactEmail = document.getElementById("contact-email");
const contactEmailGroup = document.getElementById(
  "contact-email-group"
);
const contactEmailFeedback = document.getElementById(
  "contact-email-feedback"
);

const commonEmailDomainTypos = {
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "hotnail.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outllook.com": "outlook.com",
  "outlook.con": "outlook.com"
};

function showEmailError(message) {
  if (!contactEmail) return;

  contactEmail.setCustomValidity(message);

  if (contactEmailFeedback) {
    contactEmailFeedback.textContent = message;
  }

  if (contactEmailGroup) {
    contactEmailGroup.classList.add("has-error");
    contactEmailGroup.classList.remove("is-valid");
  }
}

function showValidEmail() {
  if (!contactEmail) return;

  contactEmail.setCustomValidity("");

  if (contactEmailFeedback) {
    contactEmailFeedback.textContent = "";
  }

  if (contactEmailGroup) {
    contactEmailGroup.classList.remove("has-error");

    if (contactEmail.value.trim()) {
      contactEmailGroup.classList.add("is-valid");
    } else {
      contactEmailGroup.classList.remove("is-valid");
    }
  }
}

function validateContactEmail() {
  if (!contactEmail) return false;

  const value = contactEmail.value.trim().toLowerCase();

  contactEmail.value = value;

  if (!value) {
    showEmailError(getPortfolioText("form.email.required"));
    return false;
  }

  if (value.includes(" ")) {
    showEmailError(getPortfolioText("form.email.spaces"));
    return false;
  }

  if (value.includes("..")) {
    showEmailError(getPortfolioText("form.email.dots"));
    return false;
  }

  const emailPattern =
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

  if (!emailPattern.test(value)) {
    showEmailError(getPortfolioText("form.email.invalid"));
    return false;
  }

  const [localPart, domain] = value.split("@");

  if (
    !localPart ||
    localPart.length > 64 ||
    value.length > 254
  ) {
    showEmailError(getPortfolioText("form.email.tooLong"));
    return false;
  }

  const suggestedDomain = commonEmailDomainTypos[domain];

  if (suggestedDomain) {
    showEmailError(
      getPortfolioText("form.email.typo", {
        domain,
        suggested: suggestedDomain,
      })
    );

    return false;
  }

  showValidEmail();
  return true;
}

if (contactEmail) {
  contactEmail.addEventListener("input", () => {
    if (!contactEmail.value.trim()) {
      contactEmail.setCustomValidity("");

      if (contactEmailFeedback) {
        contactEmailFeedback.textContent = "";
      }

      if (contactEmailGroup) {
        contactEmailGroup.classList.remove(
          "has-error",
          "is-valid"
        );
      }

      return;
    }

    validateContactEmail();
  });

  contactEmail.addEventListener("blur", validateContactEmail);
}

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

    if (!validateContactEmail()) {
      contactEmail.reportValidity();
      contactEmail.focus();
      return;
    }

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
        getPortfolioText("form.honeypotError");

      contactStatus.classList.add("is-error");
      return;
    }

    const formAction = contactForm.getAttribute("action");

    if (
      !formAction ||
      formAction.includes("SEU_ID_AQUI")
    ) {
      contactStatus.textContent =
        getPortfolioText("form.configError");

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
        getPortfolioText("form.success");

      contactStatus.classList.add("is-success");

      contactForm.reset();

      if (messageCount) {
        messageCount.textContent = "0";
      }
    } catch (error) {
      contactStatus.textContent =
        getPortfolioText("form.error");

      contactStatus.classList.add("is-error");
    } finally {
      contactSubmit.disabled = false;
      contactSubmit.classList.remove("is-loading");
    }
  });
}

/* ==================================================
   SISTEMA DE IDIOMAS
================================================== */

const languageSwitcher =
  document.getElementById("language-switcher");

const languageButton =
  document.getElementById("language-button");

const languageCurrentFlag =
  document.getElementById("language-current-flag");

const languageCurrentCode =
  document.getElementById("language-current-code");

const languageOptions =
  document.querySelectorAll(".language-option");

const translations = {
  "pt-BR": {
    pageTitle:
      "Vinícius Alves | Python, Dados e Automação",

    pageDescription:
      "Portfólio de Vinícius Alves, desenvolvedor Python em formação com foco em dados, automação e projetos práticos.",

    "language.select": "Selecionar idioma",
    "language.available": "Idiomas disponíveis",

    "accessibility.skipToContent": "Pular para o conteúdo",
    "accessibility.backHome": "Voltar ao início",
    "accessibility.mainNavigation": "Navegação principal",
    "accessibility.openMenu": "Abrir menu",
    "accessibility.closeMenu": "Fechar menu",
    "accessibility.backToTop": "Voltar ao topo",

    "nav.home": "Início",
    "nav.about": "Sobre",
    "nav.projects": "Projetos",
    "nav.skills": "Competências",
    "nav.journey": "Jornada",
    "nav.contact": "Contato",

    "hero.kicker": "Portfólio profissional",
    "hero.title":
      'Transformo estudos em projetos de <span>Python, dados e automação.</span>',
    "hero.description":
      "Sou Vinícius Alves, estudante em formação para atuar com desenvolvimento e análise de dados. Estou construindo uma base sólida com projetos práticos, documentação e evolução constante.",
    "hero.mainAreas": "Principais áreas",
    "hero.badge.automation": "Automação",
    "hero.badge.data": "Dados",
    "hero.projectsButton": "Ver projetos",
    "hero.contactButton": "Falar comigo",
    "hero.professionalLinks": "Links profissionais",
    "hero.professionalSummary": "Resumo profissional",
    "hero.photoAlt": "Foto profissional de Vinícius Alves",
    "hero.available": "Disponível para estágio",
    "hero.pythonData": "Python & Dados",
    "hero.technicalSummary": "Resumo técnico",
    "hero.terminal.code":
      'perfil = {\n  "foco": "Python + SQL",\n  "interesse": "Dados e automação",\n  "meta": "Primeira oportunidade"\n}',
    "hero.metric.projects": "projetos publicados",
    "hero.metric.python": "scripts, lógica e automação",
    "hero.metric.sql": "consultas e análise de vendas",
    "hero.metric.graduation": "conclusão do Ensino Médio",
    "hero.marquee.automation": "Automação",
    "hero.marquee.data": "Dados",

    "about.watermark": "SOBRE",
    "about.kicker": "Sobre mim",
    "about.title":
      'Aprendo construindo,<span>testando e evoluindo.</span>',
    "about.subtitle":
      "Estou construindo minha entrada na área de tecnologia por meio de estudos, projetos práticos e evolução constante.",
    "about.storyLabel": "Minha história",
    "about.quote":
      '"Meu jeito de aprender é transformar teoria em algo que realmente funciona."',
    "about.story.p1":
      "Estou no 3º ano do Ensino Médio e venho direcionando meus estudos para tecnologia, principalmente Python, SQL, Git, GitHub e desenvolvimento web.",
    "about.story.p2":
      "Busco minha primeira oportunidade ou estágio para aprender com pessoas experientes, contribuir com tarefas reais e crescer com consistência dentro de uma equipe.",
    "about.principle.learn.title": "Aprender",
    "about.principle.learn.desc": "Estudar fundamentos com organização.",
    "about.principle.build.title": "Construir",
    "about.principle.build.desc": "Transformar conhecimento em projetos.",
    "about.principle.evolve.title": "Evoluir",
    "about.principle.evolve.desc": "Revisar, melhorar e documentar.",
    "about.focus.filename": "perfil_atual.py",
    "about.focus.label": "Foco atual",
    "about.focus.title": "Python, dados e automação",
    "about.focus.desc":
      "Desenvolvendo uma base técnica para criar soluções, trabalhar com informações e resolver problemas utilizando programação.",
    "about.focus.code.foco": "<i>foco</i> = \"Python + SQL\"",
    "about.focus.code.objective":
      "<i>objetivo</i> = \"Primeira oportunidade\"",
    "about.focus.code.profile":
      "<i>perfil</i> = \"Aprendizado prático\"",
    "about.info.education.label": "Formação",
    "about.info.education.title": "Ensino Médio",
    "about.info.education.desc": "Conclusão prevista para 2026.",
    "about.info.goal.label": "Objetivo",
    "about.info.goal.title": "Primeira oportunidade",
    "about.info.goal.desc": "Estágio ou vaga júnior em tecnologia.",
    "about.info.diff.label": "Diferencial",
    "about.info.diff.title": "Aprendizado prático",
    "about.info.diff.desc": "Projetos, organização e evolução contínua.",

    "projects.kicker": "Projetos",
    "projects.title":
      'Projetos que mostram <span>evolução em código</span>, dados e entrega.',
    "projects.desc":
      "Essa área agora funciona como uma vitrine técnica: cada projeto destaca o problema resolvido, a tecnologia usada e o tipo de habilidade que ele prova para quem está avaliando seu perfil.",
    "projects.proof.logic": "Lógica aplicada",
    "projects.proof.data": "Dados e consultas",
    "projects.proof.automation": "Automação prática",
    "projects.console.label": "Resumo animado dos projetos",
    "projects.console.cmd":
      "vinicius@portfolio:~$ analisando_projetos",
    "projects.console.python": "✓ Python: automação e lógica",
    "projects.console.sql": "✓ SQL: consultas e insights",
    "projects.console.github":
      "✓ GitHub: repositórios publicados",
    "projects.filter.label": "Filtrar projetos",
    "projects.filter.all": "Todos",
    "projects.filter.automation": "Automação",
    "projects.filter.logic": "Lógica",
    "projects.p1.imageAlt":
      "Tela do projeto de automação de relatório de vendas",
    "projects.p1.status": "Projeto principal",
    "projects.p1.type": "Automação",
    "projects.p1.title": "Automação de Relatório de Vendas",
    "projects.p1.desc":
      "Script em Python que lê dados de vendas, calcula indicadores e organiza resultados em relatório. Mostra lógica, manipulação de arquivos e foco em produtividade.",
    "projects.p1.tag.reports": "Relatórios",
    "projects.link.github": "Ver no GitHub",
    "projects.p2.imageAlt":
      "Tela do projeto de análise de vendas com SQL",
    "projects.p2.status": "Dados",
    "projects.p2.type": "Dados",
    "projects.p2.title": "Análise de Vendas com SQL",
    "projects.p2.desc":
      "Consultas SQL para investigar faturamento, produtos mais vendidos e comportamento de clientes.",
    "projects.p2.tag.analysis": "Análise",
    "projects.p2.tag.insights": "Insights",
    "projects.p3.imageAlt": "Tela do jogo da cobrinha em Python",
    "projects.p3.status": "Lógica",
    "projects.p3.type": "Lógica",
    "projects.p3.title": "Jogo da Cobrinha",
    "projects.p3.desc":
      "Jogo em Python para praticar eventos, colisões, pontuação e organização de fluxo.",
    "projects.p3.tag.gameloop": "Game loop",
    "projects.p3.tag.logic": "Lógica",
    "projects.p4.imageAlt": "Tela do projeto calculadora em Python",
    "projects.p4.status": "Base",
    "projects.p4.type": "Fundamentos",
    "projects.p4.title": "Calculadora",
    "projects.p4.desc":
      "Aplicação criada para praticar funções, entrada de dados, operações matemáticas e validação básica.",
    "projects.p4.tag.functions": "Funções",
    "projects.p4.tag.operations": "Operações",

    "skills.kickerWord": "HABILIDADES",
    "skills.title":
      'Experiência <span>técnica</span>',
    "skills.subtitle":
      "Tecnologias que estou estudando e aplicando em projetos pessoais.",
    "skills.category.language": "Linguagem",
    "skills.python.desc":
      "Lógica de programação, scripts de automação e introdução ao desenvolvimento back-end com Python.",
    "skills.typescript.desc":
      "Realizando curso de TypeScript, aprendendo tipagem estática e boas práticas de desenvolvimento orientado a tipos.",
    "skills.category.versioning": "Versionamento",
    "skills.git.desc":
      "Controle de versão, criação de repositórios, commits e versionamento de projetos com Git e GitHub.",
    "skills.category.fundamentals": "Fundamentos",
    "skills.logic.title": "Lógica de Programação",
    "skills.logic.desc":
      "Estudo de algoritmos, estruturas de controle e resolução de problemas com raciocínio lógico estruturado.",

    "journey.kicker": "Jornada",
    "journey.title":
      'O caminho que estou <span>construindo.</span>',
    "journey.intro":
      "Minha evolução acontece por etapas: primeiro construo projetos, depois aprofundo meus conhecimentos e me preparo para transformar aprendizado em experiência profissional.",
    "journey.step1.stage": "Agora",
    "journey.step1.status": "Em andamento",
    "journey.step1.title": "Projetos práticos no GitHub",
    "journey.step1.desc":
      "Organizando repositórios, melhorando descrições e criando soluções com Python e SQL.",
    "journey.step2.stage": "Estudos",
    "journey.step2.label": "Evolução contínua",
    "journey.step2.title": "Python, dados e web",
    "journey.step2.desc":
      "Consolidando lógica, consultas, estrutura de páginas e boas práticas de versionamento.",
    "journey.tag.data": "Dados",
    "journey.tag.web": "Web",
    "journey.step3.label": "Próximo marco",
    "journey.step3.title": "Conclusão do Ensino Médio",
    "journey.step3.desc":
      "Preparação para entrar no mercado como estagiário ou profissional júnior em formação.",
    "journey.tag.internship": "Estágio",
    "journey.tag.tech": "Tecnologia",
    "journey.tag.career": "Carreira",
    "journey.message.label": "Objetivo profissional",
    "journey.message.text":
      "Transformar conhecimento em contribuição real dentro de uma equipe.",
    "journey.message.cta": "Vamos conversar",

    "contact.kicker": "Contato",
    "contact.title":
      'Vamos conversar sobre <span>uma oportunidade?</span>',
    "contact.text":
      "Preencha o formulário e a mensagem será enviada diretamente para o meu e-mail. Responderei utilizando o endereço informado.",
    "contact.step1.title": "Envie sua mensagem",
    "contact.step1.desc":
      "Informe os detalhes da oportunidade ou projeto.",
    "contact.step2.title": "Recebo por e-mail",
    "contact.step2.desc":
      "As informações chegam diretamente na minha caixa de entrada.",
    "contact.step3.title": "Entro em contato",
    "contact.step3.desc":
      "Responderei pelo e-mail informado no formulário.",
    "contact.form.filename": "nova_mensagem.form",

    "form.name": "Nome",
    "form.namePlaceholder": "Nome do recrutador",
    "form.email": "E-mail",
    "form.emailPlaceholder": "nome@empresa.com",
    "form.company": "Empresa",
    "form.optional": "Opcional",
    "form.companyPlaceholder": "Nome da empresa",
    "form.subject": "Assunto",
    "form.selectOption": "Selecione uma opção",
    "form.subject.internship": "Oportunidade de estágio",
    "form.subject.junior": "Vaga júnior",
    "form.subject.project": "Projeto",
    "form.subject.networking": "Networking",
    "form.subject.other": "Outro assunto",
    "form.message": "Mensagem",
    "form.messagePlaceholder":
      "Conte um pouco sobre a oportunidade, empresa ou projeto...",
    "form.honeypot": "Não preencha este campo",
    "form.hiddenSubject":
      "Nova mensagem pelo portfólio de Vinícius Alves",
    "form.submit": "Enviar mensagem",
    "form.privacy":
      "Seus dados serão usados somente para responder a esta mensagem.",
    "form.success":
      "Mensagem enviada com sucesso! Obrigado pelo contato.",
    "form.error":
      "Não foi possível enviar agora. Tente novamente ou entre em contato pelo LinkedIn.",
    "form.email.required": "O e-mail é obrigatório.",
    "form.email.spaces": "E-mail não pode conter espaços.",
    "form.email.dots": "E-mail não pode conter dois pontos seguidos.",
    "form.email.invalid": "Digite um endereço de e-mail válido.",
    "form.email.tooLong": "O e-mail é muito longo.",
    "form.email.typo":
      "Parece que você quis dizer {domain}. Verifique e tente novamente.",
    "form.honeypotError":
      "O formulário não pode ser enviado. Remova dados do campo invisível.",
    "form.configError":
      "O formulário não está configurado corretamente. Tente novamente mais tarde.",

    "footer.rights":
      "Vinícius Alves. Desenvolvido com HTML, CSS e JavaScript."
  },

  en: {
    pageTitle:
      "Vinícius Alves | Python, Data and Automation",

    pageDescription:
      "Portfolio of Vinícius Alves, a Python developer in training focused on data, automation and practical projects.",

    "language.select": "Select language",
    "language.available": "Available languages",

    "accessibility.skipToContent": "Skip to content",
    "accessibility.backHome": "Back to the beginning",
    "accessibility.mainNavigation": "Main navigation",
    "accessibility.openMenu": "Open menu",
    "accessibility.closeMenu": "Close menu",
    "accessibility.backToTop": "Back to top",

    "nav.home": "Home",
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.skills": "Skills",
    "nav.journey": "Journey",
    "nav.contact": "Contact",

    "hero.kicker": "Professional portfolio",
    "hero.title":
      'I turn my studies into <span>Python, data and automation projects.</span>',
    "hero.description":
      "I am Vinícius Alves, a student preparing to work in software development and data analysis. I am building a solid foundation through practical projects, documentation and continuous improvement.",
    "hero.mainAreas": "Main areas",
    "hero.badge.automation": "Automation",
    "hero.badge.data": "Data",
    "hero.projectsButton": "View projects",
    "hero.contactButton": "Contact me",
    "hero.professionalLinks": "Professional links",
    "hero.professionalSummary": "Professional summary",
    "hero.photoAlt": "Professional photo of Vinícius Alves",
    "hero.available": "Available for internship",
    "hero.pythonData": "Python & Data",
    "hero.technicalSummary": "Technical summary",
    "hero.terminal.code":
      'profile = {\n  "focus": "Python + SQL",\n  "interest": "Data and automation",\n  "goal": "First opportunity"\n}',
    "hero.metric.projects": "published projects",
    "hero.metric.python": "scripts, logic and automation",
    "hero.metric.sql": "queries and sales analysis",
    "hero.metric.graduation": "high school graduation",
    "hero.marquee.automation": "Automation",
    "hero.marquee.data": "Data",

    "about.watermark": "ABOUT",
    "about.kicker": "About me",
    "about.title":
      'I learn by building,<span>testing and evolving.</span>',
    "about.subtitle":
      "I am building my entry into technology through study, practical projects and constant development.",
    "about.storyLabel": "My story",
    "about.quote":
      '"My way of learning is turning theory into something that really works."',
    "about.story.p1":
      "I am in my final year of high school and I have been directing my studies toward technology, especially Python, SQL, Git, GitHub and web development.",
    "about.story.p2":
      "I am seeking my first opportunity or internship to learn from experienced people, contribute to real tasks and grow consistently within a team.",
    "about.principle.learn.title": "Learn",
    "about.principle.learn.desc": "Study fundamentals with organization.",
    "about.principle.build.title": "Build",
    "about.principle.build.desc": "Turn knowledge into projects.",
    "about.principle.evolve.title": "Evolve",
    "about.principle.evolve.desc": "Review, improve and document.",
    "about.focus.filename": "current_profile.py",
    "about.focus.label": "Current focus",
    "about.focus.title": "Python, data and automation",
    "about.focus.desc":
      "Developing a technical foundation to create solutions, work with information and solve problems using programming.",
    "about.focus.code.foco": "<i>focus</i> = \"Python + SQL\"",
    "about.focus.code.objective":
      "<i>objective</i> = \"First opportunity\"",
    "about.focus.code.profile":
      "<i>profile</i> = \"Practical learning\"",
    "about.info.education.label": "Education",
    "about.info.education.title": "High School",
    "about.info.education.desc": "Expected graduation in 2026.",
    "about.info.goal.label": "Goal",
    "about.info.goal.title": "First opportunity",
    "about.info.goal.desc": "Internship or junior role in technology.",
    "about.info.diff.label": "Differential",
    "about.info.diff.title": "Practical learning",
    "about.info.diff.desc": "Projects, organization and continuous improvement.",

    "projects.kicker": "Projects",
    "projects.title":
      'Projects that show <span>progress in code</span>, data and delivery.',
    "projects.desc":
      "This section now works as a technical showcase: each project highlights the solved problem, the technology used and the type of skill it proves for anyone reviewing your profile.",
    "projects.proof.logic": "Applied logic",
    "projects.proof.data": "Data and queries",
    "projects.proof.automation": "Practical automation",
    "projects.console.label": "Animated project summary",
    "projects.console.cmd":
      "vinicius@portfolio:~$ analyzing_projects",
    "projects.console.python": "✓ Python: automation and logic",
    "projects.console.sql": "✓ SQL: queries and insights",
    "projects.console.github":
      "✓ GitHub: published repositories",
    "projects.filter.label": "Filter projects",
    "projects.filter.all": "All",
    "projects.filter.automation": "Automation",
    "projects.filter.logic": "Logic",
    "projects.p1.imageAlt":
      "Screenshot of the sales report automation project",
    "projects.p1.status": "Main project",
    "projects.p1.type": "Automation",
    "projects.p1.title": "Sales Report Automation",
    "projects.p1.desc":
      "Python script that reads sales data, calculates metrics and organizes results into a report. Shows logic, file handling and focus on productivity.",
    "projects.p1.tag.reports": "Reports",
    "projects.link.github": "See on GitHub",
    "projects.p2.imageAlt":
      "Screenshot of the sales analysis project with SQL",
    "projects.p2.status": "Data",
    "projects.p2.type": "Data",
    "projects.p2.title": "Sales Analysis with SQL",
    "projects.p2.desc":
      "SQL queries to investigate revenue, best-selling products and customer behavior.",
    "projects.p2.tag.analysis": "Analysis",
    "projects.p2.tag.insights": "Insights",
    "projects.p3.imageAlt": "Screenshot of the Snake game in Python",
    "projects.p3.status": "Logic",
    "projects.p3.type": "Logic",
    "projects.p3.title": "Snake Game",
    "projects.p3.desc":
      "Python game to practice events, collisions, scoring and flow organization.",
    "projects.p3.tag.gameloop": "Game loop",
    "projects.p3.tag.logic": "Logic",
    "projects.p4.imageAlt": "Screenshot of the calculator project in Python",
    "projects.p4.status": "Base",
    "projects.p4.type": "Fundamentals",
    "projects.p4.title": "Calculator",
    "projects.p4.desc":
      "Application created to practice functions, data input, math operations and basic validation.",
    "projects.p4.tag.functions": "Functions",
    "projects.p4.tag.operations": "Operations",

    "skills.kickerWord": "SKILLS",
    "skills.title":
      'Technical <span>experience</span>',
    "skills.subtitle":
      "Technologies I am studying and applying in personal projects.",
    "skills.category.language": "Language",
    "skills.python.desc":
      "Programming logic, automation scripts and introduction to back-end development with Python.",
    "skills.typescript.desc":
      "Taking a TypeScript course, learning static typing and good type-driven development practices.",
    "skills.category.versioning": "Versioning",
    "skills.git.desc":
      "Version control, repository creation, commits and project versioning with Git and GitHub.",
    "skills.category.fundamentals": "Fundamentals",
    "skills.logic.title": "Programming Logic",
    "skills.logic.desc":
      "Study of algorithms, control structures and problem solving with structured logical reasoning.",

    "journey.kicker": "Journey",
    "journey.title":
      'The path I am <span>building.</span>',
    "journey.intro":
      "My evolution happens in stages: first I build projects, then I deepen my knowledge and prepare to turn learning into professional experience.",
    "journey.step1.stage": "Now",
    "journey.step1.status": "In progress",
    "journey.step1.title": "Practical projects on GitHub",
    "journey.step1.desc":
      "Organizing repositories, improving descriptions and creating solutions with Python and SQL.",
    "journey.step2.stage": "Studies",
    "journey.step2.label": "Continuous growth",
    "journey.step2.title": "Python, data and web",
    "journey.step2.desc":
      "Consolidating logic, queries, page structure and best versioning practices.",
    "journey.tag.data": "Data",
    "journey.tag.web": "Web",
    "journey.step3.label": "Next milestone",
    "journey.step3.title": "High School graduation",
    "journey.step3.desc":
      "Preparation to enter the market as an intern or junior professional in training.",
    "journey.tag.internship": "Internship",
    "journey.tag.tech": "Technology",
    "journey.tag.career": "Career",
    "journey.message.label": "Professional goal",
    "journey.message.text":
      "Turn knowledge into real contribution within a team.",
    "journey.message.cta": "Let’s talk",

    "contact.kicker": "Contact",
    "contact.title":
      'Let’s talk about <span>an opportunity?</span>',
    "contact.text":
      "Fill out the form and the message will be sent directly to my email. I will reply using the address provided.",
    "contact.step1.title": "Send your message",
    "contact.step1.desc":
      "Provide details about the opportunity or project.",
    "contact.step2.title": "I receive by email",
    "contact.step2.desc":
      "The information arrives directly in my inbox.",
    "contact.step3.title": "I get in touch",
    "contact.step3.desc":
      "I will reply to the email provided in the form.",
    "contact.form.filename": "new_message.form",

    "form.name": "Name",
    "form.namePlaceholder": "Recruiter's name",
    "form.email": "Email",
    "form.emailPlaceholder": "name@company.com",
    "form.company": "Company",
    "form.optional": "Optional",
    "form.companyPlaceholder": "Company name",
    "form.subject": "Subject",
    "form.selectOption": "Select an option",
    "form.subject.internship": "Internship opportunity",
    "form.subject.junior": "Junior role",
    "form.subject.project": "Project",
    "form.subject.networking": "Networking",
    "form.subject.other": "Other topic",
    "form.message": "Message",
    "form.messagePlaceholder":
      "Tell me a little about the opportunity, company or project...",
    "form.honeypot": "Do not fill in this field",
    "form.hiddenSubject":
      "New message from the portfolio of Vinícius Alves",
    "form.submit": "Send message",
    "form.privacy":
      "Your data will only be used to reply to this message.",
    "form.success":
      "Message sent successfully! Thank you for reaching out.",
    "form.error":
      "The message could not be sent. Please try again or contact me on LinkedIn.",
    "form.email.required": "Email is required.",
    "form.email.spaces": "Email cannot contain spaces.",
    "form.email.dots": "Email cannot contain two consecutive dots.",
    "form.email.invalid": "Enter a valid email address.",
    "form.email.tooLong": "The email is too long.",
    "form.email.typo":
      "It looks like you meant {domain}. Please verify and try again.",
    "form.honeypotError":
      "The form cannot be sent. Remove data from the hidden field.",
    "form.configError":
      "The form is not configured correctly. Please try again later.",

    "footer.rights":
      "Vinícius Alves. Built with HTML, CSS and JavaScript."
  },

  es: {
    pageTitle:
      "Vinícius Alves | Python, Datos y Automatización",

    pageDescription:
      "Portafolio de Vinícius Alves, desarrollador Python en formación enfocado en datos, automatización y proyectos prácticos.",

    "language.select": "Seleccionar idioma",
    "language.available": "Idiomas disponibles",

    "accessibility.skipToContent": "Saltar al contenido",
    "accessibility.backHome": "Volver al inicio",
    "accessibility.mainNavigation": "Navegación principal",
    "accessibility.openMenu": "Abrir menú",
    "accessibility.closeMenu": "Cerrar menú",
    "accessibility.backToTop": "Volver arriba",

    "nav.home": "Inicio",
    "nav.about": "Sobre mí",
    "nav.projects": "Proyectos",
    "nav.skills": "Competencias",
    "nav.journey": "Jornada",
    "nav.contact": "Contacto",

    "hero.kicker": "Portafolio profesional",
    "hero.title":
      'Transformo mis estudios en proyectos de <span>Python, datos y automatización.</span>',
    "hero.description":
      "Soy Vinícius Alves, estudiante en formación para trabajar en desarrollo de software y análisis de datos. Estoy construyendo una base sólida mediante proyectos prácticos, documentación y evolución constante.",
    "hero.mainAreas": "Áreas principales",
    "hero.badge.automation": "Automatización",
    "hero.badge.data": "Datos",
    "hero.projectsButton": "Ver proyectos",
    "hero.contactButton": "Contactarme",
    "hero.professionalLinks": "Enlaces profesionales",
    "hero.professionalSummary": "Resumen profesional",
    "hero.photoAlt": "Foto profesional de Vinícius Alves",
    "hero.available": "Disponible para prácticas",
    "hero.pythonData": "Python & Datos",
    "hero.technicalSummary": "Resumen técnico",
    "hero.terminal.code":
      'perfil = {\n  "foco": "Python + SQL",\n  "interés": "Datos y automatización",\n  "meta": "Primera oportunidad"\n}',
    "hero.metric.projects": "proyectos publicados",
    "hero.metric.python": "scripts, lógica y automatización",
    "hero.metric.sql": "consultas y análisis de ventas",
    "hero.metric.graduation": "finalización de la escuela secundaria",
    "hero.marquee.automation": "Automatización",
    "hero.marquee.data": "Datos",

    "about.watermark": "SOBRE",
    "about.kicker": "Sobre mí",
    "about.title":
      'Aprendo construyendo,<span>probando y evolucionando.</span>',
    "about.subtitle":
      "Estoy construyendo mi entrada en el área de tecnología mediante estudios, proyectos prácticos y evolución constante.",
    "about.storyLabel": "Mi historia",
    "about.quote":
      '"Mi forma de aprender es transformar la teoría en algo que realmente funciona."',
    "about.story.p1":
      "Estoy en el 3º año de la escuela secundaria y he estado orientando mis estudios hacia la tecnología, principalmente Python, SQL, Git, GitHub y desarrollo web.",
    "about.story.p2":
      "Busco mi primera oportunidad o prácticas para aprender con personas experimentadas, contribuir con tareas reales y crecer de manera consistente dentro de un equipo.",
    "about.principle.learn.title": "Aprender",
    "about.principle.learn.desc": "Estudiar fundamentos con organización.",
    "about.principle.build.title": "Construir",
    "about.principle.build.desc": "Transformar conocimiento en proyectos.",
    "about.principle.evolve.title": "Evolucionar",
    "about.principle.evolve.desc": "Revisar, mejorar y documentar.",
    "about.focus.filename": "perfil_actual.py",
    "about.focus.label": "Enfoque actual",
    "about.focus.title": "Python, datos y automatización",
    "about.focus.desc":
      "Desarrollando una base técnica para crear soluciones, trabajar con información y resolver problemas utilizando programación.",
    "about.focus.code.foco": "<i>foco</i> = \"Python + SQL\"",
    "about.focus.code.objective":
      "<i>objetivo</i> = \"Primera oportunidad\"",
    "about.focus.code.profile":
      "<i>perfil</i> = \"Aprendizaje práctico\"",
    "about.info.education.label": "Formación",
    "about.info.education.title": "Escuela secundaria",
    "about.info.education.desc": "Finalización prevista para 2026.",
    "about.info.goal.label": "Objetivo",
    "about.info.goal.title": "Primera oportunidad",
    "about.info.goal.desc": "Prácticas o puesto junior en tecnología.",
    "about.info.diff.label": "Diferencial",
    "about.info.diff.title": "Aprendizaje práctico",
    "about.info.diff.desc": "Proyectos, organización y evolución continua.",

    "projects.kicker": "Proyectos",
    "projects.title":
      'Proyectos que muestran <span>evolución en código</span>, datos y entrega.',
    "projects.desc":
      "Esta área ahora funciona como una vitrina técnica: cada proyecto destaca el problema resuelto, la tecnología usada y el tipo de habilidad que demuestra para quien revisa tu perfil.",
    "projects.proof.logic": "Lógica aplicada",
    "projects.proof.data": "Datos y consultas",
    "projects.proof.automation": "Automatización práctica",
    "projects.console.label": "Resumen animado de proyectos",
    "projects.console.cmd":
      "vinicius@portfolio:~$ analizando_proyectos",
    "projects.console.python": "✓ Python: automatización y lógica",
    "projects.console.sql": "✓ SQL: consultas e insights",
    "projects.console.github":
      "✓ GitHub: repositorios publicados",
    "projects.filter.label": "Filtrar proyectos",
    "projects.filter.all": "Todos",
    "projects.filter.automation": "Automatización",
    "projects.filter.logic": "Lógica",
    "projects.p1.imageAlt":
      "Pantalla del proyecto de automatización de informe de ventas",
    "projects.p1.status": "Proyecto principal",
    "projects.p1.type": "Automatización",
    "projects.p1.title": "Automatización de informe de ventas",
    "projects.p1.desc":
      "Script en Python que lee datos de ventas, calcula indicadores y organiza resultados en un informe. Muestra lógica, manipulación de archivos y enfoque en productividad.",
    "projects.p1.tag.reports": "Informes",
    "projects.link.github": "Ver en GitHub",
    "projects.p2.imageAlt":
      "Pantalla del proyecto de análisis de ventas con SQL",
    "projects.p2.status": "Datos",
    "projects.p2.type": "Datos",
    "projects.p2.title": "Análisis de ventas con SQL",
    "projects.p2.desc":
      "Consultas SQL para investigar ingresos, productos más vendidos y comportamiento de clientes.",
    "projects.p2.tag.analysis": "Análisis",
    "projects.p2.tag.insights": "Insights",
    "projects.p3.imageAlt": "Pantalla del juego de la serpiente en Python",
    "projects.p3.status": "Lógica",
    "projects.p3.type": "Lógica",
    "projects.p3.title": "Juego de la serpiente",
    "projects.p3.desc":
      "Juego en Python para practicar eventos, colisiones, puntuación y organización del flujo.",
    "projects.p3.tag.gameloop": "Bucle de juego",
    "projects.p3.tag.logic": "Lógica",
    "projects.p4.imageAlt": "Pantalla del proyecto calculadora en Python",
    "projects.p4.status": "Base",
    "projects.p4.type": "Fundamentos",
    "projects.p4.title": "Calculadora",
    "projects.p4.desc":
      "Aplicación creada para practicar funciones, entrada de datos, operaciones matemáticas y validación básica.",
    "projects.p4.tag.functions": "Funciones",
    "projects.p4.tag.operations": "Operaciones",

    "skills.kickerWord": "HABILIDADES",
    "skills.title":
      'Experiencia <span>técnica</span>',
    "skills.subtitle":
      "Tecnologías que estoy estudiando y aplicando en proyectos personales.",
    "skills.category.language": "Lenguaje",
    "skills.python.desc":
      "Lógica de programación, scripts de automatización e introducción al desarrollo back-end con Python.",
    "skills.typescript.desc":
      "Realizando un curso de TypeScript, aprendiendo tipado estático y buenas prácticas de desarrollo orientado a tipos.",
    "skills.category.versioning": "Versionamiento",
    "skills.git.desc":
      "Control de versiones, creación de repositorios, commits y versionamiento de proyectos con Git y GitHub.",
    "skills.category.fundamentals": "Fundamentos",
    "skills.logic.title": "Lógica de programación",
    "skills.logic.desc":
      "Estudio de algoritmos, estructuras de control y resolución de problemas con razonamiento lógico estructurado.",

    "journey.kicker": "Jornada",
    "journey.title":
      'El camino que estoy <span>construyendo.</span>',
    "journey.intro":
      "Mi evolución ocurre por etapas: primero construyo proyectos, luego profundizo mis conocimientos y me preparo para transformar el aprendizaje en experiencia profesional.",
    "journey.step1.stage": "Ahora",
    "journey.step1.status": "En progreso",
    "journey.step1.title": "Proyectos prácticos en GitHub",
    "journey.step1.desc":
      "Organizando repositorios, mejorando descripciones y creando soluciones con Python y SQL.",
    "journey.step2.stage": "Estudios",
    "journey.step2.label": "Evolución continua",
    "journey.step2.title": "Python, datos y web",
    "journey.step2.desc":
      "Consolidando lógica, consultas, estructura de páginas y buenas prácticas de versionamiento.",
    "journey.tag.data": "Datos",
    "journey.tag.web": "Web",
    "journey.step3.label": "Próximo hito",
    "journey.step3.title": "Finalización de la escuela secundaria",
    "journey.step3.desc":
      "Preparación para ingresar al mercado como pasante o profesional junior en formación.",
    "journey.tag.internship": "Pasantía",
    "journey.tag.tech": "Tecnología",
    "journey.tag.career": "Carrera",
    "journey.message.label": "Objetivo profesional",
    "journey.message.text":
      "Transformar conocimiento en contribución real dentro de un equipo.",
    "journey.message.cta": "Hablemos",

    "contact.kicker": "Contacto",
    "contact.title":
      'Hablemos sobre <span>una oportunidad?</span>',
    "contact.text":
      "Completa el formulario y el mensaje se enviará directamente a mi correo electrónico. Responderé usando la dirección proporcionada.",
    "contact.step1.title": "Envía tu mensaje",
    "contact.step1.desc":
      "Indica los detalles de la oportunidad o proyecto.",
    "contact.step2.title": "Recibo por correo",
    "contact.step2.desc":
      "La información llega directamente a mi bandeja de entrada.",
    "contact.step3.title": "Me pongo en contacto",
    "contact.step3.desc":
      "Responderé al correo proporcionado en el formulario.",
    "contact.form.filename": "nuevo_mensaje.form",

    "form.name": "Nombre",
    "form.namePlaceholder": "Nombre del reclutador",
    "form.email": "Correo electrónico",
    "form.emailPlaceholder": "nombre@empresa.com",
    "form.company": "Empresa",
    "form.optional": "Opcional",
    "form.companyPlaceholder": "Nombre de la empresa",
    "form.subject": "Asunto",
    "form.selectOption": "Seleccione una opción",
    "form.subject.internship": "Oportunidad de prácticas",
    "form.subject.junior": "Puesto junior",
    "form.subject.project": "Proyecto",
    "form.subject.networking": "Networking",
    "form.subject.other": "Otro asunto",
    "form.message": "Mensaje",
    "form.messagePlaceholder":
      "Cuéntame un poco sobre la oportunidad, la empresa o el proyecto...",
    "form.honeypot": "No rellenes este campo",
    "form.hiddenSubject":
      "Nuevo mensaje desde el portafolio de Vinícius Alves",
    "form.submit": "Enviar mensaje",
    "form.privacy":
      "Tus datos solo se utilizarán para responder a este mensaje.",
    "form.success":
      "¡Mensaje enviado correctamente! Gracias por contactarme.",
    "form.error":
      "No se pudo enviar el mensaje. Inténtalo de nuevo o contáctame por LinkedIn.",
    "form.email.required": "El correo electrónico es obligatorio.",
    "form.email.spaces": "El correo electrónico no puede contener espacios.",
    "form.email.dots": "El correo electrónico no puede contener dos puntos consecutivos.",
    "form.email.invalid": "Ingresa una dirección de correo válida.",
    "form.email.tooLong": "El correo electrónico es demasiado largo.",
    "form.email.typo":
      "Parece que quisiste decir {domain}. Verifícalo e inténtalo de nuevo.",
    "form.honeypotError":
      "El formulario no se puede enviar. Elimina los datos del campo oculto.",
    "form.configError":
      "El formulario no está configurado correctamente. Inténtalo de nuevo más tarde.",

    "footer.rights":
      "Vinícius Alves. Desarrollado con HTML, CSS y JavaScript."
  }
};

const languageSettings = {
  "pt-BR": {
    flagClass: "flag-br",
    code: "PT",
    htmlLang: "pt-BR"
  },

  en: {
    flagClass: "flag-us",
    code: "EN",
    htmlLang: "en"
  },

  es: {
    flagClass: "flag-es",
    code: "ES",
    htmlLang: "es"
  }
};

let currentLanguage =
  localStorage.getItem("portfolio-language") ||
  "pt-BR";

function translate(key) {
  return (
    translations[currentLanguage]?.[key] ??
    translations["pt-BR"]?.[key] ??
    key
  );
}

window.translatePortfolioText = translate;

function applyLanguage(language) {
  if (!translations[language]) {
    language = "pt-BR";
  }

  currentLanguage = language;

  const settings = languageSettings[language];

  document.documentElement.lang =
    settings.htmlLang;

  document.title =
    translations[language].pageTitle;

  const description =
    document.querySelector(
      'meta[name="description"]'
    );

  if (description) {
    description.setAttribute(
      "content",
      translations[language].pageDescription
    );
  }

  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {
      const key =
        element.dataset.i18n;

      element.textContent =
        translate(key);
    });

  document
    .querySelectorAll("[data-i18n-html]")
    .forEach((element) => {
      const key =
        element.dataset.i18nHtml;

      element.innerHTML =
        translate(key);
    });

  document
    .querySelectorAll(
      "[data-i18n-placeholder]"
    )
    .forEach((element) => {
      const key =
        element.dataset.i18nPlaceholder;

      element.setAttribute(
        "placeholder",
        translate(key)
      );
    });

  document
    .querySelectorAll(
      "[data-i18n-aria-label]"
    )
    .forEach((element) => {
      const key =
        element.dataset.i18nAriaLabel;

      element.setAttribute(
        "aria-label",
        translate(key)
      );
    });

  document
    .querySelectorAll("[data-i18n-title]")
    .forEach((element) => {
      const key =
        element.dataset.i18nTitle;

      element.setAttribute(
        "title",
        translate(key)
      );
    });

  document
    .querySelectorAll("[data-i18n-value]")
    .forEach((element) => {
      const key =
        element.dataset.i18nValue;

      element.value =
        translate(key);
    });

  document
    .querySelectorAll("[data-i18n-alt]")
    .forEach((element) => {
      const key =
        element.dataset.i18nAlt;

      element.setAttribute(
        "alt",
        translate(key)
      );
    });

  if (languageCurrentFlag) {
    languageCurrentFlag.classList.remove(
      "flag-br",
      "flag-us",
      "flag-es"
    );

    languageCurrentFlag.classList.add(
      settings.flagClass
    );
  }

  if (languageCurrentCode) {
    languageCurrentCode.textContent =
      settings.code;
  }

  languageOptions.forEach((option) => {
    const isActive =
      option.dataset.language === language;

    option.classList.toggle(
      "active",
      isActive
    );

    option.setAttribute(
      "aria-checked",
      String(isActive)
    );
  });

  localStorage.setItem(
    "portfolio-language",
    language
  );

  document.dispatchEvent(
    new CustomEvent(
      "portfolioLanguageChange",
      {
        detail: {
          language
        }
      }
    )
  );
}

function openLanguageMenu() {
  if (
    !languageSwitcher ||
    !languageButton
  ) {
    return;
  }

  languageSwitcher.classList.add("open");

  languageButton.setAttribute(
    "aria-expanded",
    "true"
  );
}

function closeLanguageMenu() {
  if (
    !languageSwitcher ||
    !languageButton
  ) {
    return;
  }

  languageSwitcher.classList.remove("open");

  languageButton.setAttribute(
    "aria-expanded",
    "false"
  );
}

if (
  languageButton &&
  languageSwitcher
) {
  languageButton.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();

      const isOpen =
        languageSwitcher.classList
          .contains("open");

      if (isOpen) {
        closeLanguageMenu();
      } else {
        openLanguageMenu();
      }
    }
  );
}

languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    applyLanguage(
      option.dataset.language
    );

    closeLanguageMenu();

    languageButton?.focus();
  });
});

document.addEventListener("click", (event) => {
  if (
    languageSwitcher &&
    !languageSwitcher.contains(event.target)
  ) {
    closeLanguageMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLanguageMenu();
  }
});

applyLanguage(currentLanguage);
