const overlay = document.getElementById("lightboxOverlay");
const lightImg = document.getElementById("lightboxImage");
const lightCaption = document.getElementById("lightboxCaption");
const closeBtn = document.getElementById("lightboxClose");

// OPEN LIGHTBOX ON IMAGE CLICK
document.querySelectorAll(".flex-gallery .gallery-cell img").forEach((img) => {
  img.addEventListener("click", () => {
    lightImg.src = img.src;
    lightCaption.innerText = img.alt;
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // disable scroll
  });
});

// CLOSE LIGHTBOX
closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
});

// CLOSE ON CLICK OUTSIDE IMAGE
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// CLOSE ON ESC KEY
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
  }
});
