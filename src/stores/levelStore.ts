import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLevelStore = defineStore('level', () => {
  const activeLevelId = ref(1)

  function increaseActiveLevelId() {
    activeLevelId.value++
  }

  return { activeLevelId, increaseActiveLevelId }
})
