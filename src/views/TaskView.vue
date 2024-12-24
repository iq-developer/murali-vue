<script setup lang="ts">
import { ref } from 'vue'
import data from '../data/levels.json'
import { useRoute } from 'vue-router'
import Story from '@/components/Story.vue'

// Variables // TODO: throw error on each wrong step
const route = useRoute()
const levelNumber = +route?.params?.levelNumber
const taskNumber = +route?.params?.taskNumber
const levelData = data[levelNumber]
const slides = levelData.tasks[taskNumber].slides

// State
const progress = ref(0)
const nextClass = ref('opacity-0')
const slideIndex = ref(0)

// Handlers
const handleCloseClick = () => {
  console.log('Close clicked')
}
const handleScoreClick = () => {
  console.log('Score clicked')
}
const handleNextClick = () => {
  console.log('Next clicked')
  slideIndex.value++
  nextClass.value = 'opacity-0'
  setTimeout(() => {
    nextClass.value = 'opacity-100'
  }, 3000)
}

setTimeout(() => {
  nextClass.value = 'opacity-100'
}, 3000)
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center bg-slate-100">
    <div class="flex flex-col justify-between gap-5 max-w-4xl w-full h-full bg-white p-6">
      <div class="flex justify-between items-center">
        <div id="close">
          <button
            @click="handleCloseClick"
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

        <div id="score" hidden>
          <button
            @click="handleScoreClick"
            class="text-2xl p-2 ml-3 text-gray-500 rounded hover:bg-gray-100"
          >
            <v-icon name="fa-heart" fill="Gainsboro" scale="2" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <template v-for="(slide, index) in slides">
        <div v-if="index === slideIndex">
          <Story
            v-if="slide.slideType === 'story'"
            :words="slide.words"
            :image="`/src/assets/level${levelNumber}/task${taskNumber}/${index}.png`"
          />
        </div>
      </template>

      <div class="flex justify-center transition-opacity duration-500" :class="nextClass">
        <button
          id="next"
          @click="handleNextClick"
          class="bg-blue-400 text-white rounded hover:bg-blue-500 w-full"
        >
          <v-icon name="hi-arrow-narrow-right" scale="4" />
        </button>
      </div>
      <!-- /Content -->
    </div>
  </div>
</template>
