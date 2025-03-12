     import {hrefsConfig} from "../js/Config.js";
        const index_get = hrefsConfig.index;

        
       /*  Os ids serão dados por:
           - id="função_destino_origem".
    */

    

    
   /* n0= .replace(/0/g, ""),
    n1= .replace(/1/g, ""),
    n2= .replace(/2/g, ""),  
    n3= .replace(/3/g, ""), 
    n4= .replace(/4/g, ""), 
    n5= .replace(/5/g, ""), 
    n6= .replace(/6/g, ""), 
    n7= .replace(/7/g, ""), 
    n8= .replace(/8/g, ""), 
    n9= .replace(/9/g, "") 
  
*/
    
    
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");


        console.log(email);
        console.log(email.substring(0, email.indexOf('@')));
        console.log(email.substring(0, email.indexOf('@')).replace(/0/g, "").replace(/1/g, "").replace(/2/g, "").replace(/3/g, "").replace(/4/g, "").replace(/5/g, "").replace(/6/g, "").replace(/7/g, "").replace(/8/g, "").replace(/9/g, ""));
        document.getElementById("account").innerHTML = email;


         if (email == null) {
            document.getElementById("account").innerHTML = "<button id='back_login_home' >Fazer Login</button>";

                document.addEventListener('DOMContentLoaded', () => {
                const botao = document.getElementById('back_login_home');
                botao.addEventListener('click', () => { window.location.href = index_get;  });  });

         }
         else {

            if (email.substring(0, email.indexOf('@')).includes(".")) {
                names = email.substring(0, email.indexOf('@')).split('.');
                firstN = names[0].replace(/0/g, "").replace(/1/g, "").replace(/2/g, "").replace(/3/g, "").replace(/4/g, "").replace(/5/g, "").replace(/6/g, "").replace(/7/g, "").replace(/8/g, "").replace(/9/g, "");
                lastN = names[1].replace(/0/g, "").replace(/1/g, "").replace(/2/g, "").replace(/3/g, "").replace(/4/g, "").replace(/5/g, "").replace(/6/g, "").replace(/7/g, "").replace(/8/g, "").replace(/9/g, "");
                nome = firstN + " " + lastN;
            }
            else
            {
                nome = email.substring(0, email.indexOf("@")).replace(/0/g, "").replace(/1/g, "").replace(/2/g, "").replace(/3/g, "").replace(/4/g, "").replace(/5/g, "").replace(/6/g, "").replace(/7/g, "").replace(/8/g, "").replace(/9/g, "");
                conso
            }

            document.getElementById("ul_account").innerHTML = "<li href='#'> Perfil de " + nome + "</li> " +
                                                              "<li href='#'>Configurações da conta</li>";
         }
    /* Botão de teste

document.addEventListener('DOMContentLoaded', () => {
    const botao = document.getElementById('teste');
    botao.addEventListener('click', () => {
        
        

        


    });
});

*/