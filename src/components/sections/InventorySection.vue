<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCharacterStore } from '../../stores/character'
import DotStrip from '../ui/DotStrip.vue'
import ExplanationModal from '../ui/ExplanationModal.vue'
import ExplanationTooltip from '../ui/ExplanationTooltip.vue'
import CollapsibleFields from '../ui/CollapsibleFields.vue'
import { wornEquipmentLimits } from '../../types/character'
import type { EditableParameter, WornEquipmentSlot } from '../../types/character'

const store = useCharacterStore()
const character = computed(() => store.character)
const equipmentSlots = Object.keys(wornEquipmentLimits) as WornEquipmentSlot[]

function availableSlots(currentSlot?: WornEquipmentSlot): WornEquipmentSlot[] {
  return equipmentSlots.filter(slot => slot === currentSlot ||
    character.value.wornEquipment.filter(item => item.slot === slot).length < wornEquipmentLimits[slot])
}

function addWornEquipment() {
  const slot = availableSlots()[0]
  if (slot) character.value.wornEquipment.push({ slot, name: '', value: 0 })
}

function isParamUsed(param: EditableParameter): boolean {
  return param.value > 0 || !!param.name?.trim() || !!param.explanation?.trim()
}

// Модальное окно пояснений
const showModal = ref(false)
const modalTitle = ref('')
const currentExplanation = ref('')
const currentBlock = ref<'artifacts' | 'equipment' | 'regular' | 'magical'>('artifacts')
const currentIndex = ref(0)

function openExplanation(block: 'artifacts' | 'equipment' | 'regular' | 'magical', index: number) {
  let item
  let defaultName
  if (block === 'artifacts') {
    item = character.value.artifacts[index]
    defaultName = `Артефакт ${index + 1}`
  } else if (block === 'equipment') {
    item = character.value.equipment[index]
    defaultName = `Предмет ${index + 1}`
  } else if (block === 'regular') {
    item = character.value.consumables.regular[index]
    defaultName = `Расходник ${index + 1}`
  } else {
    item = character.value.consumables.magical[index]
    defaultName = `Магический ${index + 1}`
  }
  currentBlock.value = block
  currentIndex.value = index
  modalTitle.value = item.name || defaultName
  currentExplanation.value = item.explanation || ''
  showModal.value = true
}

function saveExplanation(explanation: string) {
  if (currentBlock.value === 'artifacts') {
    character.value.artifacts[currentIndex.value].explanation = explanation
  } else if (currentBlock.value === 'equipment') {
    character.value.equipment[currentIndex.value].explanation = explanation
  } else if (currentBlock.value === 'regular') {
    character.value.consumables.regular[currentIndex.value].explanation = explanation
  } else {
    character.value.consumables.magical[currentIndex.value].explanation = explanation
  }
}
</script>

<template>
  <div class="inventory-section">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Блок 1: Артефакты -->
      <div class="artifacts-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Артефакты</h3>
        
        <div class="space-y-2">
          <CollapsibleFields :items="character.artifacts" :is-used="isParamUsed">
            <template #default="{ item: artifact, index, visible }">
              <div v-show="visible" class="flex items-center gap-2" :class="{ 'print:hidden': !isParamUsed(artifact) }">
                <input
                  v-model="artifact.name"
                  type="text"
                  class="flex-1 text-sm min-w-[100px]"
                />
                <ExplanationTooltip
                  :explanation="artifact.explanation || ''"
                  :has-explanation="!!artifact.explanation"
                  @click="openExplanation('artifacts', index)"
                />
                <DotStrip
                  v-model="artifact.value"
                  :max="6"
                  optional-last-dot
                />
              </div>
            </template>
          </CollapsibleFields>
        </div>
      </div>
      
      <!-- Блок 2: Снаряжение -->
      <div class="equipment-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Снаряжение</h3>
        
        <div class="space-y-2">
          <CollapsibleFields :items="character.equipment" :is-used="isParamUsed">
            <template #default="{ item, index, visible }">
              <div v-show="visible" class="flex items-center gap-2" :class="{ 'print:hidden': !isParamUsed(item) }">
                <input
                  v-model="item.name"
                  type="text"
                  class="flex-1 text-sm min-w-[100px]"
                />
                <ExplanationTooltip
                  :explanation="item.explanation || ''"
                  :has-explanation="!!item.explanation"
                  @click="openExplanation('equipment', index)"
                />
                <DotStrip
                  v-model="item.value"
                  :max="5"
                />
              </div>
            </template>
          </CollapsibleFields>
        </div>
      </div>
      
      <div class="worn-equipment-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Экипировка</h3>
        <div class="space-y-2">
          <div v-for="(item, index) in character.wornEquipment" :key="index" class="flex flex-wrap items-center gap-2" :class="{ 'print:hidden': !isParamUsed(item) }">
            <select v-model="item.slot" :aria-label="`Место экипировки ${index + 1}`" class="text-sm max-w-full">
              <option v-for="slot in availableSlots(item.slot)" :key="slot" :value="slot">{{ slot }}</option>
            </select>
            <input v-model="item.name" :aria-label="`Название предмета ${index + 1}`" type="text" class="flex-1 text-sm min-w-[80px]" placeholder="Название предмета" />
            <DotStrip v-model="item.value" :max="6" optional-last-dot />
            <button type="button" class="text-sm opacity-70 hover:opacity-100 no-print" :aria-label="`Удалить предмет ${index + 1}`" @click="character.wornEquipment.splice(index, 1)">×</button>
          </div>
          <button v-if="availableSlots().length" type="button" class="collapsible-toggle text-xs opacity-60 hover:opacity-100 mt-1 underline no-print" @click="addWornEquipment">Добавить предмет</button>
        </div>
      </div>

      <!-- Блок 3: Расходники -->
      <div class="consumables-block rounded-lg p-4 md:col-span-3" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Расходники</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Обычные -->
          <div class="mb-4">
            <h4 class="text-sm font-semibold mb-2 opacity-70">Обычные</h4>
            <div class="space-y-2">
              <CollapsibleFields :items="character.consumables.regular" :is-used="isParamUsed">
                <template #default="{ item, index, visible }">
                  <div v-show="visible" class="flex items-center gap-2" :class="{ 'print:hidden': !isParamUsed(item) }">
                    <input
                      v-model="item.name"
                      type="text"
                      class="flex-1 text-sm min-w-[80px]"
                    />
                    <ExplanationTooltip
                      :explanation="item.explanation || ''"
                      :has-explanation="!!item.explanation"
                      @click="openExplanation('regular', index)"
                    />
                    <DotStrip
                      v-model="item.value"
                      :max="9"
                    />
                  </div>
                </template>
              </CollapsibleFields>
            </div>
          </div>
        
          <!-- Магические -->
          <div>
            <h4 class="text-sm font-semibold mb-2 opacity-70">Магические</h4>
            <div class="space-y-2">
              <CollapsibleFields :items="character.consumables.magical" :is-used="isParamUsed">
                <template #default="{ item, index, visible }">
                  <div v-show="visible" class="flex items-center gap-2" :class="{ 'print:hidden': !isParamUsed(item) }">
                    <input
                      v-model="item.name"
                      type="text"
                      class="flex-1 text-sm min-w-[80px]"
                    />
                    <ExplanationTooltip
                      :explanation="item.explanation || ''"
                      :has-explanation="!!item.explanation"
                      @click="openExplanation('magical', index)"
                    />
                    <DotStrip
                      v-model="item.value"
                      :max="9"
                    />
                  </div>
                </template>
              </CollapsibleFields>
            </div>
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
