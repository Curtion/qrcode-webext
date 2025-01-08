import type { ChannelData } from '~/types/channel'

const currentUrl = ref<undefined | string>()

browser.runtime.onMessage.addListener(async (message) => {
  const data = message as ChannelData
  if (data.type === 'onActivated') {
    currentUrl.value = data.data.url
  } else if (data.type === 'onUpdated') {
    console.log(data)
    if (data.data.changeInfo.status === 'complete') {
      currentUrl.value = data.data.tab.url
    }
  }
})

export { currentUrl }
