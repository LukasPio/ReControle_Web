//import {writeReportsData, readReportsContentDate} from '../js/js_functions/realtime_db.js';
import {createReportSwal} from '../js/js_functions/swal_db_fires.js';
import {readReports} from './js_functions/realtime_db.js';
var usualChoice;


  
document.addEventListener('DOMContentLoaded', () => {

    Swal.fire({
        backdrop: ` rgba(0,20,100,0.2) `,
        text: 'Carregando',
        color: 'black',
        timer: 1000,
        didOpen: () => Swal.showLoading()
        
    })

    readReports(null, 'general').then(respDatas => {
        const data = Object.entries(respDatas);
        if (data) {
            for(const ID in data) {
                 const report = document.createElement('div');
                report.className = 'chamado-card';
                report.id = data[ID][0];
 
                const link = document.createElement('a');
                link.href = `/html/calls.html?id=${data[ID][0]}`;
                link.innerHTML = 'Ver mais';

                const repIDElement = document.createElement('p');
                repIDElement.innerHTML = `<strong>${data[ID][0]}</strong><br> ${data[ID][1]}`;

                const localAndData = document.createElement('p');
                localAndData.innerHTML = `${data[ID][0].slice(0, -17)} - ${data[ID][0].slice(-16, -6)}`;

                report.appendChild(repIDElement);
                report.appendChild(link);
                report.appendChild(localAndData);
                document.getElementById('chamados').appendChild(report);
            }
        }
        else
        {
            if (document.getElementById('chamados')) {
                document.getElementById('chamados').innerHTML = `
                <div class='chamado-card' id='no-problem-div'>
                    <b>
                        Sem chamados para exibir
                    </b>
                    <img src='../assets/no_problem.png'>
                </div>
                `
            }
        }
    });

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

