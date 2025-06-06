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
      const isMobile = window.innerWidth <= 768;
      
      header.classList.toggle("navbarDark", !isVisible);
      
      // On mobile, always keep brand visible. On desktop, hide when hero is visible
      if (isMobile) {
        brand.style.visibility = "visible";
      } else {
        brand.style.visibility = isVisible ? "hidden" : "visible";
      }
      
      scrollToSection.style.display = isVisible ? "block" : "none";
    },
    { threshold: 0.1 }
  );
  observer.observe(homeSection);

  function setNavbarBrand() {
    const isMobile = mobileWidth.matches;
    
    if (isMobile) {
      // On mobile, always show and make visible
      brand.style.display = "block";
      brand.style.visibility = "visible";
    } else {
      // On desktop, hide by default (intersection observer will control visibility)
      brand.style.display = "none";
    }
  }
  setNavbarBrand();
  window.addEventListener("resize", setNavbarBrand);

  // Helper function for smooth scrolling with custom mobile offsets
  function scrollToTarget(targetElement, targetId = null) {
    const navbarHeight = header.offsetHeight;
    const isMobile = window.innerWidth <= 768;
    
    // Custom mobile offsets for different sections
    let mobileOffset = 0;
    if (isMobile) {
      switch(targetId) {
        case 'aboutSection':
          mobileOffset = 150; // Custom offset for About section
          break;
        case 'contactSection':
          mobileOffset = 150; // Custom offset for Contact section
          break;

        case 'featuredSection':
        case 'coriSection':
        case 'portfolioSection':
        case 'skillsSection':
        default:
          mobileOffset = 10; // Default offset for other sections
          break;
      }
    }
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight + mobileOffset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  }

  // Helper function to reset panels to default state
  function resetPanels() {
    const panels = document.querySelectorAll(".panel");
    const backBtn = document.querySelector(".back-btn");
    
    panels.forEach(p => {
      p.classList.remove("expanded");
      p.style.display = "flex";
      p.style.position = "";
      p.style.top = "";
      p.style.left = "";
      p.style.width = "";
      p.style.height = "";
      p.style.zIndex = "";
    });
    
    document.body.style.overflow = "";
    
    if (backBtn) {
      backBtn.classList.remove("visible");
    }
  }

  // NAVIGATION SCROLL - IMPROVED MOBILE VERSION
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.querySelector("a").getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Close mobile menu first (if open)
        const menu = document.querySelector(".navbar-collapse");
        if (menu && menu.classList.contains("show")) {
          // Use Bootstrap's collapse method to properly close
          const bsCollapse = new bootstrap.Collapse(menu, {
            toggle: false
          });
          bsCollapse.hide();
          
          // Wait for menu to close before scrolling
          setTimeout(() => {
            scrollToTarget(targetElement, targetId);
            
            // If navigating to featured section, ensure panels are reset
            if (targetId === "featuredSection") {
              resetPanels();
            }
          }, 300); // Match Bootstrap's collapse transition time
        } else {
          // Desktop or menu already closed
          scrollToTarget(targetElement, targetId);
          
          // If navigating to featured section, ensure panels are reset
          if (targetId === "featuredSection") {
            resetPanels();
          }
        }
      }
    });
  });

  // SCROLL-TO-SECTION (HERO ARROW) SCROLL - Updated to go to featuredSection like Automation nav
  scrollToSection.addEventListener("click", (e) => {
    e.preventDefault();
    // Always go to featuredSection (Automation section) regardless of href attribute
    const targetId = "featuredSection";
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      scrollToTarget(targetElement, targetId);
      // Reset panels when navigating via chevron
      resetPanels();
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

    if (githubIcon) {
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
  }

  function closeModal() {
    modalContent.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }
  
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // PORTFOLIO GENERATION - Added safety checks
  const portfolioContainer = document.getElementById("portfolioContainer");
  if (portfolioContainer && typeof modalInfo !== 'undefined') {
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
  }

  // FEATURED PROJECTS PANEL HANDLING - IMPROVED MOBILE VERSION
  const panels = document.querySelectorAll(".panel");
  const backBtn = document.querySelector(".back-btn");

  function togglePanel(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const panel = e.currentTarget;
    const isExpanded = panel.classList.contains("expanded");

    // Always reset all panels first
    panels.forEach(p => {
      p.classList.remove("expanded");
      p.style.display = "flex";
      p.style.position = "";
      p.style.top = "";
      p.style.left = "";
      p.style.width = "";
      p.style.height = "";
      p.style.zIndex = "";
    });

    // Reset body overflow
    document.body.style.overflow = "";

    if (!isExpanded) {
      panel.classList.add("expanded");
      
      // On mobile screens, force hide other panels and make this one fullscreen
      if (window.innerWidth <= 768) {
        // Hide all other panels completely
        panels.forEach(p => {
          if (p !== panel) {
            p.style.display = "none";
          }
        });
        
        // Force the expanded panel to be fullscreen
        panel.style.position = "fixed";
        panel.style.top = "0";
        panel.style.left = "0";
        panel.style.width = "100vw";
        panel.style.height = "100vh";
        panel.style.zIndex = "9999";
        
        // Prevent body scrolling
        document.body.style.overflow = "hidden";
      }
      
      if (backBtn) {
        backBtn.classList.add("visible");
      }
    } else {
      if (backBtn) {
        backBtn.classList.remove("visible");
      }
    }
  }

  panels.forEach(panel => {
    panel.addEventListener("click", togglePanel);
  });

  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetPanels();
    });
  }

  // CLOSE PANELS ON SECTION CHANGE
  const sections = document.querySelectorAll("section");
  const observerOptions = { threshold: 0.3 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id !== "featuredSection") {
        resetPanels();
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // HANDLE ESCAPE KEY FOR MODALS AND PANELS
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal && modal.style.display === "flex") {
        closeModal();
      } else {
        resetPanels();
      }
    }
  });

  // HANDLE WINDOW RESIZE FOR PANELS
  window.addEventListener("resize", () => {
    // Reset panels on resize to avoid layout issues
    resetPanels();
    // Reapply brand visibility logic
    setNavbarBrand();
  });

  // ENSURE PANELS ARE VISIBLE ON INITIAL LOAD
  panels.forEach(p => {
    p.style.display = "flex";
  });
});