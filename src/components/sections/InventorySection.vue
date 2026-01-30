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
      <div class="artifacts-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Артефакты</h3>
        
        <div class="space-y-2">
          <div
            v-for="(artifact, index) in character.artifacts"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="artifact.name"
              type="text"
              class="flex-1 text-sm min-w-[100px]"
            />
            <button
              type="button"
              class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
              :class="artifact.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
              @click="openExplanation('artifacts', index)"
            >
              ?
            </button>
            <DotStrip
              v-model="artifact.value"
              :max="5"
            />
          </div>
        </div>
      </div>
      
      <!-- Блок 2: Снаряжение -->
      <div class="equipment-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Снаряжение</h3>
        
        <div class="space-y-2">
          <div
            v-for="(item, index) in character.equipment"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="item.name"
              type="text"
              class="flex-1 text-sm min-w-[100px]"
            />
            <button
              type="button"
              class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
              :class="item.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
              @click="openExplanation('equipment', index)"
            >
              ?
            </button>
            <DotStrip
              v-model="item.value"
              :max="5"
            />
          </div>
        </div>
      </div>
      
      <!-- Блок 3: Расходники -->
      <div class="consumables-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Расходники</h3>
        
        <!-- Обычные -->
        <div class="mb-4">
          <h4 class="text-sm font-semibold mb-2 text-ink/70">Обычные</h4>
          <div class="space-y-2">
            <div
              v-for="(item, index) in character.consumables.regular"
              :key="`regular-${index}`"
              class="flex items-center gap-2"
            >
              <input
                v-model="item.name"
                type="text"
                class="flex-1 text-sm min-w-[80px]"
              />
              <button
                type="button"
                class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
                :class="item.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
                @click="openExplanation('regular', index)"
              >
                ?
              </button>
              <DotStrip
                v-model="item.value"
                :max="9"
              />
            </div>
          </div>
        </div>
        
        <!-- Магические -->
        <div>
          <h4 class="text-sm font-semibold mb-2 text-ink/70">Магические</h4>
          <div class="space-y-2">
            <div
              v-for="(item, index) in character.consumables.magical"
              :key="`magical-${index}`"
              class="flex items-center gap-2"
            >
              <input
                v-model="item.name"
                type="text"
                class="flex-1 text-sm min-w-[80px]"
              />
              <button
                type="button"
                class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
                :class="item.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
                @click="openExplanation('magical', index)"
              >
                ?
              </button>
              <DotStrip
                v-model="item.value"
                :max="9"
              />
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
