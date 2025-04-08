import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig, hrefsConfig} from "./Config.js";

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

if (email != null || password != null){

  signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
  
          var user = userCredential.user;

          if (user !== null)

          console.log("Usuário logado:  " + user.email);

          document.getElementById("change").innerHTML = "<p>aaaaaaaa</p>";


        })
        .catch((error) => {
  
          console.log('Erro ao tentar realizar o login:       ' + error.message + "\n\n Tente novamente.");
          window.location.href = hrefsConfig.home;
  
        });
    }
    else
    {
        console.log("Erro de envio");
    }