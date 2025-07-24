import { getDatabase, ref, set, child, get, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import {errorSwalResponse} from '../js_functions/swal_fire_errors.js';

//Cadastro ou edição de dados

// Cadastrar ou editar o usuário
export async function writeUserData(
  userID, 
  rank, 
  imageUrl,
  name,
  email
) {
  set(ref(getDatabase(), `user/${userID}`), {
    rank: rank,
    user_img_url: imageUrl,
    user_name: name,
    user_email: email
  })
}

// Cadastrar ou editar o laboratório
export async function writeLaboratoryData (
  labID,
  basisObjectClassesArray,
  classificationOfLabs,
  labURL,
  labDesc,
  createDate,
  author,
  status,
  floor
) {
  set(ref(getDatabase(), `laboratory/${labID}`), {
    basis_obj: {
      b_obj_classes_array: basisObjectClassesArray,
    },
    classif_labs: classificationOfLabs,
    lab_Content: {
      lab_img_url: labURL,
      desc: labDesc
    },
    data: createDate,
    author: author,
    status: status,
    lab_floor: floor
  })
}

// Cadastrar ou editar o objeto
export function writeObjectData (
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
      del_time: gotTime
    },
    lab_id: selectedLab
  })
}

// Cadastrar ou editar a ocorrência
export function writeReportsData (
  imageUrl,
  text,
  title,
  status,
  author,
  postedDay,
  postedTime,
  solvedDay,
  solvedTime,
  reportID,
  selectedLaboratoryID,
  selectedObjectID,
) {
  set(ref(getDatabase(), `reports/${reportID}`), {
    content: {
      img_url: imageUrl,
      text: text,
      title: title,
      status: status,
      autor: author
    },
    dates: {
      posted_date: {
        posted_day: postedDay,
        posted_time: postedTime
      },
      solved_date: {
        solved_day: solvedDay,
        solved_time: solvedTime
      }
    },
    selected_obj: {
      sel_lab_id: selectedLaboratoryID,
      sel_obj_id: selectedObjectID
    }
  })
}

// Atualizar a ocorrência
export async function updateReportData (
  author,
  reportID,
  newTitle,
  newText,
  newURL,
  newStatus
) {
  set(ref(getDatabase(), `reports/${reportID}/content/`), {
    autor: author,
    title: newTitle,
    text: newText,
    img_url: newURL,
    status: newStatus
  })
}

//-------------------------------------------------------------------------------
// Leitura de dados

// Função para realizar todas as tarefas de leitura dos usuários
export async function readUsers (
  userID,
  contentType,
  contentName
) {
  const dbRef = ref(getDatabase());
  const userRef = await get(child(dbRef, `user/${userID}`));
  if (userID) {
    switch (contentType) {

      // Trará o rank do usuário
      case 'user-rank':
        try {
          if (userRef.exists()) {
            return userRef.val().rank
          } else {
            return "No data available"
          }
        } catch (error) {
          errorSwalResponse(error)
          return null
        };
      
      // Trará o nome do usuário
      case 'user-name': 
        try {
          if (userRef.exists()) {
            return userRef.val().user_name
          } else {
            return "No data available"
          }
        } catch (error) {
          errorSwalResponse(error)
          return null
        }
      ;

      // Trará tudo do usuário
      case 'general':
        try{
          if (userRef.exists()) {
            return userRef.val()
          }
        }
        catch (error) {
          errorSwalResponse(error)
          return null
        };

      default:
        return 'Incorrect content type';
    }
  }
  else
  {
    switch (contentType) {

      //Lerá todos os usuários e os colocará num formato acessível ao acc-managment
      case 'acc-manage':
        onValue(ref(getDatabase(), 'user'), (usersData) => {
          for (let userID in usersData.val()) {
            const user = document.createElement('li')
            user.id = userID
            user.className = 'user-acc'
            const userName = document.createElement('span')
            userName.textContent = `Nome: ${({ userID, ...usersData.val()[userID]}).user_name}`
            userName.id = `${({ userID, ...usersData.val()[userID]}).user_name}`
            userName.className = 'account-name'

            const userRank = document.createElement('span')
            userRank.textContent = `Nível de acesso: ${({ userID, ...usersData.val()[userID]}).rank }`
            userRank.className = 'account-value'

            const userEmail = document.createElement('span')
            userEmail.textContent = `E-mail: ${({ userID, ...usersData.val()[userID]}).user_email}`
            userEmail.id = `${({ userID, ...usersData.val()[userID]}).user_email}`
            userEmail.className = 'account-value'

            user.appendChild(userName)
            user.appendChild(userRank)
            user.appendChild(userEmail)
            document.getElementById('users-account-list').appendChild(user)
          }
        })
      ;break;

      case 'search-for' :
        document.getElementById('users-account-list').innerHTML = ''
        onValue(ref(getDatabase(), 'user'), (usersData) => {  
          for (let userID in usersData.val()) {
            const originalName = `${({ userID, ...usersData.val()[userID]}).user_name}`
            if (originalName.startsWith(contentName) == true || originalName.endsWith(contentName)) {
              const user = document.createElement('li')
              user.id = userID
              const userName = document.createElement('span')
              userName.textContent = `Nome: ${({ userID, ...usersData.val()[userID]}).user_name}`
              userName.id = `${({ userID, ...usersData.val()[userID]}).user_name}`
              userName.className = 'account-name'

              const userRank = document.createElement('span')
              userRank.textContent = `Nível de acesso: ${({ userID, ...usersData.val()[userID]}).rank }`
              userRank.className = 'account-value'

              const userEmail = document.createElement('span')
              userEmail.textContent = `E-mail: ${({ userID, ...usersData.val()[userID]}).user_email}`
              userEmail.id = `${({ userID, ...usersData.val()[userID]}).user_email}`
              userEmail.className = 'account-value'

              user.appendChild(userName)
              user.appendChild(userRank)
              user.appendChild(userEmail)
              document.getElementById('users-account-list').appendChild(user)
            }
          }
        })
      ;
      break; 

      default:
        return 'Incorrect content type';
    }
  }
}

// Função para realizar todas as tarefas de leitura de occorrências
export async function readReports(
  reportID,
  contentType,
  contentName
) {
  const dbRef = ref(getDatabase());
  const reference = await get(child(ref(getDatabase()), 'reports'));
  const reportRef = reference.val();
  const reportPostedDatas = {};
  const reportContents = {};
  const reportTitles = {};
  if (reportID) {
    switch (contentType) {
      // Trará todas as informações da ocorrência
      case 'general': 
        try {
          const reportRef = await get(child(dbRef, `reports/${reportID}`))
          if (reportRef.exists()) {
            return reportRef.val()
          } else {
            return "No data available"
          }
        } catch (error) {
          errorSwalResponse(error)
          return 'null'
        };

      // Lerá a data de postagem de um chamado
      case 'data':
        try {
          const reportRef = await get(child(dbRef, `reports/${reportID}`))
          if (reportRef.exists()) {
            return reportRef.val().dates?.posted_date?.posted_day
          } else {
            return "No data available"
          }
        } catch (error) {
          errorSwalResponse(error)
          return 'null'
        };

      // Lerá o conteúdo de um chamado
      case 'text-content': 
        try {
          const reportRef = await get(child(dbRef, `reports/${reportID}`))
          if (reportRef.exists()) {
            return reportRef.val().content
          } else {
            return "No data available"
          }
        } catch (error) {
          errorSwalResponse(error)
          return null
        };

      // Lerá o ID do objeto em questão
      case 'selected-object':
          try {
            const reportRef = await get(child(dbRef, `reports/${reportID}`))
            if (reportRef.exists()) {
              return reportRef.val().selected_obj.sel_obj_id
            } else {
              return "No data available"
            }
          } catch (error) {
            errorSwalResponse(error)
            return null
          };

      default: 
        return 'Incorrect content-type.';
    }
  }
  else
  {
    switch (contentType) {
      // trará todos os chamados com o conteúdo e o seu ID
      case 'general': 
        if (reference.exists()) {
          document.getElementById('chamados').innerHTML = '';
          for(const repID in reportRef){
            reportPostedDatas[repID] = reportRef[repID]
            reportContents[repID] = reportRef[repID].content?.title
                const report = document.createElement('div');
                report.className = 'chamado-card';
                report.id = repID;
 
                const link = document.createElement('a');
                link.href = `/html/calls.html?id=${repID}`;
                link.innerHTML = 'Ver mais';

                const repIDElement = document.createElement('p');
                repIDElement.innerHTML = `<strong>${repID}</strong><br> ${reportRef[repID].content?.title}`;

                const localAndData = document.createElement('p');
                localAndData.innerHTML = `${reportRef[repID].selected_obj.sel_lab_id} - ${reportRef[repID].dates.posted_date.posted_day}`;

                report.appendChild(repIDElement);
                report.appendChild(link);
                report.appendChild(localAndData);
                document.getElementById('chamados').appendChild(report);
          }
        }
      ;

      // trará todos os chamados com o conteúdo e o seu ID para os três primeiros (a ser alterado)
      case 'general-home' :
        if (reference.exists()) {
          for(const repID in reportRef){
            reportPostedDatas[repID] = reportRef[repID]
            //reportContents[repID] = reportRef[repID].content?.title
          }
          return reportPostedDatas//, reportContents
        }
      ;
      break;

      case 'search-for': 
        if (reference.exists()) {
          document.getElementById('chamados').textContent = '';
          for(const repID in reportRef){
            if (repID.startsWith(contentName)) {
              reportPostedDatas[repID] = reportRef[repID]
              reportContents[repID] = reportRef[repID].content?.title
              const report = document.createElement('div');
              report.className = 'chamado-card';
              report.id = repID;
  
              const link = document.createElement('a');
              link.href = `/html/calls.html?id=${repID}`;
              link.innerHTML = 'Ver mais';

              const repIDElement = document.createElement('p');
              repIDElement.innerHTML = `<strong>${repID}</strong><br> ${reportRef[repID].content?.title}`;

              const localAndData = document.createElement('p');
              localAndData.innerHTML = `${reportRef[repID].selected_obj.sel_lab_id} - ${reportRef[repID].dates.posted_date.posted_day}`;

              report.appendChild(repIDElement);
              report.appendChild(link);
              report.appendChild(localAndData);
              document.getElementById('chamados').appendChild(report);
            }
          }
        }
      ;
      break;

      // Trará todas as datas adjuntos aos ID dos chamados
      case 'data':
        if (reference.exists()) {
          for(const repID in reportRef){
            reportPostedDatas[repID] = reportRef[repID]
          }
        }
        return reportPostedDatas;

      // Trará os títulos e os conteúdos adjuntos aos ID dos respectivos chamados
      case 'text-content': 
      if (reference.exists()) {
          for(const repID in reportRef){
            reportPostedDatas[repID] = reportRef[repID]
            reportTitles[repID] = reportRef[repID].content?.title
            reportContents[repID] = reportRef[repID].content?.text
          }
        }
        return reportPostedDatas, reportTitles, reportContents;

      default: 
      return 'Incorrect content-type';
    }
  }
}

// Função para realizar todas as tarefas de leitura dos objetos
export async function readObjects(
objectID,
contentType
) {
  const dbRef = ref(getDatabase());
  
  const reference = await get(child(dbRef, 'object')); 
  const objectRef = reference.val();
  const objectClasses = {};
  const objectTypes = {};
  
  const objectPRef = await get(child(dbRef, `object/${objectID}`));
  const ObjValue = objectPRef.val();
  if (objectID) {
    switch (contentType) {

      // Trará todas as propriedades do objeto selecionado
      case 'property': 
        try {
          if (objectPRef.exists()) {
            const objectDescription = objectPRef.val().desc
            const ObjectGotDate = objectPRef.val().delivered_date
            const objectName = objectPRef.val().name
            return objectDescription, ObjectGotDate, objectName
          }
        }
        catch (error) {
          errorSwalResponse(error)
          return null
        }
      ;
      break;

      // Trará a classe e o tipo do objeto selecionado
      case 'class-type':
        if (objectPRef.exists()) {
          const data = [ObjValue.obj_class, ObjValue.obj_type];
          return data
        }
        else
        {
          return 'No data avaiable'
        }
      ;
      break;

      // Trará a classe do objeto selecionado
      case 'class':
      ;
      break;
        
      // Trará o tipo do objeto selecionado
      case 'type':
      ;
      break;

      default: 
        return 'Incorrect content-type.';
    }
  }
  else
  {
    switch (contentType) {

      // Ainda não decidido
      case 'general': 
      ;
      break;

      // Trará todas as classes existentes
      case 'class':
        if (reference.exists()) {
          for(const objectID in objectRef) {
            objectClasses[objectID] = objectRef[objectID].obj_class;
            return Object.entries(objectClasses);
          }
        }
      ;
      break;
      
      // Trará todas os tipos existentes
      case 'type':
        if (reference.exists()) {
          for(const objectID in objectRef) {
            objectTypes[objectID] = objectRef[objectID].obj_type;
            return Object.entries(objectTypes);
          }
        }
      ;
      break;

      default: 
        return 'Incorrect content-type.';
    }
  }
}

// Função para realizar todas as tarefas de leitura dos laboratórios
export async function readLaboratories (
  labID,
  contentType,
  contentName
) {
  const dbRef = ref(getDatabase());
  const reference = await get(child(dbRef, 'laboratory'));
  const labRef = reference.val();
  const labClasses = {};
  const labURLDesc = {};
  const laboratoryRef = await get(child(ref(getDatabase()), `laboratory/${labID}`));
  if (labID) {
    switch (contentType) {
      case 'general': 
        try {
          if (laboratoryRef.exists()) {
            const laboratoryProperty = laboratoryRef.val();
            return laboratoryProperty;
          }
        }
        catch (error) {
          errorSwalResponse(error);
          return null;
        };
      break;

      case 'class': ;
      break;

      default: 
        return 'Incorrect content-type.';
    }
  }
  else
  {
    switch (contentType) {
      case 'general': 
        if (laboratoryRef.exists()) {
          return laboratoryRef.val()
        }
      ;
      break;

      case 'content': 
        if (reference.exists()) {
          document.getElementById('labs').innerHTML = '';
          for(const labID in labRef) {
            labURLDesc[labID] = [labRef[labID].lab_Content.lab_img_url, labRef[labID].lab_Content.desc];
            
            const laboratory = document.createElement('div');
              laboratory.className = 'lab-card';
              laboratory.id = labID;

              const labIDElement = document.createElement('p');
              labIDElement.innerHTML = `<strong>${labID}</strong><br><br>`;
                    
              const seeMoreElement = document.createElement('a');
              seeMoreElement.href = `/html/institution.html?ID=${labID}`;
              seeMoreElement.innerHTML = 'Ver mais<br>';

              const img = document.createElement('p');
              img.innerHTML = `<img src="${labURLDesc[labID][0]}" style="width: 50vw; height: 30vh;"><br>`;
              if (!labURLDesc[labID][0]) {
                img.innerHTML = `<img src="../assets/default_classroom.avif" style="width: 50vw; height: 30vh;"><br>`;
              }

              const desc = document.createElement('p');
              desc.innerHTML = `<strong>${labURLDesc[labID][1]}</strong>`;

              laboratory.appendChild(labIDElement);
              laboratory.appendChild(img);
              laboratory.appendChild(seeMoreElement);
              laboratory.appendChild(desc);
              document.getElementById('labs').appendChild(laboratory);
          }
        }
      ;
      break;

      case 'search-for' :
        if (reference.exists()) {
          document.getElementById('labs').innerHTML = '';
          for(const labID in labRef) {
            if ((labID.startsWith(contentName) || labID.endsWith(contentName))) { 
              labURLDesc[labID] = [labRef[labID].lab_Content.lab_img_url, labRef[labID].lab_Content.desc]

              const laboratory = document.createElement('div')
              laboratory.className = 'lab-card'
              laboratory.id = labID

              const labIDElement = document.createElement('p')
              labIDElement.innerHTML = `<strong>${labID}</strong><br><br>`
                    
              const seeMoreElement = document.createElement('a')
              seeMoreElement.href = `/html/institution.html?ID=${labID}`
              seeMoreElement.innerHTML = 'Ver mais<br>'

              const img = document.createElement('p')
              img.innerHTML = `<img src="${labURLDesc[labID][0]}"><br>`
              if (!labURLDesc[labID][0]) {
                  img.innerHTML = `<img src="../assets/default_classroom.avif"><br>`
              }

              const desc = document.createElement('p')
              desc.innerHTML = `<strong>${labURLDesc[labID][1]}</strong>`

              laboratory.appendChild(labIDElement)
              laboratory.appendChild(img)
              laboratory.appendChild(seeMoreElement)
              laboratory.appendChild(desc)
              document.getElementById('labs').appendChild(laboratory)
            }
          }
        }
      ;
      break;

      case 'class': 
        if (reference.exists()) {
          for(const labID in labRef) {
            if (localStorage.getItem('old-lab') != labRef[labID].classif_labs) {
              labClasses[labID] = labRef[labID].classif_labs;
              localStorage.setItem('old-lab', labClasses[labID])
            }
          }
          return Object.entries(labClasses);
        };
      break;
        
      default: 
        return 'Incorrect content-type.';
    }
  }
}

// Função que faz a contagem para o gráfico da página principal
export async function countReportsByMonth () {
  const repBMRef = await get(child(ref(getDatabase()), 'reports'));
  const countByMonth = {};

  if (repBMRef.exists()) {
    for (const repID in repBMRef.val()) {
      const report = repBMRef.val()[repID];
      const data = report?.dates?.posted_date?.posted_day;

      if (data) {
        const month = data.substring(5, 7);

        countByMonth[month] = (countByMonth[month] || 0) + 1;
      }
    }
  }

  return countByMonth;
}