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
    toast: false,
    title: 'Operação bem sucedida',
    icon: 'success',
    showConfirmButton: true,
    timer: 2000
});

export const successToastSwal = successSwal.mixin({
    toast: true,
    showConfirmButton: false,
    position: 'bottom-end',
    timer: 2000
});

export const errorSwal = Swal.mixin({
    toast: false,
    title: 'Operação mal sucedida.',
    showConfirmButton: true,
    icon: 'error',
    timer: 3000
});

export const errorToastSwal = errorSwal.mixin({
    toast: true,
    showConfirmButton: false,
    position: 'bottom-end',
    timer: 3000
});

export const loading = Swal.mixin({
    backdrop: ` rgba(0,20,100,0.2) `,
    text: 'Carregando',
    color: 'black',
    timer: 1000,
    didOpen: () => Swal.showLoading()
});