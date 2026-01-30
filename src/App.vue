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
  <div class="min-h-screen">
    <header class="text-center mb-4 print:mb-2">
      <h1 class="text-3xl font-bold text-ink">Чар-лист Девяти Королевств</h1>
    </header>
    
    <MainSection />
    
    <TabContainer :tabs="tabs" class="mt-4" />
  </div>
</template>
