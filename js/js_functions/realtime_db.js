import {
  getDatabase,
  ref,
  push,
  set,
  child,
  get,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import { errorSwalResponse } from "../js_functions/swal_fire_errors.js";

/* **IMPORTANTE**

        *
       ***
      *****
     *******
    *********
            *
            *           ==>         Real
            * 
            * 
           😮

  Pó que faz falar Real...
*/

//Cadastro ou edição de dados

// Cadastrar ou editar o usuário
export async function writeUserData(userID, rank, imageUrl, name, email) {
  set(ref(getDatabase(), `user/${userID}`), {
    rank: rank,
    user_img_url: imageUrl,
    user_name: name,
    user_email: email,
  });
}

// Cadastrar ou editar o laboratório
export async function writeLaboratoryData(
  labID,
  classificationOfLabs,
  labURL,
  labDesc,
  createDate,
  author,
  status,
  floor
) {
  set(ref(getDatabase(), `laboratory/${labID}`), {
    classif_labs: classificationOfLabs,
    content: {
      lab_img_url: labURL,
      desc: labDesc,
    },
    data: createDate,
    author: author,
    status: status,
    lab_floor: floor,
  });
}

// Cadastrar ou editar o objeto
export async function writeObjectData(
  name,
  gotDay,
  gotTime,
  description,
  objectClass,
  objectType,
  objectID,
  selectedLab
) {
  set(ref(getDatabase(), `object/${objectID}`), {
    desc: description,
    name: name,
    obj_class: objectClass,
    obj_type: objectType,
    delivered_date: {
      del_day: gotDay,
      del_time: gotTime,
    },
    lab_id: selectedLab,
  });
}

// Cadastrar ou editar a ocorrência
export function writeReportsData(
  imageUrl,
  text,
  title,
  status,
  author,
  postedDay,
  postedTime,
  solvedDate,
  selectedLaboratoryID,
  selectedObjectID,
  timestamp,
  comments
) {
  set(push(ref(getDatabase(), `reports/`)), {
    content: {
      img_url: imageUrl,
      text: text,
      title: title,
      status: status,
      autor: author,
      timestamp: timestamp,
      comments: comments
    },
    dates: {
      posted_date: {
        posted_day: postedDay,
        posted_time: postedTime,
      },
      solved_date: solvedDate,
    },
    selected_obj: {
      sel_lab_id: selectedLaboratoryID,
      sel_obj_id: selectedObjectID,
    },
  });
}

// Atualizar a ocorrência da Web
export async function updateWebReportData(
  author,
  reportID,
  newTitle,
  newText,
  newURL,
  newStatus,
  timestamp,
  comments
) {
  set(ref(getDatabase(), `reports/${reportID}/content/`), {
    autor: author,
    title: newTitle,
    text: newText,
    img_url: newURL,
    status: newStatus,
    timestamp: timestamp,
    comments: comments
  });
}

// Atualizar a ocorrência do Mobile
export async function updateMobileReportData(
  reportID,
  text,
  imageUrl,
  local,
  status,
  author,
  category,
  timestamp,
  comments
) {
  set(ref(getDatabase(), `reports/${reportID}/content/`), {
    img_url: imageUrl,
    text: text,
    local: local,
    status: status,
    autor: author,
    category: category,
    timestamp: timestamp,
    comments: comments
  });
}

//-------------------------------------------------------------------------------
// Leitura de dados

export async function readAll() {
  const dbRef = ref(getDatabase());
  const userRef = await get(child(dbRef, "user"));
  const callRef = await get(child(dbRef, "reports"));
  const labRef = await get(child(dbRef, "laboratory"));
  const objRef = await get(child(dbRef, "object"));
  return {
    users: userRef.val(),
    calls: callRef.val(),
    labs: labRef.val(),
    objs: objRef.val(),
  };
}
// Função para realizar todas as tarefas de leitura dos usuários
export async function readUsers(userID, contentType) {
  const dbRef = ref(getDatabase());
  const userRef = await get(child(dbRef, `user/${userID}`));
  if (userID) {
    switch (contentType) {
      // Trará o rank do usuário
      case "user-rank":
        try {
          if (userRef.exists()) {
            return userRef.val().rank;
          } else {
            return "Lucas Pio";
          }
        } catch (error) {
          errorSwalResponse(error);
          return null;
        }

      // Trará o nome do usuário
      case "user-name":
        try {
          if (userRef.exists()) {
            return userRef.val().user_name;
          } else {
            return "Lucas Pio";
          }
        } catch (error) {
          errorSwalResponse(error);
          return null;
        }

      // Trará tudo do usuário
      case "general":
        try {
          if (userRef.exists()) {
            return userRef.val();
          }
        } catch (error) {
          errorSwalResponse(error);
          return null;
        }

      default:
        return "Incorrect content type";
    }
  } else {
    switch (contentType) {
      //Lerá todos os usuários e os colocará num formato acessível ao acc-managment
      case "acc-manage":
        onValue(ref(getDatabase(), "user"), (usersData) => {
          const ref = usersData.val();
          document.getElementById("users-account-list").innerHTML = "";
          for (let userID in ref) {
            const userDt = ref[userID];
            const user = document.createElement("li");
            user.setAttribute('data_id', userID);
            user.className = "user-acc";
            const userName = document.createElement("span");
            userName.textContent = `Nome: ${
              userDt.user_name
            }`;
            userName.id = `${userDt.user_name}`;
            userName.className = "account-name";

            const userRank = document.createElement("span");
            userRank.textContent = `Nível de acesso: ${
              userDt.rank
            }`;
            userRank.className = "account-value";

            const userEmail = document.createElement("span");
            userEmail.textContent = `E-mail: ${
              userDt.user_email
            }`;
            userEmail.id = `${
              userDt.user_email
            }`;
            userEmail.className = "account-value";

            user.appendChild(userName);
            user.appendChild(userRank);
            user.appendChild(userEmail);
            document.getElementById("users-account-list").appendChild(user);
          }
        });
        break;

      default:
        return "Incorrect content type";
    }
  }
}

// Função para realizar todas as tarefas de leitura de occorrências
export async function readReports(reportID, contentType) {
  const dbRef = ref(getDatabase());
  const reference = await get(child(ref(getDatabase()), "reports"));
  const reportRef = reference.val();
  const reportPostedDatas = {};
  const reportContents = {};
  const reportTitles = {};
  if (reportID) {
    switch (contentType) {
      // Trará todas as informações da ocorrência
      case "general":
        try {
          const reportRef = await get(child(dbRef, `reports/${reportID}`));
          if (reportRef.exists()) {
            return reportRef.val();
          } else {
            return "Lucas Pio";
          }
        } catch (error) {
          errorSwalResponse(error);
          return "null";
        }

      // Lerá a data de postagem de um chamado
      case "data":
        try {
          const reportRef = await get(child(dbRef, `reports/${reportID}`));
          if (reportRef.exists()) {
            return reportRef.val().dates?.posted_date?.posted_day;
          } else {
            return "Lucas Pio";
          }
        } catch (error) {
          errorSwalResponse(error);
          return "null";
        }

      // Lerá o conteúdo de um chamado
      case "text-content":
        try {
          const reportRef = await get(child(dbRef, `reports/${reportID}`));
          if (reportRef.exists()) {
            return reportRef.val().content;
          } else {
            return "Lucas Pio";
          }
        } catch (error) {
          errorSwalResponse(error);
          return null;
        }

      // Lerá o ID do objeto em questão
      case "selected-object":
        try {
          const reportRef = await get(child(dbRef, `reports/${reportID}`));
          if (reportRef.exists()) {
            return reportRef.val().selected_obj.sel_obj_id;
          } else {
            return "Lucas Pio";
          }
        } catch (error) {
          errorSwalResponse(error);
          return null;
        }

      default:
        return "Incorrect content-type.";
    }
  } else {
    switch (contentType) {
      // trará todos os chamados com o conteúdo e o seu ID
      case "general":
        if (reference.exists()) {
          var iRed = 0, iYellow = 0, iGreen = 0;
          const red = document.getElementById('red');
          red.innerHTML = "";
          const yellow = document.getElementById('yellow');
          yellow.innerHTML = "";
          const green = document.getElementById('green');
          green.innerHTML = "";
          for (const repID in reportRef) {
            if (iGreen == 3 && iYellow == 3 && iRed == 3) break;
            const report = document.createElement("div");
            report.className = "chamado-card";
            report.setAttribute('data_id', repID);

            const statusAuthorDiv = document.createElement("div");
            statusAuthorDiv.style = "padding-top: 3px;";
            const statusElement = document.createElement("p");

            if (!reportRef[repID].content.deleted && !reportRef[repID].deleted) {
              // Pega o estado (red - yellow - green)
              switch (reportRef[repID].content.status) {
                case "red":
                  statusElement.innerHTML = "<center>Pendente</center>";
                  statusElement.className = 'status-pendente';
                  if (iRed == 0 ) {
                    red.innerHTML = `
                      <h2 class='h2-calls'>Pendentes</h2>
                      <!--<ul  align="right" ><a href="./laboratory.html"><svg class="link" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg></a></ul>-->
                    `;
                    iRed++;
                  }
                  break;

                case "yellow":
                  statusElement.innerHTML = "<center>Em andamento</center>";
                  statusElement.className = 'status-andamento';
                  if (iYellow == 0 ) {
                    yellow.innerHTML = `
                      <h2 class='h2-calls'>Em andamento</h2>
                      <!--<ul  align="right" ><a href="./laboratory.html"><svg class="link" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg></a></ul>-->
                    `;
                    iYellow++;
                  }
                  break;

                case "green":
                  statusElement.innerHTML = "<center>Concluído</center>";
                  statusElement.className = 'status-concluido';
                  if (iGreen == 0 ) {
                    green.innerHTML = `
                      <h2 class='h2-calls'>Concluídos</h2>
                      <!--<ul  align="right" ><a href="./laboratory.html"><svg class="link" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg></a></ul>-->
                    `;
                    iGreen++;
                  }
                  break;
              }
            }

            const userElement = document.createElement("p");
            userElement.className = 'autor';
            readUsers(reportRef[repID].content.autor, "user-name").then(
              (resp) => (userElement.innerHTML = `<center>${resp}</center>` || '<center>Autor não disponível</center>')
            );

            reportContents[repID] = reportRef[repID].content?.title || reportRef[repID].content?.text || "Sem Título para exibir";
            const repIDElement = document.createElement("p");
            repIDElement.innerHTML = `<strong>${reportContents[repID]}</strong><br> `;

            const localAndData = document.createElement("p");
            localAndData.innerHTML = `
              ${reportRef[repID].selected_obj?.sel_lab_id || reportRef[repID].content?.local}
            `;
            if (!reportRef[repID]?.deleted && !report.content?.deletedBy == true) {
              if (!reportRef[repID]?.content?.deletedBy) {
                report.appendChild(repIDElement);
                report.appendChild(localAndData);
                report.appendChild(statusElement);
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
        break;

      // trará todos os chamados com o conteúdo e o seu ID para os três primeiros
      case 'general-home':
        if (reference.exists()) {
          const dates = {};
          
          for (const repID in reportRef) {
            if (!reportRef[repID].content.deleted && !reportRef[repID].deleted) {
              dates[repID] = new Date(Number(reportRef[repID].content.timestamp))
            }
          }
          const recentes = Object.entries(dates)
          .map(([id]) => {
            const datetime = new Date(dates[id]);
            return { id, datetime };
          })
          .filter(
            (item) =>
              item && item.datetime instanceof Date && !isNaN(item.datetime)
          )
          .sort((a, b) => b.datetime - a.datetime)
          .slice(0, 3);

          recentes.forEach((item) => {
            const resp = reportRef[item.id];
            let reportContents = "";
            const report = document.createElement("div");
            report.className = "chamado-card";
            report.setAttribute("data_id", item.id); // ID só como atributo

            // imagem
            const imageElement = document.createElement("img");
            imageElement.className = "image-report";
            imageElement.style.maxHeight = "30vh";

            if (resp.content.img_url !== undefined) {
              let image = resp.content.img_url;
              if (!image) {
                image = "../../assets/default_occur.jpg";
              } else if (!image.startsWith("data:image/png;base64,")) {
                image = "data:image/png;base64, " + image;
              }
              imageElement.src = image;
            }

            // status
            const statusElement = document.createElement("p");
            switch (resp.content.status) {
              case "red":
                statusElement.innerHTML = "Pendente";
                statusElement.className = "status-pendente";
                break;
              case "yellow":
                statusElement.innerHTML = "Em andamento";
                statusElement.className = "status-andamento";
                break;
              case "green":
                statusElement.innerHTML = "Concluído";
                statusElement.className = "status-concluido";
                break;
            }

            // autor
            const userElement = document.createElement("p");
            userElement.className = "autor";
            readUsers(resp.content.autor, "user-name").then(
              (respT) => (userElement.textContent = respT)
            );

            // título
            if (resp.content?.title) {
              reportContents = resp.content?.title;
            } else if (resp.content?.text) {
              reportContents = resp.content?.text;
            } else {
              reportContents = "Sem Título para exibir";
            }

            const titleElement = document.createElement("p");
            titleElement.className = "titulo-chamado";
            titleElement.innerHTML = `<strong>${reportContents}</strong>`;

            // local e linha separadora
            const localAndData = document.createElement("p");
            localAndData.className = "local";
            localAndData.innerHTML = `
              ${resp.selected_obj?.sel_lab_id || resp.content?.local || ""}
              <p style="
                    height: 2px;
                    background: linear-gradient(to right, #ccc);
                    margin: 15px 0;
                  "></p>
            `;

            // montagem
            report.appendChild(titleElement);
            report.appendChild(localAndData);
            report.appendChild(imageElement);
            report.appendChild(statusElement);
            report.appendChild(userElement);

            document.getElementById("chamados").appendChild(report);
          });

        }
      break;

      // Trará todas as datas adjuntos aos ID dos chamados
      case "data":
        return reportRef;

      // Trará os títulos e os conteúdos adjuntos aos ID dos respectivos chamados
      case "text-content":
        if (reference.exists()) {
          for (const repID in reportRef) {
            reportPostedDatas[repID] = reportRef[repID];
            reportTitles[repID] = reportRef[repID].content?.title;
            reportContents[repID] = reportRef[repID].content?.text;
          }
        }
        return reportPostedDatas, reportTitles, reportContents;

      default:
        return "Incorrect content-type";
    }
  }
}

// Função para realizar todas as tarefas de leitura dos objetos
export async function readObjects(objectID, contentType) {
  const dbRef = ref(getDatabase());

  const reference = await get(child(dbRef, "object"));
  const objectRef = reference.val();
  const objectClasses = {};
  const objectTypes = {};

  const objectPRef = await get(child(dbRef, `object/${objectID}`));
  const ObjValue = objectPRef.val();
  if (objectID) {
    switch (contentType) {
      //Retorna tudo de um objeto
      case "general":
        return ObjValue;

      // Trará todas as propriedades do objeto selecionado
      case "property":
        try {
          if (objectPRef.exists()) {
            const objectDescription = objectPRef.val().desc;
            const ObjectGotDate = objectPRef.val().delivered_date;
            const objectName = objectPRef.val().name;
            return objectDescription, ObjectGotDate, objectName;
          }
        } catch (error) {
          errorSwalResponse(error);
          return null;
        }
        break;

      // Trará a classe e o tipo do objeto selecionado
      case "class-type":
        if (objectPRef.exists()) {
          const data = [ObjValue.obj_class, ObjValue.obj_type];
          return data;
        } else {
          return "No data avaiable";
        }

      // Trará a classe do objeto selecionado
      case "class":
        break;

      // Trará o ID do laboratório do objeto selecionado
      case "lab-id":
        return ObjValue.lab_id;

      default:
        return "Incorrect content-type.";
    }
  } else {
    switch (contentType) {
      // tudo
      case "general":
        return objectRef;

      // Trará todas as classes existentes
      case "class":
        if (reference.exists()) {
          for (const objectID in objectRef) {
            objectClasses[objectID] = objectRef[objectID].obj_class;
            return Object.entries(objectClasses);
          }
        }
        break;

      // Trará todas os tipos existentes
      case "type":
        if (reference.exists()) {
          for (const objectID in objectRef) {
            objectTypes[objectID] = objectRef[objectID].obj_type;
          }
          return objectTypes;
        }
        break;

      // Trará todas os IDs existentes
      case "id":
        if (reference.exists()) {
          for (const ID in objectRef) {
            objectTypes[ID] = ID;
          }
          return Object.values(objectTypes);
        }
        break;

      // Fará a lista no "gerenciar BD"
      case "content":
        if (reference.exists()) {
          document.getElementById("other").innerHTML = "";
          document.getElementById("eletronics").innerHTML = "";
          document.getElementById("furniture").innerHTML = "";
          for (const ID in objectRef) {
            const object = document.createElement("div");
            object.className = "object-card";
            readReports(null, "data").then((resp) => {
              for (const Id in resp) {
                if (resp[Id].selected_obj.sel_obj_id == ID) {
                  switch (resp[Id].content.status) {
                    case "red":
                      object.className = "object-card red";
                      break;

                    case "yellow":
                      object.className = "object-card yellow";
                      break;
                  }
                }
              }
            });
            object.id = ID;

            const link = document.createElement("a");
            link.id = ID;
            link.innerHTML = `Ver mais`;
            link.style = "cursor: pointer;";

            const objIDElement = document.createElement("p");
            objIDElement.innerHTML = `<strong>${objectRef[ID].name}</strong><br> <p style="margin: 15px;"> ${objectRef[ID].desc} <br><br> ${objectRef[ID].lab_id} </p>`;

            object.appendChild(objIDElement);
            object.appendChild(link);
            if (objectRef[ID].obj_class == "Eletrônico") {
              document.getElementById("eletronics").appendChild(object);
              document.getElementById("remove-h2-1").textContent =
                "Eletrônicos";
            } else if (objectRef[ID].obj_class == "Móvel") {
              document.getElementById("furniture").appendChild(object);
              document.getElementById("remove-h2-2").textContent = "Móveis";
            } else {
              document.getElementById("other").appendChild(object);
              document.getElementById("remove-h2-3").textContent = "Diversos";
            }
          }
        }
        break;

      default:
        return "Incorrect content-type.";
    }
  }
}

// Função para realizar todas as tarefas de leitura dos laboratórios
export async function readLaboratories(labID, contentType) {
  const dbRef = ref(getDatabase());
  const reference = await get(child(dbRef, "laboratory"));
  const labRef = reference.val();
  const labClasses = {};
  const labURLDesc = {};
  const laboratoryRef = await get(
    child(ref(getDatabase()), `laboratory/${labID}`)
  );
  if (labID) {
    switch (contentType) {
      case "general":
        try {
          if (laboratoryRef.exists()) {
            const laboratoryProperty = laboratoryRef.val();
            return laboratoryProperty;
          }
        } catch (error) {
          errorSwalResponse(error);
          return null;
        }
        break;

      case "class":
        break;

      default:
        return "Incorrect content-type.";
    }
  } else {
    switch (contentType) {
      case "general":
        if (reference.exists()) {
          return labRef;
        }
        break;

      case "content":
        if (reference.exists()) {
          document.getElementById("labs").innerHTML = "";
          for (const labID in labRef) {
            const labURLDesc = [
              labRef[labID].content.lab_img_url,
              labRef[labID].content.desc,
            ];

            const laboratory = document.createElement("div");
            laboratory.className = "lab-card";
            laboratory.id = labID;

            //ID
            const labIDElement = document.createElement("p");
            labIDElement.innerHTML = `<strong>${labID}</strong><br><br>`;

            //Elemento de visualização da sala em questão
            const seeMoreElement = document.createElement("a");
            seeMoreElement.id = labID;
            seeMoreElement.innerHTML = `Ver mais`;
            seeMoreElement.style = "cursor: pointer;";

            //Imagem do laboratório
            const img = document.createElement("p");
            img.innerHTML = `<img src="${labURLDesc[0]}" style="width: 50vw; height: 30vh;"><br>`;
            if (!labURLDesc[0]) {
              img.innerHTML = `<img src="../assets/default_classroom.avif" style="width: 50vw; height: 30vh;"><br>`;
            }

            //Descrição
            const desc = document.createElement("p");
            desc.innerHTML = `<strong>${labURLDesc[1]}</strong>`;

            //Verificação da existência de ocorrências relacionadas ao laboratório referente.
            readReports(null, "data").then((resp) => {
              var int1 = 0,
                int2 = 0;
              for (const ID in resp) {
                if (!resp[ID]?.content.deleted && !resp[ID]?.deleted) {
                  if (resp[ID].selected_obj?.sel_lab_id == labID) {
                    if (resp[ID].content.status == "red") {
                      int1++;
                    } else if (resp[ID].content.status == "yellow") {
                      int2++;
                    }
                  }
                }
              }

              if (int1 != 0 || int2 != 0) {
                const transition = document.createElement("p");
                transition.innerHTML = `
                  <p style="
                      height: 2px;
                      background: linear-gradient(to right, #ccc);
                      margin: 15px 0;
                    "></p>
                `;
                const pendingProgressElement = document.createElement("div");
                const text = document.createElement("b");
                text.innerHTML = "Ocorrências<br><br>";
                const pendingElement = document.createElement("label");
                pendingElement.className = "pending";
                const progressElement = document.createElement("label");
                progressElement.className = "progress";

                progressElement.textContent = `Em andamento: ${int2}`;
                pendingElement.textContent = `Pendente: ${int1}`;

                const labOccurences = document.createElement('ul');
                labOccurences.id = labID;
                labOccurences.style.cursor = 'pointer';

                labOccurences.appendChild(pendingElement);
                labOccurences.appendChild(progressElement);
                
                labOccurences.innerHTML += `<br><br>
                  Ver os chamados relacionados
                `;

                pendingProgressElement.appendChild(labOccurences);
                laboratory.appendChild(transition);
                laboratory.appendChild(text);
                laboratory.appendChild(pendingProgressElement);
              }
            });
            laboratory.appendChild(labIDElement);
            laboratory.appendChild(img);
            laboratory.appendChild(seeMoreElement);
            laboratory.appendChild(desc);

            document.getElementById("labs").appendChild(laboratory);
          }
        }
        break;

      case "class":
        if (reference.exists()) {
          localStorage.setItem("old-lab", "0");
          for (const labID in labRef) {
            if (localStorage.getItem("old-lab") != labRef[labID].classif_labs) {
              labClasses[labID] = labRef[labID].classif_labs;
              localStorage.setItem("old-lab", labClasses[labID]);
            }
          }
          return labClasses;
        }
        break;

      case "count":
        var labData = '<option value="none"></option>';
        for (const Id in labRef) {
          labData += `<option value="${Id}">${Id}</option>`;
        }
        return labData;

      default:
        return "Incorrect content-type.";
    }
  }
}

// Função para vireficar a existência de qualquer objeto que seja.
export function verifyObject(objectId) {
  const dbRef = ref(getDatabase());
  const objectPRef = (dbRef, `object/${objectId}`);
  if (objectPRef) {
    return true;
  } else {
    return false;
  }
}

// Função que faz a contagem para o gráfico da página principal - cbm : count by month
export async function countReportsByMonth() {
  const repBMRef = await get(child(ref(getDatabase()), "reports"));
  const cbmWeb = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0
  };
  const cbmInProgress = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0
  };
  const cbmConcluded = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0
  };
  var allByYear = 0;

  if (repBMRef.exists()) {
    for (const repID in repBMRef.val()) {
      const report = repBMRef.val()[repID];
      const data = report?.content.timestamp;
      var month;
      
      if (data) { 
        month = new Date(Number(data)).getMonth() + 1;
        
        if (!report?.deleted && !report.content?.deleted){
          if (report.content.status == "red") {
            cbmWeb[month] = (cbmWeb[month] || 0) + 1;
          } 
          
          if (report.content.status == "yellow") {
            cbmInProgress[month] = (cbmInProgress[month] || 0) + 1;
          } 
        }
        if (report.content.status == "green") {
          cbmConcluded[month] = (cbmConcluded[month] || 0) + 1;
        }
        allByYear++;
      }
    }
  }
  return [cbmWeb, cbmInProgress, cbmConcluded, allByYear];
}

export async function conutReportsByLab() {
  const labs = await get(child(ref(getDatabase()), "laboratory"));
  const reps = await get(child(ref(getDatabase()), "reports"));
  const repsByMonth = {
    1:  {q: 0, id: []},
    2:  {q: 0, id: []},
    3:  {q: 0, id: []},
    4:  {q: 0, id: []},
    5:  {q: 0, id: []},
    6:  {q: 0, id: []},
    7:  {q: 0, id: []},
    8:  {q: 0, id: []},
    9:  {q: 0, id: []},
    10: {q: 0, id: []},
    11: {q: 0, id: []},
    12: {q: 0, id: []},
  };
  const counts = {};
  
  for (const rId in reps.val()) {
    const rep = reps.val()[rId];
    const data = rep.content.timestamp;
    var month = `${data}`;
      
    if (data) { 
      if (!month.includes('-') ) {
        month = new Date(data).getMonth() + 1
      } else {
        month = data.substring(5, 7)
      }

      if (rep.content.status != 'green') {
        repsByMonth[month].q = (repsByMonth[month].q || 0) + 1;
        (repsByMonth[month].id).push(rep.selected_obj?.sel_lab_id || rep.content.local)
      }    
    }
  }
  for (const lId in labs.val()) {
    const lab = labs.val()[lId];
    counts[lId] = {
      1:  0,
      2:  0,
      3:  0,
      4:  0,
      5:  0,
      6:  0,
      7:  0,
      8:  0,
      9:  0,
      10: 0,
      11: 0,
      12: 0
    }    
  }
  for (const id in repsByMonth) {
    const ids = repsByMonth[id].id
    if (ids.length > 0) {
      for (const rId in ids) {   
        counts[ids[rId]][id]++
      }
    }
  }
  return counts

}

export async function setExcludingWeb(
  Id,
  author,
  date
) {
  set(ref(getDatabase(), `reports/${Id}/deleted/`), {
      deletedBy: author,
      deletedAt: date
  });
}

export async function setExcludingMobile(
  Id,
  author,
  date
) {
  readReports(Id, 'general').then(resp => {
    set(ref(getDatabase(), `reports/${Id}/content/`), {
      img_url: resp.content.img_url,
      text: resp.content.text,
      local: resp.content.local,
      status: resp.content.status,
      autor: resp.content.autor,
      category: resp.content.category,
      timestamp: resp.content.timestamp,
      deleted: true,
      deletedBy: author,
      deletedAt: date
    });
  })
}

export async function setConcluded (
  Id,
  date
) {
  set(ref(getDatabase(), `reports/${Id}/dates/`), {
    solved_date: date
  });
}

export async function excludeReports() {
  const reportRef = ref(getDatabase(), 'reports');
  get(reportRef).then(report => {
    if (report.exists()) {
      const updates = {};
      report.forEach(child => {
        const data = child.val();
        if (data?.deleted) {
          if (new Date(data.deleted?.deletedAt) <= new Date()) {
            updates[child.key] = null
          }
        } else if (data.content?.deleted) {
          if (new Date(data.content?.deletedAt) <= new Date()) {
            updates[child.key] = null
          }
        }
      });

      if (Object.keys(updates).length > 0) {
        update(reportRef, updates)
      }
    }
  })
}