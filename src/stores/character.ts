import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Character } from '../types/character'
import { createEmptyCharacter } from '../types/character'
import { generateFilename } from '../utils/transliterate'

const STORAGE_KEY = 'nine-kingdoms-character'

export const useCharacterStore = defineStore('character', () => {
  // Состояние персонажа
  const character = ref<Character>(createEmptyCharacter())

  // Computed: максимум здоровья = храбрость + телосложение
  const healthMax = computed(() =>
    character.value.attributes.social.courage +
    character.value.attributes.physical.constitution
  )

  // Сохранение в localStorage
  function saveToLocalStorage() {
    try {
      const json = JSON.stringify(character.value)
      localStorage.setItem(STORAGE_KEY, json)
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error)
    }
  }

  // Загрузка из localStorage
  function loadFromLocalStorage() {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (json) {
        const loaded = JSON.parse(json) as Partial<Character>
        // Мержим с пустым персонажем для обеспечения всех полей
        character.value = { ...createEmptyCharacter(), ...loaded }
      }
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error)
    }
  }

  // Экспорт в JSON строку
  function exportToJSON(): string {
    return JSON.stringify(character.value, null, 2)
  }

  // Импорт из JSON строки
  function importFromJSON(json: string): boolean {
    try {
      const loaded = JSON.parse(json) as Partial<Character>
      character.value = { ...createEmptyCharacter(), ...loaded }
      saveToLocalStorage()
      return true
    } catch (error) {
      console.error('Ошибка импорта JSON:', error)
      return false
    }
  }

  // Сброс персонажа
  function resetCharacter() {
    character.value = createEmptyCharacter()
    saveToLocalStorage()
  }

  // Скачивание файла
  function downloadCharacter() {
    const json = exportToJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const filename = generateFilename(character.value.characterName)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Загрузка файла
  function uploadCharacter(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const json = e.target?.result as string
        if (json) {
          const success = importFromJSON(json)
          resolve(success)
        } else {
          resolve(false)
        }
      }
      
      reader.onerror = () => {
        resolve(false)
      }
      
      reader.readAsText(file)
    })
  }

  // Автосохранение при изменениях
  watch(character, saveToLocalStorage, { deep: true })

  return {
    character,
    healthMax,
    saveToLocalStorage,
    loadFromLocalStorage,
    exportToJSON,
    importFromJSON,
    resetCharacter,
    downloadCharacter,
    uploadCharacter,
  }
})
