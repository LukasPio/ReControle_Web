import { readObjects } from "./js_functions/realtime_db.js";
import { createObjectSwal, searchFor } from "./js_functions/swal_db_fires.js";
import { loading } from "./js_functions/swal_mixins.js";
import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, onAuthStateChanged} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import {firebaseConfig} from "./js_config/Config.js";

initializeApp(firebaseConfig);
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {

    loading.fire({timer: 1050});

    readObjects(null, 'content');

    onAuthStateChanged(auth, (user) => {
        const addObj = document.getElementById('obj-add-btn');
        if (addObj) {
            addObj.addEventListener('click', () => {
                createObjectSwal();
            })
        }
    })
})