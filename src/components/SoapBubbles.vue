<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { playAudio, getRandomColor } from '../utils/helpers.ts'
import { colors500RGBA } from '../utils/constants.ts'
import { abc } from '../utils/constants.ts'

// Props
const { answer, next } = defineProps<{
  answer: string
  next: () => void
}>()

const bubbles = reactive<{ letter: string; isRed: boolean; style: any }[]>([])
const featuredClickCount = ref(0)
const featuredClickedToFinish = 5

const createBubble = (): { letter: string; isRed: boolean; style: any } => {
  const letters = abc.split('').filter((l) => l !== answer)
  const letter = Math.random() < 0.5 ? answer : letters[Math.floor(Math.random() * letters.length)]
  const size = Math.random() * 100 + 100
  const duration = Math.random() * 50 + 10
  const left = Math.random() * 50 + 25
  const color = getRandomColor(colors500RGBA)

  return {
    letter,
    isRed: false,
    style: {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      animationDuration: `${duration}s`,
      backgroundColor: color,
    },
  }
}

const handleClick = (bubble: { letter: string; isRed: boolean; style: any }): void => {
  if (bubble.letter === answer) {
    playAudio('/src/assets/shared/poit.mp3')
    bubble.style.backgroundColor = 'green'
    bubble.style.opacity = '0'
    bubble.style.transition = '0.5s'
    featuredClickCount.value++
    if (featuredClickCount.value === featuredClickedToFinish) {
      playAudio('/src/assets/shared/correct.mp3')
      next()
    }
  } else {
    playAudio('/src/assets/shared/hmm.mp3')
    bubble.isRed = true
    setTimeout(() => {
      bubble.isRed = false
    }, 2000)
  }
}

onMounted(() => {
  const intervalID = setInterval(() => {
    bubbles.push(createBubble())
  }, 3000)
  setTimeout(() => {
    clearInterval(intervalID)
  }, 60000)
})
</script>

<template>
  <div class="bubble-container w-full h-full">
    <div
      v-for="(bubble, index) in bubbles"
      :key="index"
      :class="['bubble', { featured: bubble.letter === answer, red: bubble.isRed }]"
      @click="handleClick(bubble)"
      :style="bubble.style"
    >
      {{ bubble.letter }}
    </div>
  </div>
</template>

<style scoped>
.bubble-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  user-select: none;
}

.bubble {
  position: absolute;
  bottom: 0;
  border-radius: 50%;
  background-color: rgba(96, 165, 250, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  cursor: pointer;
  animation: moveUp linear infinite;
  user-select: none;
}

.bubble.featured {
  background-color: rgba(96, 165, 250, 0.2);
}

.bubble.red,
.bubble.red:hover {
  background-color: tomato !important;
  transition: 0.2s;
}

/* Add a new class for the cyan hover effect */
.bubble:hover {
  background-color: rgba(96, 165, 250, 0.5) !important;
}

@keyframes moveUp {
  0% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(-1vh, -10vh);
  }
  20% {
    transform: translate(2vh, -20vh);
  }
  30% {
    transform: translate(-2vh, -30vh);
  }
  40% {
    transform: translate(1vh, -40vh);
  }
  50% {
    transform: translate(-1vh, -50vh);
  }
  60% {
    transform: translate(-1vh, -60vh);
  }
  70% {
    transform: translate(2vh, -70vh);
  }
  80% {
    transform: translate(-2vh, -80vh);
  }
  90% {
    transform: translate(1vh, -90vh);
  }
  100% {
    transform: translate(-3vw, -100vh);
  }
}
</style>
