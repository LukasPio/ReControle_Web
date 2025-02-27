//import { initializeApp } from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
//import { getAnalytics } from    'https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js';
//import { getAuth } from         'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';

   
   function C() {
       

        const firebaseConfig = {
            apiKey: "AIzaSyBjtun6IwUqrqQv4hnU9hgrS5AZnDG8z7o",
            authDomain: "recontrole-b3815.firebaseapp.com",
            projectId: "recontrole-b3815",
            storageBucket: "recontrole-b3815.firebasestorage.app",
            messagingSenderId: "413353502819",
            appId: "1:413353502819:web:9c224ddb95ab38459b7056",
            measurementId: "G-RWBS6ZYLER"
          };

            firebase.initializeApp(firebaseConfig);
            const auth = firebase.auth();

        var email = document.getElementById('email_cadas').value;
        var password = document.getElementById('password_cadas').value;
        var C_password = document.getElementById('C_password_cadas').value;
    

    if (password == C_password) {
    // Usa o Firebase Authentication para criar um novo usuário
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            
            var user = userCredential.user;
            alert('Usuário cadastrado com sucesso!');
            
            //                    LOGIN                      //
            //-------------------------------------------------
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {

            console.log('Usuário logado:', userCredential.user);
            window.location.href='home.html';
          })
          .catch((error) => {

            console.error('Erro no login:', error.message);
          });

        })  //-------------------------------------------------


        .catch((error) => {
            
            var errorCode = error.code;
            var errorMessage = error.message;
            alert('Erro: ' + errorMessage + "- codigo de erro:" + errorCode);
        });
    }
    else
    {
        alert('Digite corretamente a senha de confirmação!');
    }

    }
