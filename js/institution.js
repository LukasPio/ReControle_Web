import {
  createLaboratorySwal,
  createObjectSwal,
} from "./js_functions/swal_db_fires.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { firebaseConfig } from "./js_config/Config.js";
import {
  readLaboratories,
  readObjects,
  readReports,
} from "./js_functions/realtime_db.js";
import { loading } from "./js_functions/swal_mixins.js";

initializeApp(firebaseConfig);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  loading.fire({ timer: 1850 });

  if (localStorage.getItem("rank") > 1) {
    document.getElementById("add-div").innerHTML = `
            <input type="checkbox" id="fab-toggle" class="fab-toggle" />

            <label for="fab-toggle" class="btn-create-rep fab-main">
                <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
            </label>

            <div class="fab-options2">
                <button class="btn-create-rep" id="lab-add-btn">Adicionar Laboratório</button>
            </div>
            <div class="fab-options1">
                <button class="btn-create-rep" id="obj-add-btn">Adicionar Objeto</button>
            </div>
        `;
  }

  readLaboratories(null, "general").then((labRef) => {
    const labURLDesc = {};
    document.getElementById("labs").innerHTML = "";
    for (const labID in labRef) {
      labURLDesc[labID] = [
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
      img.innerHTML = `<img src="${labURLDesc[labID][0]}" style="width: 50vw; height: 30vh;"><br>`;
      if (!labURLDesc[labID][0]) {
        img.innerHTML = `<img src="../assets/default_classroom.avif" style="width: 50vw; height: 30vh;"><br>`;
      }

      //Descrição
      const desc = document.createElement("p");
      desc.innerHTML = `<strong>${labURLDesc[labID][1]}</strong>`;

      //Verificação da existência de ocorrências relacionadas ao laboratório referente.
      readReports(null, "data").then((resp) => {
        var int1 = 0,
          int2 = 0;
        for (const ID in resp) {
          if (resp[ID].selected_obj?.sel_lab_id == labID) {
            if (resp[ID].content.status == "red") {
              int1++;
            } else if (resp[ID].content.status == "yellow") {
              int2++;
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

          pendingProgressElement.appendChild(pendingElement);
          pendingProgressElement.appendChild(progressElement);
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
  });

  readObjects(null, "general").then((objectRef) => {
    var i = 0;
    document.getElementById("objs").innerHTML = "";
    for (const ID in objectRef) {
      const object = document.createElement("div");
      object.className = "object-card";
      readReports(null, "data").then((resp) => {
        for (const Id in resp) {
          if (resp[Id].dates) {
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
      document.getElementById("objs").appendChild(object);
      i++;
      if (i > 2) {
        break;
      }
    }
  });

  onAuthStateChanged(auth, (user) => {
    const userName = user.displayName;
    const addLab = document.getElementById("lab-add-btn");
    if (addLab) {
      addLab.addEventListener("click", () => {
        createLaboratorySwal(user.uid, userName);
      });
    }
    const addObj = document.getElementById("obj-add-btn");
    if (addObj) {
      addObj.addEventListener("click", () => {
        createObjectSwal();
      });
    }
  });
});
