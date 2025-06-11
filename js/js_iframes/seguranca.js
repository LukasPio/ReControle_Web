import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { firebaseConfig } from "../js_config/Config.js";
import { errorSwalResponse } from "../js_functions/swal_fire_errors.js";

let email, password;

try {
  const email_ex = JSON.parse(localStorage.getItem("email"));
  const password_ex = JSON.parse(localStorage.getItem("password"));
  email = email_ex.value;
  password = password_ex.value;
} catch {
  email = localStorage.getItem("email");
  password = localStorage.getItem("password");
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "white-mode";
  const savedColor = localStorage.getItem("primaryColor") || "#007bff";
  document.body.classList.add(savedTheme);
  document.documentElement.style.setProperty("--primary-color", savedColor);
});

document.addEventListener("DOMContentLoaded", () => {
  initializeApp(firebaseConfig);
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = auth.currentUser;

      const status = document.getElementById("seg_verif");
      if (user.emailVerified) {
        status.textContent = "E-mail verificado";
      } else {
        status.textContent = "E-mail não verificado";
      }

      const btnSend = document.getElementById("btn-send-verification");
      btnSend.addEventListener("click", () => {
        sendEmailVerification(user)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "E-mail enviado!",
              text: "Verifique sua caixa de entrada.",
              confirmButtonColor: getComputedStyle(document.documentElement)
                .getPropertyValue("--primary-color")
                .trim(),
            });
          })
          .catch((error) => {
            errorSwalResponse(error);
          });
      });
    })
    .catch((error) => {
      errorSwalResponse(error);
    });
});
