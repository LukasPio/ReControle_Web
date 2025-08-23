//import {writeReportsData, readReportsContentDate} from '../js/js_functions/realtime_db.js';
import {createReportSwal, searchFor} from '../js/js_functions/swal_db_fires.js';
import {readReports} from './js_functions/realtime_db.js';
import {loading} from './js_functions/swal_mixins.js';

var usualChoice;
  
document.addEventListener('DOMContentLoaded', () => {

    loading.fire();

    readReports(null, 'general');

    const searchAcc = document.getElementById('search-acc');
    if (searchAcc) {
        searchAcc.addEventListener('input', (event) => {
            if (event.target.value){
                document.getElementById('chamados').innerHTML = null;
                searchFor(event.target.value, 'report')
            }
            else
            if (document.getElementById('chamados').innerHTML == '' || !event.target.value) {
                readReports(null, 'general');
            }
        })
    }

    const writeReportBtn = document.getElementById('reportButton');
    if (writeReportBtn) {
        writeReportBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Insira um título',
                text: 'Digite o título da ocorrência para iniciar a ocorrência.',
                icon: 'info',
                input: 'select',
                inputAttributes: {
                    style: `
                        border-radius:15px;
                        border-color: #D3D3D3;
                        background-color: #f5f5f5;
                        transition: all 0.3s ease;
                    `
                },
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
                            inputAttributes: {
                                style: `
                                    border-radius:15px;
                                    border-color: #D3D3D3;
                                    background-color: #f5f5f5;
                                    transition: all 0.3s ease;
                                `
                            },
                            showConfirmButton: true,
                            confirmButtonText: 'Avançar',
                            showCancelButton: true,
                            cancelButtonText: 'Cancelar',
                            reverseButtons: true,
                            preConfirm: async () => {
                                usualChoice = Swal.getInput().value;
                                createReportSwal(usualChoice, localStorage.getItem('userUID'));
                            }
                        })
                    }
                    else
                    {
                        usualChoice = Swal.getInput().options[Swal.getInput().selectedIndex].text;
                        createReportSwal(usualChoice, localStorage.getItem('userUID'));
                    }
                }
            }) 
        })
    }
})

