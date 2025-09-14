import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { firebaseConfig, hrefsConfig } from "./js_config/Config.js";
import {readAll, readReports, readUsers} from './js_functions/realtime_db.js';
import { getDatabase, ref, child, get, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import {searchFor, swalFireLookForLaboratory, swalFireLookForObject, swalFireLookForOcurrence, swalFireLookForUser} from './js_functions/swal_db_fires.js';
import { loading } from "./js_functions/swal_mixins.js";

// Inicializa Firebase
toString;
initializeApp(firebaseConfig);
const auth = getAuth();

async function search (value) {

  const mainElement = document.getElementById('main');
  const navBar = document.createElement('div');
  navBar.className = 'navbar';
  navBar.id = 'navbar';

  const backButton = document.createElement('button');
  backButton.innerHTML = `<a href="../${window.location.pathname}"><svg class="link" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343ff"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg></a>`;
  backButton.className = 'back-button';

  const userButton = document.createElement('button');
  userButton.id = 'user-btn';
  userButton.textContent = 'Usuários';
      
  const callButton = document.createElement('button');
  callButton.id = 'call-btn';
  callButton.textContent = 'Chamados';

  const labButton = document.createElement('button');
  labButton.id = 'lab-btn';
  labButton.textContent = 'Laboratórios';
      
  const objButton = document.createElement('button');
  objButton.id = 'obj-btn';
  objButton.textContent = 'Objetos';

  const main = document.createElement('div');
  main.className = 'response-div';
  main.id = 'response';

  mainElement.innerHTML = '';
  navBar.appendChild(backButton);

  readAll().then(resp => {
    const data = {
      user: 0,
      report: 0,
      lab: 0,
      obj: 0
    }
    const users = resp.users;
    const calls = resp.calls;
    const labs = resp.labs;
    const objs = resp.objs;
    for (const Id in users) {
      if (users[Id].user_name.startsWith(value)){
        data.user++
      }
    }
    for (const Id in calls) {
      if (Id.startsWith(value)){
        data.report++
      }
    }
    for (const Id in labs) {
      if (Id.startsWith(value)){
        data.lab++
      }
    }
    for (const Id in objs) {
      if (Id.startsWith(value)){
        data.obj++
      }
    }
      
    const majorKey = `${Object.keys(data).find(
      key => data[key] === Math.max(...Object.values(data))
    )}`;

    if (data.user != 0) {
      navBar.appendChild(userButton);
    }
    if (data.report != 0) {
      navBar.appendChild(callButton);
    }
    if (data.lab != 0) {
      navBar.appendChild(labButton);
    }
    if (data.obj != 0) {
      navBar.appendChild(objButton);
    }
    searchFor(value, majorKey);
    if (majorKey == 'report') {
      callButton.className = 'b-active'
    }
    else if (majorKey == 'user') {
      userButton.className = 'b-active'
    }
    else if (majorKey == 'lab') {
      labButton.className = 'b-active'
    }
    else {
      objButton.className = 'b-active'
    }
  })
  mainElement.appendChild(navBar);
}

document.addEventListener("DOMContentLoaded", () => {

  const searchE = document.getElementById('search-anyt');
  if (searchE) {
    searchE.addEventListener('change', (e) => {
      search(`${e.target.value}`).then(() => {
        const mainE = document.getElementById('main');
        const navBar = document.getElementById('navbar');
        mainE.addEventListener('click', function (event) {
          const target = event.target;
          if (target.className == 'manage-u') {
            swalFireLookForUser(target.id)
          }
          if (target.className == 'manage-r') {
            swalFireLookForOcurrence(target.id)
          }
          if (target.className == 'manage-l') {
            swalFireLookForLaboratory(target.id)
          }
          if (target.className == 'manage-o') {
            swalFireLookForObject(target.id)
          }
        });
        if (navBar) {
          navBar.addEventListener('click', function (event) {
            const target = event.target;              
            mainE.innerHTML = '';
            mainE.appendChild(navBar);
            Array.from(navBar.childNodes).forEach(child => {
              child.className = ''
            })
            if (target.id == 'obj-btn') {
              searchFor(searchE.value, 'obj');
              document.getElementById('obj-btn').className = 'b-active';
            }
            if (target.id == 'lab-btn') {
              searchFor(searchE.value, 'lab');
              document.getElementById('lab-btn').className = 'b-active';
            }
            if (target.id == 'call-btn') {
              searchFor(searchE.value, 'report');
              document.getElementById('call-btn').className = 'b-active';
            }
            if (target.id == 'user-btn') {
              searchFor(searchE.value, 'user');
              document.getElementById('user-btn').className = 'b-active';
            }
          })
        }
      })
    })
  }

  

  const containerR = document.getElementById('chamados');
  if (containerR) {
    containerR.addEventListener('click', function (e) {
      if (e.target.tagName == 'A') {
        swalFireLookForOcurrence(e.target.id)
      }
    })
  }

  const containerL = document.getElementById('labs');
  if (containerL) {
    containerL.addEventListener('click', function (e) {
      if (e.target.tagName == 'A') {
        swalFireLookForLaboratory(e.target.id)
      }
    })
  }

  const containerOE = document.getElementById('eletronics');
  if (containerOE) {
    containerOE.addEventListener('click', function (e) {
      if (e.target.tagName == 'A') {
        swalFireLookForObject(e.target.id)
      }
    })
  }

  const containerOF = document.getElementById('furniture');
  if (containerOF) {
    containerOF.addEventListener('click', function (e) {
      if (e.target.tagName == 'A') {
        swalFireLookForObject(e.target.id)
      }
    })
  }

  const containerO = document.getElementById('other');
  if (containerO) {
    containerO.addEventListener('click', function (e) {
      if (e.target.tagName == 'A') {
        swalFireLookForObject(e.target.id)
      }
    })
  }


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
    readUsers(user.uid, 'general').then(resp => {
      if (resp.user_img_url) {
        document.getElementById('user-img').src = resp.user_img_url
      }
      localStorage.setItem('rank', resp.rank);
    })
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

if (localStorage.getItem('rank') == 3) {
  document.getElementById('link-side').innerHTML += `
    <li id="acc-management">Gerenciar Contas</li>
  `
}

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
  

  const link = (window.location.pathname).slice(6);
  switch (link) {
    case 'acc_management.html': document.getElementById('acc-management').className = 'active'; break;
    case 'institution.html': document.getElementById('institution').className = 'active'; break;
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
  const redirectLiAccManagment = document.getElementById("acc-management");
  if (redirectLiAccManagment) {
    redirectLiAccManagment.addEventListener('click', () => {
      window.location.href = './acc_management.html';
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
