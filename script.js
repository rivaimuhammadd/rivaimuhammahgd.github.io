document.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("#nav-list a");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 60; // Adjust for header height
    if (pageYOffset >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  // Special check for the last section (#contact)
  const contactSection = document.querySelector("#contact");
  const contactTop = contactSection.offsetTop - 60; // Adjust for header height
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 10) {
    currentSection = "contact";
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(currentSection)) {
      link.classList.add("active");
    }
  });
});

function toggleMenu() {
  const navList = document.getElementById("nav-list");
  const menuIcon = document.getElementById("menu-icon");
  const socialSidebar = document.querySelector(".social-media-sidebar");

  navList.classList.toggle("open");
  menuIcon.classList.toggle("open");

  // Handle social media sidebar visibility with delay
  if (navList.classList.contains("open")) {
    setTimeout(() => {
      socialSidebar.classList.add("visible"); // Show the sidebar after a delay
      setTimeout(() => {
        socialSidebar.classList.add("float-up"); // Add float animation from bottom
      }, 100); // Delay float-up slightly for smoothness
    }, 100); // Delay to ensure nav menu is fully visible
  } else {
    socialSidebar.classList.remove("float-up"); // Reset float-up animation
    socialSidebar.classList.remove("visible"); // Hide the sidebar
  }
}

document.querySelectorAll("#nav-list a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default anchor click behavior

    // Get the target section's ID from the href attribute
    const targetId = link.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    // Scroll smoothly to the section
    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start", // Align the section at the top of the viewport
    });

    // Close the mobile menu if it's open
    const navList = document.getElementById("nav-list");
    const menuIcon = document.getElementById("menu-icon");
    const socialSidebar = document.querySelector(".social-media-sidebar");

    if (navList.classList.contains("open")) {
      navList.classList.remove("open");
      menuIcon.classList.remove("open");
      socialSidebar.classList.remove("float-up");
      socialSidebar.classList.remove("visible");
    }
  });
});

// Add flashlight dynamically
const flashlight = document.createElement("div");
flashlight.id = "flashlight";
document.body.appendChild(flashlight);

// Update flashlight position based on mouse movement
document.addEventListener("mousemove", (event) => {
  flashlight.style.top = `${event.clientY}px`;
  flashlight.style.left = `${event.clientX}px`;
});

// Ensure scrolling is enabled
document.addEventListener("mouseleave", () => {
  flashlight.style.opacity = 0;
});

document.addEventListener("mouseenter", () => {
  flashlight.style.opacity = 1;
});

// Function to toggle "scrolled" class on header
function updateHeaderState() {
  const header = document.querySelector("header");

  if (window.scrollY > 0) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

// Update header state on scroll
window.addEventListener("scroll", updateHeaderState);

// Update header state on page load
document.addEventListener("DOMContentLoaded", updateHeaderState);

document.addEventListener("DOMContentLoaded", () => {
  const projectItems = document.querySelectorAll(".project-item");

  const applyBackgroundImages = () => {
    projectItems.forEach((item) => {
      const imageElement = item.querySelector(".project-image img");

      if (imageElement) {
        const imageUrl = imageElement.src;

        // Check if the screen width is less than 1500px
        if (window.innerWidth <= 1500) {
          // Apply background image for project-item
          item.style.backgroundImage = `url('${imageUrl}')`;
          item.style.backgroundSize = "cover";
          item.style.backgroundPosition = "center";
          item.style.backgroundRepeat = "no-repeat";

          // Hide the original .project-image
          const projectImageContainer = item.querySelector(".project-image");
          if (projectImageContainer) {
            projectImageContainer.style.display = "none";
          }
        } else {
          // Revert styles for larger screens
          item.style.backgroundImage = "";
          const projectImageContainer = item.querySelector(".project-image");
          if (projectImageContainer) {
            projectImageContainer.style.display = "block";
          }
        }
      }
    });
  };

  // Apply background images on page load
  applyBackgroundImages();

  // Reapply background images on window resize
  window.addEventListener("resize", applyBackgroundImages);

  // Carousel Logic for infinite loop with cloning
  const originalProjects = Array.from(document.querySelectorAll(".projects-container .project-item"));
  const projectsContainer = document.getElementById("projects-carousel");
  const prevButton = document.getElementById("prev-project");
  const nextButton = document.getElementById("next-project");
  const paginationContainer = document.getElementById("project-pagination");

  const totalOriginalProjects = originalProjects.length;
  let currentIndex = 1; // Start at the first real project (index 1 after prepending clone)

  // Clone the last project and prepend it
  const lastProjectClone = originalProjects[totalOriginalProjects - 1].cloneNode(true);
  projectsContainer.prepend(lastProjectClone);

  // Clone the first project and append it
  const firstProjectClone = originalProjects[0].cloneNode(true);
  projectsContainer.append(firstProjectClone);

  // Function to show a specific project by index (including clones)
  const showProject = (index, smoothTransition = true) => {
    if (!smoothTransition) {
      projectsContainer.classList.add('no-transition');
    } else {
      projectsContainer.classList.remove('no-transition');
    }

    const offset = -index * 100;
    projectsContainer.style.transform = `translateX(${offset}%)`;

    // Update pagination only for real projects
    updatePagination(index);
  };

  // Function to create pagination dots (using original project count)
  const createPaginationDots = () => {
    paginationContainer.innerHTML = '';
    for (let i = 0; i < totalOriginalProjects; i++) {
      const dot = document.createElement("span");
      dot.classList.add("pagination-dot");
      // Use a data attribute to store the index of the real project
      dot.dataset.projectIndex = i + 1; // Corresponds to actualIndex of the real projects
      dot.addEventListener("click", (event) => {
        const targetIndex = parseInt(event.target.dataset.projectIndex);
        currentIndex = targetIndex; // Update current index to match clicked dot's real project
        showProject(currentIndex);
      });
      paginationContainer.appendChild(dot);
    }
  };

  // Function to update pagination dots' active state
  const updatePagination = (actualCarouselIndex) => {
    const dots = document.querySelectorAll(".pagination-dot");
    dots.forEach((dot, i) => {
      // Map the carousel's actual index (0=last clone, 1=real first, ..., N=real last, N+1=first clone)
      // to the pagination dot index (0 to N-1)
      let realProjectIndex = actualCarouselIndex - 1;
      if (realProjectIndex === -1) { // If it's the last clone (index 0)
          realProjectIndex = totalOriginalProjects - 1;
      } else if (realProjectIndex === totalOriginalProjects) { // If it's the first clone (index totalOriginalProjects + 1)
          realProjectIndex = 0;
      }
      dot.classList.toggle("active", i === realProjectIndex);
    });
  };

  // Event listener for transition end to handle seamless loop
  projectsContainer.addEventListener('transitionend', () => {
    // If we are on the first cloned slide (index totalOriginalProjects + 1)
    if (currentIndex === totalOriginalProjects + 1) {
      projectsContainer.classList.add('no-transition'); // Disable transition
      currentIndex = 1; // Jump to the real first slide's position
      projectsContainer.style.transform = `translateX(${-currentIndex * 100}%)`;
      // Force reflow
      projectsContainer.offsetHeight; 
      projectsContainer.classList.remove('no-transition'); // Re-enable transition
    }
    // If we are on the last cloned slide (index 0)
    else if (currentIndex === 0) {
      projectsContainer.classList.add('no-transition'); // Disable transition
      currentIndex = totalOriginalProjects; // Jump to the real last slide's position
      projectsContainer.style.transform = `translateX(${-currentIndex * 100}%)`;
      // Force reflow
      projectsContainer.offsetHeight;
      projectsContainer.classList.remove('no-transition'); // Re-enable transition
    }
  });


  // Event listeners for carousel buttons
  prevButton.addEventListener("click", () => {
    currentIndex--;
    showProject(currentIndex);
  });

  nextButton.addEventListener("click", () => {
    currentIndex++;
    showProject(currentIndex);
  });

  // Initialize carousel: position at the first real project (index 1) instantly
  showProject(currentIndex, false); // false for no smooth transition initially
  createPaginationDots();
  updatePagination(currentIndex); // Initial pagination state
});

document.addEventListener("DOMContentLoaded", () => {
  // Disable browser's scroll restoration feature
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // Scroll to the top (hero section)
  const heroSection = document.getElementById("hero");

  if (heroSection) {
    heroSection.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  }
});
