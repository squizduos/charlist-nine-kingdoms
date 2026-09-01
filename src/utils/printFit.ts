// Автоматическое сжатие печати, если контент не помещается на физическую страницу
// согласно вёрстке. Все компактные print-размеры в style.css выражены как
// calc(значение * var(--print-scale, 1)) - здесь мы перед печатью один раз измеряем
// фактическую высоту каждой печатной "страницы" (см. TabContainer.vue: разрывы
// расставлены через class="print-break") и, если она не помещается, уменьшаем
// --print-scale так, чтобы самая высокая группа секций уместилась в лист А4.

// Печатная область A4 при полях @page margin: 1cm (см. style.css, блок @media print) -
// высота листа минус поля сверху и снизу, переведённая в px по 96dpi (96px = 2.54cm).
// Если в style.css поменяется @page margin или размер бумаги - обновить и здесь.
const PAGE_HEIGHT_CM = 29.7 - 2 * 1
const PX_PER_CM = 96 / 2.54
const PRINTABLE_HEIGHT_PX = PAGE_HEIGHT_CM * PX_PER_CM

// Небольшой запас (не сжимаем впритык до последнего пикселя) и нижняя граница
// масштаба - дальше текст становится нечитаемым, лучше отдать лишнюю страницу,
// чем печатать нечитаемым шрифтом.
const SAFETY_MARGIN = 0.96
const MIN_SCALE = 0.6

// Группы страниц - это main-section плюс идущие подряд .tab-panel до следующего
// print-break (см. TabContainer.vue). Определяем их прямо по DOM, а не дублируем
// индексы разрывов в JS, чтобы группировка не могла разойтись с вёрсткой.
function getPageGroups(): HTMLElement[][] {
  const container = document.querySelector('.tab-content')
  if (!container) return []

  const mainSection = document.querySelector<HTMLElement>('.main-section')
  const panels = Array.from(container.querySelectorAll<HTMLElement>(':scope > .tab-panel'))

  const groups: HTMLElement[][] = []
  let current: HTMLElement[] = mainSection ? [mainSection] : []

  for (const panel of panels) {
    if (panel.classList.contains('print-break') && current.length > 0) {
      groups.push(current)
      current = []
    }
    current.push(panel)
  }
  if (current.length > 0) groups.push(current)

  return groups
}

function measureGroupHeight(group: HTMLElement[]): number {
  if (group.length === 0) return 0
  const top = group[0].getBoundingClientRect().top
  const bottom = group[group.length - 1].getBoundingClientRect().bottom
  return bottom - top
}

// Вызывается на событие beforeprint - к этому моменту браузер уже применяет
// стили печати, поэтому .tab-panel (обычно скрытые все, кроме активной вкладки)
// отображаются одновременно и их суммарную высоту можно измерить.
export function adjustPrintScale() {
  const groups = getPageGroups()
  if (groups.length === 0) return

  const tallest = Math.max(...groups.map(measureGroupHeight))
  if (tallest <= 0) return

  const neededScale = (PRINTABLE_HEIGHT_PX * SAFETY_MARGIN) / tallest
  const scale = Math.min(1, Math.max(MIN_SCALE, neededScale))

  document.documentElement.style.setProperty('--print-scale', scale.toFixed(3))
}

export function resetPrintScale() {
  document.documentElement.style.removeProperty('--print-scale')
}
