<script setup lang="ts">
import { RouterLink } from 'vue-router'

const images = [
  { id: 1, src: '/src/assets/levels/1.jpg', width: 368 },
  { id: 2, src: '/src/assets/levels/2.jpg', width: 232 },
  { id: 3, src: '/src/assets/levels/3.jpg', width: 346 },
  { id: 4, src: '/src/assets/levels/4.jpg', width: 259 },
  { id: 5, src: '/src/assets/levels/5.jpg', width: 295 },
  { id: 6, src: '/src/assets/levels/1.jpg', width: 368 },
  { id: 7, src: '/src/assets/levels/2.jpg', width: 232 },
]
</script>

<template>
  <div class="scrollable-container flex overflow-x-auto h-[500px]">
    <RouterLink v-for="image in images" :key="image.id" :to="'/level/' + image.id">
      <img
        :src="image.src"
        :width="image.width"
        height="500"
        :alt="'level ' + image.id"
        class="flex-shrink-0 hover:brightness-110"
      />
    </RouterLink>
  </div>

  <Story />
</template>
