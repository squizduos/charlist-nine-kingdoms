<script setup lang="ts">
import { computed } from 'vue'

// Кошмары (нижняя линейка, MAX = 10 - Постоянная воля) и Бедламы (верхняя линейка, MAX = 10).
// Повторный клик по последней точке кошмаров, когда линейка уже заполнена до максимума,
// означает кошмар сверх лимита - точка добавляется в Бедламы, а кошмары остаются на максимуме.
// Бедламы не уменьшаются при уменьшении кошмаров и не пересчитываются при смене Постоянной воли.
const props = withDefaults(defineProps<{
  nightmares: number
  bedlams: number
  nightmaresMax: number
  bedlamsMax?: number
  disabled?: boolean
}>(), {
  bedlamsMax: 10,
  disabled: false,
})

const emit = defineEmits<{
  'update:nightmares': [value: number]
  'update:bedlams': [value: number]
}>()

const bedlamDots = computed(() => Array.from({ length: props.bedlamsMax }, (_, i) => i + 1))
const nightmareDots = computed(() => Array.from({ length: props.nightmaresMax }, (_, i) => i + 1))

// На случай, если сохранённое значение кошмаров больше текущего MAX
// (например, после увеличения Постоянной воли) - само значение не трогаем, только отображение
const displayedNightmares = computed(() => Math.min(props.nightmares, props.nightmaresMax))

function isBedlamFilled(dotIndex: number): boolean {
  return dotIndex <= props.bedlams
}

function handleBedlamClick(dotIndex: number) {
  if (props.disabled) return
  const newValue = dotIndex === props.bedlams ? dotIndex - 1 : dotIndex
  emit('update:bedlams', Math.max(0, Math.min(props.bedlamsMax, newValue)))
}

function isNightmareFilled(dotIndex: number): boolean {
  return dotIndex <= displayedNightmares.value
}

function handleNightmareClick(dotIndex: number) {
  if (props.disabled) return

  // Клик по последней точке уже заполненной до максимума линейки - кошмар сверх лимита
  if (dotIndex === props.nightmaresMax && displayedNightmares.value === props.nightmaresMax) {
    emit('update:bedlams', Math.min(props.bedlamsMax, props.bedlams + 1))
    return
  }

  const newValue = dotIndex === displayedNightmares.value ? dotIndex - 1 : dotIndex
  emit('update:nightmares', Math.max(0, newValue))
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- Верхний ряд: Бедламы -->
    <div class="flex gap-1 items-center">
      <button
        v-for="dot in bedlamDots"
        :key="`bedlam-${dot}`"
        type="button"
        class="dot"
        :class="{
          'filled': isBedlamFilled(dot),
          'cursor-not-allowed opacity-60': disabled
        }"
        :disabled="disabled"
        @click="handleBedlamClick(dot)"
        :aria-label="`Бедлам ${dot} из ${bedlamsMax}`"
      />
    </div>

    <!-- Нижний ряд: Кошмары -->
    <div class="flex gap-1 items-center">
      <button
        v-for="dot in nightmareDots"
        :key="`nightmare-${dot}`"
        type="button"
        class="dot"
        :class="{
          'filled': isNightmareFilled(dot),
          'cursor-not-allowed opacity-60': disabled
        }"
        :disabled="disabled"
        @click="handleNightmareClick(dot)"
        :aria-label="`Кошмар ${dot} из ${nightmaresMax}`"
      />
    </div>
  </div>
</template>
