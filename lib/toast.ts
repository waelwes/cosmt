// Simple toast notification system
export interface Toast {
  id: string
  title?: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

class ToastManager {
  private toasts: Toast[] = []
  private listeners: ((toasts: Toast[]) => void)[] = []

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]))
  }

  add(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    this.toasts.push(newToast)
    this.notify()

    // Auto remove after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      this.remove(id)
    }, duration)

    return id
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notify()
  }

  clear() {
    this.toasts = []
    this.notify()
  }

  success(message: string, options?: Partial<Toast>) {
    return this.add({
      description: message,
      type: 'success',
      ...options
    })
  }

  error(message: string, options?: Partial<Toast>) {
    return this.add({
      description: message,
      type: 'error',
      ...options
    })
  }

  warning(message: string, options?: Partial<Toast>) {
    return this.add({
      description: message,
      type: 'warning',
      ...options
    })
  }

  info(message: string, options?: Partial<Toast>) {
    return this.add({
      description: message,
      type: 'info',
      ...options
    })
  }
}

export const toast = new ToastManager()
