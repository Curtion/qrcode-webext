<script setup lang="ts">
import { currentUrl } from '~/logic/tab'
import { generateQR } from '~/logic/qrcode'

const qrdata = ref<undefined | string>()

watchEffect(async () => {
  if (!currentUrl.value) {
    return
  }
  qrdata.value = await generateQR(currentUrl.value)
})

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-full h-screen px-4 py-5 text-gray-700 bg-[#F7F7F7] flex items-center flex-col">
    <img :src="qrdata" alt="二维码">
    <textarea
      v-model="currentUrl" class="w-full min-h-50 mt-2 p-2 text-sm text-gray-700 bg-white
         rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500
         outline-none transition duration-200 hover:border-blue-400
         resize-y
         scrollbar:w-1.5 scrollbar:h-1.5
         scrollbar-track:bg-gray-100 dark:scrollbar-track:bg-gray-700
         scrollbar-thumb:bg-gray-300 dark:scrollbar-thumb:bg-gray-600
         hover:scrollbar-thumb:bg-gray-400"
    />
    <button class="btn mt-2" @click="openOptionsPage">
      打开设置页
    </button>
  </main>
</template>
