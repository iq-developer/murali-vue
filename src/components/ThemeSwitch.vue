<template>
  <label class="switch">
    <input type="checkbox" @change="toggleTheme" :checked="isDarkTheme" />
    <span class="slider"></span>
  </label>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDarkTheme = ref(false)

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value

  document.documentElement.classList.toggle('dark', isDarkTheme.value)
  document.documentElement.classList.toggle('light', !isDarkTheme.value)
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'dark') {
    isDarkTheme.value = true
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  } else {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  }
})
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: var(--color-text);
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-background-soft);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

button {
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 4px;
}
</style>
