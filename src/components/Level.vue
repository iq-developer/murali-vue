<script setup lang="ts">
import { useRoute } from 'vue-router'
import Link from './Link.vue'
import { useNavigationStore } from '../stores/navigationStore'

// Store
const navigationStore = useNavigationStore()

// Constants // TODO: throw error on each wrong step
const route = useRoute()
const levelNumber = +route?.params?.levelNumber

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

const taskClass = (id: number): string => {
  if (id === tasks[tasks.length - 1].id) return 'h-1'
  return id % 2 ? 'path' : 'path-right'
}

const buttonClass = (id: number): string => {
  const leftRight = id % 2 ? '-left-12' : '-right-12'
  if (activeButton(id)) return `bg-blue-400 hover:bg-blue-500 ${leftRight}`
  if (disableButton(id)) return `text-gray-400 bg-white ${leftRight}`
  return `bg-green-300 text-green-500 hover:bg-green-400 ${leftRight}`
}

const disableButton = (id: number): boolean => {
  return id > navigationStore.taskId
}

const activeButton = (id: number): boolean => {
  return id === navigationStore.taskId
}
</script>

<template>
  <div class="h-48 w-full"></div>
  <div class="bg flex justify-center bg-green-200">
    <div class="w-full max-w-2xl">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="relative h-48 w-full text-4xl font-bold text-gray-400"
        :class="taskClass(task.id)"
      >
        <Link
          :link="`/level${levelNumber}/task${task.id}/`"
          :renderChildrenOnly="disableButton(task.id)"
        >
          <div
            class="absolute flex justify-center pt-5 -top-12 h-20 w-32 rounded-full"
            :class="buttonClass(task.id)"
          >
            <img
              v-if="task.id === navigationStore.taskId"
              src="/src/assets/murali.png"
              class="absolute -top-24 scale-150"
              alt="Murali"
            />
            <span v-else-if="disableButton(task.id)">{{ task.id }}</span>
            <span v-else>
              <div>✓</div>
            </span>
          </div>
        </Link>
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
    white,
    transparent calc(50% + 5px)
  );
}
.path-right {
  background: linear-gradient(
    to bottom right,
    transparent calc(50% - 5px),
    white,
    transparent calc(50% + 5px)
  );
}
</style>
