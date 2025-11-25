//import {writeReportsData, readReportsContentDate} from '../js/js_functions/realtime_db.js';
import {createReportSwal, searchFor} from '../js/js_functions/swal_db_fires.js';
import {readReports} from './js_functions/realtime_db.js';
import {loading} from './js_functions/swal_mixins.js';

var usualChoice;
  
document.addEventListener('DOMContentLoaded', () => {


    loading.fire();

    readReports('general');

    const writeReportBtn = document.getElementById('reportButton');
    if (writeReportBtn) {
        writeReportBtn.addEventListener('click', () => {
            readReports('data').then(resp => {
                const data = {},
                priorityData = {};
                for (const id in resp ) {
                    if (localStorage.getItem('call-type') != resp[id]?.content?.title && localStorage.getItem('call-type') != resp[id]?.content?.text) {
                        data[resp[id].content.title] = resp[id].content?.title? resp[id].content?.title : resp[id].content.text;
                        priorityData[resp[id].content?.title? resp[id].content?.title : resp[id].content.text] = resp[id].content.priority;
                    }
                    localStorage.setItem('call-type', resp[id].content?.title? resp[id].content?.title : resp[id].content.text);
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

    const redButton = document.getElementById('red-btn');
    if (redButton) {
        console.log('a')
        redButton.addEventListener('click', () => {
            localStorage.setItem('status-calls', 'red');
            console.log(localStorage.getItem('status-calls'))
            //window.location.href = './status.calls.html';
        })
    }

    const yellowButton = document.getElementById('yellow-btn');
    if (yellowButton) {
        yellowButton.addEventListener('click', () => {
            localStorage.setItem('status-calls', 'yellow');
            console.log(localStorage.getItem('status-calls'))
            //window.location.href = './status.calls.html';
        })
    }

    const greenButton = document.getElementById('green-btn');
    if (greenButton) {
        console.log('a')
        greenButton.addEventListener('click', () => {
            localStorage.setItem('status-calls', 'green');
            console.log(localStorage.getItem('status-calls'))
            //window.location.href = './status.calls.html';
        })
    }

})