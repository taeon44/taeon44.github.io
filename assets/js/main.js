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

document.querySelectorAll("[data-drag-scroll]").forEach((rail) => {
  const itemSelector = rail.dataset.dragItem || ".portrait-shot";
  const dragItems = [...rail.querySelectorAll(itemSelector)];
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let hasDragged = false;
  let suppressClick = false;
  let snapAnimationFrame = null;

  const stopSnapAnimation = () => {
    if (snapAnimationFrame !== null) {
      window.cancelAnimationFrame(snapAnimationFrame);
      snapAnimationFrame = null;
    }
    rail.classList.remove("is-settling");
  };

  const getItemPositions = () => {
    const railRect = rail.getBoundingClientRect();
    const scrollPadding = Number.parseFloat(window.getComputedStyle(rail).scrollPaddingLeft) || 0;
    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;

    return dragItems.map((item) => {
      const itemRect = item.getBoundingClientRect();
      return Math.min(
        maxScrollLeft,
        Math.max(0, rail.scrollLeft + itemRect.left - railRect.left - scrollPadding)
      );
    });
  };

  const getNearestIndex = (positions, scrollLeft) =>
    positions.reduce(
      (nearest, position, index) =>
        Math.abs(position - scrollLeft) < Math.abs(positions[nearest] - scrollLeft) ? index : nearest,
      0
    );

  const animateTo = (targetScrollLeft) => {
    const from = rail.scrollLeft;
    const distance = targetScrollLeft - from;

    if (Math.abs(distance) < 1) {
      rail.classList.remove("is-settling");
      return;
    }

    const duration = Math.min(480, Math.max(320, Math.abs(distance) * 1.1));
    const startedAt = window.performance.now();
    const animateSnap = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      rail.scrollLeft = from + distance * eased;

      if (progress < 1) {
        snapAnimationFrame = window.requestAnimationFrame(animateSnap);
        return;
      }

      snapAnimationFrame = null;
      rail.classList.remove("is-settling");
    };

    snapAnimationFrame = window.requestAnimationFrame(animateSnap);
  };

  const finishDrag = (shouldSnap = true) => {
    if (!isDragging) return;

    const willSnap = shouldSnap && hasDragged && dragItems.length > 0;
    if (hasDragged) {
      suppressClick = true;
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);
    }
    if (willSnap) rail.classList.add("is-settling");
    isDragging = false;
    rail.classList.remove("is-dragging");

    if (!willSnap) return;

    const positions = getItemPositions();
    const nearestIndex = getNearestIndex(positions, rail.scrollLeft);
    animateTo(positions[nearestIndex]);
  };

  rail.addEventListener("mousedown", (event) => {
    if (event.button !== 0 || !dragItems.length) return;

    event.preventDefault();
    stopSnapAnimation();
    isDragging = true;
    startX = event.clientX;
    startScrollLeft = rail.scrollLeft;
    hasDragged = false;
    rail.classList.add("is-dragging");
    rail.focus({ preventScroll: true });
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const distance = event.clientX - startX;
    if (Math.abs(distance) > 3) {
      hasDragged = true;
      event.preventDefault();
    }
    rail.scrollLeft = startScrollLeft - distance;
  });

  window.addEventListener("mouseup", () => finishDrag());
  window.addEventListener("blur", () => finishDrag(false));
  rail.addEventListener("dragstart", (event) => event.preventDefault());
  rail.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    },
    true
  );
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
