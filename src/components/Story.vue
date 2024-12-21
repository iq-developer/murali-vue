<script setup lang="ts">
import { ref } from 'vue'

// Types
type Word = {
  word: string
  delay: number
}
type Class = {
  name: typeof imageClass | typeof titleClass | typeof nextClass
  delay: number
}

type Image = {
  src: string
  alt: string
}

// State
const progress = ref(0)
const imageClass = ref('opacity-0')
const titleClass = ref('opacity-0')
const nextClass = ref('opacity-0')
const highlightIndex = ref(0)

// Data
const words: Word[] = [
  { word: 'Haribol', delay: 3000 },
  { word: 'monkeys', delay: 4000 },
]
const classes: Class[] = [
  { name: imageClass, delay: 100 },
  { name: titleClass, delay: 2000 },
  { name: nextClass, delay: 3000 },
]

const images: Image[] = [
  { src: '/src/assets/abc/1.png', alt: '' },
  { src: '/src/assets/abc/2.png', alt: '' },
  { src: '/src/assets/abc/3.png', alt: '' },
]

// Functions
const highlightWords = (words: Word[]): void => {
  words.forEach((item) => {
    setTimeout(() => {
      highlightIndex.value++
    }, item.delay)
  })
}
const showClasses = (classes: Class[]): void => {
  classes.forEach((item) => {
    setTimeout(() => {
      item.name.value = 'opacity-100'
    }, item.delay)
  })
}

// Handlers
const handleButtonClick = () => {
  console.log('Button clicked')
}

// Lifecycle
showClasses(classes)
highlightWords(words)
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center bg-slate-100">
    <div class="flex flex-col justify-between gap-5 max-w-4xl w-full h-full bg-white p-6">
      <div class="flex justify-between items-center">
        <div id="close">
          <button
            @click="handleButtonClick"
            class="text-2xl p-2 mr-2 text-gray-500 rounded hover:bg-gray-100"
          >
            <v-icon name="md-close-round" fill="Gainsboro" scale="2" />
          </button>
        </div>

        <div class="w-full h-4 bg-gray-200 rounded overflow-hidden">
          <div
            class="h-full bg-blue-400 hover:bg-blue-500"
            :style="{ width: progress + '%' }"
          ></div>
        </div>

        <div id="score">
          <button
            @click="handleButtonClick"
            class="text-2xl p-2 ml-3 text-gray-500 rounded hover:bg-gray-100"
          >
            <v-icon name="fa-heart" fill="Gainsboro" scale="2" />
          </button>
        </div>
      </div>

      <div
        id="image"
        class="flex justify-center transition-opacity duration-500"
        :class="imageClass"
      >
        <img :src="images[0].src" alt="Book" class="w-64 h-64" />
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
            :class="index === highlightIndex && 'bg-green-100'"
            >{{ item.word + ' ' }}</span
          >
        </p>
      </div>

      <div class="flex justify-center transition-opacity duration-500" :class="nextClass">
        <button
          id="next"
          @click="handleButtonClick"
          class="bg-blue-400 text-white rounded hover:bg-blue-500 w-full"
        >
          <v-icon name="hi-arrow-narrow-right" scale="4" />
        </button>
      </div>
    </div>
  </div>
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
