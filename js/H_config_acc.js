import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig, hrefsConfig} from "./js_config/Config.js";

const perfil = document.getElementById("perfil");
const back = document.getElementById("back");
const seguranca = document.getElementById("seguranca");
const tema = document.getElementById("tema");
//const aba4 = document.getElementById(""); Pode ou não ser inserido
//const aba5 = document.getElementById(""); Pode ou não ser inserido

//try{
if (localStorage.getItem('iframe')){
      document.getElementById('exibir').src = localStorage.getItem('iframe');
      console.log(document.getElementById('exibir').src);
}
   // }
    //catch {
      
    //}

const savedTheme = localStorage.getItem('theme');

let email, password;

try{
  const email_ex = JSON.parse(localStorage.getItem('email'));
  const password_ex = JSON.parse(localStorage.getItem('password'));

  email = email_ex.value;
  password = password_ex.value;
 
} catch {
  email = localStorage.getItem('email');
  password = localStorage.getItem('password');
}
    
initializeApp(firebaseConfig);
const auth = getAuth();

if (email != null || password != null){
  document.addEventListener('DOMContentLoaded', () => {

    if (back) {  back.addEventListener('click', () => {
      localStorage.removeItem('iframe');
      window.location.href = hrefsConfig.home;
    })  }

    if (perfil) {perfil.addEventListener('click', () => {            
      document.getElementById("exibir").src = './iframes/perfil.html';
      if (localStorage.getItem('confirmation') == 1) {
        Swal.fire({
          title: "Gostaria de salvar suas mudanças?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Salvar",
          denyButtonText: `Não Salvar`
        }).then((result) => {
          if (result.isConfirmed) {

            if (Swal.fire("Saved!", "", "success")) 
              localStorage.setItem('iframe', './iframes/perfil.html');
              window.location.reload();

          } else if (result.isDenied) {

            if (Swal.fire("Changes are not saved", "", "info"))
              localStorage.setItem('theme', localStorage.getItem('old_theme'));
              localStorage.setItem('iframe', './iframes/perfil.html');
          }
        });
        localStorage.removeItem('confirmation');
      }
      else
      {
        localStorage.setItem('iframe', './iframes/perfil.html');
        document.getElementById("exibir").src = './iframes/perfil.html';
      }      
    })
  }
      
  if (tema) {      
    tema.addEventListener('click', () => {
      localStorage.setItem('iframe', './iframes/tema.html');
      document.getElementById("exibir").src = './iframes/tema.html';             
    })
  }

  if (seguranca) {   seguranca.addEventListener('click', () => {

      if (localStorage.getItem('confirmation') == 1) {
        Swal.fire({
          title: "Gostaria de salvar suas mudanças?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Salvar",
          denyButtonText: `Não Salvar`
        }).then((result) => {
          if (result.isConfirmed) {
                            
            if (Swal.fire("Saved!", "", "success")) 
              localStorage.setItem('iframe', './iframes/seguranca.html');
              window.location.reload();

            } else if (result.isDenied) {

              if (Swal.fire("Changes are not saved", "", "info"))
                localStorage.setItem('theme', localStorage.getItem('old_theme'));
                localStorage.setItem('iframe', './iframes/seguranca.html');

            }
          });
          localStorage.removeItem('confirmation');
        }
        else
        {
          localStorage.setItem('iframe', './iframes/seguranca.html');
          document.getElementById("exibir").src = './iframes/seguranca.html';
        }
      })
    }

      signInWithEmailAndPassword(auth, email, password).catch((error) => {
        Swal.fire({
          title: 'Erro',
          text: 'Erro ao tentar realizar o login:       ' + error.message + '\n\n Tente novamente.',
          icon: 'error'
        }).then(() => window.location.href = hrefsConfig.home )
      });
    })
  }
  else
  {
    console.log("Erro de envio");
  }

   
if (savedTheme) {
  console.log(savedTheme);
  document.body.className = savedTheme;
  document.querySelectorAll("td").forEach(td => {
    td.className = savedTheme;
  });
} else {
  // Tema padrão
  document.body.className = 'light-mode';
  document.querySelectorAll("td").forEach(td => {
    td.className = "light-mode";
  });
}