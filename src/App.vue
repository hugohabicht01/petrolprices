<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'petrolprices',
  meta: [
    { name: 'description', content: 'Echtzeit Tankstellenpreise mit smarten Algorithmen' },
  ],
})
</script>

<template>
  <Header />
  <div relative top-10>
    <RouterView />
  </div>
</template>
