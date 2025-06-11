import {EMF, FEC} from '../js_config/Config.js';

export function errorSwalResponse(error) {
  switch (error.code) {

    case `${FEC.c_inv_e}`:
      Swal.fire({                  
        title: 'Erro',           
        text: EMF.inv_email,                
        icon: 'error'              
      });

    break;

    case `${FEC.C_miss_p}`:     
                
      Swal.fire({
        title: 'Erro',
        text: EMF.miss_pass,
        icon: 'error'
      });
    break;
                
    case `${FEC.c_inv_c}`:

      Swal.fire({
        title: 'Erro',
        text: EMF.inv_cred,
        icon: 'error'
      });

    break;
                
    case `${FEC.c_user_dis}`:
                  
      Swal.fire({
        title: 'Erro',
        text: EMF.user_dis,
        icon: 'error'
      });

      break;
                  
      case `${FEC.C_too_r}`:

        Swal.fire({
          title: 'Erro',
          text: EMF.too_req,
          icon: 'error'
        });

      break;
          
      case `${FEC.C_miss_e}`: 

        Swal.fire({
          title: 'Erro',
          text: EMF.miss_email,
          icon: 'error'
        });

      break;
                
      default: 
      
        Swal.fire({    
          title: 'Erro',
          text: 'Erro ao entrar, tente novamente',
          icon: 'error'
        });
      }

}
