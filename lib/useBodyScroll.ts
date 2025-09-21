import { useEffect } from 'react'

// Función para restaurar completamente el scroll del body
const restoreBodyScroll = () => {
  // Remover todas las clases de SweetAlert2
  document.body.classList.remove('swal2-shown', 'swal2-height-auto', 'swal2-no-backdrop')
  document.documentElement.classList.remove('swal2-height-auto', 'swal2-no-backdrop')
  
  // Limpiar contenedores de SweetAlert2
  const containers = document.querySelectorAll('.swal2-container')
  containers.forEach(container => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })
  
  // Restaurar estilos del body de manera agresiva
  document.body.style.overflow = 'auto'
  document.body.style.paddingRight = '0px'
  
  // Limpiar estilos inline residuales
  const bodyStyle = document.body.getAttribute('style')
  if (bodyStyle) {
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
  
  // Forzar reflow
  document.body.offsetHeight
}

// Hook para manejar el scroll del body
export const useBodyScroll = () => {
  useEffect(() => {
    // Función para limpiar completamente
    const cleanup = () => {
      restoreBodyScroll()
    }

    // Limpiar al montar el componente
    cleanup()

    // Agregar listener para limpiar cuando se cierre cualquier modal
    const handleModalClose = () => {
      setTimeout(cleanup, 100)
    }

    // Escuchar eventos de cierre de modales
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.swal2-close') || 
          target.closest('.swal2-cancel') || 
          target.closest('.swal2-confirm') ||
          target.closest('.swal2-backdrop')) {
        handleModalClose()
      }
    })

    // Escuchar tecla Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleModalClose()
      }
    }
    document.addEventListener('keydown', handleEscape)

    // Limpiar al desmontar
    return () => {
      cleanup()
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])
}

// Función utilitaria para forzar la restauración del scroll
export const forceRestoreScroll = () => {
  restoreBodyScroll()
}

export default useBodyScroll