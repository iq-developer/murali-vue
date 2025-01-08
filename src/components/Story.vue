<script setup lang="ts">
import { ref, computed } from 'vue'
import NextButton from './NextButton.vue'
import { activateClasses } from '../utils/helpers'
import type { Class, Word, CommonSlidePart } from '../utils/types'

// Props
const { slide, path, next } = defineProps<{
  slide: StorySlide
  path: string
  next: () => void
}>()

// Types
type StorySlide = {
  image: string | boolean
  words: Word[]
} & CommonSlidePart

// State
const imageClass = ref('opacity-0')
const titleClass = ref('opacity-0')
const highlightIndex = ref(0)
const titleClassDelay = 1500

// Computed
const alt = computed(() => words.map(getWord).join(''))

const computedImage = computed(() => {
  if (image === true) return `${path}.png`
  if (typeof image === 'string') return image
  throw new Error('Image is not defined')
})

// Constants
const { words, image } = slide

const classes: Class[] = [
  { name: imageClass, delay: 500, class: 'opacity-100' },
  { name: titleClass, delay: titleClassDelay, class: 'opacity-100' },
]

// Functions
const highlightWords = (words: Word[]): void => {
  words.forEach((word, index) => {
    const delay = (typeof word === 'string' ? (index + 1) * 1000 : word.delay) + titleClassDelay

    setTimeout(() => {
      highlightIndex.value++
    }, delay)
  })
}

const getWord = (word: Word): string => {
  if (typeof word === 'string') return `${word} `
  return `${word.word} `
}

// Handlers
const handleImageClick = () => {
  console.log('Image clicked - say hint')
}

// Lifecycle
activateClasses(classes)
highlightWords(words)
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-center transition-opacity duration-500 pb-20" :class="imageClass">
      <img :src="computedImage" :alt="alt" @click="handleImageClick" />
    </div>

    <div
      id="title"
      class="text-4xl font-bold text-center transition-opacity duration-500"
      :class="titleClass"
    >
      <p>
        <span
          v-for="(item, index) in words"
          :key="index"
          :class="index === highlightIndex && 'bg-rose-100'"
          >{{ getWord(item) }}
        </span>
      </p>
    </div>
  </div>

  <NextButton :next="next" />
</template>
