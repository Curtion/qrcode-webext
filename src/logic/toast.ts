import { type VNode, h, render } from 'vue'
import ToastComponent from '../components/ToastContainer.vue'

declare global {
  interface HTMLElement {
    _vnode?: VNode
  }
}

interface ToastOptions {
  message: string
  duration?: number
}

function showToast(options: ToastOptions | string) {
  const toastOptions = typeof options === 'string' ? { message: options } : options

  const container = document.createElement('div')
  document.body.appendChild(container)

  const vnode = h(ToastComponent, {
    ...toastOptions,
    onDestroy: () => {
      render(null, container)
      document.body.removeChild(container)
    },
  })

  render(vnode, container)
}

export default showToast
