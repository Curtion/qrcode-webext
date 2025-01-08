import type { Tabs } from 'webextension-polyfill'

interface TabActivatedEvent {
  type: 'onActivated'
  data: {
    tab: Tabs.Tab
    windowId: number
  }
}

interface TabUpdatedEvent {
  type: 'onUpdated'
  data: {
    tabId: number
    changeInfo: Tabs.OnUpdatedChangeInfoType
    tab: Tabs.Tab
  }
}
export type ChannelData = TabActivatedEvent | TabUpdatedEvent
