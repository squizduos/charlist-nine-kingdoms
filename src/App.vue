<script setup lang="ts">
import { onMounted } from 'vue'
import { useCharacterStore } from './stores/character'
import MainSection from './components/MainSection.vue'
import TabContainer from './components/ui/TabContainer.vue'
import AttributesSection from './components/sections/AttributesSection.vue'
import MindSection from './components/sections/MindSection.vue'
import ArtsSection from './components/sections/ArtsSection.vue'
import ConnectionsSection from './components/sections/ConnectionsSection.vue'
import InventorySection from './components/sections/InventorySection.vue'
import CompanionsSection from './components/sections/CompanionsSection.vue'
import NotesSection from './components/sections/NotesSection.vue'

const store = useCharacterStore()

onMounted(() => {
  store.loadFromLocalStorage()
})

const tabs = [
  { id: 'attributes', label: 'I. Атрибуты', component: AttributesSection },
  { id: 'mind', label: 'II. Рассудок', component: MindSection },
  { id: 'arts', label: 'III. Искусства', component: ArtsSection },
  { id: 'connections', label: 'IV. Связи', component: ConnectionsSection },
  { id: 'inventory', label: 'V. Инвентарь', component: InventorySection },
  { id: 'companions', label: 'VI. Спутники', component: CompanionsSection },
  { id: 'notes', label: 'VII. Заметки', component: NotesSection },
]
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="text-center mb-4 print:mb-2">
      <h1 class="text-3xl font-bold" style="color: var(--color-ink);">Девять королевств</h1>
    </header>
    
    <MainSection />
    
    <TabContainer :tabs="tabs" class="mt-4 flex-1" />
    
    <!-- Футер -->
    <footer class="mt-8 py-4 text-center text-xs opacity-60 no-print" style="border-top: 1px solid rgba(128,128,128,0.2);">
      <div class="flex flex-wrap items-center justify-center gap-4">
        <span>Версия 1.0.0</span>
        <span>•</span>
        <span>Разработчик: Semyon Bochkaryov</span>
        <span>•</span>
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
          </svg>
          AI Powered
        </span>
      </div>
    </footer>
  </div>
</template>
