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
const currentBlock = ref<'arts' | 'birthrights'>('arts')
const currentIndex = ref(0)

function openExplanation(block: 'arts' | 'birthrights', index: number) {
  const item = block === 'arts' 
    ? character.value.arts[index] 
    : character.value.birthrights[index]
  currentBlock.value = block
  currentIndex.value = index
  modalTitle.value = item.name || (block === 'arts' ? `Искусство ${index + 1}` : `Право ${index + 1}`)
  currentExplanation.value = item.explanation || ''
  showModal.value = true
}

function saveExplanation(explanation: string) {
  if (currentBlock.value === 'arts') {
    character.value.arts[currentIndex.value].explanation = explanation
  } else {
    character.value.birthrights[currentIndex.value].explanation = explanation
  }
}
</script>

<template>
  <div class="arts-section">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Блок 1: Искусства -->
      <div class="arts-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Искусства</h3>
        
        <div class="space-y-2">
          <CollapsibleFields :items="character.arts" :is-used="isParamUsed">
            <template #default="{ item: art, index, visible }">
              <div v-show="visible" class="flex items-center gap-2" :class="{ 'print:hidden': !isParamUsed(art) }">
                <input
                  v-model="art.name"
                  type="text"
                  class="flex-1 text-sm min-w-[120px]"
                />
                <ExplanationTooltip
                  :explanation="art.explanation || ''"
                  :has-explanation="!!art.explanation"
                  @click="openExplanation('arts', index)"
                />
                <DotStrip
                  v-model="art.value"
                  :max="5"
                />
              </div>
            </template>
          </CollapsibleFields>
        </div>
      </div>
      
      <!-- Блок 2: Права рождения -->
      <div class="birthrights-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Права рождения</h3>
        
        <div class="space-y-2">
          <CollapsibleFields :items="character.birthrights" :is-used="isParamUsed">
            <template #default="{ item: birthright, index, visible }">
              <div v-show="visible" class="flex items-center gap-2" :class="{ 'print:hidden': !isParamUsed(birthright) }">
                <input
                  v-model="birthright.name"
                  type="text"
                  class="flex-1 text-sm min-w-[120px]"
                />
                <ExplanationTooltip
                  :explanation="birthright.explanation || ''"
                  :has-explanation="!!birthright.explanation"
                  @click="openExplanation('birthrights', index)"
                />
                <DotStrip
                  v-model="birthright.value"
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
