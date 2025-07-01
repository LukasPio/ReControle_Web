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
export async function readUserRank(userID) {
  const dbRef = ref(getDatabase());
  try {
    const snapshot = await get(child(dbRef, `user/${userID}`));

    if (snapshot.exists()) {
      return snapshot.val().rank;
    } else {
      return "No data available";
    }
  } catch (error) {
    errorSwalResponse(error);
    return null;
  }
}

// Função para ler um cadastro de usuário
export async function readUser (
  userID
) {// Alterar **************************

  try{
    const userRef = await get(child(ref(getDatabase()), `user/${userID}`));
    if (userRef.exists()) {
      const data = [userRef.val().rank, userRef.val().user_img_url];
      return data;
    }
  }
  catch (error) {
    errorSwalResponse(error); 
    return null;
  }
}

export function readAllUsers () {
  onValue(ref(getDatabase(), 'user'), (usersData) => {
    for (let userID in usersData.val()) {
      const user = document.createElement('li');
      user.id = userID;
      const userName = document.createElement('span');
      userName.textContent = `Nome: ${({ userID, ...usersData.val()[userID]}).user_name}`;
      userName.className = 'account-name';

      const userRank = document.createElement('span');
      userRank.textContent = `Nível de acesso: ${({ userID, ...usersData.val()[userID]}).rank }`;
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
export async function readReportsContentDate (
  reportID
) {
  const dbRef = ref(getDatabase());
  try {
    const reportRef = await get(child(dbRef, `reports/${reportID}`));
    if (reportRef.exists()) {
      return reportRef.val().dates?.posted_date?.posted_day;
    } else {
      return "No data available";
    }
  } catch (error) {
    errorSwalResponse(error);
    return null;
  }
}

export async function readReportsOneContent (
  reportID
) {
  const dbRef = ref(getDatabase());
  try {
    const reportRef = await get(child(dbRef, `reports/${reportID}`));
    if (reportRef.exists()) {
      return reportRef.val().content;
    } else {
      return "No data available";
    }
  } catch (error) {
    errorSwalResponse(error);
    return null;
  }
}

export async function readReportSelectedObject (
  reportID
) {
  const dbRef = ref(getDatabase());
  try {
    const reportRef = await get(child(dbRef, `reports/${reportID}`));
    if (reportRef.exists()) {
      return reportRef.val().selected_obj.sel_obj_id;
    } else {
      return "No data available";
    }
  } catch (error) {
    errorSwalResponse(error);
    return null;
  }
  
}

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

export async function readAllReports () {
  const reference = await get(child(ref(getDatabase()), 'reports'));
  const reportRef = reference.val();
  const reportPostedDatas = {};
  const reportContents = {};

  if (reference.exists()) {
    for(const repID in reportRef){
      reportPostedDatas[repID] = reportRef[repID];
      reportContents[repID] = reportRef[repID].content?.title;
    }
  }
  return reportPostedDatas, reportContents;
}



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
