
export const firebaseConfig = {
    apiKey: "AIzaSyBjtun6IwUqrqQv4hnU9hgrS5AZnDG8z7o",
    authDomain: "recontrole-b3815.firebaseapp.com",
    projectId: "recontrole-b3815",
    storageBucket: "recontrole-b3815.firebasestorage.app",
    messagingSenderId: "413353502819",
    appId: "1:413353502819:web:9c224ddb95ab38459b7056",
    measurementId: "G-RWBS6ZYLER"
  };

  export const hrefsConfig = {
    index: "index.html",
    home: "home.html",
    cadas: "cadas.html",
    geren_obj: "H_geren_obj.html",
    conf_acc: "H_config_acc.html",
    e_verif: "email_verif.html"
  };

  //Error Messages from Firebase
  export const EMF = {
    miss_email: "O E-Mail não foi digitado.",
    miss_pass:  "A senha não foi digitada.",
    inv_email:  "Email inválido.",
    inv_cred:   "Senha inválida.",
    user_dis:   "Conta desativada.",
    too_req:    "Muitos requerimentos, tente novamente mais tarde.",
    too_p_req:  "Muitos requrimentos da senha, tente novamente mais tarde"
  };

  //Firebase Error Codes
  export const FEC = {
    C_miss_e: "auth/missing-email",
    C_miss_p: "auth/missing-password",
    c_inv_e: "auth/invalid-email",
    c_inv_c: "auth/invalid-credential",
    c_user_dis: "auth/user-disabled",
    C_too_r: "auth/too-many-requests",
    C_too_p_r: "auth/quota-exceeded"
  }