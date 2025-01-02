<script setup lang="ts">
import { RouterLink } from 'vue-router'

const { to, renderChildrenOnly } = defineProps({
  to: {
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
  <RouterLink :to="to" v-else>
    <slot></slot>
  </RouterLink>
</template>
