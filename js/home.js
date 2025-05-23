import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { firebaseConfig, hrefsConfig } from "./js_config/Config.js";

const index = hrefsConfig.index;
const H_acc = hrefsConfig.conf_acc;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.className = savedTheme;
  document.getElementById("Geren_obj").className = savedTheme;
  document.getElementById("denucias").className = savedTheme;
  document.getElementById("account").className = savedTheme;
}

initializeApp(firebaseConfig);
const auth = getAuth();

if (localStorage.getItem("email") && localStorage.getItem("password")) {
  try {
    const email_ex = JSON.parse(localStorage.getItem("email"));
    const password_ex = JSON.parse(localStorage.getItem("password"));

    if (email_ex.expiresIn > new Date().getTime() && password_ex.expiresIn > new Date().getTime()) {
      const email = email_ex.value;
      const password = password_ex.value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          var user = userCredential.user;

          document.getElementById("name").innerHTML = ` ${user.displayName}`;
          document.getElementById("account").innerHTML = `${user.email}`;
        })
        .catch((error) => {
          console.log(
            "Erro ao tentar realizar o login:       " +
              error.message +
              "\n\n Tente novamente."
          );
          window.location.href = index;
        });
    } else {
      localStorage.clear();

      window.location.href = index;
    }
  } catch {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        var user = userCredential.user;

        document.getElementById("name").innerHTML = ` ${user.displayName}`;
        document.getElementById("account").innerHTML = `${user.email}`;
      })
      .catch((error) => {
        console.log(
          "Erro ao tentar realizar o login:       " +
            error.message +
            "\n\n Tente novamente."
        );
        window.location.href = index;
      });
  }
} else {
  const b_acc = document.getElementById("account");

  b_acc.innerHTML = `Faça login`;
  document.addEventListener("DOMContentLoaded", () => {
    b_acc.addEventListener("click", () => {
      window.location.href = index;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("name");

  botao.addEventListener("click", () => {
    window.location.href = H_acc;
  });

});
