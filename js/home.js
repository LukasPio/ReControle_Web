import {readReports, countReportsByMonth, readUsers, readAll, conutReportsByLab} from './js_functions/realtime_db.js';
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

    document.getElementById('by-year').textContent = `${resp[3]} chamados`;
    document.getElementById('pending').textContent = `${resp[0][new Date().getMonth() + 1]} chamados`;
    document.getElementById('in-progress').textContent = `${resp[1][new Date().getMonth() + 1]} chamados`;
    document.getElementById('concluded').textContent = `${resp[2][new Date().getMonth() + 1]} chamados`;
    conutReportsByLab().then(labs => {
        const data = {};
        for (const lab in labs) {
            data[lab] = labs[lab][new Date().getMonth() + 1];
        }
        const latest = Object.entries(data)
          .map(([id]) => {
            const repsByMonth = data[id];
            return { id, repsByMonth };
          })
          .sort((a, b) => b.repsByMonth - a.repsByMonth).slice(0, 1);
        document.getElementById('most').textContent = `${latest[0].id} (${latest[0].repsByMonth} chamados)`;
    })

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
                title: 'Baixar informações',
                html: `
                    <div class="swal2-html-container" id="extension-div">
                        <label for="sel-format" class="swal2-html-text">Selecione o tipo de arquivo</label>
                        <div class="checks-container"><br>
                            <span class="sel-btn excel" id="xls">XLS</span>
                            <span class="sel-btn excel" id="csv">CSV</span>
                            <span class="sel-btn img" id="png">PNG</span>
                            <canvas id="canvas" style="display:none;"></canvas>
                        <div><br>
                        <div class="swal2-html-container" id="add-infos-div">
                            <label class="checkbox-container" id="infos-option">
                                <input
                                    type="checkbox"
                                    name="checkbox"
                                    class="checkbox"
                                    id="checkbox"
                                />
                                <span class="checkmark"></span>
                                Adicionar dados de contagem
                            </label>
                        </div>
                        <div class="swal2-html-container" id="name-download-div">
                            <input type="text" class="swal2-input" id="name-download" placeholder="Nome do arquivo">
                        </div>
                    </div>
                `,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Baixar',
                confirmButtonColor: '#2f5cf3',
                preConfirm: async () => {
                    var xlsClass = `${document.getElementById('xls').className}`;
                    var csvClass = `${document.getElementById('csv').className}`;
                    var pngClass = `${document.getElementById('png').className}`;
                    var checkButton = null;
                    if (!pngClass.endsWith('choose')) checkButton = document.getElementById('checkbox').checked;
                    const canvas = document.getElementById('canvas');
                    const nameValue = document.getElementById('name-download').value;

                    countReportsByMonth().then(resp => {
                        
                        const pending = Object.values(resp[0]);
                        const inProgress = Object.values(resp[1]);
                        const concluded = Object.values(resp[2]);

                        pending.unshift("Pendente");
                        inProgress.unshift("In Progress");
                        concluded.unshift("Concluded");
                        
                        const dados = [
                            ['Status', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                            pending,
                            inProgress,
                            concluded,
                            ['Total', resp[3]]
                        ];
                        function download (dados) {
                            if (xlsClass.endsWith('choose')) {
                                function gerarXLSXml(rows) {
                                    const cel = v => `<Cell><Data ss:Type="String">${String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;')}</Data></Cell>`;
                                    const linhas = rows.map(r => `<Row>${r.map(cel).join('')}</Row>`).join('');
                                    const xml = `
                                        <?xml version="1.0"?>
                                        <?mso-application progid="Excel.Sheet"?>
                                        <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
                                                    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
                                            <Worksheet ss:Name="Planilha1">
                                            <Table>${linhas}</Table>
                                            </Worksheet>
                                        </Workbook>
                                    `;
                                    return xml.trim();
                                }

                                const xml = gerarXLSXml(dados);
                                const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${nameValue}.xls`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                    
                            } else if (csvClass.endsWith('choose')) {

                                function arrayToCSV(rows, spacer = ';') {
                                    return rows.map(row =>
                                        row.map(cell => {
                                        const s = String(cell ?? '');
                                        if (s.includes('"') || s.includes(spacer) || s.includes('\n')) {
                                            return '"' + s.replace(/"/g, '""') + '"';
                                        }
                                        return s;
                                        }).join(spacer)
                                    ).join('\r\n');
                                }

                                const BOM = '\uFEFF';
                                const headerSep = 'sep=;\r\n';
                                const csv = BOM + headerSep + arrayToCSV(dados, ';');
                                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${nameValue}.csv`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);


                                    

                            } else if (pngClass.endsWith('choose')) {
                                const cellPaddingX = 10;
                                const cellPaddingY = 8;
                                const headerBg = '#1976d2';
                                const headerColor = '#fff';
                                const rowBg1 = '#ffffff';
                                const rowBg2 = '#fafafa';
                                const borderColor = '#ddd';
                                const fontSpec = '16px Arial';
                                const padding = 12;

                                function calculateWidth(ctx, rows) {
                                    const cols = rows[0].length;
                                    const widths = new Array(cols).fill(0);
                                    for (let r = 0; r < rows.length; r++) {
                                        for (let c = 0; c < cols; c++) {
                                        const text = String(rows[r][c] ?? '');
                                        const w = ctx.measureText(text).width + cellPaddingX * 2;
                                        if (w > widths[c]) widths[c] = w;
                                        }
                                    }
                                    return widths;
                                }

                                function drawCanvasTable(rows) {
                                    const dpr = window.devicePixelRatio || 1;
                                    const sample = document.createElement('canvas');
                                    const sctx = sample.getContext('2d');
                                    sctx.font = fontSpec;
                                    const colWidths = calculateWidth(sctx, rows);
                                    const cols = colWidths.length;
                                    const rowHeight = parseInt(fontSpec, 10) + cellPaddingY * 2;
                                    const width = colWidths.reduce((a,b) => a + b, 0) + padding * 2;
                                    const height = rows.length * rowHeight + padding * 2;

                                    canvas.width = Math.round(width * dpr);
                                    canvas.height = Math.round(height * dpr);
                                    canvas.style.width = width + 'px';
                                    canvas.style.height = height + 'px';

                                    const ctx = canvas.getContext('2d');
                                    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                                    ctx.font = fontSpec;
                                    ctx.textBaseline = 'middle';

                                    ctx.fillStyle = '#fff';
                                    ctx.fillRect(0, 0, width, height);

                                    const xStart = padding;
                                    const yStart = padding;
                                    for (let r = 0; r < rows.length; r++) {
                                        const y = yStart + r * rowHeight;
                                        ctx.fillStyle = (r === 0) ? headerBg : ((r % 2 === 0) ? rowBg1 : rowBg2);
                                        ctx.fillRect(xStart, y, colWidths.reduce((a,b) => a + b, 0), rowHeight);

                                        let x = xStart;
                                        for (let c = 0; c < cols; c++) {
                                        ctx.strokeStyle = borderColor;
                                        ctx.lineWidth = 1;
                                        ctx.strokeRect(x, y, colWidths[c], rowHeight);

                                        const text = String(rows[r][c] ?? '');
                                        ctx.fillStyle = (r === 0) ? headerColor : '#000';
                                        ctx.fillText(text, x + cellPaddingX, y + rowHeight / 2);

                                        x += colWidths[c];
                                        }
                                    }
                                    return canvas;
                                }

                                function downloadCanvasWithPNG(canvas, filename = 'tabela.png') {
                                    if (canvas.toBlob) {
                                        canvas.toBlob(function(blob) {
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = filename;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                        }, 'image/png');
                                    } else {
                                        const dataUrl = canvas.toDataURL('image/png');
                                        const a = document.createElement('a');
                                        a.href = dataUrl;
                                        a.download = filename;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                    }
                                }

                                const canva = drawCanvasTable(dados);
                                downloadCanvasWithPNG(canva, `${nameValue}.png`);
                            }
                        }
                    

                        conutReportsByLab().then(labs => {
                            if (checkButton) {
                                dados[5] = ['', '', '', '', '', '', '', '', '', '', '', ''];
                                var i = 6;
                                for (const id in labs) {
                                    const labReps = Object.values(labs[id]);
                                    labReps.unshift(id)
                                    dados[i] = labReps
                                    i++;
                                }
                            }

                            download(dados)
                        })

                        

                   })
                }
            });

            const xls = document.getElementById('xls');
            const csv = document.getElementById('csv');
            const png = document.getElementById('png');

            const infosDiv = document.getElementById('infos-option');
            //document.getElementById('infos-option');
            const infosLabel = `
                <input
                    type="checkbox"
                    name="checkbox"
                    class="checkbox"
                    id="checkbox"
                />
                <span class="checkmark"></span>
                Adicionar dados de contagem
            `;

            if (xls) {
                xls.addEventListener('click',  (e) => {
                    infosDiv.innerHTML = infosLabel;
                    const classX = `${e.target.className}`;
                    if (classX.endsWith('choose')) {
                        xls.className = 'sel-btn excel';
                        return;
                    }
                    xls.className = 'sel-btn excel choose';
                    csv.className = 'sel-btn excel';
                    png.className = 'sel-btn img';
                })
            }

            if (csv) {
                csv.addEventListener('click',  (e) => {
                    infosDiv.innerHTML = infosLabel;
                    const classC = `${e.target.className}`;
                    if (classC.endsWith('choose')) {
                        csv.className = 'sel-btn excel';
                        return;
                    }
                    csv.className = 'sel-btn excel choose';
                    xls.className = 'sel-btn excel';
                    png.className = 'sel-btn img';
                })
            }

            if (png) {
                png.addEventListener('click',  (e) => {
                    infosDiv.innerHTML = '<p style="margin: 9px;"></p>';
                    const classP = `${e.target.className}`;
                    if (classP.endsWith('choose')) {
                        png.className = 'sel-btn img';
                        infosDiv.innerHTML = infosLabel;
                        return;
                    }
                    png.className = 'sel-btn img choose';
                    csv.className = 'sel-btn excel';
                    xls.className = 'sel-btn excel';
                })
            }
        })
    }
});

