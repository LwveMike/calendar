<template>
  <div class="toggle" :class="{ 'toggle-on': value }">
    <div class="toggle__track" />
  </div>
</template>

<script lang="ts" setup>

interface ToggleProps {
  value: boolean
}

defineProps<ToggleProps>()

</script>

<style scoped>
.toggle {
  --transition-duration: 256ms;
  --easing-function: ease-in-out;
  --toggle-width: 50px;
  --toggle-height: calc(var(--toggle-width) / 2);
  --spacing: 6px;

  width: var(--toggle-width);
  height: var(--toggle-height);
  border-radius: 50px;
  padding: var(--spacing);
  background-color: var(--secondary);
  cursor: pointer;
  position: relative;
  transition: background-color var(--transition-duration) var(--easing-function);
}

.toggle-on {
  transition: all var(--transition-duration) var(--easing-function);
  background-color: var(--accent);
  box-shadow: 0px 0px 10px 0px var(--accent);
}

.toggle__track {
  --track-size: calc(var(--toggle-height) - (var(--spacing) * 2));

  width: var(--track-size);
  height: var(--track-size);
  border-radius: 50%;
  background-color: var(--main);
  position: absolute;
  top: var(--spacing);
  left: var(--spacing);
  transition: all var(--transition-duration) var(--easing-function);
}

.toggle-on .toggle__track{
  transition: all var(--transition-duration) var(--easing-function);
  top: calc(100% - var(--spacing) - var(--track-size));
  left: calc(100% - var(--spacing) - var(--track-size));
}
</style>