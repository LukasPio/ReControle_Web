export const reControleSwal = Swal.mixin({
    width: '75vw',
    imageHeight: '70vh',
    imageWidth: '40vw',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    showConfirmButton: true,
    confirmButtonColor: '#2f5cf3'
});

export const successSwal = Swal.mixin({
    title: 'Ocorrência registrada!',
    icon: 'success',
    showConfirmButton: false,
    position: 'bottom-end',
    timer: 1000
});

//temporário até a atualização pelo errorSwalResponse
export const errorSwal = Swal.mixin({
    title: 'Falha ao registrar!',
    showConfirmButton: false,
    position: 'bottom-end',
    icon: 'error',
    timer: 1000
});

export const loading = Swal.mixin({
    backdrop: ` rgba(0,20,100,0.2) `,
    text: 'Carregando',
    color: 'black',
    timer: 1000,
    didOpen: () => Swal.showLoading()
});