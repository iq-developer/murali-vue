<script setup lang="ts">
import { ref, reactive } from 'vue'

const greyWord = 'MONKEY'

const colorfulLetters = reactive(
  greyWord.split('').map((char, index) => ({
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

function getRandomColor() {
  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink']
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
    fontSize: '5em',
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

    checkProximity(letter)
  }

  const onMouseUp = () => {
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
    Math.pow(letter.x - (greyRect.left + greyRect.width / 2), 2) +
      Math.pow(letter.y - (greyRect.top + greyRect.height / 2), 2),
  )

  if (distance < 50) {
    letter.x = greyRect.left + greyRect.width / 2
    letter.y = greyRect.top + greyRect.height / 2
    letter.angle = 0
    letter.sticked = true
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <!-- First half content -->
      <span v-for="(char, index) in greyWord.split('')" :key="index" class="grey-letter">
        {{ char }}
      </span>
    </div>
    <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Second half content -->
      <div
        v-for="(letter, index) in colorfulLetters"
        :key="index"
        class="colorful-letter"
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
.grey-letter {
  font-size: 5em;
  font-weight: bold;
  color: gainsboro;
  display: flex;
  gap: 0.1em;
}

.colorful-letter {
  position: absolute;
  font-size: 5em;
  font-weight: bold;
  user-select: none;
}
</style>
