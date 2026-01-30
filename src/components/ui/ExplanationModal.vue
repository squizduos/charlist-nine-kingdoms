<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title: string
  explanation: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:explanation': [value: string]
}>()

const localExplanation = ref(props.explanation)

watch(() => props.explanation, (newVal) => {
  localExplanation.value = newVal
})

function close() {
  emit('update:explanation', localExplanation.value)
  emit('update:modelValue', false)
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      @click="handleBackdropClick"
    >
      <div class="rounded-lg shadow-xl max-w-lg w-full p-4" style="background-color: var(--color-surface);">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-2">
          {{ title || 'Пояснение' }}
        </h3>
        
        <textarea
          v-model="localExplanation"
          class="w-full h-32 resize-y text-sm mb-4"
          autofocus
        />
        
        <div class="flex justify-end">
          <button
            type="button"
            class="btn"
            @click="close"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
