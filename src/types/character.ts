// Тип чар-листа
export type CharacterSheetType = 'mainland' | 'faerie'

// Структура параметра с изменяемым названием
export interface EditableParameter {
  name: string
  value: number
  explanation?: string
}

// Специализация (атрибут с пояснением)
export interface Specialization {
  name: string
  explanation: string
}

// Увечья
export interface Injuries {
  head: boolean
  body: boolean
  leftArm: boolean
  rightArm: boolean
  leftLeg: boolean
  rightLeg: boolean
}

// Способность спутника
export interface CompanionAbility {
  name: string
  explanation: string
}

// Спутник
export interface Companion {
  name: string
  level: number
  damage: number
  sympathy: number
  abilities: CompanionAbility[] // 7 способностей с пояснениями
}

// Блок атрибутов
export interface AttributeBlock {
  charisma: number
  manipulation: number
  insight: number
  courage: number
  deception: number
  specializations: Specialization[]
}

export interface MentalBlock {
  attention: number
  intellect: number
  science: number
  culture: number
  skills: number
  specializations: Specialization[]
}

export interface PhysicalBlock {
  constitution: number
  defense: number
  agility: number
  attack: number
  stealth: number
  specializations: Specialization[]
}

// Атрибуты персонажа
export interface Attributes {
  social: AttributeBlock
  mental: MentalBlock
  physical: PhysicalBlock
}

// Рассудок
export interface Mind {
  permanentWill: number
  rerolls: number
  nightmares: number
  // Для типа "Материк"
  kingdoms: number[] // 10 значений
  // Для типа "Фэйри"
  glamour: number
  banality: number
  kingdomSpace: number
  kingdomPeople: number
  kingdomFaerie: number
  kingdomOtherworld: number
}

// Расходники
export interface Consumables {
  regular: EditableParameter[] // 3 обычных
  magical: EditableParameter[] // 3 магических
}

// Полный интерфейс персонажа
export interface Character {
  // Основная информация
  characterName: string
  playerName: string
  race: string
  concept: string
  age: string
  sheetType: CharacterSheetType
  experience: number // 0-15
  health: number // Сложный, зависит от храбрости + телосложения
  injuries: Injuries
  wealth: number

  // Секция I: Атрибуты
  attributes: Attributes

  // Секция II: Рассудок
  mind: Mind

  // Секция III: Искусства
  arts: EditableParameter[] // 14 параметров
  birthrights: EditableParameter[] // 4 параметра

  // Секция IV: Связи
  curses: EditableParameter[] // 8 параметров
  socialConnections: EditableParameter[] // 8 параметров
  features: EditableParameter[] // 12 параметров

  // Секция V: Инвентарь
  artifacts: EditableParameter[] // 11 параметров
  equipment: EditableParameter[] // 14 параметров
  consumables: Consumables

  // Секция VI: Спутники
  companions: Companion[] // 3 спутника

  // Секция VII: Заметки
  notes: string
}

// Функция создания пустого персонажа
export function createEmptyCharacter(): Character {
  const createSpecializations = (count: number): Specialization[] =>
    Array.from({ length: count }, () => ({ name: '', explanation: '' }))

  const createEditableParams = (count: number): EditableParameter[] =>
    Array.from({ length: count }, () => ({ name: '', value: 0 }))

  const createCompanion = (): Companion => ({
    name: '',
    level: 0,
    damage: 0,
    sympathy: 0,
    abilities: Array.from({ length: 7 }, () => ({ name: '', explanation: '' })),
  })

  return {
    characterName: '',
    playerName: '',
    race: '',
    concept: '',
    age: '',
    sheetType: 'mainland',
    experience: 0,
    health: 0,
    injuries: {
      head: false,
      body: false,
      leftArm: false,
      rightArm: false,
      leftLeg: false,
      rightLeg: false,
    },
    wealth: 0,

    attributes: {
      social: {
        charisma: 1,
        manipulation: 1,
        insight: 1,
        courage: 1,
        deception: 1,
        specializations: createSpecializations(10),
      },
      mental: {
        attention: 1,
        intellect: 1,
        science: 1,
        culture: 1,
        skills: 1,
        specializations: createSpecializations(10),
      },
      physical: {
        constitution: 1,
        defense: 1,
        agility: 1,
        attack: 1,
        stealth: 1,
        specializations: createSpecializations(10),
      },
    },

    mind: {
      permanentWill: 0,
      rerolls: 0,
      nightmares: 0,
      kingdoms: Array.from({ length: 10 }, () => 0),
      glamour: 0,
      banality: 0,
      kingdomSpace: 0,
      kingdomPeople: 0,
      kingdomFaerie: 0,
      kingdomOtherworld: 0,
    },

    arts: createEditableParams(14),
    birthrights: createEditableParams(4),

    curses: createEditableParams(8),
    socialConnections: createEditableParams(8),
    features: createEditableParams(12),

    artifacts: createEditableParams(11),
    equipment: createEditableParams(14),
    consumables: {
      regular: createEditableParams(3),
      magical: createEditableParams(3),
    },

    companions: [createCompanion(), createCompanion(), createCompanion()],

    notes: '',
  }
}
