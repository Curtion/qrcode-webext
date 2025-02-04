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

interface DecodeEvent {
  type: 'decode'
  data: {
    base64: string
    tabId: number
  }
}

interface EncodeEvent {
  type: 'encode'
  data: {
    text: string
    tabId: number
  }
}

export type ChannelData = TabActivatedEvent | TabUpdatedEvent | DecodeEvent | EncodeEvent
