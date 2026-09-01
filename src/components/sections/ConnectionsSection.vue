<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCharacterStore } from '../../stores/character'
import DotStrip from '../ui/DotStrip.vue'
import ExplanationModal from '../ui/ExplanationModal.vue'
import ExplanationTooltip from '../ui/ExplanationTooltip.vue'
import CollapsibleFields from '../ui/CollapsibleFields.vue'
import type { EditableParameter } from '../../types/character'

const store = useCharacterStore()
const character = computed(() => store.character)

function isParamUsed(param: EditableParameter): boolean {
  return param.value > 0 || !!param.name?.trim() || !!param.explanation?.trim()
}

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
      <div class="curses-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Проклятия</h3>
        
        <div class="space-y-2">
          <CollapsibleFields :items="character.curses" :is-used="isParamUsed">
            <template #default="{ item: curse, index, visible }">
              <div v-show="visible" class="flex items-center gap-2" :class="{ 'print:hidden': !isParamUsed(curse) }">
                <input
                  v-model="curse.name"
                  type="text"
                  class="flex-1 text-sm min-w-[100px]"
                />
                <ExplanationTooltip
                  :explanation="curse.explanation || ''"
                  :has-explanation="!!curse.explanation"
                  @click="openExplanation('curses', index)"
                />
                <DotStrip
                  v-model="curse.value"
                  :max="5"
                />
              </div>
            </template>
          </CollapsibleFields>
        </div>
      </div>
      
      <!-- Блок 2: Социальные связи -->
      <div class="social-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Социальные связи</h3>
        
        <div class="space-y-2">
          <CollapsibleFields :items="character.socialConnections" :is-used="isParamUsed">
            <template #default="{ item: connection, index, visible }">
              <div v-show="visible" class="flex items-center gap-2" :class="{ 'print:hidden': !isParamUsed(connection) }">
                <input
                  v-model="connection.name"
                  type="text"
                  class="flex-1 text-sm min-w-[100px]"
                />
                <ExplanationTooltip
                  :explanation="connection.explanation || ''"
                  :has-explanation="!!connection.explanation"
                  @click="openExplanation('connections', index)"
                />
                <DotStrip
                  v-model="connection.value"
                  :max="5"
                />
              </div>
            </template>
          </CollapsibleFields>
        </div>
      </div>
      
      <!-- Блок 3: Особенности -->
      <div class="features-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Особенности</h3>
        
        <div class="space-y-2">
          <CollapsibleFields :items="character.features" :is-used="isParamUsed">
            <template #default="{ item: feature, index, visible }">
              <div v-show="visible" class="flex items-center gap-2" :class="{ 'print:hidden': !isParamUsed(feature) }">
                <input
                  v-model="feature.name"
                  type="text"
                  class="flex-1 text-sm min-w-[100px]"
                />
                <ExplanationTooltip
                  :explanation="feature.explanation || ''"
                  :has-explanation="!!feature.explanation"
                  @click="openExplanation('features', index)"
                />
                <DotStrip
                  v-model="feature.value"
                  :max="5"
                />
              </div>
            </template>
          </CollapsibleFields>
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
