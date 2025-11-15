import { readReports, readUsers } from "./js_functions/realtime_db.js";

readReports('data').then(reportRef => {
    document.getElementById('title').textContent = `${localStorage.getItem('sel-lab')} | ReControle`;
    document.getElementById('selected-lab').textContent = localStorage.getItem('sel-lab');
    var iRed = 0, iYellow = 0, iGreen = 0;
    const red = document.getElementById('red');
    red.innerHTML = "";
    const yellow = document.getElementById('yellow');
    yellow.innerHTML = "";
    const green = document.getElementById('green');
    green.innerHTML = "";
    for (const repID in reportRef) {
        if (reportRef[repID]?.selected_obj?.sel_lab_id == localStorage.getItem('sel-lab')) {
            const report = document.createElement("div");
            report.className = "chamado-card";
            report.setAttribute('data_id', repID);

            const statusAuthorDiv = document.createElement("div");
            statusAuthorDiv.style = "padding-top: 3px;";

            if (!reportRef[repID].content.deleted && !reportRef[repID].deleted) {
                switch (reportRef[repID].content.status) {
                    case "red":
                        if (iRed == 0 ) { 
                        red.innerHTML = `
                            <h2 class='h2-calls' style="width: 100%">Pendentes</h2>
                        `;
                        iRed++;
                        }
                    break;

                    case "yellow":
                        if (iYellow == 0 ) {
                            yellow.innerHTML = `
                                <h2 class='h2-calls' style="width: 100%">Em andamento</h2>
                            `;
                            iYellow++;
                        }
                    break;

                    case "green":
                        if (iGreen == 0 ) {
                            green.innerHTML = `
                                <h2 class='h2-calls' style="width: 100%">Concluídos</h2>
                            `;
                            iGreen++;
                        }
                    break;
                }
            }

            const userElement = document.createElement("p");
            userElement.className = 'autor';
            readUsers("user-name", reportRef[repID].content.autor).then(
                (resp) => (userElement.innerHTML = `<center>${resp}</center>` || '<center>Autor não disponível</center>')
            );

            const reportContents = {};
            reportContents[repID] = reportRef[repID].content?.title || reportRef[repID].content?.text || "Sem Título para exibir";
            const repIDElement = document.createElement("p");
            repIDElement.innerHTML = `<strong>${reportContents[repID]}</strong><br> `;

            if (!reportRef[repID]?.deleted && !report.content?.deletedBy == true) {
                if (!reportRef[repID]?.content?.deletedBy) {
                    report.appendChild(repIDElement);
                    report.appendChild(userElement);
                    report.appendChild(statusAuthorDiv);
                    if (reportRef[repID].content.status) {
                        if (reportRef[repID].content.status == 'red') red.appendChild(report);
                        if (reportRef[repID].content.status == 'yellow') green.appendChild(report);
                        if (reportRef[repID].content.status == 'green') yellow.appendChild(report);    
                    }
                }
            }
        }
    }
})