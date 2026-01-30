<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCharacterStore } from '../../stores/character'
import ExplanationModal from '../ui/ExplanationModal.vue'

const store = useCharacterStore()
const character = computed(() => store.character)

// Вычисление здоровья спутника
function getCompanionHealth(level: number): number {
  return level * 2
}

// Модальное окно пояснений
const showModal = ref(false)
const modalTitle = ref('')
const currentExplanation = ref('')
const currentCompanionIndex = ref(0)
const currentAbilityIndex = ref(0)

function openExplanation(companionIdx: number, abilityIdx: number) {
  const ability = character.value.companions[companionIdx].abilities[abilityIdx]
  currentCompanionIndex.value = companionIdx
  currentAbilityIndex.value = abilityIdx
  modalTitle.value = ability.name || `Способность ${abilityIdx + 1}`
  currentExplanation.value = ability.explanation || ''
  showModal.value = true
}

function saveExplanation(explanation: string) {
  character.value.companions[currentCompanionIndex.value].abilities[currentAbilityIndex.value].explanation = explanation
}
</script>

<template>
  <div class="companions-section">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Три блока спутников -->
      <div
        v-for="(companion, index) in character.companions"
        :key="index"
        class="companion-block bg-parchment-dark/20 rounded-lg p-4"
      >
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">
          Спутник {{ index + 1 }}
        </h3>
        
        <div class="space-y-3">
          <!-- Имя -->
          <div>
            <label class="text-xs text-ink/70">Имя</label>
            <input
              v-model="companion.name"
              type="text"
              class="w-full"
            />
          </div>
          
          <!-- Уровень -->
          <div>
            <label class="text-xs text-ink/70">Уровень</label>
            <input
              v-model.number="companion.level"
              type="number"
              class="w-full"
              min="0"
            />
          </div>
          
          <!-- Здоровье (вычисляемое) -->
          <div>
            <label class="text-xs text-ink/70">Здоровье (Уровень × 2)</label>
            <input
              :value="getCompanionHealth(companion.level)"
              type="number"
              class="w-full bg-parchment-dark/50 cursor-not-allowed"
              disabled
            />
          </div>
          
          <!-- Урон -->
          <div>
            <label class="text-xs text-ink/70">Урон</label>
            <input
              v-model.number="companion.damage"
              type="number"
              class="w-full"
            />
          </div>
          
          <!-- Симпатия -->
          <div>
            <label class="text-xs text-ink/70">Симпатия</label>
            <input
              v-model.number="companion.sympathy"
              type="number"
              class="w-full"
            />
          </div>
          
          <!-- 7 текстовых полей для способностей -->
          <div class="pt-2 border-t border-ink/20">
            <label class="text-xs text-ink/70 mb-1 block">Способности</label>
            <div class="space-y-1">
              <div
                v-for="(ability, abilityIndex) in companion.abilities"
                :key="abilityIndex"
                class="flex items-center gap-2"
              >
                <input
                  v-model="ability.name"
                  type="text"
                  class="flex-1 text-sm"
                />
                <button
                  type="button"
                  class="w-5 h-5 text-xs rounded-full flex items-center justify-center no-print"
                  :class="ability.explanation ? 'bg-ink text-parchment' : 'bg-ink/10 hover:bg-ink/20'"
                  :title="ability.explanation ? 'Редактировать пояснение' : 'Добавить пояснение'"
                  @click="openExplanation(index, abilityIndex)"
                >
                  ?
                </button>
              </div>
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
