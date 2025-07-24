import {EMF, FEC} from '../js_config/Config.js';
import {errorToastSwal} from './swal_mixins.js'

export function errorSwalResponse(error) {
  switch (error.code) {

    case `${FEC.c_inv_e}`:    errorToastSwal.fire({title:  EMF.inv_email});
    break;

    case `${FEC.C_miss_p}`:   errorToastSwal.fire({title: EMF.miss_pass});
    break;
                
    case `${FEC.c_inv_c}`:    errorToastSwal.fire({title: EMF.inv_cred});
    break;
                
    case `${FEC.c_user_dis}`: errorToastSwal.fire({title: EMF.user_dis});
    break;
                  
    case `${FEC.C_too_r}`:    errorToastSwal.fire({title: EMF.too_req});
    break;
          
    case `${FEC.C_miss_e}`:   errorToastSwal.fire({title: EMF.miss_email});
    break;
                
    default:                  errorToastSwal.fire({title: 'Erro ao entrar, tente novamente'});
  }

}

