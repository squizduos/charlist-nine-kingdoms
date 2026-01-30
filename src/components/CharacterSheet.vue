<template>
  <div class="character-sheet active">
    <!-- Header Section -->
    <div class="header">
      <div class="character-info">
        <label>
          ПЕРСОНАЖ 
          <input 
            type="text" 
            :value="character.data.characterName" 
            @input="updateField('characterName', $event.target.value)"
          >
        </label>
        <label>
          ИГРОК 
          <input 
            type="text" 
            :value="character.data.playerName" 
            @input="updateField('playerName', $event.target.value)"
          >
        </label>
        <label>
          КИТЕЙН 
          <input 
            type="text" 
            :value="character.data.kitchenName" 
            @input="updateField('kitchenName', $event.target.value)"
          >
        </label>
      </div>
      <div class="concept">
        <label>
          КОНЦЕПЦИЯ 
          <input 
            type="text" 
            :value="character.data.concept" 
            @input="updateField('concept', $event.target.value)"
          >
        </label>
        <label>
          ВОЗРАСТ 
          <input 
            type="number" 
            :value="character.data.age" 
            @input="updateField('age', $event.target.value)"
          >
        </label>
        <label>
          ТИП ЛИСТА 
          <select 
            :value="character.data.gameType" 
            @change="updateField('gameType', $event.target.value)"
          >
            <option value="Материк">Материк</option>
            <option value="Фейри">Фейри</option>
          </select>
        </label>
      </div>
      <HumanFigure :character="character" />
      <div class="damage-dots">
        <DotLine 
          label="Летальный урон"
          field="lethalDamage"
          :value="character.data.lethalDamage"
          :max="10"
          :big-dots="true"
          :character="character"
          @update:value="updateField('lethalDamage', $event)"
        />
        <DotLine 
          label="Тупой урон"
          field="stupidDamage"
          :value="character.data.stupidDamage"
          :max="10"
          :character="character"
          @update:value="updateField('stupidDamage', $event)"
        />
        <hr>
        <DotLine 
          label="Постоянная Воля"
          field="permanentWill"
          :value="character.data.permanentWill"
          :max="10"
          :big-dots="true"
          :character="character"
          @update:value="updateField('permanentWill', $event)"
        />
        <hr>
      </div>
      <div class="damage-dots">
        <DotLine 
          label="Бедламы"
          field="mentalDamageBig"
          :value="character.data.mentalDamageBig"
          :max="10"
          :big-dots="true"
          :character="character"
          @update:value="updateField('mentalDamageBig', $event)"
        />
        <DotLine 
          label="Кошмары"
          field="mentalDamageSmall"
          :value="character.data.mentalDamageSmall"
          :max="10"
          :character="character"
          @update:value="updateField('mentalDamageSmall', $event)"
        />
        <hr>
        <DotLine 
          label="Перебросы"
          field="rerolls"
          :value="character.data.rerolls"
          :max="10"
          :character="character"
          @update:value="updateField('rerolls', $event)"
        />
      </div>

      <div class="" style="text-align: center;">
        <DotLine 
          label="Опыт"
          field="experience"
          :value="character.data.experience"
          :max="15"
          :big-dots="true"
          :character="character"
          @update:value="updateField('experience', $event)"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        :class="['tab-button', { active: activeTab === 'attributes' }]"
        @click="activeTab = 'attributes'"
      >
        ХАРАКТЕРИСТИКИ
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'additional' }]"
        @click="activeTab = 'additional'"
      >
        ДОПОЛНИТЕЛЬНО
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'notes' }]"
        @click="activeTab = 'notes'"
      >
        ЗАМЕТКИ
      </button>
    </div>

    <!-- Tab Content -->
    <div v-show="activeTab === 'attributes'" class="tab-content">
      <AttributesSection :character="character" @update="updateField" />
    </div>

    <div v-show="activeTab === 'additional'" class="tab-content">
      <AdditionalSection :character="character" @update="updateField" />
    </div>

    <div v-show="activeTab === 'notes'" class="tab-content">
      <NotesSection :character="character" @update="updateField" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCharacterStore } from '../stores/characterStore'
import HumanFigure from './HumanFigure.vue'
import DotLine from './DotLine.vue'
import AttributesSection from './AttributesSection.vue'
import AdditionalSection from './AdditionalSection.vue'
import NotesSection from './NotesSection.vue'

const props = defineProps({
  character: {
    type: Object,
    required: true
  }
})

const characterStore = useCharacterStore()
const activeTab = ref('attributes')

const updateField = (field, value) => {
  characterStore.updateCharacter(props.character.id, { [field]: value })
}
</script>

<style scoped>
.character-sheet {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.character-info, .concept {
  flex: 1;
  min-width: 200px;
}

.character-info label, .concept label {
  display: block;
  margin: 5px 0;
  font-weight: bold;
}

.character-info input, .concept input, .concept select {
  width: 100%;
  padding: 5px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.damage-dots {
  margin-top: 10px;
  text-align: left;
}

.character-id {
  font-size: 2em;
  margin: 0;
  text-align: center;
  flex-basis: 100%;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #333;
  margin-bottom: 20px;
}

.tab-button {
  background: #f8f8f8;
  border: 1px solid #ccc;
  border-bottom: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  color: #666;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: #e8e8e8;
  color: #333;
}

.tab-button.active {
  background: white;
  color: #333;
  border-bottom: 2px solid white;
  margin-bottom: -2px;
}

.tab-content {
  display: block;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: center;
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .tab-button {
    border: 1px solid #ccc;
    border-bottom: none;
  }
  
  .tab-button.active {
    border-bottom: 2px solid #333;
  }
}
</style>
