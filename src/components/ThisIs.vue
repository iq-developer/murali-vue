<script setup lang="ts">
import { ref, computed } from 'vue'
import NextButton from './NextButton.vue'
import { activateClasses } from '../utils/helpers'
import type { Class, CommonSlidePart } from '../utils/types'

// Props
const { slide, path, next } = defineProps<{
  slide: ThisIsSlide
  path: string
  next: () => void
}>()

// Types
type ThisIsSlide = {
  image: string | boolean
  answer: string
} & CommonSlidePart

// State
const imageClass = ref('opacity-0')
const titleClass = ref('opacity-0')
const imageInnerClass = ref('')
const wordInnerClass = ref('')

// Constants
const { image, answer } = slide

const classes: Class[] = [
  { name: titleClass, delay: 500, class: 'opacity-100' },
  { name: imageClass, delay: 1000, class: 'opacity-100' },
  { name: imageInnerClass, delay: 1500, class: 'animate-grow' },
  { name: wordInnerClass, delay: 2500, class: 'animate-grow' },
  { name: imageInnerClass, delay: 3000, class: '' },
  { name: imageInnerClass, delay: 3500, class: 'animate-grow' },
]

// Computed
const computedImage = computed(() => {
  if (image === true) return `${path}.png`
  if (typeof image === 'string') return image
  throw new Error('Image is not defined')
})

// Handlers
const handleImageClick = () => {
  console.log('Image clicked - say hint')
}
const handleAnswerClick = () => {
  console.log('Answer clicked - say hint')
}

// Lifecycle
activateClasses(classes)
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-center transition-opacity duration-500 pb-20" :class="imageClass">
      <img :src="computedImage" :alt="answer" :class="imageInnerClass" @click="handleImageClick" />
    </div>

    <div class="text-9xl font-bold text-center transition-opacity duration-500" :class="titleClass">
      <p :class="wordInnerClass" @click="handleAnswerClick">
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
