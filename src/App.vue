<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="Booking Hotéis!" />
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
