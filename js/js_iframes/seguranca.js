import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig} from "../js_config/Config.js";
import {errorSwalResponse} from '../js_functions/swal_fire_errors.js';

if (localStorage.getItem('theme')) {
  document.getElementById('seg_verif').className = localStorage.getItem('theme')
}

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

document.addEventListener('DOMContentLoaded', () => {

    initializeApp(firebaseConfig);
    const auth = getAuth();
    
    signInWithEmailAndPassword(auth, email, password)
    .then ((userCredential) => {
      if (auth.currentUser.emailVerified) 
        document.getElementById('seg_verif').textContent += 'E-mail verificado';
    })
    .catch ((error) => errorSwalResponse(error));
})