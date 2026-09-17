<script setup lang="ts">
import { computed } from 'vue'
import { getMainAttribute, type ArtDefinition } from '../../data/arts'

const props = defineProps<{
  modelValue: boolean
  art: ArtDefinition | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const stages = computed(() => {
  if (!props.art) return []
  return [
    { name: props.art.first_stage_name, description: props.art.first_stage_description, condition: props.art.first_stage_condition },
    { name: props.art.second_stage_name, description: props.art.second_stage_description, condition: props.art.second_stage_condition },
    { name: props.art.third_stage_name, description: props.art.third_stage_description, condition: props.art.third_stage_condition },
    { name: props.art.fourth_stage_name, description: props.art.fourth_stage_description, condition: props.art.fourth_stage_condition }
  ]
})

function close() {
  emit('update:modelValue', false)
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) close()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue && art"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
      @click="handleBackdropClick"
    >
      <section class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg p-5 shadow-xl" style="background-color: var(--color-surface);">
        <header class="mb-4 border-b border-ink/30 pb-3">
          <h3 class="text-xl font-bold">{{ art.name }}</h3>
          <p class="mt-1 text-sm opacity-75">Основной аттрибут: {{ getMainAttribute(art) }}</p>
          <p class="mt-1 text-sm opacity-75">Бросок: {{ art.attributes }}</p>
        </header>

        <p v-if="art.description" class="mb-5 whitespace-pre-wrap leading-relaxed">{{ art.description }}</p>

        <ol class="space-y-4">
          <li v-for="(stage, index) in stages" :key="stage.name">
            <h4 class="font-semibold">{{ index + 1 }}. {{ stage.name }}</h4>
            <p class="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{{ stage.description }}</p>
            <p
              v-if="stage.condition"
              class="mt-2 whitespace-pre-wrap border-l-2 border-ink/30 pl-3 text-xs opacity-75"
            ><span class="font-semibold">Условия:</span>\n{{ stage.condition }}</p>
          </li>
        </ol>

        <div class="mt-6 flex justify-end">
          <button type="button" class="btn" @click="close">Закрыть</button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
