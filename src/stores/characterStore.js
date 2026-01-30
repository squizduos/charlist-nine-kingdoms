import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Character } from '../models/Character.js'

export const useCharacterStore = defineStore('character', () => {
  // State
  const characters = ref([])
  const currentCharacterIndex = ref(0)
  const nextId = ref(1)
  const loadedFileName = ref(null)

  // Getters
  const currentCharacter = computed(() => {
    return characters.value[currentCharacterIndex.value] || null
  })

  const characterCount = computed(() => characters.value.length)

  // Actions
  function createNewCharacter() {
    const character = new Character({ id: nextId.value++ })
    characters.value.push(character)
    currentCharacterIndex.value = characters.value.length - 1
    saveToStorage()
    return character
  }

  function setCurrentCharacter(index) {
    if (index >= 0 && index < characters.value.length) {
      currentCharacterIndex.value = index
    }
  }

  function updateCharacter(characterId, updates) {
    const character = characters.value.find(c => c.id === characterId)
    if (character) {
      Object.assign(character.data, updates)
      saveToStorage()
    }
  }

  function deleteCharacter(index) {
    if (characters.value.length <= 1) {
      throw new Error('Нельзя удалить последний персонаж')
    }
    
    characters.value.splice(index, 1)
    
    if (currentCharacterIndex.value >= characters.value.length) {
      currentCharacterIndex.value = characters.value.length - 1
    }
    
    saveToStorage()
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('characterSheets')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        characters.value = (data.characters || []).map(charData => Character.fromJSON(charData))
        nextId.value = data.nextId || 1
        currentCharacterIndex.value = 0 // Ensure first character is active by default
        
        // Handle migration from old format
        characters.value.forEach(character => {
          // Ensure all required fields exist
          if (!character.data.figureParts) {
            character.data.figureParts = {
              head: false,
              leftArm: false,
              rightArm: false,
              body: false,
              leftLeg: false,
              rightLeg: false
            }
          }
          
          // Ensure damage fields exist
          if (character.data.stupidDamage === undefined) character.data.stupidDamage = 0
          if (character.data.lethalDamage === undefined) character.data.lethalDamage = 0
          if (character.data.mentalDamageBig === undefined) character.data.mentalDamageBig = 0
          if (character.data.mentalDamageSmall === undefined) character.data.mentalDamageSmall = 0
          if (character.data.permanentWill === undefined) character.data.permanentWill = 0
          if (character.data.rerolls === undefined) character.data.rerolls = 0
          if (character.data.experience === undefined) character.data.experience = 0
          
          // Handle migration from income to gameType
          if (character.data.income !== undefined && character.data.gameType === undefined) {
            character.data.gameType = 'Материк'
            delete character.data.income
          }
          if (character.data.gameType === undefined) {
            character.data.gameType = 'Материк'
          }
        })
      } catch (error) {
        console.error('Error loading characters from storage:', error)
        characters.value = []
      }
    }
  }

  function saveToStorage() {
    const data = {
      characters: characters.value.map(char => char.toJSON()),
      nextId: nextId.value
    }
    localStorage.setItem('characterSheets', JSON.stringify(data))
  }

  function exportData() {
    const data = {
      characters: characters.value.map(char => char.toJSON()),
      nextId: nextId.value,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `character-sheets-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function importData(jsonData, fileName = null) {
    try {
      if (jsonData.characters && Array.isArray(jsonData.characters)) {
        characters.value = jsonData.characters.map(charData => Character.fromJSON(charData))
        nextId.value = jsonData.nextId || nextId.value
        currentCharacterIndex.value = 0
        loadedFileName.value = fileName
        saveToStorage()
        return true
      } else {
        throw new Error('Неверный формат файла')
      }
    } catch (error) {
      console.error('Error importing data:', error)
      throw error
    }
  }

  function clearLoadedFileName() {
    loadedFileName.value = null
  }

  return {
    // State
    characters,
    currentCharacterIndex,
    nextId,
    loadedFileName,
    
    // Getters
    currentCharacter,
    characterCount,
    
    // Actions
    createNewCharacter,
    setCurrentCharacter,
    updateCharacter,
    deleteCharacter,
    loadFromStorage,
    saveToStorage,
    exportData,
    importData,
    clearLoadedFileName
  }
})
