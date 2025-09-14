import {readLaboratories} from './js_functions/realtime_db.js';
import { createLaboratorySwal, searchFor } from './js_functions/swal_db_fires.js';
import { loading } from './js_functions/swal_mixins.js';
import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, onAuthStateChanged} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig} from "./js_config/Config.js";

initializeApp(firebaseConfig);
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {

    loading.fire({timer: 1850});

    if (localStorage.getItem('rank') > 1) {
        const button = document.createElement('button');
        button.className = "btn-create-rep";
        button.id = "lab-add-btn";
        button.textContent = "Criar Laboratório";
        document.getElementById('add-div').appendChild(button)
    }

    readLaboratories(null, 'content');

    onAuthStateChanged(auth, (user) => {
        const addObj = document.getElementById('lab-add-btn');
        if (addObj) {
            addObj.addEventListener('click', () => {
                createLaboratorySwal(user.uid, user.displayName);
            })
        }
    })
})