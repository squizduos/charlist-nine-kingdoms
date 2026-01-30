<script setup lang="ts">
import { computed, watch } from 'vue'
import { useCharacterStore } from '../../stores/character'
import DotStrip from '../ui/DotStrip.vue'
import DotStripComplex from '../ui/DotStripComplex.vue'

const store = useCharacterStore()
const character = computed(() => store.character)

// MAX для кошмаров = 10 - Постоянная воля
const nightmaresMax = computed(() => Math.max(1, 10 - character.value.mind.permanentWill))

// Ограничение постоянной воли: минимум 2
watch(
  () => character.value.mind.permanentWill,
  (newVal) => {
    if (newVal < 2) {
      character.value.mind.permanentWill = 2
    }
    // Ограничение перебросов
    if (character.value.mind.rerolls > newVal) {
      character.value.mind.rerolls = newVal
    }
    // Ограничение кошмаров при изменении MAX
    const maxNightmares = nightmaresMax.value * nightmaresMax.value + nightmaresMax.value - 1
    if (character.value.mind.nightmares > maxNightmares) {
      character.value.mind.nightmares = maxNightmares
    }
  }
)

// Ограничение перебросов: не больше постоянной воли
watch(
  () => character.value.mind.rerolls,
  (newVal) => {
    if (newVal > character.value.mind.permanentWill) {
      character.value.mind.rerolls = character.value.mind.permanentWill
    }
  }
)
</script>

<template>
  <div class="mind-section">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Блок 1: Постоянная воля -->
      <div class="will-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Постоянная воля</h3>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-medium min-w-[140px]">Постоянная воля</span>
            <DotStrip
              v-model="character.mind.permanentWill"
              :max="10"
            />
          </div>
          
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-[140px]">
              <span class="text-sm font-medium">Перебросы</span>
              <div class="text-xs opacity-60">
                (макс: {{ character.mind.permanentWill }})
              </div>
            </div>
            <DotStrip
              v-model="character.mind.rerolls"
              :max="10"
            />
          </div>
        </div>
      </div>
      
      <!-- Блок 2: Кошмары -->
      <div class="nightmares-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <div class="flex items-center justify-between mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">
          <div>
            <h3 class="text-lg font-bold">Кошмары</h3>
            <div class="text-xs opacity-60">Макс: {{ nightmaresMax }} = (10 - Воля)</div>
          </div>
          <span class="text-sm opacity-70">{{ character.mind.nightmares }}</span>
        </div>
        
        <DotStripComplex
          v-model="character.mind.nightmares"
          :max="nightmaresMax"
          :show-value="false"
        />
      </div>
      
      <!-- Блок 3-1: Королевства (для типа Материк) -->
      <div v-if="character.sheetType === 'mainland'" class="kingdoms-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Королевства</h3>
        
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(_, index) in character.mind.kingdoms"
            :key="index"
            class="flex items-center justify-between gap-2"
          >
            <span class="text-sm font-medium w-6">{{ index + 1 }}</span>
            <DotStrip
              v-model="character.mind.kingdoms[index]"
              :max="5"
            />
          </div>
        </div>
      </div>
      
      <!-- Блок 3-2: Сущность (для типа Фэйри) -->
      <div v-else class="essence-block rounded-lg p-4" style="background-color: var(--color-surface-secondary);">
        <h3 class="text-lg font-bold mb-3 pb-1" style="border-bottom: 1px solid rgba(128,128,128,0.3);">Сущность</h3>
        
        <div class="space-y-3">
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium">Глэм</span>
              <span class="text-sm opacity-70">{{ character.mind.glamour }}</span>
            </div>
            <DotStripComplex
              v-model="character.mind.glamour"
              :max="10"
              :show-value="false"
            />
          </div>
          
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium">Банальность</span>
              <span class="text-sm opacity-70">{{ character.mind.banality }}</span>
            </div>
            <DotStripComplex
              v-model="character.mind.banality"
              :max="10"
              :show-value="false"
            />
          </div>
          
          <div class="pt-2" style="border-top: 1px solid rgba(128,128,128,0.2);">
            <h4 class="text-sm font-semibold mb-2">Королевства</h4>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm min-w-[140px]">Пространство</span>
                <DotStrip
                  v-model="character.mind.kingdomSpace"
                  :max="4"
                />
              </div>
              
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm min-w-[140px]">Люди</span>
                <DotStrip
                  v-model="character.mind.kingdomPeople"
                  :max="4"
                />
              </div>
              
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm min-w-[140px]">Фэйри</span>
                <DotStrip
                  v-model="character.mind.kingdomFaerie"
                  :max="4"
                />
              </div>
              
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm min-w-[140px]">Потустороннее</span>
                <DotStrip
                  v-model="character.mind.kingdomOtherworld"
                  :max="4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
