import {readAllUsers, readUserRank, readUser} from './js_functions/realtime_db.js';

document.addEventListener('DOMContentLoaded', () => {
    readAllUsers();
})