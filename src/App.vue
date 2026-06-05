<script setup lang="ts">
  import AppHome from './pages/AppHome.vue';
  import AppLogin from './pages/AppLogin.vue';
  import AppUserRegister from './pages/AppUserRegister.vue';
  import CongregationHistory from './pages/CongregationHistory.vue';
  import { onMounted } from 'vue';
  import { useHistoryStore } from './stores/history.ts';
  import { usePageStore } from './stores/pages';
  import { useAuthStore } from './stores/auth.ts';

  const pages = usePageStore()
  const history = useHistoryStore()
  const auth = useAuthStore()

  onMounted(async () => {
    if (auth.token) { 
      pages.active = 'home'
      await history.pull()
    } else {
      pages.active = 'login' 
    }
  })
</script>

<template>
  <div class="mx-auto max-w-md">
    <AppHome v-if="pages.active == 'home'" />
    <AppLogin v-if="pages.active == 'login'" />
    <AppUserRegister v-if="pages.active == 'register'" />
    <CongregationHistory v-if="pages.active == 'cong-history'" />
  </div>
</template>