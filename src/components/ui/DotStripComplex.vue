<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  max: number
  modelValue: number
  disabled?: boolean
}>(), {
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// Рассчёт верхнего и нижнего ряда из общего значения
// value = topRow * max + bottomRow
const topRow = computed(() => Math.floor(props.modelValue / props.max))
const bottomRow = computed(() => props.modelValue % props.max)

const dots = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

// Поле для ввода изменения
const deltaInput = ref<string>('')

function handleTopClick(dotIndex: number) {
  if (props.disabled) return
  
  let newTop = dotIndex
  if (dotIndex === topRow.value) {
    newTop = dotIndex - 1
  }
  const newValue = newTop * props.max + bottomRow.value
  emit('update:modelValue', Math.max(0, newValue))
}

function handleBottomClick(dotIndex: number) {
  if (props.disabled) return
  
  let newBottom = dotIndex
  if (dotIndex === bottomRow.value) {
    newBottom = dotIndex - 1
  }
  const newValue = topRow.value * props.max + newBottom
  emit('update:modelValue', Math.max(0, newValue))
}

function isTopFilled(dotIndex: number): boolean {
  return dotIndex <= topRow.value
}

function isBottomFilled(dotIndex: number): boolean {
  return dotIndex <= bottomRow.value
}

function applyDelta() {
  const delta = parseInt(deltaInput.value, 10)
  if (!isNaN(delta)) {
    const newValue = Math.max(0, props.modelValue + delta)
    emit('update:modelValue', newValue)
    deltaInput.value = ''
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    applyDelta()
  }
}
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex flex-col gap-1">
      <!-- Верхний ряд -->
      <div class="flex gap-1 items-center">
        <button
          v-for="dot in dots"
          :key="`top-${dot}`"
          type="button"
          class="dot"
          :class="{ 
            'filled': isTopFilled(dot),
            'cursor-not-allowed opacity-60': disabled 
          }"
          :disabled="disabled"
          @click="handleTopClick(dot)"
          :aria-label="`Верхняя точка ${dot} из ${max}`"
        />
      </div>
      
      <!-- Нижний ряд -->
      <div class="flex gap-1 items-center">
        <button
          v-for="dot in dots"
          :key="`bottom-${dot}`"
          type="button"
          class="dot"
          :class="{ 
            'filled': isBottomFilled(dot),
            'cursor-not-allowed opacity-60': disabled 
          }"
          :disabled="disabled"
          @click="handleBottomClick(dot)"
          :aria-label="`Нижняя точка ${dot} из ${max}`"
        />
      </div>
    </div>
    
    <!-- Поле для быстрого изменения -->
    <div class="flex items-center gap-1 no-print">
      <input
        v-model="deltaInput"
        type="text"
        class="w-12 text-center text-sm"
        placeholder="+/-"
        :disabled="disabled"
        @keydown="handleKeydown"
      />
      <button
        type="button"
        class="btn-secondary btn-small"
        :disabled="disabled"
        @click="applyDelta"
      >
        OK
      </button>
    </div>
    
    <!-- Текущее значение -->
    <span class="text-sm text-ink/70 min-w-[3rem] text-center">
      {{ modelValue }}
    </span>
  </div>
</template>
