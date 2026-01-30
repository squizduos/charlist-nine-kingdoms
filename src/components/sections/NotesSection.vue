<script setup lang="ts">
import { computed } from 'vue'
import { useCharacterStore } from '../../stores/character'

const store = useCharacterStore()
const character = computed(() => store.character)
</script>

<template>
  <div class="notes-section">
    <div class="notes-block">
      <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Заметки</h3>
      
      <textarea
        v-model="character.notes"
        class="w-full min-h-[400px] resize-y text-sm leading-relaxed"
        placeholder="Введите заметки о персонаже, предыстории, важные события и другую информацию..."
      />
    </div>
  </div>
</template>
