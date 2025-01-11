<script setup lang="ts">
import data from '../data/map.json'
import Link from './Link.vue'
import { useNavigationStore } from '../stores/navigationStore'
import TraceLetter from './TraceLetter.vue'

// Store
const navigationStore = useNavigationStore()

// Handlers
const handleLevelClick = (index: number) => {
  navigationStore.setLevelId(index + 1)
}
</script>

<template>
  <div class="scrollable-container flex overflow-x-auto h-[500px]">
    <template v-for="({ id, src, width }, index) in data" :key="id">
      <Link :to="`/level${id}/`" :renderChildrenOnly="index + 1 !== navigationStore.levelId">
        <img
          :src="src"
          :width="width"
          height="500"
          :alt="'level ' + id"
          class="flex-shrink-0 hover:brightness-110"
          :class="index + 1 !== navigationStore.levelId ? 'opacity-50' : ''"
          @click="handleLevelClick(index)"
        />
      </Link>
    </template>
  </div>

  <TraceLetter />
</template>
