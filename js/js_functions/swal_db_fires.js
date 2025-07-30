import {
    writeReportsData,
    writeLaboratoryData,
    readReports,
    readLaboratories,
    readObjects,
    readUsers,
    updateReportData

} from './realtime_db.js';
import {reControleSwal, successToastSwal, errorToastSwal} from './swal_mixins.js';

export async function createReportSwal (
    title,
    author
) {

    var newMainProblem, 
    newMainTitle, 
    newSelectedObject, 
    occuredDate, 
    occuredTime, 
    mainProblem, 
    file,
    selectData;

    switch (title) {
        case 'Exemplos de falhas...': 
            mainProblem = 'Este problema aqui';
        ;
        break;
        default: 
            mainProblem = title;
        ;
    }

    readObjects(null, 'general').then(resp => {
        selectData = '<option value="none"></option>';
        for (const ID in resp) {
            selectData += `<option value="${ID}"> ${ID} </option>`
        }

        reControleSwal.fire({
            title: 'Só mais uns passos...',
            html: `
                <div class="swal2-html-container">
                    <label for="main-title" class="swal2-html-text">Título do ocorrido</label>
                    <input 
                        type="text" 
                        class="swal2-input" 
                        id="main-title" 
                        style="
                            width: 55vw;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        "
                        value="${title}" 
                    required> 
                </div>
                <div class="swal2-html-container">
                    <label for="main-problem" class="swal2-html-text">Problema a relatar</label>
                    <input 
                        type="text" 
                        class="swal2-input" 
                        id="main-problem"
                        style="
                            width: 55vw;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        "  
                        value="${mainProblem}"
                    > 
                </div>
                <div class="swal2-html-container">
                    <label for="selected-file" class="swal2-html-text">Foto do ocorrido</label>
                    <input 
                        type="file" 
                        class="swal2-input" 
                        id="selected-file"
                        style="    
                            width: 55vw;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;" 
                        >
                </div>
                <div class="swal2-html-container">
                    <label for="selected-obj" class="swal2-html-text">Objeto selectionado</label>
                    <select 
                        class="swal2-input"
                        id="selected-obj" 
                        style="
                            width: 55vw;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        " 
                    >
                        ${selectData}
                    </select>
                </div>
                <div class="swal2-html-container" >
                    <label for="selected-obj" class="swal2-html-text">Dia da validação da ocorrência</label><br>
                    <input 
                        type="date" 
                        class="swal2-input" 
                        id="occur-date"
                        style="     
                            width: 25vw;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        "  
                        value="${new Date().toISOString().split('T')[0]}"
                    > 
                    <input 
                        type="time" 
                        class="swal2-input" 
                        id="occur-time"
                        style="
                            width: 25vw;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        "  
                        value="${new Date().toTimeString().slice(0, 5)}"
                    >
                </div>
            `,
            confirmButtonText: 'Enviar ocorrência',
            confirmButtonColor: '#2f5cf3',
            preConfirm: async () => {
                newMainTitle = document.getElementById('main-title').value;
                newMainProblem = document.getElementById('main-problem').value;
                newSelectedObject = document.getElementById('selected-obj').value;
                occuredDate = document.getElementById('occur-date').value;
                occuredTime = document.getElementById('occur-time').value;
                if (localStorage.getItem('sel-file') != '' && localStorage.getItem('sel-file') != null) {
                    file = localStorage.getItem('sel-file')
                }
                else {
                    file = ''
                }

                readObjects(newSelectedObject, 'lab-id').then(resp => {
                    try {
                        writeReportsData(
                            file,
                            newMainProblem,
                            newMainTitle,
                            'red',
                            author,
                            occuredDate,
                            occuredTime,
                            "",
                            "",
                            `${resp}-${occuredDate}-${occuredTime}`,
                            resp,
                            newSelectedObject
                        );
                        successToastSwal.fire().then( localStorage.removeItem('sel-file') )
                    }
                    catch {
                        errorToastSwal.fire()
                    }
                    })                
            }
        })
    })
    const selectedFile = document.getElementById('selected-file');
    if (selectedFile) { 
        selectedFile.addEventListener('change', (event) => {
            convertImg(event.target.files[0], function(base64Result) {
                localStorage.setItem('sel-file', base64Result);
            })
        }) 
    }
}

export async function updateReportSwal (
    reportID,
    author
) {
    var file;
    readReports(reportID, 'text-content').then(resp => {
        reControleSwal.fire({
            title: 'Editar ocorrência',
            html: `
                <div class="swal2-html-container">
                    <label for="main-p" class="swal2=html-text">Título</label><br>
                    <input 
                        type="text" 
                        class="swal2-input"
                        style=" 
                            width: 55vw;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        "
                        id="main-p" 
                        value="${resp.title}"
                    >
                </div>
                <div class="swal2-html-container">
                    <label for="main-t" class="swal2=html-text">Descrição</label><br>
                    <input 
                        type="text"
                        class="swal2-input"
                        style="
                            width: 55vw;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        "
                        id="main-t"
                        value="${resp.text}"
                    >
                </div>
                <div class="swal2-html-container">
                    <label for="file-url" class="swal2=html-text">Imagem</label><br>
                    <input 
                        type="file"
                        accept=".jpg,.png,image/*" 
                        class="swal2-input"
                        style="
                            width: 55vw;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        "
                        id="file-url" 
                        value="${resp.img_url}"
                    >
                </div>
                <div class="swal2-html-container">
                    <label for="status" class="swal2=html-text">Progresso da Ocorrência</label>
                    <select
                        id="status"
                        class="swal2-select"
                        style="
                            width: 55vw; 
                            height: 8vh; 
                            border-radius: 4px; 
                            transition: all 0.3s ease;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;"
                    >
                    <option value="red">    Ainda não atendido  </option>
                    <option value="yellow"> Em andamento        </option>
                    <option value="green">  Solucionado         </option>
                </div>
            `,
            reverseButtons: true,
            preConfirm: async () => {
                if (localStorage.getItem('sel-file') != '' && localStorage.getItem('sel-file') != null) {
                    file = localStorage.getItem('sel-file')
                }
                else {
                    file = ''
                }
                updateReportData(
                    author,
                    reportID,
                    document.getElementById('main-p').value,
                    document.getElementById('main-t').value,
                    file,
                    document.getElementById('status').value
                ).then(() => successToastSwal.fire().then(localStorage.removeItem('sel-file')))
                .catch(() => errorToastSwal.fire())
            }
        })
        const selectedFile = document.getElementById('file-url');
        if (selectedFile) { 
            selectedFile.addEventListener('change', (event) => {
                convertImg(event.target.files[0], function(base64Result) {
                    localStorage.setItem('sel-file', base64Result);
                })
            }) 
        }
        switch (resp.status) {
            case 'red':
                document.getElementById('status').selectedIndex = 0
            ;
            break;
            case 'yellow':
                document.getElementById('status').selectedIndex = 1
            ;
            break;
            case 'green':
                document.getElementById('status').selectedIndex = 2
            ;
            break;
        }
    })
}

export async function swalFireLookForOcurrence (
    reportID
) {
    readReports(reportID, 'text-content').then(response => {
        readReports(reportID, 'general').then(resp => {
            const userUID = resp.content.autor;
            const data = Object.entries(response);
            var imageURL = data[1][1];
            if (!imageURL) {
                imageURL = '../../assets/default_occur.jpg'
            }
            readReports(reportID, 'selected-object').then((resp) => {
                readObjects(resp, 'class-type').then(classType => {
                    const swalLook =
                    reControleSwal.mixin({
                        title: `${data[4][1]}`,
                        imageUrl: `${imageURL}`,
                        cancelButtonText: 'Ok',
                        confirmButtonText: 'Alterar',
                        html: `
                            <div class='swal2-html-container' id='swal2-html-container'>
                                <label for='object-description' style='font-weight:bold;'> Descrição </label>
                                <center>
                                    <p id='object-description' style=' 
                                            height: 20vh;
                                            width:55vw;
                                            border:1px solid black;
                                            border-radius:15px;
                                            border-color: #D3D3D3;
                                            background-color: #f5f5f5;'
                                    >
                                        ${data[3][1]}
                                    </p>
                                </center>
                            </div>
                            <div class='swal2-html-container' id='swal2-html-container'>
                                <label for='object-class' style='font-weight:bold;'> Classe do objeto </label>
                                <center>
                                    <p id='object-class' style='
                                            width:55vw;
                                            border:1px solid black;
                                            border-radius:15px;
                                            border-color: #D3D3D3;
                                            background-color: #f5f5f5;'
                                    >
                                        ${classType[0]}
                                    </p>
                                </center>
                            </div>
                            <div class='swal2-html-container' id='swal2-html-container'>
                                <label for='object-type' style='font-weight:bold;'> Tipo do objeto </label>
                                <center>
                                    <p id='object-type' style='
                                            width:55vw;
                                            border:1px solid black;
                                            border-radius:15px;
                                            border-color: #D3D3D3;
                                            background-color: #f5f5f5;'
                                    >
                                        ${classType[1]}
                                    </p>
                                </center>
                            </div>
                            <div class='swal2-html-container' id='swal2-html-container'>
                                <label for='selected-local' style='font-weight:bold;'> Sala selecionada </label>
                                <center>
                                    <p id='selected-local' style='
                                            width:55vw;
                                            border:1px solid black;
                                            border-radius:15px;
                                            border-color: #D3D3D3;
                                            background-color: #f5f5f5;'
                                    >
                                        ${reportID.slice(0, -17)}
                                    </p>
                                </center>
                            </div>
                            <div class='swal2-html-container' id='swal2-html-container'>
                                <label for='date-time' style='font-weight:bold;'> Data e Hora </label>
                                <center>
                                    <p id='date-time' style='
                                            width:55vw;
                                            border:1px solid black;
                                            border-radius:15px;
                                            border-color: #D3D3D3;
                                            background-color: #f5f5f5;'
                                    >
                                        Dia ${reportID.slice(-8, -6)} do mês ${reportID.slice(-11, -9)} de ${reportID.slice(-16, -12)} , às ${reportID.slice(-5, -3)} horas e ${reportID.slice(-2)} minutos
                                    </p>
                                </center>
                            </div>
                        `,
                        preConfirm: async () => updateReportSwal(reportID, userUID)
                    })
                    if (localStorage.getItem('rank') == 3) {
                        swalLook.fire()
                    }
                    else {
                        swalLook.fire({
                            showConfirmButton: false
                        })
                    }
                });
            })
        })
    })
    
}

export async function createLaboratorySwal (
    userUID,
    userName
) {
    var labLastID, //checked
    basisObjectIDsArray, //checked
    basisObjectClassesArray, //checked
    classificationOfLabs, //checked
    labURL, //Not checked yet
    labDesc, //checked
    createDate, //checked
    author, //checked
    status, //checked
    floor, //checked
    selectData,
    labClassData;
    
    
    readObjects(null, 'type').then( resp => {
        author = userUID;
        selectData = `<option value="none"></option>`;
        for (var ID = 0; ID < resp.length ;ID++) {
            selectData += `<option value="${resp[ID][1]}">${resp[ID][1]}</option>`
        }
        readLaboratories(null, 'class').then(labClasses => {
            labClassData = `<option value="none"></option>`;
            for (var labID = 0; labID < labClasses.length; labID++) {
                labClassData += `<option value="${labClasses[labID][1]}">${labClasses[labID][1]}</option>`
            }
            reControleSwal.fire({
                title: 'Adicionar laboratório',
                html: `
                    <div class="swal2-html-container">
                        <label 
                            for="author-name" 
                            class="swal2-html-text" 
                            style="color: black;"
                        >Autor</label>
                        <p id="author-name">${userName}</p>
                    </div>
                    <div class="swal2-html-container">
                        <label 
                            for="lab-id" 
                            class="swal2-input-label" 
                            style="color:black;"
                        >Identitficador do laboratório</label>
                        <input 
                            type="text" 
                            class="swal2-input" 
                            id="lab-id" 
                            style="
                                width: 55vw;
                                transition: all 0.3s ease;
                                background-color: #f5f5f5;
                                border-radius:15px;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            " 
                        required>
                    </div>
                    <div class="swal2-html-container">
                        <label 
                            for="input2" 
                            class="swal2-input-label" 
                            style="color:black;"
                        >Informações do laboratório</label>
                        <input 
                            type="text" 
                            class="swal2-input" 
                            id="desc"
                            style="
                                width: 55vw; 
                                height: 25vh; 
                                transition: all 0.3s ease;
                                background-color: #f5f5f5;
                                border-radius:15px;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            " 
                        required>
                    </div>
                    <div class="swal2-html-container">
                        <label 
                            for="lab-url" 
                            class="swal2-input-label" 
                            style="color:black;"
                        >Adicione uma imagem do local</label>
                        <input 
                            type="file" 
                            accept=".jpg,.png,image/*" 
                            class="swal2-input" 
                            id="lab-url" 
                            style="
                                width:55vw; 
                                transition: all 0.3s ease;
                                background-color: #f5f5f5;
                                border-radius: 15px;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            " 
                        required>
                    </div>
                    <div class="swal2-html-container" id="select-container">
                        <label 
                            class="swa2-input-label"
                            style="color:black;"
                        >Selecione um dos objetos abaixo</label><br>
                        <select 
                            class="swal2-select" 
                            id="select" 
                            style="
                                width: 55vw; 
                                height: 8vh; 
                                transition: all 0.3s ease;
                                border-radius:15px;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            "
                        >
                            ${selectData}
                        </select>
                    </div>
                    <div id="sel-container-class" class="swal2-html-container">
                        <label 
                            class="swa2-input-label" 
                            for="lab-class" 
                            style="color:black;"
                        >Selecione uma das classes abaixo para o seu laboratório<label><br>
                        <select 
                            class="swal2-select" 
                            id="lab-class" 
                            style="
                                width: 55vw; 
                                height: 8vh; 
                                border-radius: 15px; 
                                border-color: #D3D3D3;
                                transition: all 0.3s ease;
                                background-color: #f5f5f5;
                            "   
                        >
                            ${labClassData}
                        </select>
                        <br><br><label class="swal2-html-text" style="color: gray;"> ou </label><br><br>
                        <label 
                            class="swa2-input-label" 
                            for="text-class-option" 
                            style="color:black;"
                        >Crie uma classe<label><br>
                        <input 
                            type="text" 
                            class="swal2-input" 
                            id="text-class-option" 
                            style="
                                width: 55vw; 
                                height: 8vh; 
                                border-radius: 15px; 
                                border-color: #D3D3D3;
                                transition: all 0.3s ease;
                                background-color: #f5f5f5;
                            "   
                        >
                    </div>
                    <div class="swal2-html-container">
                        <label 
                            for="status" 
                            class="swal2-input-label" 
                            style="color:black;"
                        >Selecione o estado do laboratório</label>
                        <select
                            class="swal2-select"
                            id="status"
                            style="
                                width: 55vw;
                                height: 8vh; 
                                border-radius: 15px; 
                                border-color: #D3D3D3;
                                transition: all 0.3s ease;
                                background-color: #f5f5f5;
                            "
                        >
                            <option value="open">Aberto</option>
                            <option value="under-maintenance">Em manutenção</option>
                        </select>
                    </div>
                    <div class="swal2-html-container">
                        <label 
                            for="floor-number" 
                            class="swal2-input-label" 
                            style="color:black;"
                        >Selecione o andar referente ao laboratório</label><br>
                        <input 
                            type="range" 
                            max="4" min="0" step="1"
                            id="floor-number" 
                            class="swal2-input"
                            value="0"
                            style="
                                height: 8vh; 
                                border-radius: 15px; 
                                border-color: #D3D3D3;
                                transition: all 0.3s ease;
                                background-color: #f5f5f5;
                            "
                        >
                        <label class="swal2-input-label" id="range" style="color:black;">0</label>
                    </div>
                `, 
                confirmButtonText: 'Enviar ocorrência',
                preConfirm: async () => {
                    labLastID = document.getElementById('lab-id').value;
                    basisObjectIDsArray = ""; //A criação não pertencerá ainda a este Swal

                    const container = document.getElementById('select-container');
                    const selects   = container.querySelectorAll('select');
                    basisObjectClassesArray = {};
                    selects.forEach((sel, i) => {
                        if (sel.value != 'none') {
                        basisObjectClassesArray[`Object-${(i+1)}`] = sel.value
                        }
                    });

                    if (document.getElementById('lab-class').selectedIndex != 0 || document.getElementById('text-class-option').value) {   
                        classificationOfLabs = localStorage.getItem('class')
                    }

                    if (localStorage.getItem('sel-file') != '' && localStorage.getItem('sel-file') != null) {
                        labURL = localStorage.getItem('sel-file')
                    }
                    else
                    {
                        labURL = ''
                    }
                    if (document.getElementById('desc').value) labDesc = document.getElementById('desc').value;
                    createDate = new Date().toISOString().split('T')[0];
                    if (document.getElementById('status').value) status = document.getElementById('status').value;
                    if (document.getElementById('floor-number').value) floor = document.getElementById('floor-number').value;

                    writeLaboratoryData(
                        labLastID,
                        basisObjectClassesArray,
                        classificationOfLabs,
                        labURL,
                        labDesc,
                        createDate,
                        author,
                        status,
                        floor
                    ).then(() => {
                        successToastSwal.fire().then( localStorage.removeItem('sel-file') )
                    })
                }
            });
            const imgFile = document.getElementById('lab-url');
            const container = document.getElementById('select-container');
            const otherChoice = document.getElementById('lab-class');
            const createdChoice = document.getElementById('text-class-option');
            const range = document.getElementById('floor-number');
            if (range) {
                range.addEventListener('input', () => {
                    document.getElementById('range').textContent = range.value;
                })
            }
            
            container.addEventListener('change', function(e) {
                const target = e.target;
                if (target.tagName !== 'SELECT') return;
                const selects = Array.from(container.querySelectorAll('select'));
                const idx = selects.indexOf(target);
                if (target.selectedIndex !== 0) {
                    const isLast = idx === selects.length - 1;
                    if (isLast) {
                        const novo = target.cloneNode(true);
                        novo.selectedIndex = 0;
                        container.appendChild(novo);
                    }
                } else {
                    const toRemove = selects.slice(idx + 1);
                    toRemove.forEach(s => s.remove());
                }
            });
            if (imgFile) {
                imgFile.addEventListener('change', (event) => {
                    convertImg(event.target.files[0], function(base64Result) {
                        localStorage.setItem('sel-file', base64Result);
                    })
                })
            }
            if (otherChoice) {
                otherChoice.addEventListener('change', (event) => {
                    localStorage.setItem('class', event.target.value);
                    if (event.target.value != 'none') createdChoice.value = "";
                })
            }
            if (createdChoice) {
                createdChoice.addEventListener('input', (newClass) => {
                    if (localStorage.getItem('class') != 'none') otherChoice.selectedIndex = 0;
                    localStorage.setItem('class', newClass.target.value);
                })
            }
        })
    });
}

export async function updateLaboratorySwal (
    classroomID,
    author
) {
    var classes, 
    selectData,
    basisObjectClassesArray,
    file;
    readLaboratories(classroomID, 'general').then(resp => {
        var imageURL = resp.lab_Content.lab_img_url;

        if (!imageURL) {imageURL = '../../assets/default_classroom.avif'}
        readLaboratories(null, 'class').then(response => {
            classes = `<option value="none"></option>`;
            for (var labID = 0; labID < response.length; labID++) {
                classes += `<option value="${response[labID][1]}">${response[labID][1]}</option>`; 
            }
            readObjects(null, 'type').then(objects => {
               
                reControleSwal.fire({
                    title: `Editar laboratório`,
                    imageUrl: imageURL,
                    html: `
                        <div class="swal2-html-container">
                            <label for="desc" class="swal2-input-label">Descrição</label>
                            <input 
                                type="text"
                                style=" 
                                    width: 60vw;
                                    border-radius:15px;
                                    border-color: #D3D3D3;
                                    background-color: #f5f5f5;
                                " 
                                class="swal2-input" 
                                id="desc" 
                                value="${resp.lab_Content.desc}"
                            >
                        </div>
                        <div class="swal2-html-container">
                            <label for="img-url" class="swal2-input-label">Imagem</label><br>
                            <input 
                                type="file" 
                                id="img-url" 
                                class="swal2-input" 
                                style=" 
                                    width: 60vw;
                                    border-radius:15px;
                                    border-color: #D3D3D3;
                                    background-color: #f5f5f5;
                                " 
                                value="${imageURL}"
                            >
                        </div>
                        <div class="swal2-html-container" id="floor-div">
                            <label for="floor" class="swal2-input-label">Andar Selecionado</label><br>
                            <input 
                                type="range" 
                                min="0" max="4" 
                                step="1"
                                class="swal2-input" 
                                id="floor" 
                                value="${resp.lab_floor}"
                            >
                            <label class="swal2-input-label" id="range-l">${resp.lab_floor}</label>
                        </div>
                        <div class="swal2-html-container" id="select_container">
                            <label for="sel-class" class="swal2-input-label">Classe do laboratório</label>
                            <select 
                                class="swal2-select" 
                                id="sel-class" 
                                style="
                                    width: 60vw; 
                                    height: 8vh; 
                                    transition: all 0.3s ease;
                                    border-radius:15px;
                                    border-color: #D3D3D3;
                                    background-color: #f5f5f5;
                                "
                            >
                                ${classes}
                            <select>
                        </div>
                        <div class="swal2-html-container">
                            <label for="status" class="swal2-input-label">Estado atual</label>
                            <select 
                                class="swal2-select" 
                                id="status" 
                                style="
                                    width: 60vw; 
                                    height: 8vh; 
                                    transition: all 0.3s ease;
                                    border-radius:15px;
                                    border-color: #D3D3D3;
                                    background-color: #f5f5f5;
                                "
                            >
                                <option value="open">Aberto</option>
                                <option value="under-maintenance">Em manutenção</option>
                            </select>
                        </div>
                        <div class="swal2-html-container" id="div-objs">
                            <label for="select" class="swal2-input-label">Tipos de objetos que estão contidos</label>
                        </div>
                    `,
                    reverseButtons: true, 
                    preConfirm: async () => {
                        const container = document.getElementById('div-objs');
                        const selects   = container.querySelectorAll('select');
                        basisObjectClassesArray = {};
                        selects.forEach((sel, i) => {
                            if (sel.value != 'none') {
                            basisObjectClassesArray[`Object-${(i+1)}`] = sel.value
                            }
                        });
                        if (localStorage.getItem('sel-file') != '' && localStorage.getItem('sel-file') != null) {
                            file = localStorage.getItem('sel-file')
                        }
                        else
                        {
                            file = ''
                        }
                        writeLaboratoryData(
                            classroomID,
                            basisObjectClassesArray,
                            document.getElementById('sel-class').value,
                            file,
                            document.getElementById('desc').value,
                            resp.data,
                            author,
                            document.getElementById('status').value,
                            document.getElementById('floor').value
                        ).then(successToastSwal.fire().then(localStorage.removeItem('sel-file'))).catch(error => errorToastSwal.fire({text: error}));
                    }
                });

                for (const object in resp.basis_obj.b_obj_classes_array) {
                    selectData = `
                    <select 
                        class="swal2-select" 
                        id="select-${object}"
                        style="
                            width: 60vw; 
                            height: 8vh; 
                            transition: all 0.3s ease;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        "
                    >
                        <option value="none"></option>`;
                    for (var ID = 0; ID < objects.length ;ID++) {
                        selectData += `<option value="${objects[ID][1]}">${objects[ID][1]}</option>`
                    }
                    selectData += '</select>';
                    document.getElementById('div-objs').innerHTML += selectData;
                    
                }
                for (const object in resp.basis_obj.b_obj_classes_array) {
                    const selectElement = document.getElementById(`select-${object}`);
                    selectElement.selectedIndex = 
                        Array.from(selectElement.options).findIndex(option => option.value === resp.basis_obj.b_obj_classes_array[object]);
                }
            
                const select = document.getElementById('sel-class');
                const searchValue = resp.classif_labs;
                select.selectedIndex = Array.from(select.options).findIndex(option => option.value === searchValue);

                const statusSelect = document.getElementById('status');
                const searchStatus = resp.status;
                statusSelect.selectedIndex = Array.from(statusSelect.options).findIndex(option => option.value === searchStatus);

                const floorRange = document.getElementById('floor');
                if (floorRange) {
                    floorRange.addEventListener('input', (event) => {
                        document.getElementById('range-l').textContent = event.target.value;
                    })
                
                }
                const container = document.getElementById('div-objs');
                container.addEventListener('change', function(e) {
                    const target = e.target;
                    if (target.tagName !== 'SELECT') return;
                    const selects = Array.from(container.querySelectorAll('select'));
                    const idx = selects.indexOf(target);
                    if (target.selectedIndex !== 0) {
                        const isLast = idx === selects.length - 1;
                        if (isLast) {
                            const novo = target.cloneNode(true);
                            novo.selectedIndex = 0;
                            container.appendChild(novo);
                        }
                    } else {
                        const toRemove = selects.slice(idx + 1);
                        toRemove.forEach(s => s.remove());
                    }
                });
            })
        })
    })
}

export async function swalFireLookForLaboratory (
    classroomID
) {
    var objList = '';
    readLaboratories(classroomID, 'general').then(resp => {
        const userUID = resp.author;
        const objData = resp.basis_obj.b_obj_classes_array;
        for (const objID in objData) {
            objList += `<p class="swal2-input" style="
                            border:1px solid black;
                            border-radius:15px;
                            width:55vw;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        ">${objData[objID]}</p>`
        }
        readUsers(resp.author, 'user-name').then(name => localStorage.setItem('user-name', name));
        const status = resp.status === 'open' ? 'Aberto' : 'Em manutenção';
        var imageURL = resp.lab_Content.lab_img_url;
        if (!imageURL) {imageURL = '../../assets/default_classroom.avif'}
        const swalLook = reControleSwal.mixin({
            title: `${classroomID}`,
            imageUrl: `${imageURL}`,
            confirmButtonText: 'Alterar',
            cancelButtonText: 'Ok',
            html: `
                <div class="swal2-html-container">
                    <label for="" class="swal2-html-text" style="font-weight:bold;">Classificação do laboratório</label><br><br>
                    <center>
                        <p class="swal2-input" style="
                            border:1px solid black;
                            border-radius:15px;
                            width:55vw;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        ">${resp.classif_labs}</p>
                    </center>
                </div>
                <div class="swal2-html-container">
                    <label for="" class="swal2-html-text" style="font-weight:bold;">Autor</label><br><br>
                    <center>
                        <p class="swal2-input" style="
                            border:1px solid black;
                            border-radius:15px;
                            width:55vw;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        ">${localStorage.getItem('user-name')}</p>
                    </center>
                </div>
                <div class="swal2-html-container">
                    <label for="" class="swal2-html-text" style="font-weight:bold;">Estado</label><br><br>
                    <center>
                        <p class="swal2-input" style="
                            border:1px solid black;
                            border-radius:15px;
                            width:55vw;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        ">${status}</p>
                    </center>
                </div>
                <div class="swal2-html-container">
                    <label for="" class="swal2-html-text" style="font-weight:bold;">Descrição</label><br><br>
                    <center>
                        <p class="swal2-input" style="
                            border:1px solid black;
                            border-radius:15px;
                            width:55vw;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        ">${resp.lab_Content.desc}</p>
                    </center>
                </div>
                <div class="swal2-html-container">
                    <label for="" class="swal2-html-text" style="font-weight:bold;">Objetos contidos no local</label><br><br>
                    <center>
                        ${objList}
                    </center>
                </div>
            `,
            preConfirm: async () => {
                updateLaboratorySwal(classroomID, userUID)
            }
        });
        if (localStorage.getItem('rank') == 3) {
            swalLook.fire()
        }
        else {
            swalLook.fire({
                showConfirmButton: false
            })
        }
    })
}

export async function swalFireLookForUser (
    userID
) {
    readUsers(userID, 'general').then(resp => {
        var imageURL = resp.user_img_url;
        if (!imageURL) {imageURL = '../../assets/avatar.png'}
        reControleSwal.fire({
            title: resp.user_name,
            imageWidth: '35vw',
            imageUrl: imageURL,
            showCancelButton: false
        })
    })
}

export async function convertImg (
    file, 
    callback
) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width * 0.5;
            canvas.height = img.height * 0.5;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const base64 = canvas.toDataURL('image/png', 0.7);
            callback(base64);
        };
    };
    reader.readAsDataURL(file);
}

//depois fazer uma verif para o nível de acesso ao update