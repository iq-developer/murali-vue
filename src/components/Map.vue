<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import data from '../data/map.json'

const activeLevelIndex = ref(0)
</script>

<template>
  <div class="scrollable-container flex overflow-x-auto h-[500px]">
    <template v-for="({ id, src, width }, index) in data" :key="id">
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
