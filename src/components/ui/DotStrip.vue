<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  max: number
  modelValue: number
  disabled?: boolean
  optionalLastDot?: boolean
}>(), {
  disabled: false,
  optionalLastDot: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const dots = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

function handleClick(dotIndex: number) {
  if (props.disabled) return
  
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
  <div class="flex gap-1 items-center">
    <button
      v-for="dot in dots"
      :key="dot"
      type="button"
      class="dot"
      :class="{ 
        'filled': isFilled(dot),
        'optional-dot': optionalLastDot && dot === max,
        'cursor-not-allowed opacity-60': disabled 
      }"
      :disabled="disabled"
      @click="handleClick(dot)"
      :aria-label="`Точка ${dot} из ${max}`"
    />
  </div>
</template>
