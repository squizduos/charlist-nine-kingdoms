<template>
  <div class="additional-info">
    <div class="section">
      <h2>ОПЫТ</h2>
      <DotLine 
        label=""
        field="experience"
        :value="character.data.experience"
        :max="5"
        :character="character"
        @update:value="updateField('experience', $event)"
      />
    </div>
    <div class="section">
      <h2>НР</h2>
      <DotLine 
        label=""
        field="health"
        :value="character.data.health"
        :max="5"
        :character="character"
        @update:value="updateField('health', $event)"
      />
    </div>
    <div class="section">
      <h2>ЛЕТАЛ</h2>
      <DotLine 
        label=""
        field="lethal"
        :value="character.data.lethal"
        :max="5"
        :character="character"
        @update:value="updateField('lethal', $event)"
      />
    </div>
    <div class="section">
      <h2>ТУПОЙ</h2>
      <DotLine 
        label=""
        field="stupid"
        :value="character.data.stupid"
        :max="5"
        :character="character"
        @update:value="updateField('stupid', $event)"
      />
    </div>
  </div>

  <div class="other-details">
    <div class="section">
      <h2>БОЕЗАПАС</h2>
      <input 
        type="text" 
        :value="character.data.ammo" 
        @input="updateField('ammo', $event.target.value)"
      >
    </div>
    <div class="section">
      <h2>РАСХОДНЫЕ МАТЕРИАЛЫ</h2>
      <div class="resources">
        <label>
          ОЧКИ 
          <DotLine 
            label=""
            field="points"
            :value="character.data.points"
            :max="3"
            :character="character"
            @update:value="updateField('points', $event)"
          />
        </label>
        <label>
          Струны 
          <DotLine 
            label=""
            field="strings"
            :value="character.data.strings"
            :max="3"
            :character="character"
            @update:value="updateField('strings', $event)"
          />
        </label>
        <label>
          ФИМ 
          <DotLine 
            label=""
            field="fim"
            :value="character.data.fim"
            :max="3"
            :character="character"
            @update:value="updateField('fim', $event)"
          />
        </label>
        <label>
          АРТЕФАКТЫ 
          <DotLine 
            label=""
            field="artifacts"
            :value="character.data.artifacts"
            :max="3"
            :character="character"
            @update:value="updateField('artifacts', $event)"
          />
        </label>
      </div>
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
</script>

<style scoped>
.additional-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.additional-info .section {
  flex: 1;
  min-width: 150px;
  text-align: center;
}

.additional-info .section :deep(.damage-line) {
  justify-content: center;
  margin: 0;
}

.additional-info .section :deep(.damage-line label) {
  display: none;
}

.other-details {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.other-details .section {
  flex: 1;
  min-width: 200px;
}

.resources label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
}

.resources label :deep(.damage-line) {
  margin: 0;
  flex: 1;
  margin-left: 10px;
}

.resources label :deep(.damage-line label) {
  display: none;
}

.resources label :deep(.dots) {
  justify-content: flex-end;
}

.section h2 {
  margin-top: 0;
}

.section input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .additional-info, .other-details {
    flex-direction: column;
  }
  
  .additional-info .section, .other-details .section {
    min-width: 100%;
  }
}
</style>
