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

  // DARK MODE INIT - Set dark mode as default
  if (localStorage.getItem("darkMode") === null) {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
    localStorage.setItem("darkMode", "true");
  } else if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.checked = false;
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

  // SCROLL-TO-SECTION (HERO ARROW) SCROLL
  scrollToSection.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = scrollToSection.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navbarHeight = header.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
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
    liveButton.href = selectedProject.link || "#";
    liveButton.onclick = (e) => {
      if (selectedProject.link) window.open(selectedProject.link, "_blank");
      else e.preventDefault();
    };

    githubIcon.classList.add("hidden");
    githubIcon.href = "#";
    if (selectedProject.github) {
      githubIcon.classList.remove("hidden");
      githubIcon.className = "fab fa-github";
      githubIcon.href = selectedProject.github;
    } else if (selectedProject.link && selectedProject.link.includes("github.com")) {
      githubIcon.classList.remove("hidden");
      githubIcon.className = "fab fa-github";
      githubIcon.href = selectedProject.link;
    }
  }

  function closeModal() {
    modalContent.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  }

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // PORTFOLIO GENERATION
  const portfolioContainer = document.getElementById("portfolioContainer");
  Object.keys(modalInfo).forEach((key, index) => {
    const project = modalInfo[key];
    const portfolioItem = document.createElement("div");
    portfolioItem.className = "item";
    portfolioItem.id = key;
    portfolioItem.innerHTML = `
      <img src="${project.imgSource}" alt="${project.title}" loading="lazy">
      <div class="text">
        <h5>${project.title}</h5>
        <p>${project.info}</p>
      </div>
      <a class="button">Learn More</a>
    `;
    // Make the entire card clickable
    portfolioItem.addEventListener("click", () => openModal(portfolioItem));
    portfolioContainer.appendChild(portfolioItem);
  });

  // FEATURED PROJECTS PANEL HANDLING
  const panels = document.querySelectorAll(".panel");
  const backBtn = document.querySelector(".back-btn");

  function togglePanel(e) {
    const panel = e.currentTarget;
    const isExpanded = panel.classList.contains("expanded");

    panels.forEach(p => {
      p.classList.remove("expanded");
      p.style.display = "flex";
    });

    if (!isExpanded) {
      panel.classList.add("expanded");
      backBtn.classList.add("visible");
    } else {
      backBtn.classList.remove("visible");
    }
  }

  panels.forEach(panel => {
    panel.addEventListener("click", togglePanel);
  });

  backBtn.addEventListener("click", () => {
    panels.forEach(p => {
      p.classList.remove("expanded");
      p.style.display = "flex";
    });
    backBtn.classList.remove("visible");
  });

  // CLOSE PANELS ON SECTION CHANGE
  const sections = document.querySelectorAll("section");
  const observerOptions = { threshold: 0.3 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id !== "featuredSection") {
        panels.forEach(p => {
          p.classList.remove("expanded");
          p.style.display = "flex";
        });
        backBtn.classList.remove("visible");
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // HANDLE ESCAPE KEY FOR MODALS AND PANELS
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal.style.display === "flex") {
        closeModal();
      } else {
        panels.forEach(p => {
          p.classList.remove("expanded");
          p.style.display = "flex";
        });
        backBtn.classList.remove("visible");
      }
    }
  });

  // HANDLE WINDOW RESIZE FOR PANELS
  window.addEventListener("resize", () => {
    panels.forEach(p => {
      if (p.classList.contains("expanded")) {
        p.classList.remove("expanded");
        p.style.display = "flex";
        backBtn.classList.remove("visible");
      }
    });
  });

  // ENSURE PANELS ARE VISIBLE ON INITIAL LOAD
  panels.forEach(p => {
    p.style.display = "flex";
  });
});