import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { firebaseConfig, hrefsConfig } from "./js_config/Config.js";

// Inicializa Firebase
toString;
initializeApp(firebaseConfig);
const auth = getAuth();

// Aplica tema salvo QUE O MANO ENZO FEZ -- Augusto
// Estou sentindo um baita julgamento vindo de ti AUGUSTO -- Enzo
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.className = savedTheme;
    ["Geren_obj", "denucias", "account"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.className = savedTheme;
    });
  }
});

// Verifica autenticação e preenche usuário ou redireciona
onAuthStateChanged(auth, (user) => {
  if (user) {
    const nameEl = document.getElementById("name");
    const accountEl = document.getElementById("account");
    const accountNameEl = document.getElementById("accountName");
    const nameMenuEl = document.getElementById("name");
    if (accountNameEl)
      accountNameEl.textContent = user.displayName || user.email;
    if (nameMenuEl)
      nameMenuEl.textContent = `Nome: ${user.displayName || user.email}`;
    if (nameEl) nameEl.textContent = ` ${user.displayName || user.email}`;
    if (accountEl) accountEl.textContent = user.email;
  } else {
    window.location.href = `../${hrefsConfig.index}`;
  }
});

// Dropdown e logout
function toggleDropdown() {
  const menu = document.getElementById("accountMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.addEventListener("click", (e) => {
  const dropdown = document.querySelector(".account-dropdown");
  if (dropdown && !dropdown.contains(e.target)) {
    document.getElementById("accountMenu").style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Botão perfil
  const nameBtn = document.getElementById("name");
  if (nameBtn) {
    nameBtn.addEventListener("click", () => {
      window.location.href = hrefsConfig.conf_acc;
    });
  }
  // Botão logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        localStorage.clear();
        window.location.href = `../${hrefsConfig.index}`;
      });
    });
  }
  // Visão geral 
  const redirectLiHome = document.getElementById("home");
  if (redirectLiHome) {
    redirectLiHome.addEventListener('click', () => {
      window.location.href = './home.html';
    })
  }
  // Instituição
  const redirectLiInstitution = document.getElementById("institution");
  if (redirectLiInstitution) {
    redirectLiInstitution.addEventListener('click', () => {
      window.location.href = './institution.html';
    })
  }
  // Chamados
  const redirectLiCalls = document.getElementById("calls");
  if (redirectLiCalls) {
    redirectLiCalls.addEventListener('click', () => {
      window.location.href = './calls.html';
    })
  }
  // Gerenciar Contas
  const redirectLiAccManagment = document.getElementById("acc-managment");
  if (redirectLiAccManagment) {
    redirectLiAccManagment.addEventListener('click', () => {
      window.location.href = './acc_managment.html';
    })
  }
  // Gerenciar BD
  const redirectLiBDManagment = document.getElementById("bd-managment");
  if (redirectLiBDManagment) {
    redirectLiBDManagment.addEventListener('click', () => {
      window.location.href = './bd_managment.html';
    })
  }
});
