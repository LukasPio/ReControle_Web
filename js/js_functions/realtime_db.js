import { getDatabase, ref, set, child, get, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import {errorSwalResponse} from '../js_functions/swal_fire_errors.js';

// Cadastrar o usuário
export function writeUserData(
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

// Cadastrar o laboratório
export function writeLaboratoryData (
  labID, 
  basisObjectClassesArray, 
  basisObjectIDsArray, 
  classificationOfLabs,
  labURL,
  labDesc,
  createDate,
  author,
  status
) {
  set(ref(getDatabase(), `laboratory/${labID}`), {
    basis_obj: {
      b_obj_classes_array: basisObjectClassesArray,
      b_obj_ids_array: basisObjectIDsArray
    },
    classif_labs: classificationOfLabs,
    lab_Content: {
      lab_img_url: labURL,
      desc: labDesc
    },
    data: createDate,
    author: author,
    status: status
  })
}

// Cadastrar o objeto
export function writeObjectData (
  name,
  gotDay,
  gotTime,
  description,
  ObjectClass, 
  ObjectType, 
  ObjectID,
) {
  set(ref(getDatabase(), `object/${ObjectID}/${ObjectType}/${ObjectClass}`), {
    desc: description,
    name: name,
    delivered_date: {
      del_day: gotDay,
      del_time: gotTime
    }
  })
}

// Criar a ocorrência
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

// Função para fazer as leituras dos usuários
export async function readUsers (
  userID,
  contentType
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

      // Trará tudo do usuário
      case 'general':
        try{
          if (userRef.exists()) {
            const data = [userRef.val().name,userRef.val().user_email, userRef.val().rank, userRef.val().user_img_url]
            return data
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
        });

      default:
        return 'Incorrect content type';
    }
  }
}

// Função para realizar todas as tarefas de leitura de occorrências
export async function readReports(
  reportID,
  contentType
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
          for(const repID in reportRef){
            reportPostedDatas[repID] = reportRef[repID]
            reportContents[repID] = reportRef[repID].content?.title
          }
        }
        return reportPostedDatas, reportContents;

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

// Função para ler o algumas propriedades do objeto selecionado
export async function readObjectProperties (
  objectID,
  objectType,
  objectClass
) {
    try {
      const objectPRef = await get(child(ref(getDatabase()), `object/${objectID}/${objectType}/${objectClass}`));

      if (objectPRef.exists()) {
        const objectDescription = objectPRef.val().desc;
        const ObjectGotDate = objectPRef.val().delivered_date;
        const objectName = objectPRef.val().name;
        return objectDescription, ObjectGotDate, objectName;
      }
    }
    catch (error) {
      errorSwalResponse(error);
      return null;
    }
}

// Função para ler a classe e o tipo de um objeto selecionado
export async function readObjectClassAndType(
  ID
) {
  const snapshot = await get(child(ref(getDatabase()), `object/${ID}`));
  const snapValue = snapshot.val();
  if (snapshot.exists()) {
    const data = [Object.entries(Object.entries(snapValue)[0][1])[0][0] /* Classe do objeto */, Object.entries(snapValue)[0][0] /* Tipo de objeto */];
    return data
  }
  else
  {
    return 'No data avaiable'
  }
}

// Função para ler algumas propriedades do laboratório (ou sala) em questão
export async function readLaboratoryProperties (
  labID
) {
  try {
    const laboratoryRef = await get(child(ref(getDatabase()), `laboratory/${labID}`));
    if (laboratoryRef.exists()) {
      const laboratoryProperty = [laboratoryRef.val().basis_obj, laboratoryRef.val().classif_labs, laboratoryRef.val().lab_content];
      return laboratoryProperty;
    }
  }
  catch (error) {
    errorSwalResponse(error);
    return null;
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


