window.addEventListener("load", () => {
  const line = document.querySelector(".line");
  const mousemove = document.body.addEventListener("mousemove", (e) => {
    line.style.left = `${e.clientX}px`;
  });
  document.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (e.key === "Escape") {
      document.body.removeEventListener("mousemove", mousemove);
      line.style.display = "none";
    }
  });
});
