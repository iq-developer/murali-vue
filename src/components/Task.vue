<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../data/levels.json'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Story from '../components/Story.vue'
import StoryQuestion from './StoryQuestion.vue'
import AssembleWord from './AssembleWord.vue'
import { useNavigationStore } from '../stores/navigationStore'
import ThisIs from './ThisIs.vue'
import DragTo from './DragTo.vue'
import SoapBubbles from './SoapBubbles.vue'

// Store
const navigationStore = useNavigationStore()

// Constants // TODO: throw error on each wrong step
const route = useRoute()
const router = useRouter()
const levelNumber = +route?.params?.levelNumber
const taskNumber = +route?.params?.taskNumber
const levelData = data[levelNumber - 1]
const slides = levelData.tasks[taskNumber - 1].slides
const lastSlideIndex = slides.length - 1

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

// Execution
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
          <Story
            v-if="slide.slideType === 'story'"
            :words="slide.words"
            :image="`/src/assets/level${levelNumber}/task${taskNumber}/${index + 1}.png`"
            :next="next"
          />
          <StoryQuestion
            v-else-if="slide.slideType === 'storyQuestion'"
            :question="`/src/assets/level${levelNumber}/task${taskNumber}/${index + 1}.mp3`"
            :answers="slide.answers"
            :next="next"
          />
          <AssembleWord
            v-else-if="slide.slideType === 'assembleWord'"
            :word="slide.word"
            :image="slide.image"
            :next="next"
          />
          <ThisIs
            v-else-if="slide.slideType === 'thisIs'"
            :word="slide.word"
            :image="slide.image"
            :next="next"
          />
          <DragTo
            v-else-if="slide.slideType === 'dragTo'"
            :word="slide.word"
            :image="slide.image"
            :next="next"
          />
          <SoapBubbles
            v-else-if="slide.slideType === 'bubbles'"
            :answer="slide.answer"
            :next="next"
          />
        </div>
      </template>
    </div>
  </div>
</template>
