

import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, updateEmail} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig} from "../js_config/Config.js";

    const saveName = document.getElementById('edit_name');
    const backName = document.getElementById('back_name');
    const cancelName = document.getElementById('cancel_name');
    const saveEmail = document.getElementById('edit_email');
    const backEmail = document.getElementById('back_email');
    const divEmail = document.getElementById('div_email');
    const cancelEmail = document.getElementById('cancel_email');
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

                    if (saveName) { 
                        saveName.addEventListener('click', () => {
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

                    if (backName) { 
                        backName.addEventListener('click', () => {
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

                    if (saveEmail) { 
                        saveEmail.addEventListener('click', () => {
                            updateEmail(auth.currentUser, document.getElementById('in_email').value)
                            .then(() => {   
                                Swal.fire({
                                    title: 'E-mail alterado!!',
                                    text: 'Seu E-mail foi alterado com sucesso!', 
                                    icon: 'success',
                                    timer: 3000
                                });
                            }).catch((error) => {
                                Swal.fire({
                                    title: 'Falha ao alterar o  E-mail.',
                                    text: 'Erro: ' + error, 
                                    icon: 'error',
                                    timer: 3000
                                })
                            })
                        })
                    }



                    if (backEmail) {
                        backEmail.addEventListener('click', () => {
                            if (C_email != document.getElementById('in_email').value) {
                                updateEmail()
                                .then(() => {
                                    Swal.fire ({
                                        title: 'Reversão concluida.',
                                        text: 'E-mail restaurado com sucesso!',
                                        icon: 'success',
                                        timer: 3000
                                    })
                                }).catch((error) => {
                                    Swal.fire({
                                        title: 'Falha ao alterar o  E-mail.',
                                        text: 'Erro: ' + error, 
                                        icon: 'error',
                                        timer: 3000
                                })
                            })
                            }
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