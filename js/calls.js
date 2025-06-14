import {writeLaboratoryData} from '../js/js_functions/realtime_db.js';


document.addEventListener('DOMContentLoaded', () => {
    const k = document.getElementById('1');
    if (k) {
        k.addEventListener('click', () => {
            writeLaboratoryData(4, 1,1,1)
        })
    }
})