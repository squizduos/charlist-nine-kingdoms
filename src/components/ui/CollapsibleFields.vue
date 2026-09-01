<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  items: any[]
  isUsed: (item: any, index: number) => boolean
}>()

const expanded = ref(false)

const hiddenCount = computed(() =>
  props.items.reduce((count: number, item, index) => count + (props.isUsed(item, index) ? 0 : 1), 0)
)

function isVisible(index: number): boolean {
  return expanded.value || props.isUsed(props.items[index], index)
}

function toggle() {
  expanded.value = !expanded.value
}
</script>

<template>
  <slot
    v-for="(item, index) in items"
    :key="index"
    :item="item"
    :index="index"
    :visible="isVisible(index)"
  />
  <button
    v-if="hiddenCount > 0"
    type="button"
    class="collapsible-toggle text-xs opacity-60 hover:opacity-100 mt-1 underline no-print"
    @click="toggle"
  >
    {{ expanded ? 'Свернуть пустые поля' : `Показать ещё (${hiddenCount})` }}
  </button>
</template>
