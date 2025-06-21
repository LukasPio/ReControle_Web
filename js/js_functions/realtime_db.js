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

//Cadastrar o laboratório
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

//Cadastrar o objeto
export function writeObjectData (
  description,
  ObjectClass, 
  ObjectType, 
  ObjectID,
) {
  set(ref(getDatabase(), `object/${ObjectClass}/${ObjectType}/${ObjectID}`), {
    desc: description
  })
}

//Criar a ocorrência
export function writeReportsData (
  imageUrl,
  text,
  title,
  //urgency,
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
      title: title/* ,
      urgency: urgency */
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

//Função para determinar o que o usuário pode ou não fazer
export function readUserRank(
  userID
) {
  get(child(ref(getDatabase()), `user/${userID}`)).then((userRef) => {
    if (userRef.exists()) {
      const rank = userRef.val().rank;
      return rank;
      // Ainda a ser determinado
      // Pode muito bem ser um localstorage
      // ou um simples valor codificado pa-
      // ra verificar o rank. Por enquanto,
      // será um simples valor.
    }
  })
  .catch((error) => errorSwalResponse(error))
}

// Função para ler um cadastro de usuário
export function readUser (
  userID
) {
  get(child(ref(getDatabase()), `user/${userID}`)).then((userRef) => {
    if (userRef.exists()) {
      const data = [userRef.val().rank, userRef.val().user_img_url];
      return data;
    }
  })
  .catch((error) => errorSwalResponse(error))
}

export function readAllUsers () {

  // usersList.className = '';
  onValue(ref(getDatabase(), 'user'), (usersData) => {
    for (let userID in usersData.val()) {
      const user = document.createElement('li');
      const userName = document.createElement('span');
      userName.textContent = `Nome: ${({ userID, ...usersData.val()[userID]}).user_name}`;
      userName.className = 'account-name';

      const userRank = document.createElement('span');
      userRank.textContent = `Ranque: ${({ userID, ...usersData.val()[userID]}).rank }`;
      userRank.className = 'account-value';

      const userEmail = document.createElement('span');
      userEmail.textContent = `E-mail: ${({ userID, ...usersData.val()[userID]}).user_email}`;
      userEmail.className = 'account-value';

      user.appendChild(userName);
      user.appendChild(userRank);
      user.appendChild(userEmail);
      document.getElementById('users-account-list').appendChild(user);
    }
  });
}

// Função para ler uma ocorrência
export function readReportsContentDate (
reportID
) {
  get(child(ref(getDatabase()), `reports/${reportID}`)).then((reportRef) => {
    if (reportRef.exists()) {
      const reportContent = [reportRef.val().content, reportRef.val().dates, reportRef.val().selected_obj];
      return JSON.stringify(reportContent);
    }
  })
}

export function readObjectProperties (
  objectID,
  objectType,
  objectClass
) {
    get(child(ref(getDatabase()), `object/${objectClass}/${objectType}/${objectID}`)).then((objectRef) => {
    if (objectRef.exists()) {
      const objectContent = objectRef.val().desc;
      return JSON.stringify(objectContent);
    }
  })
}

export function readLaboratoryProperties (
  labID
) {
  get(child(ref(getDatabase()), `laboratory/${labID}`)).then((laboratoryRef) => {
      if (laboratoryRef.exists()) {
        const laboratoryProperty = [laboratoryRef.val().basis_obj, laboratoryRef.val().classif_labs, laboratoryRef.val().lab_content];
        return JSON.stringify(laboratoryProperty);
      }
    })
}