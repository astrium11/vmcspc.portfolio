const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section[id]");
const toast = document.querySelector("[data-toast]");
const imageModal = document.querySelector("[data-image-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
let activeLightboxCard = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (nav) nav.classList.remove("open");
  });
});

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-42% 0px -52% 0px", threshold: 0.01 });

sections.forEach((section) => activeSectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

function openImageModal(card) {
  const image = card.querySelector("img");
  if (!image || !imageModal || !modalImage || !modalTitle) return;

  activeLightboxCard = card;
  modalImage.src = image.currentSrc || image.src;
  modalImage.alt = image.alt;
  const heading = card.querySelector("h3");
  modalTitle.textContent = card.dataset.lightboxTitle || (heading ? heading.textContent : "Design sample");
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const closeButton = modalCloseButtons[modalCloseButtons.length - 1];
  if (closeButton) closeButton.focus();
}

function closeImageModal() {
  if (!imageModal || !modalImage) return;

  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalImage.src = "";
  if (activeLightboxCard) activeLightboxCard.focus();
  activeLightboxCard = null;
}

function getDesignCard(target) {
  if (!(target instanceof Element)) return null;
  return target.closest(".design-card");
}

document.addEventListener("click", (event) => {
  const card = getDesignCard(event.target);
  if (!card) return;
  openImageModal(card);
});

document.addEventListener("keydown", (event) => {
  const card = getDesignCard(event.target);
  if (!card || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  openImageModal(card);
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeImageModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageModal && imageModal.classList.contains("is-open")) {
    closeImageModal();
  }
});

const typeTarget = document.querySelector("[data-typing]");
const typeWords = ["Web Designer", "UI/UX Learner", "Problem Solver"];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typeTarget) return;
  const word = typeWords[wordIndex];
  typeTarget.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex += 1;
    setTimeout(typeLoop, 90);
    return;
  }

  if (!deleting && charIndex === word.length) {
    deleting = true;
    setTimeout(typeLoop, 1300);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 45);
    return;
  }

  deleting = false;
  wordIndex = (wordIndex + 1) % typeWords.length;
  setTimeout(typeLoop, 250);
}

typeLoop();

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast(`Copied: ${value}`);
    } catch {
      showToast(value);
    }
  });
});

const sendMessageButton = document.querySelector("[data-send-message]");

if (sendMessageButton) {
  sendMessageButton.addEventListener("click", () => {
    const subject = encodeURIComponent("Portfolio inquiry for Biya Macaspac");
    const body = encodeURIComponent("Hi Biya,\n\nI would like to discuss a project/opportunity with you.");
    window.location.href = `mailto:biyamacaspac@gmail.com?subject=${subject}&body=${body}`;
  });
}
