 import {readAllReports, countReportsByMonth} from './js_functions/realtime_db.js';

 document.addEventListener("DOMContentLoaded", () => {
    readAllReports().then((respDatas) => {
        const data = Object.entries(respDatas).slice(-3);
        if (data) {
            for (var i = 0; i < 3; i++) {
                const report = document.createElement('div');
                report.className = 'chamado-card';
                report.id = data[i][0];

                const link = document.createElement('a');
                link.href = '/html/calls.html';
                link.innerHTML = 'Ver mais';

                const repIDElement = document.createElement('p');
                repIDElement.innerHTML = `<strong>${data[i][0]}</strong><br> ${data[i][1]}`;

                const localAndData = document.createElement('p');
                localAndData.innerHTML = `${data[i][0].slice(0, -17)} - ${data[i][0].slice(-16, -6)}`;

                report.appendChild(repIDElement);
                report.appendChild(link);
                report.appendChild(localAndData);
                document.getElementById('chamados').appendChild(report);
            }
        }
        else
        {
            document.getElementById('chamados').innerHTML = `
                Sem dados para exibir.
            `
        }
    });

    const ctx = document.getElementById("graficoLinha").getContext("2d");
    countReportsByMonth().then(resp => {


        const values = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10', '11', '12'].map(mes => resp[mes] || 0);
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
});