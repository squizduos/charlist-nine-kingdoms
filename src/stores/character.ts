import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Character, CharacterTab } from '../types/character'
import { createEmptyCharacter } from '../types/character'
import { generateFilename } from '../utils/transliterate'

const STORAGE_KEY = 'nine-kingdoms-tabs'

// Глубокий мердж персонажа с пустым шаблоном (top-level поля-объекты мержатся отдельно,
// чтобы новые вложенные поля из createEmptyCharacter() не терялись при загрузке старых сохранений)
function mergeWithEmptyCharacter(partial: Partial<Character>): Character {
  const empty = createEmptyCharacter()
  return {
    ...empty,
    ...partial,
    mind: { ...empty.mind, ...partial.mind },
  }
}

// Генерация уникального ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export const useCharacterStore = defineStore('character', () => {
  // Состояние вкладок
  const tabs = ref<CharacterTab[]>([])
  const activeTabId = ref<string>('')

  // Текущий активный персонаж
  const character = computed(() => {
    const tab = tabs.value.find(t => t.id === activeTabId.value)
    return tab?.character ?? createEmptyCharacter()
  })

  // Текущая вкладка
  const activeTab = computed(() => {
    return tabs.value.find(t => t.id === activeTabId.value)
  })

  // Computed: базовый максимум здоровья = храбрость + телосложение (для полоски точек)
  const healthMaxBase = computed(() =>
    character.value.attributes.social.courage +
    character.value.attributes.physical.constitution
  )
  
  // Computed: отображаемый максимум здоровья = (храбрость + телосложение)²
  const healthMax = computed(() => healthMaxBase.value * healthMaxBase.value)

  // Создание новой вкладки
  function createTab(name: string = 'Новый персонаж', characterData?: Character): string {
    const id = generateId()
    const newTab: CharacterTab = {
      id,
      name,
      character: characterData ?? createEmptyCharacter()
    }
    tabs.value.push(newTab)
    activeTabId.value = id
    saveToLocalStorage()
    return id
  }

  // Закрытие вкладки
  function closeTab(tabId: string) {
    const index = tabs.value.findIndex(t => t.id === tabId)
    if (index === -1) return

    tabs.value.splice(index, 1)

    // Если закрыли активную вкладку, переключаемся на другую
    if (activeTabId.value === tabId) {
      if (tabs.value.length > 0) {
        // Переключаемся на предыдущую или следующую вкладку
        const newIndex = Math.min(index, tabs.value.length - 1)
        activeTabId.value = tabs.value[newIndex].id
      } else {
        // Если вкладок нет, создаём новую
        createTab()
      }
    }

    saveToLocalStorage()
  }

  // Переименование вкладки
  function renameTab(tabId: string, newName: string) {
    const tab = tabs.value.find(t => t.id === tabId)
    if (tab) {
      tab.name = newName
      saveToLocalStorage()
    }
  }

  // Переключение активной вкладки
  function setActiveTab(tabId: string) {
    if (tabs.value.some(t => t.id === tabId)) {
      activeTabId.value = tabId
      saveToLocalStorage()
    }
  }

  // Обновление персонажа в текущей вкладке
  function updateCharacter(updater: (char: Character) => void) {
    const tab = tabs.value.find(t => t.id === activeTabId.value)
    if (tab) {
      updater(tab.character)
      saveToLocalStorage()
    }
  }

  // Сохранение в localStorage
  function saveToLocalStorage() {
    try {
      const data = {
        tabs: tabs.value,
        activeTabId: activeTabId.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error)
    }
  }

  // Загрузка из localStorage
  function loadFromLocalStorage() {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (json) {
        const data = JSON.parse(json)
        if (data.tabs && Array.isArray(data.tabs) && data.tabs.length > 0) {
          // Мержим каждого персонажа с пустым для обеспечения всех полей
          tabs.value = data.tabs.map((tab: CharacterTab) => ({
            ...tab,
            character: mergeWithEmptyCharacter(tab.character)
          }))
          activeTabId.value = data.activeTabId || tabs.value[0].id
        } else {
          // Если данных нет, создаём первую вкладку
          createTab()
        }
      } else {
        // Миграция со старого формата
        const oldJson = localStorage.getItem('nine-kingdoms-character')
        if (oldJson) {
          const oldCharacter = JSON.parse(oldJson) as Partial<Character>
          const character = mergeWithEmptyCharacter(oldCharacter)
          const name = character.characterName || 'Персонаж'
          createTab(name, character)
          // Удаляем старый ключ
          localStorage.removeItem('nine-kingdoms-character')
        } else {
          // Создаём первую вкладку
          createTab()
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error)
      createTab()
    }
  }

  // Экспорт в JSON строку
  function exportToJSON(): string {
    return JSON.stringify(character.value, null, 2)
  }

  // Импорт из JSON строки (создаёт новую вкладку)
  function importFromJSON(json: string, tabName: string = 'Загруженный'): boolean {
    try {
      const loaded = JSON.parse(json) as Partial<Character>
      const newCharacter = mergeWithEmptyCharacter(loaded)
      createTab(tabName, newCharacter)
      return true
    } catch (error) {
      console.error('Ошибка импорта JSON:', error)
      return false
    }
  }

  // Сброс персонажа (создание новой вкладки)
  function resetCharacter() {
    createTab()
  }

  // Скачивание файла
  function downloadCharacter() {
    // Получаем текущего персонажа
    const currentCharacter = character.value
    if (!currentCharacter) {
      console.error('Нет активного персонажа для сохранения')
      return
    }
    
    // Сериализуем персонажа
    const json = JSON.stringify(currentCharacter, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    // Генерируем имя файла
    const characterName = currentCharacter.characterName || ''
    const filename = generateFilename(characterName)
    
    // Создаём ссылку для скачивания
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    
    // Запускаем скачивание
    link.click()
    
    // Очищаем
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
  }

  // Загрузка файла (создаёт новую вкладку)
  function uploadCharacter(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const json = e.target?.result as string
        if (json) {
          // Получаем имя файла без расширения для названия вкладки
          const tabName = file.name.replace(/\.json$/i, '')
          const success = importFromJSON(json, tabName)
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

  // Автосохранение при изменениях вкладок
  watch(tabs, saveToLocalStorage, { deep: true })

  return {
    // Состояние
    tabs,
    activeTabId,
    character,
    activeTab,
    healthMaxBase,
    healthMax,
    
    // Управление вкладками
    createTab,
    closeTab,
    renameTab,
    setActiveTab,
    updateCharacter,
    
    // Хранение
    saveToLocalStorage,
    loadFromLocalStorage,
    
    // Экспорт/Импорт
    exportToJSON,
    importFromJSON,
    resetCharacter,
    downloadCharacter,
    uploadCharacter,
  }
})
