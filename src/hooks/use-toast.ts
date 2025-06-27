import { toast as sonnerToast } from "sonner"

export const useToast = () => {
  const toast = {
    success: (message: string, description?: string) => {
      sonnerToast.success(message, {
        description,
        duration: 4000,
      })
    },
    error: (message: string, description?: string) => {
      sonnerToast.error(message, {
        description,
        duration: 5000,
      })
    },
    info: (message: string, description?: string) => {
      sonnerToast.info(message, {
        description,
        duration: 4000,
      })
    },
    warning: (message: string, description?: string) => {
      sonnerToast.warning(message, {
        description,
        duration: 4000,
      })
    },
    loading: (message: string, description?: string) => {
      return sonnerToast.loading(message, {
        description,
      })
    },
    promise: <T,>(
      promise: Promise<T>,
      options: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: Error) => string)
      }
    ) => {
      return sonnerToast.promise(promise, options)
    },
    custom: (jsx: React.ReactElement | ((id: string | number) => React.ReactElement)) => {
      if (typeof jsx === 'function') {
        return sonnerToast.custom(jsx)
      } else {
        return sonnerToast.custom(() => jsx)
      }
    },
    dismiss: (id?: string | number) => {
      sonnerToast.dismiss(id)
    },
  }

  return { toast }
}

// Re-export for direct usage
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
    })
  },
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
    })
  },
  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
    })
  },
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
    })
  },
  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
    })
  },
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return sonnerToast.promise(promise, options)
  },
  custom: (jsx: React.ReactElement | ((id: string | number) => React.ReactElement)) => {
    if (typeof jsx === 'function') {
      return sonnerToast.custom(jsx)
    } else {
      return sonnerToast.custom(() => jsx)
    }
  },
  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id)
  },
}
