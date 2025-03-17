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

        document.getElementById('name').innerHTML = ` ${user.displayName}`;
        document.getElementById("account").innerHTML = `${user.email}`;
      })
      .catch((error) => {

        console.log('Erro ao tentar realizar o login:       ' + error.message + "\n\n Tente novamente.");
        window.location.href = "index.html";

      });
  


    
    
    
    
    
    
