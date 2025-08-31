import {readUsers} from './js_functions/realtime_db.js';
import { searchFor, swalFireLookForUser } from './js_functions/swal_db_fires.js';
import { loading } from './js_functions/swal_mixins.js';

document.addEventListener('DOMContentLoaded', () => {
    loading.fire();
    
    readUsers(null, 'acc-manage');
        
    const container = document.getElementById('users-account-list');
    container.addEventListener('click', function (e) {
        const target = e.target;
        if (target.tagName !== 'LI') return;
        swalFireLookForUser(target.id);

    })
})