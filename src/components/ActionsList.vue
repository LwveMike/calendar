<template>
  <div class="actions-list">
    <action-item
      v-for="(action, link) in actions"
      :key="link"
      v-bind="action"
      @ontoggle="emit('onupdate', link)"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Action } from '../types/action'
import ActionItem from './Action.vue'

interface ActionsListProps {
  actions: Action
}

interface ActionsListEmits {
  ( event: 'onupdate', link: string): void
}

defineProps<ActionsListProps>()
const emit = defineEmits<ActionsListEmits>()
</script>

<style scoped>
.actions-list {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: var(--lg);
  padding-block: var(--lg);
}
</style>