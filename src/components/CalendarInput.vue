<template>
  <div class="calendar-input__wrapper">
    <div class="calendar-input">
      <date-input
        :date="selectedDate"
        @ontoggle="toggleCalendarVisibility"
      />
      <calendar
        v-show="isCalendarVisible"
        :selected-date="selectedDate"
        :is-time-visible="isTimeVisible"
        :disabled="isCalendarDisabled"
        @onselect="handleSelect"
      />
    </div>
    <div
      v-show="isCalendarVisible && areShortcutsVisible"
      class="calendar-input__shortcuts"
    >
      <p
        v-for="(shortcut, index) in shortcuts"
        :key="index"
        class="calendar-input__shortcut"
        :class="{ selected: isShortcutSelected(shortcut.value) }"
        v-text="shortcut.label"
        @click="handleShortcutSelected(shortcut.value)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRef, computed, watch } from 'vue'
import { DateRange, DateRangePayload } from '../types/DateRange'
import Calendar from './Calendar.vue'
import DateInput from './DateInput.vue'

interface CalendarInputProps {
  selectedDate: DateRange,
  isTimeVisible: boolean,
  areShortcutsVisible: boolean
}

const isCalendarVisible = ref(false)
const isCalendarDisabled = computed(() => {
  return shortcutValue.value !== -1
})

const props = defineProps<CalendarInputProps>()
const selectedDate = toRef(props, 'selectedDate')
const areShortcutsVisible = toRef(props, 'areShortcutsVisible')

const emit = defineEmits<{
  ( event: 'onselect', date: DateRangePayload): void
}>()

const shortcutValue = ref(-1)

const shortcuts = [
  { label: 'last 14 days', value: 1.21e+9 },
  { label: 'last 7 days', value: 6.048e+8 },
  { label: 'last 3 days', value: 2.592e+8 },
  { label: 'last day', value: 8.64e+7 },
  { label: 'custom', value: -1 }
]

const toggleCalendarVisibility = () => {
  isCalendarVisible.value = !isCalendarVisible.value
}

const handleSelect = (dates: DateRangePayload) => {
  emit('onselect', dates)
}

const handleShortcutSelected = (difference: number) => {
  shortcutValue.value = difference
  if (difference === -1) {
    emit('onselect', { start: selectedDate.value.end, end: selectedDate.value.end })
  } else {
    emit('onselect', { start: new Date(selectedDate.value.end.getTime() - difference), end: null })
  }
}

watch(areShortcutsVisible, (current: boolean) => {
  if (!current) shortcutValue.value = -1
})

const isShortcutSelected = (difference: number) => {
  return shortcutValue.value === difference
}
</script>

<style scoped>
.calendar-input__wrapper {
  display: flex;
  min-height: 600px;
  column-gap: var(--xlg);
}

.calendar-input {
  width: 760px;
  display: flex;
  flex-direction: column;
  margin-block: var(--lg);
  row-gap: var(--xlg);
}

.calendar-input__shortcuts {
  width: 200px;
  display: flex;
  flex-direction: column;
  color: white;
  align-self: center;
  border: 1px solid white;
}

.calendar-input__shortcut {
  cursor: pointer;
  padding: var(--lg) var(--xlg);
  transition: background-color 200ms ease;
}

.calendar-input__shortcut:hover {
  background-color: rgba(var(--accent-rgb), 0.3);
  transition: background-color 200ms ease;
}

.selected {
  background-color: rgba(var(--accent-rgb), 0.6);
}
</style>