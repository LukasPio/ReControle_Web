import {readLaboratories} from './js_functions/realtime_db.js';
import { searchFor } from './js_functions/swal_db_fires.js';
import { loading } from './js_functions/swal_mixins.js';


document.addEventListener('DOMContentLoaded', () => {

    loading.fire({timer: 1850});

    readLaboratories(null, 'content');
})