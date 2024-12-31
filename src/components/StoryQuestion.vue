<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
const { question, answers, next } = defineProps<{
  question: string
  answers: Answer[]
  next: () => void
}>()

// Types
type Answer = {
  image: string
  alt: string
  answer?: boolean
}

// Constants
const CORRECT_DELAY = 3000
const WRONG_DELAY = 1000

// State
const resultClass = ref('')
const clickedButtonIndex = ref<number | null>(null)

// Computed
const randomAnswers = computed(() => randomize(answers))

// Handlers
const handleAnswerClick = (isCorrect: boolean, index: number) => {
  clickedButtonIndex.value = index
  if (isCorrect) {
    playAudio('/src/assets/shared/correct.mp3')
    resultClass.value = 'correct'
    setTimeout(() => {
      resultClass.value = ''
      clickedButtonIndex.value = null
      next()
    }, CORRECT_DELAY)
  } else {
    playAudio('/src/assets/shared/hmm.mp3')
    resultClass.value = 'wrong'
    setTimeout(() => {
      resultClass.value = ''
      clickedButtonIndex.value = null
    }, WRONG_DELAY)
  }
}

// Helpers
const playAudio = (src: string): void => {
  const audio = new Audio(src)
  audio.play()
}

function randomize<T>(array: T[]): T[] {
  return array
    .map((item) => ({ ...item, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ sortKey, ...item }) => item as T)
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <!-- First half content -->
      <button
        class="h-30 w-30 lg:h-40 lg:w-40 rounded-xl bg-blue-400 hover:bg-blue-500"
        @click="playAudio(question)"
      >
        <v-icon name="gi-speaker" fill="white" scale="5" />
      </button>
    </div>
    <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Second half content -->
      <div v-for="(answer, i) in randomAnswers" :key="i" class="flex items-center justify-center">
        <button
          class="h-50 w-50 bg-white hover:bg-blue-100 rounded-xl border-4 border-gray-200 m-2 p-2"
          :class="[clickedButtonIndex === i ? resultClass : '']"
          @click="handleAnswerClick(answer.answer ?? false, i)"
          :disabled="resultClass === 'correct' || resultClass === 'wrong'"
        >
          <img :src="answer.image" :alt="answer.alt" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}
@keyframes jump {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.wrong {
  animation: shake 0.5s;
  background-color: tomato;
}
.correct {
  animation: jump 1s;
  background-color: yellowGreen;
}
</style>
