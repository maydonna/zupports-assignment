// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],
  
  modules: ['@nuxt/ui', 'v-gsap-nuxt'],

  vite: {
    server: {
      allowedHosts: ['zupports-assignment.test']
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://localhost:3000/api',
    }
  },
})