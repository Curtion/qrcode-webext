import type { ChannelData } from '~/types/channel'

const currentUrl = ref<undefined | string>()
const currentWindowId = ref<undefined | number>()
export const islockedContent = ref(false)

browser.runtime.onMessage.addListener(async (message) => {
  if (islockedContent.value) {
    return
  }
  const data = message as ChannelData
  if (data.type === 'onActivated') {
    if (data.data.windowId === currentWindowId.value) {
      currentUrl.value = data.data.tab.url
    }
  } else if (data.type === 'onUpdated') {
    if (data.data.changeInfo.status === 'complete' && data.data.tab.active) {
      if (data.data.tab.windowId === currentWindowId.value) {
        currentUrl.value = data.data.tab.url
      }
    }
  }
})

async function init() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
  currentWindowId.value = tab.windowId
  currentUrl.value = tab.url
}
init()

export { currentUrl }
