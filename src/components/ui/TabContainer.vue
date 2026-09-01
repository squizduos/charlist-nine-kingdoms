<script setup lang="ts">
import { ref, type Component } from 'vue'

interface Tab {
  id: string
  label: string
  component: Component
}

const props = defineProps<{
  tabs: Tab[]
}>()

const activeTab = ref(props.tabs[0]?.id || '')

function setActiveTab(tabId: string) {
  activeTab.value = tabId
}
</script>

<template>
  <div class="tab-container">
    <!-- Кнопки вкладок -->
    <div class="tab-buttons flex flex-wrap gap-1 pb-2 mb-4 no-print" style="border-bottom: 1px solid rgba(128,128,128,0.3);">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="px-3 py-1.5 text-sm rounded-t transition-colors"
        :style="activeTab === tab.id 
          ? { backgroundColor: 'var(--color-ink)', color: 'var(--color-surface)' }
          : { backgroundColor: 'var(--color-surface-secondary)', color: 'var(--color-ink)' }"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- Содержимое вкладок -->
    <div class="tab-content">
      <template v-for="(tab, index) in tabs" :key="tab.id">
        <div
          v-show="activeTab === tab.id"
          class="tab-panel"
          :class="{
            // Разрыв страницы перед 'Связями' (index 3) и 'Заметками' (index 6):
            // [Атрибуты/Рассудок/Искусства] / [Связи/Инвентарь/Спутники] / [Заметки].
            // Индексы завязаны на порядок sectionTabs в App.vue.
            'print-break': index === 3 || index === 6
          }"
        >
          <!-- Заголовок для печати -->
          <h2 class="print-section-title hidden print:block text-xl font-bold mb-4">{{ tab.label }}</h2>
          <component :is="tab.component" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .tab-panel {
    display: block !important;
  }
}
</style>
