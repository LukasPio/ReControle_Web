import {readUsers} from './js_functions/realtime_db.js';
import { searchFor, swalFireLookForUser } from './js_functions/swal_db_fires.js';
import { loading } from './js_functions/swal_mixins.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";


/*admin.initializeApp();

exports.definirAdmin = functions.https.onCall((data, context) => {
  const uid = data.uid;

  return admin.auth().setCustomUserClaims(uid, { isAdmin: true })
    .then(() => {
      return { message: "Usuário agora é admin!" };
    })
    .catch((error) => {
      throw new functions.https.HttpsError("internal", error.message);
    });
});
*/

document.addEventListener('DOMContentLoaded', () => {
    loading.fire();
    
    readUsers(null, 'acc-manage');
        
    const container = document.getElementById('users-account-list');
    if (container) {
        container.addEventListener('click', function (e) {
            if (e.target.tagName == 'LI' || e.target.tagName == 'SPAN') {
                swalFireLookForUser(e.target.closest('li').attributes.data_id.value)
            }

        })
    }
})