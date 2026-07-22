document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.style.opacity = "0";
      setTimeout(() => preloader.remove(), 400);
    });
  }

  /**
   * Include header.html / footer.html into their containers,
   * then wire up the behaviour that depends on that markup existing.
   */
  function includeHTML(containerId, source, afterInsert) {
    const container = document.getElementById(containerId);
    if (!container) return;

    fetch(source)
      .then((response) => response.text())
      .then((html) => {
        container.innerHTML = html;
        if (typeof afterInsert === "function") afterInsert();
      })
      .catch((error) => console.error(`Error fetching ${source}:`, error));
  }

  includeHTML("header-container", "header.html", initHeader);
  includeHTML("footer-container", "footer.html");

  function initHeader() {
    setActiveNavLink();
    initMobileNav();
  }

  /**
   * Highlight the nav link matching the current page
   */
  function setActiveNavLink() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#navbar a").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const li = link.closest("li");
      if (href === current || (current === "" && href === "index.html")) {
        if (li) li.classList.add("active");
      }
    });
  }

  /**
   * Mobile nav toggle
   */
  function initMobileNav() {
    const toggles = document.querySelectorAll(".mobile-nav-toggle");
    toggles.forEach((el) => {
      el.addEventListener("click", (event) => {
        event.preventDefault();
        document.body.classList.toggle("mobile-nav-active");
        toggles.forEach((t) => t.classList.toggle("d-none"));
      });
    });

    document.querySelectorAll("#navbar a").forEach((link) => {
      link.addEventListener("click", () => {
        if (document.body.classList.contains("mobile-nav-active")) {
          document.body.classList.remove("mobile-nav-active");
          toggles.forEach((t, i) => t.classList.toggle("d-none", i === 1));
        }
      });
    });
  }

  /**
   * Scroll-top button
   */
  const scrollTop = document.querySelector(".scroll-top");
  if (scrollTop) {
    const toggleScrollTop = () => {
      window.scrollY > 200
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    };
    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop);
    scrollTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /**
   * AOS - scroll animations
   */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: "ease-out-quart",
      once: true,
      offset: 60,
    });
  }

  /**
   * PureCounter - animated stat counters
   */
  if (window.PureCounter) {
    new PureCounter();
  }

  /**
   * GLightbox - image/photo popups (wire up once real photography is added)
   */
  if (window.GLightbox) {
    GLightbox({ selector: ".glightbox" });
  }

  /**
   * Swiper - image placeholder / gallery sliders (".gallery-swiper")
   */
  if (window.Swiper) {
    document.querySelectorAll(".gallery-swiper").forEach((el) => {
      new Swiper(el, {
        loop: true,
        autoplay: { delay: 3800, disableOnInteraction: false },
        speed: 700,
        slidesPerView: 1,
        pagination: {
          el: el.querySelector(".swiper-pagination"),
          clickable: true,
        },
      });
    });

    /**
     * Hero slider (home page only)
     */
    const heroSwiper = document.querySelector(".hero-swiper");
    if (heroSwiper) {
      new Swiper(heroSwiper, {
        loop: true,
        autoplay: { delay: 5500, disableOnInteraction: false },
        speed: 900,
        effect: "fade",
        fadeEffect: { crossFade: true },
        pagination: {
          el: heroSwiper.querySelector(".swiper-pagination"),
          clickable: true,
        },
      });
    }
  }

  /**
   * Updates hub - category filter
   */
  const filterRow = document.querySelector(".filter-row");
  if (filterRow) {
    const buttons = filterRow.querySelectorAll("button");
    const posts = document.querySelectorAll(".post-card");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.getAttribute("data-filter");
        posts.forEach((post) => {
          const show = cat === "all" || post.getAttribute("data-category") === cat;
          post.style.display = show ? "" : "none";
        });
      });
    });
  }

  /**
   * Contact form - basic client-side handling (mailto fallback, no backend wired up yet)
   */
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = contactForm.querySelector(".form-note");
      if (status) status.textContent = "Thanks, this form isn't wired to a backend yet, please email or call us directly.";
    });
  }
});
