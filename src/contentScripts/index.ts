import 'uno.css'

let lastCanvas: HTMLCanvasElement | null

document.addEventListener('contextmenu', (event) => {
  const target = event.target as HTMLElement
  if (target?.tagName === 'CANVAS') {
    lastCanvas = target as HTMLCanvasElement
  }
}, true)

window.captureCanvas = () => {
  if (!lastCanvas) {
    return null
  }

  try {
    const data = lastCanvas.toDataURL()
    lastCanvas = null
    return data
  } catch (e) {
    console.error('Canvas 读取失败:', e)
    return null
  }
}
