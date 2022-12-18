<template>
  <div class="action">
    <p
      class="action__label"
      v-text="label"
    />
    <toggle
      :value="value"
      @click="emit('ontoggle')"
    />
  </div>
</template>

<script lang="ts" setup>
import Toggle from './Toggle.vue'

interface ActionProps {
  label: string,
  value: boolean
}

interface ActionEmit {
  (event: 'ontoggle'): void
}

defineProps<ActionProps>()
const emit = defineEmits<ActionEmit>()

</script>

<style>
.action {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--md);
}

.action__label {
  font-size: 22px;
  font-weight: 600;
  color: white;
}
</style>