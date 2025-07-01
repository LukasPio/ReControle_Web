import {readAllUsers, readUserRank, readUser} from './js_functions/realtime_db.js';

document.addEventListener('DOMContentLoaded', () => {
    Swal.fire({
        backdrop: ` rgba(0,20,100,0.2) `,
        text: 'Carregando',
        color: 'black',
        timer: 1000,
        didOpen: () => Swal.showLoading()
        
    })
    
    readAllUsers();
})