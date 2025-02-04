export interface Toast {
  id: symbol
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  remaining: number
}
