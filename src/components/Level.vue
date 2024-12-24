<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  msg: string
}>()

const tasks = [
  { id: 1, name: 'Task 1', description: 'Description for task 1' },
  { id: 2, name: 'Task 2', description: 'Description for task 2' },
  { id: 3, name: 'Task 3', description: 'Description for task 3' },
  { id: 4, name: 'Task 4', description: 'Description for task 4' },
  { id: 5, name: 'Task 5', description: 'Description for task 5' },
  { id: 6, name: 'Task 6', description: 'Description for task 6' },
  { id: 7, name: 'Task 7', description: 'Description for task 7' },
  { id: 8, name: 'Task 8', description: 'Description for task 8' },
  { id: 9, name: 'Task 9', description: 'Description for task 9' },
  { id: 10, name: 'Task 10', description: 'Description for task 10' },
]

// State
const activeTask = ref(1)

const taskClass = (id: number) => {
  if (id === tasks[tasks.length - 1].id) return 'h-1'
  return id % 2 ? 'path' : 'path-right'
}

const buttonClass = (id: number) => {
  const leftRight = id % 2 ? '-left-12' : '-right-12'
  if (activeButton(id)) return `border-green-500 bg-green-200 hover:bg-green-30 ${leftRight}`
  if (disableButton(id)) return `text-gray-400 border-gray-300 bg-gray-200 ${leftRight}`
  return `border-orange-300 bg-orange-100 text-orange-300 hover:bg-orange-200 ${leftRight}`
}

const disableButton = (id: number) => {
  return id > activeTask.value
}

const activeButton = (id: number) => {
  return id === activeTask.value
}

function increment() {
  activeTask.value++
}
</script>

<template>
  $route.params.id: {{ $route.params.id }}

  <div class="h-48 w-full"></div>
  <div class="bg flex justify-center bg-cyan-200">
    <div class="w-full max-w-2xl">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="relative h-48 w-full text-4xl font-bold text-gray-400"
        :class="taskClass(task.id)"
      >
        <button
          :disabled="disableButton(task.id)"
          class="absolute -top-12 h-20 w-32 rounded-full border-8 border-gray-300 bg-gray-200"
          :class="buttonClass(task.id)"
          @click="increment"
        >
          <img
            v-if="task.id === activeTask"
            src="/src/assets/murali.png"
            class="absolute -top-24 scale-150"
            alt="Murali"
          />
          <span v-else-if="disableButton(task.id)">{{ task.id }}</span>
          <span v-else>✓</span>
        </button>
      </div>
    </div>
  </div>
  <div class="h-24 w-full"></div>
</template>

<style>
.path {
  background: linear-gradient(
    to top right,
    transparent calc(50% - 5px),
    #e0f2fe,
    transparent calc(50% + 5px)
  );
}
.path-right {
  background: linear-gradient(
    to bottom right,
    transparent calc(50% - 5px),
    #e0f2fe,
    transparent calc(50% + 5px)
  );
}
</style>
