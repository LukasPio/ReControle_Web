import {readReportsOneContent, readReportSelectedObject, readObjectClassAndType} from './realtime_db.js';

export async function swalFireLookForOcurrence (
    reportID
) {
    readReportsOneContent(reportID).then(response => {
        const data = Object.entries(response);
        var imageURL = data[0][1];
        if (!imageURL) {
            imageURL = '../../assets/default_occur.jpg'
        }
        readReportSelectedObject(reportID).then((resp) => {
            readObjectClassAndType(resp).then(array => {
                Swal.fire({
                    title: `${data[2][1]}`,
                    width: '75vw',
                    imageUrl: `${imageURL}`,
                    imageWidth: '40vw',
                    imageHeight: '70vh',
                    html: `
                        <div class='swal2-html-container' id='swal2-html-container'>
                            <label for='object-description' style='font-weight:bold;'> Descrição </label>
                            <center>
                                <p id='object-description' style='border:1px solid black;border-radius:15px;width:35vw;'>
                                    ${data[1][1]}
                                </p>
                            </center>
                        </div>
                        <div class='swal2-html-container' id='swal2-html-container'>
                            <label for='object-class' style='font-weight:bold;'> Classe do objeto </label>
                            <center>
                                <p id='object-class' style='border:1px solid black;border-radius:15px;width:35vw;'>
                                    ${array[0]}
                                </p>
                            </center>
                        </div>
                        <div class='swal2-html-container' id='swal2-html-container'>
                            <label for='object-type' style='font-weight:bold;'> Tipo do objeto </label>
                            <center>
                                <p id='object-type' style='border:1px solid black;border-radius:15px;width:35vw;'>
                                    ${array[1]}
                                </p>
                            </center>
                        </div>
                        <div class='swal2-html-container' id='swal2-html-container'>
                            <label for='selected-local' style='font-weight:bold;'> Sala selecionada </label>
                            <center>
                                <p id='selected-local' style='border:1px solid black;border-radius:15px;width:35vw;'>
                                    ${reportID.slice(0, -17)}
                                </p>
                            </center>
                        </div>
                        <div class='swal2-html-container' id='swal2-html-container'>
                            <label for='date-time' style='font-weight:bold;'> Data e Hora </label>
                            <center>
                                <p id='date-time' style='border:1px solid black;border-radius:15px;width:35vw;'>
                                    Dia ${reportID.slice(-8, -6)} do mês ${reportID.slice(-11, -9)} de ${reportID.slice(-16, -12)} , às ${reportID.slice(-5, -3)} horas e ${reportID.slice(-2)} minutos
                                </p>
                            </center>
                        </div>
                    `
                }).then(() => 
                    window.location.href = './calls.html'
                ); 
            });
        })
    })
    
}