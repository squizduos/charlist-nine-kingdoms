<template>
  <div id="app">
    <GlobalControls />
    <CharacterTabs />
    <CharacterSheet v-if="currentCharacter" :character="currentCharacter" />
    <div v-else class="no-characters">
      <p>Нет персонажей. Создайте нового персонажа.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useCharacterStore } from './stores/characterStore'
import GlobalControls from './components/GlobalControls.vue'
import CharacterTabs from './components/CharacterTabs.vue'
import CharacterSheet from './components/CharacterSheet.vue'

const characterStore = useCharacterStore()

const currentCharacter = computed(() => characterStore.currentCharacter)

onMounted(() => {
  characterStore.loadFromStorage()
  
  // If no characters exist, create a default one
  if (characterStore.characterCount === 0) {
    characterStore.createNewCharacter()
  }
})
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 20px;
  color: #333;
  min-height: 100vh;
}

.no-characters {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
