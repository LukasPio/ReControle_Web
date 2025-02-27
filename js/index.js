import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAnalytics }   from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js';
import { getAuth, signInWithEmailAndPassword } from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig} from "../js/Config.js";

document.addEventListener('DOMContentLoaded', () => {
  const botao = document.getElementById('Login');
  botao.addEventListener('click', () => {

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    
    //----------------------------------
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const C_password = document.getElementById('Confirm_password').value;


    if (password == C_password ) {
      
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {

            alert('Usuário logado:' + userCredential.user);
            window.location.href='home.html';
          })
          .catch((error) => {

            alert('Erro ao tentar realizar o login:       ' + error.message);
          });
      
        }
        else
        {
          alert('Digite corretamente a senha de confirmação!');
        }
    });

  });