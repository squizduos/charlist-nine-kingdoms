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
const currentBlock = ref<'social' | 'mental' | 'physical'>('social')
const currentIndex = ref(0)

function openExplanation(block: 'social' | 'mental' | 'physical', index: number) {
  const spec = character.value.attributes[block].specializations[index]
  currentBlock.value = block
  currentIndex.value = index
  modalTitle.value = spec.name || `Специализация ${index + 1}`
  currentExplanation.value = spec.explanation || ''
  showModal.value = true
}

function saveExplanation(explanation: string) {
  character.value.attributes[currentBlock.value].specializations[currentIndex.value].explanation = explanation
}

const socialAttributes = [
  { key: 'charisma', label: 'Харизма' },
  { key: 'manipulation', label: 'Манипулирование' },
  { key: 'insight', label: 'Проницательность' },
  { key: 'courage', label: 'Храбрость' },
  { key: 'deception', label: 'Обман' },
] as const

const mentalAttributes = [
  { key: 'attention', label: 'Внимание' },
  { key: 'intellect', label: 'Интеллект' },
  { key: 'science', label: 'Науки' },
  { key: 'culture', label: 'Культура' },
  { key: 'skills', label: 'Навыки' },
] as const

const physicalAttributes = [
  { key: 'constitution', label: 'Телосложение' },
  { key: 'defense', label: 'Защита' },
  { key: 'agility', label: 'Ловкость' },
  { key: 'attack', label: 'Нападение' },
  { key: 'stealth', label: 'Скрытность' },
] as const
</script>

<template>
  <div class="attributes-section">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Социальные атрибуты -->
      <div class="attribute-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Социальные</h3>
        
        <div class="space-y-2 mb-4">
          <div
            v-for="attr in socialAttributes"
            :key="attr.key"
            class="flex items-center justify-between gap-2"
          >
            <span class="text-sm font-medium min-w-[130px]">{{ attr.label }}</span>
            <DotStrip
              v-model="character.attributes.social[attr.key]"
              :max="6"
            />
          </div>
        </div>
        
        <h4 class="text-sm font-semibold mb-2 text-ink/70">Специализации</h4>
        <div class="space-y-1">
          <div
            v-for="(spec, index) in character.attributes.social.specializations"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="spec.name"
              type="text"
              class="flex-1 text-sm"
            />
            <button
              type="button"
              class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
              :class="spec.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
              @click="openExplanation('social', index)"
            >
              ?
            </button>
          </div>
        </div>
      </div>
      
      <!-- Ментальные атрибуты -->
      <div class="attribute-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Ментальные</h3>
        
        <div class="space-y-2 mb-4">
          <div
            v-for="attr in mentalAttributes"
            :key="attr.key"
            class="flex items-center justify-between gap-2"
          >
            <span class="text-sm font-medium min-w-[130px]">{{ attr.label }}</span>
            <DotStrip
              v-model="character.attributes.mental[attr.key]"
              :max="6"
            />
          </div>
        </div>
        
        <h4 class="text-sm font-semibold mb-2 text-ink/70">Специализации</h4>
        <div class="space-y-1">
          <div
            v-for="(spec, index) in character.attributes.mental.specializations"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="spec.name"
              type="text"
              class="flex-1 text-sm"
            />
            <button
              type="button"
              class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
              :class="spec.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
              @click="openExplanation('mental', index)"
            >
              ?
            </button>
          </div>
        </div>
      </div>
      
      <!-- Физические атрибуты -->
      <div class="attribute-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Физические</h3>
        
        <div class="space-y-2 mb-4">
          <div
            v-for="attr in physicalAttributes"
            :key="attr.key"
            class="flex items-center justify-between gap-2"
          >
            <span class="text-sm font-medium min-w-[130px]">{{ attr.label }}</span>
            <DotStrip
              v-model="character.attributes.physical[attr.key]"
              :max="6"
            />
          </div>
        </div>
        
        <h4 class="text-sm font-semibold mb-2 text-ink/70">Специализации</h4>
        <div class="space-y-1">
          <div
            v-for="(spec, index) in character.attributes.physical.specializations"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="spec.name"
              type="text"
              class="flex-1 text-sm"
            />
            <button
              type="button"
              class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
              :class="spec.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
              @click="openExplanation('physical', index)"
            >
              ?
            </button>
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
