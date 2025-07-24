import {readReports, countReportsByMonth} from './js_functions/realtime_db.js';
import { loading } from './js_functions/swal_mixins.js';

 document.addEventListener("DOMContentLoaded", () => {
    loading.fire()

    readReports(null, 'general-home').then((respDatas) => {//Alterar
        const datas = {};
        for (const ID in respDatas) {
            datas[ID] = respDatas[ID].dates.posted_date
        }

        const recentes = Object.entries(datas)
        .map(([id, valor]) => {
            const partes = id.match(/(\d{4}-\d{2}-\d{2})-(\d{2}:\d{2})$/);
            if (!partes) return null;
            const [_, data, hora] = partes;
            const datetime = new Date(`${data}T${hora}`);
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




        /*const recentDatas = Object.entries(datas).sort((a, b) => new Date(b[1]) - new Date(a[1])).slice(0, 3);

        for (const i in recentDatas) {
           readReports(recentDatas[i][0], 'general').then(resp => {
                const report = document.createElement('div');
                report.className = 'chamado-card';
                report.id = recentDatas[i][0];
 
                const link = document.createElement('a');
                link.href = `/html/home.html?id=${recentDatas[i][0]}`;
                link.innerHTML = 'Ver mais';

                const repIDElement = document.createElement('p');
                repIDElement.innerHTML = `<strong>${recentDatas[i][0]}</strong><br> ${resp.content.title}`;

                const localAndData = document.createElement('p');
                localAndData.innerHTML = `${resp.dates.posted_date.posted_day} - ${resp.dates.posted_date.posted_time}`;

                report.appendChild(repIDElement);
                report.appendChild(link);
                report.appendChild(localAndData);
                document.getElementById('chamados').appendChild(report);
            })
        }*/

        
        /*const data = Object.entries(respDatas).slice(-3);
        if (data) {
            for (var i = 0; i < 3; i++) {
                const report = document.createElement('div');
                report.className = 'chamado-card';
                report.id = data[i][0];
 
                const link = document.createElement('a');
                link.href = `/html/home.html?id=${data[i][0]}`;
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
        }*/
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