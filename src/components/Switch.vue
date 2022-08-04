<template>
  <!-- this is a switch component shamelessly stolen from the vue docs theme, credits go out to the vue contributors -->
  <button class="vt-switch" type="button" role="switch">
    <span class="vt-switch-check">
      <span v-if="$slots.default" class="vt-switch-icon">
        <slot />
      </span>
    </span>
  </button>
</template>

<style>
.vt-switch {
  position: relative;
  border-radius: 11px;
  display: block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  border: 1px solid rgba(60, 60, 60, 0.29);
  background-color: var(--vt-c-bg-mute);
  transition: border-color 0.25s, background-color 0.25s;
}

.vt-switch:hover {
  border-color: #8e8e8e;
}

.vt-switch-check {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: background-color 0.25s, transform 0.25s;
}

.dark .vt-switch-check {
  background-color: #1a1a1a;
}

.vt-switch-icon {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  overflow: hidden;
}

.vt-switch-icon svg {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 12px;
  height: 12px;
  fill: var(--vt-c-text-2);
}

.dark .vt-switch-icon svg {
  fill: var(--vt-c-text-1);
  transition: opacity 0.25s;
}
</style>
