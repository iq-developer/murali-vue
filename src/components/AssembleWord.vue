<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { playAudio, getRandomColor, getRandomAngle } from '../utils/helpers.ts'
import type { CommonSlidePart } from '../utils/types'

// Props
const { slide, path, next } = defineProps<{
  slide: AssembleWordSlide
  path: string
  next: () => void
}>()

// Types
type AssembleWordSlide = {
  image: string | boolean
  answer: string
} & CommonSlidePart

// Constants
const { image, answer } = slide

// State
const colorfulLetters = reactive(
  answer.split('').map((char, index) => ({
    char,
    color: getRandomColor(),
    angle: getRandomAngle(),
    x: Math.random() * window.innerWidth * 0.8,
    y: Math.random() * window.innerHeight * 0.8,
    sticked: false,
    index,
  })),
)

const draggingLetter = ref<{ index: number; startX: number; startY: number } | null>(null)

// Computed
const computedImage = computed(() => {
  if (image === true) return `${path}.png`
  if (typeof image === 'string') return image
  throw new Error('Image is not defined')
})

// Drag-and-drop features
function getLetterStyle(letter: any) {
  return {
    color: letter.sticked ? 'black' : letter.color,
    transform: `rotate(${letter.angle}deg) translate(-50%, -50%)`,
    left: `${letter.x}px`,
    top: `${letter.y}px`,
    position: 'absolute',
    cursor: letter.sticked ? 'default' : 'grab',
    fontWeight: 'bold',
    fontSize: '6em',
  }
}

function startDrag(event: MouseEvent | TouchEvent, index: number) {
  if (colorfulLetters[index].sticked) return

  const isTouch = event.type === 'touchstart'
  const startX = isTouch ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX
  const startY = isTouch ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY

  draggingLetter.value = { index, startX, startY }

  const onMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!draggingLetter.value) return

    const currentX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
    const currentY = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY

    const dx = currentX - draggingLetter.value.startX
    const dy = currentY - draggingLetter.value.startY

    const letter = colorfulLetters[draggingLetter.value.index]
    letter.x += dx
    letter.y += dy

    draggingLetter.value.startX = currentX
    draggingLetter.value.startY = currentY
  }

  const onMouseUp = () => {
    if (!draggingLetter.value) return
    const letter = colorfulLetters[draggingLetter.value.index]
    checkProximity(letter)

    draggingLetter.value = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('touchmove', onMouseMove)
    window.removeEventListener('touchend', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchmove', onMouseMove)
  window.addEventListener('touchend', onMouseUp)
}

function checkProximity(letter: any) {
  const greyLetterElements = document.querySelectorAll('.querySelector')
  const greyLetterElement = greyLetterElements[letter.index]
  const greyRect = greyLetterElement.getBoundingClientRect()

  const distance = Math.sqrt(
    Math.pow(letter.x - (greyRect.left + greyRect.width / 2), 2) +
      Math.pow(letter.y - (greyRect.top + greyRect.height / 2), 2),
  )

  if (distance < 50) {
    letter.x = greyRect.left + greyRect.width / 2
    letter.y = greyRect.top + greyRect.height / 2
    letter.angle = 0
    letter.sticked = true
    playAudio('/src/assets/shared/ui-click.mp3')
  }

  checkSuccess()
}

function checkSuccess() {
  if (colorfulLetters.every((letter) => letter.sticked)) {
    playAudio('/src/assets/shared/correct.mp3')
    setTimeout(() => {
      next()
    }, 500)
  }
}

// Lifecycle
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <!-- First half content -->
      <img :src="computedImage" :alt="answer" />
    </div>
    <div class="flex-1 flex items-center justify-center">
      <!-- Second half content -->
      <span
        v-for="(char, index) in answer.split('')"
        :key="index"
        class="querySelector text-8xl font-bold text-gray-300 flex"
      >
        {{ char }}
      </span>
      <div
        v-for="(letter, index) in colorfulLetters"
        :key="index"
        class="absolute text-8xl font-bold select-none"
        :style="getLetterStyle(letter)"
        :data-letter="letter.char"
        @mousedown="startDrag($event, index)"
        @touchstart.prevent="startDrag($event, index)"
      >
        {{ letter.char }}
      </div>
    </div>
  </div>
</template>
