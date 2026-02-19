// ============================================
// FIREBASE AUTHENTICATION & FIRESTORE
// ============================================

let auth = null;
let db = null;
let currentUser = null;

// Initialize Firebase services after config is loaded
function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Please check firebase-config.js');
    return false;
  }
  
  try {
    // Ensure Firebase is initialized
    if (firebase.apps.length === 0) {
      console.error('Firebase not initialized. Check firebase-config.js');
      return false;
    }
    
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Auth state observer
    auth.onAuthStateChanged((user) => {
      currentUser = user;
      updateAuthUI();
    });
    
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}

// Firebase will be initialized in main init() function

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

function openAuthModal() {
  if (!authModal) {
    console.error("Auth modal not found");
    return;
  }
  
  try {
    authModal.style.display = "flex";
    authModal.classList.add("auth-modal-visible");
    document.body.style.overflow = "hidden";
    
    if (authSuccessMessage) authSuccessMessage.style.display = "none";
    
    const emailEl = document.getElementById("email");
    const pwdEl = document.getElementById("password");
    if (emailEl) emailEl.value = "";
    if (pwdEl) pwdEl.value = "";
    if (authStatus) authStatus.textContent = "";
    
    // Focus on email input for better UX
    setTimeout(() => {
      if (emailEl) emailEl.focus();
    }, 100);
  } catch (error) {
    console.error("Error opening auth modal:", error);
  }
}

function closeAuthModal() {
  if (!authModal) return;
  
  try {
    authModal.classList.remove("auth-modal-visible");
    authModal.style.display = "none";
    document.body.style.overflow = "";
    
    if (authStatus) authStatus.textContent = "";
    if (authSuccessMessage) authSuccessMessage.style.display = "none";
    
    const emailEl = document.getElementById("email");
    const pwdEl = document.getElementById("password");
    if (emailEl) emailEl.value = "";
    if (pwdEl) pwdEl.value = "";
  } catch (error) {
    console.error("Error closing auth modal:", error);
  }
}

if (authOpenBtn && authModal) {
  authOpenBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openAuthModal();
  });
}

if (authCloseBtn && authModal) {
  authCloseBtn.addEventListener("click", closeAuthModal);
}

if (authModal) {
  authModal.addEventListener("click", (e) => {
    if (e.target === authModal) closeAuthModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && authModal && authModal.style.display === "flex") {
    closeAuthModal();
  }
});

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

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAuthStatus("Please enter a valid email address", "error");
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
      try {
        await db.collection("users").doc(user.uid).set({
          email: user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          progress: {
            guidesCompleted: 0,
            articlesRead: 0
          }
        }, { merge: true });
      } catch (firestoreError) {
        console.error("Firestore save error:", firestoreError);
        // Continue even if Firestore save fails
      }
    }
    
    // Show success message
    showSuccessMessage();
    
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

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAuthStatus("Please enter a valid email address", "error");
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

  if (typeof firebase === 'undefined' || !firebase.auth) {
    showAuthStatus("Firebase Auth not available", "error");
    return;
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  
  try {
    showAuthStatus("Connecting with Google...", "loading");
    
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    // Save user data to Firestore
    if (db && user) {
      try {
        await db.collection("users").doc(user.uid).set({
          email: user.email,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          progress: {
            guidesCompleted: 0,
            articlesRead: 0
          }
        }, { merge: true });
      } catch (firestoreError) {
        console.error("Firestore save error:", firestoreError);
        // Continue even if Firestore save fails
      }
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
  if (!authSuccessMessage) return;
  
  authSuccessMessage.style.display = "block";
  if (authStatus) authStatus.textContent = "";
  
  // Show success message
  const memberText = authSuccessMessage.querySelector("p");
  if (memberText) {
    memberText.innerHTML = `Welcome! You've joined <strong>10,000+ members</strong> building their online income!`;
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
  if (!error) return "An error occurred. Please try again.";
  
  const errorMessages = {
    "auth/email-already-in-use": "This email is already registered. Please sign in instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password is too weak. Please use at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/network-request-failed": "Network error. Please check your internet connection and try again.",
    "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
    "auth/cancelled-popup-request": "Only one popup request is allowed at a time. Please wait.",
    "auth/popup-blocked": "Popup was blocked. Please allow popups for this site and try again.",
    "auth/operation-not-allowed": "This sign-in method is not enabled. Please contact support.",
    "auth/too-many-requests": "Too many failed attempts. Please try again later.",
    "auth/user-disabled": "This account has been disabled. Please contact support."
  };
  
  return errorMessages[error.code] || (error.message || "An error occurred. Please try again.");
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

// Wire up auth buttons (ensure they're set up after DOM is ready)
function setupAuthButtons() {
  if (authSignupBtn) {
    authSignupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      signUp();
    });
  }

  if (authLoginBtn) {
    authLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      signIn();
    });
  }

  if (authGoogleBtn) {
    authGoogleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      signInWithGoogle();
    });
  }

  if (authLogoutBtn) {
    authLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      signOut();
    });
  }
}

// Auth buttons will be setup in main init() function

// ============================================
// THEME TOGGLE (Dark/Light Mode)
// ============================================
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  // Apply saved theme or default to dark (since site is dark-themed)
  const savedTheme = localStorage.getItem("theme") || "dark";
  const isDark = savedTheme === "dark";
  
  if (isDark) {
    document.body.classList.add("dark");
    toggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    toggle.textContent = "🌙";
  }

  // Update CSS variables on initialization
  updateThemeVariables(isDark);

  // Toggle theme on click
  toggle.addEventListener("click", () => {
    const isCurrentlyDark = document.body.classList.contains("dark");
    
    if (isCurrentlyDark) {
      document.body.classList.remove("dark");
      toggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
      updateThemeVariables(false);
    } else {
      document.body.classList.add("dark");
      toggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
      updateThemeVariables(true);
    }
  });
}

function updateThemeVariables(isDark) {
  const root = document.documentElement;
  
  if (isDark) {
    // Dark mode colors (default theme)
    root.style.setProperty('--bg-primary', '#0f0c29');
    root.style.setProperty('--bg-secondary', '#1a1533');
    root.style.setProperty('--text-primary', '#e2e8f0');
    root.style.setProperty('--text-secondary', 'rgba(226, 232, 240, 0.8)');
    root.style.setProperty('--card-bg', 'rgba(15, 12, 41, 0.6)');
    root.style.setProperty('--border-color', 'rgba(124, 58, 237, 0.3)');
  } else {
    // Light mode colors
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f8f9fa');
    root.style.setProperty('--text-primary', '#1a1a1a');
    root.style.setProperty('--text-secondary', 'rgba(26, 26, 26, 0.8)');
    root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)');
    root.style.setProperty('--border-color', 'rgba(124, 58, 237, 0.2)');
  }
}

// ============================================
// MOBILE MENU (Hamburger with animation)
// ============================================
function initMobileMenu() {
  const mobileBtn = document.getElementById("mobile-btn");
  const navLinks = document.getElementById("nav-links");

  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const isOpen = navLinks.classList.contains("show");
    
    if (isOpen) {
      navLinks.classList.remove("show");
      mobileBtn.classList.remove("is-open");
      mobileBtn.setAttribute("aria-expanded", "false");
    } else {
      navLinks.classList.add("show");
      mobileBtn.classList.add("is-open");
      mobileBtn.setAttribute("aria-expanded", "true");
    }
  });

  // Close when clicking a nav link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      mobileBtn.classList.remove("is-open");
      mobileBtn.setAttribute("aria-expanded", "false");
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("show") && 
        !navLinks.contains(e.target) && 
        !mobileBtn.contains(e.target)) {
      navLinks.classList.remove("show");
      mobileBtn.classList.remove("is-open");
      mobileBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// Mobile menu will be initialized in main init() function

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
  try {
    // Initialize Firebase first
    initFirebase();
    
    // Setup UI components
    initParticles();
    initScrollAnimations();
    lazyLoadImages();
    initThemeToggle();
    initMobileMenu();
    setupAuthButtons();
    updateAuthUI();
  } catch (error) {
    console.error("Initialization error:", error);
  }
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
