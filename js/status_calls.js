//import {writeReportsData, readReportsContentDate} from '../js/js_functions/realtime_db.js';
import {createReportSwal, searchFor} from '../js/js_functions/swal_db_fires.js';
import {readReports} from './js_functions/realtime_db.js';
import {loading} from './js_functions/swal_mixins.js';

var usualChoice;
  
document.addEventListener('DOMContentLoaded', () => {


    loading.fire();

    readReports('general-status', null, localStorage.getItem('status-calls'))


})