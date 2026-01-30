<script setup lang="ts">
import type { Injuries } from '../../types/character'

const props = defineProps<{
  modelValue: Injuries
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Injuries]
}>()

function toggleInjury(part: keyof Injuries) {
  const newInjuries = { ...props.modelValue }
  newInjuries[part] = !newInjuries[part]
  emit('update:modelValue', newInjuries)
}

function getPartColor(part: keyof Injuries): string {
  return props.modelValue[part] ? '#8b0000' : '#d4c49c'
}
</script>

<template>
  <div class="injury-figure">
    <div class="text-sm font-medium mb-2">Увечья</div>
    <svg
      viewBox="0 0 100 200"
      class="w-20 h-40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Голова -->
      <circle
        cx="50"
        cy="20"
        r="15"
        :fill="getPartColor('head')"
        stroke="#2c1810"
        stroke-width="2"
        class="cursor-pointer hover:opacity-80 transition-opacity"
        @click="toggleInjury('head')"
      />
      
      <!-- Тело -->
      <rect
        x="35"
        y="40"
        width="30"
        height="50"
        rx="5"
        :fill="getPartColor('body')"
        stroke="#2c1810"
        stroke-width="2"
        class="cursor-pointer hover:opacity-80 transition-opacity"
        @click="toggleInjury('body')"
      />
      
      <!-- Левая рука -->
      <rect
        x="5"
        y="45"
        width="25"
        height="12"
        rx="5"
        :fill="getPartColor('leftArm')"
        stroke="#2c1810"
        stroke-width="2"
        class="cursor-pointer hover:opacity-80 transition-opacity"
        @click="toggleInjury('leftArm')"
      />
      
      <!-- Правая рука -->
      <rect
        x="70"
        y="45"
        width="25"
        height="12"
        rx="5"
        :fill="getPartColor('rightArm')"
        stroke="#2c1810"
        stroke-width="2"
        class="cursor-pointer hover:opacity-80 transition-opacity"
        @click="toggleInjury('rightArm')"
      />
      
      <!-- Левая нога -->
      <rect
        x="35"
        y="95"
        width="12"
        height="45"
        rx="5"
        :fill="getPartColor('leftLeg')"
        stroke="#2c1810"
        stroke-width="2"
        class="cursor-pointer hover:opacity-80 transition-opacity"
        @click="toggleInjury('leftLeg')"
      />
      
      <!-- Правая нога -->
      <rect
        x="53"
        y="95"
        width="12"
        height="45"
        rx="5"
        :fill="getPartColor('rightLeg')"
        stroke="#2c1810"
        stroke-width="2"
        class="cursor-pointer hover:opacity-80 transition-opacity"
        @click="toggleInjury('rightLeg')"
      />
    </svg>
    
    <!-- Легенда -->
    <div class="text-xs text-ink/70 mt-1 space-y-0.5">
      <div v-if="modelValue.head" class="text-blood">Голова</div>
      <div v-if="modelValue.body" class="text-blood">Тело</div>
      <div v-if="modelValue.leftArm" class="text-blood">Левая рука</div>
      <div v-if="modelValue.rightArm" class="text-blood">Правая рука</div>
      <div v-if="modelValue.leftLeg" class="text-blood">Левая нога</div>
      <div v-if="modelValue.rightLeg" class="text-blood">Правая нога</div>
    </div>
  </div>
</template>
