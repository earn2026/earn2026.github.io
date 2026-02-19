// ==========================
// PARTICLES (futuristic 2026 hero)
// ==========================
function initParticles() {
  const el = document.getElementById("particles-js");
  if (el && typeof particlesJS === "function") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 900 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.4, random: true },
        size: { value: 2.5, random: true },
        line_linked: { enable: true, distance: 140, color: "#ffffff", opacity: 0.25, width: 0.8 },
        move: { enable: true, speed: 2.5, direction: "none", out_mode: "out" }
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initParticles);
} else {
  initParticles();
}

// ==========================
// SCROLL ANIMATIONS (fade-in on scroll)
// ==========================
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          const cards = entry.target.querySelectorAll(".card-animate");
          cards.forEach((card, i) => {
            card.style.setProperty("--i", i);
          });
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );
  document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollAnimations);
} else {
  initScrollAnimations();
}

// ==========================
// DARK MODE
// ==========================
const toggle = document.getElementById("theme-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggle.textContent = "☀️";
  }
}

// ==========================
// MOBILE MENU
// ==========================
const mobileBtn = document.getElementById("mobile-btn");
const navLinks = document.getElementById("nav-links");

if (mobileBtn && navLinks) {
  mobileBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

// ==========================
// SIMPLE SITE SEARCH
// ==========================
const searchInput = document.getElementById("site-search");
const searchResults = document.getElementById("search-results");

if (searchInput && searchResults) {
  const pages = [
    {
      title: "Главная — Make Money Online 2026",
      description: "Обзор, гайды по фрилансу, удалённой работе, инвестициям и пассивному доходу.",
      url: "index.html"
    },
    {
      title: "Top 10 Freelance Platforms in 2026",
      description: "Лучшие фриланс‑платформы: Upwork, Fiverr, Toptal и др.",
      url: "articles/1.html"
    },
    {
      title: "How to Earn Your First $1000 Online",
      description: "Пошаговый план, как заработать первые $1000 онлайн.",
      url: "articles/2.html"
    },
    {
      title: "2026 Investing Blueprint",
      description: "Безопасные инвестиционные стратегии для новичков.",
      url: "articles/3.html"
    },
    {
      title: "About Project",
      description: "О проекте Remote Work & Freelancing Guide 2026.",
      url: "about.html"
    },
    {
      title: "Contact",
      description: "Форма связи и контакты для вопросов.",
      url: "contact.html"
    },
    {
      title: "Privacy Policy",
      description: "Политика конфиденциальности сайта.",
      url: "privacy.html"
    }
  ];

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (!q) {
      searchResults.style.display = "none";
      return;
    }

    const filtered = pages.filter(page => {
      const haystack = (page.title + " " + page.description).toLowerCase();
      return haystack.includes(q);
    });

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "Ничего не найдено. Попробуйте другой запрос.";
      searchResults.appendChild(empty);
    } else {
      filtered.forEach(page => {
        const item = document.createElement("div");
        item.className = "search-result-item";
        item.innerHTML = `<strong>${page.title}</strong><span>${page.description}</span>`;
        item.addEventListener("click", () => {
          window.location.href = page.url;
        });
        searchResults.appendChild(item);
      });
    }

    searchResults.style.display = "block";
  }

  searchInput.addEventListener("input", e => {
    renderResults(e.target.value);
  });

  // Закрывать выпадающий список при клике вне поиска
  document.addEventListener("click", e => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
      searchResults.style.display = "none";
    }
  });
}

// ==========================
// FAQ ACCORDION
// ==========================
document.querySelectorAll(".accordion-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const content = btn.nextElementSibling;
    content.style.display =
      content.style.display === "block" ? "none" : "block";
  });
});

// ==========================
// SUPABASE CONFIG (опционально)
// ==========================

// Чтобы лендинг не зависел жёстко от внешнего SDK,
// Supabase используется только если window.supabase доступен.

if (window.supabase && typeof window.supabase.createClient === "function") {
  const supabaseUrl = "https://dvbpfcpuulsqvwmnyudj.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2YnBmY3B1dWxzcXZ3bW55dWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMzM3NDcsImV4cCI6MjA4NjcwOTc0N30.bOF2hFh7rEEPTVsGwuyrXv3eqiR_cFpBoOaYzLP_JOg";

  const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

  // ==========================
  // SIGN UP
  // ==========================
  async function signUp() {
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    const { error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
    } else {
      // Редирект на основной сайт
      window.location.href = "https://earn2026.github.io/";
    }
  }

  // ==========================
  // SIGN IN
  // ==========================
  async function signIn() {
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
    } else {
      // Редирект на основной сайт
      window.location.href = "https://earn2026.github.io/";
    }
  }

  // ==========================
  // AUTO REDIRECT IF LOGGED IN
  // ==========================
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session) {
      window.location.href = "https://earn2026.github.io/";
    }
  });
}
