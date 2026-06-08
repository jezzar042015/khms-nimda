<script setup lang="ts">
  import AppHome from './pages/AppHome.vue';
  import AppLogin from './pages/AppLogin.vue';
  import AppUserRegister from './pages/AppUserRegister.vue';
  import CongregationHistory from './pages/CongregationHistory.vue';
  import { onMounted } from 'vue';
  import { useHistoryStore } from './stores/history.ts';
  import { usePageStore } from './stores/pages';
  import { useAuthStore } from './stores/auth.ts';
  import CalendarHistory from './pages/CalendarHistory.vue';
  import AppDashboard from './pages/AppDashboard.vue';
import CongregationsList from './pages/CongregationsList.vue';

  const pages = usePageStore()
  const history = useHistoryStore()
  const auth = useAuthStore()

  onMounted(async () => {
    if (auth.token) {
      pages.active = 'dashboard'
      await history.pull()
    } else {
      pages.active = 'login'
    }
  })
</script>

<template>
  <div class="mx-auto max-w-md">
    <AppDashboard v-if="pages.active == 'dashboard'" />
    <CongregationsList v-if="pages.active == 'congregations'" />
    <AppHome v-if="pages.active == 'home'" />
    <AppLogin v-if="pages.active == 'login'" />
    <AppUserRegister v-if="pages.active == 'register'" />
    <CalendarHistory v-if="pages.active == 'calendar'" />
    <CongregationHistory v-if="pages.active == 'cong-history'" />
  </div>
</template>