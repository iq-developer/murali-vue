<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const images = [
  { id: 1, src: '/src/assets/map/1.jpg', width: 368 },
  { id: 2, src: '/src/assets/map/2.jpg', width: 232 },
  { id: 3, src: '/src/assets/map/3.jpg', width: 346 },
  { id: 4, src: '/src/assets/map/4.jpg', width: 259 },
  { id: 5, src: '/src/assets/map/5.jpg', width: 295 },
  { id: 6, src: '/src/assets/map/1.jpg', width: 368 },
  { id: 7, src: '/src/assets/map/2.jpg', width: 232 },
]

const activeLevelIndex = ref(0)
</script>

<template>
  <div class="scrollable-container flex overflow-x-auto h-[500px]">
    <template v-for="({ id, src, width }, index) in images" :key="id">
      <RouterLink v-if="index === activeLevelIndex" :to="`/level${id}/`">
        <img
          :src="src"
          :width="width"
          height="500"
          :alt="'level ' + id"
          class="flex-shrink-0 hover:brightness-110"
        />
      </RouterLink>
      <div v-else>
        <img
          :src="src"
          :width="width"
          height="500"
          :alt="'level ' + id"
          class="flex-shrink-0 brightness-90"
        />
      </div>
    </template>
  </div>
</template>
