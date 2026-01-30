<script setup lang="ts">
import { computed, watch } from 'vue'
import { useCharacterStore } from '../../stores/character'
import DotStrip from '../ui/DotStrip.vue'
import DotStripComplex from '../ui/DotStripComplex.vue'

const store = useCharacterStore()
const character = computed(() => store.character)

// Ограничение перебросов: не больше постоянной воли
watch(
  () => character.value.mind.rerolls,
  (newVal) => {
    if (newVal > character.value.mind.permanentWill) {
      character.value.mind.rerolls = character.value.mind.permanentWill
    }
  }
)

// Ограничение перебросов при изменении постоянной воли
watch(
  () => character.value.mind.permanentWill,
  (newVal) => {
    if (character.value.mind.rerolls > newVal) {
      character.value.mind.rerolls = newVal
    }
  }
)
</script>

<template>
  <div class="mind-section">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Блок 1: Постоянная воля -->
      <div class="will-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Постоянная воля</h3>
        
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
              <div class="text-xs text-ink/60">
                (макс: {{ character.mind.permanentWill }})
              </div>
            </div>
            <DotStrip
              v-model="character.mind.rerolls"
              :max="10"
            />
          </div>
          
          <div>
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-sm font-medium min-w-[140px]">Кошмары</span>
            </div>
            <DotStripComplex
              v-model="character.mind.nightmares"
              :max="10"
            />
          </div>
        </div>
      </div>
      
      <!-- Блок 2-1: Королевства (для типа Материк) -->
      <div v-if="character.sheetType === 'mainland'" class="kingdoms-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Королевства</h3>
        
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
      
      <!-- Блок 2-2: Сущность (для типа Фэйри) -->
      <div v-else class="essence-block">
        <h3 class="text-lg font-bold mb-3 border-b border-ink/30 pb-1">Сущность</h3>
        
        <div class="space-y-3">
          <div>
            <div class="text-sm font-medium mb-1">Глэм</div>
            <DotStripComplex
              v-model="character.mind.glamour"
              :max="10"
            />
          </div>
          
          <div>
            <div class="text-sm font-medium mb-1">Банальность</div>
            <DotStripComplex
              v-model="character.mind.banality"
              :max="10"
            />
          </div>
          
          <div class="pt-2 border-t border-ink/20">
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
