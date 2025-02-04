// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

// remove or turn this off if you don't use side panel
const USE_SIDE_PANEL = true

// to toggle the sidepanel with the action button in chromium:
if (USE_SIDE_PANEL) {
  // @ts-expect-error missing types
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => console.error(error))
}

browser.runtime.onInstalled.addListener((): void => {
  browser.contextMenus.create({
    id: 'main',
    title: 'QRcode Tools',
    contexts: ['all'],
  })
})

browser.runtime.onSuspend.addListener(() => {
  browser.contextMenus.removeAll()
})

async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'main' && tab?.id !== undefined) {
    if (info.selectionText) {
      await browser.runtime.sendMessage(undefined, { type: 'encode', data: {
        text: info.selectionText,
        tabId: tab.id,
      } })
      return
    }
    if (info.mediaType === 'image' && info.srcUrl) {
      const base64 = info.srcUrl.startsWith('data:')
        ? info.srcUrl
        : await urlToBase64(info.srcUrl)

      await browser.runtime.sendMessage(undefined, { type: 'decode', data: {
        base64,
        tabId: tab.id,
      } })
      return
    }
    if (info.linkUrl) {
      await browser.runtime.sendMessage(undefined, { type: 'encode', data: {
        text: info.linkUrl,
        tabId: tab.id,
      } })
      return
    }
    const result = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.captureCanvas(),
    })
    if (result[0].result) {
      await browser.runtime.sendMessage(undefined, { type: 'decode', data: {
        base64: result[0].result,
        tabId: tab.id,
      } })
    }
  }
})

browser.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
  try {
    const tab = await browser.tabs.get(tabId)
    await browser.runtime.sendMessage(undefined, { type: 'onActivated', data: { tab, windowId } })
  } catch (e: unknown) {
    console.error(e)
  }
})

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    await browser.runtime.sendMessage(undefined, { type: 'onUpdated', data: { tabId, changeInfo, tab } })
  } catch (e: unknown) {
    console.error(e)
  }
})
