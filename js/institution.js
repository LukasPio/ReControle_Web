import {createLaboratorySwal} from './js_functions/swal_db_fires.js';
import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, onAuthStateChanged} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig} from "./js_config/Config.js";
import {readLaboratories} from './js_functions/realtime_db.js';
import { loading } from './js_functions/swal_mixins.js';

initializeApp(firebaseConfig);
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
    
    loading.fire();

    readLaboratories(null, 'content');

    const searchAcc = document.getElementById('search-acc');
    if (searchAcc) {
        searchAcc.addEventListener('input', (event) => {
            if (event.target.value){
                document.getElementById('labs').innerHTML = null;
                readLaboratories(null, 'search-for', event.target.value)
            }
            else
            if (document.getElementById('labs').innerHTML == '' || !event.target.value) {
                readLaboratories(null, 'content');
            }
        })
    }

    onAuthStateChanged(auth, (user) => {
        const userName = user.displayName;
        const addLab = document.getElementById('lab-add-btn');
        if (addLab) {
            addLab.addEventListener('click', () => {
                createLaboratorySwal(user.uid, userName);
            })
        }
    })
})