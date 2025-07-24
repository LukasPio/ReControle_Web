import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { firebaseConfig } from "../js_config/Config.js";
import { errorToastSwal, loading, successToastSwal } from "../js_functions/swal_mixins.js";
import { readUsers, writeUserData } from '../js_functions/realtime_db.js';
import {convertImg} from '../js_functions/swal_db_fires.js';

const saveName = document.getElementById("edit_name");
const backName = document.getElementById("back_name");
const saveEmail = document.getElementById("edit_email");
const backEmail = document.getElementById("back_email");
const currentImg = document.getElementById('in-img');
const selectImg = document.getElementById('in-get-img');
const senPasswordRecover = document.getElementById("edit_pass");
let email, password;

try {
  const email_ex = JSON.parse(localStorage.getItem("email"));
  const password_ex = JSON.parse(localStorage.getItem("password"));

  email = email_ex.value;
  password = password_ex.value;
} catch {
  email = localStorage.getItem("email");
  password = localStorage.getItem("password");
}

initializeApp(firebaseConfig);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {

  loading.fire({timer: 400})

  const savedTheme = localStorage.getItem("theme") || "white-mode";
  const savedColor = localStorage.getItem("primaryColor") || "#007bff";

  document.body.classList.add(savedTheme);
  document.documentElement.style.setProperty("--primary-color", savedColor);

  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    var C_user = userCredential.user;
    const C_name = C_user.displayName;
    const C_email = C_user.email;

    if (C_user !== null)
      if (C_user) {
        if (auth.currentUser) {
          document.getElementById("in_name").value = C_name;
          document.getElementById("in_email").value = C_email;
          document.getElementById("in_pass").value = password;
          readUsers(C_user.uid, 'general').then(resp => {
            if (resp.user_img_url != '') currentImg.src = resp.user_img_url;
            if (selectImg) { 
              selectImg.addEventListener('change', (event) => {
                convertImg(event.target.files[0], function(base64Result) {
                  writeUserData(
                    C_user.uid,
                    resp.rank,
                    base64Result,
                    resp.user_name,
                    resp.user_email
                  ).then(successToastSwal.fire())
                })
              }) 
            }

            if (saveName) {
              saveName.addEventListener("click", () => {
                if ( updateProfile( C_user, {displayName: document.getElementById( "in_name" ).value } ) ) {
                  writeUserData(
                    C_user.uid,
                    resp.rank,
                    resp.user_img_url,
                    document.getElementById( "in_name" ).value,
                    resp.user_email
                  ).then(
                    successToastSwal.fire({
                      title: `Nome alterado para ${document.getElementById("in_name").value}.`,
                      timer: 2000,
                    })  
                  )
                  .catch((error) => {
                    errorToastSwal.fire({
                      title: "Falha ao alterar o  E-mail. Erro: " + error,
                      timer: 3000,
                    })
                  });
                  getAuth();
                }
              });
            }

            if (backName) {
              backName.addEventListener("click", () => {
                document.getElementById("in_name").value = C_name;
                if (updateProfile(C_user, { displayName: C_name })){
                  writeUserData(
                    C_user.uid,
                    resp.rank,
                    resp.user_img_url,
                    C_name,
                    resp.user_email
                  ).then(
                    successToastSwal.fire({
                      title: `Nome revertido para ${C_name}.`,
                      timer: 2000,
                    })
                  ) 
                  .catch((error) => {
                    errorToastSwal.fire({
                      title: "Falha ao alterar o  E-mail. Erro: " + error,
                      timer: 3000,
                    })
                  })
                  getAuth();
                }
              });
            }

            if (saveEmail) {
              saveEmail.addEventListener("click", () => {
                updateEmail( auth.currentUser, document.getElementById("in_email").value ).then(() => {
                  writeUserData(
                    C_user.uid,
                    resp.rank,
                    resp.user_img_url,
                    resp.user_name,
                    document.getElementById("in_email").value
                  ).then(
                    successToastSwal.fire({
                      title: "Seu E-mail foi alterado com sucesso!",
                      timer: 2000,
                    })
                  )
                })
                .catch((error) => {
                  errorToastSwal.fire({
                    title: "Falha ao alterar o  E-mail. Erro: " + error,
                    timer: 3000,
                  })
                })
              })
            }

            if (backEmail) {
              backEmail.addEventListener("click", () => {
                if (C_email != document.getElementById("in_email").value) {
                  updateEmail( auth.currentUser, email ).then(() => {
                    writeUserData(
                      C_user.uid,
                      resp.rank,
                      resp.user_img_url,
                      resp.user_name,
                      email
                    ).then(
                      successToastSwal.fire({
                        title: "E-mail restaurado com sucesso!",
                        timer: 2000,
                      })
                    )
                  })
                  .catch((error) => {
                    errorToastSwal.fire({
                      title: "Falha ao alterar o  E-mail.Erro: " + error,
                      timer: 3000,
                    });
                  });
                }
              });
            }
          });


          if (senPasswordRecover) {
            senPasswordRecover.addEventListener("click", () => {
              sendPasswordResetEmail(auth, C_email).then(() => {
                successToastSwal.fire({
                  title: "Um e-mail de redefinição de senha foi enviado.",
                  timer: 2000,
                });
              });
            });
          }
        }
      }
  });
});
