/* ============================================================
   script.js – Vinícius Alves | Portfólio
   Módulos: navbar, partículas, reveal, rolagem suave,
            tema claro/escuro, internacionalização (PT/EN)
   ============================================================ */

/* ----------------------------------------------------------
   1. DICIONÁRIO DE TRADUÇÕES
   ---------------------------------------------------------- */
const translations = {
  pt: {
    'nav.home':       'Início',
    'nav.skills':     'Habilidades',
    'nav.experience': 'Experiência',
    'nav.projects':   'Projetos',
    'nav.contact':    'Contato',

    'hero.greeting':    'Olá, eu sou',
    'hero.subtitle':    'Análise de Dados | Tecnologia',
    'hero.description': 'Sou estudante do Ensino Médio e estou em formação na área de tecnologia. Tenho foco em desenvolvimento de software e análise de dados, buscando evolução constante por meio de projetos práticos e estudos estruturados.',
    'hero.btnProjects': 'Ver Projetos',
    'hero.btnContact':  'Entrar em Contato',

    'skills.title':    'Expertise Técnica',
    'skills.subtitle': 'Tecnologias que estou estudando e aplicando em projetos pessoais',
    'skills.python':     'Lógica de programação, scripts de automação e introdução ao desenvolvimento back-end com Python.',
    'skills.typescript': 'Realizando curso de TypeScript, aprendendo tipagem estática e boas práticas de desenvolvimento orientado a tipos.',
    'skills.git':        'Controle de versão, criação de repositórios, commits e versionamento de projetos com Git e GitHub.',
    'skills.logicName':  'Lógica de Programação',
    'skills.logic':      'Estudo de algoritmos, estruturas de controle e resolução de problemas com raciocínio lógico estruturado.',

    'exp.title':    'Experiência',
    'exp.subtitle': 'Minha jornada no mundo da tecnologia',

    'exp.edu.date':  '2025 – Conclusão prevista',
    'exp.edu.title': 'Formação – Ensino Médio',
    'exp.edu.desc':  'Cursando o 3º ano do Ensino Médio com foco paralelo em tecnologia. Buscando evolução constante por meio de estudos estruturados e projetos práticos.',
    'exp.edu.tag1':  'Ensino Médio – 3º ano',
    'exp.edu.tag2':  'Conclusão: 2025',

    'exp.tech.date':  'Experiência técnica',
    'exp.tech.title': 'Em Desenvolvimento',
    'exp.tech.desc':  'Atualmente construindo projetos próprios e aprimorando habilidades técnicas. Estudando Python, lógica de programação, Git, GitHub e realizando curso de TypeScript.',

    'exp.continuous.date':  'Desenvolvimento contínuo',
    'exp.continuous.title': 'Projetos Pessoais',
    'exp.continuous.desc':  'Desenvolvendo projetos próprios para portfólio. Aplicando conhecimentos adquiridos nos estudos para consolidar o aprendizado de forma prática.',
    'exp.continuous.li1': 'Estudando Python',
    'exp.continuous.li2': 'Aprendendo lógica de programação',
    'exp.continuous.li3': 'Praticando Git e GitHub',
    'exp.continuous.li4': 'Realizando curso de TypeScript',
    'exp.continuous.li5': 'Desenvolvendo projetos próprios para portfólio',

    'projects.title':    'Projetos',
    'projects.subtitle': 'Projetos desenvolvidos durante minha formação',
    'projects.btnGithub': 'Ver no GitHub',

    'projects.snake.name': 'Jogo da Cobrinha',
    'projects.snake.desc': 'Jogo desenvolvido em Python com foco em lógica de programação, controle de eventos e organização de código.',

    'projects.system.name': 'Sistema em Desenvolvimento',
    'projects.system.desc': 'Aplicação voltada para aprimoramento de lógica, estrutura de código e boas práticas de programação.',

    'projects.data.name': 'Projeto de Análise de Dados',
    'projects.data.desc': 'Projeto focado em manipulação e análise de dados utilizando Python para extração de insights.',

    'contact.title':    'Contato',
    'contact.subtitle': 'Vamos conversar? Entre em contato por qualquer canal abaixo',
    'contact.btnSend':  'Enviar Mensagem',

    'footer.text': '© 2026 Vinícius Alves – Desenvolvedor em Formação',
  },

  en: {
    'nav.home':       'Home',
    'nav.skills':     'Skills',
    'nav.experience': 'Experience',
    'nav.projects':   'Projects',
    'nav.contact':    'Contact',

    'hero.greeting':    'Hi, I am',
    'hero.subtitle':    'Data Analysis | Technology',
    'hero.description': 'I am a high school student building a career in technology. I focus on software development and data analysis, constantly evolving through hands-on projects and structured learning.',
    'hero.btnProjects': 'View Projects',
    'hero.btnContact':  'Get in Touch',

    'skills.title':    'Technical Expertise',
    'skills.subtitle': 'Technologies I am studying and applying in personal projects',
    'skills.python':     'Programming logic, automation scripts and introduction to back-end development with Python.',
    'skills.typescript': 'Taking a TypeScript course, learning static typing and best practices for type-driven development.',
    'skills.git':        'Version control, repository creation, commits and project versioning with Git and GitHub.',
    'skills.logicName':  'Programming Logic',
    'skills.logic':      'Study of algorithms, control structures and problem solving with structured logical reasoning.',

    'exp.title':    'Experience',
    'exp.subtitle': 'My journey in the world of technology',

    'exp.edu.date':  '2025 – Expected graduation',
    'exp.edu.title': 'Education – High School',
    'exp.edu.desc':  'Attending the 3rd year of high school with a parallel focus on technology. Constantly evolving through structured studies and practical projects.',
    'exp.edu.tag1':  'High School – 3rd year',
    'exp.edu.tag2':  'Graduation: 2025',

    'exp.tech.date':  'Technical experience',
    'exp.tech.title': 'In Development',
    'exp.tech.desc':  'Currently building personal projects and improving technical skills. Studying Python, programming logic, Git, GitHub and taking a TypeScript course.',

    'exp.continuous.date':  'Continuous development',
    'exp.continuous.title': 'Personal Projects',
    'exp.continuous.desc':  'Developing personal projects for portfolio. Applying knowledge acquired through studies to consolidate learning in a practical way.',
    'exp.continuous.li1': 'Studying Python',
    'exp.continuous.li2': 'Learning programming logic',
    'exp.continuous.li3': 'Practicing Git and GitHub',
    'exp.continuous.li4': 'Taking a TypeScript course',
    'exp.continuous.li5': 'Developing personal projects for portfolio',

    'projects.title':    'Projects',
    'projects.subtitle': 'Projects developed during my training',
    'projects.btnGithub': 'View on GitHub',

    'projects.snake.name': 'Snake Game',
    'projects.snake.desc': 'Game developed in Python focused on programming logic, event handling and code organization.',

    'projects.system.name': 'System in Development',
    'projects.system.desc': 'Application aimed at improving logic, code structure and programming best practices.',

    'projects.data.name': 'Data Analysis Project',
    'projects.data.desc': 'Project focused on data manipulation and analysis using Python to extract insights.',

    'contact.title':    'Contact',
    'contact.subtitle': 'Let\'s talk? Reach out through any channel below',
    'contact.btnSend':  'Send Message',

    'footer.text': '© 2026 Vinícius Alves – Developer in Training',
  }
};

/* ----------------------------------------------------------
   2. INTERNACIONALIZAÇÃO (i18n) com fade-out / fade-in
   ---------------------------------------------------------- */
let currentLang  = localStorage.getItem('lang') || 'pt';
let langAnimating = false;

function applyLanguage(lang) {
  if (lang === currentLang || langAnimating) return;
  langAnimating = true;

  const targets = document.querySelectorAll('[data-i18n]');

  /* Fade-out */
  targets.forEach(el => {
    el.style.transition = 'opacity 0.25s ease';
    el.style.opacity    = '0';
  });

  setTimeout(() => {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    const dict = translations[lang];

    /* Troca os textos enquanto estão invisíveis */
    targets.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    /* Atualiza lang e título */
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
    document.title = lang === 'pt'
      ? 'Vinícius Alves – Desenvolvedor em Formação'
      : 'Vinícius Alves – Developer in Training';

    /* Botões ativos */
    document.getElementById('btnPT').classList.toggle('active', lang === 'pt');
    document.getElementById('btnEN').classList.toggle('active', lang === 'en');

    /* Fade-in */
    targets.forEach(el => { el.style.opacity = '1'; });

    setTimeout(() => { langAnimating = false; }, 280);
  }, 270);
}

document.getElementById('btnPT').addEventListener('click', (e) => {
  triggerLangPress(e.currentTarget);
  applyLanguage('pt');
});
document.getElementById('btnEN').addEventListener('click', (e) => {
  triggerLangPress(e.currentTarget);
  applyLanguage('en');
});

function triggerLangPress(btn) {
  btn.classList.remove('pressing');
  void btn.offsetWidth; /* força reflow para reiniciar a animação */
  btn.classList.add('pressing');
  btn.addEventListener('animationend', () => btn.classList.remove('pressing'), { once: true });
}

/* ----------------------------------------------------------
   3. TEMA CLARO / ESCURO com transição suave
   ---------------------------------------------------------- */
const themeIcon    = document.getElementById('themeIcon');
let   currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme, animate = false) {
  currentTheme = theme;
  localStorage.setItem('theme', theme);

  if (animate) {
    /* Adiciona classe que ativa transição longa apenas durante a troca */
    document.documentElement.classList.add('theme-transitioning');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 500);
  }

  document.documentElement.setAttribute('data-theme', theme);

  themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

document.getElementById('themeToggle').addEventListener('click', (e) => {
  const btn = e.currentTarget;

  /* Rotação do ícone */
  btn.classList.add('spinning');
  btn.addEventListener('animationend', () => btn.classList.remove('spinning'), { once: true });

  /* Ripple a partir do centro do botão */
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width  = '36px';
  ripple.style.height = '36px';
  ripple.style.left   = '0px';
  ripple.style.top    = '0px';
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });

  applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
});

/* ----------------------------------------------------------
   4. NAVBAR – scroll + menu mobile + link ativo
   ---------------------------------------------------------- */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
});

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 80;

  sections.forEach(section => {
    const id = section.getAttribute('id');
    if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

/* ----------------------------------------------------------
   5. PARTÍCULAS FLUTUANTES – seção hero
   ---------------------------------------------------------- */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  for (let i = 0; i < 22; i++) {
    const p    = document.createElement('div');
    const size = Math.random() * 7 + 3;
    p.classList.add('particle');
    p.style.width             = `${size}px`;
    p.style.height            = `${size}px`;
    p.style.left              = `${Math.random() * 100}%`;
    p.style.top               = `${Math.random() * 100}%`;
    p.style.animationDuration = `${Math.random() * 8 + 5}s`;
    p.style.animationDelay    = `${Math.random() * 6}s`;
    p.style.opacity           = (Math.random() * 0.4 + 0.15).toFixed(2);
    container.appendChild(p);
  }
}

createParticles();

/* ----------------------------------------------------------
   6. ANIMAÇÃO DE REVEAL AO ROLAR
   ---------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const siblings = entry.target.parentElement.querySelectorAll('.reveal');
    let delay = 0;
    siblings.forEach((s, i) => { if (s === entry.target) delay = i * 100; });

    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ----------------------------------------------------------
   7. ROLAGEM SUAVE (fallback)
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
    }
  });
});

/* ----------------------------------------------------------
   8. EFEITO DE LUZ SUAVE DO CURSOR
   ---------------------------------------------------------- */
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0, glowVisible = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!glowVisible) {
    glowVisible = true;
    cursorGlow.style.opacity = '1';
  }
});

document.addEventListener('mouseleave', () => {
  glowVisible = false;
  cursorGlow.style.opacity = '0';
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.1;
  glowY += (mouseY - glowY) * 0.1;
  cursorGlow.style.left = `${glowX}px`;
  cursorGlow.style.top  = `${glowY}px`;
  requestAnimationFrame(animateGlow);
}

animateGlow();

/* ----------------------------------------------------------
   9. SISTEMA DE ANALYTICS PRIVADO
   ---------------------------------------------------------- */
class PrivateAnalytics {
  constructor() {
    this.visitId = null;
    this.trackedPages = new Set();
    this.init();
  }

  async init() {
    try {
      await this.trackVisit();
      this.trackPageView();
      this.setupPageTracking();
    } catch (error) {
      console.log('Analytics: erro inicialização', error);
    }
  }

  async trackVisit() {
    const visitData = {
      ip: await this.getClientIP(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direto',
      country: 'Desconhecido',
      city: 'Desconhecido'
    };

    try {
      const response = await fetch('/api/track-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitData)
      });

      if (response.ok) {
        const data = await response.json();
        this.visitId = data.visitId;
      }
    } catch (error) {
      console.log('Analytics: erro ao registrar visita', error);
    }
  }

  async trackPageView() {
    if (!this.visitId) return;

    const page = window.location.pathname;
    if (this.trackedPages.has(page)) return;

    this.trackedPages.add(page);

    try {
      await fetch('/api/track-page-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visitId: this.visitId,
          page: page
        })
      });
    } catch (error) {
      console.log('Analytics: erro ao registrar página', error);
    }
  }

  setupPageTracking() {
    // Rastrear mudanças de página (se usar SPA no futuro)
    let lastPage = window.location.pathname;
    
    setInterval(() => {
      const currentPage = window.location.pathname;
      if (currentPage !== lastPage) {
        lastPage = currentPage;
        this.trackPageView();
      }
    }, 1000);

    // Rastrear quando usuário volta para a aba
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.trackPageView();
      }
    });
  }

  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'desconhecido';
    }
  }
}

// Inicializar analytics apenas se não for página admin
if (!window.location.pathname.includes('/admin')) {
  new PrivateAnalytics();
}

/* ----------------------------------------------------------
   10. INICIALIZAÇÃO – aplica preferências salvas
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLanguage(currentLang);
  updateActiveLink();
});
