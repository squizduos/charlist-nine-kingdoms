<template>
  <div class="human-figure-header">
    <h3>ТЕЛО ПЕРСОНАЖА</h3>
    <div class="human-figure-container">
      <svg class="human-figure" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Head -->
        <circle 
          :class="['figure-part', { injured: character.data.figureParts.head }]"
          :id="`head-${character.id}`"
          cx="100" 
          cy="30" 
          r="20"
          @click="togglePart('head')"
        />
        
        <!-- Body -->
        <rect 
          :class="['figure-part', { injured: character.data.figureParts.body }]"
          :id="`body-${character.id}`"
          x="80" 
          y="50" 
          width="40" 
          height="80"
          @click="togglePart('body')"
        />
        
        <!-- Left Arm -->
        <rect 
          :class="['figure-part', { injured: character.data.figureParts.leftArm }]"
          :id="`leftArm-${character.id}`"
          x="40" 
          y="60" 
          width="40" 
          height="15"
          @click="togglePart('leftArm')"
        />
        
        <!-- Right Arm -->
        <rect 
          :class="['figure-part', { injured: character.data.figureParts.rightArm }]"
          :id="`rightArm-${character.id}`"
          x="120" 
          y="60" 
          width="40" 
          height="15"
          @click="togglePart('rightArm')"
        />
        
        <!-- Left Leg -->
        <rect 
          :class="['figure-part', { injured: character.data.figureParts.leftLeg }]"
          :id="`leftLeg-${character.id}`"
          x="85" 
          y="130" 
          width="15" 
          height="60"
          @click="togglePart('leftLeg')"
        />
        
        <!-- Right Leg -->
        <rect 
          :class="['figure-part', { injured: character.data.figureParts.rightLeg }]"
          :id="`rightLeg-${character.id}`"
          x="100" 
          y="130" 
          width="15" 
          height="60"
          @click="togglePart('rightLeg')"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useCharacterStore } from '../stores/characterStore'

const props = defineProps({
  character: {
    type: Object,
    required: true
  }
})

const characterStore = useCharacterStore()

const togglePart = (partName) => {
  const updates = {
    figureParts: {
      ...props.character.data.figureParts,
      [partName]: !props.character.data.figureParts[partName]
    }
  }
  characterStore.updateCharacter(props.character.id, updates)
}
</script>

<style scoped>
.human-figure-header {
  flex: 0 0 auto;
  text-align: center;
  min-width: 150px;
  margin-left: 20px;
}

.human-figure-header h3 {
  margin: 0 0 10px 0;
  font-size: 0.9em;
  color: #333;
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
}

.human-figure-container {
  display: flex;
  justify-content: center;
  margin: 0;
}

.human-figure {
  width: 120px;
  height: 180px;
  border: 1px solid #333;
  border-radius: 4px;
  background: #f9f9f9;
}

.figure-part {
  fill: #e0e0e0;
  stroke: #333;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.figure-part:hover {
  fill: #d0d0d0;
  stroke-width: 3;
}

.figure-part.injured {
  fill: #ff4444;
  stroke: #cc0000;
}

.figure-part.injured:hover {
  fill: #ff6666;
}

@media (max-width: 768px) {
  .human-figure-header {
    margin-left: 0;
    margin-top: 20px;
  }
}
</style>
