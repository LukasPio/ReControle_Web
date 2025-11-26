document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("theme_select");
  const colorPicker = document.getElementById("t_color");

  const savedTheme = localStorage.getItem("theme") || "light-mode";
  document.body.classList.add(savedTheme);
  select.value = savedTheme;

  const savedColor = localStorage.getItem("primaryColor");
  if (savedColor) {
    document.documentElement.style.setProperty("--primary-color", savedColor);
    colorPicker.value = savedColor;
  } 

  select.addEventListener("change", (event) => {
    const newTheme = event.target.value;

    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(newTheme);

    localStorage.setItem("theme", newTheme);
    localStorage.setItem("confirmation", 1);

    window.parent.location.reload();

  });

  colorPicker.addEventListener("input", (event) => {
    const color = event.target.value;

    document.documentElement.style.setProperty("--primary-color", color);
    localStorage.setItem("primaryColor", color);
  });

});
