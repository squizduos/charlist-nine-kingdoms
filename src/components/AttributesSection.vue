<template>
  <div class="attributes">
    <div class="attribute-category">
      <h2>СОЦИАЛЬНЫЕ</h2>
      <div class="attribute">
        <label>
          ХАРИЗМА 
          <DotLine 
            label=""
            field="charisma"
            :value="character.data.charisma"
            :max="5"
            :character="character"
            @update:value="updateField('charisma', $event)"
          />
        </label>
        <label>
          МАНИПУЛИРОВАНИЕ 
          <DotLine 
            label=""
            field="manipulation"
            :value="character.data.manipulation"
            :max="5"
            :character="character"
            @update:value="updateField('manipulation', $event)"
          />
        </label>
        <label>
          ПРОНИЦАТЕЛЬНОСТЬ 
          <DotLine 
            label=""
            field="insight"
            :value="character.data.insight"
            :max="5"
            :character="character"
            @update:value="updateField('insight', $event)"
          />
        </label>
        <label>
          ОБМАН 
          <DotLine 
            label=""
            field="deception"
            :value="character.data.deception"
            :max="5"
            :character="character"
            @update:value="updateField('deception', $event)"
          />
        </label>
        <label>
          ХРАБРОСТЬ 
          <DotLine 
            label=""
            field="brawling"
            :value="character.data.brawling"
            :max="5"
            :character="character"
            @update:value="updateField('brawling', $event)"
          />
        </label>
      </div>
      <ol>
        <li v-for="(specialty, index) in character.data.socialSpecialties" :key="index">
          <input 
            type="text" 
            :value="specialty" 
            @input="updateSpecialty('socialSpecialties', index, $event.target.value)"
          >
        </li>
      </ol>
    </div>
    
    <div class="attribute-category">
      <h2>МЕНТАЛЬНЫЕ</h2>
      <div class="attribute">
        <label>
          ВНИМАНИЕ 
          <DotLine 
            label=""
            field="attention"
            :value="character.data.attention"
            :max="5"
            :character="character"
            @update:value="updateField('attention', $event)"
          />
        </label>
        <label>
          ИНТЕЛЛЕКТ 
          <DotLine 
            label=""
            field="intelligence"
            :value="character.data.intelligence"
            :max="5"
            :character="character"
            @update:value="updateField('intelligence', $event)"
          />
        </label>
        <label>
          НАУКИ 
          <DotLine 
            label=""
            field="sciences"
            :value="character.data.sciences"
            :max="5"
            :character="character"
            @update:value="updateField('sciences', $event)"
          />
        </label>
        <label>
          КУЛЬТУРА 
          <DotLine 
            label=""
            field="culture"
            :value="character.data.culture"
            :max="5"
            :character="character"
            @update:value="updateField('culture', $event)"
          />
        </label>
        <label>
          НАВЫКИ 
          <DotLine 
            label=""
            field="culture"
            :value="character.data.skills"
            :max="5"
            :character="character"
            @update:value="updateField('skills', $event)"
          />
        </label>
      </div>
      <ol>
        <li v-for="(specialty, index) in character.data.mentalSpecialties" :key="index">
          <input 
            type="text" 
            :value="specialty" 
            @input="updateSpecialty('mentalSpecialties', index, $event.target.value)"
          >
        </li>
      </ol>
    </div>
    
    <div class="attribute-category">
      <h2>ФИЗИЧЕСКИЕ</h2>
      <div class="attribute">
        <label>
          ТЕЛОСЛОЖЕНИЕ 
          <DotLine 
            label=""
            field="physique"
            :value="character.data.physique"
            :max="5"
            :character="character"
            @update:value="updateField('physique', $event)"
          />
        </label>
        <label>
          ЗАЩИТА 
          <DotLine 
            label=""
            field="defense"
            :value="character.data.defense"
            :max="5"
            :character="character"
            @update:value="updateField('defense', $event)"
          />
        </label>
        <label>
          ЛОВКОСТЬ 
          <DotLine 
            label=""
            field="dexterity"
            :value="character.data.dexterity"
            :max="5"
            :character="character"
            @update:value="updateField('dexterity', $event)"
          />
        </label>
        <label>
          НАПАДЕНИЕ 
          <DotLine 
            label=""
            field="strength"
            :value="character.data.strength"
            :max="5"
            :character="character"
            @update:value="updateField('strength', $event)"
          />
        </label>
        <label>
          СКРЫТНОСТЬ 
          <DotLine 
            label=""
            field="stamina"
            :value="character.data.stamina"
            :max="5"
            :character="character"
            @update:value="updateField('stamina', $event)"
          />
        </label>
      </div>
      <ol>
        <li v-for="(specialty, index) in character.data.physicalSpecialties" :key="index">
          <input 
            type="text" 
            :value="specialty" 
            @input="updateSpecialty('physicalSpecialties', index, $event.target.value)"
          >
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import DotLine from './DotLine.vue'

const props = defineProps({
  character: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const updateField = (field, value) => {
  emit('update', field, value)
}

const updateSpecialty = (field, index, value) => {
  const specialties = [...props.character.data[field]]
  specialties[index] = value
  emit('update', field, specialties)
}
</script>

<style scoped>
.attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.attribute-category {
  flex: 1;
  min-width: 250px;
}

.attribute-category h2 {
  margin-top: 0;
}

.attribute label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
}

.attribute label :deep(.damage-line) {
  margin: 0;
  flex: 1;
  margin-left: 10px;
}

.attribute label :deep(.damage-line label) {
  display: none;
}

.attribute label :deep(.dots) {
  justify-content: flex-end;
}

ol {
  padding-left: 20px;
}

ol li {
  margin: 5px 0;
}

ol li input {
  width: 90%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .attributes {
    flex-direction: column;
  }
  
  .attribute-category {
    min-width: 100%;
  }
}
</style>
