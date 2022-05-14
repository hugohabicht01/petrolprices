<script setup lang="ts">
import { toggleDark } from '~/composables'

const { t, availableLocales, locale } = useI18n()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <header fixed w-full text-xl p-6 backdrop-blur-sm bg-slate-100 z-50 bg-op-60 dark:bg-cyan-900 dark:bg-op-90>
    <nav flex flex-row justify-start justify-between>
      <RouterLink to="/">
        <h1>petrolprices</h1>
      </RouterLink>

      <div flex items-center>
        <Switch aria-label="toggle dark mode" class="vt-switch-appearance" @click="toggleDark()">
          <IconMoon class="vt-switch-appearance-moon" />
          <IconSun class="vt-switch-appearance-sun" />
        </Switch>

        <a class="icon-btn mx-2" :title="t('button.toggle_langs')" @click="toggleLocales">
          <div i-carbon-language />
        </a>

        <RouterLink class="icon-btn mx-2" to="/about" :title="t('button.about')">
          <div i-carbon-dicom-overlay />
        </RouterLink>

        <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank" title="GitHub">
          <div i-carbon-logo-github />
        </a>
      </div>
    </nav>
  </header>
</template>

<style>
.vt-switch-appearance-sun {
  opacity: 1;
}
.vt-switch-appearance-moon {
  opacity: 0;
}

.dark .vt-switch-appearance-sun {
  opacity: 0;
}
.dark .vt-switch-appearance-moon {
  opacity: 1;
}

.dark .vt-switch-appearance .vt-switch-check {
  transform: translateX(18px);
}
</style>
