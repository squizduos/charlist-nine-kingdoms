<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// 15 точек в сетке 5x3
const rows = computed(() => {
  const result: number[][] = []
  for (let row = 0; row < 3; row++) {
    const rowDots: number[] = []
    for (let col = 0; col < 5; col++) {
      rowDots.push(row * 5 + col + 1)
    }
    result.push(rowDots)
  }
  return result
})

function handleClick(dotIndex: number) {
  // Если кликнули на текущую заполненную точку - обнулить до предыдущей
  if (dotIndex === props.modelValue) {
    emit('update:modelValue', dotIndex - 1)
  } else {
    // Иначе заполнить до этой точки
    emit('update:modelValue', dotIndex)
  }
}

function isFilled(dotIndex: number): boolean {
  return dotIndex <= props.modelValue
}
</script>

<template>
  <div class="experience-grid">
    <div class="flex flex-col gap-1">
      <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="flex gap-1">
        <button
          v-for="dot in row"
          :key="dot"
          type="button"
          class="dot"
          :class="{ 'filled': isFilled(dot) }"
          @click="handleClick(dot)"
          :aria-label="`Точка опыта ${dot} из 15`"
        />
      </div>
    </div>
    <div class="text-xs opacity-70 mt-1">{{ modelValue }} / 15</div>
  </div>
</template>
