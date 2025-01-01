import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', () => {
  const activeTaskId = ref(1)

  function increaseActiveTaskId() {
    activeTaskId.value++
  }

  return { activeTaskId, increaseActiveTaskId }
})
