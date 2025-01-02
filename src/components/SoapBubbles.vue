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

<script setup>
import { ref, reactive, onMounted } from 'vue'

const featuredLetter = 'A'
const bubbles = reactive([])
const featuredClickCount = ref(0)

const createBubble = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const letter = letters[Math.floor(Math.random() * letters.length)]
  const size = Math.random() * 50 + 30
  const left = Math.random() * 100
  const duration = Math.random() * 10 + 5

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
    if (featuredClickCount.value === 5) {
      alert('done')
    }
  } else {
    bubble.isRed = true
    setTimeout(() => {
      bubble.isRed = false
    }, 1000)
  }
}

onMounted(() => {
  setInterval(() => {
    bubbles.push(createBubble())
  }, 1000)
})
</script>

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
  font-size: 1.5rem;
  cursor: pointer;
  animation: moveUp linear infinite;
}

.bubble.featured {
  background-color: rgba(255, 215, 0, 0.7);
}

.bubble.red {
  background-color: red;
}

@keyframes moveUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100vh);
  }
}
</style>
