import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAnalytics }   from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js';
//import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig} from "../js/Config.js";



    // No segundo arquivo
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
const email = getCookie('email');
const password = getCookie('password');


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        var user = userCredential.user;

        alert(`Bem vindo, ${user.displayName}`);

      })
      .catch((error) => {

        alert('Erro ao tentar realizar o login:       ' + error.message);
      });
  

document.getElementById("account").innerHTML = email;
    
    
    
    
    
    
    
    
    
    
    /*
    
        const index_get = hrefsConfig.index;

    
    
    


        console.log(email);
        console.log(email.substring(0, email.indexOf('@')));
        console.log(email.substring(0, email.indexOf('@')).replace(/0/g, "").replace(/1/g, "").replace(/2/g, "").replace(/3/g, "").replace(/4/g, "").replace(/5/g, "").replace(/6/g, "").replace(/7/g, "").replace(/8/g, "").replace(/9/g, ""));
        document.getElementById("account").innerHTML = email;


         if (email == null) {
            document.getElementById("account").innerHTML = "<button id='back_login_home' >Fazer Login</button>";

                document.addEventListener('DOMContentLoaded', () => {
                const botao = document.getElementById('back_login_home');
                botao.addEventListener('click', () => { window.location.href = index_get;  });  });

         }
         else {

            if (email.substring(0, email.indexOf('@')).includes(".")) {
                names = email.substring(0, email.indexOf('@')).split('.');
                firstN = names[0].replace(/0/g, "").replace(/1/g, "").replace(/2/g, "").replace(/3/g, "").replace(/4/g, "").replace(/5/g, "").replace(/6/g, "").replace(/7/g, "").replace(/8/g, "").replace(/9/g, "");
                lastN = names[1].replace(/0/g, "").replace(/1/g, "").replace(/2/g, "").replace(/3/g, "").replace(/4/g, "").replace(/5/g, "").replace(/6/g, "").replace(/7/g, "").replace(/8/g, "").replace(/9/g, "");
                nome = firstN + " " + lastN;
            }
            else
            {
                nome = email.substring(0, email.indexOf("@")).replace(/0/g, "").replace(/1/g, "").replace(/2/g, "").replace(/3/g, "").replace(/4/g, "").replace(/5/g, "").replace(/6/g, "").replace(/7/g, "").replace(/8/g, "").replace(/9/g, "");
                conso
            }

            document.getElementById("ul_account").innerHTML = "<li href='#'> Perfil de " + nome + "</li> " +
                                                              "<li href='#'>Configurações da conta</li>";
         }
    /* Botão de teste

document.addEventListener('DOMContentLoaded', () => {
    const botao = document.getElementById('teste');
    botao.addEventListener('click', () => {
        
        

        


    });
});

*/