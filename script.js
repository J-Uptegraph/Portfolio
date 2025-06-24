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

// LIVE CORI UPDATES - GitHub Integration
const GITHUB_CONFIG = {
    owner: 'J-Uptegraph',
    repo: 'CORI',
    updatesPath: 'docs/project_updates',
    apiBase: 'https://api.github.com'
};

// Live loading configuration
let updatesCache = null;
let lastFetch = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds for live loading
const LIVE_CHECK_INTERVAL = 60 * 1000; // Check every 60 seconds
let liveCheckTimer = null;
let isLiveMode = true;
let nextCheckCountdown = LIVE_CHECK_INTERVAL / 1000;
let countdownTimer = null;

// Markdown to HTML converter
function parseMarkdown(markdown) {
    return markdown
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hul])/gm, '<p>')
        .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
        .replace(/<\/ul>\s*<ul>/g, '')
        .replace(/<p><\/p>/g, '');
}

// Extract version from filename
function extractVersion(filename) {
    const match = filename.match(/v(\d+\.?\d*(?:\.\d+)?)/i);
    return match ? match[1] : 'Unknown';
}

// Update status indicator
function updateStatus(message) {
    const statusEl = document.getElementById('updateStatus');
    if (statusEl) statusEl.textContent = message;
}

// Function to check and enable scrollbar when needed
function checkScrollbarNeeded(totalUpdatesCount = 0) {
    const updateHistory = document.getElementById('updateHistory');
    if (!updateHistory) return;
    
    // Use total GitHub updates count, not displayed count
    // If more than 3 total updates available on GitHub, enable scrollbar
    if (totalUpdatesCount > 3) {
        updateHistory.classList.add('scrollable');
        console.log(`🎯 CORI: Enabled scrollbar - ${totalUpdatesCount} total updates available on GitHub`);
    } else {
        updateHistory.classList.remove('scrollable');
        console.log(`📋 CORI: ${totalUpdatesCount} total updates - no scrollbar needed`);
    }
}

// Fetch updates from GitHub
async function fetchUpdates() {
    const now = Date.now();
    
    if (updatesCache && (now - lastFetch) < CACHE_DURATION) {
        return updatesCache;
    }

    try {
        const response = await fetch(
            `${GITHUB_CONFIG.apiBase}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.updatesPath}`
        );
        
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
        
        const files = await response.json();
        const updateFiles = files.filter(file => 
            file.name.endsWith('.md') && file.name.includes('update')
        );

        updateFiles.sort((a, b) => b.name.localeCompare(a.name));

        // Store total count globally for scrollbar decision
        window.totalGitHubUpdates = updateFiles.length;

        const updates = await Promise.all(
            updateFiles.slice(0, 5).map(async file => {
                try {
                    const contentResponse = await fetch(file.download_url);
                    const content = await contentResponse.text();
                    
                    return {
                        filename: file.name,
                        version: extractVersion(file.name),
                        content: content,
                        lastModified: file.sha,
                        url: file.html_url
                    };
                } catch (error) {
                    console.warn(`Failed to fetch ${file.name}:`, error);
                    return null;
                }
            })
        );

        const validUpdates = updates.filter(update => update !== null);
        updatesCache = validUpdates;
        lastFetch = now;
        
        return validUpdates;
        
    } catch (error) {
        console.error('Error fetching updates:', error);
        throw error;
    }
}

// Display latest update
function displayLatestUpdate(update) {
    const container = document.getElementById('latestUpdateContent');
    if (!container) return;
    
    if (!update) {
        container.innerHTML = '<div class="error-message">No updates available</div>';
        return;
    }

    // Extract date from content (same logic as displayUpdateHistory)
    const dateMatch = update.content.match(/(?:Date|Updated|Created):\s*(.+)/i) || 
                     update.content.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|\w+ \d{1,2}, \d{4})/);
    const updateDate = dateMatch ? dateMatch[1] : 'Recent update';

    const lines = update.content.split('\n');
    const preview = lines.slice(0, 10).join('\n');
    
    container.innerHTML = `
        <div class="update-content" style="display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
                <div class="update-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="version-badge">v${update.version}</span>
                    <span style="color: #73aa2d; font-size: 1rem; font-weight: bold;">${updateDate}</span>
                </div>
                <div class="update-preview">
                    ${parseMarkdown(preview)}
                </div>
            </div>
            <a href="${update.url}" target="_blank" class="cori-btn" style="text-align: center; padding: 0.5rem 1rem; white-space: nowrap; text-decoration: none; background-color: #73aa2d; color: #fff; border-radius: 5px;">
                <i class="fab fa-github"></i> Read Update
            </a>
        </div>
        <style>
            @media (max-width: 600px) {
                .update-content {
                    flex-direction: column;
                    align-items: flex-start;
                }
                .cori-btn {
                    width: 100%;
                    box-sizing: border-box;
                    margin-top: 0.5rem;
                }
            }
            @media (min-width: 601px) {
                .cori-btn {
                    width: auto;
                    align-self: center;
                }
            }
        </style>
    `;
}

// Display update history
function displayUpdateHistory(updates) {
    const container = document.getElementById('updateHistory');
    if (!container) return;
    
    if (!updates || updates.length === 0) {
        container.innerHTML = '<div class="error-message">No update history available</div>';
        return;
    }

    // Show updates starting from index 1 (skip the latest which is shown above)
    // Display ALL remaining updates, not just slice(1, 4)
    const historyItems = updates.slice(1).map(update => {
        // Extract date from content (look for date patterns)
        const dateMatch = update.content.match(/(?:Date|Updated|Created):\s*(.+)/i) || 
                         update.content.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|\w+ \d{1,2}, \d{4})/);
        const updateDate = dateMatch ? dateMatch[1] : 'Recent update';
        
        // Extract first couple sentences from content (skip headers and metadata)
        const contentLines = update.content.split('\n').filter(line => 
            line.trim() !== '' && 
            !line.startsWith('#') && 
            !line.toLowerCase().includes('date:') &&
            !line.toLowerCase().includes('version:') &&
            !line.startsWith('**') &&
            line.length > 10
        );
        
        const firstSentences = contentLines.slice(0, 10).join(' ').trim();
        const preview = firstSentences.length > 120 ? firstSentences.substring(0, 120) + '...' : firstSentences;
        
        return `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="version-badge">v${update.version}</span>
                    <span style="color: #73aa2d; font-size: 1rem; font-weight: bold;">${updateDate}</span>
                </div>
                <div class="update-content" style="display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #fff; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            📢 CORI Update — v${update.version}
                        </h4>
                        <p style="margin: 0 0 0.5rem 0; color: #ccc; font-size: 0.85rem; line-height: 1.4;">
                            ${preview}
                        </p>
                    </div>
                    <a href="${update.url}" target="_blank" class="cori-btn" style="text-align: center; padding: 0.5rem 1rem; white-space: nowrap; text-decoration: none; background-color: #73aa2d; color: #fff; border-radius: 5px;">
                        <i class="fab fa-github"></i> View Full Update
                    </a>
                </div>
                <style>
                    @media (max-width: 600px) {
                        .update-content {
                            flex-direction: column;
                            align-items: flex-start;
                        }
                        .cori-btn {
                            width: 100%;
                            box-sizing: border-box;
                            margin-top: 0.5rem;
                        }
                    }
                    @media (min-width: 601px) {
                        .cori-btn {
                            width: auto;
                            align-self: center;
                        }
                    }
                </style>
            </div>
        `;
    }).join('');

    container.innerHTML = historyItems || '<p>No additional updates found</p>';
    
    // Check if scrollbar is needed based on total GitHub updates count
    setTimeout(() => checkScrollbarNeeded(window.totalGitHubUpdates || 0), 100);
}

// Live checking functions
function startLiveChecking() {
    if (liveCheckTimer) return;
    
    liveCheckTimer = setInterval(async () => {
        if (isLiveMode) {
            await checkForUpdates();
        }
    }, LIVE_CHECK_INTERVAL);
    
    startCountdown();
}

function stopLiveChecking() {
    if (liveCheckTimer) {
        clearInterval(liveCheckTimer);
        liveCheckTimer = null;
    }
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
}

function startCountdown() {
    nextCheckCountdown = LIVE_CHECK_INTERVAL / 1000;
    updateCountdownDisplay();
    
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        nextCheckCountdown--;
        updateCountdownDisplay();
        
        if (nextCheckCountdown <= 0) {
            nextCheckCountdown = LIVE_CHECK_INTERVAL / 1000;
        }
    }, 1000);
}

function updateCountdownDisplay() {
    const nextCheckEl = document.getElementById('nextCheck');
    if (isLiveMode && nextCheckEl) {
        nextCheckEl.textContent = `Next check in ${nextCheckCountdown}s`;
    }
}

function toggleLiveMode() {
    isLiveMode = !isLiveMode;
    const toggle = document.getElementById('liveToggle');
    const nextCheck = document.getElementById('nextCheck');
    
    if (isLiveMode) {
        toggle.classList.add('active');
        toggle.innerHTML = '<i class="fas fa-broadcast-tower"></i> LIVE';
        nextCheck.style.opacity = '1';
        startLiveChecking();
        updateStatus('Live mode enabled - monitoring for updates');
    } else {
        toggle.classList.remove('active');
        toggle.innerHTML = '<i class="fas fa-pause"></i> PAUSED';
        nextCheck.style.opacity = '0.5';
        nextCheck.textContent = 'Live mode paused';
        stopLiveChecking();
        updateStatus('Live mode paused');
    }
}

async function checkForUpdates() {
    const liveDot = document.getElementById('liveDot');
    
    try {
        if (liveDot) liveDot.classList.add('checking');
        updateStatus('Checking for updates...');
        
        const updates = await fetchUpdates();
        
        if (updates && updates.length > 0) {
            displayLatestUpdate(updates[0]);
            displayUpdateHistory(updates);
            const totalCount = window.totalGitHubUpdates || updates.length;
            updateStatus(`Up to date (v${updates[0].version}) - ${totalCount} total updates on GitHub`);
        } else {
            updateStatus('No updates found');
        }
        
    } catch (error) {
        console.error('Live check failed:', error);
        updateStatus('Check failed - will retry');
    } finally {
        if (liveDot) {
            setTimeout(() => {
                liveDot.classList.remove('checking');
            }, 500);
        }
    }
}

async function refreshUpdates() {
    updatesCache = null;
    lastFetch = 0;
    await checkForUpdates();
    nextCheckCountdown = LIVE_CHECK_INTERVAL / 1000;
}

// Initialize CORI live updates when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if CORI section exists
    if (document.getElementById('coriSection')) {
        console.log('Initializing CORI live updates...');
        checkForUpdates();
        if (isLiveMode) {
            startLiveChecking();
        }
    }
});

// Cleanup
window.addEventListener('beforeunload', () => {
    stopLiveChecking();
});