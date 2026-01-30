<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCharacterStore } from '../stores/character'
import ExperienceGrid from './ui/ExperienceGrid.vue'
import DotStripComplex from './ui/DotStripComplex.vue'
import InjuryFigure from './ui/InjuryFigure.vue'

const store = useCharacterStore()
const character = computed(() => store.character)

// Диалог загрузки
const fileInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const loadProgress = ref(0)

function triggerFileUpload() {
  fileInput.value?.click()
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  isLoading.value = true
  loadProgress.value = 0
  
  // Имитация прогресса загрузки
  const progressInterval = setInterval(() => {
    if (loadProgress.value < 90) {
      loadProgress.value += 10
    }
  }, 50)
  
  const success = await store.uploadCharacter(file)
  
  clearInterval(progressInterval)
  loadProgress.value = 100
  
  setTimeout(() => {
    isLoading.value = false
    loadProgress.value = 0
    
    if (!success) {
      alert('Ошибка загрузки файла. Проверьте формат JSON.')
    }
  }, 300)
  
  // Сброс input для возможности повторной загрузки того же файла
  target.value = ''
}

function handleSave() {
  store.downloadCharacter()
}

function handleNewCharacter() {
  if (confirm('Создать нового персонажа? Текущие данные будут потеряны, если не сохранены.')) {
    store.resetCharacter()
  }
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="main-section bg-parchment-dark/30 rounded-lg p-4 print:bg-transparent print:p-0">
    <!-- Основная компоновка -->
    <div class="flex flex-wrap gap-4 items-start">
      <!-- Колонка 1: Имя персонажа, Имя игрока, Раса -->
      <div class="flex flex-col gap-2 min-w-[180px]">
        <div>
          <label class="text-xs text-ink/70">Имя персонажа</label>
          <input
            v-model="character.characterName"
            type="text"
            class="w-full"
          />
        </div>
        <div>
          <label class="text-xs text-ink/70">Имя игрока</label>
          <input
            v-model="character.playerName"
            type="text"
            class="w-full"
          />
        </div>
        <div>
          <label class="text-xs text-ink/70">Раса/Китэйн</label>
          <input
            v-model="character.race"
            type="text"
            class="w-full"
          />
        </div>
      </div>
      
      <!-- Колонка 2: Концепция, Возраст, Тип -->
      <div class="flex flex-col gap-2 min-w-[180px]">
        <div>
          <label class="text-xs text-ink/70">Концепция</label>
          <input
            v-model="character.concept"
            type="text"
            class="w-full"
          />
        </div>
        <div>
          <label class="text-xs text-ink/70">Возраст</label>
          <input
            v-model="character.age"
            type="text"
            class="w-full"
          />
        </div>
        <div>
          <label class="text-xs text-ink/70">Тип чар-листа</label>
          <select
            v-model="character.sheetType"
            class="w-full bg-parchment border border-ink/30 rounded px-2 py-1"
          >
            <option value="mainland">Материк</option>
            <option value="faerie">Фэйри</option>
          </select>
        </div>
      </div>
      
      <!-- Опыт -->
      <div class="flex flex-col gap-1">
        <ExperienceGrid v-model="character.experience" />
      </div>
      
      <!-- Здоровье -->
      <div class="flex flex-col gap-1">
        <div class="text-sm font-medium">Здоровье</div>
        <div class="text-xs text-ink/70 mb-1">
          Макс: {{ store.healthMax }} (Храбрость + Телосложение)
        </div>
        <DotStripComplex
          v-model="character.health"
          :max="Math.max(1, store.healthMax)"
        />
      </div>
      
      <!-- Увечья -->
      <div>
        <InjuryFigure v-model="character.injuries" />
      </div>
      
      <!-- Богатство -->
      <div class="flex flex-col gap-2 min-w-[100px]">
        <div>
          <label class="text-xs text-ink/70">Богатство</label>
          <input
            v-model.number="character.wealth"
            type="number"
            class="w-full"
          />
        </div>
      </div>
      
      <!-- Кнопки управления -->
      <div class="flex gap-2 items-start no-print">
        <button
          type="button"
          class="btn text-sm"
          @click="triggerFileUpload"
        >
          Загрузить
        </button>
        <button
          type="button"
          class="btn text-sm"
          @click="handleSave"
        >
          Сохранить
        </button>
        <button
          type="button"
          class="btn-secondary text-sm"
          @click="handleNewCharacter"
        >
          Новый персонаж
        </button>
        <button
          type="button"
          class="btn-secondary text-sm"
          @click="handlePrint"
        >
          Печать
        </button>
      </div>
    </div>
    
    <!-- Скрытый input для загрузки файла -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleFileUpload"
    />
    
    <!-- Индикатор загрузки -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-ink/50 flex items-center justify-center z-50"
    >
      <div class="bg-parchment p-6 rounded-lg shadow-lg">
        <div class="text-center mb-2">Загрузка...</div>
        <div class="w-48 h-2 bg-parchment-dark rounded overflow-hidden">
          <div
            class="h-full bg-ink transition-all duration-150"
            :style="{ width: `${loadProgress}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
