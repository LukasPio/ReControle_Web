import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, updateProfile /*, updatePassword*/} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
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
  
          var C_user = userCredential.user;
          const C_name = C_user.displayName;
          const C_email = C_user.email;

          if (C_user !== null)

          console.log("Usuário logado:  " + C_email);

          

          if (C_user) {

            if (auth.currentUser){
                
              document.getElementById("change").innerHTML = `<p><input type='text' id='in_1' value='${C_user.displayName}'>
              <button id='edit_1'>Salvar</button><button id='back_1'>Reverter </button></p>
             
              <br><p><input id='in_2' type='email' value='${C_user.email}'>
              <button id='edit_2'>Salvar</button><button id='back_2'>Reverter </button></p>
              
              <br><p><input type='password' id='in_3'value='${password}'>
              <button id='hide_show'><svg xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg></button>
              <button id='edit_3'>Salvar</button><button id=back_3>Reverter</button></p>`;                                                                                 

              if (C_user.emailVerified) {
                
                document.getElementById("change").innerHTML += "<br><p> Email verificado. </p>";
                
              }
            }
          }

          const edit_1 = document.getElementById("edit_1");
          const edit_2 = document.getElementById("edit_2");
          const edit_3 = document.getElementById("edit_3");
          const back_1 = document.getElementById("back_1");
          const back_2 = document.getElementById("back_2");
          const back_3 = document.getElementById("back_3");
          const pass_in = document.getElementById('hide_show');

          const passwordInput = document.getElementById('in_3');

          
          
          if (edit_1) {
            edit_1.addEventListener('click', () => {
              if (updateProfile(C_user, {displayName: document.getElementById("in_1").value})) {
                console.log("Alterado com sucesso.")
              }
            })
          }


          if (edit_2) {
            edit_2.addEventListener('click', () => {
              if (updateProfile(C_user, {email: document.getElementById("in_2").value})) {
                console.log("Alterado com sucesso.")
              }
            })
          }


          if(edit_3) {
            edit_3.addEventListener('click', () => {
             /* if (auth.currentUser.updatePassword(document.getElementById("in_3").value)) {
                console.log("Alterado com sucesso.")
              }*/
               alert("Em andamento...")
            })
          }


          if (back_1) {
            back_1.addEventListener('click', () => {

              document.getElementById("in_1").value = C_name;

              if(updateProfile(C_user,{displayName : C_name}))
                console.log("Revertido")

            })
          }


          if (back_2) {
            back_2.addEventListener('click', () => {

              document.getElementById("in_2").value = C_email;

              if(updateProfile(C_user,{email: C_email}))
                console.log("Revertido")
              
            })
          }


          if (back_3) {
            back_3.addEventListener('click', () => {

              document.getElementById("in_3").value = password;

              alert("Reversão em andamento...");
          })
        }

  
        if (pass_in){
        pass_in.addEventListener('click', () => {
    
            
    
            if (passwordInput.getAttribute('type') === 'password') {
                pass_in.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>';
                passwordInput.setAttribute('type', 'text');
            } else {
                pass_in.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>';
                passwordInput.setAttribute('type', 'password');
            }
    
        });}


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