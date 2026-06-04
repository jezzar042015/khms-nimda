<script setup lang="ts">
  import AppHome from './pages/AppHome.vue';
  import AppLogin from './pages/AppLogin.vue';
  import AppUserRegister from './pages/AppUserRegister.vue';
  import { usePageStore } from './stores/pages';

  const pages = usePageStore()
</script>

<template>
  <AppHome v-if="pages.active == 'home'" />
  <AppLogin v-if="pages.active == 'login'" />
  <AppUserRegister v-if="pages.active == 'register'" />
</template>