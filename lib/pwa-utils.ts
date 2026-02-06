// Viewport height fix for mobile browsers
// This script sets a CSS custom property with the actual viewport height
// to handle address bar on mobile browsers correctly

export function initViewportHeight() {
  if (typeof window === 'undefined') return

  const setVH = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  // Set on initial load
  setVH()

  // Update on resize/orientation change
  window.addEventListener('resize', setVH)
  window.addEventListener('orientationchange', setVH)

  // Cleanup function
  return () => {
    window.removeEventListener('resize', setVH)
    window.removeEventListener('orientationchange', setVH)
  }
}

// PWA install prompt handler
export function initPWAInstallPrompt() {
  if (typeof window === 'undefined') return

  let deferredPrompt: any = null

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt = e
    
    // Dispatch custom event that components can listen to
    window.dispatchEvent(new CustomEvent('pwa-installable', { 
      detail: { prompt: deferredPrompt } 
    }))
  })

  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully')
    deferredPrompt = null
  })
}

// Service Worker update handler
export function initServiceWorkerUpdate() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            window.dispatchEvent(new CustomEvent('pwa-update-available'))
          }
        })
      }
    })
  })
}

// Initialize all PWA utilities
export function initPWA() {
  const cleanupVH = initViewportHeight()
  initPWAInstallPrompt()
  initServiceWorkerUpdate()

  return cleanupVH
}
