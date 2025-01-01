import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', () => {
  // Level
  const levelId = ref(1)

  function increaseLevelId() {
    levelId.value++
  }

  function setLevelId(id: number) {
    levelId.value = id
  }

  // Task
  const taskId = ref(1)

  function increaseTaskId() {
    taskId.value++
    console.log('taskId', taskId.value)
  }

  function setTaskId(id: number) {
    taskId.value = id
  }

  // Slide
  const slideId = ref(1)

  function increaseSlideId() {
    slideId.value++
  }

  function setSlideId(id: number) {
    slideId.value = id
  }

  return {
    levelId,
    increaseLevelId,
    setLevelId,
    taskId,
    increaseTaskId,
    setTaskId,
    slideId,
    increaseSlideId,
    setSlideId,
  }
})
