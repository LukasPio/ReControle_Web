import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

export function writeUserData(user_Id, rank, imageUrl) {
  set(ref(getDatabase(), 'user/' + user_Id), {
    rank: rank,
    user_img_url: imageUrl
  })
}

export function writeLaboratoryData (labID, basisObjectClassesArray, basisObjectIDsArray, classificationOfLabs) {
  set(ref(getDatabase(), 'laboratory/' + labID), {
    basis_obj: {
      b_obj_classes_array: basisObjectClassesArray,
      b_obj_ids_array: basisObjectIDsArray
    },
    classif_labs: classificationOfLabs
  })
}

export function writeObjectData () {
  
}