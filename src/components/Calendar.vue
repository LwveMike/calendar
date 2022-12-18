<template>
  <div class="calendar">
    <div class="calendar__header">
      <div
        class="calendar__header__arrow calendar__header__arrow-left"
        v-text="'ᐊ'"
        @click="calendar.prependIfDoesntExist()"
      ></div>
      <p class="calendar__header__display" v-text="periods.left"/>
      <p class="calendar__header__display" v-text="periods.right"/>
      <div
        class="calendar__header__arrow calendar__header__arrow-right"
        v-text="'ᐅ'"
        @click="calendar.appendIfDoesntExist()"
      />
    </div>
    <div class="calendar__panel calendar__panel__first">
      <div class="calendar__panel__weekdays">
        <div
          v-for="(dayName, index) in weekDays"
          :key="index"
          class="calendar__weekday"
          v-text="dayName"
        />
      </div>
      <div class="calendar__panel__dates">
        <template
          v-for="(dateCell, index) in calendar.currentDisplayed.left.getDateGrid"
        >
          <div
            v-if="dateCell !== undefined"
            :key="index + dateCell.getDate()"
            v-text="dateCell.getDate()"
            class="calendar__date"
            :class="getDatePosition(selectedDate, dateCell)"
            @mousedown="startsDragging(dateCell)"
            @mouseover="continuesDragging(dateCell)"
            @mouseup="stopsDragging(dateCell)"
          />
          <div
            v-else
            :key="index"
          />
        </template>
      </div>
    </div>
    <div class="calendar__panel calendar__panel__second">
      <div class="calendar__panel__weekdays">
        <div
          v-for="(dayName, index) in weekDays"
          :key="index"
          class="calendar__weekday"
          v-text="dayName"
        />
      </div>
      <div class="calendar__panel__dates">
        <template
          v-for="(dateCell, index) in calendar.currentDisplayed.right.getDateGrid"
        >
          <div
            v-if="dateCell !== undefined"
            :key="index + dateCell.getDate()"
            v-text="dateCell.getDate()"
            class="calendar__date"
            :class="getDatePosition(selectedDate, dateCell)"
            @mousedown="startsDragging(dateCell)"
            @mouseover="continuesDragging(dateCell)"
            @mouseup="stopsDragging(dateCell)"
          />
          <div
            v-else
            :key="index"
          />
        </template>
      </div>
    </div>
    <template
      v-if="isTimeVisible"
    >
      <div
        class="calendar__time__item"
      >
        <p class="calendar__time_item__label" v-text="startDate"/>
        <input
          type="time"
          class="calendar__time__item__value"
          :value="startTime"
          @change="handleStartTimeChange"
        />
      </div>
      <div class="calendar__time__item">
        <p class="calendar__time_item__label" v-text="endDate"/>
        <input
          type="time"
          class="calendar__time__item__value"
          :value="endTime"
          @change="handleEndTimeChange"
        />
      </div>
    </template>
    <div v-if="disabled" class="disabled" />
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, toRef, ref } from 'vue'
import { Calendar } from '../helpers/CalendarDate'
import { DateRange, DateRangePayload } from '../types/DateRange'

interface CalendarProps {
  selectedDate: DateRange,
  isTimeVisible: boolean,
  disabled: boolean
}

const calendar = reactive(new Calendar())
const isDragging = ref(false)

const props = defineProps<CalendarProps>()
const selectedDate = toRef(props, 'selectedDate')

const periods = computed(() => {
  const left = calendar.currentDisplayed.left.data.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  const right = calendar.currentDisplayed.right.data.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  return { left, right }
})

const startDate = computed(() => getFormattedTime(selectedDate.value.start))
const endDate = computed(() => getFormattedTime(selectedDate.value.end))

const startTime = computed(() => {
  return selectedDate.value.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
})
const endTime = computed(() => {
  return selectedDate.value.end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
})

const getFormattedTime = (date: Date) => {
  return `From: ${date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })}`
}

const weekDays: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

interface CalendarEmits {
  ( event: 'onselect', dates: DateRangePayload): void
}
const emit = defineEmits<CalendarEmits>()

const isExactDate = (dateRange: DateRange, date: Date): boolean => {
  if (dateRange.start === dateRange.end) {
    return new Date(dateRange.start).setHours(0,0,0,0) === date.setHours(0,0,0,0)
  }

  return [dateRange.start, dateRange.end]
    .map(d => new Date(d).setHours(0,0,0,0)).includes(date.setHours(0,0,0,0))
}

const isBetweenDate = (dateRange: DateRange, date: Date): boolean => {
  return dateRange.start < date && dateRange.end > date
}

const getDatePosition = (dateRange: DateRange, date: Date): { [key: string]: boolean } => {
  if (isExactDate(dateRange, date)) return { exact: true }
  if (isBetweenDate(dateRange, date)) return { between: true }

  return {}
}

const startsDragging = (date: Date) => {
  isDragging.value = true
  emit('onselect', { start: date, end: date })
}

const continuesDragging = (date: Date) => {
  if (!isDragging.value || selectedDate.value.start > date) return

  emit('onselect', { start: null, end: date })
}

const stopsDragging = (date: Date) => {
  isDragging.value = false
  if (selectedDate.value.start > date) {
    emit('onselect', { start: null, end: selectedDate.value.start })
  } else {
    emit('onselect', { start: null, end: date })
  }
}

const handleStartTimeChange = (event: Event) => {
  const [hours, minutes] = (event.target as HTMLInputElement).value.split(':')
  emit('onselect', { start: new Date(new Date(selectedDate.value.start).setHours(+hours, +minutes)), end: null })
}

const handleEndTimeChange = (event: Event) => {
  const [hours, minutes] = (event.target as HTMLInputElement).value.split(':')
  emit('onselect', { start: null, end: new Date(new Date(selectedDate.value.end).setHours(+hours, +minutes)) })
}

</script>

<style scoped>
.calendar {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 64px;
  column-gap: 32px;
}

.calendar__header {
  grid-column: 1 / -1;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar__header__arrow {
  --arrow-spacing: 32px;
  font-weight: 900;
  font-size: 24px;
  padding: var(--md) var(--lg);
  transition: all 200ms ease;
  cursor: pointer;
}

.calendar__header__arrow-left {
  margin-left: var(--arrow-spacing);
}

.calendar__header__arrow-right {
  margin-right: var(--arrow-spacing);
}

.calendar__header__arrow:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 200ms ease;
}

.calendar__panel {
  --date-size: 48px;
}

.calendar__panel__weekdays {
  display: grid;
  grid-template-columns: repeat(7, var(--date-size));
  justify-items: center;
  color: white;
}

.calendar__weekday {
  padding: var(--sm) var(--md);
  font-weight: 600;
  font-size: 18px;
}

.calendar__panel__dates {
  display: grid;
  grid-template-columns: repeat(7, var(--date-size));
  justify-items: center;
  align-items: center;
  color: white;
}

.calendar__date {
  width: var(--date-size);
  height: var(--date-size);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 200ms ease;
  cursor: pointer;
}

.calendar__date:hover {
  transition: all 200ms ease;
  background-color: rgba(var(--accent-rgb), 0.6);
}

.exact {
  transition: all 200ms ease;
  background-color: rgba(var(--accent-rgb), 0.6);
}

.between {
  transition: all 200ms ease;
  background-color: rgba(var(--accent-rgb), 0.3);
}

.calendar__time__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--xlg);
}

.calendar__time_item__label {
  color: var(--complementary);
  font-size: 18px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
}

.calendar__time__item__value {
  background-color: var(--main);
  outline: none;
  border: 1px solid white;
  padding: var(--sm) var(--md);
  color: white;
}

.disabled {
  position: absolute;
  inset: 0;
  z-index: 999999;
  background-color: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
}

</style>