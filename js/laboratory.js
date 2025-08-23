import {readLaboratories} from './js_functions/realtime_db.js';
import { searchFor } from './js_functions/swal_db_fires.js';
import { loading } from './js_functions/swal_mixins.js';


document.addEventListener('DOMContentLoaded', () => {

    loading.fire({timer: 1850});

    readLaboratories(null, 'content');

    const searchAcc = document.getElementById('search-acc');
    if (searchAcc) {
        searchAcc.addEventListener('input', (event) => {
            if (event.target.value){
                document.getElementById('labs').innerHTML = null;
                readLaboratories(null, 'search-for', event.target.value)
                searchFor(event.target.value, 'lab')
            }
            else
            if (document.getElementById('labs').innerHTML == '' || !event.target.value) {
                readLaboratories(null, 'content');
            }
        })
    }
})