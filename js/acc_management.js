import { readUsers } from './js_functions/realtime_db.js';
import { searchFor, swalFireLookForUser } from './js_functions/swal_db_fires.js';
import { loading } from './js_functions/swal_mixins.js';

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