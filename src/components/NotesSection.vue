<template>
  <div class="additional-notes">
    <h2>ДОПОЛНИТЕЛЬНЫЕ ЗАМЕТКИ</h2>
    <ul>
      <li v-for="(note, index) in character.data.notes" :key="index">
        <input 
          type="text" 
          :value="note" 
          @input="updateNote(index, $event.target.value)"
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  character: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const updateNote = (index, value) => {
  const notes = [...props.character.data.notes]
  notes[index] = value
  emit('update', 'notes', notes)
}
</script>

<style scoped>
.additional-notes {
  margin-top: 20px;
}

.additional-notes ul {
  list-style: none;
  padding: 0;
}

.additional-notes li {
  margin: 5px 0;
}

.additional-notes input[type="text"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
