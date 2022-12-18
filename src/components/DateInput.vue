<template>
  <div
    class="date-input"
    @click="emit('ontoggle')"
  >
    <p
      class="date-input__value"
      v-text="formattedDate"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, toRef } from 'vue'
import { DateRange } from '../types/DateRange'

const displayOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',

  hour: 'numeric',
  minute: 'numeric',
  hour12: false
}

interface DateInputProps {
  date: DateRange
}

interface DateInputEmits {
  ( event: 'ontoggle'): void
}

const props = defineProps<DateInputProps>()
const emit = defineEmits<DateInputEmits>()

const date = toRef(props, 'date')

const formattedDate = computed((): string => {
  if (date.value.start === date.value.end) {
    return date.value.start.toLocaleDateString('en-US', displayOptions)
  }

  return [date.value.start, date.value.end]
    .map((value: Date) => value.toLocaleDateString('en-US', displayOptions)).join(' - ')

})



</script>

<style scoped>
.date-input {
  width: 460px;
  padding: var(--md) var(--lg);
  border: 1px solid white;
  border-radius: var(--sm);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.date-input:hover {
  transition: box-shadow 200ms ease;
  box-shadow: 0px 8px 24px rgba(255, 255, 255, 0.1);
}

.date-input__value {
  color: white;
  font-weight: bold;
}
</style>