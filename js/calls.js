//import {writeReportsData, readReportsContentDate} from '../js/js_functions/realtime_db.js';
import {createReportSwal, searchFor} from '../js/js_functions/swal_db_fires.js';
import {readReports} from './js_functions/realtime_db.js';
import {loading} from './js_functions/swal_mixins.js';

var usualChoice;
  
document.addEventListener('DOMContentLoaded', () => {


    loading.fire();

    readReports(null, 'general');

    const writeReportBtn = document.getElementById('reportButton');
    if (writeReportBtn) {
        writeReportBtn.addEventListener('click', () => {
            readReports(null, 'data').then(resp => {
                const data = {},
                priorityData = {};
                for (const id in resp ) {
                    if (localStorage.getItem('call-type') != resp[id].content.title) {
                        data[resp[id].content.title] = resp[id].content.title;
                        priorityData[resp[id].content.title] = resp[id].content.priority;
                    }
                    localStorage.setItem('call-type', resp[id].content.title);
                }
                localStorage.removeItem('call-type');
                Swal.fire({
                    title: 'Insira um título',
                    text: 'Digite o título da ocorrência para instanciá-la.',
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
                        Opções: data,
                        'other-choice" id="other-choice"' : 'Outro problema'
                    },
                    preConfirm: async (choice) => {
                        if (choice == 'other-choice" id="other-choice"') {
                            createReportSwal('', localStorage.getItem('userUID'));
                        }
                        else
                        {
                            usualChoice = Swal.getInput().options[Swal.getInput().selectedIndex].text;
                            createReportSwal(usualChoice, localStorage.getItem('userUID'), priorityData[Swal.getInput().options[Swal.getInput().selectedIndex].value] || null);
                        }
                    }
                }) 
            })
        })            
    }
})