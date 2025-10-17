import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, /*signOut*/} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig, hrefsConfig} from "./js_config/Config.js";
import {errorSwalResponse} from './js_functions/swal_fire_errors.js';
import {writeUserData} from './js_functions/realtime_db.js';
import { errorToastSwal } from './js_functions/swal_mixins.js';
//import { getAnalytics }   from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js';
//import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

    const index = hrefsConfig.index;
    const home = hrefsConfig.home;
    
  // Sign up
document.addEventListener('DOMContentLoaded', () => {
  
  const signButton = document.getElementById('sign-button');
  if (signButton){      
    signButton.addEventListener('click', () => {        
      initializeApp(firebaseConfig);
      const auth = getAuth();

      var name = document.getElementById('sign-name').value;
      var email = document.getElementById('sign-email').value; 
      var password = document.getElementById('sign-password').value;
      var C_password = document.getElementById('sign-password-c').value;
    
      if (password == C_password) {
        createUserWithEmailAndPassword(auth, email, password)   .then((userCredential) => {
          var user = userCredential.user;
          updateProfile(user, {displayName: name});
          writeUserData(user.uid, 1, '', name, email);

          if (sendEmailVerification(user)) {
            Swal.fire({
              text: "Para terminar o cadastro, verifique o seu login.",
              icon: 'info',
              showConfirmButton: true,
              showCloseButton: false,
              confirmButtonText: 'OK',
              preConfirm: async () => {
                window.location.href = `../${index}`
              }
            })
          }
        }).catch((error) => errorSwalResponse(error));
      }
      else
      {
          errorToastSwal.fire({ title: 'Digite corretamente a senha de confirmação' })
      }
    })
  }    
});

// Login
document.addEventListener('DOMContentLoaded', () => {
  initializeApp(firebaseConfig);
  const auth = getAuth();
    
  const login = document.getElementById('login-button');
  const check = document.getElementById('checkbox');

  if (login) {
    // Login automático
    if (localStorage.getItem('email') && localStorage.getItem('password')){
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
      signInWithEmailAndPassword(auth, email, password ).then((userCredential) => {
        console.log('user loged: ' + userCredential.user.displayName);
        window.location.href = `./html/${home}`;
      }).catch((error) => errorSwalResponse(error))
    }

    // Login utilizando o botão "lembrar de mim"
    check.addEventListener('change', () => {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      if (check.checked == true && email && password) {      
        login.addEventListener('click', () => {
          signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            if (auth.currentUser.isVerified){
              console.log("User loged: " + userCredential.user.displayName);
              localStorage.setItem('email', email);
              localStorage.setItem('password', password);
              window.location.href = `./html/${home}`;
            }
            else
            {
              Swal.fire({
                title: 'E-mail não verificado',
                text: 'Gostaria de verificar o seu e-mail?',
                icon: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Verificar'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Realizar swal fire para pegar o email e enviar a verificação
                  Swal.fire({
                    title: 'Enviar verificação',
                    text: 'Digite seu e-mail para verificá-lo.',
                    icon: 'info',
                    input: 'text',
                    inputAttributes: {
                      autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: "Enviar",
                    showLoaderOnConfirm: true,
                  }).then((verifResult) => {
                    if (verifResult.isConfirmed) {
                      if (sendEmailVerification(userCredential.user)) {
                        Swal.fire({
                          title: 'E-mail enviado!',
                          icon: 'success'
                        })
                      }
                    }
                  })
                }
              })
            }
          })
          .catch((error) => errorSwalResponse(error))
        });
      }
    });

    // Login sem utilizar o botão "lembrar de mim"
    if (check.checked == false && localStorage.getItem('email') != document.getElementById('login-email')) {
      login.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        signInWithEmailAndPassword(auth, email, password).then(() => {
          if (auth.currentUser.emailVerified) {
            const password_ex = {
              value: document.getElementById('login-password').value,
              expiresIn: new Date().getTime() + 2 * 60 * 60 * 1000 // Expira em 2 horas à frente
            };
            const email_ex = {
              value: document.getElementById('login-email').value,
              expiresIn: new Date().getTime() + 2 * 60 * 60 * 1000 // Expira em 2 horas à frente
            };
            localStorage.setItem('email', JSON.stringify(email_ex));
            localStorage.setItem('password', JSON.stringify(password_ex));
            
            window.location.href = `./html/${home}`;
          }
          else
          {
            // Para verificar o email
          }
        }).catch((error) => errorSwalResponse(error))
      })
    }
  }
});

//Logout e outros
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('logout');
  const recuperar = document.getElementById("recuperar");
  if(button){
    button.addEventListener('click', () => {

      initializeApp(firebaseConfig);
      const auth = getAuth();

      auth.signOut().then(() => {
        localStorage.clear();
        window.location.href = `../${index}`;
      }).catch((error) => errorSwalResponse(error))
    })
  }

  //Recuperação de senha
    if (recuperar) {
    recuperar.addEventListener('click', () => {
      const r_email = document.getElementById("rec_email").value;

      initializeApp(firebaseConfig);
      const auth = getAuth();

      sendPasswordResetEmail(auth, r_email).then(() => {
        Swal.fire({
          title: 'E-mail enviado!',
          text: 'Um e-mail de recuperação de senha foi enviado.',
          icon: 'success'
        });
        document.getElementById("rec_email").value = "";
      }).catch((error) => errorSwalResponse(error))
    })
  }
});