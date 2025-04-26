import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAnalytics }   from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js';
//import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, signInWithPopup, GoogleAuthProvider  } from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {FEC,EMF, firebaseConfig, hrefsConfig} from "./js_config/Config.js";

    const index = hrefsConfig.index;
    const home = hrefsConfig.home;
    const e_verif = hrefsConfig.e_verif;



  // Sign up


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




// Login


document.addEventListener('DOMContentLoaded', () => {

    const button = document.getElementById('Login');

  if (localStorage.getItem('email') && localStorage.getItem('password') &&  button) {

    initializeApp(firebaseConfig);
    const auth = getAuth();
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      alert('Usuário logado:  ' + userCredential.user.email);
      window.location.href=home;
    })
    .catch((error) => {
      
        alert('Erro ao tentar realizar o login:       ' + error.message);
    });
  }


    
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

            if (userCredential.user.emailVerified){

            alert('Usuário logado:  ' + userCredential.user.email);

            localStorage.setItem('email', email);
            localStorage.setItem('password', password);

            window.location.href=home;
          
          }
          else
          {
            
            alert("Este E-Mail ainda não foi cadastrado.");
            
            window.location.href = e_verif;
            
          }

          })
          .catch((error) => {

            //alert('Erro ao tentar realizar o login:       ' + error.message);

            switch (error.code) {

              case `${FEC.c_inv_e}`:      alert(EMF.inv_email);
                break;

              case `${FEC.C_miss_p}`:     alert(EMF.miss_pass);
                break;
              
              case `${FEC.c_inv_c}`:     alert(EMF.inv_cred);
                break;
              
              case `${FEC.c_user_dis}`:   alert(EMF.user_dis);
                break;
                
              case `${FEC.C_too_r}`:      alert(EMF.too_req);
                break;
        
              case `${FEC.C_miss_e}`:     alert(EMF.miss_email);
                break;
              
              default: alert("Erro ao enviar. Tente novamente." + error.code)}
          });
      
        }
        else
        {
          alert('Digite corretamente a senha de confirmação!');
        }
    });
}
  

  });


  
  //Logout e outros

  document.addEventListener('DOMContentLoaded', () => {


       const button = document.getElementById('logout');
       const recuperar = document.getElementById("recuperar");

       if(button){

      button.addEventListener('click', () => {

      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
      const auth = getAuth();

        auth.signOut().then(() => {

      localStorage.clear();
      window.location.href = index;

    });
  
    });
  }


       if (recuperar) {

        recuperar.addEventListener('click', () => {

          const r_email = document.getElementById("rec_email").value;

          initializeApp(firebaseConfig);
          const auth = getAuth();

          sendPasswordResetEmail(auth, r_email)
          .then(() => alert("Email de Recuperação de senha enviado com sucesso!"),
                          document.getElementById("rec_email").value = ""
                          
          )
          .catch((Error) => { switch (Error.code) {

      case `${FEC.c_inv_e}`:      alert(EMF.inv_email);
        break;
      
      case `${FEC.c_user_dis}`:   alert(EMF.user_dis);
        break;
        
      case `${FEC.C_too_r}`:      alert(EMF.too_req);
        break;

      case `${FEC.C_miss_e}`:     alert(EMF.miss_email);
        break;
      
      default: alert("Erro ao enviar. Tente novamente.")}

          })

        })

  }


  

    
  });