<script setup lang="ts">
import { ref, reactive } from 'vue'
import { playAudio, getRandomColor } from '../utils/helpers.ts'

// Props
const { word, next } = defineProps<{
  word: string
  image: string
  next: () => void
}>()

// State
const colorfulLetters = reactive([
  {
    char: word,
    color: getRandomColor(),
    angle: 0,
    x: Math.random() * window.innerWidth * 0.8,
    y: Math.random() * window.innerHeight * 0.8,
    sticked: false,
    index: 0,
  },
])

// Constants
const draggingLetter = ref<{ index: number; startX: number; startY: number } | null>(null)
const targetCorrection = 96

// Drag-and-drop features
function getLetterStyle(letter: any) {
  return {
    color: letter.sticked ? 'black' : letter.color,

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
  const greyLetterElements = document.querySelectorAll('.grey-letter')
  const greyLetterElement = greyLetterElements[letter.index]
  const greyRect = greyLetterElement.getBoundingClientRect()

  const distance = Math.sqrt(
    Math.pow(letter.x - (greyRect.left - targetCorrection + greyRect.width / 2), 2) +
      Math.pow(letter.y - (greyRect.top - targetCorrection + greyRect.height / 2), 2),
  )

  if (distance < 100) {
    letter.x = greyRect.left - targetCorrection + greyRect.width / 2
    letter.y = greyRect.top - targetCorrection + greyRect.height / 2
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
    }, 1000)
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <!-- Target positions for letter -->
      <span
        class="grey-letter text-8xl font-bold text-gray-300 rounded-3xl flex border-8 border-dashed border-gray-300"
      >
        <img
          :src="image"
          alt=""
          width="176
        "
        />
      </span>
      <div
        v-for="(letter, index) in colorfulLetters"
        :key="index"
        class="absolute text-8xl font-bold select-none border-8 rounded-3xl bg-white border-gray-300 w-48 h-48 flex items-center justify-center"
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

<style scoped>
body {
  margin: 0;
}
</style>
