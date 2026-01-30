<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  explanation: string
  hasExplanation: boolean
}>()

const emit = defineEmits<{
  'click': []
}>()

const isHovering = ref(false)
const tooltipRef = ref<HTMLElement | null>(null)

const showTooltip = computed(() => isHovering.value && props.explanation)
</script>

<template>
  <div class="relative inline-block">
    <button
      ref="tooltipRef"
      type="button"
      class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
      :style="hasExplanation 
        ? { backgroundColor: 'var(--color-ink)', color: 'var(--color-surface)' } 
        : { backgroundColor: 'rgba(128,128,128,0.1)' }"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      @click="emit('click')"
    >
      ?
    </button>
    
    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="showTooltip"
        class="fixed z-[100] max-w-xs p-2 text-sm rounded shadow-lg pointer-events-none"
        :style="{
          left: tooltipRef ? `${tooltipRef.getBoundingClientRect().left}px` : '0',
          top: tooltipRef ? `${tooltipRef.getBoundingClientRect().top - 8}px` : '0',
          transform: 'translateY(-100%)',
          backgroundColor: 'var(--color-ink)',
          color: 'var(--color-surface)'
        }"
      >
        <div class="whitespace-pre-wrap">{{ explanation }}</div>
        <div class="absolute left-2 bottom-0 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-ink"></div>
      </div>
    </Teleport>
  </div>
</template>
