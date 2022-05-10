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
  <header>
    <nav text-xl flex flex-row justify-start p-6>
      <RouterLink to="/">
        <h1>petrolprices</h1>
      </RouterLink>

      <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
        <div i="carbon-sun dark:carbon-moon" />
      </button>
      <Switch aria-label="toggle dark mode" @click="toggleDark()">
        <div i="dark:carbon-moon" class="opacity-0 h-3 w-3 absolute top-3px left-3px fill-black dark:fill-white" />
        <div i="carbon-sun" class="dark:opacity-0 h-3 w-3 absolute top-3px left-3px fill-black dark:fill-white" />
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
    </nav>
  </header>
</template>
