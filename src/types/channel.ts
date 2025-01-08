import type { Tabs } from 'webextension-polyfill'

interface TabActivatedEvent {
  type: 'onActivated'
  data: Tabs.Tab
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
