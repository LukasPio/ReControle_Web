import {readReports, countReportsByMonth, readUsers, readAll} from './js_functions/realtime_db.js';
import { swalFireLookForOcurrence } from './js_functions/swal_db_fires.js';
import { loading } from './js_functions/swal_mixins.js';

const ctx = document.getElementById("graficoLinha").getContext("2d");
countReportsByMonth().then(resp => {
    const webValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9','10', '11', '12'].map(mes => resp[0][mes] || 0);
    const inProgressValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9','10', '11', '12'].map(mes => resp[1][mes] || 0);
    const concludedValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9','10', '11', '12'].map(mes => resp[2][mes] || 0);
    new Chart(ctx, {
        type: "line",
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dez'],
            datasets: [{
                label: "Chamados criados",
                data: webValues,
                borderColor: "red",
                backgroundColor: "red",
                tension: 0.4,
                pointBackgroundColor: "red",
            },            
            {
                label: "Chamados em andamento",
                data: inProgressValues,
                borderColor: "yellow",
                backgroundColor: "yellow",
                tension: 0.4,
                pointBackgroundColor: "yellow", 
            } ,
            {
                label: "Chamados resolvidos",
                data: concludedValues,
                borderColor: "green",
                backgroundColor: "green",
                tension: 0.4,
                pointBackgroundColor: "green", 
            } 
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            },
        }
    });

    document.getElementById('by-year').textContent = `${resp[3]}`;
    document.getElementById('pending').textContent = `${resp[0][new Date().getMonth() + 1]}`;
    document.getElementById('in-progress').textContent = `${resp[1][new Date().getMonth() + 1]}`;
    document.getElementById('concluded').textContent = `${resp[2][new Date().getMonth() + 1]}`;


});

document.addEventListener("DOMContentLoaded", () => {
    loading.fire()

    readReports(null, 'general-home');

    const chamados = document.getElementById('chamados-home');
    if (chamados) {
        chamados.addEventListener('click', function (e) {
            if (e.target.className != 'chamados') {
                swalFireLookForOcurrence(e.target.closest('div').attributes.data_id.value)
            }
        })
    }

    const download = document.getElementById('info-download-btn');
    if (download) {
        download.addEventListener('click', () => {
            Swal.fire({
                toast: true,
                position: 'bottom-end',
                width: '35vw',
                title: 'Turn it UPPP',
                html: `
                    
                `,
                confirmButtonText: 'Baixar',
                confirmButtonColor: ''
            })
        })
    }

    const copy = document.getElementById('info-copy-btn');

});

