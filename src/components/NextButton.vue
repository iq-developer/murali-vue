<script setup lang="ts">
// Props
const { next } = defineProps<{
  next: () => void
  disabled?: boolean
}>()
</script>

<template>
  <div class="flex justify-center transition-opacity duration-500">
    <button
      id="next"
      @click="next()"
      class="text-white rounded w-full bg-blue-400 hover:bg-blue-500"
      :disabled="disabled"
    >
      <v-icon name="hi-arrow-narrow-right" scale="4" />
    </button>
  </div>
</template>
