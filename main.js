const loadingCover = document.getElementById("loading-cover");
const loadingIcon = document.getElementById("lottie");

window.addEventListener("load", () => {
  setTimeout(() => (loadingIcon.style.opacity = 0), 1500);
  setTimeout(() => {
    loadingCover.style.opacity = 0;
    setTimeout(() => {
      loadingCover.style.pointerEvents = "none";
    }, 1500);
    setTimeout(() => {
      loadingCover.style.display = "none";
    }, 3000);
  }, 2000);
});

window.addEventListener("resize", () => {
  document.getElementById("background").style.height = "0px";
  requestAnimationFrame(() => {
    document.getElementById("background").style.height = `${
      document.getElementById("quiz").scrollHeight
    }px`;
  });
});
