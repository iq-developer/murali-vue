<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../data/levels.json'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useNavigationStore } from '../stores/navigationStore'
import type { AllSlideParts } from '../utils/types'
import Story from '../components/Story.vue'
import StoryQuestion from './StoryQuestion.vue'
import AssembleWord from './AssembleWord.vue'
import ThisIs from './ThisIs.vue'
import DragTo from './DragTo.vue'
import SoapBubbles from './SoapBubbles.vue'

// Constants
const navigationStore = useNavigationStore()
const route = useRoute()
const router = useRouter()
const levelNumber = +route?.params?.levelNumber
const taskNumber = +route?.params?.taskNumber
const levelData = data[levelNumber - 1]
const slides = levelData.tasks[taskNumber - 1].slides
const lastSlideIndex = slides.length - 1
const isDevMode = true

// State
const progress = ref(0)
const slideIndex = ref(0)

// Computed
const progressUnit = computed(() => 100 / slides.length)

// Handlers
const handleScoreClick = () => {
  console.log('Score clicked')
}
const next = () => {
  if (slideIndex.value === lastSlideIndex) {
    navigationStore.increaseTaskId()
    router.push(`/level${levelNumber}/`)
  } else {
    slideIndex.value++
    progress.value = (slideIndex.value + 1) * progressUnit.value
  }
}

// Error handling
if (!levelData) {
  throw new Error(`Level ${levelNumber} not found`)
}
if (!levelData.tasks[taskNumber - 1]) {
  throw new Error(`Task ${taskNumber} not found`)
}
if (!slides) {
  throw new Error(`Slides not found`)
}
if (slides.length === 0) {
  throw new Error(`Slides are empty`)
}

// Lifecycle
setTimeout(() => {
  progress.value = (slideIndex.value + 1) * progressUnit.value
}, 500)
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
      <template v-for="(slide, index) in slides">
        <div v-if="index === slideIndex" class="flex-1 flex flex-col justify-between">
          <button
            v-if="isDevMode"
            @click="next"
            class="absolute bottom-0 right-0 m-4 p-2 rounded-full"
          >
            {{ slide.id }}
          </button>
          <Story
            v-if="slide.slideType === 'story'"
            :slide
            :path="`/src/assets/level${levelNumber}/task${taskNumber}/${index + 1}`"
            :next
          />
          <StoryQuestion
            v-else-if="slide.slideType === 'storyQuestion'"
            :slide
            :path="`/src/assets/level${levelNumber}/task${taskNumber}/${index + 1}`"
            :next
          />
          <AssembleWord
            v-else-if="slide.slideType === 'assembleWord'"
            :slide
            :path="`/src/assets/level${levelNumber}/task${taskNumber}/${index + 1}`"
            :next
          />
          <ThisIs
            v-else-if="slide.slideType === 'thisIs'"
            :slide
            :path="`/src/assets/level${levelNumber}/task${taskNumber}/${index + 1}`"
            :next
          />
          <DragTo
            v-else-if="slide.slideType === 'dragTo'"
            :slide
            :path="`/src/assets/level${levelNumber}/task${taskNumber}/${index + 1}`"
            :next
          />
          <SoapBubbles
            v-else-if="slide.slideType === 'soapBubbles'"
            :slide
            :path="`/src/assets/level${levelNumber}/task${taskNumber}/${index + 1}`"
            :next
          />
        </div>
      </template>
    </div>
  </div>
</template>
