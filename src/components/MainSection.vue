<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCharacterStore } from '../stores/character'
import ExperienceGrid from './ui/ExperienceGrid.vue'
import DotStripComplex from './ui/DotStripComplex.vue'
import InjuryFigure from './ui/InjuryFigure.vue'

const store = useCharacterStore()
const character = computed(() => store.character)

// Тема
const isDarkTheme = ref(false)

onMounted(() => {
  // Загрузка темы из localStorage
  const savedTheme = localStorage.getItem('nine-kingdoms-theme')
  if (savedTheme === 'dark') {
    isDarkTheme.value = true
    document.documentElement.classList.add('dark')
  }
})

function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value
  if (isDarkTheme.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('nine-kingdoms-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('nine-kingdoms-theme', 'light')
  }
}

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
  <div class="main-section rounded-lg p-4 print:bg-transparent print:p-0" style="background-color: var(--color-surface-secondary);">
    <!-- Основная компоновка -->
    <div class="flex flex-wrap gap-4 items-stretch">
      <!-- Колонка 1: Имя персонажа, Имя игрока, Раса -->
      <div class="flex flex-col gap-2 min-w-[180px] flex-1">
        <div>
          <label class="text-xs opacity-70">Имя персонажа</label>
          <input
            v-model="character.characterName"
            type="text"
            class="w-full"
          />
        </div>
        <div>
          <label class="text-xs opacity-70">Имя игрока</label>
          <input
            v-model="character.playerName"
            type="text"
            class="w-full"
          />
        </div>
        <div>
          <label class="text-xs opacity-70">Раса/Китэйн</label>
          <input
            v-model="character.race"
            type="text"
            class="w-full"
          />
        </div>
      </div>
      
      <!-- Колонка 2: Концепция, Возраст, Тип -->
      <div class="flex flex-col gap-2 min-w-[180px] flex-1">
        <div>
          <label class="text-xs opacity-70">Концепция</label>
          <input
            v-model="character.concept"
            type="text"
            class="w-full"
          />
        </div>
        <div>
          <label class="text-xs opacity-70">Возраст</label>
          <input
            v-model="character.age"
            type="text"
            class="w-full"
          />
        </div>
        <div>
          <label class="text-xs opacity-70">Тип чар-листа</label>
          <select
            v-model="character.sheetType"
            class="w-full"
          >
            <option value="mainland">Материк</option>
            <option value="faerie">Фэйри</option>
          </select>
        </div>
      </div>
      
      <!-- Колонка 3: Опыт -->
      <div class="flex flex-col min-w-[140px]">
        <label class="text-xs opacity-70">Опыт</label>
        <div class="mt-1">
          <ExperienceGrid v-model="character.experience" />
        </div>
      </div>
      
      <!-- Колонка 4: Здоровье + Богатство -->
      <div class="flex flex-col gap-2 min-w-[180px]">
        <!-- Здоровье -->
        <div>
          <div class="flex items-center justify-between gap-2 mb-1">
            <div>
              <label class="text-xs opacity-70">Здоровье</label>
              <div class="text-xs opacity-50">
                Макс: {{ store.healthMax }} = ({{ store.healthMaxBase }})²
              </div>
            </div>
            <span class="text-lg font-bold opacity-80">{{ character.health }}</span>
          </div>
          <DotStripComplex
            v-model="character.health"
            :max="Math.max(1, store.healthMaxBase)"
          />
        </div>
        
        <!-- Богатство -->
        <div>
          <label class="text-xs opacity-70">Богатство</label>
          <input
            v-model.number="character.wealth"
            type="number"
            class="w-full"
          />
        </div>
      </div>
      
      <!-- Колонка 5: Увечья -->
      <div class="flex items-center justify-center p-3 rounded-lg" style="background-color: var(--color-surface); border: 1px solid rgba(128,128,128,0.3);">
        <InjuryFigure v-model="character.injuries" />
      </div>
    </div>
    
    <!-- Кнопки управления - ВСЕГДА внизу -->
    <div class="flex flex-wrap gap-2 items-center mt-4 pt-4 no-print" style="border-top: 1px solid rgba(128,128,128,0.3);">
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
      <button
        type="button"
        class="btn-secondary text-sm"
        @click="toggleTheme"
        :title="isDarkTheme ? 'Светлая тема' : 'Тёмная тема'"
      >
        {{ isDarkTheme ? '☀️' : '🌙' }}
      </button>
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
      class="fixed inset-0 flex items-center justify-center z-50"
      style="background-color: rgba(0,0,0,0.5);"
    >
      <div class="p-6 rounded-lg shadow-lg" style="background-color: var(--color-surface);">
        <div class="text-center mb-2">Загрузка...</div>
        <div class="w-48 h-2 rounded overflow-hidden" style="background-color: var(--color-surface-secondary);">
          <div
            class="h-full transition-all duration-150"
            style="background-color: var(--color-ink);"
            :style="{ width: `${loadProgress}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
