import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAnalytics }   from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js';
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider  } from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig} from "../js/Config.js";

document.addEventListener('DOMContentLoaded', () => {
  const botao = document.getElementById('Cadastro');
  botao.addEventListener('click', () => {
            
            const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);
            const auth = getAuth();

             

        var email = document.getElementById('email_cadas').value;
        var password = document.getElementById('password_cadas').value;
        var C_password = document.getElementById('C_password_cadas').value;
    

    if (password == C_password) {
    // Usa o Firebase Authentication para criar um novo usuário
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            
            var user = userCredential.user;
            alert('Usuário cadastrado com sucesso!');

            window.location.href='index.html';
        

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