document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".navbar");
  const brand = document.querySelector("#brand");
  const mobileWidth = window.matchMedia("(max-width: 768px)");
  const homeSection = document.querySelector("#homeSection");
  const scrollToSection = document.getElementById("scroll-to-section");
  const navLinks = document.querySelectorAll(".nav-item");
  const typingText = document.getElementById("typingText");
  const cursor1 = document.getElementById("cursor1");
  const typingText2 = document.getElementById("typingText2");
  const cursor2 = document.getElementById("cursor2");
  const themeToggle = document.getElementById("themeToggle");
  const modal = document.getElementById("preview");
  const modalContent = document.querySelector(".modal-content");
  const closeButton = document.getElementById("closeButton");

  const heroName = "Johnathan Uptegraph";
  const heroPhrases = [
    "Robotics | Mechatronics | R&D Prototyping",
    "Control Systems | Embedded Software | Real-World Machines",
    "Rapid Prototyping | 3D Printing | Hardware Integration",
    "Building Systems That Work | Under Pressure and At Scale",
    "Multi-Robot Deployments | Advanced Automation Projects"
  ];

  // DARK MODE INIT
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  });

  // NAVBAR AND SCROLL-TO-SECTION VISIBILITY
  const observer = new IntersectionObserver(
    (entries) => {
      const isVisible = entries[0].isIntersecting;
      header.classList.toggle("navbarDark", !isVisible);
      brand.style.visibility = isVisible ? "hidden" : "visible";
      scrollToSection.style.display = isVisible ? "block" : "none";
    },
    { threshold: 0.1 }
  );
  observer.observe(homeSection);

  function setNavbarBrand() {
    brand.style.display = mobileWidth.matches ? "block" : "none";
  }
  setNavbarBrand();
  window.addEventListener("resize", setNavbarBrand);

  // NAVIGATION SCROLL
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.querySelector("a").getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navbarHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
      const menu = document.querySelector(".navbar-collapse");
      if (menu.classList.contains("show")) {
        new bootstrap.Collapse(menu).toggle();
      }
    });
  });

  // TYPING ANIMATION
  let nameIndex = 0;
  let phraseIndex = 0;
  let charIndex = 0;

  function typeName() {
    if (nameIndex < heroName.length) {
      typingText.textContent += heroName.charAt(nameIndex);
      nameIndex++;
      cursor1.style.left = typingText.offsetWidth + "px";
      setTimeout(typeName, 50);
    } else {
      cursor1.style.display = "none";
      cursor2.style.display = "inline";
      typingHeroPhrase();
    }
  }

  function typingHeroPhrase() {
    typingText2.textContent = "";
    const currentPhrase = heroPhrases[phraseIndex];
    charIndex = 0;
    typeChar(currentPhrase);
  }

  function typeChar(currentPhrase) {
    if (charIndex < currentPhrase.length) {
      typingText2.textContent += currentPhrase.charAt(charIndex);
      charIndex++;
      setTimeout(() => typeChar(currentPhrase), 40);
    } else {
      setTimeout(() => eraseHeroPhrase(currentPhrase), 1800);
    }
  }

  function eraseHeroPhrase(currentPhrase) {
    if (charIndex > 0) {
      typingText2.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(() => eraseHeroPhrase(currentPhrase), 20);
    } else {
      phraseIndex = (phraseIndex + 1) % heroPhrases.length;
      setTimeout(typingHeroPhrase, 300);
    }
  }

  setTimeout(typeName, 200);

  // MODAL FUNCTIONS
  function openModal(item) {
    const selectedProject = modalInfo[item.id];
    if (!selectedProject) return;

    modal.style.display = "flex";
    requestAnimationFrame(() => {
      modalContent.classList.add("active");
      modalContent.focus();
    });

    document.getElementById("modalImg").src = selectedProject.imgSource;
    document.getElementById("title").innerText = selectedProject.title;
    document.getElementById("info").innerText = selectedProject.info;
    const skillsElement = document.getElementById("skills");
    skillsElement.innerHTML = selectedProject.skills
      .map(skill => `<span class="skill-tag">${skill}</span>`)
      .join(" ");

    const liveButton = document.getElementById("live");
    const githubIcon = document.getElementById("github");
    liveButton.onclick = () => window.open(selectedProject.link, "_blank");

    githubIcon.classList.add("hidden");
    if (selectedProject.github) {
      githubIcon.classList.remove("hidden");
      githubIcon.className = "fab fa-github";
      githubIcon.onclick = () => window.open(selectedProject.github, "_blank");
    } else if (selectedProject.link && selectedProject.link.includes("github.com")) {
      githubIcon.classList.remove("hidden");
      githubIcon.className = "fab fa-github";
      githubIcon.onclick = () => window.open(selectedProject.link, "_blank");
    } else if (selectedProject.link) {
      githubIcon.classList.remove("hidden");
      githubIcon.className = "fas fa-link";
      githubIcon.onclick = () => window.open(selectedProject.link, "_blank");
    }
  }

  function closeModal() {
    modalContent.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
      document.querySelector(".navbar").focus();
    }, 400);
  }

  if (closeButton) {
    closeButton.onclick = closeModal;
    closeButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeModal();
      }
    });
  }

  window.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };

  // PORTFOLIO AND FEATURED ITEM INTERACTIONS
  const portfolioItems = document.querySelectorAll("#portfolio .item");
  const panels = document.querySelectorAll(".panel");
  let hoverTimeout;

  function handleHover(element, action, delay) {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      action(element);
    }, delay);
  }

  // Portfolio Items
  portfolioItems.forEach(item => {
    item.addEventListener("click", () => openModal(item));
    if (!mobileWidth.matches) {
      item.addEventListener("mouseenter", () => {
        handleHover(item, openModal, 1000);
      });
      item.addEventListener("mouseleave", () => {
        clearTimeout(hoverTimeout);
      });
    }
  });

  // Featured Section
  const backButton = document.querySelector(".back-button");
  let currentExpanded = null;
  let touchStartY = 0;
  let isSwiping = false;

  function preloadImages() {
    const images = [
      "./media/img/electric_vehicle_robotics.webp",
      "./media/img/medical_device_welding.webp",
      "./media/img/defense_material_handling.webp"
    ];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  function lockScroll() {
    document.body.classList.add("locked");
    document.documentElement.style.height = "100%";
  }

  function unlockScroll() {
    document.body.classList.remove("locked");
    document.documentElement.style.height = "auto";
  }

  function setupEventListeners() {
    panels.forEach(panel => {
      if (mobileWidth.matches) {
        panel.addEventListener("click", (e) => {
          if (!isSwiping) expandPanel(panel);
        });
      } else {
        panel.addEventListener("click", () => {
          expandPanel(panel);
        });
        panel.addEventListener("mouseenter", () => {
          handleHover(panel, expandPanel, 2000); // Increased delay to 2000ms
        });
        panel.addEventListener("mouseleave", () => {
          clearTimeout(hoverTimeout);
        });
      }

      panel.addEventListener("touchstart", handleTouchStart, { passive: false });
      panel.addEventListener("touchmove", handleTouchMove, { passive: false });
      panel.addEventListener("touchend", handleTouchEnd, { passive: false });

      panel.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          expandPanel(panel);
        }
      });

      const closeBtn = panel.querySelector(".close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          collapseAll();
        });
        closeBtn.addEventListener("touchend", (e) => {
          e.stopPropagation();
          collapseAll();
        });
      }
    });

    backButton.addEventListener("click", (e) => {
      e.stopPropagation();
      collapseAll();
    });
    backButton.addEventListener("touchend", (e) => {
      e.stopPropagation();
      collapseAll();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && currentExpanded) {
        collapseAll();
      } else if (e.key === "ArrowRight" && currentExpanded) {
        navigatePanels(1);
      } else if (e.key === "ArrowLeft" && currentExpanded) {
        navigatePanels(-1);
      }
    });

    window.addEventListener("resize", () => {
      handleWindowResize();
      updateCloseButtonIcon();
    });
  }

  function setupAccessibility() {
    panels.forEach(panel => {
      panel.setAttribute("tabindex", "0");
      panel.setAttribute("role", "button");
    });
  }

  function handleTouchStart(e) {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      isSwiping = false;
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 1 && currentExpanded) {
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      if (Math.abs(diff) > 10) {
        isSwiping = true;
        e.preventDefault();
      }
    }
  }

  function handleTouchEnd(e) {
    if (!currentExpanded && e.changedTouches.length === 1 && !isSwiping) {
      const touch = e.changedTouches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.closest(".panel")) {
        expandPanel(element.closest(".panel"));
      }
    }
    isSwiping = false;
  }

  function handleWindowResize() {
    if (currentExpanded) {
      if (window.innerWidth <= 768) {
        backButton.classList.add("visible");
        lockScroll();
      } else {
        backButton.classList.remove("visible");
        unlockScroll();
      }
    } else {
      unlockScroll();
    }
  }

  function navigatePanels(direction) {
    const currentIndex = Array.from(panels).indexOf(currentExpanded);
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = panels.length - 1;
    if (newIndex >= panels.length) newIndex = 0;
    expandPanel(panels[newIndex]);
  }

  function expandPanel(panel) {
    if (!panel || currentExpanded === panel) return;

    if (currentExpanded) {
      currentExpanded.classList.remove("expanded");
    }

    panel.classList.add("expanded");
    currentExpanded = panel;

    if (window.innerWidth <= 768) {
      backButton.classList.add("visible");
      lockScroll();
    } else {
      unlockScroll();
    }

    panel.focus();
  }

  function collapseAll() {
    panels.forEach(p => p.classList.remove("expanded"));
    currentExpanded = null;
    backButton.classList.remove("visible");
    unlockScroll();
    panels[0].focus();
  }

  function updateCloseButtonIcon() {
    const closeButtons = document.querySelectorAll(".close-btn");
    closeButtons.forEach(btn => {
      const icon = btn.querySelector("i");
      icon.className = window.innerWidth > 768 ? "fas fa-arrow-left" : "fas fa-times";
    });
  }

  function initFeaturedSection() {
    preloadImages();
    setupEventListeners();
    setupAccessibility();
    updateCloseButtonIcon();
  }

  initFeaturedSection();
});