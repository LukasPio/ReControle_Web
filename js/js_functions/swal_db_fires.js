import {writeReportsData, readReports, readObjectClassAndType} from './realtime_db.js';

export async function createReportSwal (
    title,
    author
) {

    var newMainProblem;
    var newMainTitle;
    var newSelectedObject;
    var occuredDate;
    var occuredTime;
    var mainProblem;
    var selectedObject;
    var selectedLab;

    switch (title) {
        case 'Exemplos de falhas...': 
            selectedObject = 'Este objeto aqui';
            mainProblem = 'Este problema aqui';
        ;
        break;
        default: 
            mainProblem = title;
        ;
    }
    Swal.fire({
        title: 'Só mais uns passos...',
        width: '75vw',
        html: `
            <div class="swal2-html-container">
                <label for="main-title" class="swal2-html-text">Título</label>
                <input type="text" class="swal2-input" style="display:flex;width:60vw;" id="main-title" value="${title}" required> 
            </div>
            <div class="swal2-html-container">
                <label for="main-problem" class="swal2-html-text">Problema</label>
                <input type="text" class="swal2-input" style="display:flex;width:60vw;" id="main-problem" value="${mainProblem}"> 
            </div>
            <!--<div class="swal2-html-container">
                <label for="selected-file" class="swal2-html-text">Foto do ocorrido</label>
                <input type="file" class="swal2-input" style="display:flex;width:60vw;" id="selected-file">
            </div>-->
            <div class="swal2-html-container">
                <label for="selected-file" class="swal2-html-text">laboratório</label>
                <input type="text" class="swal2-input" style="display:flex;width:60vw;" id="selected-lab">
            </div>
            <div class="swal2-html-container">
                <label for="selected-obj" class="swal2-html-text">Objeto selectionado</label>
                <input type="text" class="swal2-input" style="display:flex;width:60vw;" id="selected-obj" value="${selectedObject}" required> 
            </div>
            <div class="swal2-html-container">
                <label for="selected-obj" class="swal2-html-text">Dia da validação da ocorrência</label>
                <input type="date" class="swal2-input" style="display:flex;width:30vw;" id="occur-date" value="${new Date().toISOString().split('T')[0]}"> 
                <input type="time" class="swal2-input" style="display:flex;width:30vw;" id="occur-time" value="${new Date().toTimeString().slice(0, 5)}">
            </div>
        `,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        showConfirmButton: true,
        confirmButtonText: 'Enviar ocorrência',
        confirmButtonColor: '#2f5cf3',
        preConfirm: async () => {
            newMainTitle = document.getElementById('main-title').value;
            newMainProblem = document.getElementById('main-problem').value;
            newSelectedObject = document.getElementById('selected-obj').value;
            occuredDate = document.getElementById('occur-date').value;
            occuredTime = document.getElementById('occur-time').value;
            selectedLab = document.getElementById('selected-lab').value;
            
            try {
                writeReportsData(
                    "",
                    newMainProblem,
                    newMainTitle,
                    'red',
                    author,
                    occuredDate,
                    occuredTime,
                    "",
                    "",
                    `${selectedLab}-${occuredDate}-${occuredTime}`,
                    selectedLab,
                    newSelectedObject
                );
                Swal.fire({
                    title: 'Ocorrência registrada!',
                    icon: 'success'
                }).then((result) => {
                    window.location.reload();
                })
            }
            catch {
                Swal.fire({
                    title: 'Falha ao registrar!',
                    icon: 'error'
                })
            }
        }
    })
}

export async function swalFireLookForOcurrence (
    reportID
) {
    readReports(reportID, 'text-content').then(response => {
        const data = Object.entries(response);
        var imageURL = data[1][1];
        if (!imageURL) {
            imageURL = '../../assets/default_occur.jpg'
        }
        readReports(reportID, 'selected-object').then((resp) => {
            readObjectClassAndType(resp).then(array => {
                Swal.fire({
                    title: `${data[4][1]}`,
                    width: '75vw',
                    imageUrl: `${imageURL}`,
                    imageWidth: '40vw',
                    imageHeight: '70vh',
                    html: `
                        <div class='swal2-html-container' id='swal2-html-container'>
                            <label for='object-description' style='font-weight:bold;'> Descrição </label>
                            <center>
                                <p id='object-description' style='border:1px solid black;border-radius:15px;width:35vw;'>
                                    ${data[3][1]}
                                </p>
                            </center>
                        </div>
                        <div class='swal2-html-container' id='swal2-html-container'>
                            <label for='object-class' style='font-weight:bold;'> Classe do objeto </label>
                            <center>
                                <p id='object-class' style='border:1px solid black;border-radius:15px;width:35vw;'>
                                    ${array[0]}
                                </p>
                            </center>
                        </div>
                        <div class='swal2-html-container' id='swal2-html-container'>
                            <label for='object-type' style='font-weight:bold;'> Tipo do objeto </label>
                            <center>
                                <p id='object-type' style='border:1px solid black;border-radius:15px;width:35vw;'>
                                    ${array[1]}
                                </p>
                            </center>
                        </div>
                        <div class='swal2-html-container' id='swal2-html-container'>
                            <label for='selected-local' style='font-weight:bold;'> Sala selecionada </label>
                            <center>
                                <p id='selected-local' style='border:1px solid black;border-radius:15px;width:35vw;'>
                                    ${reportID.slice(0, -17)}
                                </p>
                            </center>
                        </div>
                        <div class='swal2-html-container' id='swal2-html-container'>
                            <label for='date-time' style='font-weight:bold;'> Data e Hora </label>
                            <center>
                                <p id='date-time' style='border:1px solid black;border-radius:15px;width:35vw;'>
                                    Dia ${reportID.slice(-8, -6)} do mês ${reportID.slice(-11, -9)} de ${reportID.slice(-16, -12)} , às ${reportID.slice(-5, -3)} horas e ${reportID.slice(-2)} minutos
                                </p>
                            </center>
                        </div>
                    `
                }).then(() => {
                    window.location.href = window.location.href.split('?')[0]
                }); 
            });
        })
    })
    
}