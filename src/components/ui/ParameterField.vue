<script setup lang="ts">
import { ref } from 'vue'
import DotStrip from './DotStrip.vue'
import DotStripComplex from './DotStripComplex.vue'

const props = withDefaults(defineProps<{
  label: string
  modelValue: number
  max: number
  editable?: boolean
  complex?: boolean
  hasExplanation?: boolean
  explanation?: string
  disabled?: boolean
}>(), {
  editable: false,
  complex: false,
  hasExplanation: false,
  explanation: '',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'update:label': [value: string]
  'update:explanation': [value: string]
}>()

const showExplanation = ref(false)
const localLabel = ref(props.label)
const localExplanation = ref(props.explanation)

function updateValue(value: number) {
  emit('update:modelValue', value)
}

function updateLabel() {
  emit('update:label', localLabel.value)
}

function updateExplanation() {
  emit('update:explanation', localExplanation.value)
}

function toggleExplanation() {
  showExplanation.value = !showExplanation.value
}
</script>

<template>
  <div class="parameter-field mb-2">
    <div class="flex items-center gap-2">
      <!-- Название параметра -->
      <div class="flex items-center gap-1 min-w-[140px]">
        <input
          v-if="editable"
          v-model="localLabel"
          type="text"
          class="w-full text-sm"
          placeholder="Название..."
          @blur="updateLabel"
          @keydown.enter="($event.target as HTMLInputElement).blur()"
        />
        <span v-else class="text-sm font-medium">{{ label }}</span>
        
        <!-- Кнопка пояснения -->
        <button
          v-if="hasExplanation"
          type="button"
          class="w-5 h-5 text-xs bg-ink/10 hover:bg-ink/20 rounded-full flex items-center justify-center no-print"
          @click="toggleExplanation"
          :title="showExplanation ? 'Скрыть пояснение' : 'Показать пояснение'"
        >
          ?
        </button>
      </div>
      
      <!-- Полоска точек -->
      <DotStripComplex
        v-if="complex"
        :max="max"
        :model-value="modelValue"
        :disabled="disabled"
        @update:model-value="updateValue"
      />
      <DotStrip
        v-else
        :max="max"
        :model-value="modelValue"
        :disabled="disabled"
        @update:model-value="updateValue"
      />
    </div>
    
    <!-- Поле пояснения -->
    <div v-if="hasExplanation && showExplanation" class="mt-1 ml-4">
      <textarea
        v-model="localExplanation"
        class="w-full text-sm h-16 resize-y"
        placeholder="Введите пояснение..."
        @blur="updateExplanation"
      />
    </div>
  </div>
</template>
