<script setup lang="ts">
import { reactive, computed } from 'vue'
import { playAudio } from '../utils/helpers.ts'
import type { ComputedRef } from 'vue'
import { randomizeArrayItems } from '../utils/helpers'

// Types
type WordAnswer = {
  word: string
  answer?: boolean
  userAnswer?: 'selected' | 'correct' | 'wrong' | null
}

type ImageAnswer = {
  image: string
  alt: string
  answer?: boolean
  userAnswer?: 'selected' | 'correct' | 'wrong' | null
}

type Answer = WordAnswer | ImageAnswer

type Slide = {
  answers: Answer[]
  word?: string
  image?: string | boolean
  sound?: string | boolean
}

// Props
const { slide, path, next } = defineProps<{
  slide: Slide
  path: string
  next: () => void
}>()

// Constants
const CORRECT_DELAY = 3000
const WRONG_DELAY = 1000
const { answers, word, image, sound } = slide

// State
const userAnswers = reactive(randomizeArrayItems(answers))

// Computed
const isSelectAll: ComputedRef<boolean> = computed(() =>
  userAnswers.every((answer) => answer.answer),
)
const computedImage = computed(() => {
  if (image === true) return `${path}.png`
  if (typeof image === 'string') return image
  // TODO: throw error in dev mode and return default image in prod mode
  throw new Error('Image is not defined')
})

const computedSound = computed(() => {
  if (sound === true) return `${path}.mp3`
  if (typeof sound === 'string') return sound
  // TODO: throw error in dev mode and return default image in prod mode
  throw new Error('Sound is not defined')
})

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

const handleQuestionClick = () => {
  if ('sound' in slide) {
    playAudio(computedSound.value)
  }
  // other logic
}

// Error handling
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <!-- First half content -->
      <button
        class="h-32 w-32 lg:h-48 lg:w-48 rounded-xl font-bold"
        :class="
          'image' in slide || 'word' in slide
            ? 'bg-white hover:bg-blue-200'
            : 'bg-blue-400 hover:bg-blue-500'
        "
        @click="handleQuestionClick"
      >
        <v-icon v-if="'sound' in slide" name="gi-speaker" fill="white" scale="5" />
        <img v-if="'image' in slide" :src="computedImage" alt="" />
        <p class="text-9xl" v-if="'word' in slide">{{ word }}</p>
      </button>
    </div>
    <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Second half content -->
      <div v-for="(answer, i) in userAnswers" :key="i" class="flex items-center justify-center">
        <button
          class="h-48 w-48 bg-white hover:bg-blue-200 rounded-xl border-4 border-gray-200 m-2 p-2 text-9xl font-bold"
          :class="userAnswers[i].userAnswer"
          @click="handleAnswerClick(answer.answer ?? false, i)"
          :disabled="
            userAnswers[i].userAnswer === 'correct' || userAnswers[i].userAnswer === 'wrong'
          "
        >
          <img v-if="'image' in answer" :src="answer.image" :alt="answer.alt" />
          <p v-if="'word' in answer">{{ answer.word }}</p>
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
  background-color: #ef4444;
}
.correct {
  animation: jump 1s;
  background-color: #84cc16;
}
.selected {
  background-color: #3b82f6;
}
</style>
