<template>
  <button class="vt-switch block flex-shrink-0 h-5 relative w-10 border-rounded-11px bg-#1f1f1f dark:bg-#2f2f2f" type="button" role="switch">
    <span class="vt-switch-check h-4 absolute w-4 top-1px left-1px border-rounded-50% shadow dark:bg-slate-900">
      <span v-if="$slots.default" class="vt-switch-icon block h-4 overflow-hidden relative w-4 border-radius-50%">
        <slot />
      </span>
    </span>
  </button>
</template>

<style>
.vt-switch {
  transition: border-color 0.25s, background-color 0.25s;
}

.vt-switch-check {
  transition: background-color 0.25s, transform 0.25s;
}

/*
.vt-switch-icon svg {
  @apply h-3 absolute w-3;
  top: 3px;
  left: 3px;
  fill: var(--vt-c-text-2);
}

.dark .vt-switch-icon svg {
  fill: var(--vt-c-text-1);
  transition: opacity 0.25s;
}
*/
</style>
