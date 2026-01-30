# Документация: Чар-лист Девяти Королевств

## Оглавление

1. [Обзор приложения](#обзор-приложения)
2. [Технологический стек](#технологический-стек)
3. [Структура проекта](#структура-проекта)
4. [Модели данных](#модели-данных)
5. [Управление состоянием](#управление-состоянием)
6. [Компоненты](#компоненты)
7. [Функциональность](#функциональность)
8. [Темизация](#темизация)
9. [Локализация](#локализация)
10. [Хранение данных](#хранение-данных)
11. [Печать](#печать)
12. [Сборка и развёртывание](#сборка-и-развёртывание)

---

## Обзор приложения

**Чар-лист Девяти Королевств** — веб-приложение для создания и управления листами персонажей в настольной ролевой игре "Девять Королевств". Приложение позволяет:

- Создавать и редактировать персонажей
- Работать с несколькими персонажами одновременно (вкладки)
- Сохранять и загружать персонажей в формате JSON
- Печатать чар-листы
- Переключаться между светлой и тёмной темой

### Версия
**1.0.0**

### Разработчик
Semyon Bochkaryov (с использованием AI)

---

## Технологический стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| Vue.js | 3.5.13 | Фронтенд-фреймворк |
| TypeScript | 5.6.2 | Типизация |
| Vite | 6.0.7 | Сборщик и dev-сервер |
| Pinia | 2.3.0 | Управление состоянием |
| Tailwind CSS | 3.4.17 | CSS-фреймворк |
| PostCSS | 8.5.1 | Обработка CSS |
| Autoprefixer | 10.4.20 | Автопрефиксы CSS |

### Ключевые особенности стека
- **Vue 3 Composition API** с `<script setup>` синтаксисом
- **Реактивность** через `ref`, `computed`, `watch`
- **CSS Custom Properties** для темизации
- **Tailwind Utilities** для адаптивной вёрстки

---

## Структура проекта

```
charlist-nine-kingdoms/
├── src/
│   ├── App.vue                    # Корневой компонент
│   ├── main.ts                    # Точка входа
│   ├── style.css                  # Глобальные стили и темы
│   ├── vite-env.d.ts              # TypeScript декларации Vite
│   │
│   ├── components/
│   │   ├── MainSection.vue        # Основная секция (шапка чар-листа)
│   │   │
│   │   ├── sections/              # Секции чар-листа (вкладки)
│   │   │   ├── AttributesSection.vue    # I. Атрибуты
│   │   │   ├── MindSection.vue          # II. Рассудок
│   │   │   ├── ArtsSection.vue          # III. Искусства
│   │   │   ├── ConnectionsSection.vue   # IV. Связи
│   │   │   ├── InventorySection.vue     # V. Инвентарь
│   │   │   ├── CompanionsSection.vue    # VI. Спутники
│   │   │   └── NotesSection.vue         # VII. Заметки
│   │   │
│   │   └── ui/                    # UI-компоненты
│   │       ├── CharacterTabs.vue        # Вкладки персонажей
│   │       ├── TabContainer.vue         # Контейнер секций
│   │       ├── DotStrip.vue             # Полоска точек (простая)
│   │       ├── DotStripComplex.vue      # Полоска точек (сложная)
│   │       ├── ExperienceGrid.vue       # Сетка опыта
│   │       ├── InjuryFigure.vue         # Фигура увечий
│   │       ├── ExplanationModal.vue     # Модальное окно пояснений
│   │       ├── ExplanationTooltip.vue   # Тултип пояснений
│   │       └── ParameterField.vue       # Поле параметра
│   │
│   ├── stores/
│   │   └── character.ts           # Pinia store для персонажей
│   │
│   ├── types/
│   │   └── character.ts           # TypeScript интерфейсы
│   │
│   └── utils/
│       └── transliterate.ts       # Утилиты транслитерации
│
├── public/                        # Статические файлы
├── index.html                     # HTML шаблон
├── package.json                   # Зависимости проекта
├── tsconfig.json                  # Конфигурация TypeScript
├── tailwind.config.js             # Конфигурация Tailwind CSS
├── postcss.config.js              # Конфигурация PostCSS
├── vite.config.ts                 # Конфигурация Vite
├── Dockerfile                     # Docker образ
└── .drone.yml                     # CI/CD конфигурация
```

---

## Модели данных

### CharacterTab
Вкладка с персонажем для поддержки множественных листов.

```typescript
interface CharacterTab {
  id: string          // Уникальный идентификатор
  name: string        // Название вкладки
  character: Character // Данные персонажа
}
```

### Character
Основная модель персонажа.

```typescript
interface Character {
  // Основная информация
  characterName: string       // Имя персонажа
  playerName: string          // Имя игрока
  race: string                // Раса/Китэйн
  concept: string             // Концепция
  age: string                 // Возраст
  sheetType: 'mainland' | 'faerie'  // Тип листа
  experience: number          // Опыт (0-15)
  health: number              // Текущее здоровье
  injuries: Injuries          // Увечья
  wealth: number              // Богатство

  // Секции
  attributes: Attributes      // I. Атрибуты
  mind: Mind                  // II. Рассудок
  arts: EditableParameter[]   // III. Искусства (14)
  birthrights: EditableParameter[]  // Права рождения (4)
  curses: EditableParameter[]       // IV. Проклятия (8)
  socialConnections: EditableParameter[]  // Связи (8)
  features: EditableParameter[]     // Особенности (12)
  artifacts: EditableParameter[]    // V. Артефакты (11)
  equipment: EditableParameter[]    // Снаряжение (14)
  consumables: Consumables          // Расходники
  companions: Companion[]           // VI. Спутники (3)
  notes: string                     // VII. Заметки
}
```

### Attributes (Атрибуты)

```typescript
interface Attributes {
  social: AttributeBlock    // Социальные
  mental: MentalBlock       // Ментальные
  physical: PhysicalBlock   // Физические
}

interface AttributeBlock {
  charisma: number          // Харизма
  manipulation: number      // Манипулирование
  insight: number           // Проницательность
  courage: number           // Храбрость
  deception: number         // Обман
  specializations: Specialization[]  // 10 специализаций
}

interface MentalBlock {
  attention: number         // Внимание
  intellect: number         // Интеллект
  science: number           // Науки
  culture: number           // Культура
  skills: number            // Навыки
  specializations: Specialization[]
}

interface PhysicalBlock {
  constitution: number      // Телосложение
  defense: number           // Защита
  agility: number           // Ловкость
  attack: number            // Нападение
  stealth: number           // Скрытность
  specializations: Specialization[]
}
```

### Mind (Рассудок)

```typescript
interface Mind {
  permanentWill: number     // Постоянная воля (мин: 2)
  rerolls: number           // Перебросы (макс: permanentWill)
  nightmares: number        // Кошмары (макс: 10 - permanentWill)
  
  // Для типа "Материк"
  kingdoms: number[]        // 10 королевств (0-5)
  
  // Для типа "Фэйри"
  glamour: number           // Глэм
  banality: number          // Банальность
  kingdomSpace: number      // Пространство
  kingdomPeople: number     // Люди
  kingdomFaerie: number     // Фэйри
  kingdomOtherworld: number // Потустороннее
}
```

### Injuries (Увечья)

```typescript
interface Injuries {
  head: boolean             // Голова
  body: boolean             // Тело
  leftArm: boolean          // Левая рука
  rightArm: boolean         // Правая рука
  leftLeg: boolean          // Левая нога
  rightLeg: boolean         // Правая нога
}
```

### Companion (Спутник)

```typescript
interface Companion {
  name: string              // Имя
  level: number             // Уровень
  damage: number            // Урон
  sympathy: number          // Симпатия
  abilities: CompanionAbility[]  // 7 способностей
}

interface CompanionAbility {
  name: string              // Название
  explanation: string       // Пояснение
}
```

### EditableParameter

```typescript
interface EditableParameter {
  name: string              // Название
  value: number             // Значение (0-9)
  explanation?: string      // Пояснение (опционально)
}
```

### Specialization

```typescript
interface Specialization {
  name: string              // Название
  explanation: string       // Пояснение
}
```

---

## Управление состоянием

### Pinia Store: character.ts

Централизованное хранилище состояния приложения.

#### Состояние

```typescript
// Все открытые вкладки
const tabs = ref<CharacterTab[]>([])

// ID активной вкладки
const activeTabId = ref<string>('')
```

#### Вычисляемые свойства

```typescript
// Текущий персонаж
const character = computed(() => 
  tabs.value.find(t => t.id === activeTabId.value)?.character
)

// Активная вкладка
const activeTab = computed(() => 
  tabs.value.find(t => t.id === activeTabId.value)
)

// Базовый максимум здоровья (для полоски точек)
const healthMaxBase = computed(() =>
  character.value.attributes.social.courage +
  character.value.attributes.physical.constitution
)

// Отображаемый максимум здоровья = (храбрость + телосложение)²
const healthMax = computed(() => healthMaxBase.value * healthMaxBase.value)
```

#### Методы управления вкладками

| Метод | Описание |
|-------|----------|
| `createTab(name?, character?)` | Создание новой вкладки |
| `closeTab(tabId)` | Закрытие вкладки |
| `renameTab(tabId, newName)` | Переименование вкладки |
| `setActiveTab(tabId)` | Переключение активной вкладки |

#### Методы хранения

| Метод | Описание |
|-------|----------|
| `saveToLocalStorage()` | Сохранение в localStorage |
| `loadFromLocalStorage()` | Загрузка из localStorage |
| `exportToJSON()` | Экспорт в JSON строку |
| `importFromJSON(json, name)` | Импорт из JSON (создаёт новую вкладку) |
| `downloadCharacter()` | Скачивание JSON файла |
| `uploadCharacter(file)` | Загрузка JSON файла |
| `resetCharacter()` | Создание нового персонажа (новая вкладка) |

#### Автосохранение

```typescript
watch(tabs, saveToLocalStorage, { deep: true })
```

Любые изменения в данных автоматически сохраняются в localStorage.

---

## Компоненты

### UI-компоненты

#### CharacterTabs.vue
Полоска вкладок персонажей под заголовком.

**Функциональность:**
- Отображение всех открытых вкладок
- Переключение между вкладками (клик)
- Переименование вкладок (двойной клик)
- Закрытие вкладок (кнопка ×)
- Добавление новых вкладок (кнопка +)

**Особенности:**
- Нельзя закрыть последнюю вкладку
- Кнопка закрытия появляется при наведении
- Активная вкладка визуально выделена

#### DotStrip.vue
Простая полоска точек (кружков) для отображения значений атрибутов.

**Props:**
- `modelValue: number` — текущее значение
- `max: number` — максимальное количество точек

**Поведение:**
- Клик на точку устанавливает значение
- Повторный клик на заполненную точку уменьшает значение на 1

#### DotStripComplex.vue
Сложная полоска точек для здоровья и аналогичных параметров с двухрядным отображением.

**Props:**
- `modelValue: number` — текущее значение
- `max: number` — базовый максимум (кол-во точек в ряду)
- `showValue?: boolean` — показывать ли числовое значение

**Особенности:**
- Два ряда точек (верхний и нижний)
- Поле ввода для точной установки значения
- Поддержка отрицательных смещений

#### ExperienceGrid.vue
Сетка опыта 5×3 (15 точек).

**Props:**
- `modelValue: number` — текущий опыт (0-15)

#### InjuryFigure.vue
Интерактивная SVG-фигура человека для отметки увечий.

**Props:**
- `modelValue: Injuries` — объект увечий

**Части тела:**
- Голова
- Тело
- Левая/правая рука
- Левая/правая нога

#### ExplanationModal.vue
Модальное окно для редактирования пояснений к параметрам.

**Props:**
- `modelValue: boolean` — видимость
- `title: string` — заголовок
- `explanation: string` — текст пояснения

**События:**
- `update:modelValue` — закрытие
- `update:explanation` — сохранение пояснения

#### ExplanationTooltip.vue
Тултип с кнопкой "?" для отображения пояснений.

**Props:**
- `explanation: string` — текст пояснения
- `hasExplanation: boolean` — есть ли пояснение

**Поведение:**
- Наведение показывает тултип
- Клик открывает модальное окно редактирования

#### TabContainer.vue
Контейнер для секций чар-листа с навигацией.

**Props:**
- `tabs: Array<{id, label, component}>` — массив секций

### Секции чар-листа

| Секция | Файл | Содержимое |
|--------|------|------------|
| I. Атрибуты | AttributesSection.vue | Социальные, ментальные, физические атрибуты |
| II. Рассудок | MindSection.vue | Воля, кошмары, королевства/сущность |
| III. Искусства | ArtsSection.vue | Искусства и права рождения |
| IV. Связи | ConnectionsSection.vue | Проклятия, связи, особенности |
| V. Инвентарь | InventorySection.vue | Артефакты, снаряжение, расходники |
| VI. Спутники | CompanionsSection.vue | Три блока спутников |
| VII. Заметки | NotesSection.vue | Текстовое поле заметок |

### MainSection.vue

Основная секция чар-листа, содержащая:

**Поля:**
- Имя персонажа / Имя игрока
- Раса/Китэйн / Концепция
- Возраст / Тип чар-листа
- Опыт (ExperienceGrid)
- Здоровье (DotStripComplex) + Богатство
- Увечья (InjuryFigure)

**Кнопки управления:**
- Загрузить — загрузка JSON файла
- Сохранить — скачивание JSON файла
- Новый персонаж — создание новой вкладки
- Печать — печать страницы
- Тема (🌙/☀️) — переключение темы

---

## Функциональность

### Типы чар-листов

#### Материк (mainland)
Стандартный тип для персонажей материка.

**Секция "Рассудок":**
- Постоянная воля (мин: 2)
- Перебросы
- Кошмары
- 10 Королевств (нумерованные 1-10)

#### Фэйри (faerie)
Тип для персонажей-фэйри с альтернативной механикой.

**Секция "Рассудок":**
- Постоянная воля (мин: 2)
- Перебросы
- Кошмары
- Глэм
- Банальность
- Королевства: Пространство, Люди, Фэйри, Потустороннее

### Вычисляемые значения

#### Максимум здоровья
```
MAX = (Храбрость + Телосложение)²
```

Пример: Храбрость=3, Телосложение=2 → MAX = (3+2)² = 25

#### Максимум кошмаров
```
MAX = 10 - Постоянная воля
```

#### Здоровье спутника
```
Здоровье = Уровень × 2
```

### Ограничения значений

| Параметр | Минимум | Максимум |
|----------|---------|----------|
| Атрибуты | 1 | 6 |
| Постоянная воля | 2 | 10 |
| Перебросы | 0 | Постоянная воля |
| Опыт | 0 | 15 |
| Королевства (материк) | 0 | 5 |
| Королевства (фэйри) | 0 | 4 |
| Расходники | 0 | 9 |

### Файловые операции

#### Сохранение
1. Сериализация текущего персонажа в JSON
2. Генерация имени файла: `{транслит_имени}-{дата_время}.json`
3. Скачивание через Blob + временную ссылку

#### Загрузка
1. Выбор JSON файла через file input
2. Чтение файла через FileReader
3. Парсинг JSON и мерж с пустым персонажем
4. Создание новой вкладки с именем файла

### Вкладки персонажей

- Поддержка неограниченного количества вкладок
- Сохранение всех вкладок в localStorage
- Автопереключение при закрытии активной вкладки
- Переименование двойным кликом
- Кнопка закрытия (× при наведении)

---

## Темизация

### CSS Custom Properties

```css
:root {
  --color-surface: #f5f0e6;           /* Фон */
  --color-surface-secondary: #ebe5d8; /* Вторичный фон */
  --color-ink: #2c1810;               /* Текст */
}

.dark {
  --color-surface: #1a1a1a;
  --color-surface-secondary: #2a2a2a;
  --color-ink: #e5e5e5;
}
```

### Переключение темы

```typescript
function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value
  if (isDarkTheme.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('nine-kingdoms-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('nine-kingdoms-theme', 'light')
  }
}
```

### Tailwind конфигурация

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ink': 'var(--color-ink)',
        'surface': 'var(--color-surface)',
        'surface-secondary': 'var(--color-surface-secondary)',
      }
    }
  }
}
```

---

## Локализация

Приложение полностью локализовано на русский язык.

### Элементы интерфейса
- Все метки полей
- Названия секций
- Кнопки управления
- Тултипы и подсказки

### Транслитерация

Утилита `transliterate.ts` используется для генерации имён файлов:

```typescript
// Кириллица → латиница
transliterate("Иван Петров") // → "ivan-petrov"

// Генерация имени файла
generateFilename("Иван Петров") // → "ivan-petrov-2026-01-30_18-30.json"
```

---

## Хранение данных

### localStorage

#### Ключи

| Ключ | Описание |
|------|----------|
| `nine-kingdoms-tabs` | Все вкладки и активная вкладка |
| `nine-kingdoms-theme` | Текущая тема ('dark' / 'light') |

#### Структура данных

```json
{
  "tabs": [
    {
      "id": "abc123",
      "name": "Иван Воин",
      "character": { /* Character object */ }
    }
  ],
  "activeTabId": "abc123"
}
```

#### Миграция

При загрузке проверяется наличие старого ключа `nine-kingdoms-character` (одиночный персонаж) и автоматически мигрируется в новый формат с вкладками.

### Автосохранение

Изменения сохраняются автоматически через `watch` с опцией `deep: true`.

---

## Печать

### CSS для печати

```css
@media print {
  /* Скрытие элементов */
  .no-print {
    display: none !important;
  }
  
  /* Оптимизация фона */
  .print\:bg-transparent {
    background-color: transparent !important;
  }
  
  /* Сброс отступов */
  .print\:p-0 {
    padding: 0 !important;
  }
}
```

### Скрываемые элементы (класс `no-print`)
- Вкладки персонажей
- Кнопки управления
- Навигация секций
- Футер

---

## Сборка и развёртывание

### Команды

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

### Выходные файлы

После `npm run build`:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
```

### Docker

```dockerfile
# Сборка
docker build -t charlist-nine-kingdoms .

# Запуск
docker run -p 80:80 charlist-nine-kingdoms
```

### Переменные окружения

Нет специфических переменных окружения. Приложение полностью статическое.

---

## Ограничения и известные особенности

1. **Только localStorage** — данные хранятся локально в браузере
2. **Нет синхронизации** — нет серверной части для синхронизации между устройствами
3. **Лимит localStorage** — ~5MB на домен
4. **Печать** — оптимизирована для A4, может требовать настройки масштаба

---

## Дальнейшее развитие

Возможные улучшения:
- Экспорт в PDF
- Облачное хранение
- Шаринг персонажей по ссылке
- Импорт/экспорт всех вкладок
- Шаблоны персонажей
- Версионирование изменений
