<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  message: string
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'destroy'): void
}>()
const visible = ref(false)
let timer: number | null = null

function hide() {
  visible.value = false
  if (timer) {
    clearTimeout(timer)
  }
  setTimeout(() => {
    emit('destroy')
  }, 300)
}

onMounted(() => {
  visible.value = true
  timer = setTimeout(hide, props.duration || 1000) as unknown as number
})
</script>

<template>
  <transition name="toast">
    <div v-if="visible" class="toast" @click="hide">
      <div class="toast-content">
        {{ message }}
      </div>
    </div>
  </transition>
</template>
