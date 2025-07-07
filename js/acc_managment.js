import {readUsers} from './js_functions/realtime_db.js';

document.addEventListener('DOMContentLoaded', () => {
    Swal.fire({
        backdrop: ` rgba(0,20,100,0.2) `,
        text: 'Carregando',
        color: 'black',
        timer: 1000,
        didOpen: () => Swal.showLoading()
        
    });
    
    readUsers(null, 'acc-manage');

    const searchAcc = document.getElementById('search-acc');
    if (searchAcc) {
        searchAcc.addEventListener('input', (event) => {
            if (event.target.value){
                
            }
             
        })
    }

})