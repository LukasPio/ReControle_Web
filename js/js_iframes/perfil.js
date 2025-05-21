

import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig} from "../js_config/Config.js";

    const save = document.getElementById('edit_name');
    const back = document.getElementById('back_name');
    const sendEmailRecover = document.getElementById('edit_email');
    const senPasswordRecover = document.getElementById('edit_pass');


  let email, password;

  try{
const email_ex = JSON.parse(localStorage.getItem('email'));
const password_ex = JSON.parse(localStorage.getItem('password'));

 email = email_ex.value;
 password = password_ex.value;
 
}   catch {
  email = localStorage.getItem('email');
  password = localStorage.getItem('password');
}
    
    initializeApp(firebaseConfig);
    const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        var C_user = userCredential.user;
        const C_name = C_user.displayName;
        const C_email = C_user.email;

        if (C_user !== null)
            if (C_user) {
                if (auth.currentUser){
                    document.getElementById('in_name').value = C_name;
                    document.getElementById('in_email').value = C_email;
                    document.getElementById('in_pass').value = password;

                    if (save) { 
                        save.addEventListener('click', () => {
                            if (updateProfile(C_user, {displayName: document.getElementById("in_name").value})) {
                                Swal.fire({
                                    title: 'Alterado',
                                    text: `Nome alterado para ${document.getElementById('in_name').value}.`,
                                    icon: 'success',
                                    timer: 2000
                                });
                                getAuth();
                            }
                        })
                    }

                    if (back) { 
                        back.addEventListener('click', () => {
                            document.getElementById("in_name").value = C_name;
                            if(updateProfile(C_user,{displayName : C_name}))
                                Swal.fire({
                                    title: 'Revertido',
                                    text: `Nome revertido para ${C_name}.`,
                                    icon: 'success',
                                    timer: 2000
                                });
                                getAuth();
                        })
                    }

                    if (sendEmailRecover) { 
                        sendEmailRecover.addEventListener('click', () => {
                            Swal.fire({
                                    title: 'Quase lá',
                                    text: 'Esta parte ainda está em andamento', 
                                    icon: 'info',
                                    timer: 3000
                                })
                        })
                    }

                    if (senPasswordRecover) { 
                        senPasswordRecover.addEventListener('click', () => {
                            sendPasswordResetEmail(auth, C_email)
                                .then(() => {
                                    Swal.fire({
                                        title: 'Enviado',
                                        text: 'Um e-mail de redefinição de senha foi enviado.', 
                                        icon: 'success',
                                        timer: 3000
                                    })
                                })
                        })
                    }
                }
        }
    })
})