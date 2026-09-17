<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ArtDefinition } from '../../data/arts'

const props = defineProps<{
  modelValue: string
  options: readonly ArtDefinition[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [art: ArtDefinition | null]
}>()

const query = ref(props.modelValue)
const customName = ref('')
const isOpen = ref(false)

watch(() => props.modelValue, (value) => {
  query.value = value
})

const filteredOptions = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase()
  if (!normalizedQuery) return props.options
  return props.options.filter((art) => art.name.toLocaleLowerCase().includes(normalizedQuery))
})

function updateValue(value: string) {
  query.value = value
  isOpen.value = true
  emit('update:modelValue', value)
  emit('select', props.options.find((art) => art.name === value) || null)
}

function selectArt(art: ArtDefinition) {
  query.value = art.name
  emit('update:modelValue', art.name)
  emit('select', art)
  isOpen.value = false
}

function selectCustom() {
  const name = customName.value.trim()
  if (!name) return
  query.value = name
  emit('update:modelValue', name)
  emit('select', null)
  customName.value = ''
  isOpen.value = false
}
</script>

<template>
  <div class="relative flex-1 min-w-[120px]">
    <input
      :value="query"
      type="text"
      class="w-full text-sm"
      placeholder="Выберите искусство"
      autocomplete="off"
      @focus="isOpen = true"
      @input="updateValue(($event.target as HTMLInputElement).value)"
      @keydown.escape="isOpen = false"
    />

    <div
      v-if="isOpen"
      class="absolute z-40 mt-1 max-h-64 w-full min-w-64 overflow-y-auto rounded border border-ink/30 shadow-lg"
      style="background-color: var(--color-surface);"
    >
      <button
        v-for="art in filteredOptions"
        :key="art.id"
        type="button"
        class="block w-full px-3 py-2 text-left text-sm hover:bg-ink/10"
        @mousedown.prevent
        @click="selectArt(art)"
      >
        {{ art.name }}
      </button>
      <p v-if="!filteredOptions.length" class="px-3 py-2 text-sm opacity-60">
        Ничего не найдено
      </p>
      <div class="border-t border-ink/20 p-2">
        <input
          v-model="customName"
          type="text"
          class="w-full text-sm"
          placeholder="Введите название искусства"
          @keydown.enter.prevent="selectCustom"
        />
      </div>
    </div>
  </div>
</template>
