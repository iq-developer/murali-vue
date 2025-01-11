<template>
  <div class="flex items-center justify-center h-screen bg-gray-100 relative">
    <!-- Gray Letter M -->
    <svg ref="letterRef" viewBox="0 0 600 600" class="w-[600px] h-[600px] text-gray-300">
      <!-- Outline of the letter 'M' -->
      <path
        ref="pathRef"
        d="M 150 450 L 150 150 L 300 300 L 450 150 L 450 450"
        stroke="currentColor"
        stroke-width="48"
        fill="none"
        stroke-linecap="round"
      />
      <!-- Progress path that changes color as the user traces -->
      <path
        ref="progressRef"
        d="M 150 450 L 150 150 L 300 300 L 450 150 L 450 450"
        stroke="black"
        stroke-width="48"
        fill="none"
        stroke-linecap="round"
        stroke-dasharray="0 3000"
      />
    </svg>

    <!-- Draggable Handler -->
    <div
      ref="handlerRef"
      class="w-12 h-12 bg-blue-500 rounded-full absolute cursor-pointer select-none"
      :style="{ left: `${handlerPos.x - 24}px`, top: `${handlerPos.y + 10}px` }"
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
        console.log('Total path length:', totalLength)
        const startPoint = pathRef.value.getPointAtLength(0)
        const rect = letterRef.value.getBoundingClientRect()
        console.log('rect:', rect)

        handlerPos.x = startPoint.x + rect.left
        handlerPos.y = startPoint.y + rect.top
        console.log('Handler start position:', handlerPos)
      }
    })

    const startDrag = (event: MouseEvent | TouchEvent) => {
      isDragging.value = true
      console.log('Drag started')

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
        console.log('Handler moved to:', handlerPos)

        progressRef.value!.setAttribute('stroke-dasharray', `${tracedLength} 3000`)
        console.log('Traced length:', tracedLength)

        if (tracedLength >= totalLength - 1) {
          alert('ok')
          console.log('Tracing completed')
          isDragging.value = false
          window.removeEventListener('mousemove', moveHandler)
          window.removeEventListener('mouseup', stopDrag)
        }
      }

      const stopDrag = () => {
        isDragging.value = false
        console.log('Drag stopped')
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
