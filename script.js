const mobileMenu = document.querySelector(".mobile-menu");
const mobileNav = document.querySelector(".mobile-nav");
const shopBtn = document.querySelector(".shop-button");
const shopDropCont = document.querySelector(".shop-dropdown-content");
const header = document.getElementsByTagName("header")[0];

shopBtn.addEventListener("mouseenter", () => {
  if (shopDropCont.style.display === "none") {
    shopDropCont.style.display = "flex";
    shopBtn.style.background = "#5ee8e8";
    shopBtn.style.rotate = "-10deg";
  } else {
    shopDropCont.style.display = "none";
    shopBtn.style.background = "white";
    shopBtn.style.rotate = "0deg";
  }
});

document.body.addEventListener("click", () => {
  shopDropCont.style.display = "none";
  shopBtn.style.background = "white";
  shopBtn.style.rotate = "0deg";
});

mobileMenu.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    !mobileNav.contains(e.target) &&
    !mobileMenu.contains(e.target) &&
    mobileNav.classList.contains("active")
  ) {
    mobileNav.classList.remove("active");
  }
});

// Handle logo loading issues by replacing with placeholder if needed
document.querySelectorAll(".logo-item img").forEach((img) => {
  img.onerror = function () {
    this.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSIxMDAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIj5Mb2dvIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
    this.alt = "Brand Logo";
  };
});

// Make sure the animation restarts when window is resized
window.addEventListener("resize", () => {
  const carousel = document.querySelector(".logo-carousel-inner");
  carousel.style.animation = "none";
  setTimeout(() => {
    carousel.style.animation = "scroll 30s linear infinite";
  }, 10);
});

// card carousel

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".card-carousel");
  const cards = document.querySelectorAll(".card");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");
  const prevBottomBtn = document.querySelector(".bottom-arrow.prev-bottom");
  const nextBottomBtn = document.querySelector(".bottom-arrow.next-bottom");

  let currentIndex = 0;
  let cardWidth;
  let cardsPerView;
  let totalSlides;

  // Variables for touch/drag functionality
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  // Function to calculate dimensions
  function calculateDimensions() {
    cardWidth = cards[0].offsetWidth;
    const containerWidth = document.querySelector(
      ".carousel-container"
    ).offsetWidth;

    // Calculate how many cards are visible at once
    cardsPerView = Math.floor(containerWidth / cardWidth);
    totalSlides = Math.ceil(cards.length / cardsPerView);

    // Reset carousel when resizing
    currentIndex = 0;
    updateCarousel();
  }

  // Function to update the carousel position
  function updateCarousel() {
    const offset = -currentIndex * cardsPerView * cardWidth;
    prevTranslate = offset;
    currentTranslate = offset;
    carousel.style.transform = `translateX(${offset}px)`;

    // Update active dot
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  // Initialize dimensions
  calculateDimensions();

  // Handle window resize
  window.addEventListener("resize", calculateDimensions);

  // Handle dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Handle arrow navigation - side arrows
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Handle arrow navigation - bottom arrows
  prevBottomBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBottomBtn.addEventListener("click", () => {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Touch events for mobile swiping
  carousel.addEventListener("touchstart", touchStart);
  carousel.addEventListener("touchmove", touchMove);
  carousel.addEventListener("touchend", touchEnd);

  // Mouse events for dragging
  carousel.addEventListener("mousedown", touchStart);
  carousel.addEventListener("mousemove", touchMove);
  carousel.addEventListener("mouseup", touchEnd);
  carousel.addEventListener("mouseleave", touchEnd);

  function touchStart(event) {
    startPos = getPositionX(event);
    isDragging = true;
    carousel.style.transition = "none";
  }

  function touchMove(event) {
    if (isDragging) {
      //   event.preventDefault(); // Prevents vertical scrolling while swiping horizontally
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startPos;
      carousel.style.transform = `translateX(${currentTranslate}px)`;
    }
  }

  function touchEnd() {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;

    // Determine if we should change slide based on how much was moved
    if (movedBy < -100 && currentIndex < totalSlides - 1) {
      currentIndex++;
    } else if (movedBy > 100 && currentIndex > 0) {
      currentIndex--;
    }

    carousel.style.transition = "transform 0.5s ease";
    updateCarousel();
  }

  function getPositionX(event) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  // Prevent clicking links during drag
  document.querySelectorAll(".card a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    });
  });

  // Prevent context menu on long press
  carousel.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
});
