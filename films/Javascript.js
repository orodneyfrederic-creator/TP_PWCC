document.querySelectorAll(".file").forEach((button) => {
  button.addEventListener("click", (e) => {
    if (window.innerWidth < 768) {
      e.preventDefault(); // Empêche de suivre le lien
      const content = button.nextElementSibling;
      content.style.visibility =
        content.style.visibility === "visible" ? "hidden" : "visible";
      content.style.opacity = content.style.opacity === "1" ? "0" : "1";
    }
  });
});
