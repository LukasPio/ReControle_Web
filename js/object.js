import { readObjects } from "./js_functions/realtime_db.js";
import { searchFor } from "./js_functions/swal_db_fires.js";
import { loading } from "./js_functions/swal_mixins.js";


document.addEventListener('DOMContentLoaded', () => {

    loading.fire({timer: 1050});

    readObjects(null, 'content');
    
    const searchAcc = document.getElementById('search-acc');
    if (searchAcc) {
        searchAcc.addEventListener('input', (event) => {
            if (event.target.value){
                document.getElementById('objs').innerHTML = '';
                searchFor(event.target.value, 'obj')
            }
            else if (document.getElementById('objs').innerHTML == '' || !event.target.value) {
                readObjects(null, 'content')
            }
            else {
                console.log('aaaaaaaa')
            }
        })
    }
})