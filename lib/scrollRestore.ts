// Script para restaurar el scroll del body después de cerrar modales
export const restoreScroll = () => {
  // Función para limpiar completamente el scroll
  const cleanup = () => {
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
    
    // Restaurar estilos del body
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

  // Ejecutar limpieza inmediatamente
  cleanup()

  // Ejecutar limpieza después de un delay para asegurar que SweetAlert2 haya terminado
  setTimeout(cleanup, 100)
  setTimeout(cleanup, 300)
  setTimeout(cleanup, 500)

  // Agregar listener para limpiar cuando se detecte cierre de modal
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const removedNodes = Array.from(mutation.removedNodes)
        const hasSwalContainer = removedNodes.some(node => 
          node.nodeType === Node.ELEMENT_NODE && 
          (node as Element).classList?.contains('swal2-container')
        )
        
        if (hasSwalContainer) {
          setTimeout(cleanup, 50)
        }
      }
    })
  })

  // Observar cambios en el body
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // Limpiar observer después de 30 segundos
  setTimeout(() => {
    observer.disconnect()
  }, 30000)
}

// Ejecutar automáticamente si estamos en el cliente
if (typeof window !== 'undefined') {
  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreScroll)
  } else {
    restoreScroll()
  }
}

export default restoreScroll
