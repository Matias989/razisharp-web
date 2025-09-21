import Swal from 'sweetalert2'

// Configuración base para SweetAlert2 con temática fantasy
const fantasyTheme = {
  customClass: {
    popup: 'fantasy-popup',
    title: 'fantasy-title',
    content: 'fantasy-content',
    confirmButton: 'fantasy-confirm-btn',
    cancelButton: 'fantasy-cancel-btn',
    denyButton: 'fantasy-deny-btn',
    input: 'fantasy-input',
    actions: 'fantasy-actions',
    footer: 'fantasy-footer'
  },
  buttonsStyling: false,
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonText: 'Confirmar',
  cancelButtonText: 'Cancelar',
  denyButtonText: 'No',
  allowOutsideClick: true,
  allowEscapeKey: true,
  focusConfirm: true,
  reverseButtons: false,
  showCloseButton: true,
  closeButtonHtml: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
  showLoaderOnConfirm: false,
  preConfirm: undefined,
  returnFocus: true,
  heightAuto: true,
  backdrop: true,
  allowEnterKey: true,
  stopKeydownPropagation: true,
  keydownListenerCapture: false,
  html: false,
  width: '32em',
  padding: '1.25em',
  background: '#0f172a',
  grow: false,
  position: 'center' as const,
  timer: undefined,
  timerProgressBar: false,
  toast: false,
  target: 'body',
  input: undefined,
  inputPlaceholder: '',
  inputValue: '',
  inputOptions: {},
  inputAutoTrim: true,
  inputAttributes: {},
  inputValidator: undefined,
  validationMessage: undefined,
  progressSteps: [],
  currentProgressStep: undefined,
  progressStepsDistance: '40px',
  onBeforeOpen: undefined,
  onAfterClose: undefined,
  onOpen: undefined,
  onClose: undefined,
  onRender: undefined,
  didOpen: undefined,
  willClose: undefined,
  didClose: undefined,
  didDestroy: undefined,
  scrollbarPadding: true
}

// Función para mostrar alertas de éxito
export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: '¡Perfecto!',
    customClass: {
      popup: 'fantasy-popup',
      title: 'fantasy-title',
      confirmButton: 'fantasy-confirm-btn fantasy-success-btn'
    },
    buttonsStyling: false,
    allowOutsideClick: true,
    allowEscapeKey: true,
    showCloseButton: true,
    didClose: () => {
      // Forzar limpieza completa del modal
      const swalContainer = document.querySelector('.swal2-container')
      if (swalContainer) {
        swalContainer.remove()
      }
    }
  })
}

// Función para mostrar alertas de error
export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Entendido',
    customClass: {
      popup: 'fantasy-popup',
      title: 'fantasy-title',
      confirmButton: 'fantasy-confirm-btn fantasy-error-btn'
    },
    buttonsStyling: false,
    allowOutsideClick: true,
    allowEscapeKey: true,
    showCloseButton: true,
    didClose: () => {
      // Forzar limpieza completa del modal
      const swalContainer = document.querySelector('.swal2-container')
      if (swalContainer) {
        swalContainer.remove()
      }
    }
  })
}

// Función para mostrar alertas de advertencia
export const showWarningAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Continuar',
    customClass: {
      popup: 'fantasy-popup',
      title: 'fantasy-title',
      confirmButton: 'fantasy-confirm-btn fantasy-warning-btn'
    },
    buttonsStyling: false,
    allowOutsideClick: true,
    allowEscapeKey: true,
    showCloseButton: true,
    didClose: () => {
      // Forzar limpieza completa del modal
      const swalContainer = document.querySelector('.swal2-container')
      if (swalContainer) {
        swalContainer.remove()
      }
    }
  })
}

// Función para mostrar alertas de información
export const showInfoAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'Entendido',
    customClass: {
      popup: 'fantasy-popup',
      title: 'fantasy-title',
      confirmButton: 'fantasy-confirm-btn fantasy-info-btn'
    },
    buttonsStyling: false,
    allowOutsideClick: true,
    allowEscapeKey: true,
    showCloseButton: true,
    didClose: () => {
      // Forzar limpieza completa del modal
      const swalContainer = document.querySelector('.swal2-container')
      if (swalContainer) {
        swalContainer.remove()
      }
    }
  })
}

// Función para mostrar confirmaciones
export const showConfirmAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'fantasy-popup',
      title: 'fantasy-title',
      confirmButton: 'fantasy-confirm-btn fantasy-success-btn',
      cancelButton: 'fantasy-cancel-btn fantasy-error-btn'
    },
    buttonsStyling: false,
    allowOutsideClick: true,
    allowEscapeKey: true,
    showCloseButton: true,
    didClose: () => {
      // Forzar limpieza completa del modal
      const swalContainer = document.querySelector('.swal2-container')
      if (swalContainer) {
        swalContainer.remove()
      }
    }
  })
}

// Función para mostrar alertas de carga
export const showLoadingAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    showCloseButton: false,
    customClass: {
      popup: 'fantasy-popup',
      title: 'fantasy-title'
    },
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

// Función para cerrar alertas de carga
export const closeLoadingAlert = () => {
  Swal.close()
}

// Función para limpiar completamente todos los modales
export const clearAllModals = () => {
  // Cerrar todos los modales activos
  Swal.close()
  
  // Limpiar todos los contenedores de SweetAlert2
  const containers = document.querySelectorAll('.swal2-container')
  containers.forEach(container => container.remove())
  
  // Limpiar el body de clases de SweetAlert2
  document.body.classList.remove('swal2-shown', 'swal2-height-auto')
  
  // Limpiar el html de clases de SweetAlert2
  document.documentElement.classList.remove('swal2-height-auto', 'swal2-no-backdrop')
}

export default Swal
