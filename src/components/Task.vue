<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../data/levels.json'
import { RouterLink, useRoute } from 'vue-router'
import Story from '../components/Story.vue'
import StoryQuestion from './StoryQuestion.vue'

// Constants // TODO: throw error on each wrong step
const route = useRoute()
const levelNumber = +route?.params?.levelNumber
const taskNumber = +route?.params?.taskNumber
const levelData = data[levelNumber - 1]
const slides = levelData.tasks[taskNumber - 1].slides
const NEXT_DELAY = 300 //3000

// State
const progress = ref(0)
const nextClass = ref('opacity-0')
const disableNext = ref(true)
const slideIndex = ref(0)

// Computed
const progressUnit = computed(() => 100 / slides.length)

// Handlers
const handleScoreClick = () => {
  console.log('Score clicked')
}
const handleNextClick = () => {
  slideIndex.value++
  progress.value = (slideIndex.value + 1) * progressUnit.value
  nextClass.value = 'opacity-0'
  disableNext.value = true
  setTimeout(() => {
    disableNext.value = false
    nextClass.value = 'opacity-100'
  }, NEXT_DELAY)
}

// Execution
setTimeout(() => {
  progress.value = (slideIndex.value + 1) * progressUnit.value
}, 500)
setTimeout(() => {
  nextClass.value = 'opacity-100'
  disableNext.value = false
}, NEXT_DELAY)
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center bg-slate-100">
    <div class="flex flex-col justify-between gap-5 max-w-4xl w-full h-full bg-white p-6">
      <div class="flex justify-between items-center">
        <div id="close">
          <RouterLink :to="`/level${levelNumber}/`">
            <div class="text-2xl p-2 mr-2 text-gray-500 rounded hover:bg-gray-100">
              <v-icon name="md-close-round" fill="Gainsboro" scale="2" />
            </div>
          </RouterLink>
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
        <div v-if="index === slideIndex" class="flex-1">
          <Story
            v-if="slide.slideType === 'story'"
            :words="slide.words"
            :image="`/src/assets/level${levelNumber}/task${taskNumber}/${index + 1}.png`"
          />
          <StoryQuestion
            v-else-if="slide.slideType === 'storyQuestion'"
            :question="`/src/assets/level${levelNumber}/task${taskNumber}/${index + 1}.mp3`"
            :answers="slide.answers"
            :next="handleNextClick"
          />
        </div>
      </template>

      <div class="flex justify-center transition-opacity duration-500" :class="nextClass">
        <button
          id="next"
          @click="handleNextClick"
          class="text-white rounded w-full bg-blue-400 hover:bg-blue-500"
          :disabled="disableNext"
        >
          <v-icon name="hi-arrow-narrow-right" scale="4" />
        </button>
      </div>
      <!-- /Content -->
    </div>
  </div>
</template>
