const header = document.querySelector("[data-header]");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const mainImage = gallery.querySelector("[data-gallery-main]");
  const buttons = [...gallery.querySelectorAll("[data-src]")];

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!mainImage || button.classList.contains("is-active")) return;

      buttons.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      mainImage.classList.add("is-changing");

      window.setTimeout(() => {
        mainImage.src = button.dataset.src;
        mainImage.alt = button.dataset.alt;
        mainImage.classList.remove("is-changing");
      }, 150);
    });
  });
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
