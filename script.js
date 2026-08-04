// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

// Close the mobile menu when a link is clicked
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== Scroll reveal =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

function forceReveal(el) {
  el.classList.add("visible");
  revealObserver.unobserve(el);
}

// Observe reveal elements; anything already scrolled past shows immediately
// (covers loading the page with a #hash in the URL)
document.querySelectorAll(".reveal").forEach((el) => {
  if (el.getBoundingClientRect().bottom < 0) forceReveal(el);
  else revealObserver.observe(el);
});

// Anchor navigation lands mid-page before the observer has fired, which would
// briefly show an empty section. Reveal the target section instantly instead.
function revealHashTarget(hash) {
  if (!hash || hash.length < 2) return;
  let target;
  try {
    target = document.querySelector(hash);
  } catch {
    return;
  }
  if (!target) return;
  if (target.classList.contains("reveal")) forceReveal(target);
  target.querySelectorAll(".reveal").forEach(forceReveal);
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href]");
  if (link && link.hash && link.pathname === location.pathname) {
    revealHashTarget(link.hash);
  }
});
window.addEventListener("hashchange", () => revealHashTarget(location.hash));
revealHashTarget(location.hash);

// ===== Animated counters for the stats =====
// en-US grouping everywhere so all visitors see e.g. "1,000+", not "1.000+".
// A "+" is appended to the final value when the element has a data-plus
// attribute (or the number is 1000 or more).
function statHasPlus(el, target) {
  return "plus" in el.dataset || target >= 1000;
}

function formatCount(value, target, plus) {
  return value.toLocaleString("en-US") + (plus && value === target ? "+" : "");
}

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const plus = statHasPlus(el, target);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatCount(Math.round(target * eased), target, plus);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

// The HTML ships with the final number as no-JS fallback text. With JS (and
// motion allowed) reset to 0 so the count-up starts from zero; with reduced
// motion just normalize to the final formatted value, no animation.
document.querySelectorAll(".stat-num").forEach((el) => {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return; // text-only stat (e.g. "Delhi NCR"), no animation
  if (prefersReducedMotion) {
    el.textContent = formatCount(target, target, statHasPlus(el, target));
  } else {
    el.textContent = "0";
    statObserver.observe(el);
  }
});
