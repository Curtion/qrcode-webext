import type { ChannelData } from '~/types/channel'

const currentTabId = ref<number>(0)
const currentWindowId = ref<undefined | number>()
const tabs = ref<{
  [tabId: number]: {
    url?: string
    islocked: boolean
  }
}>({})

browser.runtime.onMessage.addListener(async (message) => {
  const data = message as ChannelData
  if (data.type === 'onActivated') {
    if (data.data.windowId === currentWindowId.value) {
      const tabId = data.data.tab.id
      if (tabId && !tabs.value[tabId]) {
        tabs.value[tabId] = {
          url: data.data.tab.url,
          islocked: false,
        }
      }
      currentTabId.value = tabId ?? 0
    }
  } else if (data.type === 'onUpdated') {
    if (data.data.changeInfo.status === 'complete' && data.data.tab.active) {
      if (data.data.tab.windowId === currentWindowId.value) {
        const tabId = data.data.tab.id
        if (tabId) {
          if (!tabs.value[tabId]) {
            tabs.value[tabId] = {
              url: data.data.tab.url,
              islocked: false,
            }
          } else {
            if (tabs.value[tabId].islocked) {
              return
            }
            tabs.value[tabId].url = data.data.tab.url
          }
        }
      }
    }
  }
})

async function init() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
  currentWindowId.value = tab.windowId
  if (tab.id) {
    currentTabId.value = tab.id
    tabs.value[tab.id] = {
      url: tab.url,
      islocked: false,
    }
  }
}
init()

export { currentTabId, tabs }
