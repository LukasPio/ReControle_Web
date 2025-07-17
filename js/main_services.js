import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { firebaseConfig, hrefsConfig } from "./js_config/Config.js";
import {readUsers} from './js_functions/realtime_db.js';
import {swalFireLookForOcurrence, swalFireLookForLaboratory} from './js_functions/swal_db_fires.js';

// Inicializa Firebase
toString;
initializeApp(firebaseConfig);
const auth = getAuth();


document.addEventListener("DOMContentLoaded", () => {

  // Aplica tema salvo QUE O MANO ENZO FEZ -- Augusto
  // Estou sentindo um baita julgamento vindo de ti AUGUSTO -- Enzo
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
    readUsers(user.uid, 'user-rank').then(rank => localStorage.setItem('rank', rank));
    localStorage.setItem('userUID', user.uid);
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

  //Verificação do nível de acesso do usuário logado
  if (localStorage.getItem('rank')) {
    if (localStorage.getItem('rank') == 3) {
      document.getElementById('link-side').innerHTML += `
        <li id="institution">Instituição</li>
        <li id="acc-managment">Gerenciar contas</li>
        <li id="bd-managment">Gerenciar BD</li>
      `
    }
  }

  // Entrada do 'Ver mais' dos laboratórios
  if (new URLSearchParams(window.location.search).get('ID')) {
      swalFireLookForLaboratory(new URLSearchParams(window.location.search).get('ID'));
  }

  // Entrada do 'Ver mais' das ocorrência
  if (new URLSearchParams(window.location.search).get('id')) {
      swalFireLookForOcurrence(new URLSearchParams(window.location.search).get('id'));
  }

  const accToggle = document.getElementById('account-toggle');
  if (accToggle) {
    accToggle.addEventListener('click', () => {
      toggleDropdown();
    })
  }

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

  //Parte de procura geral
  const searchAcc = document.getElementById('search-anyt');
    if (searchAcc) {
        searchAcc.addEventListener('input', (event) => {
            if (event.target.value){
              // Falta o concept do Front-End para que se possa continuar aqui
            } 
        })
    }
});
