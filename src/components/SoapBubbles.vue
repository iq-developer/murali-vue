<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { playAudio } from '../utils/helpers.ts'
import { abc } from '../utils/constants.ts'

// Props
const { answer, next } = defineProps<{
  answer: string
  next: () => void
}>()

const featuredLetter = 'm'
const bubbles = reactive([])
const featuredClickCount = ref(0)
const featuredClickedToFinish = 5

const createBubble = () => {
  const letters = abc.split('').filter((l) => l !== featuredLetter)
  const letter =
    Math.random() < 0.5 ? featuredLetter : letters[Math.floor(Math.random() * letters.length)]
  const size = Math.random() * 100 + 70
  const duration = Math.random() * 50 + 10
  const left = Math.random() * 50 + 25

  return {
    letter,
    isRed: false,
    style: {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      animationDuration: `${duration}s`,
    },
  }
}

const handleClick = (bubble) => {
  if (bubble.letter === featuredLetter) {
    playAudio('/src/assets/shared/poit.mp3')
    bubble.style.backgroundColor = 'green'
    bubble.style.opacity = '0'
    bubble.style.transition = '0.5s'
    featuredClickCount.value++
    if (featuredClickCount.value === featuredClickedToFinish) {
      playAudio('/src/assets/shared/correct.mp3')
    }
  } else {
    playAudio('/src/assets/shared/hmm.mp3')
    bubble.isRed = true
    setTimeout(() => {
      bubble.isRed = false
    }, 3000)
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
  <div class="bubble-container">
    <div
      v-for="(bubble, index) in bubbles"
      :key="index"
      :class="['bubble', { featured: bubble.letter === featuredLetter, red: bubble.isRed }]"
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
  height: 100vh;
  overflow: hidden;
  user-select: none;
}

.bubble {
  position: absolute;
  bottom: 0;
  border-radius: 50%;
  background-color: rgba(173, 216, 230, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  cursor: pointer;
  animation: moveUp linear infinite;
  user-select: none;
}

.bubble.featured {
  background-color: rgba(173, 216, 230, 0.7);
}

.bubble.red {
  background-color: tomato;
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
