<script setup lang="ts">
import { RouterLink } from 'vue-router'

const { link, renderChildrenOnly } = defineProps({
  link: {
    type: String,
    required: true,
  },
  renderChildrenOnly: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div v-if="renderChildrenOnly">
    <slot></slot>
  </div>
  <RouterLink :to="link" v-else>
    <slot></slot>
  </RouterLink>
</template>
