import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig, hrefsConfig} from "./Config.js";

    const index = hrefsConfig.index;
    const H_acc = hrefsConfig.conf_acc;

    const getCookie = (name) => {
    
      const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();

    };
  
    const email = getCookie('email');
    const password = getCookie('password');
  
    document.cookie = `email=${email}`;
    document.cookie = `password=${password}`;

    const app = initializeApp(firebaseConfig);
    //const analytics = getAnalytics(app);
    const auth = getAuth();

  if (email != null && password != null) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        var user = userCredential.user;

        document.getElementById('name').innerHTML = ` ${user.displayName}`;
        document.getElementById("account").innerHTML = `${user.email}`;
      })
      .catch((error) => {

        console.log('Erro ao tentar realizar o login:       ' + error.message + "\n\n Tente novamente.");
        window.location.href = index;

      });

    }
    else
    {
      const b_acc = document.getElementById("account");

      b_acc.innerHTML = `Faça login`;
      document.addEventListener('DOMContentLoaded', () => {

        b_acc.addEventListener('click', () => {    window.location.href = index  });
      });
    }

    document.addEventListener('DOMContentLoaded', () => {

      const botao = document.getElementById('name');

      botao.addEventListener('click', () => {   window.location.href = H_acc    });    
    });
    
    //
    
    
