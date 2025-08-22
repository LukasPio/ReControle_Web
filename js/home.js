import {readReports, countReportsByMonth, readUsers} from './js_functions/realtime_db.js';
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
            const resp = respDatas[item.id];
            var reportContents = '';
            const report = document.createElement('div');
            report.className = 'chamado-card';
            report.id = item.id;
                  
            const link = document.createElement('a');
            link.id = item.id;
            link.innerHTML = `Ver mais`;
            link.style = 'cursor: pointer;';
                
            const imageDiv = document.createElement('div');
            const center = document.createElement('center');
            const imageElement = document.createElement('img');
            imageElement.className = 'image-report';
                
            const statusAuthorDiv = document.createElement('div');
            statusAuthorDiv.style = 'padding-top: 3px;';
            const statusElement = document.createElement('p');
                            
            switch (resp.content.status) {
                case 'red': 
                    statusElement.innerHTML = 'Pendente';
                    statusElement.style = 'border-color: red; border: 2px solid red; border-radius: 15px;';
                break;
            
                case 'yellow': 
                    statusElement.innerHTML = 'Em andamento';
                    statusElement.style = 'border-color: yellow; border: 2px solid yellow; border-radius: 15px;';
                break;
            
                case 'green': 
                    statusElement.innerHTML = 'Concluído';
                    statusElement.style = 'border-color: green; border: 2px solid green; border-radius: 15px;';
                break;
            }
                            
            const userElement = document.createElement('p');
            userElement.style = 'background-color: #D3D3D3; border-radius: 15px;';
            readUsers(resp.content.autor, 'user-name').then(respT => userElement.textContent = respT );
                
            if (resp.content.img_url != undefined) {
                imageElement.src = resp.content.img_url === '' ? '../../assets/default_occur.jpg' : resp.content.img_url;
                var image = `${resp.content.img_url}`;
                if (!image.startsWith('data:image/png;base64,') ) {
                    imageElement.src = resp.content.img_url === '' ? '../../assets/default_occur.jpg' : 'data:image/png;base64, ' + image;
                }
            }
                            
            if (resp.dates) {
                if (resp.content?.title) {
                    reportContents = resp.content?.title
                }
                else
                {
                    reportContents = 'Sem Título para exibir'
                }
            
                const repIDElement = document.createElement('p');
                repIDElement.innerHTML = `<strong>${item.id}</strong><br> ${reportContents}`;                
                    
                const localAndData = document.createElement('p');
                localAndData.innerHTML = `
                    ${resp.selected_obj?.sel_lab_id}
                    <p style="
                        height: 2px;
                        background: linear-gradient(to right, #ccc);
                        margin: 15px 0;
                    "></p>
                `; //  - ${reportRef[repID]?.dates?.posted_date?.posted_day}
                              
                report.appendChild(repIDElement);
                report.appendChild(link);
                report.appendChild(localAndData);
                imageDiv.appendChild(imageElement);
                center.appendChild(imageDiv);
                center.appendChild(statusElement);
                center.appendChild(userElement);
                statusAuthorDiv.appendChild(center);
                report.appendChild(statusAuthorDiv);
                document.getElementById('chamados').appendChild(report);                
                          
            }
            else
            {
                if (resp.content?.text) {
                    reportContents = resp.content?.text
                }
                else
                {
                    reportContents = 'Sem Título para exibir'
                }
                
                const repIDElement = document.createElement('p');
                repIDElement.innerHTML = `<strong>${repID}</strong><br> ${reportContents}`;
            
                const localAndData = document.createElement('p');
                if (resp.content?.local)
                    localAndData.innerHTML = `
                        ${resp.content?.local}
                        <p style="
                            height: 2px;
                            background: #ccc;
                            margin: 15px 0;
                        "></p>
                    `,
                    report.appendChild(repIDElement),
                    report.appendChild(link),
                    report.appendChild(localAndData),
                    imageDiv.appendChild(imageElement),
                    center.appendChild(imageDiv),
                    center.appendChild(statusElement),
                    center.appendChild(userElement),
                    statusAuthorDiv.appendChild(center),
                    report.appendChild(statusAuthorDiv),
                    document.getElementById('chamados').appendChild(report);
            }
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