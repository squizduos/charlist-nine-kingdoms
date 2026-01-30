<template>
  <div class="">
    <label>{{ label }}</label>
    <div 
      :class="['dots', { 'big-dots': bigDots }]" 
      :data-max="max" 
      :data-field="field"
    >
      <span
        v-for="i in max"
        :key="i"
        :class="['dot', { 
          filled: i <= value,
          locked: isLocked(i)
        }]"
        :data-value="i"
        @click="handleClick(i)"
        @contextmenu.prevent="handleRightClick(i)"
      >
        ⬤
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCharacterStore } from '../stores/characterStore'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  field: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 10
  },
  bigDots: {
    type: Boolean,
    default: false
  },
  character: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:value'])

const characterStore = useCharacterStore()

const limits = computed(() => {
  if (props.character && typeof props.character.calculateDotLimits === 'function') {
    return props.character.calculateDotLimits()
  }
  return {}
})

const isLocked = (dotValue) => {
  const fieldLimits = limits.value[props.field]
  if (fieldLimits !== undefined) {
    return dotValue > fieldLimits
  }
  return false
}

const handleClick = (dotValue) => {
  if (isLocked(dotValue)) return
  
  const fieldLimits = limits.value[props.field]
  if (fieldLimits !== undefined && dotValue > fieldLimits) return
  
  emit('update:value', dotValue)
}

const handleRightClick = (dotValue) => {
  if (isLocked(dotValue)) return
  
  const fieldLimits = limits.value[props.field]
  if (fieldLimits !== undefined && dotValue > fieldLimits) return
  
  const newValue = Math.max(0, dotValue - 1)
  emit('update:value', newValue)
}
</script>

<style scoped>
.damage-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 10px;
}

.damage-line label {
  font-size: 0.8em;
  font-weight: bold;
  color: #333;
  margin: 0;
  min-width: 80px;
}

.dots {
  display: flex;
  gap: 2px;
  margin: 0;
}

.dot {
  font-size: 0.9em;
  cursor: pointer;
  transition: color 0.2s ease;
  color: #ccc;
}

.dot:hover {
  color: #666;
}

.dot.filled {
  color: black;
}

.dot.locked {
  color: #999 !important;
  cursor: not-allowed !important;
  opacity: 0.6;
}

.dot.locked:hover {
  color: #999 !important;
}

.dot.locked.filled {
  color: #999 !important;
}

.big-dots .dot {
  font-size: 1.2em;
}

.big-dots .dot:hover {
  color: #666;
}

.big-dots .dot.filled {
  color: black;
}
</style>
