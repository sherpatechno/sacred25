const overlay = document.getElementById("lightboxOverlay");
const lightImg = document.getElementById("lightboxImage");
const lightCaption = document.getElementById("lightboxCaption");
const closeBtn = document.getElementById("lightboxClose");
const nextBtn = document.getElementById("lightboxNext");
const prevBtn = document.getElementById("lightboxPrev");

const images = Array.from(
  document.querySelectorAll(".flex-gallery .gallery-cell img")
);
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  lightImg.src = images[index].src;
  lightCaption.innerText = images[index].alt;
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Attach click events to gallery images
images.forEach((img, index) => {
  img.addEventListener("click", () => openLightbox(index));
});

// Next image
function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  openLightbox(currentIndex);
}

// Previous image
function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  openLightbox(currentIndex);
}

nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);

// Close button
closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
});

// Close when clicking outside image
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (overlay.style.display !== "flex") return;

  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "Escape") {
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
  }
});
