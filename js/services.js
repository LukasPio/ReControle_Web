import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAnalytics }   from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js';
//import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider  } from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig, hrefsConfig} from "./Config.js";

    const index = hrefsConfig.index;
    const home = hrefsConfig.home;


document.addEventListener('DOMContentLoaded', () => {

    const button = document.getElementById('Cadastro');
    if (button){
  button.addEventListener('click', () => { const app = initializeApp(firebaseConfig);
            getAnalytics(app);
            const auth = getAuth();

             
        var name = document.getElementById('name_cadas').value;
        var email = document.getElementById('email_cadas').value;
        var password = document.getElementById('password_cadas').value;
        var C_password = document.getElementById('C_password_cadas').value;
    

    if (password == C_password) {
    // Usa o Firebase Authentication para criar um novo usuário
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            
            var user = userCredential.user;

            updateProfile(user, {displayName: name});

            if (sendEmailVerification(user)) {

            alert('Para terminar seu cadastro, verifique o seu email' );

            window.location.href=index;
        
            }
        })  


        .catch((error) => {
            
            var errorCode = error.code;
            var errorMessage = error.message;
            alert('Erro ao Tentar realizar o cadastro:       ' + errorMessage + "\n\n- codigo de erro:" + errorCode);
        });
    }
    else
    {
        alert('Digite corretamente a senha de confirmação!');
    }

    
  });
}
  
            
           
});



//Cadastro com o Google
/*
document.addEventListener('DOMContentLoaded', () => {

    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const botao = document.getElementById('C_Google');
    botao.addEventListener('click', () => {

    const db = getFirestore(app);

signInWithPopup(auth, provider)
  .then((result) => {
    const user = result.user;
    return setDoc(doc(db, "usuarios", user.uid), {
      nome: user.displayName,
      email: user.email,
      foto: user.photoURL
    });
  })
  .then(() => {
    console.log("Usuário cadastrado/atualizado no Firestore.");
  })
  .catch((error) => {
    console.error("Erro ao salvar no Firestore:", error.message);
  });


    });
});
*/
 





// Login






document.addEventListener('DOMContentLoaded', () => {


    const button = document.getElementById('Login');
    if (button){
    button.addEventListener('click', () => {

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

            alert('Usuário logado:  ' + userCredential.user.email);

            document.cookie = `email=${email}`;
            document.cookie = `password=${password}`;
            window.location.href=home;

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
}
  

  });


  



  //Login pelo Google

/*



  
  document.addEventListener('DOMContentLoaded', () => {
    const botao = document.getElementById('L_google');
    botao.addEventListener('click', () => {

      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

    signInWithPopup(auth, provider)
      .then((result) => {
        // Usuário autenticado com sucesso
        const user = result.user;
        console.log("Usuário:", user.displayName, user.email);
      })
      .catch((error) => {
        // Trata erros
        console.error("Erro ao autenticar:", error.message);
      });
});
  });*/






  //Logout

  document.addEventListener('DOMContentLoaded', () => {


       const button = document.getElementById('logout');

       if(button){

      button.addEventListener('click', () => {

      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
      const auth = getAuth();

        auth.signOut().then(() => {

      document.cookie = `email=; expires=Thu, 01 Jan 2000 00:00:00 UTC`;
      document.cookie = `password=; expires=Thu, 01 Jan 2000 00:00:00 UTC`;
      window.location.href = index;

    });
  
    });
  }

    
  });