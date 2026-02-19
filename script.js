// ============================================
// FIREBASE AUTHENTICATION & FIRESTORE
// ============================================

let auth = null;
let db = null;
let currentUser = null;

// Initialize Firebase services
if (typeof firebase !== 'undefined') {
  auth = firebase.auth();
  db = firebase.firestore();
  
  // Auth state observer
  auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateAuthUI();
  });
}

// ============================================
// PARTICLES (Futuristic Hero Background)
// ============================================
function initParticles() {
  const el = document.getElementById("particles-js");
  if (!el) return;
  if (typeof particlesJS !== "function") return;
  
  try {
    particlesJS("particles-js", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.4, random: true },
        size: { value: 3, random: true },
        line_linked: { 
          enable: true, 
          distance: 150, 
          color: "#ffffff", 
          opacity: 0.2, 
          width: 1 
        },
        move: { 
          enable: true, 
          speed: 2.5, 
          direction: "none", 
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
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
  } catch (err) {
    console.warn("Particles init skipped:", err.message);
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const els = document.querySelectorAll(".animate-on-scroll");
  if (!els.length) return;
  
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => {
      el.classList.add("visible");
      el.querySelectorAll(".card-animate").forEach((c, i) => {
        c.style.setProperty("--i", i);
      });
    });
    return;
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.querySelectorAll(".card-animate").forEach((card, i) => {
            card.style.setProperty("--i", i);
          });
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  
  els.forEach((el) => observer.observe(el));
}

// ============================================
// AUTH MODAL
// ============================================
const authModal = document.getElementById("auth-modal");
const authOpenBtn = document.getElementById("auth-open-btn");
const authCloseBtn = document.getElementById("auth-close-btn");
const authSignupBtn = document.getElementById("auth-signup-btn");
const authLoginBtn = document.getElementById("auth-login-btn");
const authGoogleBtn = document.getElementById("auth-google-btn");
const authLogoutBtn = document.getElementById("auth-logout-btn");
const authStatus = document.getElementById("auth-status");
const authSuccessMessage = document.getElementById("auth-success-message");

if (authOpenBtn && authModal) {
  authOpenBtn.addEventListener("click", () => {
    authModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
}

if (authCloseBtn && authModal) {
  authCloseBtn.addEventListener("click", () => {
    closeAuthModal();
  });
}

if (authModal) {
  authModal.addEventListener("click", (e) => {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });
}

function closeAuthModal() {
  authModal.style.display = "none";
  document.body.style.overflow = "";
  authStatus.textContent = "";
  authSuccessMessage.style.display = "none";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

// ============================================
// FIREBASE AUTH FUNCTIONS
// ============================================

async function signUp() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    showAuthStatus("Please enter email and password", "error");
    return;
  }

  if (password.length < 6) {
    showAuthStatus("Password must be at least 6 characters", "error");
    return;
  }

  if (!auth) {
    showAuthStatus("Firebase not initialized. Please check firebase-config.js", "error");
    return;
  }

  try {
    showAuthStatus("Creating your account...", "loading");
    
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Save user data to Firestore
    if (db && user) {
      await db.collection("users").doc(user.uid).set({
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        progress: {
          guidesCompleted: 0,
          articlesRead: 0
        }
      }, { merge: true });
    }
    
    // Show success message
    showSuccessMessage();
    
    // Update member count (simulated)
    setTimeout(() => {
      closeAuthModal();
      updateAuthUI();
    }, 3000);
    
  } catch (error) {
    console.error("Sign up error:", error);
    showAuthStatus(getErrorMessage(error), "error");
  }
}

async function signIn() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    showAuthStatus("Please enter email and password", "error");
    return;
  }

  if (!auth) {
    showAuthStatus("Firebase not initialized. Please check firebase-config.js", "error");
    return;
  }

  try {
    showAuthStatus("Signing in...", "loading");
    
    await auth.signInWithEmailAndPassword(email, password);
    
    showAuthStatus("Welcome back!", "success");
    
    setTimeout(() => {
      closeAuthModal();
      updateAuthUI();
    }, 1500);
    
  } catch (error) {
    console.error("Sign in error:", error);
    showAuthStatus(getErrorMessage(error), "error");
  }
}

async function signInWithGoogle() {
  if (!auth) {
    showAuthStatus("Firebase not initialized. Please check firebase-config.js", "error");
    return;
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  
  try {
    showAuthStatus("Connecting with Google...", "loading");
    
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    // Save user data to Firestore
    if (db && user) {
      await db.collection("users").doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        progress: {
          guidesCompleted: 0,
          articlesRead: 0
        }
      }, { merge: true });
    }
    
    // Show success message
    showSuccessMessage();
    
    setTimeout(() => {
      closeAuthModal();
      updateAuthUI();
    }, 3000);
    
  } catch (error) {
    console.error("Google sign in error:", error);
    showAuthStatus(getErrorMessage(error), "error");
  }
}

async function signOut() {
  if (!auth) return;
  
  try {
    await auth.signOut();
    updateAuthUI();
    showAuthStatus("Signed out successfully", "success");
  } catch (error) {
    console.error("Sign out error:", error);
    showAuthStatus("Error signing out", "error");
  }
}

function showSuccessMessage() {
  authSuccessMessage.style.display = "block";
  authStatus.textContent = "";
  
  // Get member count (simulated - in production, fetch from Firestore)
  const memberCount = 10000 + Math.floor(Math.random() * 1000);
  const memberText = authSuccessMessage.querySelector("p");
  if (memberText) {
    memberText.innerHTML = `Welcome! You've joined <strong>${memberCount.toLocaleString()}+ members</strong> building their online income!`;
  }
}

function showAuthStatus(message, type = "info") {
  if (!authStatus) return;
  
  authStatus.textContent = message;
  authStatus.style.color = type === "error" ? "#f87171" : 
                          type === "success" ? "#86efac" : 
                          "#a855f7";
}

function getErrorMessage(error) {
  const errorMessages = {
    "auth/email-already-in-use": "This email is already registered. Please sign in instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password is too weak. Please use at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/network-request-failed": "Network error. Please check your connection.",
    "auth/popup-closed-by-user": "Sign-in popup was closed.",
    "auth/cancelled-popup-request": "Only one popup request is allowed at a time."
  };
  
  return errorMessages[error.code] || error.message || "An error occurred. Please try again.";
}

function updateAuthUI() {
  if (!authOpenBtn) return;
  
  if (currentUser) {
    authOpenBtn.innerHTML = `<i class="fas fa-user-check"></i> ${currentUser.email || "Account"}`;
    authOpenBtn.style.background = "rgba(34, 197, 94, 0.2)";
    authOpenBtn.style.border = "1px solid rgba(34, 197, 94, 0.4)";
    
    if (authLogoutBtn) {
      authLogoutBtn.style.display = "block";
    }
  } else {
    authOpenBtn.innerHTML = `<i class="fas fa-user"></i> Join Free`;
    authOpenBtn.style.background = "";
    authOpenBtn.style.border = "";
    
    if (authLogoutBtn) {
      authLogoutBtn.style.display = "none";
    }
  }
}

// Wire up auth buttons
if (authSignupBtn) {
  authSignupBtn.addEventListener("click", signUp);
}

if (authLoginBtn) {
  authLoginBtn.addEventListener("click", signIn);
}

if (authGoogleBtn) {
  authGoogleBtn.addEventListener("click", signInWithGoogle);
}

if (authLogoutBtn) {
  authLogoutBtn.addEventListener("click", signOut);
}

// ============================================
// DARK MODE (kept for compatibility)
// ============================================
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

// ============================================
// MOBILE MENU
// ============================================
const mobileBtn = document.getElementById("mobile-btn");
const navLinks = document.getElementById("nav-links");

if (mobileBtn && navLinks) {
  mobileBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
  
  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
      navLinks.classList.remove("show");
    }
  });
}

// ============================================
// SITE SEARCH
// ============================================
const searchInput = document.getElementById("site-search");
const searchResults = document.getElementById("search-results");

if (searchInput && searchResults) {
  const pages = [
    {
      title: "Home — Build Your Remote Wealth in 2026",
      description: "Master freelancing, investing, remote jobs, and digital income streams.",
      url: "index.html"
    },
    {
      title: "Top 10 Freelance Platforms in 2026",
      description: "Best freelance platforms: Upwork, Fiverr, Toptal and more.",
      url: "articles/1.html"
    },
    {
      title: "How to Earn Your First $1000 Online",
      description: "Step-by-step roadmap for beginners to earn their first $1000 online.",
      url: "articles/2.html"
    },
    {
      title: "2026 Investing Blueprint",
      description: "Safe investment strategies for beginners and long-term wealth building.",
      url: "articles/3.html"
    },
    {
      title: "About Project",
      description: "About the Remote Work & Freelancing Guide 2026 project.",
      url: "about.html"
    },
    {
      title: "Contact",
      description: "Contact form and information for questions and support.",
      url: "contact.html"
    },
    {
      title: "Privacy Policy",
      description: "Privacy policy and data protection information.",
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
      empty.textContent = "No results found. Try a different search term.";
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

  // Close search results when clicking outside
  document.addEventListener("click", e => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
      searchResults.style.display = "none";
    }
  });
}

// ============================================
// FAQ ACCORDION
// ============================================
document.querySelectorAll(".accordion-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const isActive = btn.classList.contains("active");
    
    // Close all accordions
    document.querySelectorAll(".accordion-toggle").forEach(b => {
      b.classList.remove("active");
      b.nextElementSibling.style.display = "none";
    });
    
    // Open clicked one if it wasn't active
    if (!isActive) {
      btn.classList.add("active");
      btn.nextElementSibling.style.display = "block";
    }
  });
});

// ============================================
// LAZY LOAD IMAGES
// ============================================
function lazyLoadImages() {
  const images = document.querySelectorAll("img[loading='lazy']");
  
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    images.forEach(img => img.classList.add("loaded"));
  }
}

// ============================================
// INITIALIZE ON LOAD
// ============================================
function init() {
  initParticles();
  initScrollAnimations();
  lazyLoadImages();
  updateAuthUI();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ============================================
// PERFORMANCE: Debounce scroll events
// ============================================
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ============================================
// SANITY CHECK
// ============================================
(function sanityCheck() {
  try {
    const hasNav = !!document.getElementById("nav-links");
    const hasParticles = !!document.getElementById("particles-js");
    const fontsOk = document.fonts && document.fonts.check ? document.fonts.check("1em Poppins") : true;
    
    if (!fontsOk && document.fonts.status !== "loaded") {
      document.fonts.ready.then(() => {});
    }
  } catch (_) {}
})();
