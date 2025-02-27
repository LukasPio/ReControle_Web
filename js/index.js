
function Login() {

     // Configuração do Firebase
     const firebaseConfig = {
        apiKey: "AIzaSyBjtun6IwUqrqQv4hnU9hgrS5AZnDG8z7o",
        authDomain: "recontrole-b3815.firebaseapp.com",
        projectId: "recontrole-b3815",
        storageBucket: "recontrole-b3815.firebasestorage.app",
        messagingSenderId: "413353502819",
        appId: "1:413353502819:web:9c224ddb95ab38459b7056",
        measurementId: "G-RWBS6ZYLER"
      };

      // Inicialização do Firebase
      firebase.initializeApp(firebaseConfig);
      const auth = firebase.auth();

      function login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {

            alert('Usuário logado:' + userCredential.user);
            window.location.href='home.html';
          })
          .catch((error) => {

            alert('Erro no login:' + error.message);
          });
      }
}