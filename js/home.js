import {readReports, countReportsByMonth} from './js_functions/realtime_db.js';
import { loading } from './js_functions/swal_mixins.js';

 document.addEventListener("DOMContentLoaded", () => {
    loading.fire()

    readReports(null, 'general-home').then((respDatas) => {//alterar o const recentes
        const datas = {};
        const horas = {};

        for (const ID in respDatas) {
            datas[ID] = respDatas[ID].dates.posted_date.posted_day;
            horas[ID] = respDatas[ID].dates.posted_date.posted_time;
        }

        const recentes = Object.entries(datas)
        .map(([id, valor]) => {
            const datetime = new Date(`${datas[id]}T${horas[id]}`);
            return { id, ...valor, datetime };
        }).filter(item => item && item.datetime instanceof Date && !isNaN(item.datetime)).sort((a, b) => b.datetime - a.datetime).slice(0, 3);

        recentes.forEach((item) => {
            readReports(item.id, 'general').then(resp => {
                const report = document.createElement('div');
                report.className = 'chamado-card';
                report.id = item.id;
 
                const link = document.createElement('a');
                link.href = `/html/home.html?id=${item.id}`;
                link.innerHTML = 'Ver mais';

                const repIDElement = document.createElement('p');
                repIDElement.innerHTML = `<strong>${item.id}</strong><br> ${resp.content.title}`;

                const localAndData = document.createElement('p');
                localAndData.innerHTML = `${resp.dates.posted_date.posted_day} - ${resp.dates.posted_date.posted_time}`;

                report.appendChild(repIDElement);
                report.appendChild(link);
                report.appendChild(localAndData);
                document.getElementById('chamados').appendChild(report);
            })
        });

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
});