<template>
  <div class="flex items-center justify-center h-screen bg-gray-100 relative">
    <!-- Gray Letter M -->
    <svg ref="letterRef" viewBox="0 0 200 200" class="w-64 h-64 text-gray-300">
      <!-- Outline of the letter 'M' -->
      <path
        ref="pathRef"
        d="M 50 150 L 50 50 L 100 100 L 150 50 L 150 150"
        stroke="currentColor"
        stroke-width="8"
        fill="none"
        stroke-linecap="round"
      />
      <!-- Progress path that changes color as the user traces -->
      <path
        ref="progressRef"
        d="M 50 150 L 50 50 L 100 100 L 150 50 L 150 150"
        stroke="black"
        stroke-width="8"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray="0 1000"
      />
    </svg>

    <!-- Draggable Handler -->
    <div
      ref="handlerRef"
      class="w-6 h-6 bg-blue-500 rounded-full absolute cursor-pointer"
      :style="{ left: `${handlerPos.x}px`, top: `${handlerPos.y}px` }"
      @mousedown="startDrag"
      @touchstart.prevent="startDrag"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'

export default defineComponent({
  name: 'TraceLetter',
  setup() {
    const letterRef = ref<SVGSVGElement | null>(null)
    const pathRef = ref<SVGPathElement | null>(null)
    const progressRef = ref<SVGPathElement | null>(null)
    const handlerRef = ref<HTMLDivElement | null>(null)

    const isDragging = ref(false)
    const handlerPos = reactive({ x: 0, y: 0 })

    let totalLength = 0

    onMounted(() => {
      if (pathRef.value && letterRef.value) {
        totalLength = pathRef.value.getTotalLength()
        const startPoint = pathRef.value.getPointAtLength(0)
        const rect = letterRef.value.getBoundingClientRect()
        handlerPos.x = startPoint.x + rect.left
        handlerPos.y = startPoint.y + rect.top
      }
    })

    const startDrag = (event: MouseEvent | TouchEvent) => {
      isDragging.value = true

      const moveHandler = (e: MouseEvent | TouchEvent) => {
        if (!isDragging.value || !pathRef.value || !letterRef.value) return

        const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX
        const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY
        const rect = letterRef.value.getBoundingClientRect()
        const x = clientX - rect.left
        const y = clientY - rect.top

        let closestPoint = pathRef.value.getPointAtLength(0)
        let minDistance = Infinity
        let tracedLength = 0
        for (let i = 0; i <= totalLength; i++) {
          const point = pathRef.value.getPointAtLength(i)
          const distance = Math.hypot(point.x - x, point.y - y)
          if (distance < minDistance) {
            minDistance = distance
            closestPoint = point
            tracedLength = i
          }
        }

        handlerPos.x = closestPoint.x + rect.left
        handlerPos.y = closestPoint.y + rect.top

        progressRef.value!.setAttribute('stroke-dasharray', `${tracedLength} 1000`)

        if (tracedLength >= totalLength - 1) {
          alert('ok')
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

    return {
      letterRef,
      pathRef,
      progressRef,
      handlerRef,
      handlerPos,
      startDrag,
    }
  },
})
</script>

<style scoped></style>
