function copyIP() {
  navigator.clipboard.writeText("Alameldin.aternos.me:28303");
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
const modeBtn = document.getElementById("modeBtn");
const body = document.body;
const savedMode = localStorage.getItem("mode");
if (savedMode === "dark") {
  body.classList.add("dark-mode");
}
if (!savedMode) {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    body.classList.add("dark-mode");
  }
}
modeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && (e.key === "c" || e.key === "u" || e.key === "s")) {
    e.preventDefault();
  }
  if (e.key === "F12") {
    e.preventDefault();
  }
});