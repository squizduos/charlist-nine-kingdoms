<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useCharacterStore } from '../../stores/character'
import { renderMarkdown, htmlToMarkdown } from '../../utils/markdown'

const store = useCharacterStore()
const character = computed(() => store.character)

type EditorMode = 'source' | 'wysiwyg'

const editorMode = ref<EditorMode>('source')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const editableRef = ref<HTMLDivElement | null>(null)

const previewHtml = computed(() => renderMarkdown(character.value.notes || ''))

// Заполняет визуальный редактор актуальным содержимым заметок
function syncEditableFromNotes() {
  nextTick(() => {
    if (editableRef.value) {
      const notes = character.value.notes || ''
      // Пустые заметки оставляем как пустой элемент, чтобы сработал CSS-плейсхолдер (:empty)
      editableRef.value.innerHTML = notes.trim() ? renderMarkdown(notes) : ''
    }
  })
}

// Переключение между Markdown-исходником и WYSIWYG
function switchMode(mode: EditorMode) {
  if (mode === editorMode.value) return

  if (editorMode.value === 'wysiwyg' && editableRef.value) {
    // Сохраняем последние изменения из визуального редактора перед переключением
    character.value.notes = htmlToMarkdown(editableRef.value)
  }

  editorMode.value = mode

  if (mode === 'wysiwyg') {
    // htmlToMarkdown() понимает и <p>, и <div> (то, что браузер вставляет при Enter),
    // поэтому здесь не нужно принудительно менять defaultParagraphSeparator -
    // ранее вызов document.execCommand() здесь мог выбросить исключение (например,
    // если элемент ещё не в фокусе) и прерывал заполнение редактора заметками,
    // из-за чего существующий текст заметок "исчезал"
    syncEditableFromNotes()
  }
}

// При переключении вкладки персонажа, пока открыт WYSIWYG - подгружаем заметки новой вкладки
watch(() => store.activeTabId, () => {
  if (editorMode.value === 'wysiwyg') {
    syncEditableFromNotes()
  }
})

function handleWysiwygInput() {
  if (editableRef.value) {
    character.value.notes = htmlToMarkdown(editableRef.value)
  }
}

function execWysiwyg(command: string, value?: string) {
  editableRef.value?.focus()
  try {
    document.execCommand(command, false, value)
  } catch (error) {
    console.error(`execCommand(${command}) не выполнена:`, error)
  }
  handleWysiwygInput()
}

// Оборачивает выделенный текст в textarea маркерами Markdown (например **жирный**)
function wrapSelection(before: string, after: string, placeholder: string) {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = character.value.notes || ''
  const selected = value.slice(start, end) || placeholder

  character.value.notes = value.slice(0, start) + before + selected + after + value.slice(end)

  nextTick(() => {
    textarea.focus()
    const cursorStart = start + before.length
    textarea.setSelectionRange(cursorStart, cursorStart + selected.length)
  })
}

// Добавляет префикс в начало текущей строки (для заголовков и списков)
function insertLinePrefix(prefix: string) {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const value = character.value.notes || ''
  const lineStart = value.lastIndexOf('\n', start - 1) + 1

  character.value.notes = value.slice(0, lineStart) + prefix + value.slice(lineStart)

  nextTick(() => {
    textarea.focus()
    const pos = start + prefix.length
    textarea.setSelectionRange(pos, pos)
  })
}

// Действия панели инструментов - работают как в режиме Markdown, так и в WYSIWYG
function applyBold() {
  if (editorMode.value === 'source') wrapSelection('**', '**', 'жирный текст')
  else execWysiwyg('bold')
}

function applyItalic() {
  if (editorMode.value === 'source') wrapSelection('*', '*', 'курсив')
  else execWysiwyg('italic')
}

function applyHeading() {
  if (editorMode.value === 'source') insertLinePrefix('## ')
  else execWysiwyg('formatBlock', '<h4>')
}

function applyBulletList() {
  if (editorMode.value === 'source') insertLinePrefix('- ')
  else execWysiwyg('insertUnorderedList')
}

function applyNumberList() {
  if (editorMode.value === 'source') insertLinePrefix('1. ')
  else execWysiwyg('insertOrderedList')
}

function applyLink() {
  if (editorMode.value === 'source') {
    wrapSelection('[', '](https://)', 'текст ссылки')
    return
  }
  const url = window.prompt('Введите адрес ссылки:', 'https://')
  if (url) execWysiwyg('createLink', url)
}

function applyCode() {
  if (editorMode.value === 'source') {
    wrapSelection('`', '`', 'код')
    return
  }
  editableRef.value?.focus()
  const selection = window.getSelection()
  const text = selection && !selection.isCollapsed ? selection.toString() : 'код'
  try {
    document.execCommand('insertHTML', false, `<code>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`)
  } catch (error) {
    console.error('execCommand(insertHTML) не выполнена:', error)
  }
  handleWysiwygInput()
}
</script>

<template>
  <div class="notes-section">
    <div class="notes-block">
      <div class="flex items-center justify-between mb-3 border-b border-ink/30 pb-1 flex-wrap gap-2">
        <h3 class="text-lg font-bold">Заметки</h3>
        <div class="flex gap-1 no-print">
          <button
            type="button"
            :class="editorMode === 'source' ? 'btn' : 'btn-secondary'"
            class="btn-small"
            @click="switchMode('source')"
          >
            Markdown
          </button>
          <button
            type="button"
            :class="editorMode === 'wysiwyg' ? 'btn' : 'btn-secondary'"
            class="btn-small"
            @click="switchMode('wysiwyg')"
          >
            Визуально
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-1 mb-2 no-print">
        <button type="button" class="btn-secondary btn-small" title="Жирный" @click="applyBold"><strong>Ж</strong></button>
        <button type="button" class="btn-secondary btn-small" title="Курсив" @click="applyItalic"><em>К</em></button>
        <button type="button" class="btn-secondary btn-small" title="Заголовок" @click="applyHeading">H</button>
        <button type="button" class="btn-secondary btn-small" title="Маркированный список" @click="applyBulletList">•</button>
        <button type="button" class="btn-secondary btn-small" title="Нумерованный список" @click="applyNumberList">1.</button>
        <button type="button" class="btn-secondary btn-small" title="Ссылка" @click="applyLink">Ссылка</button>
        <button type="button" class="btn-secondary btn-small" title="Код" @click="applyCode">{ }</button>
      </div>

      <textarea
        v-if="editorMode === 'source'"
        ref="textareaRef"
        v-model="character.notes"
        class="w-full min-h-[400px] resize-y text-sm leading-relaxed no-print"
        placeholder="Введите заметки о персонаже, предыстории, важные события и другую информацию... Поддерживается упрощённый Markdown: **жирный**, *курсив*, # заголовок, - список, [ссылка](url)."
      />

      <div
        v-else
        ref="editableRef"
        class="markdown-preview markdown-editable w-full min-h-[400px] text-sm leading-relaxed p-2 rounded no-print"
        style="border: 1px solid rgba(128,128,128,0.3);"
        contenteditable="true"
        data-placeholder="Редактируйте заметки визуально - форматирование сохраняется как Markdown"
        @input="handleWysiwygInput"
      />

      <!-- При печати заметки всегда выводятся в виде отрендеренного Markdown -->
      <div class="markdown-preview hidden print:block text-sm leading-relaxed" v-html="previewHtml" />
    </div>
  </div>
</template>

<style scoped>
.markdown-preview :deep(h3),
.markdown-preview :deep(h4),
.markdown-preview :deep(h5) {
  font-weight: bold;
  margin: 0.5rem 0 0.25rem;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.25rem 0;
}

.markdown-preview :deep(p) {
  margin: 0.25rem 0;
}

.markdown-preview :deep(a) {
  color: var(--color-ink);
  text-decoration: underline;
}

.markdown-preview :deep(code) {
  background-color: rgba(128, 128, 128, 0.15);
  padding: 0 0.25rem;
  border-radius: 0.2rem;
}

.markdown-editable:empty::before {
  content: attr(data-placeholder);
  opacity: 0.5;
  pointer-events: none;
}

.markdown-editable:focus {
  outline: none;
  border-color: var(--color-ink) !important;
}
</style>
