<template>
  <div class="character-tabs">
    <div
      v-for="(character, index) in characters"
      :key="character.id"
      :class="['character-tab', { active: index === currentCharacterIndex }]"
      @click="setCurrentCharacter(index)"
    >
      <span>{{ character.getDisplayName() }}</span>
      <button 
        class="close-tab" 
        @click.stop="deleteCharacter(index)"
        v-if="characters.length > 1"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCharacterStore } from '../stores/characterStore'

const characterStore = useCharacterStore()

const characters = computed(() => characterStore.characters)
const currentCharacterIndex = computed(() => characterStore.currentCharacterIndex)

const setCurrentCharacter = (index) => {
  characterStore.setCurrentCharacter(index)
}

const deleteCharacter = (index) => {
  try {
    characterStore.deleteCharacter(index)
  } catch (error) {
    alert(error.message)
  }
}
</script>

<style scoped>
.character-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
}

.character-tab {
  background: #f8f8f8;
  border: 1px solid #ccc;
  padding: 8px 15px;
  cursor: pointer;
  font-weight: bold;
  color: #666;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px 4px 0 0;
}

.character-tab:hover {
  background: #e8e8e8;
  color: #333;
}

.character-tab.active {
  background: white;
  color: #333;
  border-bottom: 2px solid white;
  margin-bottom: -2px;
}

.close-tab {
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
}

.close-tab:hover {
  background: #cc0000;
}

@media (max-width: 768px) {
  .character-tabs {
    flex-direction: column;
  }
}
</style>
