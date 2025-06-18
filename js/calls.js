//import {writeReportsData, readReportsContentDate} from '../js/js_functions/realtime_db.js';



document.addEventListener('DOMContentLoaded', () => {

    const writeReportBtn = document.getElementById('reportButton');
    if (writeReportBtn) {
        writeReportBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Insira um título',
                text: 'Digite o título da ocorrência para iniciar a ocorrência.',
                icon: 'info',
                input: 'select',
                inputOptions: {
                    '"': 'aaaaaa',
                    'other-choice" id="other-choice"' : 'Outro problema'
                    
                }
            }) 
        })
    }
})

