import Swal from 'sweetalert2'

// Función robusta para restaurar completamente el scroll y estilos del body
const restoreBodyScroll = () => {
  // Esperar un poco para asegurar que SweetAlert2 haya terminado sus animaciones
  setTimeout(() => {
    // Remover todas las clases de SweetAlert2 del body
    document.body.classList.remove('swal2-shown', 'swal2-height-auto', 'swal2-no-backdrop')
    
    // Remover todas las clases de SweetAlert2 del html
    document.documentElement.classList.remove('swal2-height-auto', 'swal2-no-backdrop')
    
    // Limpiar todos los estilos inline del body relacionados con SweetAlert2
    const bodyStyle = document.body.getAttribute('style')
    if (bodyStyle) {
      // Remover overflow: hidden y padding-right
      let newStyle = bodyStyle
        .replace(/overflow:\s*hidden[^;]*;?/g, '')
        .replace(/padding-right:\s*[^;]*;?/g, '')
        .replace(/;+/g, ';')
        .replace(/^;|;$/g, '')
      
      if (newStyle.trim()) {
        document.body.setAttribute('style', newStyle)
      } else {
        document.body.removeAttribute('style')
      }
    }
    
    // Forzar la restauración del scroll
    document.body.style.overflow = 'auto'
    document.body.style.paddingRight = '0px'
    
    // Limpiar cualquier contenedor residual de SweetAlert2
    const containers = document.querySelectorAll('.swal2-container')
    containers.forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
    })
    
    // Forzar reflow para asegurar que los cambios se apliquen
    document.body.offsetHeight
    
    // Verificar que el scroll funcione
    if (document.body.scrollHeight > window.innerHeight) {
      document.body.style.overflow = 'auto'
    }
  }, 150)
}

// Función para limpiar completamente todos los modales
const cleanupModals = () => {
  // Cerrar todos los modales activos
  Swal.close()
  
  // Limpiar todos los contenedores de SweetAlert2
  const containers = document.querySelectorAll('.swal2-container')
  containers.forEach(container => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })
  
  // Restaurar el scroll del body
  restoreBodyScroll()
}

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
      // Limpiar completamente el modal y restaurar scroll
      cleanupModals()
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
      // Limpiar completamente el modal y restaurar scroll
      cleanupModals()
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
      // Limpiar completamente el modal y restaurar scroll
      cleanupModals()
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
      // Limpiar completamente el modal y restaurar scroll
      cleanupModals()
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
      // Limpiar completamente el modal y restaurar scroll
      cleanupModals()
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
  // Restaurar el scroll después de cerrar
  restoreBodyScroll()
}

// Función para limpiar completamente todos los modales
export const clearAllModals = () => {
  cleanupModals()
}

// Función para restaurar el scroll del body (exportada para uso manual)
export { restoreBodyScroll as restoreBodyScrollFunction }

export default Swal