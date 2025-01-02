<script setup>
import { ref, reactive, onMounted } from 'vue'

const featuredLetter = 'm'
const bubbles = reactive([])
const featuredClickCount = ref(0)
const featuredClickedToFinish = 5

const createBubble = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const letter =
    Math.random() < 0.5 ? featuredLetter : letters[Math.floor(Math.random() * letters.length)]
  const size = Math.random() * 50 + 50
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
    bubbles.splice(bubbles.indexOf(bubble), 1)
    featuredClickCount.value++
    if (featuredClickCount.value === featuredClickedToFinish) {
      alert('done')
      // TODO: finish
    }
  } else {
    bubble.isRed = true
    // TODO: add chaking for red bubbles
    setTimeout(() => {
      bubble.isRed = false
    }, 3000)
  }
}

onMounted(() => {
  setInterval(() => {
    bubbles.push(createBubble())
  }, 3000)
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
}

.bubble {
  position: absolute;
  bottom: 0;
  border-radius: 50%;
  background-color: rgba(173, 216, 230, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  cursor: pointer;
  animation: moveUp linear infinite;
}

.bubble.featured {
  //background-color: rgba(255, 215, 0, 0.7);
}

.bubble.red {
  background-color: red;
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
    transform: translate(2vh, -20vh);
  }
  80% {
    transform: translate(-2vh, -70vh);
  }
  90% {
    transform: translate(1vh, -80vh);
  }
  100% {
    transform: translate(-3vw, -100vh);
  }
}
</style>
