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

    onAuthStateChanged(auth, (user) => {
        const userName = user.displayName;
        const addLab = document.getElementById('lab-add-btn');
        if (addLab) {
            addLab.addEventListener('click', () => {
                createLaboratorySwal(user.uid, userName);
            })
        }
    })

readLaboratories(null, 'content').then(resp => { 
    if (resp) {
        for (const labID in resp) {     
            const laboratory = document.createElement('div');
            laboratory.className = 'lab-card';
            laboratory.id = labID;

            const labIDElement = document.createElement('p');
            labIDElement.innerHTML = `<strong>${labID}</strong><br><br>`;
                
            const seeMoreElement = document.createElement('a');
            seeMoreElement.href = `/html/institution.html?ID=${labID}`;
            seeMoreElement.innerHTML = 'Ver mais<br>';

            const img = document.createElement('p');
            img.innerHTML = `<img src="${resp[labID][0]}"><br>`;
            if (!resp[labID][0]) {
                img.innerHTML = `<img src="../assets/default_classroom.avif"><br>`;
            }

            const desc = document.createElement('p');
            desc.innerHTML = `<strong>${resp[labID][1]}</strong>`;

            laboratory.appendChild(labIDElement);
            laboratory.appendChild(img);
            laboratory.appendChild(seeMoreElement);
            laboratory.appendChild(desc);
            document.getElementById('labs').appendChild(laboratory);
        }
    }
})

})