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
    <div class="tab-buttons flex flex-wrap gap-1 border-b border-ink/30 pb-2 mb-4 no-print">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="px-3 py-1.5 text-sm rounded-t transition-colors"
        :class="{
          'bg-ink text-parchment': activeTab === tab.id,
          'bg-parchment-dark hover:bg-ink/20': activeTab !== tab.id
        }"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- Содержимое вкладок -->
    <div class="tab-content">
      <template v-for="tab in tabs" :key="tab.id">
        <div
          v-show="activeTab === tab.id"
          class="tab-panel"
          :class="{ 'print-break': tab.id !== tabs[0]?.id }"
        >
          <!-- Заголовок для печати -->
          <h2 class="hidden print:block text-xl font-bold mb-4">{{ tab.label }}</h2>
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
