<script setup lang="ts">
import { decode } from 'qr-decode-wechat'
import { currentTabId, tabs } from '~/logic/tab'
import { generateQR } from '~/logic/qrcode'
import showToast from '~/logic/toast'
import { getMessage } from '~/logic/i18n'

const qrdata = ref<undefined | string>()

watchEffect(async () => {
  const url = tabs.value[currentTabId.value]?.url
  if (!url) {
    return
  }
  qrdata.value = await generateQR(url)
})

function handleInputChange() {
  // TODO 可以在这里设置isLocked状态, 用于锁定当前标签页的url
}

function handleDataTransferItem(list: DataTransferItem[]) {
  const fileItems = list.find(item => item.kind === 'file')
  if (fileItems) {
    const file = fileItems.getAsFile()
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            return
          }
          ctx.drawImage(img, 0, 0)
          const result = await decode(canvas)
          if (result[0]?.text) {
            tabs.value[currentTabId.value].url = result[0]?.text
            showToast(getMessage('parseQRSuccess'))
          } else {
            showToast(getMessage('parseQRFailure'))
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  } else {
    const textItems = list.find(item => item.kind === 'string' && item.type === 'text/plain')
    if (!textItems) {
      return
    }
    textItems.getAsString((text) => {
      tabs.value[currentTabId.value].url = text
      showToast(getMessage('generateQRSuccess'))
    })
  }
}

// function openOptionsPage() {
//   browser.runtime.openOptionsPage()
// }

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const dt = event.dataTransfer
  if (!dt?.items) {
    return
  }
  const list = Array.from(dt.items)
  handleDataTransferItem(list)
}

function handlePaste(event: ClipboardEvent) {
  if (event.target instanceof HTMLTextAreaElement) {
    // 如果焦点在textarea上, 则不处理
    return
  }
  event.preventDefault()
  const items = event.clipboardData?.items
  if (!items) {
    return
  }
  const list = Array.from(items)
  handleDataTransferItem(list)
}

onMounted(() => {
  document.addEventListener('dragover', handleDragOver)
  document.addEventListener('drop', handleDrop)
  document.addEventListener('paste', handlePaste)
})

onBeforeUnmount(() => {
  document.removeEventListener('dragover', handleDragOver)
  document.removeEventListener('drop', handleDrop)
  document.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <main class="w-full h-screen px-4 py-5 text-gray-700 bg-[#F7F7F7] flex items-center flex-col">
    <img :src="qrdata" alt="QRCode">
    <textarea
      v-model="tabs[currentTabId].url"
      class="w-full min-h-50 mt-2 p-2 text-sm text-gray-700 bg-white
         rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500
         outline-none transition duration-200 hover:border-blue-400
         resize-y
         scrollbar:w-1.5 scrollbar:h-1.5
         scrollbar-track:bg-gray-100 dark:scrollbar-track:bg-gray-700
         scrollbar-thumb:bg-gray-300 dark:scrollbar-thumb:bg-gray-600
         hover:scrollbar-thumb:bg-gray-400"
      @change="handleInputChange"
    />
    <!-- <button class="btn mt-2" @click="openOptionsPage">
      打开设置页
    </button> -->
    <div class="text-sm text-gray-500 mt-4 px-4 py-2 bg-gray-100 rounded-md">
      {{ getMessage('operationGuide') }}
      <ul class="mt-1 list-disc list-inside">
        <li>{{ getMessage('dragDropTip') }}</li>
        <li>{{ getMessage('pasteTip') }}</li>
        <li>{{ getMessage('contextMenuTip') }}</li>
      </ul>
    </div>
  </main>
</template>
