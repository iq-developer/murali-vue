<script setup lang="ts">
import { ref } from 'vue'

// Props
const { next, delay = 300 } = defineProps<{
  next: () => void
  delay?: number
}>()

// Constants

// State
const nextClass = ref('opacity-0')
const nextDisable = ref(true)

// Handlers
const handleNextClick = () => {
  next()
  nextClass.value = 'opacity-0'
  nextDisable.value = true
  setTimeout(() => {
    nextDisable.value = false
    nextClass.value = 'opacity-100'
  }, delay)
}

// Execution
setTimeout(() => {
  nextClass.value = 'opacity-100'
  nextDisable.value = false
}, delay)
</script>

<template>
  <button
    id="next"
    @click="handleNextClick"
    class="text-white rounded w-full bg-blue-400 hover:bg-blue-500 transition-opacity duration-500"
    :disabled="nextDisable"
    :class="nextClass"
  >
    <v-icon name="hi-arrow-narrow-right" scale="4" />
  </button>
</template>
