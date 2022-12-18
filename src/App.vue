<template>
  <div class="wrapper">
    <actions-list
      :actions="actions"
      @onupdate="handleActionsUpdate"
    />
    <calendar-input
      :selected-date="selectedDate"
      :is-time-visible="actions.time.value"
      :are-shortcuts-visible="actions.shortcuts.value"
      @onselect="assignDate"
    />
  </div>
</template>

<script lang="ts" setup>
import './global.css'
import { ref, reactive } from 'vue'
import { DateRange, DateRangePayload } from './types/DateRange'
import ActionsList from './components/ActionsList.vue'
import CalendarInput from './components/CalendarInput.vue'
import { Action } from './types/action'

const today = new Date()

const selectedDate = reactive<DateRange>({ start: today, end: today })

const actions = reactive<Action>({
  time: { label: 'Time', value: false },
  shortcuts: { label: 'Shortcuts', value: false }
})

const assignDate = (dates: DateRangePayload) => {
  if (dates.start !== null) selectedDate.start = dates.start
  if (dates.end !== null) selectedDate.end = dates.end
}

const handleActionsUpdate = (link: string) => {
  actions[link].value = !actions[link].value

}

</script>

<style scoped>
.wrapper {
  padding: var(--lg);
}

</style>