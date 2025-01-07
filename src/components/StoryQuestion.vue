<script setup lang="ts">
import { reactive, computed } from 'vue'
import { playAudio } from '../utils/helpers.ts'
import type { ComputedRef } from 'vue'
import { randomizeArrayItems } from '../utils/helpers'

// Props
const { question, answers, next } = defineProps<{
  question: string
  questionType: 'sound' | 'image' | 'word' // TODO: change source by questionType
  answers: Answer[]
  next: () => void
}>()

// Types
type Answer = {
  image: string
  alt: string
  answer?: boolean
  userAnswer?: 'selected' | 'correct' | 'wrong' | null
}

// Constants
const CORRECT_DELAY = 3000
const WRONG_DELAY = 1000

// State
const userAnswers = reactive(randomizeArrayItems(answers))

// Computed
const isSelectAll: ComputedRef<boolean> = computed(() =>
  userAnswers.every((answer) => answer.answer),
)

const isSelectSome = computed(() => {
  const answersQuantity = userAnswers.filter((answer) => answer.answer).length
  return answersQuantity > 1 && answersQuantity < userAnswers.length
})

const showResultButton = computed(
  () => isSelectSome.value && userAnswers.some((item) => item.userAnswer === 'selected'),
)
const resultButtonClass = computed(() => (showResultButton.value ? 'opacity-100' : 'opacity-0'))

const resultCorrect = () => {
  playAudio('/src/assets/shared/correct.mp3')
  setTimeout(() => {
    for (let item of userAnswers) {
      item.userAnswer = null
    }
    next()
  }, CORRECT_DELAY)
}

const resultWrong = () => {
  playAudio('/src/assets/shared/hmm.mp3')
  setTimeout(() => {
    for (let item of userAnswers) {
      item.userAnswer = null
    }
  }, WRONG_DELAY)
}

// Handlers
const handleAnswerClick = (isCorrect: boolean, index: number) => {
  userAnswers[index].userAnswer = userAnswers[index].userAnswer === 'selected' ? null : 'selected'

  if (isSelectAll.value) {
    if (userAnswers.every((item) => item.userAnswer === 'selected')) {
      for (let item of userAnswers) {
        item.userAnswer = 'correct'
      }
      resultCorrect()
    }
  } else if (isCorrect) {
    userAnswers[index].userAnswer = 'correct'
    resultCorrect()
  } else {
    userAnswers[index].userAnswer = 'wrong'
    resultWrong()
  }
}

const handleResultButtonClick = () => {
  if (userAnswers.every((item) => !!item.userAnswer === !!item.answer)) {
    for (let item of userAnswers) {
      item.userAnswer = item.userAnswer === 'selected' ? 'correct' : item.userAnswer
    }
    resultCorrect()
  } else {
    for (let item of userAnswers) {
      item.userAnswer = item.userAnswer === 'selected' ? 'wrong' : item.userAnswer
    }
    resultWrong()
  }
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
      <div v-for="(answer, i) in userAnswers" :key="i" class="flex items-center justify-center">
        <button
          class="h-50 w-50 bg-white hover:bg-blue-400 rounded-xl border-4 border-gray-200 m-2 p-2"
          :class="userAnswers[i].userAnswer"
          @click="handleAnswerClick(answer.answer ?? false, i)"
          :disabled="
            userAnswers[i].userAnswer === 'correct' || userAnswers[i].userAnswer === 'wrong'
          "
        >
          <img :src="answer.image" :alt="answer.alt" />
        </button>
      </div>
    </div>
  </div>

  <button
    @click="handleResultButtonClick"
    class="text-white rounded w-full bg-blue-400 hover:bg-blue-500 transition-opacity duration-500"
    :disabled="!showResultButton"
    :class="resultButtonClass"
  >
    <v-icon name="hi-arrow-narrow-right" scale="4" />
  </button>
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
.selected {
  background-color: blue;
}
</style>
