<template>
  <div class="global-controls-wrapper">
    <div class="controls-header" @click="togglePanel">
      <span class="toggle-icon">{{ isPanelOpen ? '▼' : '▶' }}</span>
      <span class="header-title">Управление</span>
      <span v-if="characterStore.loadedFileName" class="loaded-file">
        📁 {{ characterStore.loadedFileName }}
      </span>
    </div>
    <transition name="slide">
      <div v-show="isPanelOpen" class="global-controls">
        <button @click="createNewCharacter" class="control-button">Новый персонаж</button>
        <button @click="importData" class="control-button">Импорт</button>
        <button @click="exportData" class="control-button">Экспорт</button>
        <button @click="printCharacter" class="control-button">Печать</button>
        <input 
          ref="fileInput" 
          type="file" 
          accept=".json" 
          @change="handleFileImport" 
          style="display: none;"
        >
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCharacterStore } from '../stores/characterStore'

const characterStore = useCharacterStore()
const fileInput = ref(null)
const isPanelOpen = ref(true)

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
}

const createNewCharacter = () => {
  characterStore.createNewCharacter()
  characterStore.clearLoadedFileName()
}

const exportData = () => {
  characterStore.exportData()
}

const importData = () => {
  fileInput.value.click()
}

const handleFileImport = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const fileName = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      characterStore.importData(data, fileName)
      alert(`Импортировано ${characterStore.characterCount} персонажей`)
    } catch (error) {
      alert('Ошибка при импорте файла: ' + error.message)
    }
  }
  reader.readAsText(file)
  
  // Clear the input
  event.target.value = ''
}

const printCharacter = () => {
  if (characterStore.currentCharacter) {
    const printWindow = window.open('', '_blank')
    const character = characterStore.currentCharacter
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${character.getDisplayName()}</title>
        <link rel="stylesheet" href="/src/style.css">
        <style>
          body { margin: 0; padding: 20px; }
          .character-sheet { box-shadow: none; border: none; }
          .global-controls, .character-tabs { display: none !important; }
        </style>
      </head>
      <body>
        <div class="character-sheet">
          <!-- Character sheet content would be rendered here -->
          <h1>${character.getDisplayName()}</h1>
          <p>ID: ${character.data.characterId}</p>
          <p>Игрок: ${character.data.playerName}</p>
          <p>Тип листа: ${character.data.gameType}</p>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}
</script>

<style scoped>
.global-controls-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.controls-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f5f5f5;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
}

.controls-header:hover {
  background: #ebebeb;
}

.toggle-icon {
  font-size: 12px;
  color: #666;
  width: 16px;
}

.header-title {
  font-weight: bold;
  color: #333;
}

.loaded-file {
  margin-left: auto;
  font-size: 13px;
  color: #666;
  background: #e8f5e9;
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid #c8e6c9;
}

.global-controls {
  display: flex;
  gap: 10px;
  padding: 16px;
  flex-wrap: wrap;
}

.control-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.control-button:hover {
  background: #45a049;
}

/* Transition animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

@media (max-width: 768px) {
  .global-controls {
    flex-direction: column;
  }
  
  .controls-header {
    flex-wrap: wrap;
  }
  
  .loaded-file {
    margin-left: 26px;
    margin-top: 8px;
    width: 100%;
  }
}
</style>
