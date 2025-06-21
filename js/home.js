 import {readReportsContentDate, countReportsByMonth} from './js_functions/realtime_db.js';
 
 document.addEventListener("DOMContentLoaded", () => {

    const ctx = document.getElementById("graficoLinha").getContext("2d");



    countReportsByMonth().then(resp => {

        const values = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10', '11', '12'].map(mes => resp[mes] || 0);


        console.log(values);

        new Chart(ctx, {
            type: "line",
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dez'],
                datasets: [{
                    label: "Chamados criados",
                    data: values,
                    borderColor: "red",
                    tension: 0.4,
                    pointBackgroundColor: "red",
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

    readReportsContentDate('Lab12-2025-06-21-12:07').then(responseContent => {
        console.log(responseContent.slice(5,7));
    })

});