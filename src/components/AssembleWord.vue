<script setup lang="ts">
import { ref, reactive } from 'vue'
import { playAudio } from '../utils/helpers.ts'

// Props
const { word, image, next } = defineProps<{
  word: string
  image: string
  next: () => void
}>()

// State
const colorfulLetters = reactive(
  word.split('').map((char, index) => ({
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

// Drag-and-drop feature
function getRandomColor() {
  // Tailwind palette 500 colors
  const colors = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
    '#f43f5e',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

function getRandomAngle() {
  return Math.random() * 90 - 45 // Range: -45 to 45
}

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
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <!-- First half content -->
      <img :src="image" :alt="word" />
    </div>
    <div class="flex-1 flex items-center justify-center">
      <!-- Second half content -->
      <span
        v-for="(char, index) in word.split('')"
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
