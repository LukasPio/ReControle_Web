document.addEventListener("DOMContentLoaded", function () {
  // Toggle para mostrar/esconder senha
  const togglePassword = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("login-password");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
    });
  }
});
