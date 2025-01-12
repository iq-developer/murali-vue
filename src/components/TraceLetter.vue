<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import type { CommonSlidePart } from '../utils/types'

// Props
const { slide, next } = defineProps<{
  slide: TraceLetterSlide
  next: () => void
}>()

// Types
type TraceLetterSlide = {
  paths: string[]
} & CommonSlidePart

// State
const letterRef = ref<SVGSVGElement | null>(null)
const handlerRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const handlerPos = reactive({ x: 0, y: 0 })

// Array of letter paths
const { paths } = slide

const currentPathIndex = ref(0)
const pathRefs = ref<SVGPathElement[]>([])
const progress = reactive<number[]>(paths.map(() => 0))
let totalLength = 0

const updateHandlerPosition = () => {
  if (pathRefs.value[currentPathIndex.value] && letterRef.value) {
    totalLength = pathRefs.value[currentPathIndex.value].getTotalLength()
    const startPoint = pathRefs.value[currentPathIndex.value].getPointAtLength(0)
    const rect = letterRef.value.getBoundingClientRect()
    handlerPos.x = startPoint.x + rect.left
    handlerPos.y = startPoint.y + rect.top
  }
}

onMounted(() => {
  const paths = letterRef.value!.querySelectorAll('path')
  paths.forEach((path) => pathRefs.value.push(path as SVGPathElement))
  updateHandlerPosition()
})

watch(currentPathIndex, () => {
  updateHandlerPosition()
})

const startDrag = (event: MouseEvent | TouchEvent) => {
  isDragging.value = true

  const moveHandler = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !pathRefs.value[currentPathIndex.value]) return

    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX
    const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY
    const rect = letterRef.value!.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    let closestPoint = pathRefs.value[currentPathIndex.value].getPointAtLength(0)
    let minDistance = Infinity
    let tracedLength = 0
    for (let i = 0; i <= totalLength; i++) {
      const point = pathRefs.value[currentPathIndex.value].getPointAtLength(i)
      const distance = Math.hypot(point.x - x, point.y - y)
      if (distance < minDistance) {
        minDistance = distance
        closestPoint = point
        tracedLength = i
      }
    }

    handlerPos.x = closestPoint.x + rect.left
    handlerPos.y = closestPoint.y + rect.top
    progress[currentPathIndex.value] = tracedLength

    if (tracedLength >= totalLength - 1) {
      if (currentPathIndex.value < paths.length - 1) {
        currentPathIndex.value++
        updateHandlerPosition()
      } else {
        next()
      }
      isDragging.value = false
      window.removeEventListener('mousemove', moveHandler)
      window.removeEventListener('mouseup', stopDrag)
    }
  }

  const stopDrag = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', moveHandler)
    window.removeEventListener('mouseup', stopDrag)
  }

  window.addEventListener('mousemove', moveHandler)
  window.addEventListener('mouseup', stopDrag)
}
</script>

<template>
  <div class="flex items-center justify-center h-screen relative">
    <!-- SVG Letter with multiple paths -->
    <svg ref="letterRef" viewBox="0 0 600 600" class="w-[600px] h-[600px] text-gray-300">
      <!-- Iterate over multiple paths -->
      <path
        v-for="(path, index) in paths"
        :key="index"
        :d="path"
        stroke="currentColor"
        stroke-width="70"
        fill="none"
        stroke-linecap="round"
      />
      <path
        v-for="(path, index) in paths"
        :key="'progress-' + index"
        :d="path"
        stroke="#172554"
        stroke-width="70"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="progress[index] + ' 1000'"
      />
    </svg>

    <!-- Draggable Handler -->
    <div
      ref="handlerRef"
      class="w-20 h-20 bg-blue-500 rounded-full absolute cursor-pointer"
      :style="{ left: `${handlerPos.x - 530}px`, top: `${handlerPos.y - 130}px` }"
      @mousedown="startDrag"
      @touchstart.prevent="startDrag"
    ></div>
  </div>
</template>
