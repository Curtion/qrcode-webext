import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: {
    'toast': 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
    'toast-content':
      'bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-800 '
      + 'px-4 py-2 rounded-lg shadow-lg flex items-center '
      + 'min-w-40 justify-center text-sm',
  },
})
