<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCharacterStore } from '../../stores/character'
import DotStrip from '../ui/DotStrip.vue'
import ExplanationModal from '../ui/ExplanationModal.vue'

const store = useCharacterStore()
const character = computed(() => store.character)

// Модальное окно пояснений
const showModal = ref(false)
const modalTitle = ref('')
const currentExplanation = ref('')
const currentBlock = ref<'curses' | 'connections' | 'features'>('curses')
const currentIndex = ref(0)

function openExplanation(block: 'curses' | 'connections' | 'features', index: number) {
  let item
  let defaultName
  if (block === 'curses') {
    item = character.value.curses[index]
    defaultName = `Проклятие ${index + 1}`
  } else if (block === 'connections') {
    item = character.value.socialConnections[index]
    defaultName = `Связь ${index + 1}`
  } else {
    item = character.value.features[index]
    defaultName = `Особенность ${index + 1}`
  }
  currentBlock.value = block
  currentIndex.value = index
  modalTitle.value = item.name || defaultName
  currentExplanation.value = item.explanation || ''
  showModal.value = true
}

function saveExplanation(explanation: string) {
  if (currentBlock.value === 'curses') {
    character.value.curses[currentIndex.value].explanation = explanation
  } else if (currentBlock.value === 'connections') {
    character.value.socialConnections[currentIndex.value].explanation = explanation
  } else {
    character.value.features[currentIndex.value].explanation = explanation
  }
}
</script>

<template>
  <div class="connections-section">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Блок 1: Проклятия -->
      <div class="curses-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Проклятия</h3>
        
        <div class="space-y-2">
          <div
            v-for="(curse, index) in character.curses"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="curse.name"
              type="text"
              class="flex-1 text-sm min-w-[100px]"
            />
            <button
              type="button"
              class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
              :class="curse.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
              @click="openExplanation('curses', index)"
            >
              ?
            </button>
            <DotStrip
              v-model="curse.value"
              :max="5"
            />
          </div>
        </div>
      </div>
      
      <!-- Блок 2: Социальные связи -->
      <div class="social-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Социальные связи</h3>
        
        <div class="space-y-2">
          <div
            v-for="(connection, index) in character.socialConnections"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="connection.name"
              type="text"
              class="flex-1 text-sm min-w-[100px]"
            />
            <button
              type="button"
              class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
              :class="connection.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
              @click="openExplanation('connections', index)"
            >
              ?
            </button>
            <DotStrip
              v-model="connection.value"
              :max="5"
            />
          </div>
        </div>
      </div>
      
      <!-- Блок 3: Особенности -->
      <div class="features-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Особенности</h3>
        
        <div class="space-y-2">
          <div
            v-for="(feature, index) in character.features"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="feature.name"
              type="text"
              class="flex-1 text-sm min-w-[100px]"
            />
            <button
              type="button"
              class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
              :class="feature.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
              @click="openExplanation('features', index)"
            >
              ?
            </button>
            <DotStrip
              v-model="feature.value"
              :max="5"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно пояснений -->
    <ExplanationModal
      v-model="showModal"
      :title="modalTitle"
      :explanation="currentExplanation"
      @update:explanation="saveExplanation"
    />
  </div>
</template>
