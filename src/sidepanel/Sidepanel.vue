<script setup lang="ts">
import type { Tabs } from 'webextension-polyfill'
import { storageDemo } from '~/logic/storage'

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

const title = ref<undefined | string>('')

async function getCurrentTab() {
  browser.tabs.onActivated.addListener(async ({ tabId }) => {
    let tab: Tabs.Tab
    try {
      tab = await browser.tabs.get(tabId)
    } catch {
      return
    }
    console.log(tab)
    title.value = tab.url
  })
}

getCurrentTab()
</script>

<template>
  <main class="w-full px-4 py-5 text-center text-gray-700">
    <Logo />
    <div>{{ title }}</div>
    <SharedSubtitle />

    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </main>
</template>
