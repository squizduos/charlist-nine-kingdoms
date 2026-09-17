<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCharacterStore } from '../../stores/character'
import DotStrip from '../ui/DotStrip.vue'
import ExplanationModal from '../ui/ExplanationModal.vue'
import ExplanationTooltip from '../ui/ExplanationTooltip.vue'
import CollapsibleFields from '../ui/CollapsibleFields.vue'
import ArtPicker from '../ui/ArtPicker.vue'
import ArtInfoModal from '../ui/ArtInfoModal.vue'
import { getArtSummary, getArtsForSheet, type ArtDefinition } from '../../data/arts'
import type { EditableParameter } from '../../types/character'

const store = useCharacterStore()
const character = computed(() => store.character)
const availableArts = computed(() => getArtsForSheet(character.value.sheetType))

function isParamUsed(param: EditableParameter): boolean {
  return param.value > 0 || !!param.name?.trim() || !!param.explanation?.trim()
}

// Модальное окно пояснений
const showModal = ref(false)
const modalTitle = ref('')
const currentExplanation = ref('')
const currentBlock = ref<'arts' | 'birthrights'>('arts')
const currentIndex = ref(0)
const showArtInfoModal = ref(false)
const selectedArtInfo = ref<ArtDefinition | null>(null)

function getSelectedArt(name: string): ArtDefinition | null {
  return availableArts.value.find((art) => art.name === name) || null
}

function getArtTooltip(art: EditableParameter): string {
  const selectedArt = getSelectedArt(art.name)
  return selectedArt ? getArtSummary(selectedArt) : art.explanation || ''
}

function handleArtSelection(art: EditableParameter, selectedArt: ArtDefinition | null) {
  if (selectedArt) art.explanation = ''
}

function openArtExplanation(art: EditableParameter, index: number) {
  const selectedArt = getSelectedArt(art.name)
  if (selectedArt) {
    selectedArtInfo.value = selectedArt
    showArtInfoModal.value = true
    return
  }
  openExplanation('arts', index)
}

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
                <ArtPicker
                  v-model="art.name"
                  :options="availableArts"
                  @select="handleArtSelection(art, $event)"
                />
                <ExplanationTooltip
                  :explanation="getArtTooltip(art)"
                  :has-explanation="!!getArtTooltip(art)"
                  @click="openArtExplanation(art, index)"
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
    <ArtInfoModal v-model="showArtInfoModal" :art="selectedArtInfo" />
  </div>
</template>
