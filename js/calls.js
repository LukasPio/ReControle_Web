//import {writeReportsData, readReportsContentDate} from '../js/js_functions/realtime_db.js';
import {createReportSwal} from '../js/js_functions/swal_db_fires.js';
var usualChoice;


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
                    'fails-choice" id="fails-choice"': 'Exemplos de falhas...',
                    'other-choice" id="other-choice"' : 'Outro problema'
                },
                preConfirm: async (choice) => {
                    if (choice == 'other-choice" id="other-choice"') {
                        Swal.fire({
                            title: 'Digite o outro problema',
                            text: 'Digite um título breve.',
                            icon: 'info',
                            input : 'text',
                            showConfirmButton: true,
                            confirmButtonText: 'Avançar',
                            showCancelButton: true,
                            cancelButtonText: 'Cancelar',
                            reverseButtons: true
                            //antes do function createReportSwal
                        }).then((result) => {
                            if (result.isConfirmed) {
                                usualChoice = Swal.getInput().value;
                                createReportSwal(usualChoice);
                            }
                        })
                    }
                    else
                    {
                        usualChoice = Swal.getInput().options[Swal.getInput().selectedIndex].text;
                        createReportSwal(usualChoice);
                    }
                }
            }) 
        })
    }
})

