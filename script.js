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
    "Multi-Robot Deployments | Advanced Automation Projects",
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
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode")
    );
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
      switch (targetId) {
        case "aboutSection":
          mobileOffset = 150; // Custom offset for About section
          break;
        case "contactSection":
          mobileOffset = 150; // Custom offset for Contact section
          break;

        case "featuredSection":
        case "coriSection":
        case "portfolioSection":
        case "skillsSection":
        default:
          mobileOffset = 10; // Default offset for other sections
          break;
      }
    }

    const targetPosition =
      targetElement.getBoundingClientRect().top +
      window.pageYOffset -
      navbarHeight +
      mobileOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }

  // Helper function to reset panels to default state
  function resetPanels() {
    const panels = document.querySelectorAll(".panel");
    const backBtn = document.querySelector(".back-btn");

    panels.forEach((p) => {
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
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link
        .querySelector("a")
        .getAttribute("href")
        .substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Close mobile menu first (if open)
        const menu = document.querySelector(".navbar-collapse");
        if (menu && menu.classList.contains("show")) {
          // Use Bootstrap's collapse method to properly close
          const bsCollapse = new bootstrap.Collapse(menu, {
            toggle: false,
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
      .map((skill) => `<span class="skill-tag">${skill}</span>`)
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
      } else if (
        selectedProject.link &&
        selectedProject.link.includes("github.com")
      ) {
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
  if (portfolioContainer && typeof modalInfo !== "undefined") {
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
    panels.forEach((p) => {
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
        panels.forEach((p) => {
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

  panels.forEach((panel) => {
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
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.id !== "featuredSection") {
        resetPanels();
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
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
  panels.forEach((p) => {
    p.style.display = "flex";
  });
});
// GitHub API Configuration
const GITHUB_CONFIG = {
  owner: "J-Uptegraph",
  repo: "CORI",
  updatesPath: "docs/project_updates",
  apiBase: "https://api.github.com",
};

// Cache management
let updatesCache = null;
let lastFetch = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds

// Markdown to HTML converter
function parseMarkdown(markdown) {
  return markdown
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^\* (.*$)/gm, "<li>$1</li>")
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hul])/gm, "<p>")
    .replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>")
    .replace(/<\/ul>\s*<ul>/g, "")
    .replace(/<p><\/p>/g, "");
}

// Extract version from filename
function extractVersion(filename) {
  const match = filename.match(/v(\d+\.?\d*(?:\.\d+)?)/i);
  return match ? match[1] : "Unknown";
}

// Extract date from Git commit or filename
function extractDate(update) {
  // Try to extract date from filename or content
  const dateMatch = update.content.match(
    /Date:\s*(\d{4}-\d{2}-\d{2})|(\w+\s+\d{1,2},?\s+\d{4})/
  );
  if (dateMatch) {
    return dateMatch[1] || dateMatch[2];
  }
  // Fallback to a reasonable date based on version
  const version = parseFloat(extractVersion(update.filename));
  if (version >= 1.3) return "January 2025";
  if (version >= 1.2) return "December 2024";
  if (version >= 1.1) return "November 2024";
  return "October 2024";
}

// Get preview text (first 2-3 sentences)
function getPreviewText(content) {
  // Remove markdown headers and get plain text
  const plainText = content
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Split into sentences and take first 2-3
  const sentences = plainText
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);
  const preview = sentences.slice(0, 3).join(". ").trim();
  return preview + (sentences.length > 3 ? "..." : "");
}

// Fetch updates from GitHub
async function fetchUpdates() {
  const now = Date.now();

  if (updatesCache && now - lastFetch < CACHE_DURATION) {
    return updatesCache;
  }

  try {
    const response = await fetch(
      `${GITHUB_CONFIG.apiBase}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.updatesPath}`
    );

    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const files = await response.json();
    const updateFiles = files.filter(
      (file) => file.name.endsWith(".md") && file.name.includes("update")
    );

    updateFiles.sort((a, b) => b.name.localeCompare(a.name));

    const updates = await Promise.all(
      updateFiles.slice(0, 5).map(async (file) => {
        try {
          const contentResponse = await fetch(file.download_url);
          const content = await contentResponse.text();

          return {
            filename: file.name,
            version: extractVersion(file.name),
            content: content,
            lastModified: file.sha,
            url: file.html_url,
            downloadUrl: file.download_url,
          };
        } catch (error) {
          console.warn(`Failed to fetch ${file.name}:`, error);
          return null;
        }
      })
    );

    const validUpdates = updates.filter((update) => update !== null);
    updatesCache = validUpdates;
    lastFetch = now;

    return validUpdates;
  } catch (error) {
    console.error("Error fetching updates:", error);
    throw error;
  }
}

// Display latest update
function displayLatestUpdate(update) {
  const container = document.getElementById("latestUpdateContent");
  if (!container) return;

  if (!update) {
    container.innerHTML =
      '<div class="error-message">No updates available</div>';
    return;
  }

  const preview = getPreviewText(update.content);
  const date = extractDate(update);

  container.innerHTML = `
                <div class="update-content">
                    <div class="update-meta">
                        <span class="version-badge">v${update.version}</span>
                        <span class="update-date">${date}</span>
                    </div>
                    <div class="update-preview">
                        ${parseMarkdown(preview)}
                    </div>
                    <div class="update-actions">
                        <a href="${
                          update.url
                        }" target="_blank" class="cori-btn github-btn">
                            <i class="fab fa-github"></i> View Full Update
                        </a>
                    </div>
                </div>
            `;
}

// Display update history with dropdowns
function displayUpdateHistory(updates) {
  const container = document.getElementById("updateHistory");
  if (!container) return;

  if (!updates || updates.length === 0) {
    container.innerHTML =
      '<div class="error-message">No update history available</div>';
    return;
  }

  const historyItems = updates
    .slice(1)
    .map((update, index) => {
      const preview = getPreviewText(update.content);
      const date = extractDate(update);
      const updateId = `update${index + 1}`;
      const arrowId = `arrow${index + 1}`;

      return `
                    <div class="update-history-item">
                        <div class="update-history-header" onclick="toggleUpdate('${updateId}', '${
        update.downloadUrl
      }')">
                            <div class="update-title">
                                <span class="version-badge">v${
                                  update.version
                                }</span>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 0.3rem;">${update.filename
                                      .replace(".md", "")
                                      .replace(/_/g, " ")}</div>
                                    <div class="update-date">${date}</div>
                                </div>
                            </div>
                            <i class="fas fa-chevron-down dropdown-arrow" id="${arrowId}"></i>
                        </div>
                        <div class="update-preview">
                            ${preview}
                        </div>
                        <div class="update-content-full" id="${updateId}">
                            <div class="loading-spinner">
                                <div class="spinner"></div>
                                <span>Loading full content...</span>
                            </div>
                        </div>
                        <div class="update-actions">
                            <a href="${
                              update.url
                            }" target="_blank" class="cori-btn github-btn">
                                <i class="fab fa-github"></i> GitHub
                            </a>
                        </div>
                    </div>
                `;
    })
    .join("");

  container.innerHTML = historyItems || "<p>No additional updates found</p>";
}

// Toggle dropdown and load content if needed
async function toggleUpdate(updateId, downloadUrl) {
  const content = document.getElementById(updateId);
  const arrow = document.getElementById("arrow" + updateId.slice(-6));

  if (content.classList.contains("expanded")) {
    content.classList.remove("expanded");
    if (arrow) arrow.classList.remove("expanded");
    return;
  }

  // Close all other dropdowns first
  document.querySelectorAll(".update-content-full").forEach((el) => {
    el.classList.remove("expanded");
  });
  document.querySelectorAll(".dropdown-arrow").forEach((el) => {
    el.classList.remove("expanded");
  });

  // Open clicked dropdown
  content.classList.add("expanded");
  if (arrow) arrow.classList.add("expanded");

  // Load content if not already loaded
  if (content.innerHTML.includes("loading-spinner") && downloadUrl) {
    try {
      const response = await fetch(downloadUrl);
      const markdownContent = await response.text();

      content.innerHTML = `
                        <div style="padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 8px; color: rgba(255,255,255,0.9); line-height: 1.6;">
                            ${parseMarkdown(markdownContent)}
                        </div>
                    `;
    } catch (error) {
      content.innerHTML = `
                        <div style="padding: 1rem; color: #ff6b6b;">
                            Failed to load content. <a href="${downloadUrl}" target="_blank" style="color: #73aa2d;">View on GitHub</a>
                        </div>
                    `;
    }
  }
}

// Refresh updates function
async function refreshUpdates() {
  const button = document.querySelector(".refresh-btn");
  const icon = button.querySelector("i");

  // Add spinning animation
  icon.style.animation = "spin 1s linear infinite";
  button.disabled = true;
  button.style.opacity = "0.7";

  try {
    updatesCache = null;
    lastFetch = 0;
    await loadUpdates();

    // Success feedback
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> UPDATED';
    setTimeout(() => {
      button.innerHTML = originalText;
    }, 2000);
  } catch (error) {
    console.error("Refresh failed:", error);
    button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> RETRY';
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-sync-alt"></i> CHECK FOR UPDATES';
    }, 3000);
  } finally {
    icon.style.animation = "";
    button.disabled = false;
    button.style.opacity = "1";
  }
}

// Main function to load and display updates
async function loadUpdates() {
  try {
    const updates = await fetchUpdates();

    if (updates && updates.length > 0) {
      displayLatestUpdate(updates[0]);
      displayUpdateHistory(updates);
    } else {
      document.getElementById("latestUpdateContent").innerHTML =
        '<div class="error-message">No updates found</div>';
      document.getElementById("updateHistory").innerHTML =
        '<div class="error-message">No update history available</div>';
    }
  } catch (error) {
    console.error("Failed to load updates:", error);
    document.getElementById("latestUpdateContent").innerHTML =
      '<div class="error-message">Failed to load updates from GitHub</div>';
    document.getElementById("updateHistory").innerHTML =
      '<div class="error-message">Failed to load update history</div>';
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("🔴 Loading CORI updates from GitHub...");
  loadUpdates();

  // Add hover effects to tech items
  const techItems = document.querySelectorAll(".tech-item");
  techItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow = "0 10px 25px rgba(115, 170, 45, 0.3)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "none";
    });
  });
});
