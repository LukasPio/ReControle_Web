import {
    writeReportsData,
    writeLaboratoryData,
    readReports,
    readLaboratories,
    readObjects,
    readUsers,
    updateWebReportData,
    updateMobileReportData,
    verifyObject,
    writeObjectData,
    writeUserData,
    setExcludingWeb,
    setExcludingMobile,
    setConcluded

} from './realtime_db.js';
import {
    reControleSwal, 
    successToastSwal, 
    errorToastSwal

} from './swal_mixins.js';
import { 
    getDatabase, 
    ref, 
    child, 
    get, 
    onValue, 
    remove 

} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import { initializeApp }  from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { 
    getAuth, 
    onAuthStateChanged 
} from   'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';
import { firebaseConfig } from "../js_config/Config.js";

export async function createReportSwal (
    title,
    author
) {

    var newMainProblem, 
    newMainTitle, 
    newSelectedObject, 
    occuredDate, 
    occuredTime, 
    file,
    selectData;

    // Todos os problemas previsíveis possíveis
    
    readObjects(null, 'general').then(resp => {
        selectData = '<option value="none"></option>';
        for (const ID in resp) {
            selectData += `<option value="${ID}"> ${ID} </option>`
        }

        reControleSwal.fire({
            title: 'Só mais uns passos...',
            html: `
                <div class="swal2-html-container">
                    <label for="main-title" class="swal2-html-text">Título do Ocorrido</label>
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
                    <label for="main-problem" class="swal2-html-text">Problema a Relatar</label>
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
                        value="${title}"
                    > 
                </div>
                <div class="swal2-html-container">
                    <label for="file-upload" class="swal2=html-text">Selecione um Arquivo de Imagem</label><br>
                    <div class="swal2-html-container" id="file-upload">
                        <label for="selected-file" class="swal2=html-text">Imagem</label><br>
                        <input 
                            type="file"
                            accept=".jpg,.png,image/*" 
                            class="swal2-input"
                            id="selected-file" 
                        >
                        <p id="p-file"> Nenhum arquivo selecionado </p>
                    </div>
                </div>
                <div class="swal2-html-container">
                    <label for="selected-obj" class="swal2-html-text">Objeto Selecionado</label><br>
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
                    <label for="selected-obj" class="swal2-html-text">Dia do acontecimento da Ocorrência</label><br>
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
            confirmButtonText: 'Enviar Ocorrência',
            confirmButtonColor: '#2f5cf3',
            preConfirm: async () => {
                newMainTitle = document.getElementById('main-title').value;
                newMainProblem = document.getElementById('main-problem').value;
                newSelectedObject = document.getElementById('selected-obj').value;
                occuredDate = new Date(`${document.getElementById('occur-date').value}T${document.getElementById('occur-time').value}`).getTime();
                if (localStorage.getItem('sel-file')?.startsWith('data') || localStorage.getItem('sel-file')?.startsWith('/9j/')) {
                    file = localStorage.getItem('sel-file')
                    localStorage.removeItem('sel-file')
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
                            0,
                            //`${resp}-${occuredDate}-${occuredTime}`,
                            resp,
                            newSelectedObject,
                            `${new Date().getTime()}`,
                            ''
                        );
                        successToastSwal.fire()
                    }
                    catch (error) {
                        errorToastSwal.fire().then(console.log(error))
                    }
                })                
            }
        })
        const selectedFile = document.getElementById('selected-file');
        if (selectedFile) { 
            selectedFile.addEventListener('change', (event) => {
                if (event.target.files[0].size > 2 * 1024 *1024 ) {document.getElementById('p-file').textContent = 'Tamanho excedente do arquivo.'}
                else
                {
                    document.getElementById('p-file').textContent = (event.target.value).slice(12);
                    convertImg(event.target.files[0], function(base64Result) {
                        localStorage.removeItem('sel-file');
                        localStorage.setItem('sel-file', base64Result);
                    });
                }
            }) 
        }   
    })
    
}

async function updateReportSwal (
    reportID,
    author
) {
    var file, oldComments;
    readReports(reportID, 'text-content').then(resp => {
        var text, comment;
        if (resp.title) {
            text = `
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
                    <label for="file-upload" class="swal2=html-text">Selecione um Arquivo de Imagem</label><br>
                    <div class="swal2-html-container" id="file-upload">
                    
                        <label for="file-url" class="swal2=html-text">Imagem</label><br>
                        <input 
                            type="file"
                            accept=".jpg,.png,image/*" 
                            class="swal2-input"
                            id="file-url" 
                        >
                        <p id="p-file"> Nenhum arquivo selecionado </p>
                    </div>
                </div>
                <div class="swal2-html-container" id="status-div">
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
            `
        }
        else
        {
            text = `
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
                    <label for="file-upload" class="swal2=html-text">Selecione um Arquivo de Imagem</label><br>
                    <div class="swal2-html-container" id="file-upload">
                    
                        <label for="file-url" class="swal2=html-text">Imagem</label><br>
                        <input 
                            type="file"
                            accept=".jpg,.png,image/*" 
                            class="swal2-input"
                            id="file-url" 
                        >
                        <p id="p-file"> Nenhum arquivo selecionado </p>
                    </div>
                </div>
                <div class="swal2-html-container">
                    <label for="local" class="swal2=html-text">Local Selecionado</label><br>
                    <input 
                        type="text"
                        accept=".jpg,.png,image/*" 
                        class="swal2-input"
                        style="
                            width: 55vw;
                            border-radius:15px;
                            border-color: #D3D3D3;
                            background-color: #f5f5f5;
                        "
                        id="local" 
                        value="${resp.local}"
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
            `
        }

        if (resp.content?.comments) oldComments = resp.content.comments;
        reControleSwal.fire({
            title: 'Editar Ocorrência',
            html: text,
            reverseButtons: true,
            preConfirm: async () => {
                if (localStorage.getItem('sel-file') !== null) {
                    if (localStorage.getItem('sel-file').startsWith('data') || localStorage.getItem('sel-file').startsWith('/9j/')) {
                        file = localStorage.getItem('sel-file')
                    }
                    else {
                        file = ''
                    }
                }
                else
                {
                    if (resp.img_url != '') {
                        file = resp.img_url
                    }
                }

                if (resp.content?.comments && resp.content.status != document.getElementById('status').value) {
                    oldComments = `${resp.content.comments} <br><br> `
                }
                var statusComment;
                if (document.getElementById('status').value == 'green') statusComment = 'concluído';
                if (document.getElementById('status').value == 'yellow') statusComment = 'em andamento';
                if (document.getElementById('status').value == 'red') statusComment = 'pendente';
                comment = localStorage.getItem('comments') || 'Sem comentários';

                oldComments += ` Data do comentário (${statusComment}) - ${new Date().toUTCString().slice(5).slice(0, -13)}: <br> ${comment} `;

                if (resp.title) {
                    if (document.getElementById('status').value == 'green') {
                        initializeApp(firebaseConfig);
                        onAuthStateChanged(getAuth(), (user) => {
                            setExcludingWeb(
                                reportID, 
                                user.uid, 
                                new Date(new Date().setMonth(new Date().getMonth() + 3)).getTime()
                            )
                            setConcluded(
                                reportID,
                                new Date().getTime()
                            )
                        })
                    }

                    

                    updateWebReportData(
                        author,
                        reportID,
                        document.getElementById('main-p').value,
                        document.getElementById('main-t').value,
                        file,
                        document.getElementById('status').value, 
                        resp.timestamp,
                        oldComments
                    ).then(() => successToastSwal.fire().then(localStorage.removeItem('sel-file')))
                    .catch(() => errorToastSwal.fire())
                }
                else
                {
                    if (document.getElementById('status').value == 'green') {
                        initializeApp(firebaseConfig);
                        onAuthStateChanged(getAuth(), (user) => {
                            setExcludingMobile(
                                reportID, 
                                user.uid, 
                                new Date(new Date().setMonth(new Date().getMonth() + 3)).getTime()
                            )
                            setConcluded(
                                reportID,
                                new Date().getTime()
                            )
                        })
                    }

                    updateMobileReportData(
                        reportID,
                        document.getElementById('main-t').value,
                        file,
                        document.getElementById('local').value,
                        document.getElementById('status').value,
                        author,
                        resp.category,
                        resp.timestamp,
                        oldComments
                    ).then(() => successToastSwal.fire().then(console.log(file) ,localStorage.removeItem('sel-file')))
                    .catch(() => errorToastSwal.fire())
                }
            }
        })
        const selectedFile = document.getElementById('file-url');
        if (selectedFile) { 
            selectedFile.addEventListener('change', (event) => {
                if (event.target.files[0].size > 2 * 1024 *1024 ) {document.getElementById('p-file').textContent = 'Tamanho excedente do arquivo.'}
                else
                {
                    document.getElementById('p-file').textContent = (event.target.value).slice(12);
                    convertImg(event.target.files[0], function(base64Result) {
                        localStorage.setItem('sel-file', base64Result);
                    });
                }
            }) 
        }

        const status = document.getElementById('status');
        const comments = document.createElement('div');
        comments.className = 'swal2-html-container';
        comments.innerHTML = `
            <label for="comments" class="swal2=html-text">Adicione um comentário</label><br>
            <input 
                type="text" 
                class="swal2-input"
                style=" 
                    height: 20vh;
                    width: 55vw;
                    border-radius:15px;
                    border-color: #D3D3D3;
                    background-color: #f5f5f5;
                "
                id="main-p" 
            >
        `;
        if (status) {
            status.addEventListener('change', (e) => {
                if (resp.status != e.target.value) {
                    document.getElementById('status-div').appendChild(comments);
                }
                else {
                    document.getElementById('status-div').removeChild(comments);
                }
            })
        }
        if (comments) {
            comments.addEventListener('input', (e) => {
                localStorage.setItem('comments', e.target.value)
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

    readReports(reportID, 'general').then(resp => {
        var text = '';
        const userUID = resp.content.autor;
        var imageElement = resp.content.img_url === '' ? '../../assets/default_occur.jpg' : resp.content.img_url;
        var image = `${resp.content.img_url}`;
        if (!image.startsWith('data:image/png;base64,') ) {
            imageElement = resp.content.img_url === '' ? '../../assets/default_occur.jpg' : 'data:image/png;base64, ' + image;
        }
        if (resp.content?.comments) {
            text = `
                <div class='swal2-html-container' id='swal2-html-container'>
                <label for='comment' style='font-weight:bold;'> Comentários adicionais </label>
                    <center>
                        <p id='comment' style=' 
                                height: 20vh;
                                width:55vw;
                                border:1px solid black;
                                border-radius:15px;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;'
                        >
                            ${resp.content?.comments}
                        </p>
                    </center>
                </div>`;
        }
        const swalLook = reControleSwal.mixin({
            title: 'Ocorrência',
            imageUrl: `${imageElement}`,
            cancelButtonText: 'Ok',
            confirmButtonText: 'Alterar',
            showDenyButton: true,
            denyButtonText: 'Apagar ocorrência',
            preConfirm: async () => updateReportSwal(reportID, userUID),
        });
        if (resp.selected_obj) {
            readObjects(resp.selected_obj.sel_obj_id, 'class-type').then(classType => {
                text = `
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
                                ${resp.content?.text}
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
                                ${resp.selected_obj.sel_lab_id}
                            </p>
                        </center>
                    </div>
                    <div class='swal2-html-container' id='swal2-html-container'>
                        <label for='date-time' style='font-weight:bold;'> Data de criação </label>
                            <center>
                            <p id='date-time' style='
                                    width:55vw;
                                    border:1px solid black;
                                    border-radius:15px;
                                    border-color: #D3D3D3;
                                    background-color: #f5f5f5;'
                            >
                                ${new Date(Number(resp.content.timestamp)).toUTCString().slice(0, -4).slice(5)}
                            </p>
                        </center>
                    </div>
                ` + text;
                swalLook.update({
                    title: resp.content?.title,
                    html: text,
                    preDeny: async () => {
                        initializeApp(firebaseConfig);
                        onAuthStateChanged(getAuth(), (user) => {
                            setExcludingWeb(
                                reportID, 
                                user.uid, 
                                new Date(new Date().setMonth(new Date().getMonth() + 1)).getTime()
                            ).then(successToastSwal.fire({title: 'Ocorrência datada para ser excluída em 1 mês'}))
                        })
                    }
                })
                
            });
        }
        else
        {
            text = `
                <div class='swal2-html-container' id='swal2-html-container'>
                    <label for='report-desc' style='font-weight:bold;'> Descrição </label>
                    <center>
                        <p id='report-desc' style=' 
                                height: 20vh;
                                width:55vw;
                                border:1px solid black;
                                border-radius:15px;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;'
                        >
                            ${resp.content?.text}
                        </p>
                    </center>
                </div>
                <div class='swal2-html-container' id='swal2-html-container'>
                    <label for='class' style='font-weight:bold;'> Classe </label>
                    <center>
                        <p id='class' style=' 
                                height: 4vh;
                                width:55vw;
                                border:1px solid black;
                                border-radius:15px;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;'
                        >
                            ${resp.content?.category}
                        </p>
                    </center>
                </div>
                <div class='swal2-html-container' id='swal2-html-container'>
                    <label for='local' style='font-weight:bold;'> Local selecionado </label>
                    <center>
                        <p id='local' style=' 
                                height: 4vh;
                                width:55vw;
                                border:1px solid black;
                                border-radius:15px;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;'
                        >
                            ${resp.content?.local}
                        </p>
                    </center>
                </div>
                <div class='swal2-html-container' id='swal2-html-container'>
                    <label for='date' style='font-weight:bold;'> Data de criação </label>
                    <center>
                        <p id='date' style=' 
                                height: 4vh;
                                width:55vw;
                                border:1px solid black;
                                border-radius:15px;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;'
                        >
                            ${new Date(resp.content?.timestamp).toUTCString().slice(0, -4).slice(5)}
                        </p>
                    </center>
                </div>
            ` + text;
            swalLook.update({
                html: text,
                preDeny: async () => {
                    initializeApp(firebaseConfig);
                    onAuthStateChanged(getAuth(), (user) => {
                        setExcludingMobile(
                            reportID, 
                            user.uid, 
                            new Date(new Date().setMonth(new Date().getMonth() + 1)).getTime()
                        ).then(successToastSwal.fire({title: 'Ocorrência datada para ser excluída em 1 mês'}))
                    })
                }
            })
        }
        if (localStorage.getItem('rank') == 3) {
            swalLook.fire()                
        }
        else {
            swalLook.fire({
                showConfirmButton: false,
                showDenyButton: false
            })
        }
    })    
}

export async function createLaboratorySwal (
    userUID,
    userName
) {
    var labLastID, //checked
    classificationOfLabs, //checked
    labURL, //Not checked yet
    labDesc, //checked
    createDate, //checked
    status, //checked
    floor, //checked
    labClassData;
    readLaboratories(null, 'class').then(labClasses => {
        labClassData = `<option value="none"></option>`;
        for (const labID in labClasses) {
            labClassData += `<option value="${labClasses[labID]}">${labClasses[labID]}</option>`
        }
        reControleSwal.fire({
            title: 'Adicionar Laboratório',
            html: `
                <div class="swal2-html-container">
                    <label 
                        for="author-name" 
                        class="swal2-html-text" 
                        style="color: black;width: 55vw;"
                    >Autor</label>
                    <p id="author-name">${userName}</p>
                </div>
                <div class="swal2-html-container">
                    <label 
                        for="lab-id" 
                        class="swal2-input-label" 
                        style="color:black;"
                    >Identitficador do Laboratório</label>
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
                    >Informações do Laboratório</label>
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
                    <label for="file-upload" class="swal2=html-text">Selecione um Arquivo de Imagem</label><br><br>
                    <div class="swal2-html-container" id="file-upload">
                        <label for="lab-url" class="swal2=html-text">Imagem</label><br>
                        <input 
                            type="file"
                            accept=".jpg,.png,image/*" 
                            class="swal2-input"
                            id="lab-url" 
                        >
                        <p id="p-file"> Nenhum arquivo selecionado </p>
                    </div>
                </div>
                <div id="sel-container-class" class="swal2-html-container">
                    <label 
                        class="swa2-input-label" 
                        for="lab-class" 
                        style="color:black;"
                    >Selecione uma das Classes Abaixo para o seu Laboratório<label><br>
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
                    >Selecione o Estado do Laboratório</label>
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
                    >Selecione o Andar Referente ao Laboratório</label><br>
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
            confirmButtonText: 'Criar',
            preConfirm: async () => {
                labLastID = document.getElementById('lab-id').value;

                if (document.getElementById('lab-class').selectedIndex != 0 || document.getElementById('text-class-option').value) {   
                    classificationOfLabs = localStorage.getItem('class')
                }

                if (localStorage.getItem('sel-file') !== null) {
                    if (localStorage.getItem('sel-file').startsWith('data') || localStorage.getItem('sel-file').startsWith('/9j/')) {
                        labURL = localStorage.getItem('sel-file')
                    }
                    else
                    {
                        labURL = ''
                    }
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
                    classificationOfLabs,
                    labURL,
                    labDesc,
                    createDate,
                    userUID,
                    status,
                    floor
                ).then(() => {
                    successToastSwal.fire().then( localStorage.removeItem('sel-file'), localStorage.removeItem('class') )
                })
            }
        });
        const imgFile = document.getElementById('lab-url');
        const otherChoice = document.getElementById('lab-class');
        const createdChoice = document.getElementById('text-class-option');
        const range = document.getElementById('floor-number');
        if (range) {
            range.addEventListener('input', () => {
                document.getElementById('range').textContent = range.value;
            })
        }    
        if (imgFile) {
            imgFile.addEventListener('change', (event) => {
            if (event.target.files[0].size > 2 * 1024 *1024 ) {document.getElementById('p-file').textContent = 'Tamanho excedente do arquivo.'}
                else
                {
                    document.getElementById('p-file').textContent = (event.target.value).slice(12);
                    convertImg(event.target.files[0], function(base64Result) {
                        localStorage.setItem('sel-file', base64Result);
                    });
                }
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
}

async function updateLaboratorySwal (
    classroomID,
    author
) {
    var classes, 
    selectData,
    file;
    readLaboratories(classroomID, 'general').then(resp => {
        var imageURL = resp.content.lab_img_url;

        if (!imageURL) {imageURL = '../../assets/default_classroom.avif'}
        readLaboratories(null, 'class').then(response => {
            classes = `<option value="none"></option>`;
            for (const labID in response) {
                classes += `<option value="${response[labID]}">${response[labID]}</option>`; 
            }    
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
                            value="${resp.content.desc}"
                        >
                    </div>
                    <div class="swal2-html-container">
                        <label for="file-upload" class="swal2=html-text">Selecione um arquivo de imagem</label><br><br>
                        <div class="swal2-html-container" id="file-upload">
                            <label for="img-url" class="swal2=html-text">Imagem</label><br>
                            <input 
                                type="file"
                                accept=".jpg,.png,image/*" 
                                class="swal2-input"
                                id="img-url" 
                            >
                            <p id="p-file"> Nenhum arquivo selecionado </p>
                        </div>
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
                `,
                reverseButtons: true, 
                preConfirm: async () => {
                    if (localStorage.getItem('sel-file') != '' && localStorage.getItem('sel-file') != null) {
                        file = localStorage.getItem('sel-file')
                    }
                    else
                    {
                        file = ''
                    }
                    writeLaboratoryData(
                        classroomID,
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
            const selectedFile = document.getElementById('img-url');
            if (selectedFile) { 
                selectedFile.addEventListener('change', (event) => {
                    if (event.target.files[0].size > 2 * 1024 *1024 ) {document.getElementById('p-file').textContent = 'Tamanho excedente do arquivo.'}
                    else
                    {
                        document.getElementById('p-file').textContent = (event.target.value).slice(12);
                        convertImg(event.target.files[0], function(base64Result) {
                            localStorage.setItem('sel-file', base64Result);
                        });
                    }
                }) 
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

        })
    })
}

export async function swalFireLookForLaboratory (
    classroomID
) {
    readLaboratories(classroomID, 'general').then(resp => {
        const userUID = resp.author;
        readUsers(userUID, 'user-name').then(name => localStorage.setItem('user-name', name));
        const status = resp.status === 'open' ? 'Aberto' : 'Em manutenção';
        var imageURL = resp.content.lab_img_url;
        if (!imageURL) {imageURL = '../../assets/default_classroom.avif'}
        const swalLook = reControleSwal.mixin({
            title: classroomID,
            imageUrl: `${imageURL}`,
            confirmButtonText: 'Alterar',
            cancelButtonText: 'Ok',
            html: `
                <div class="swal2-html-container">
                    <label for="class" class="swal2-html-text" style="font-weight:bold;">Classificação do Laboratório</label><br><br>
                    <center>
                        <p 
                            id="class"
                            class="swal2-input" 
                            style="
                                border:1px solid black;
                                border-radius:15px;
                                width:55vw;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            "
                        >${resp.classif_labs}</p>
                    </center>
                </div>
                <div class="swal2-html-container">
                    <label for="aut" class="swal2-html-text" style="font-weight:bold;">Autor</label><br><br>
                    <center>
                        <p 
                            id="aut"
                            class="swal2-input" 
                            style="
                                border:1px solid black;
                                border-radius:15px;
                                width:55vw;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            "
                        >${localStorage.getItem('user-name')}</p>
                    </center>
                </div>
                <div class="swal2-html-container">
                    <label for="status" class="swal2-html-text" style="font-weight:bold;">Estado</label><br><br>
                    <center>
                        <p 
                            id="status"
                            class="swal2-input" 
                            style="
                                border:1px solid black;
                                border-radius:15px;
                                width:55vw;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            ">${status}</p>
                    </center>
                </div>
                <div class="swal2-html-container">
                    <label for="desc" class="swal2-html-text" style="font-weight:bold;">Descrição</label><br><br>
                    <center>
                        <p 
                            id="desc" 
                            class="swal2-input" 
                            style="
                                border:1px solid black;
                                border-radius:15px;
                                width:55vw;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            "
                        >${resp.content.desc}</p>
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

async function updateUserSwal(
    userId,
    name
) {
    readUsers(userId, 'general').then(resp => {
        const rank = resp.rank;
        reControleSwal.fire({
            width: '40vw',
            title: `Nível de acesso de ${name}`,
            input: 'range',
            inputAttributes: {
                max: 3,
                min: 1
            },
            inputValue: rank,
            preConfirm: async () => {
                if (rank == Swal.getInput().value) return;
                writeUserData(
                    userId,
                    Swal.getInput().value,
                    resp.user_img_url,
                    resp.user_name,
                    resp.user_email
                ).then(successToastSwal.fire({title: 'Atualização bem sucedida.'}))
            }
        });
    })
}

export async function swalFireLookForUser (
    userID
) {
    readUsers(userID, 'general').then(resp => {
        var imageURL = resp.user_img_url;
        if (!imageURL) {imageURL = '../../assets/avatar.png'}
        const swalLook = reControleSwal.mixin({
            title: resp.user_name,
            imageWidth: '35vw',
            imageUrl: imageURL,
            cancelButtonText: 'OK',
            confirmButtonText: 'Alterar',
            showDenyButton: true,
            denyButtonText: 'Remover conta',
            denyButtonColor: '',
            preConfirm: async () => {
                updateUserSwal(userID, resp.user_name)
            },
            preDeny: async () => {
                remove(ref(getDatabase(), `user/${userID}`)).then(successToastSwal.fire({title: 'Conta removida com sucesso.'}))
            }
        })
        if (localStorage.getItem('rank') == 3) {
            swalLook.fire()
        }
        else if (localStorage.getItem('rank') == 2) {
            swalLook.fire({showDenyButton: false})
        }
        else {
            swalLook.fire({
                showConfirmButton: false,
                showDenyButton: false
            })
        }
    })
}

export async function createObjectSwal () {

    var objName,
    objType,
    desc,
    inputValue,
    objClass,
    labData = '<option value="none"></option>',
    objClassData = '<option value="none"></option>',
    objTypeData = '<option value="none"></option>',
    objUsualType = '<option value="none"></option>';

    readLaboratories(null, 'general').then(resp => {
        for(const Id in resp) {
            labData += `<option value="${Id}">${Id}</option>`;
        }
        readObjects(null, 'general').then( objResp => {
            const dataTypeE = {};
            const dataTypeM = {};
            const dataElse = {};
            for (const id in objResp) {
                if (localStorage.getItem('old-type') != objResp[id].obj_type) {
                    if (objResp[id].obj_class == 'Eletrônico' ) {
                        dataTypeE[objResp[id].name] = objResp[id].obj_type
                    }
                    else if (objResp[id].obj_class == 'Móvel' ) {
                        dataTypeM[objResp[id].name] = objResp[id].obj_type
                    }
                    else{
                        dataElse[objResp[id].name] = objResp[id].obj_type
                    }
                    localStorage.setItem('old-type', objResp[id].obj_type)
                }
            }
            localStorage.removeItem('old-type');
            reControleSwal.fire({
                title: 'Objeto',
                text: 'Escolha uma predefinição de objeto:',
                width: '30vw',
                input: 'select',
                inputAttributes: {
                    style: `
                        border-radius:15px;
                        border-color: #D3D3D3;
                        background-color: #f5f5f5;
                        transition: all 0.3s ease;
                    `
                },
                inputOptions: {
                    Eletrônico: dataTypeE,
                    Móveis: dataTypeM,
                    Diversos: dataElse,
                    otherChoice: 'Adicionar objeto'
                    
                },
                preConfirm: async () => {
                    if (Swal.getInput().value == 'otherChoice') {

                        reControleSwal.fire({
                            title: 'Criar objeto',
                            html: `
                                <div class="swal2-html-container" id="name-div">
                                    <label for="obj-name" class="swal2-html-text">Identificação do objeto</label>
                                    <input 
                                        type="text" 
                                        class="swal2-input" 
                                        id="obj-name" 
                                        style="
                                            width: 55vw;
                                            border-radius:15px;
                                            border-color: #D3D3D3;
                                            background-color: #f5f5f5;
                                        "
                                    required> 
                                </div>
                                <div class="swal2-html-container">
                                    <label for="desc" class="swal2-html-text">Descrição do objeto</label>
                                    <input 
                                        type="text" 
                                        class="swal2-input" 
                                        id="desc" 
                                        style="
                                            width: 55vw;
                                            border-radius:15px;
                                            border-color: #D3D3D3;
                                            background-color: #f5f5f5;
                                        "
                                    required> 
                                </div>
                                <div id="sel-container-class" class="swal2-html-container">
                                    <label 
                                        class="swa2-input-label" 
                                        for="obj-class" 
                                        style="color:black;"
                                    >Selecione uma das classes abaixo para o objeto<label><br>
                                    <select 
                                        class="swal2-select" 
                                        id="obj-class" 
                                        style="
                                            width: 55vw; 
                                            height: 8vh; 
                                            border-radius: 15px; 
                                            border-color: #D3D3D3;
                                            transition: all 0.3s ease;
                                            background-color: #f5f5f5;
                                        "   
                                    >            
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
                                <div id="sel-container-type" class="swal2-html-container">
                                    <label 
                                        class="swa2-input-label" 
                                        for="obj-type" 
                                        style="color:black;"
                                    >Selecione um tipo abaixo para o objeto<label><br>
                                    <select 
                                        class="swal2-select" 
                                        id="obj-type" 
                                        style="
                                            width: 55vw; 
                                            height: 8vh; 
                                            border-radius: 15px; 
                                            border-color: #D3D3D3;
                                            transition: all 0.3s ease;
                                            background-color: #f5f5f5;
                                        "   
                                    >                                    
                                    </select>
                                    <br><br><label class="swal2-html-text" style="color: gray;"> ou </label><br><br>
                                    <label 
                                        class="swa2-input-label" 
                                        for="text-type-option" 
                                        style="color:black;"
                                    >Crie um tipo<label><br>
                                    <input 
                                        type="text" 
                                        class="swal2-input" 
                                        id="text-type-option" 
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
                                    <label for="lab" class="swal2-html-text">Selectione um laboratório</label>
                                    <select 
                                        class="swal2-select" 
                                        id="lab" 
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
                            `,
                            preConfirm: async () => {
                                var objClass = document.getElementById('obj-class').selectedIndex !== 0 || document.getElementById('text-class-option').value ? localStorage.getItem('class'): '' ;
                                var objType = document.getElementById('obj-type').selectedIndex !== 0 || document.getElementById('text-type-option').value ? localStorage.getItem('type') : '';
                                writeObjectData(
                                    document.getElementById('obj-name').value,
                                    new Date().toISOString().split('T')[0],
                                    new Date().toTimeString().slice(0, 5),
                                    document.getElementById('desc').value,
                                    objClass,
                                    objType,
                                    `${document.getElementById('obj-name').value}-${document.getElementById('lab').value}`,
                                    document.getElementById('lab').value
                                ).then(() => {successToastSwal.fire()});
                            }
                        });

                        document.getElementById('lab').innerHTML = labData;
                        const otherClassChoice = document.getElementById('obj-class');
                        const createdClassChoice = document.getElementById('text-class-option');
                        const otherTypeChoice = document.getElementById('obj-type');
                        const createdTypeChoice = document.getElementById('text-type-option');

                        if (otherClassChoice) {
                            otherClassChoice.addEventListener('change', (event) => {
                                localStorage.setItem('class', event.target.value);
                                if (event.target.value != 'none') createdClassChoice.value = "";
                            })
                        }
                        if (createdClassChoice) {
                            createdClassChoice.addEventListener('input', (newClass) => {
                                if (localStorage.getItem('class') != 'none') otherClassChoice.selectedIndex = 0;
                                localStorage.setItem('class', newClass.target.value);
                            })
                        }
                        if (otherTypeChoice) {
                            otherTypeChoice.addEventListener('change', (event) => {
                                localStorage.setItem('type', event.target.value);
                                if (event.target.value != 'none') createdTypeChoice.value = "";
                            })
                        }
                        if (createdTypeChoice) {
                            createdTypeChoice.addEventListener('input', (newType) => {
                                if (localStorage.getItem('type') != 'none') otherTypeChoice.selectedIndex = 0;
                                localStorage.setItem('type', newType.target.value);
                            })
                        }
                        if (verifyObject()){
                            readObjects(null, 'general').then(object => {
                                for (const Id in object) {
                                    if (object[Id].obj_class != localStorage.getItem('old-class')) {
                                        objClassData += `<option value="${object[Id].obj_class}">${object[Id].obj_class}</option>`
                                        localStorage.setItem('old-class', object[Id].obj_class)
                                    }
                                    if (object[Id].obj_type != localStorage.getItem('old-type')) {
                                        objTypeData += `<option value="${object[Id].obj_type}" >${object[Id].obj_type}</option>`
                                        localStorage.setItem('old-type', object[Id].obj_type)
                                    }
                                }       
                                localStorage.removeItem('old-class');
                                localStorage.removeItem('old-type') ;
                                document.getElementById('obj-class').innerHTML = objClassData;
                                document.getElementById('obj-type').innerHTML = objTypeData; 
                            })
                        }
                    }
                    else
                    {
                        inputValue = Swal.getInput().value.slice(0, -2);
                        if (verifyObject()){
                            searchFor(inputValue, 'obj-content').then(response => {
                                if (response != undefined) {
                                    for (const Id in objResp) {
                                        if (objResp[Id].obj_type != localStorage.getItem('old-type')) {
                                            if (response.obj_class == objResp[Id].obj_class) {
                                                
                                                    objUsualType += `<option value="${objResp[Id].obj_type}" >${objResp[Id].obj_type}</option>`;
                                                
                                                
                                            }
                                            localStorage.setItem('old-type', objResp[Id].obj_type);
                                        }
                                    }      
                                } 
                                else
                                {
                                    objUsualType = '<option>Sem itens para exibir.<option>';        
                                    response = {
                                        desc: ""
                                    }        
                                }
                                localStorage.removeItem('old-class');
                                localStorage.removeItem('old-type') ;

                                reControleSwal.fire({
                                    title: 'Criar objeto',
                                    html: `
                                            <div id="sel-container-type" class="swal2-html-container">
                                                <label 
                                                    class="swa2-input-label" 
                                                    for="obj-type" 
                                                    style="color:black;"
                                                >Selecione um tipo abaixo para o objeto<label><br>
                                                <select 
                                                    class="swal2-select" 
                                                    id="obj-type" 
                                                    style="
                                                        width: 55vw; 
                                                        height: 8vh; 
                                                        border-radius: 15px; 
                                                        border-color: #D3D3D3;
                                                        transition: all 0.3s ease;
                                                        background-color: #f5f5f5;
                                                    "   
                                                >  
                                                    ${objUsualType}                                  
                                                </select>
                                                <br><br><label class="swal2-html-text" style="color: gray;"> ou </label><br><br>
                                                <label 
                                                    class="swa2-input-label" 
                                                    for="text-type-option" 
                                                    style="color:black;"
                                                >Crie um tipo<label><br>
                                                <input 
                                                    type="text" 
                                                    class="swal2-input" 
                                                    id="text-type-option" 
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
                                                <label for="lab" class="swal2-html-text">Selectione um laboratório</label>
                                                <select 
                                                    class="swal2-select" 
                                                    id="lab" 
                                                    style="
                                                        width: 55vw; 
                                                        height: 8vh; 
                                                        border-radius: 15px; 
                                                        border-color: #D3D3D3;
                                                        transition: all 0.3s ease;
                                                        background-color: #f5f5f5;
                                                        "   
                                                >${labData}</select>
                                            </div>
                                            <div class="swal2-html-container">
                                                <label for="desc" class="swal2-html-text">Digite a descrição do objeto</label>
                                                <input
                                                    class="swal2-input" 
                                                    id="desc" 
                                                    style="
                                                        width: 55vw; 
                                                        height: 8vh; 
                                                        border-radius: 15px; 
                                                        border-color: #D3D3D3;
                                                        transition: all 0.3s ease;
                                                        background-color: #f5f5f5;
                                                        "   
                                                    value="${response.desc}"
                                                    placeholder="${response.desc}"
                                                >
                                            </div>
                                    `,
                                    preConfirm: async () => {
                                        var i = 1;  
                                        for (const Id in objResp) {
                                            const name = `${objResp[Id].name}`;
                                            if (name.startsWith(inputValue) && document.getElementById('lab').value == objResp[Id].lab_id) {i++}
                                        }
                                        objName = `${inputValue} ${i}`;
                                        writeObjectData(
                                            objName,
                                            new Date().toISOString().split('T')[0],
                                            new Date().toTimeString().slice(0, 5),
                                            document.getElementById('desc').value,
                                            response.obj_class,
                                            localStorage.getItem('type'),
                                            `${objName}-${document.getElementById('lab').value}`,
                                            document.getElementById('lab').value
                                        ).then(() => {successToastSwal.fire()});
                                    }
                                });
                                const otherTypeChoice = document.getElementById('obj-type');
                                const createdTypeChoice = document.getElementById('text-type-option');

                                if (otherTypeChoice) {
                                    otherTypeChoice.addEventListener('change', (event) => {
                                        localStorage.setItem('type', event.target.value);
                                        if (event.target.value != 'none') createdTypeChoice.value = "";
                                    })
                                }
                                if (createdTypeChoice) {
                                    createdTypeChoice.addEventListener('input', (newType) => {
                                        if (localStorage.getItem('type') != 'none') otherTypeChoice.selectedIndex = 0;
                                        localStorage.setItem('type', newType.target.value);
                                    })
                                }
                            })
                        }
                    }
                }
            })
        })
    })
}

async function updateObjectSwal(
    objectId
) {
    readObjects(null, 'general').then(resp => {
        var typeData = '<option value="none"></option>';
        for (const Id in resp) {
            if (localStorage.getItem('old-value') != resp[Id].obj_type)
                typeData += `<option value="${resp[Id].obj_type}">${resp[Id].obj_type}</option>`;
                localStorage.setItem('old-value', resp[Id].obj_type)
        }
        localStorage.removeItem('old-value')
        readLaboratories(null, 'count').then(labs => {
            reControleSwal.fire({
                title: 'Editar objeto',
                html: `
                    <div class="swal2-html-container" id="name-div">
                        <label for="desc" class="swal2-html-text">Descrição do objeto</label>
                        <input 
                            type="text" 
                            class="swal2-input" 
                            id="desc" 
                            style="
                                width: 55vw;
                                border-radius:15px;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            "
                            value="${resp[objectId].desc}"
                        required>
                    </div>
                    <div class="swal2-html-container" id="name-div">
                        <label 
                            class="swa2-input-label" 
                            for="labs-swal" 
                            style="color:black;"
                        >Selectione o laboratório</label><br><br>
                        <select 
                            type="text" 
                            class="swal2-select" 
                            id="labs-swal" 
                            style="
                                width: 55vw; 
                                height: 8vh; 
                                border-radius: 15px; 
                                border-color: #D3D3D3;
                                transition: all 0.3s ease;
                                background-color: #f5f5f5;
                            "
                        required>
                            ${labs}
                        </select> 
                    </div>
                    <div id="sel-container-type" class="swal2-html-container">
                        <label 
                            class="swa2-input-label" 
                            for="obj-type" 
                            style="color:black;"
                        >Selecione um tipo abaixo para o objeto<label><br>
                        <select 
                            class="swal2-select" 
                            id="obj-type" 
                            style="
                                width: 55vw; 
                                height: 8vh; 
                                border-radius: 15px; 
                                border-color: #D3D3D3;
                                transition: all 0.3s ease;
                                background-color: #f5f5f5;
                            "   
                        >    
                            ${typeData}                                
                        </select>
                        <br><br><label class="swal2-html-text" style="color: gray;"> ou </label><br><br>
                        <label 
                            class="swa2-input-label" 
                            for="text-type-option" 
                            style="color:black;"
                        >Crie um tipo<label><br>
                        <input 
                            type="text" 
                            class="swal2-input" 
                            id="text-type-option" 
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
                `,
                preConfirm: async () => {
                    var objType = document.getElementById('obj-type').selectedIndex !== 0 || document.getElementById('text-type-option').value ? localStorage.getItem('type') : '';
                    writeObjectData(
                        resp[objectId].name,
                        resp[objectId].delivered_date.del_day,
                        resp[objectId].delivered_date.del_time,
                        document.getElementById('desc').value,
                        resp[objectId].obj_class,
                        objType,
                        objectId,
                        document.getElementById('labs-swal').value
                    ).then(() => {successToastSwal.fire()});
                }
            });
            const otherTypeChoice = document.getElementById('obj-type');
            const createdTypeChoice = document.getElementById('text-type-option');

            document.getElementById('labs-swal').selectedIndex = Array.from(document.getElementById('labs-swal').options).findIndex(option => option.value === resp[objectId].lab_id);
            otherTypeChoice.selectedIndex = Array.from(otherTypeChoice.options).findIndex(option => option.value === resp[objectId].obj_type);

            if (otherTypeChoice) {
                otherTypeChoice.addEventListener('change', (event) => {
                    localStorage.setItem('type', event.target.value);
                    if (event.target.value != 'none') createdTypeChoice.value = "";
                })
            }
            if (createdTypeChoice) {
                createdTypeChoice.addEventListener('input', (newType) => {
                    if (localStorage.getItem('type') != 'none') otherTypeChoice.selectedIndex = 0;
                    localStorage.setItem('type', newType.target.value);
                })
            }
        })
        
    })
}

export async function swalFireLookForObject (
    objectId
) {
    readObjects(objectId, 'general').then(resp => {
        reControleSwal.fire({
            title: resp.name,
            html: `
                <div class="swal2-html-container">
                    <label for="desc" class="swal2-html-text" style="font-weight:bold;">Descrição</label><br><br>
                    <center>
                        <p 
                            id="desc"
                            class="swal2-input" 
                            style="
                                border:1px solid black;
                                border-radius:15px;
                                width:55vw;
                                height: 20vh;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            "
                        >${resp.desc}</p>
                    </center>
                </div>
                <div class="swal2-html-container">
                    <label for="lab" class="swal2-html-text" style="font-weight:bold;">Laboratório</label><br><br>
                    <center>
                        <p 
                            id="lab"
                            class="swal2-input" 
                            style="
                                border:1px solid black;
                                border-radius:15px;
                                width:55vw;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            "
                        >${resp.lab_id}</p>
                    </center>
                </div>
                <div class="swal2-html-container">
                    <label for="class" class="swal2-html-text" style="font-weight:bold;">Classe do objeto</label><br><br>
                    <center>
                        <p 
                            id="class"
                            class="swal2-input" 
                            style="
                                border:1px solid black;
                                border-radius:15px;
                                width:55vw;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            "
                        >${resp.obj_class}</p>
                    </center>
                </div>
                <div class="swal2-html-container">
                    <label for="type" class="swal2-html-text" style="font-weight:bold;">Tipo do objeto</label><br><br>
                    <center>
                        <p 
                            id="type"
                            class="swal2-input" 
                            style="
                                border:1px solid black;
                                border-radius:15px;
                                width:55vw;
                                border-color: #D3D3D3;
                                background-color: #f5f5f5;
                            "
                        >${resp.obj_type}</p>
                    </center>
                </div>
            `,
            confirmButtonText: 'Alterar',
            cancelButtonText: 'Ok',
            preConfirm: async () => {
                updateObjectSwal(objectId)
            }
        })
    })
}

export async function searchFor (
    content,
    tag
) {
    const dbRef = ref(getDatabase());
    const referenceObj = await get(child(dbRef, 'object'));
    const objectRef = referenceObj.val();
    
    switch (tag) {

        case 'lab':
            const referenceLab = await get(child(dbRef, 'laboratory'));
            const labRef = referenceLab.val();
            const labURLDesc = {};

            if (referenceLab.exists()) {
                for(const labID in labRef) {
                    if ((labID.startsWith(content) || labID.endsWith(content))) { 
                        labURLDesc[labID] = [labRef[labID].content.lab_img_url, labRef[labID].content.desc]

                        const laboratory = document.createElement('div')
                        laboratory.className = 'lab-card s-card'
                        laboratory.id = labID

                        const labIDElement = document.createElement('p')
                        labIDElement.innerHTML = `<strong>${labID}</strong><br><br>`
                                
                        const seeMoreElement = document.createElement('a')
                        seeMoreElement.id = labID
                        seeMoreElement.innerHTML = `Ver mais`
                        seeMoreElement.style = 'cursor: pointer;color: #0074CC;text-decoration: underline;'
                        seeMoreElement.className = 'manage-l';

                        if (document.getElementById('response')) {
                            document.getElementById('response').innerHTML = ''
                        }
                        laboratory.appendChild(labIDElement)
                        laboratory.appendChild(seeMoreElement)
                        if (!document.getElementById(`${labID}`)) {
                            document.getElementById('main').appendChild(laboratory)
                        }
                    }
                }
            }
        ;
        break;

        case 'obj': 
            if (referenceObj.exists()) {
                const globalObject = document.createElement('div')
                globalObject.id = 'objs'
                
                const eletronics = document.createElement('div')
                eletronics.id = 'eletronics'
                        
                const furniture = document.createElement('div')
                furniture.id = 'furniture'
                        
                const other = document.createElement('div')
                other.id = 'other'

                for(const Id in objectRef) {
                    if ((objectRef[Id].name.startsWith(content) || objectRef[Id].name.endsWith(content))) { 

                        const object = document.createElement('div')
                        object.className = 'object-card s-card'
                        readReports(null, 'data').then(resp => {
                            for (const ID in resp) {
                                if (resp[ID].selected_obj.sel_obj_id == Id) {
                                    switch (resp[ID].content.status) {
                                        case 'red': object.className = 'object-card s-card red'
                                        break;

                                        case 'yellow': object.className = 'object-card s-card yellow'
                                        break;
                                    }
                                }
                            }
                        });
                        object.id = Id
            
                        const link = document.createElement('a')
                        link.id = Id
                        link.innerHTML = `Ver mais`
                        link.style = 'cursor: pointer; color: #0074CC;text-decoration: underline;'
                        link.className = 'manage-o'

                        const objIDElement = document.createElement('p')
                        objIDElement.innerHTML = `<strong>${objectRef[Id].name}</strong><br> <p style="margin: 15px;"> ${objectRef[Id].desc} <br><br> ${objectRef[Id].lab_id} </p>`

                        object.appendChild(objIDElement)
                        object.appendChild(link)
                        if (!document.getElementById(`${Id}`)) {
                            if (objectRef[Id].obj_class == 'Eletrônico') {
                                if (eletronics.textContent == '') {
                                    eletronics.innerHTML = '<h2><br>Eletrônicos</h2>'
                                }
                                eletronics.appendChild(object)
                            }
                            else if (objectRef[Id].obj_class == 'Móvel') {
                                if (furniture.textContent == '') {
                                    furniture.innerHTML = '<h2><br>Móveis</h2>'
                                }
                                furniture.appendChild(object)
                            }
                            else {
                                if (other.textContent == '') {
                                    other.innerHTML = '<h2><br>Diversos</h2>'
                                }
                                other.appendChild(object)
                            }
                            
                        }
                    }
                }
                globalObject.appendChild(eletronics)
                globalObject.appendChild(furniture)
                globalObject.appendChild(other)
                document.getElementById('main').appendChild(globalObject)
                
            }
        ;
        break;

        case 'obj-content':
            if (!referenceObj.exists()) return;
            for (const Id in objectRef) {
                if (Id.startsWith(content)){
                    return objectRef[Id];
                }
            }
        ;
        break;
        
        case 'user':
            onValue(ref(getDatabase(), 'user'), (usersData) => {  
                const resp = usersData.val();
                const userUl = document.createElement('ul')
                userUl.className = 'manage-list'
                for (const userID in resp) {
                    const userName = `${resp[userID].user_name}`
                    if (userName.startsWith(content)) {

                        const user = document.createElement('li')
                        user.id = userID
                        user.className = 'manage-u'

                        const userName = document.createElement('span')
                        userName.textContent = `Nome: ${resp[userID].user_name}`
                        userName.id = `${resp[userID].user_name}`
                        userName.className = 'account-name'

                        const userEmail = document.createElement('span')
                        userEmail.textContent = `E-mail: ${resp[userID].user_email}`
                        userEmail.id = `${resp[userID].user_email}`
                        userEmail.className = 'account-value'


                        user.appendChild(userName)
                        user.appendChild(userEmail)
                        userUl.appendChild(user)
                    }
                }
                document.getElementById('main').appendChild(userUl)
            })
        ;
        break;

        case 'report': 
            const reference = await get(child(dbRef, 'reports'));
            const reportRef = reference.val();
            const reportContents = {};
            if (reference.exists()) {
                
                for(const repID in reportRef){
                    if (repID.startsWith(content)) {
                        const report = document.createElement('div')
                        report.className = 'chamado-card s-card'
                        report.id = repID
                
                        const link = document.createElement('a')
                        link.id = repID
                        link.innerHTML = `Ver mais`
                        link.style = 'cursor: pointer;'
                        link.className = 'manage-r'
                            
                        switch (reportRef[repID].content.status) {
                            case 'red': 
                                report.style = 'border-color: red; border: 2px solid red;'
                            break;
                    
                            case 'yellow': 
                                report.style = 'border-color: yellow; border: 2px solid yellow;'
                            break;
                    
                            case 'green': 
                                report.style = 'border-color: green; border: 2px solid green;'
                            break;
                        }
                            
                        const userElement = document.createElement('p')
                        userElement.style = 'background-color: #D3D3D3; border-radius: 15px;'
                        readUsers(reportRef[repID].content.autor, 'user-name').then(resp => userElement.textContent = resp )
                       
                        if (reportRef[repID].dates) {
                            if (reportRef[repID].content?.title) {
                                reportContents[repID] = reportRef[repID].content?.title
                            }
                            else
                            {
                                reportContents[repID] = 'Sem Título para exibir'
                            }
                
                            const repIDElement = document.createElement('p')
                            repIDElement.innerHTML = `<strong>${repID}</strong><br> ${reportContents[repID]}`
                                
                            if (document.getElementById('response')) {
                                document.getElementById('response').innerHTML = ''
                            }
                            report.appendChild(repIDElement)
                            report.appendChild(link)
                            document.getElementById('main').appendChild(report)
                                            
                        }
                        else
                        {
                            if (reportRef[repID].content?.text) {
                                reportContents[repID] = reportRef[repID].content?.text
                            }
                            else
                            {
                                reportContents[repID] = 'Sem Título para exibir'
                            }
                
                            const repIDElement = document.createElement('p')
                            repIDElement.innerHTML = `<strong>${repID}</strong><br> ${reportContents[repID]}`
                
                            if (document.getElementById('response')) {
                                document.getElementById('response').innerHTML = ''
                            }
                            report.appendChild(repIDElement)
                            report.appendChild(link)
                            if (!document.getElementById(`${repID}`)) {
                                document.getElementById('main').appendChild(report)
                            }
                        }
                    }
                }
            }
        ;
        break;
    }
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