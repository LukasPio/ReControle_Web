import {readReports, countReportsByMonth, readUsers} from './js_functions/realtime_db.js';
import { loading } from './js_functions/swal_mixins.js';

document.addEventListener("DOMContentLoaded", () => {
    loading.fire()

    readReports(null, 'general-home');

});

const ctx = document.getElementById("graficoLinha").getContext("2d");
countReportsByMonth().then(resp => {
    const values = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10', '11', '12'].map(mes => resp[mes] || 0);
    new Chart(ctx, {
        type: "line",
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dez'],
            datasets: [{
                label: "Chamados criados pelo desktop",
                data: values,
                borderColor: "red",
                tension: 0.4,
                pointBackgroundColor: "red",
            },
            {
                label: "Chamados criados pelo aplicativo",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: "orange",
                tension: 0.4,
                pointBackgroundColor: "orange", 
            },                
            {
                label: "Chamados em andamento",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: "yellow",
                tension: 0.4,
                pointBackgroundColor: "yellow", 
            } ,
            {
                label: "Chamados resolvidos",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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