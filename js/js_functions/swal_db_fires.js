import {writeReportsData} from './realtime_db.js';

export function createReportSwal (
    title
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