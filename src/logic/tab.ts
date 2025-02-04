import { decode } from 'qr-decode-wechat'
import type { ChannelData } from '~/types/channel'
import showToast from '~/logic/toast'

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
  } else if (data.type === 'encode') {
    tabs.value[data.data.tabId].url = data.data.text
    tabs.value[data.data.tabId].islocked = true
  } else if (data.type === 'decode') {
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
        tabs.value[data.data.tabId].url = result[0]?.text
        showToast('解析二维码成功')
      } else {
        showToast('解析二维码失败')
      }
    }
    img.src = data.data.base64
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
