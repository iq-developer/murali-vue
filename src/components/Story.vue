<script setup lang="ts">
import { ref, computed } from 'vue'
import NextButton from './NextButton.vue'

// Props
const { words, image, next } = defineProps<{
  words: Word[]
  image: string
  next: () => void
}>()

// Types
type Word =
  | {
      word: string
      delay: number
    }
  | string
type Class = {
  name: typeof imageClass | typeof titleClass
  delay: number
}

// State
const imageClass = ref('opacity-0')
const titleClass = ref('opacity-0')
const highlightIndex = ref(0)
const titleClassDelay = 1500

// Constants
const classes: Class[] = [
  { name: imageClass, delay: 500 },
  { name: titleClass, delay: titleClassDelay },
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
const showClasses = (classes: Class[]): void => {
  classes.forEach((item) => {
    setTimeout(() => {
      item.name.value = 'opacity-100'
    }, item.delay)
  })
}
const getWord = (word: Word): string => {
  if (typeof word === 'string') return `${word} `
  return `${word.word} `
}

// Computed
const alt = computed(() => words.map(getWord).join(''))

// Handlers
const handleImageClick = () => {
  console.log('Image clicked - say hint')
}

// Lifecycle
showClasses(classes)
highlightWords(words)
</script>

<template>
  <div class="flex flex-col">
    <div
      id="image"
      class="flex justify-center transition-opacity duration-500 pb-20"
      :class="imageClass"
    >
      <img :src="image" :alt="alt" />
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

<style scoped>
.highlight {
  background: yellow; /* Old browsers */
  background: linear-gradient(to right, yellow 50%, white 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: 0.5s;
}
.highlight:hover {
  background-position: left bottom;
}
</style>
