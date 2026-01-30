<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useCharacterStore } from '../../stores/character'

const store = useCharacterStore()

// Редактирование имени вкладки
const editingTabId = ref<string | null>(null)
const editingName = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function startEditing(tabId: string, currentName: string) {
  editingTabId.value = tabId
  editingName.value = currentName
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

function finishEditing() {
  if (editingTabId.value && editingName.value.trim()) {
    store.renameTab(editingTabId.value, editingName.value.trim())
  }
  editingTabId.value = null
  editingName.value = ''
}

function cancelEditing() {
  editingTabId.value = null
  editingName.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    finishEditing()
  } else if (e.key === 'Escape') {
    cancelEditing()
  }
}
</script>

<template>
  <div class="character-tabs no-print">
    <div class="flex items-center gap-1 overflow-x-auto pb-1">
      <!-- Вкладки -->
      <div
        v-for="tab in store.tabs"
        :key="tab.id"
        class="flex items-center gap-1 px-3 py-1.5 rounded-t text-sm cursor-pointer shrink-0 group"
        :class="store.activeTabId === tab.id ? 'tab-active' : 'tab-inactive'"
        @click="store.setActiveTab(tab.id)"
      >
        <!-- Название или поле редактирования -->
        <template v-if="editingTabId === tab.id">
          <input
            ref="inputRef"
            v-model="editingName"
            type="text"
            class="bg-transparent border-none outline-none text-sm w-24 min-w-0"
            style="color: inherit;"
            @blur="finishEditing"
            @keydown="handleKeydown"
            @click.stop
          />
        </template>
        <template v-else>
          <span
            class="truncate max-w-[120px]"
            @dblclick.stop="startEditing(tab.id, tab.name)"
            :title="tab.name"
          >
            {{ tab.name }}
          </span>
        </template>
        
        <!-- Кнопка закрытия -->
        <button
          type="button"
          class="close-btn ml-1 w-4 h-4 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity"
          :class="store.tabs.length === 1 ? 'invisible' : ''"
          @click.stop="store.closeTab(tab.id)"
          title="Закрыть вкладку"
        >
          ×
        </button>
      </div>
      
      <!-- Кнопка добавления новой вкладки -->
      <button
        type="button"
        class="add-tab-btn flex items-center justify-center w-7 h-7 rounded text-lg transition-colors shrink-0"
        @click="store.createTab()"
        title="Новый персонаж"
      >
        +
      </button>
    </div>
  </div>
</template>

<style scoped>
.tab-active {
  background-color: var(--color-ink);
  color: var(--color-surface);
}

.tab-inactive {
  background-color: var(--color-surface-secondary);
  color: var(--color-ink);
}

.tab-inactive:hover {
  background-color: rgba(128, 128, 128, 0.3);
}

.close-btn {
  color: inherit;
}

.close-btn:hover {
  background-color: rgba(128, 128, 128, 0.3);
}

.add-tab-btn {
  background-color: transparent;
  color: var(--color-ink);
  opacity: 0.7;
}

.add-tab-btn:hover {
  background-color: var(--color-surface-secondary);
  opacity: 1;
}
</style>
