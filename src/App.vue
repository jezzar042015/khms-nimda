<script setup lang="ts">
  import AppHome from './pages/AppHome.vue';
  import AppLogin from './pages/AppLogin.vue';
  import AppUserRegister from './pages/AppUserRegister.vue';
  import CongregationHistory from './pages/CongregationHistory.vue';
  import { usePageStore } from './stores/pages';

  const pages = usePageStore()
</script>

<template>
  <AppHome v-if="pages.active == 'home'" />
  <AppLogin v-if="pages.active == 'login'" />
  <AppUserRegister v-if="pages.active == 'register'" />
  <CongregationHistory v-if="pages.active == 'cong-history'" />
</template>