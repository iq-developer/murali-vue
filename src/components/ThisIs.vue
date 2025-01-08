<script setup lang="ts">
import { ref } from 'vue'
import NextButton from './NextButton.vue'
import { activateClasses } from '../utils/helpers'
import type { Class } from '../utils/types'

// Props
const { answer, image, next } = defineProps<{
  answer: string
  image: string
  next: () => void
}>()

// State
const imageClass = ref('opacity-0')
const titleClass = ref('opacity-0')
const imageInnerClass = ref('')
const wordInnerClass = ref('')

// Constants
const classes: Class[] = [
  { name: titleClass, delay: 500, class: 'opacity-100' },
  { name: imageClass, delay: 1000, class: 'opacity-100' },
  { name: imageInnerClass, delay: 1500, class: 'animate-grow' },
  { name: wordInnerClass, delay: 2500, class: 'animate-grow' },
  { name: imageInnerClass, delay: 3000, class: '' },
  { name: imageInnerClass, delay: 3500, class: 'animate-grow' },
]

// Functions

// Computed

// Handlers
const handleImageClick = () => {
  console.log('Image clicked - say hint')
}

// Lifecycle
activateClasses(classes)
</script>

<template>
  <div class="flex flex-col">
    <div
      id="image"
      class="flex justify-center transition-opacity duration-500 pb-20"
      :class="imageClass"
    >
      <img :src="image" :alt="answer" :class="imageInnerClass" />
    </div>

    <div
      id="title"
      class="text-9xl font-bold text-center transition-opacity duration-500"
      :class="titleClass"
    >
      <p :class="wordInnerClass">
        {{ answer }}
      </p>
    </div>
  </div>

  <NextButton :next="next" :delay="4000" />
</template>

<style scoped>
@keyframes grow {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-grow {
  animation: grow 0.5s ease-in-out;
}
</style>
