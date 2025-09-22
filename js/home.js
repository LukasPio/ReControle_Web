import {readReports, countReportsByMonth, readUsers, readAll} from './js_functions/realtime_db.js';
import { swalFireLookForOcurrence } from './js_functions/swal_db_fires.js';
import { loading } from './js_functions/swal_mixins.js';

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

});

const ctx = document.getElementById("graficoLinha").getContext("2d");
countReportsByMonth().then(resp => {
    const webValues = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10', '11', '12'].map(mes => resp[0][mes] || 0);
    const mobileValues = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10', '11', '12'].map(mes => resp[1][mes] || 0);
    const inProgressValues = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10', '11', '12'].map(mes => resp[2][mes] || 0);
    const concludedValues = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10', '11', '12'].map(mes => resp[3][mes] || 0);
    new Chart(ctx, {
        type: "line",
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dez'],
            datasets: [{
                label: "Chamados criados pelo desktop",
                data: webValues,
                borderColor: "red",
                tension: 0.4,
                pointBackgroundColor: "red",
            },
            {
                label: "Chamados criados pelo aplicativo",
                data: mobileValues,
                borderColor: "orange",
                tension: 0.4,
                pointBackgroundColor: "orange", 
            },                
            {
                label: "Chamados em andamento",
                data: inProgressValues,
                borderColor: "yellow",
                tension: 0.4,
                pointBackgroundColor: "yellow", 
            } ,
            {
                label: "Chamados resolvidos",
                data: concludedValues,
                borderColor: "green",
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
});